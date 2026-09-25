// Where Google sends people back after they approve "Sign in with
// Google". We swap the temporary code Google gave us for a real login
// session, then decide where the person should go next.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const role = url.searchParams.get("role") === "doctor" ? "doctor" : "patient";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (!profile) {
          return NextResponse.redirect(
            new URL(`/complete-profile?role=${role}`, url.origin),
          );
        }
        return NextResponse.redirect(
          new URL(profile.role === "doctor" ? "/doctor" : "/patient", url.origin),
        );
      }
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=Could not log in with Google", url.origin),
  );
}
