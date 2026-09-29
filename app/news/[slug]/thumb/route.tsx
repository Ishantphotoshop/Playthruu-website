import { ImageResponse } from "next/og";
import { getPublicArticle, VERIFICATION_LABEL } from "@/lib/news";

// Small 4:3 card for the app's News tab thumbnails (92px wide there), so
// it carries only what reads at that size: the game and a status dot.
// The full share image (opengraph-image) is too wide and wordy for that.

const DOT: Record<string, string> = {
  confirmed: "#00e054",
  reported: "#40bcf4",
  rumor: "#ff9933",
  leak: "#ff5a5f",
};

export async function GET(
  _request: Request,
  { params }: RouteContext<"/news/[slug]/thumb">,
) {
  const { slug } = await params;
  const a = await getPublicArticle(slug);
  const label = a?.game || a?.category || "PlayThruu News";

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14181c",
          backgroundImage: "radial-gradient(110% 80% at 0% 0%, #2c3440 0%, transparent 65%)",
          padding: "34px",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 120 120">
          <path
            fill="#eef4fa"
            d="M 110,52.5 L 60,52.5 A 7.5,7.5 0 0,0 60,67.5 L 110,67.5 A 2.9272,2.9272 0 0,1 112.8625,71.0248 A 54,54 0 1,1 112.8625,48.9752 A 2.9272,2.9272 0 0,1 110,52.5 Z"
          />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: label.length > 22 ? 44 : 56,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#eef4fa",
          }}
        >
          {label}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 99,
              background: a ? DOT[a.verification_status] : "#99aabb",
            }}
          />
          <div style={{ display: "flex", fontSize: 28, color: "#99aabb" }}>
            {a ? VERIFICATION_LABEL[a.verification_status] : "News"}
          </div>
        </div>
      </div>
    ),
    { width: 400, height: 300 },
  );
  image.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  return image;
}
