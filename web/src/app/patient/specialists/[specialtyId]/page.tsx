import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar, Badge, Card, PrimaryButton } from "@/components/ui";
import { Building2, GraduationCap } from "lucide-react";

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
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
        {specialty?.name ?? "Doctors"}
      </h1>

      {!doctors.length && (
        <Card className="text-sm text-[var(--text-muted)]">
          No doctors have registered under this specialty yet.
        </Card>
      )}

      <div className="space-y-3">
        {doctors.map((doc) => (
          <Card
            key={doc.profile_id}
            className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <Avatar name={doc.fullName} size="md" />
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[var(--foreground)]">
                  Dr. {doc.fullName}
                </h2>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={14} /> {doc.experience} yrs · {doc.degree}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 size={14} /> {doc.hospital}
                  </span>
                </p>
                <div className="mt-1.5">
                  <Badge tone="brand">${doc.price} consultation</Badge>
                </div>
              </div>
            </div>
            <Link href={`/patient/book/${doc.profile_id}`} className="w-full sm:w-auto">
              <PrimaryButton type="button" className="w-full sm:w-auto">
                Book Appointment
              </PrimaryButton>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
