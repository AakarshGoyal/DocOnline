import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?role=doctor");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/complete-profile?role=doctor");
  if (profile.role !== "doctor") redirect("/patient");

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)]">
      <Nav
        title="Doctor"
        name={`Dr. ${profile.full_name}`}
        links={[
          { href: "/doctor", label: "Home" },
          { href: "/doctor/schedule", label: "My Schedule" },
          { href: "/doctor/appointments", label: "My Appointments" },
          { href: "/doctor/profile", label: "Profile" },
        ]}
      />
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        {children}
      </div>
    </div>
  );
}
