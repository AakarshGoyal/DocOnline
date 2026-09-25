import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function CompleteProfilePage({
  searchParams,
}: PageProps<"/complete-profile">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Already finished this step before? Send them on to their dashboard
  // instead of asking again.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile) redirect(profile.role === "doctor" ? "/doctor" : "/patient");

  const { data: specialties } = await supabase
    .from("specialties")
    .select("id, name")
    .order("name");

  const params = await searchParams;
  const defaultRole = params.role === "doctor" ? "doctor" : "patient";

  return (
    <main className="bg-glow flex flex-1 items-center justify-center p-6">
      <ProfileForm defaultRole={defaultRole} specialties={specialties ?? []} />
    </main>
  );
}
