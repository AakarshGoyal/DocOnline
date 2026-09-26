import { createClient } from "@/lib/supabase/server";
import { Badge, Card } from "@/components/ui";
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
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
        My Schedule
      </h1>
      <Card>
        <ScheduleForm />
      </Card>

      {!!slotRows?.length && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-heading)] font-bold text-[var(--foreground)]">
              Today&apos;s Slots
            </h2>
            <Badge tone="warning">
              {slotRows.filter((s) => s.status === "booked").length} booked
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slotRows.map((s) => (
              <div
                key={s.slot_time}
                className={`rounded-xl border px-2 py-2.5 text-center text-sm font-semibold ${
                  s.status === "booked"
                    ? "border-[var(--warning)]/50 bg-[var(--warning-soft)] text-[var(--foreground)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                }`}
              >
                {formatTime(s.slot_time)}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Highlighted = already booked by a patient.
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
