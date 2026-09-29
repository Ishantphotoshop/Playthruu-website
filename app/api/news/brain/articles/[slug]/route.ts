import { getForBrain, handle, json, updateFromBrain } from "@/lib/news-brain";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/news/brain/articles/[slug]">,
) {
  return handle(request, async function () {
    const { slug } = await params;
    return getForBrain(slug);
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/news/brain/articles/[slug]">,
) {
  return handle(request, async function () {
    const { slug } = await params;
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return json(400, { error: "JSON body required" });
    return updateFromBrain(slug, body);
  });
}
