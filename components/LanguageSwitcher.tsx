"use client"

import { useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Languages } from "lucide-react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

const names: Record<string, string> = { pt: "Português", en: "English" }

export function LanguageSwitcher() {
  const t = useTranslations("common")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [isPending, startTransition] = useTransition()

  function change(next: string) {
    startTransition(() => {
      // @ts-expect-error -- params of the current route are passed through unchanged
      router.replace({ pathname, params }, { locale: next })
    })
  }

  return (
    <label className="inline-flex h-9 items-center gap-1 rounded-full px-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
      <Languages className="size-4" aria-hidden />
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        title={names[locale]}
        disabled={isPending}
        onChange={(e) => change(e.target.value)}
        className="bg-transparent font-medium uppercase hover:cursor-pointer focus:outline-none"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-card text-foreground normal-case">
            {l.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  )
}
