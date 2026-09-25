import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, PrimaryButton } from "@/components/ui";

export default async function DoctorsForSpecialtyPage({
  params,
}: PageProps<"/patient/specialists/[specialtyId]">) {
  const { specialtyId } = await params;
  const supabase = await createClient();

  const { data: specialty } = await supabase
    .from("specialties")
    .select("name")
    .eq("id", specialtyId)
    .maybeSingle();

  const { data: doctorRows } = await supabase
    .from("doctors")
    .select("profile_id, degree, experience, hospital, price")
    .eq("specialty_id", specialtyId);

  const profileIds = doctorRows?.map((d) => d.profile_id) ?? [];
  const { data: profileRows } = profileIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", profileIds)
    : { data: [] };
  const nameById = new Map((profileRows ?? []).map((p) => [p.id, p.full_name]));

  const doctors = (doctorRows ?? []).map((d) => ({
    ...d,
    fullName: nameById.get(d.profile_id) ?? "Unknown",
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        {specialty?.name ?? "Doctors"}
      </h1>

      {!doctors.length && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No doctors have registered under this specialty yet.
        </p>
      )}

      <div className="space-y-3">
        {doctors.map((doc) => (
          <Card key={doc.profile_id} className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-medium text-slate-900 dark:text-white">
                Dr. {doc.fullName}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {doc.experience} yrs exp. · {doc.degree}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {doc.hospital}
              </p>
              <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                ${doc.price}
              </p>
            </div>
            <Link href={`/patient/book/${doc.profile_id}`}>
              <PrimaryButton type="button">Book Appointment</PrimaryButton>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
