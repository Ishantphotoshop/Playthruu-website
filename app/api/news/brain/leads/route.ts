import { handle, json } from "@/lib/news-brain";
import { fetchLeads } from "@/lib/news-leads";

export const dynamic = "force-dynamic";

// GET /api/news/brain/leads?hours=12 — recent headlines from the five
// outlets the app used to link out to, fetched server-side so the Brain's
// sandbox only ever needs to reach playthruu.com.
export async function GET(request: Request) {
  return handle(request, async function () {
    const hours = Math.min(Math.max(Number(new URL(request.url).searchParams.get("hours")) || 12, 1), 72);
    return json(200, await fetchLeads(hours));
  });
}
