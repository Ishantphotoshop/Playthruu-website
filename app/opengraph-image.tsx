import { ImageResponse } from "next/og";

export const alt = "PlayThruu — your gaming diary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundImage: "radial-gradient(120% 70% at 50% 0%, #2c3440 0%, transparent 62%)",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="34" height="34" viewBox="0 0 120 120">
            <path
              fill="#eef4fa"
              d="M 110,52.5 L 60,52.5 A 7.5,7.5 0 0,0 60,67.5 L 110,67.5 A 2.9272,2.9272 0 0,1 112.8625,71.0248 A 54,54 0 1,1 112.8625,48.9752 A 2.9272,2.9272 0 0,1 110,52.5 Z"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 800, letterSpacing: "-0.01em", color: "#eef4fa" }}>
            PlayThruu
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, color: "#eef4fa" }}>
            Every game
          </div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, color: "#00e054" }}>
            you ever played.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, background: "#00e054" }} />
          <div style={{ display: "flex", fontSize: 20, color: "#99aabb", letterSpacing: "0.02em" }}>
            The diary for every game you play. Opens 20 October.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
