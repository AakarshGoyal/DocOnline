import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar, Badge, Card } from "@/components/ui";
import { Building2, GraduationCap } from "lucide-react";
import { SlotPicker } from "./slot-picker";

export default async function BookAppointmentPage({
  params,
}: PageProps<"/patient/book/[doctorId]">) {
  const { doctorId } = await params;
  const supabase = await createClient();

  const { data: doctor } = await supabase
    .from("doctors")
    .select("profile_id, degree, experience, hospital, price")
    .eq("profile_id", doctorId)
    .maybeSingle();
  if (!doctor) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", doctorId)
    .maybeSingle();

  const { data: slotRows } = await supabase
    .from("doctor_slots")
    .select("id, slot_time, status")
    .eq("doctor_id", doctorId)
    .eq("slot_date", new Date().toISOString().slice(0, 10))
    .order("slot_time");

  const slots = (slotRows ?? []).map((s) => ({
    id: s.id,
    time: formatTime(s.slot_time),
    status: s.status,
  }));

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
        Book a Slot
      </h1>

      <Card className="flex items-center gap-4">
        <Avatar name={profile?.full_name ?? "Dr"} size="lg" />
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--foreground)]">
            Dr. {profile?.full_name}
          </h2>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <GraduationCap size={14} /> {doctor.experience} yrs · {doctor.degree}
            </span>
            <span className="flex items-center gap-1">
              <Building2 size={14} /> {doctor.hospital}
            </span>
          </p>
          <div className="mt-1.5">
            <Badge tone="brand">${doctor.price} consultation</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <SlotPicker doctorId={doctorId} slots={slots} />
      </Card>
    </div>
  );
}

// Postgres gives us "09:15:00" -- show it the friendlier "09:15 AM" way.
function formatTime(time: string) {
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, "0")}:${minute} ${period}`;
}
