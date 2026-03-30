import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ENSO FOCUS - Create time to focus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo: circle with center dot */}
        <svg
          width={160}
          height={160}
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="#10b981"
            strokeWidth="5"
            fill="none"
            opacity="0.9"
          />
          <circle cx="50" cy="50" r="5" fill="#10b981" />
        </svg>

        {/* App name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ededed",
            marginTop: 32,
            letterSpacing: "-0.02em",
          }}
        >
          ENSO FOCUS
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.4)",
            marginTop: 12,
          }}
        >
          円相：集中する時間を作る
        </div>
      </div>
    ),
    { ...size }
  );
}
