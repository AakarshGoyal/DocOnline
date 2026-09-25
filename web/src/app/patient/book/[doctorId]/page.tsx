import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
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
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Book a Slot
      </h1>

      <Card className="space-y-1">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white">
          Dr. {profile?.full_name}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {doctor.experience} yrs exp. · {doctor.degree}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {doctor.hospital}
        </p>
        <p className="font-medium text-slate-700 dark:text-slate-200">
          ${doctor.price}
        </p>
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
