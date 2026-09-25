"use client";

import { useState, useTransition } from "react";
import {
  Card,
  ErrorText,
  Field,
  PrimaryButton,
  Select,
  TextInput,
} from "@/components/ui";
import { completeProfile } from "./actions";

type Specialty = { id: string; name: string };

export function ProfileForm({
  defaultRole,
  specialties,
}: {
  defaultRole: "patient" | "doctor";
  specialties: Specialty[];
}) {
  const [role, setRole] = useState(defaultRole);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await completeProfile(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <Card className="w-full max-w-md space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          Just a few more details
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We use this to set up your {role} account.
        </p>
      </div>

      <div className="flex gap-2 rounded-lg bg-slate-100 p-1 text-sm dark:bg-slate-800">
        {(["patient", "doctor"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-1.5 capitalize transition ${
              role === r
                ? "bg-white font-medium text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <form
        action={(formData) => startTransition(() => handleSubmit(formData))}
        className="space-y-4"
      >
        <input type="hidden" name="role" value={role} />

        <Field label="Full name">
          <TextInput name="fullName" required />
        </Field>
        <Field label="Phone number">
          <TextInput name="phone" type="tel" required />
        </Field>

        {role === "patient" ? (
          <Field label="Age">
            <TextInput name="age" type="number" min={1} max={120} required />
          </Field>
        ) : (
          <>
            <Field label="Specialty">
              <Select name="specialtyId" required defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Degree(s), e.g. MBBS, MD">
              <TextInput name="degree" required />
            </Field>
            <Field label="Years of experience">
              <TextInput name="experience" type="number" min={0} max={70} required />
            </Field>
            <Field label="Hospital / clinic">
              <TextInput name="hospital" required />
            </Field>
            <Field label="Consultation price ($)">
              <TextInput name="price" type="number" min={0} step="0.01" required />
            </Field>
          </>
        )}

        <ErrorText>{error}</ErrorText>

        <PrimaryButton type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving…" : "Finish setting up"}
        </PrimaryButton>
      </form>
    </Card>
  );
}
