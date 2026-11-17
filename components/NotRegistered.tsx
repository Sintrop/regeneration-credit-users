import { getTranslations } from "next-intl/server"
import { ShieldAlert } from "lucide-react"
import { explorerAddress } from "@/config/site"
import { Link } from "@/i18n/navigation"

/** Shown for a valid address that isn't a registered user: never render an empty "official" profile. */
export async function NotRegistered({ address, expected }: { address: string; expected?: string }) {
  const t = await getTranslations("notRegistered")
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center shadow-sm">
        <ShieldAlert className="size-12 text-warning" aria-hidden />
        <h1 className="text-2xl font-bold">{expected ? t("titleRole", { role: expected }) : t("title")}</h1>
        <p className="font-mono text-sm break-all text-muted-foreground">{address}</p>
        <p className="text-muted-foreground">{t("body")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <a href={explorerAddress(address)} target="_blank" rel="noopener noreferrer" className="rounded-full border px-4 py-2 text-sm hover:bg-muted">
            {t("explorer")}
          </a>
          <Link href="/" className="rounded-full bg-brand px-4 py-2 text-sm text-brand-foreground hover:bg-brand-strong">
            {t("home")}
          </Link>
        </div>
      </div>
    </main>
  )
}
