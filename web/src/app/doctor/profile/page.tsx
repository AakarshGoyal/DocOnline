import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
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
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Update Profile
      </h1>
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
