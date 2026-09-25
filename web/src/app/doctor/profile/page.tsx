import { createClient } from "@/lib/supabase/server";
import { Avatar, Card } from "@/components/ui";
import { DoctorProfileEditForm } from "./profile-edit-form";

export default async function DoctorProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: doctor }, { data: specialties }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user!.id)
        .maybeSingle(),
      supabase
        .from("doctors")
        .select("specialty_id, degree, experience, hospital, price")
        .eq("profile_id", user!.id)
        .maybeSingle(),
      supabase.from("specialties").select("id, name").order("name"),
    ]);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-4">
        <Avatar name={profile?.full_name ?? "?"} size="lg" />
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
            Dr. {profile?.full_name}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">Doctor profile</p>
        </div>
      </div>
      <Card>
        <DoctorProfileEditForm
          doctor={{
            fullName: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
            specialtyId: doctor?.specialty_id ?? "",
            degree: doctor?.degree ?? "",
            experience: doctor?.experience ?? 0,
            hospital: doctor?.hospital ?? "",
            price: doctor?.price ?? 0,
          }}
          specialties={specialties ?? []}
        />
      </Card>
    </div>
  );
}
