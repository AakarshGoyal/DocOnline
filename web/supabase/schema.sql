-- DocOnline database schema for Supabase (Postgres)
--
-- HOW TO USE: open your Supabase project -> SQL Editor -> New query,
-- paste this whole file, and click "Run". It is safe to re-run
-- (statements use IF NOT EXISTS / OR REPLACE where possible).

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. PROFILES
-- One row per logged-in person (patient OR doctor), keyed by the same
-- id Supabase Auth already generated for them. This is where "who is
-- this person" lives, separate from "how do they log in" (Supabase
-- Auth handles passwords/Google itself, so we never see or store a
-- password here).
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('patient', 'doctor')),
  full_name text not null,
  phone text,
  age int,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. SPECIALTIES (fixed list, same 5 as the original app)
-- ---------------------------------------------------------------------
create table if not exists public.specialties (
  id text primary key, -- short slug, e.g. 'cardiology'
  name text not null,
  description text not null,
  symptoms text not null,
  icon text not null -- an emoji, used instead of custom art
);

insert into public.specialties (id, name, description, symptoms, icon) values
  ('cold-cough-fever', 'Cold, Cough and Fever', 'For common health concerns', 'Fever, Eye Infection, Stomach Ache, Headache', '🤒'),
  ('covid-consultation', 'Covid Consultation', 'Treatment of COVID-19', 'Cough, Fever and Breathlessness', '🦠'),
  ('cardiology', 'Cardiology', 'For Heart and Blood pressure problems', 'Chest pain, Heart pain, Cholesterol', '❤️'),
  ('child-development', 'Child Development', 'For development disorder in children', 'Learning disability, Development delay', '🧒'),
  ('ent', 'ENT', 'ENT specialists for Ear, Nose and Throat', 'Earache, Bad breath, Swollen neck, Vertigo', '👂')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3. DOCTORS (extra details for a profile whose role = 'doctor')
-- ---------------------------------------------------------------------
create table if not exists public.doctors (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  specialty_id text not null references public.specialties (id),
  degree text not null,
  experience int not null,
  hospital text not null,
  price numeric(10, 2) not null
);

-- ---------------------------------------------------------------------
-- 4. DOCTOR SLOTS (today's bookable 15-minute slots for a doctor)
-- Matches the original app's rule: patients can only book a slot for
-- today, and doctors set today's hours the day before / that morning.
-- ---------------------------------------------------------------------
create table if not exists public.doctor_slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors (profile_id) on delete cascade,
  slot_date date not null default current_date,
  slot_time time not null,
  status text not null default 'available' check (status in ('available', 'booked')),
  unique (doctor_id, slot_date, slot_time)
);

create index if not exists doctor_slots_doctor_date_idx
  on public.doctor_slots (doctor_id, slot_date);

-- ---------------------------------------------------------------------
-- 5. APPOINTMENTS (one confirmed booking = one row)
-- ---------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles (id) on delete cascade,
  doctor_id uuid not null references public.doctors (profile_id) on delete cascade,
  slot_id uuid not null unique references public.doctor_slots (id) on delete cascade,
  remarks text not null default '',
  price numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

-- =======================================================================
-- ROW LEVEL SECURITY
-- By default Postgres/Supabase lets nobody in until we say so. These
-- policies say: everyone logged in can *read* doctors/specialties/slots
-- (needed to browse and book), but nobody can *write* to slots or
-- appointments directly -- all writes go through the functions below,
-- which check things properly and run as a single atomic transaction.
-- =======================================================================
alter table public.profiles enable row level security;
alter table public.specialties enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_slots enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "profiles are readable by any logged-in user" on public.profiles;
create policy "profiles are readable by any logged-in user"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "a user can create only their own profile" on public.profiles;
create policy "a user can create only their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "a user can update only their own profile" on public.profiles;
create policy "a user can update only their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

drop policy if exists "specialties are readable by any logged-in user" on public.specialties;
create policy "specialties are readable by any logged-in user"
  on public.specialties for select
  to authenticated
  using (true);

drop policy if exists "doctors are readable by any logged-in user" on public.doctors;
create policy "doctors are readable by any logged-in user"
  on public.doctors for select
  to authenticated
  using (true);

drop policy if exists "a doctor can create only their own doctor row" on public.doctors;
create policy "a doctor can create only their own doctor row"
  on public.doctors for insert
  to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "a doctor can update only their own doctor row" on public.doctors;
create policy "a doctor can update only their own doctor row"
  on public.doctors for update
  to authenticated
  using (profile_id = auth.uid());

drop policy if exists "slots are readable by any logged-in user" on public.doctor_slots;
create policy "slots are readable by any logged-in user"
  on public.doctor_slots for select
  to authenticated
  using (true);
-- No insert/update/delete policy on doctor_slots on purpose: all writes
-- must go through the SECURITY DEFINER functions below.

