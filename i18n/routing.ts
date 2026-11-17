import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  // no prefix for Portuguese; /en for English; old /pt/... links redirect to the unprefixed URL
  localePrefix: "as-needed",
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]
