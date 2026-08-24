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
          background: "#0a0b0f",
          backgroundImage: "radial-gradient(120% 70% at 50% 0%, #1a1d12 0%, transparent 62%)",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="34" height="34" viewBox="0 0 120 120">
            <path d="M 20 18 V 62 A 40 40 0 0 0 100 62 V 18" fill="none" stroke="#F2F5FA" strokeWidth="16" strokeLinecap="round" />
            <path d="M 48 18 V 62 A 12 12 0 0 0 72 62 V 18" fill="none" stroke="#D9FF3F" strokeWidth="12" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 800, letterSpacing: "-0.01em", color: "#f1f0e9" }}>
            PlayThruu
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, color: "#f1f0e9" }}>
            Log it. Rate it.
          </div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, color: "#a78bfa" }}>
            Never forget it.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, background: "#d9ff3f" }} />
          <div style={{ display: "flex", fontSize: 20, color: "#8a9086", letterSpacing: "0.02em" }}>
            The diary for everything you play — launching soon
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
