import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, IconCircle } from "@/components/ui";
import { ChevronRight, Thermometer, Bug, HeartPulse, Baby, Ear, Stethoscope } from "lucide-react";

const SPECIALTY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "cold-cough-fever": Thermometer,
  "covid-consultation": Bug,
  cardiology: HeartPulse,
  "child-development": Baby,
  ent: Ear,
};

export default async function SpecialistsPage() {
  const supabase = await createClient();
  const { data: specialties } = await supabase
    .from("specialties")
    .select("id, name, description, symptoms, icon")
    .order("name");

  return (
    <div className="space-y-4">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
        Specialists
      </h1>
      <div className="space-y-3">
        {specialties?.map((s) => {
          const Icon = SPECIALTY_ICONS[s.id] ?? Stethoscope;
          return (
            <Link key={s.id} href={`/patient/specialists/${s.id}`}>
              <Card className="group flex items-start gap-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-md">
                <IconCircle tone="brand">
                  <Icon size={20} />
                </IconCircle>
                <div className="flex-1">
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-[var(--foreground)]">
                    {s.name}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">{s.description}</p>
                  <p className="mt-1.5 text-xs font-medium text-[var(--brand-strong)]">
                    {s.symptoms}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="mt-3 shrink-0 text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
                />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
