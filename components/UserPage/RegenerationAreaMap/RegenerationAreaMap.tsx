/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CoordinateProps } from '@/types/regenerator'

export interface CoordProps {
  lat: number
  lng: number
}

interface Props {
  coords: CoordinateProps[]
}

export function RegenerationAreaMap({ coords }: Props) {
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  const mapRef = useRef<mapboxgl.Map>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  const centerMap = {
    lat: coords.length > 0 ? coords[0].latitude : -23.29,
    lng: coords.length > 0 ? coords[0].longitude : -48.08
  }

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN ? MAPBOX_ACCESS_TOKEN : ''
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef?.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [centerMap.lng, centerMap.lat],
      zoom: 16
    })

    mapRef.current.on('load', () => {
      mapRef.current!.addSource('polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          }
        }
      })

      mapRef.current!.addLayer({
        id: 'polygon-layer-1',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.3
        }
      })

      mapRef.current!.addLayer({
        id: 'polygon-border-1',
        type: 'line',
        source: 'polygon',
        layout: {},
        paint: {
          'line-color': '#088',
          'line-width': 2
        }
      })
    })

    return (): void => {
      mapRef.current?.remove()
    }
  }, [centerMap])

  useEffect(() => {
    if (!mapRef.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    coords.forEach((coordinate) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([coordinate?.longitude, coordinate?.latitude])
        .addTo(mapRef.current!)

      markersRef.current.push(marker)
    })

    if (coords.length > 2) {
      const polygonCoords: [number, number][] = coords.map((coord) => [coord.longitude, coord.latitude])
      if (polygonCoords.length > 0) {
        polygonCoords.push([...polygonCoords[0]])
      }

      ;(mapRef.current!.getSource('polygon') as mapboxgl.GeoJSONSource)?.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [polygonCoords]
        }
      })
    } else {
      ;(mapRef.current!.getSource('polygon') as mapboxgl.GeoJSONSource)?.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[]]
        }
      })
    }
  }, [coords])

  return (
    <div className="flex flex-col gap-1">
      <div
        //@ts-ignore
        ref={mapContainerRef}
        className="w-full h-[300px] rounded-2xl border-2 border-white mt-1"
      />
    </div>
  )
}
