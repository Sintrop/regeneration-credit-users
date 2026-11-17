import { getAddress, isAddress } from "ethers"

/** 18-decimals token amount → number (precision is fine for display) */
export const fromWei = (value: bigint | null | undefined) => (value ? Number(value) / 1e18 : 0)

export function formatNumber(value: number, locale: string, maxFractionDigits = 0, minFractionDigits = 0): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: maxFractionDigits, minimumFractionDigits: minFractionDigits }).format(
    Number.isFinite(value) ? value : 0,
  )
}

/** Same rules as the certificate in the apps: g → kg → t. */
export function formatCarbon(grams: number, locale: string): string {
  const value = Number.isFinite(grams) ? Math.max(0, grams) : 0
  if (value >= 1e6) return `${formatNumber(value / 1e6, locale, 2)} t`
  if (value >= 1e3) return `${formatNumber(value / 1e3, locale, 2)} kg`
  return `${formatNumber(value, locale, 2)} g`
}

/** Same rules as the certificate in the apps: hectares from 1,000 m², cm² below 1 m². */
export function formatArea(squareMeters: number, locale: string): string {
  const value = Number.isFinite(squareMeters) ? squareMeters : 0
  if (Math.abs(value) >= 1000) return `${formatNumber(value / 10000, locale, 2)} ha`
  if (value > 0 && value < 1) return `${formatNumber(value * 10000, locale, 1)} cm²`
  return `${formatNumber(value, locale, 2)} m²`
}

/** Trees and species per credit, like the supporter certificate (two decimals). */
export const formatImpact = (value: number, locale: string) => formatNumber(value, locale, 2, 2)

export const formatRc = (value: number, locale: string, max = 2) => `${formatNumber(value, locale, max)} RC`

export function shortAddress(address: string, start = 6, end = 4): string {
  return address.length > start + end + 1 ? `${address.slice(0, start)}…${address.slice(-end)}` : address
}

export function toChecksum(value: string): string | null {
  return isAddress(value) ? getAddress(value) : null
}

export { slugify } from "./slug"
