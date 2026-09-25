import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export default async function SpecialistsPage() {
  const supabase = await createClient();
  const { data: specialties } = await supabase
    .from("specialties")
    .select("id, name, description, symptoms, icon")
    .order("name");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Specialists
      </h1>
      <div className="space-y-3">
        {specialties?.map((s) => (
          <Link key={s.id} href={`/patient/specialists/${s.id}`}>
            <Card className="flex items-start gap-4 transition hover:border-blue-400 hover:shadow-md">
              <div className="text-3xl">{s.icon}</div>
              <div>
                <h2 className="font-medium text-slate-900 dark:text-white">
                  {s.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {s.description}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {s.symptoms}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
