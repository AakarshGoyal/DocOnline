"use client";

import { useState, useTransition } from "react";
import {
  Card,
  ErrorText,
  Field,
  GoogleButton,
  PrimaryButton,
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
    <Card className="w-full max-w-sm space-y-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          {role === "doctor" ? "Doctor" : "Patient"}
        </p>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          {mode === "login" ? "Log in" : "Create your account"}
        </h1>
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
        {info && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            {info}
          </p>
        )}

        <PrimaryButton type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
        </PrimaryButton>
      </form>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        or
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
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
        className="w-full text-center text-sm text-blue-600 hover:underline"
      >
        {mode === "login"
          ? "New here? Create an account"
          : "Already have an account? Log in"}
      </button>
    </Card>
  );
}
