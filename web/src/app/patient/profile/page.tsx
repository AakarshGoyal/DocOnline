import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { PatientProfileEditForm } from "./profile-edit-form";

export default async function PatientProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, age")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Update Profile
      </h1>
      <Card>
        <PatientProfileEditForm
          fullName={profile?.full_name ?? ""}
          phone={profile?.phone ?? ""}
          age={profile?.age ?? 0}
        />
      </Card>
    </div>
  );
}
