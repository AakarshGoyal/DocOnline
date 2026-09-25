"use client";

import { useState, useTransition } from "react";
import { ErrorText, PrimaryButton, TextInput } from "@/components/ui";
import { bookSlot } from "./actions";

type Slot = { id: string; time: string; status: "available" | "booked" };

export function SlotPicker({
  doctorId,
  slots,
}: {
  doctorId: string;
  slots: Slot[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await bookSlot(formData);
    if (result?.error) setError(result.error);
  }

  if (!slots.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        This doctor hasn&apos;t opened any slots for today yet. Please check
        back later.
      </p>
    );
  }

  return (
    <form
      action={(formData) => startTransition(() => handleSubmit(formData))}
      className="space-y-4"
    >
      <input type="hidden" name="doctorId" value={doctorId} />
      <input type="hidden" name="slotId" value={selected ?? ""} />

      <div>
        <h3 className="mb-2 font-medium text-slate-900 dark:text-white">
          Today&apos;s Slots
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot) => {
            const isBooked = slot.status === "booked";
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
                      : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          Remarks (optional)
        </span>
        <TextInput name="remarks" placeholder="What would you like to discuss?" />
      </label>

      <ErrorText>{error}</ErrorText>

      <PrimaryButton type="submit" className="w-full" disabled={!selected || isPending}>
        {isPending ? "Booking…" : "Complete Payment"}
      </PrimaryButton>
      <p className="text-center text-xs text-slate-400">
        (No real payment is taken — this app uses a mock checkout.)
      </p>
    </form>
  );
}
