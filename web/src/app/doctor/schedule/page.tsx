import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { ScheduleForm } from "./schedule-form";

export default async function SchedulePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: slotRows } = await supabase
    .from("doctor_slots")
    .select("slot_time, status")
    .eq("doctor_id", user!.id)
    .eq("slot_date", new Date().toISOString().slice(0, 10))
    .order("slot_time");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        My Schedule
      </h1>
      <Card>
        <ScheduleForm />
      </Card>

      {!!slotRows?.length && (
        <Card>
          <h2 className="mb-3 font-medium text-slate-900 dark:text-white">
            Today&apos;s Slots
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slotRows.map((s) => (
              <div
                key={s.slot_time}
                className={`rounded-lg border px-2 py-2 text-center text-sm font-medium ${
                  s.status === "booked"
                    ? "border-yellow-400 bg-yellow-50 text-slate-700 dark:border-yellow-600 dark:bg-yellow-950 dark:text-slate-200"
                    : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                {formatTime(s.slot_time)}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Yellow = already booked by a patient.
          </p>
        </Card>
      )}
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
