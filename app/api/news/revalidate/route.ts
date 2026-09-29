import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Called by the app's admin build (app.playthruu.com/admin) after it
// approves, rejects or edits a story, so the website reflects the change
// immediately instead of on the next 5-minute refresh. The caller proves
// it's an admin with its own Supabase session token; nothing else is
// trusted.

const ALLOWED_ORIGINS = new Set([
  "https://app.playthruu.com",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
]);

function cors(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://app.playthruu.com",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: cors(request) });
}

export async function POST(request: Request) {
  const headers = cors(request);
  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  if (!token) return Response.json({ error: "unauthorized" }, { status: 401, headers });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: "Bearer " + token } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const { data: isAdmin } = await supabase.rpc("is_news_admin");
  if (isAdmin !== true) return Response.json({ error: "forbidden" }, { status: 403, headers });

  const body = await request.json().catch(() => ({}));
  const slug = typeof body.slug === "string" && /^[a-z0-9-]+$/.test(body.slug) ? body.slug : null;
  revalidatePath("/news");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath("/news/" + slug);
  return Response.json({ ok: true }, { headers });
}
