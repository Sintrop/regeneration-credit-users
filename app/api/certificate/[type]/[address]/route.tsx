import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
import { getTranslations } from "next-intl/server"
import { getRegenerator, getSupporter, parseAddress } from "@/services/users"
import { formatArea, formatCarbon, formatImpact, formatNumber, formatRc, shortAddress, slugify } from "@/lib/format"
import { site } from "@/config/site"

export const revalidate = 300

let logo: string | null = null
async function logoDataUrl() {
  if (!logo) {
    const file = await readFile(path.join(process.cwd(), "public/assets/images/rc.png"))
    logo = `data:image/png;base64,${file.toString("base64")}`
  }
  return logo
}

/** Certificate card (1200×630): Open Graph preview of the profile pages and the "download certificate" file. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string; address: string }> }) {
  const { type, address: raw } = await params
  const address = parseAddress(raw)
  const locale = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "pt"
  if (!address || (type !== "supporter" && type !== "regenerator")) return new Response("Not found", { status: 404 })

  const t = await getTranslations({ locale, namespace: "certificateImage" })
  const tr = await getTranslations({ locale, namespace: "roles" })

  let name = ""
  let headline = ""
  let headlineLabel = ""
  let rows: [string, string][] = []

  if (type === "supporter") {
    const s = await getSupporter(address)
    if (!s) return new Response("Not found", { status: 404 })
    const c = s.certified
    name = s.name
    headlineLabel = t("contributedWith")
    headline = formatRc(c, locale)
    rows = [
      [t("carbon"), formatCarbon(c * s.perToken.carbon, locale)],
      [t("trees"), formatImpact(c * s.perToken.trees, locale)],
      [t("biodiversity"), formatImpact(c * s.perToken.biodiversity, locale)],
      [t("area"), formatArea(c * s.perToken.area, locale)],
    ]
  } else {
    const r = await getRegenerator(address)
    if (!r) return new Response("Not found", { status: 404 })
    name = r.name
    headlineLabel = t("score")
    headline = formatNumber(r.score, locale)
    rows = [
      [t("inspections"), formatNumber(r.totalInspections, locale)],
      [t("area"), formatArea(r.totalArea, locale)],
      [t("trees"), formatNumber(r.treesAverage, locale)],
      [t("biodiversity"), formatNumber(r.biodiversityAverage, locale)],
    ]
  }

  const host = site.websiteUrl.replace(/^https?:\/\//, "")
  const image = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#133427", color: "#eef7f1", padding: 56, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- rendered by satori */}
            <img src={await logoDataUrl()} width={56} height={56} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>REGENERATION CREDIT</span>
              <span style={{ fontSize: 20, color: "#9fd9b8" }}>{t("subtitle")}</span>
            </div>
          </div>
          <div style={{ display: "flex", background: "#15995b", color: "#ffffff", borderRadius: 999, padding: "8px 20px", fontSize: 22 }}>
            {tr(type)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 44 }}>
          <span style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.1 }}>{name.length > 40 ? `${name.slice(0, 39)}…` : name}</span>
          <span style={{ fontSize: 22, color: "#9fd9b8", marginTop: 8 }}>{shortAddress(address, 10, 8)}</span>
        </div>

        <div style={{ display: "flex", marginTop: "auto", gap: 48, alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 24, color: "#9fd9b8" }}>{headlineLabel}</span>
            <span style={{ fontSize: 72, fontWeight: 700, color: "#5fd497", lineHeight: 1 }}>{headline}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: 520 }}>
            {rows.map(([label, value]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "12px 18px", width: 252 }}>
                <span style={{ fontSize: 18, color: "#9fd9b8" }}>{label}</span>
                <span style={{ fontSize: 30, fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, fontSize: 18, color: "#9fd9b8" }}>
          <span>{t("verified")}</span>
          <span>{host}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )

  const headers = new Headers(image.headers)
  headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600")
  if (request.nextUrl.searchParams.get("download")) {
    headers.set("Content-Disposition", `attachment; filename="${t("fileName")}-${slugify(name)}.png"`)
  }
  return new Response(image.body, { status: 200, headers })
}
