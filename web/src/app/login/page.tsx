import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const role = params.role === "doctor" ? "doctor" : "patient";
  const otherRole = role === "doctor" ? "patient" : "doctor";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-50 p-6 dark:bg-slate-950">
      <LoginForm role={role} />
      <Link
        href={`/login?role=${otherRole}`}
        className="text-sm text-slate-500 hover:underline dark:text-slate-400"
      >
        I&apos;m actually a {otherRole} →
      </Link>
    </main>
  );
}
