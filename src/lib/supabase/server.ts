import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib//database.types";
/**
 * Supabase client for use in Server Components, Server Actions, and
 * Route Handlers. Must be created fresh per request (never module-level).
 *
 * RLS does the authorization work here — this client carries the
 * signed-in user's JWT, not a service role key. Anything that needs to
 * bypass RLS (webhooks, cron jobs) belongs in an Edge Function instead,
 * not here.
 */
export async function createClient<Database>() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can be called from a Server Component, where it's a
            // no-op as long as proxy is refreshing the session.
          }
        },
      },
    }
  );
}
