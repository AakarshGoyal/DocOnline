// The "server" Supabase client: used inside Server Components, Server
// Actions, and Route Handlers (the parts of a page that run on the
// server, before anything is sent to the visitor's browser). It reads
// the login session out of cookies.
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component that can't set cookies
            // (e.g. during prefetch). Safe to ignore: proxy.ts below
            // refreshes the session on every request anyway.
          }
        },
      },
    },
  );
}
