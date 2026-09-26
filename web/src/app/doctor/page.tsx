import Link from "next/link";
import { CalendarClock, Users, ChevronRight } from "lucide-react";
import { Card, IconCircle } from "@/components/ui";

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
        Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/doctor/schedule">
          <Card className="group h-full transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-md">
            <IconCircle tone="brand" size="lg">
              <CalendarClock size={24} />
            </IconCircle>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--foreground)]">
              My Schedule
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Set the hours you&apos;re available today.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-strong)] transition group-hover:gap-1.5">
              Set hours <ChevronRight size={15} />
            </span>
          </Card>
        </Link>
        <Link href="/doctor/appointments">
          <Card className="group h-full transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md">
            <IconCircle tone="accent" size="lg">
              <Users size={24} />
            </IconCircle>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--foreground)]">
              My Appointments
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              See who&apos;s booked into your slots today.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition group-hover:gap-1.5">
              View <ChevronRight size={15} />
            </span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
