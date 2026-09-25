import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, DangerButton, SecondaryButton } from "@/components/ui";
import { cancelAppointment } from "./actions";

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, doctor_id, slot_id, remarks, price")
    .eq("patient_id", user!.id)
    .order("created_at", { ascending: false });

  const doctorIds = [...new Set((appointments ?? []).map((a) => a.doctor_id))];
  const slotIds = (appointments ?? []).map((a) => a.slot_id);

  const [{ data: profileRows }, { data: slotRows }] = await Promise.all([
    doctorIds.length
      ? supabase.from("profiles").select("id, full_name").in("id", doctorIds)
      : Promise.resolve({ data: [] }),
    slotIds.length
      ? supabase.from("doctor_slots").select("id, slot_time").in("id", slotIds)
      : Promise.resolve({ data: [] }),
  ]);

  const nameById = new Map((profileRows ?? []).map((p) => [p.id, p.full_name]));
  const timeById = new Map((slotRows ?? []).map((s) => [s.id, s.slot_time]));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Active Appointments
      </h1>

      {!appointments?.length && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You don&apos;t have any appointments booked yet.
        </p>
      )}

      <div className="space-y-3">
        {appointments?.map((appt) => (
          <Card key={appt.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-medium text-slate-900 dark:text-white">
                  Dr. {nameById.get(appt.doctor_id) ?? "Unknown"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Today, {formatTime(timeById.get(appt.slot_id) ?? "")}
                </p>
                {appt.remarks && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Remarks: {appt.remarks}
                  </p>
                )}
              </div>
              <p className="font-medium text-slate-700 dark:text-slate-200">
                ${appt.price}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/patient/appointments/${appt.id}/reschedule`}>
                <SecondaryButton type="button">Reschedule</SecondaryButton>
              </Link>
              <form action={cancelAppointment}>
                <input type="hidden" name="appointmentId" value={appt.id} />
                <DangerButton type="submit">Cancel</DangerButton>
              </form>
            </div>
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
