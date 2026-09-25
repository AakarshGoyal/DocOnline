"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Where a logged-in person should land depends on their role, which
// we only know once their `profiles` row exists (see complete-profile).
async function redirectToDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/complete-profile");
  redirect(profile.role === "doctor" ? "/doctor" : "/patient");
}

type FormResult = { error?: string; info?: string } | undefined;

export async function signInWithPassword(formData: FormData): Promise<FormResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Wrong email or password. Please try again." };
  }
  await redirectToDashboard();
}

export async function signUpWithPassword(formData: FormData): Promise<FormResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const role = formData.get("role") === "doctor" ? "doctor" : "patient";

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }
  // If Supabase is configured to require email confirmation, there is
  // no session yet -- tell the person to check their inbox instead of
  // silently failing to redirect them anywhere useful.
  if (!data.session) {
    return {
      info: "Account created! Check your email to confirm it, then log in.",
    };
  }

  redirect(`/complete-profile?role=${role}`);
}
