import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Stethoscope, UserRound, CalendarClock, ShieldCheck } from "lucide-react";

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
    <main className="bg-glow flex flex-1 flex-col items-center justify-center gap-14 px-6 py-20 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/30">
          <Stethoscope size={26} strokeWidth={2.25} />
        </div>
        <h1 className="text-4xl font-extrabold text-[var(--foreground)] sm:text-5xl">
          DocOnline
        </h1>
        <p className="mx-auto max-w-md text-[var(--text-muted)]">
          Book an appointment with a specialist in minutes, or manage your
          patients and schedule as a doctor.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <Link
          href="/login?role=patient"
          className="group flex flex-col items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-lg"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-strong)]">
            <UserRound size={20} />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--foreground)]">
              I&apos;m a Patient
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Find a specialist and book today&apos;s appointment.
            </p>
          </div>
          <span className="text-sm font-semibold text-[var(--brand-strong)] transition group-hover:translate-x-0.5">
            Continue as Patient →
          </span>
        </Link>

        <Link
          href="/login?role=doctor"
          className="group flex flex-col items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-lg"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <Stethoscope size={20} />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--foreground)]">
              I&apos;m a Doctor
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Set your hours and manage your appointments.
            </p>
          </div>
          <span className="text-sm font-semibold text-[var(--accent)] transition group-hover:translate-x-0.5">
            Continue as Doctor →
          </span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--text-muted)]">
        <span className="flex items-center gap-2">
          <CalendarClock size={16} className="text-[var(--brand)]" />
          Same-day booking
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[var(--brand)]" />
          Secure sign-in
        </span>
      </div>
    </main>
  );
}
