import Link from "next/link";
import { Stethoscope, CalendarClock, ChevronRight } from "lucide-react";
import { Card, IconCircle } from "@/components/ui";

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
        Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/patient/specialists">
          <Card className="group h-full transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-md">
            <IconCircle tone="brand" size="lg">
              <Stethoscope size={24} />
            </IconCircle>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--foreground)]">
              Book Doctor Appointment
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Browse specialists and pick a time slot for today.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-strong)] transition group-hover:gap-1.5">
              Browse <ChevronRight size={15} />
            </span>
          </Card>
        </Link>
        <Link href="/patient/appointments">
          <Card className="group h-full transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md">
            <IconCircle tone="accent" size="lg">
              <CalendarClock size={24} />
            </IconCircle>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--foreground)]">
              Active Appointments
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              View, reschedule, or cancel your bookings.
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
