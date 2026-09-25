import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { ReschedulePicker } from "./reschedule-picker";

export default async function ReschedulePage({
  params,
}: PageProps<"/patient/appointments/[id]/reschedule">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: appt } = await supabase
    .from("appointments")
    .select("id, doctor_id, slot_id")
    .eq("id", id)
    .maybeSingle();
  if (!appt) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", appt.doctor_id)
    .maybeSingle();

  const { data: slotRows } = await supabase
    .from("doctor_slots")
    .select("id, slot_time, status")
    .eq("doctor_id", appt.doctor_id)
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
        Reschedule with Dr. {profile?.full_name}
      </h1>
      <Card>
        <ReschedulePicker
          appointmentId={appt.id}
          currentSlotId={appt.slot_id}
          slots={slots}
        />
      </Card>
    </div>
  );
}

function formatTime(time: string) {
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, "0")}:${minute} ${period}`;
}
