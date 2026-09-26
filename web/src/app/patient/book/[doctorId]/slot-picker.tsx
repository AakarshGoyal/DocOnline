"use client";

import { useState, useTransition } from "react";
import { ErrorText, PrimaryButton, TextInput } from "@/components/ui";
import { startCheckout } from "./actions";

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
    const result = await startCheckout(formData);
    if (result?.error) setError(result.error);
  }

  if (!slots.length) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
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
        <h3 className="mb-2 font-[family-name:var(--font-heading)] font-bold text-[var(--foreground)]">
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
                className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${
                  isBooked
                    ? "cursor-not-allowed border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] line-through decoration-1"
                    : isSelected
                      ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/25"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-[var(--foreground)]">
          Remarks (optional)
        </span>
        <TextInput name="remarks" placeholder="What would you like to discuss?" />
      </label>

      <ErrorText>{error}</ErrorText>

      <PrimaryButton type="submit" className="w-full" disabled={!selected || isPending}>
        {isPending ? "Redirecting to payment…" : "Continue to Payment"}
      </PrimaryButton>
      <p className="text-center text-xs text-[var(--text-muted)]">
        You&apos;ll be taken to Stripe&apos;s secure checkout (test mode — use
        card number 4242 4242 4242 4242, any future date, any CVC).
      </p>
    </form>
  );
}
