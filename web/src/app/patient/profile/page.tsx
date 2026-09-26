import { createClient } from "@/lib/supabase/server";
import { Avatar, Card } from "@/components/ui";
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
      <div className="flex items-center gap-4">
        <Avatar name={profile?.full_name ?? "?"} size="lg" />
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
            {profile?.full_name}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">Patient profile</p>
        </div>
      </div>
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
