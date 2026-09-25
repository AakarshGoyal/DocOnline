"use client";

import { useState, useTransition } from "react";
import { ErrorText, Field, PrimaryButton, Select, SuccessText, TextInput } from "@/components/ui";
import { updateDoctorProfile } from "./actions";

type Specialty = { id: string; name: string };
type Doctor = {
  fullName: string;
  phone: string;
  specialtyId: string;
  degree: string;
  experience: number;
  hospital: string;
  price: number;
};

export function DoctorProfileEditForm({
  doctor,
  specialties,
}: {
  doctor: Doctor;
  specialties: Specialty[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    const result = await updateDoctorProfile(formData);
    if (result?.error) setError(result.error);
    if (result?.success) setSaved(true);
  }

  return (
    <form
      action={(formData) => startTransition(() => handleSubmit(formData))}
      className="space-y-4"
    >
      <Field label="Full name">
        <TextInput name="fullName" defaultValue={doctor.fullName} required />
      </Field>
      <Field label="Phone number">
        <TextInput name="phone" type="tel" defaultValue={doctor.phone} required />
      </Field>
      <Field label="Specialty">
        <Select name="specialtyId" defaultValue={doctor.specialtyId} required>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Degree(s)">
        <TextInput name="degree" defaultValue={doctor.degree} required />
      </Field>
      <Field label="Years of experience">
        <TextInput
          name="experience"
          type="number"
          defaultValue={doctor.experience}
          required
        />
      </Field>
      <Field label="Hospital / clinic">
        <TextInput name="hospital" defaultValue={doctor.hospital} required />
      </Field>
      <Field label="Consultation price ($)">
        <TextInput name="price" type="number" step="0.01" defaultValue={doctor.price} required />
      </Field>

      <ErrorText>{error}</ErrorText>
      {saved && <SuccessText>Updated successfully.</SuccessText>}

      <PrimaryButton type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Update"}
      </PrimaryButton>
    </form>
  );
}
