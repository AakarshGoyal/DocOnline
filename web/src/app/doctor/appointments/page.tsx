import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export default async function DoctorAppointmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, patient_id, slot_id, remarks")
    .eq("doctor_id", user!.id);

  const patientIds = [...new Set((appointments ?? []).map((a) => a.patient_id))];
  const slotIds = (appointments ?? []).map((a) => a.slot_id);

  const [{ data: profileRows }, { data: slotRows }] = await Promise.all([
    patientIds.length
      ? supabase.from("profiles").select("id, full_name").in("id", patientIds)
      : Promise.resolve({ data: [] }),
    slotIds.length
      ? supabase.from("doctor_slots").select("id, slot_time").in("id", slotIds)
      : Promise.resolve({ data: [] }),
  ]);

  const nameById = new Map((profileRows ?? []).map((p) => [p.id, p.full_name]));
  const timeById = new Map((slotRows ?? []).map((s) => [s.id, s.slot_time]));

  const sorted = [...(appointments ?? [])].sort((a, b) =>
    (timeById.get(a.slot_id) ?? "").localeCompare(timeById.get(b.slot_id) ?? ""),
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        My Appointments
      </h1>

      {!sorted.length && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No patients have booked with you today yet.
        </p>
      )}

      <div className="space-y-3">
        {sorted.map((appt) => (
          <Card key={appt.id}>
            <h2 className="font-medium text-slate-900 dark:text-white">
              {nameById.get(appt.patient_id) ?? "Unknown patient"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Today, {formatTime(timeById.get(appt.slot_id) ?? "")}
            </p>
            {appt.remarks && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Remarks: {appt.remarks}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function formatTime(time: string) {
  if (!time) return "";
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, "0")}:${minute} ${period}`;
}
