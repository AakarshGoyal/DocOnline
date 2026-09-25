"use client";

import { useState, useTransition } from "react";
import { ErrorText, Field, PrimaryButton, SuccessText, TextInput } from "@/components/ui";
import { setTodaysHours } from "./actions";

export function ScheduleForm() {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    const result = await setTodaysHours(formData);
    if (result?.error) setError(result.error);
    if (result?.success) setSaved(true);
  }

  return (
    <form
      action={(formData) => startTransition(() => handleSubmit(formData))}
      className="space-y-4"
    >
      <p className="text-sm text-[var(--text-muted)]">
        You&apos;ll be available today, in 15-minute slots, between:
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="From">
          <TextInput type="time" name="start" required defaultValue="09:00" />
        </Field>
        <Field label="To">
          <TextInput type="time" name="end" required defaultValue="17:00" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      {saved && <SuccessText>Updated — your slots for today are ready.</SuccessText>}

      <PrimaryButton type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving…" : "Confirm"}
      </PrimaryButton>
      <p className="text-xs text-[var(--text-muted)]">
        Note: slots a patient has already booked today are kept — this only
        adds/removes the open ones.
      </p>
    </form>
  );
}
