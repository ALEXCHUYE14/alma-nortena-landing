import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#fdfaf3",
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(146,64,14,0.06) 0px, rgba(146,64,14,0.06) 1px, transparent 1px, transparent 16px)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            color: "#1c1917",
          }}
        >
          Alma <span style={{ color: "#92400e", fontStyle: "italic", marginLeft: 20 }}>Norteña</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 34,
            color: "#78716c",
            fontFamily: "sans-serif",
          }}
        >
          {siteConfig.eslogan}
        </div>
      </div>
    ),
    size
  );
}
