import Link from "next/link";
import { Card } from "@/components/ui";

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/doctor/schedule">
          <Card className="h-full transition hover:border-blue-400 hover:shadow-md">
            <div className="text-3xl">🗓️</div>
            <h2 className="mt-3 text-lg font-medium text-slate-900 dark:text-white">
              My Schedule
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Set the hours you&apos;re available today.
            </p>
          </Card>
        </Link>
        <Link href="/doctor/appointments">
          <Card className="h-full transition hover:border-blue-400 hover:shadow-md">
            <div className="text-3xl">👥</div>
            <h2 className="mt-3 text-lg font-medium text-slate-900 dark:text-white">
              My Appointments
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              See who&apos;s booked into your slots today.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
