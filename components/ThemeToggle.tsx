"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { Monitor, Moon, Sun } from "lucide-react"

const order = ["system", "light", "dark"] as const
const icons = { system: Monitor, light: Sun, dark: Moon }

export function ThemeToggle() {
  const t = useTranslations("common")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const current = (mounted && order.includes(theme as (typeof order)[number]) ? theme : "system") as (typeof order)[number]
  const next = order[(order.indexOf(current) + 1) % order.length]
  const Icon = icons[current]
  const label = `${t("theme")}: ${t(`theme_${current}`)}`

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={label}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:cursor-pointer hover:bg-muted hover:text-foreground"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
