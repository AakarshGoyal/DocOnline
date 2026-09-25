"use client";

import { useState, useTransition } from "react";
import { ErrorText, Field, PrimaryButton, TextInput } from "@/components/ui";
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
      <p className="text-sm text-slate-500 dark:text-slate-400">
        You&apos;ll be available today, in 15-minute slots, between:
      </p>
      <Field label="From">
        <TextInput type="time" name="start" required defaultValue="09:00" />
      </Field>
      <Field label="To">
        <TextInput type="time" name="end" required defaultValue="17:00" />
      </Field>

      <ErrorText>{error}</ErrorText>
      {saved && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          Updated — your slots for today are ready.
        </p>
      )}

      <PrimaryButton type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving…" : "Confirm"}
      </PrimaryButton>
      <p className="text-xs text-slate-400">
        Note: slots a patient has already booked today are kept — this only
        adds/removes the open ones.
      </p>
    </form>
  );
}
