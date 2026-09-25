import Link from "next/link";
import { signOut } from "@/app/actions";

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
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-blue-600">
            DocOnline
          </span>
          <span className="text-sm text-slate-400">· {title}</span>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-blue-600 dark:text-slate-300"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-slate-400">{name}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-red-600 hover:underline dark:text-red-400"
            >
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
