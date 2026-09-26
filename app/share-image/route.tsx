import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#000", color: "#ddd", padding: 64, justifyContent: "center" }}>
    <div style={{ display: "flex", color: "#87d787", fontSize: 28 }}>jeanyoon.ch/oi</div>
    <div style={{ display: "flex", fontSize: 72, marginTop: 28 }}>Jeanyoon Choi</div>
    <div style={{ display: "flex", fontSize: 30, marginTop: 24 }}>Interactive Art · Computational Art · Web Art</div>
  </div>, { width: 1200, height: 630 });
}