drop policy if exists "an appointment is readable by its patient or doctor" on public.appointments;
create policy "an appointment is readable by its patient or doctor"
  on public.appointments for select
  to authenticated
  using (patient_id = auth.uid() or doctor_id = auth.uid());
-- No insert/update/delete policy on appointments either, same reason.

-- =======================================================================
-- FUNCTIONS
-- These run with elevated ("security definer") rights so they can write
-- to doctor_slots/appointments despite the read-only policies above --
-- but each one re-checks who's calling it (auth.uid()) before doing
-- anything, so a patient still can't touch another patient's booking.
-- =======================================================================

-- Doctor sets today's working hours -> we (re)generate empty 15-minute
-- slots between start and end time. Existing *available* slots for
-- today are cleared first; slots that are already *booked* are left
-- alone so a doctor can't accidentally erase a patient's booking by
-- changing their hours.
create or replace function public.generate_today_slots(p_start time, p_end time)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_doctor_id uuid := auth.uid();
  v_time time;
begin
  if v_doctor_id is null then
    raise exception 'Not logged in';
  end if;

  if not exists (select 1 from public.doctors where profile_id = v_doctor_id) then
    raise exception 'Only a doctor can set working hours';
  end if;

  if p_end <= p_start then
    raise exception 'End time must be after start time';
  end if;

  delete from public.doctor_slots
   where doctor_id = v_doctor_id
     and slot_date = current_date
     and status = 'available';

  v_time := p_start;
  while v_time < p_end loop
    insert into public.doctor_slots (doctor_id, slot_date, slot_time, status)
    values (v_doctor_id, current_date, v_time, 'available')
    on conflict (doctor_id, slot_date, slot_time) do nothing;

    v_time := v_time + interval '15 minutes';
  end loop;
end;
$$;

-- Patient books a slot. This is the fix for the original app's known
-- bug: two patients tapping the same slot at the same moment. "for
-- update" locks that one row until this transaction finishes, so the
-- second caller simply sees status <> 'available' and gets a clean
-- error instead of double-booking.
create or replace function public.book_slot(p_slot_id uuid, p_remarks text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_patient_id uuid := auth.uid();
  v_slot public.doctor_slots%rowtype;
  v_price numeric(10, 2);
  v_appointment_id uuid;
begin
  if v_patient_id is null then
    raise exception 'Not logged in';
  end if;

  select * into v_slot from public.doctor_slots where id = p_slot_id for update;

  if not found then
    raise exception 'That slot no longer exists';
  end if;
  if v_slot.status <> 'available' then
    raise exception 'Sorry, that slot was just taken. Please pick another.';
  end if;

  select price into v_price from public.doctors where profile_id = v_slot.doctor_id;

  update public.doctor_slots set status = 'booked' where id = p_slot_id;

  insert into public.appointments (patient_id, doctor_id, slot_id, remarks, price)
  values (v_patient_id, v_slot.doctor_id, p_slot_id, coalesce(p_remarks, ''), v_price)
  returning id into v_appointment_id;

  return v_appointment_id;
end;
$$;

-- Patient cancels a confirmed appointment. Frees the slot back up.
create or replace function public.cancel_appointment(p_appointment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller uuid := auth.uid();
  v_appt public.appointments%rowtype;
begin
  select * into v_appt from public.appointments where id = p_appointment_id;

  if not found then
    raise exception 'Appointment not found';
  end if;
  if v_appt.patient_id <> v_caller and v_appt.doctor_id <> v_caller then
    raise exception 'Not your appointment';
  end if;

  update public.doctor_slots set status = 'available' where id = v_appt.slot_id;
  delete from public.appointments where id = p_appointment_id;
end;
$$;

-- Patient reschedules: move an existing appointment to a different,
-- still-available slot with the same doctor. Old slot re-opens, new
-- slot is locked the same safe way as book_slot.
create or replace function public.reschedule_appointment(p_appointment_id uuid, p_new_slot_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_patient_id uuid := auth.uid();
  v_appt public.appointments%rowtype;
  v_new_slot public.doctor_slots%rowtype;
begin
  select * into v_appt from public.appointments where id = p_appointment_id;
  if not found or v_appt.patient_id <> v_patient_id then
    raise exception 'Appointment not found';
  end if;

  select * into v_new_slot from public.doctor_slots where id = p_new_slot_id for update;
  if not found then
    raise exception 'That slot no longer exists';
  end if;
  if v_new_slot.doctor_id <> v_appt.doctor_id then
    raise exception 'That slot belongs to a different doctor';
  end if;
  if v_new_slot.status <> 'available' then
    raise exception 'Sorry, that slot was just taken. Please pick another.';
  end if;

  update public.doctor_slots set status = 'available' where id = v_appt.slot_id;
  update public.doctor_slots set status = 'booked' where id = p_new_slot_id;
  update public.appointments set slot_id = p_new_slot_id where id = p_appointment_id;
end;
$$;
