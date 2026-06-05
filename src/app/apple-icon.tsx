import { ImageResponse } from "next/og";
import { BRAND } from "@/config/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: BRAND.colors.green,
          position: "relative",
        }}
      >
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2 4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4Z"
            stroke="white"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="m9 12 2 2 4-4"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 38,
            top: 32,
            width: 10,
            height: 72,
            borderRadius: 5,
            background: BRAND.colors.gold,
            transform: "rotate(14deg)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
