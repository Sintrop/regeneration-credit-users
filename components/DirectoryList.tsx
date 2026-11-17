"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Avatar } from "./Avatar"
import { EmptyState } from "./ui/Card"

export interface DirectoryItem {
  address: string
  name: string
  href: string
  photo?: string | null
  meta: string[]
  badge?: string
}

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()

export function DirectoryList({ items }: { items: DirectoryItem[] }) {
  const t = useTranslations("directory")
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return q ? items.filter((i) => normalize(i.name).includes(q) || i.address.toLowerCase().includes(q)) : items
  }, [items, query])

  return (
    <div className="flex flex-col gap-4">
      <label className="relative block max-w-md">
        <span className="sr-only">{t("filter")}</span>
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("filter")}
          className="h-11 w-full rounded-full border bg-card pr-4 pl-10 text-sm focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none"
        />
      </label>
      {filtered.length === 0 ? (
        <EmptyState>{t("empty")}</EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.address}>
              <Link href={item.href} className="flex h-full items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm hover:border-brand/50">
                <Avatar address={item.address} photo={item.photo} name={item.name} size={48} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{item.name || item.address}</span>
                  {item.meta.map((m) => (
                    <span key={m} className="block truncate text-sm text-muted-foreground">
                      {m}
                    </span>
                  ))}
                </span>
                {item.badge && <span className="shrink-0 rounded-full bg-tint px-2 py-0.5 text-xs text-tint-foreground">{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
