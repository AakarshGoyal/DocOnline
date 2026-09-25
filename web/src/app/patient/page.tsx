import Link from "next/link";
import { Card } from "@/components/ui";

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/patient/specialists">
          <Card className="h-full transition hover:border-blue-400 hover:shadow-md">
            <div className="text-3xl">🩺</div>
            <h2 className="mt-3 text-lg font-medium text-slate-900 dark:text-white">
              Book Doctor Appointment
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Browse specialists and pick a time slot for today.
            </p>
          </Card>
        </Link>
        <Link href="/patient/appointments">
          <Card className="h-full transition hover:border-blue-400 hover:shadow-md">
            <div className="text-3xl">📅</div>
            <h2 className="mt-3 text-lg font-medium text-slate-900 dark:text-white">
              Active Appointments
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              View, reschedule, or cancel your bookings.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
