// The "browser" Supabase client: used inside Client Components (the
// parts of a page that run in the visitor's own browser, e.g. to react
// to a button click without a full page reload).
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
