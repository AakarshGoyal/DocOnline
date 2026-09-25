import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?role=patient");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/complete-profile?role=patient");
  if (profile.role !== "patient") redirect("/doctor");

  return (
    <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <Nav
        title="Patient"
        name={profile.full_name}
        links={[
          { href: "/patient", label: "Home" },
          { href: "/patient/appointments", label: "My Appointments" },
          { href: "/patient/profile", label: "Profile" },
        ]}
      />
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        {children}
      </div>
    </div>
  );
}
