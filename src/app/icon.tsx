import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f12",
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, color: "#ff6b81" }}>M</span>
      </div>
    ),
    { ...size },
  );
}
