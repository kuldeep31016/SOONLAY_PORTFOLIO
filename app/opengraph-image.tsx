import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt = "Soonlay — Custom software, app and SaaS development studio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"))
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #F7F8F6 0%, #FFFFFF 55%, #E3F3EA 100%)",
          color: "#0E1311",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={72} height={72} alt="" style={{ borderRadius: 14 }} />
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>Soonlay</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            Turn your business idea into working software.
          </div>
          <div style={{ fontSize: 30, color: "#47514C" }}>
            Web apps · Mobile apps · SaaS · AI · Custom business systems
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#0D8457" }}>
          <span>soonlay.tech</span>
          <span style={{ color: "#47514C" }}>Bangalore, India · Working worldwide</span>
        </div>
      </div>
    ),
    size
  )
}
