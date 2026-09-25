import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile) redirect(profile.role === "doctor" ? "/doctor" : "/patient");
    redirect("/complete-profile");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-slate-50 px-6 py-16 text-center dark:bg-slate-950">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          DocOnline
        </h1>
        <p className="max-w-md text-slate-500 dark:text-slate-400">
          Book an appointment with a specialist, or manage your patients as a
          doctor.
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link
          href="/login?role=patient"
          className="rounded-xl bg-blue-600 px-6 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          Continue as Patient
        </Link>
        <Link
          href="/login?role=doctor"
          className="rounded-xl border border-slate-300 bg-white px-6 py-4 text-lg font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Continue as Doctor
        </Link>
      </div>
    </main>
  );
}
