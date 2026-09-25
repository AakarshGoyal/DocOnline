// Shared building blocks so every page uses the same look. Colors come
// from the CSS variables in globals.css (light/dark aware) rather than
// hard-coded Tailwind palette names, so the whole app's theme can be
// changed from one file.
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(15,30,36,0.04),0_8px_24px_-12px_rgba(15,30,36,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[var(--text-muted)]">{hint}</span>}
    </label>
  );
}

const fieldBase =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`${fieldBase} ${props.className ?? ""}`} />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${fieldBase} ${props.className ?? ""}`} />
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${buttonBase} bg-[var(--brand)] text-white shadow-sm shadow-[var(--brand)]/20 hover:bg-[var(--brand-strong)] ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${buttonBase} border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-muted)] ${className}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${buttonBase} border border-[var(--danger)]/30 bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white ${className}`}
    >
      {children}
    </button>
  );
}

function Banner({
  tone,
  children,
}: {
  tone: "danger" | "success";
  children?: string | null;
}) {
  if (!children) return null;
  return (
    <p
      className={`rounded-xl px-3.5 py-2.5 text-sm ${
        tone === "danger"
          ? "bg-[var(--danger-soft)] text-[var(--danger)]"
          : "bg-[var(--success-soft)] text-[var(--success)]"
      }`}
    >
      {children}
    </p>
  );
}

export function ErrorText({ children }: { children?: string | null }) {
  return <Banner tone="danger">{children}</Banner>;
}

export function SuccessText({ children }: { children?: string | null }) {
  return <Banner tone="success">{children}</Banner>;
}

export function IconCircle({
  children,
  tone = "brand",
  size = "md",
}: {
  children: React.ReactNode;
  tone?: "brand" | "accent";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-14 w-14" };
  const tones = {
    brand: "bg-[var(--brand-soft)] text-[var(--brand-strong)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full ${sizes[size]} ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const sizes = { sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-20 w-20 text-xl" };
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] font-semibold text-white ${sizes[size]}`}
    >
      {initials || "?"}
    </div>
  );
}

export function Badge({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "warning" | "muted";
}) {
  const tones = {
    brand: "bg-[var(--brand-soft)] text-[var(--brand-strong)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    muted: "bg-[var(--surface-muted)] text-[var(--text-muted)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function GoogleButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${buttonBase} w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-muted)]`}
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 35.5 24 35.5c-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.1 0 5.9 1.1 8.1 3l6-6C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.2-.1-2.4-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="m6.3 14.7 6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8.1 3l6-6C34.6 4.1 29.6 2 24 2c-7.7 0-14.3 4.3-17.7 10.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 46c5.5 0 10.4-1.8 14.3-4.9l-6.6-5.6C29.5 37 26.9 38 24 38c-5.3 0-9.7-3-11.4-7.3l-6.5 5C9.6 41.6 16.2 46 24 46z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.6C41.4 36.2 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z"
        />
      </svg>
      {children}
    </button>
  );
}
