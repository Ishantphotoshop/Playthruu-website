import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Service-role client: bypasses RLS. Only for server code that has already
// authorised the caller (the News Brain API checks its bearer token first).
// Never import this from a client component.
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Per-request client carrying the signed-in user's session from cookies,
// so RLS applies as that user (admins get write access via is_news_admin()).
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          // Server Components can't set cookies; proxy.ts refreshes the
          // session instead, so ignoring the failure here is safe.
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}

// The signed-in admin, or null for signed-out users and non-admins.
export async function getAdmin() {
  const client = await createSessionClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { client, user: null, isAdmin: false };
  const { data: isAdmin } = await client.rpc("is_news_admin");
  return { client, user, isAdmin: isAdmin === true };
}
