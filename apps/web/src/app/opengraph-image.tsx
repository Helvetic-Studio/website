import { ImageResponse } from "next/og";

export const alt = "Helvetic Studio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const OpenGraphImage = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#0a0a0a",
        color: "#fafafa",
        display: "flex",
        fontSize: 72,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      Helvetic Studio
    </div>,
    {
      ...size,
    }
  );

export default OpenGraphImage;
