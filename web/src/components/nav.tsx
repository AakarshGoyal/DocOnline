import Link from "next/link";
import { Stethoscope, LogOut } from "lucide-react";
import { signOut } from "@/app/actions";
import { Avatar } from "@/components/ui";

export function Nav({
  title,
  name,
  links,
}: {
  title: string;
  name: string;
  links: { href: string; label: string }[];
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
            <Stethoscope size={17} strokeWidth={2.25} />
          </span>
          <span className="font-[family-name:var(--font-heading)] text-base font-bold text-[var(--foreground)]">
            DocOnline
          </span>
          <span className="hidden text-sm text-[var(--text-muted)] sm:inline">
            · {title}
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}

          <div className="mx-2 flex items-center gap-2 border-l border-[var(--border)] pl-3">
            <Avatar name={name} size="sm" />
            <span className="hidden text-[var(--foreground)] md:inline">{name}</span>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              title="Log out"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
