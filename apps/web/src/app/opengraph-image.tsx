import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { RIDGE_POLYGONS, VIEWBOX } from "@/app/_lib/peaks";

export const alt =
  'Helvetic Studio — a red mountain ridge below the headline "Build a website. Get noticed. Grow."';
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RIDGE_BAND_HEIGHT = 230;

// Satori has no system fonts, so Inter ships as a .woff. Read at module scope: under Cache
// Components a request-time read would make the route dynamic instead of build-time static.
const inter = await readFile(
  path.join(process.cwd(), "src/app/_assets/inter-700.woff")
);

const Image = () =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        fontFamily: "Inter",
        color: "#1F1F1F",
        background:
          "linear-gradient(180deg, #fffdfd 0%, #fff6f5 46%, #fbe7e6 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "56px 72px 0",
        }}
      >
        {/* TODO: placeholder wordmark — replace with the real mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            letterSpacing: "-0.03em",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              background: "linear-gradient(150deg, #D8232A, #ff8b7f)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <svg
              width="22"
              height="16"
              viewBox="0 0 22 16"
              style={{ marginBottom: 7 }}
            >
              <polygon points="11,0 22,16 0,16" fill="rgba(255,255,255,0.92)" />
            </svg>
          </div>
          helvetic.studio
        </div>
        <div
          style={{
            marginTop: 64,
            maxWidth: 940,
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: "-0.045em",
          }}
        >
          Build a website. Get noticed. Grow.
        </div>
      </div>
      <svg
        width={size.width}
        height={RIDGE_BAND_HEIGHT}
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="none"
        style={{ display: "flex" }}
      >
        <polygon points={RIDGE_POLYGONS.far} fill="rgba(216,35,42,0.16)" />
        <polygon points={RIDGE_POLYGONS.mid} fill="rgba(216,35,42,0.28)" />
        <polygon points={RIDGE_POLYGONS.near} fill="rgba(216,35,42,0.44)" />
      </svg>
    </div>,
    {
      ...size,
      fonts: [{ name: "Inter", data: inter, style: "normal", weight: 700 }],
    }
  );

export default Image;
