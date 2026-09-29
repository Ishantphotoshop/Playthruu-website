import { ImageResponse } from "next/og";
import { getPublicArticle, VERIFICATION_LABEL } from "@/lib/news";

// PlayThruu's own share card for every story — so no article ever needs a
// publication's copyrighted image to look right when shared.
export const alt = "PlayThruu News";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DOT: Record<string, string> = {
  confirmed: "#00e054",
  reported: "#40bcf4",
  rumor: "#ff9933",
  leak: "#ff5a5f",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getPublicArticle(slug);
  const title = a?.title ?? "PlayThruu News";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14181c",
          backgroundImage:
            "radial-gradient(120% 70% at 50% 0%, #2c3440 0%, transparent 62%)",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="34" height="34" viewBox="0 0 120 120">
            <path
              fill="#eef4fa"
              d="M 110,52.5 L 60,52.5 A 7.5,7.5 0 0,0 60,67.5 L 110,67.5 A 2.9272,2.9272 0 0,1 112.8625,71.0248 A 54,54 0 1,1 112.8625,48.9752 A 2.9272,2.9272 0 0,1 110,52.5 Z"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#eef4fa" }}>
            PlayThruu
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#99aabb", letterSpacing: "0.12em", marginLeft: 8 }}>
            NEWS
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 80 ? 54 : 66,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#eef4fa",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {a && (
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 99,
                background: DOT[a.verification_status],
              }}
            />
          )}
          <div style={{ display: "flex", fontSize: 22, color: "#99aabb" }}>
            {a
              ? VERIFICATION_LABEL[a.verification_status] + " · " + a.category
              : "playthruu.com/news"}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
