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
              className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                isBooked
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-600"
                  : isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : isCurrent
                      ? "border-yellow-400 bg-yellow-50 text-slate-700 dark:border-yellow-600 dark:bg-yellow-950 dark:text-slate-200"
                      : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-400">
        The yellow slot is your current time. Pick a new one, then confirm.
      </p>

      <ErrorText>{error}</ErrorText>

      <PrimaryButton type="submit" className="w-full" disabled={!selected || isPending}>
        {isPending ? "Updating…" : "Update"}
      </PrimaryButton>
    </form>
  );
}
