"use client"

import dynamic from "next/dynamic"
import type { MapArea } from "./AreaMap"

// Mapbox GL is large: load it only in the browser, after the page content
const AreaMap = dynamic(() => import("./AreaMap").then((m) => m.AreaMap), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full animate-pulse rounded-xl bg-muted" />,
})

export function LazyAreaMap(props: { areas: MapArea[]; height?: number }) {
  return <AreaMap {...props} />
}
