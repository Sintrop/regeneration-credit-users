"use client"

import { useTranslations } from "next-intl"
import { Download } from "lucide-react"

/** Downloads the area as GeoJSON, readable by QGIS, Google Earth and others. */
export function CoordinatesDownload({ name, coordinates }: { name: string; coordinates: { lat: number; lng: number }[] }) {
  const t = useTranslations("map")
  if (coordinates.length === 0) return null

  function download() {
    const ring = coordinates.map((c) => [c.lng, c.lat])
    if (ring.length >= 3) ring.push(ring[0])
    const geojson = {
      type: "Feature",
      properties: { name },
      geometry: ring.length >= 4 ? { type: "Polygon", coordinates: [ring] } : { type: "MultiPoint", coordinates: ring },
    }
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase() || "area"}.geojson`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button type="button" onClick={download} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm hover:cursor-pointer hover:bg-muted">
      <Download className="size-4" aria-hidden />
      {t("geojson")}
    </button>
  )
}
