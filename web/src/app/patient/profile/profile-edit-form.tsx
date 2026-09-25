"use client";

import { useState, useTransition } from "react";
import { ErrorText, Field, PrimaryButton, SuccessText, TextInput } from "@/components/ui";
import { updatePatientProfile } from "./actions";

export function PatientProfileEditForm({
  fullName,
  phone,
  age,
}: {
  fullName: string;
  phone: string;
  age: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    const result = await updatePatientProfile(formData);
    if (result?.error) setError(result.error);
    if (result?.success) setSaved(true);
  }

  return (
    <form
      action={(formData) => startTransition(() => handleSubmit(formData))}
      className="space-y-4"
    >
      <Field label="Full name">
        <TextInput name="fullName" defaultValue={fullName} required />
      </Field>
      <Field label="Phone number">
        <TextInput name="phone" type="tel" defaultValue={phone} required />
      </Field>
      <Field label="Age">
        <TextInput name="age" type="number" defaultValue={age} required />
      </Field>

      <ErrorText>{error}</ErrorText>
      {saved && <SuccessText>Updated successfully.</SuccessText>}

      <PrimaryButton type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Update"}
      </PrimaryButton>
    </form>
  );
}
