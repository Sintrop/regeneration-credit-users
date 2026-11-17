import { getFormatter, getTranslations } from "next-intl/server"
import { ExternalLink, ShieldCheck } from "lucide-react"
import { explorerAddress } from "@/config/site"

/** States what was checked and where, with a link to verify independently on the block explorer. */
export async function VerificationBanner({ address, role, registeredAt }: { address: string; role: string; registeredAt: number | null }) {
  const t = await getTranslations("verify")
  const format = await getFormatter()
  const now = new Date()

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-brand/30 bg-tint px-4 py-3 text-tint-foreground sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2 text-sm">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">{t("verified", { role })}</strong>
          {registeredAt ? ` ${t("since", { date: format.dateTime(new Date(registeredAt * 1000), { dateStyle: "long" }) })}` : ""}
          <span className="block opacity-80">{t("readNow", { time: format.dateTime(now, { dateStyle: "short", timeStyle: "short" }) })}</span>
        </span>
      </p>
      <a
        href={explorerAddress(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted sm:self-auto"
      >
        {t("checkOnExplorer")}
        <ExternalLink className="size-3.5" aria-hidden />
      </a>
    </div>
  )
}
