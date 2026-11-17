"use client"

import { FormEvent, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { profileHref } from "@/lib/routes"
import { isAddressLike } from "@/lib/slug"

export interface SearchUser {
  address: string
  name: string
  type: "regenerator" | "supporter" | "inspector" | "researcher" | "developer" | "contributor" | "activist"
}

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()

/** Search by name (suggestions from the registered users) or by wallet address. */
export function SearchBox({ users, roleLabels, size = "lg" }: { users: SearchUser[]; roleLabels: Record<string, string>; size?: "lg" | "md" }) {
  const t = useTranslations("search")
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  const matches = useMemo(() => {
    const q = normalize(query.trim())
    if (q.length < 2) return []
    return users.filter((u) => normalize(u.name).includes(q) || u.address.toLowerCase().includes(q)).slice(0, 8)
  }, [query, users])

  function submit(e: FormEvent) {
    e.preventDefault()
    const value = query.trim()
    if (isAddressLike(value)) return router.push(`/user/${value}`)
    if (matches.length > 0) return router.push(profileHref(matches[0].type, matches[0].address, matches[0].name))
    setError(t("notFound"))
  }

  return (
    <form onSubmit={submit} role="search" className="relative w-full">
      <label htmlFor="search" className="sr-only">
        {t("label")}
      </label>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setError(null)
            }}
            placeholder={t("placeholder")}
            autoComplete="off"
            spellCheck={false}
            className={cn(
              "w-full rounded-full border bg-card pr-4 pl-12 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none",
              size === "lg" ? "h-14 text-base" : "h-11 text-sm",
            )}
            aria-describedby={error ? "search-error" : undefined}
          />
        </div>
        <button type="submit" className={cn("shrink-0 rounded-full bg-brand px-6 font-semibold text-brand-foreground hover:cursor-pointer hover:bg-brand-strong", size === "lg" ? "h-14" : "h-11")}>
          {t("submit")}
        </button>
      </div>

      {matches.length > 0 && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border bg-card text-foreground shadow-lg">
          {matches.map((u) => (
            <li key={u.address}>
              <button
                type="button"
                onClick={() => router.push(profileHref(u.type, u.address, u.name))}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:cursor-pointer hover:bg-muted"
              >
                <span className="truncate">{u.name || u.address}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{roleLabels[u.type]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p id="search-error" role="alert" className="mt-2 text-sm text-warning">
          {error}
        </p>
      )}
    </form>
  )
}
