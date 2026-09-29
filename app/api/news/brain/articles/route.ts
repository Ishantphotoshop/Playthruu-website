import { createFromBrain, handle, json, listForBrain } from "@/lib/news-brain";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handle(request, listForBrain);
}

export async function POST(request: Request) {
  return handle(request, async function () {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return json(400, { error: "JSON body required" });
    return createFromBrain(body);
  });
}
