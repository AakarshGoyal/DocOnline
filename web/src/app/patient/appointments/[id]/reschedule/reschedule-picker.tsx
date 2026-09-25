"use client";

import { useState, useTransition } from "react";
import { ErrorText, PrimaryButton } from "@/components/ui";
import { rescheduleAppointment } from "./actions";

type Slot = { id: string; time: string; status: "available" | "booked" };

export function ReschedulePicker({
  appointmentId,
  currentSlotId,
  slots,
}: {
  appointmentId: string;
  currentSlotId: string;
  slots: Slot[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await rescheduleAppointment(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form
      action={(formData) => startTransition(() => handleSubmit(formData))}
      className="space-y-4"
    >
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <input type="hidden" name="slotId" value={selected ?? ""} />

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => {
          const isCurrent = slot.id === currentSlotId;
          const isBooked = slot.status === "booked" && !isCurrent;
          const isSelected = selected === slot.id;
          return (
            <button
              type="button"
              key={slot.id}
              disabled={isBooked}
              onClick={() => setSelected(slot.id)}
              className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${
                isBooked
                  ? "cursor-not-allowed border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] line-through decoration-1"
                  : isSelected
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/25"
                    : isCurrent
                      ? "border-[var(--warning)]/50 bg-[var(--warning-soft)] text-[var(--foreground)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        The highlighted slot is your current time. Pick a new one, then confirm.
      </p>

      <ErrorText>{error}</ErrorText>

      <PrimaryButton type="submit" className="w-full" disabled={!selected || isPending}>
        {isPending ? "Updating…" : "Update"}
      </PrimaryButton>
    </form>
  );
}
