"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { site } from "@/config/site"

export interface MapArea {
  name?: string
  href?: string
  coordinates: { lat: number; lng: number }[]
}

const FILL = "#15995b"
const LINE = "#7be0a8"

function polygon(area: MapArea): [number, number][] | null {
  if (area.coordinates.length < 3) return null
  const ring = area.coordinates.map((c) => [c.lng, c.lat] as [number, number])
  ring.push(ring[0])
  return ring
}

/**
 * Satellite map of one or many regeneration areas. The polygons are added inside the
 * map's `load` event (the previous version set the data before the source existed,
 * so the area was never drawn).
 */
export function AreaMap({ areas, height = 360 }: { areas: MapArea[]; height?: number }) {
  const t = useTranslations("map")
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current || !site.mapboxToken) return
    const points = areas.flatMap((a) => a.coordinates)
    if (points.length === 0) return

    mapboxgl.accessToken = site.mapboxToken
    const map = new mapboxgl.Map({
      container: container.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [points[0].lng, points[0].lat],
      zoom: 14,
      cooperativeGestures: true,
    })
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")

    map.on("load", () => {
      const features = areas
        .map((area, i) => {
          const ring = polygon(area)
          return ring
            ? { type: "Feature" as const, id: i, properties: { name: area.name ?? "", href: area.href ?? "" }, geometry: { type: "Polygon" as const, coordinates: [ring] } }
            : null
        })
        .filter((f): f is NonNullable<typeof f> => !!f)

      map.addSource("areas", { type: "geojson", data: { type: "FeatureCollection", features } })
      map.addLayer({ id: "areas-fill", type: "fill", source: "areas", paint: { "fill-color": FILL, "fill-opacity": 0.35 } })
      map.addLayer({ id: "areas-line", type: "line", source: "areas", paint: { "line-color": LINE, "line-width": 2.5 } })

      // with many areas the map starts zoomed out and the polygons are too small to see: a dot marks each one
      if (areas.length > 1) {
        const dots = areas
          .filter((a) => a.coordinates.length > 0)
          .map((a) => {
            const lng = a.coordinates.reduce((s, c) => s + c.lng, 0) / a.coordinates.length
            const lat = a.coordinates.reduce((s, c) => s + c.lat, 0) / a.coordinates.length
            return { type: "Feature" as const, properties: { name: a.name ?? "", href: a.href ?? "" }, geometry: { type: "Point" as const, coordinates: [lng, lat] } }
          })
        map.addSource("dots", { type: "geojson", data: { type: "FeatureCollection", features: dots } })
        map.addLayer({
          id: "areas-dot",
          type: "circle",
          source: "dots",
          maxzoom: 13,
          paint: { "circle-radius": 7, "circle-color": FILL, "circle-stroke-width": 2, "circle-stroke-color": "#ffffff" },
        })
      }

      // areas with fewer than 3 points can't form a polygon: show them as markers
      areas.filter((a) => a.coordinates.length < 3).forEach((a) => a.coordinates.forEach((c) => new mapboxgl.Marker({ color: FILL }).setLngLat([c.lng, c.lat]).addTo(map)))

      const bounds = new mapboxgl.LngLatBounds()
      points.forEach((p) => bounds.extend([p.lng, p.lat]))
      map.fitBounds(bounds, { padding: 48, maxZoom: 17, duration: 0 })

      if (areas.some((a) => a.href)) {
        const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 8 })
        const layers = areas.length > 1 ? ["areas-fill", "areas-dot"] : ["areas-fill"]
        for (const layer of layers) {
          map.on("mousemove", layer, (e) => {
            map.getCanvas().style.cursor = "pointer"
            const name = e.features?.[0]?.properties?.name
            if (name) popup.setLngLat(e.lngLat).setText(name).addTo(map)
          })
          map.on("mouseleave", layer, () => {
            map.getCanvas().style.cursor = ""
            popup.remove()
          })
          map.on("click", layer, (e) => {
            const href = e.features?.[0]?.properties?.href
            if (href) window.location.href = href
          })
        }
      }
    })

    return () => map.remove()
  }, [areas])

  if (!site.mapboxToken) {
    return <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">{t("unavailable")}</p>
  }

  return <div ref={container} className="w-full overflow-hidden rounded-xl" style={{ height }} role="region" aria-label={t("label")} />
}
