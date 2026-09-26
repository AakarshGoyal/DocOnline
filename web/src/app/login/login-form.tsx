"use client";

import { useState, useTransition } from "react";
import { UserRound, Stethoscope } from "lucide-react";
import {
  Card,
  ErrorText,
  Field,
  GoogleButton,
  IconCircle,
  PrimaryButton,
  SuccessText,
  TextInput,
} from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { signInWithPassword, signUpWithPassword } from "./actions";

export function LoginForm({ role }: { role: "patient" | "doctor" }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setInfo(null);
    formData.set("role", role);

    const action = mode === "login" ? signInWithPassword : signUpWithPassword;
    const result = await action(formData);
    if (result?.error) setError(result.error);
    if (result?.info) setInfo(result.info);
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      },
    });
  }

  return (
    <Card className="w-full max-w-sm space-y-6">
      <div className="flex items-center gap-3">
        <IconCircle tone={role === "doctor" ? "accent" : "brand"}>
          {role === "doctor" ? <Stethoscope size={20} /> : <UserRound size={20} />}
        </IconCircle>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {role === "doctor" ? "Doctor" : "Patient"}
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--foreground)]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
        </div>
      </div>

      <form
        action={(formData) => startTransition(() => handleSubmit(formData))}
        className="space-y-4"
      >
        <Field label="Email">
          <TextInput type="email" name="email" required autoComplete="email" />
        </Field>
        <Field label="Password">
          <TextInput
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </Field>
        {mode === "signup" && (
          <Field label="Confirm password">
            <TextInput
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </Field>
        )}

        <ErrorText>{error}</ErrorText>
        <SuccessText>{info}</SuccessText>

        <PrimaryButton type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
        </PrimaryButton>
      </form>

      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <div className="h-px flex-1 bg-[var(--border)]" />
        or
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <GoogleButton type="button" onClick={handleGoogle}>
        Continue with Google
      </GoogleButton>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError(null);
          setInfo(null);
        }}
        className="w-full text-center text-sm font-medium text-[var(--brand-strong)] hover:underline"
      >
        {mode === "login"
          ? "New here? Create an account"
          : "Already have an account? Log in"}
      </button>
    </Card>
  );
}
