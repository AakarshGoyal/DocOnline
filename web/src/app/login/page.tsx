import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const role = params.role === "doctor" ? "doctor" : "patient";
  const otherRole = role === "doctor" ? "patient" : "doctor";

  return (
    <main className="bg-glow flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <LoginForm role={role} />
      <Link
        href={`/login?role=${otherRole}`}
        className="text-sm text-[var(--text-muted)] hover:text-[var(--brand-strong)] hover:underline"
      >
        I&apos;m actually a {otherRole} →
      </Link>
    </main>
  );
}
