import { ImageResponse } from "next/og";

export const alt = "PlayThruu — Your games. Your story.";
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
          background: "#0a0b0f",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#f1f0e9",
          }}
        >
          <span style={{ color: "#d9ff3f", marginRight: 12, fontSize: 40 }}>+</span>
          PLAYTHRUU
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#f1f0e9",
            }}
          >
            Your games.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#a78bfa",
            }}
          >
            Your story.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: "#d9ff3f" }} />
          <div style={{ display: "flex", fontSize: 22, color: "#8a9086", letterSpacing: "0.04em" }}>
            LAUNCHING SOON · FOR PEOPLE WHO PLAY ALL THE WAY THROUGH
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
