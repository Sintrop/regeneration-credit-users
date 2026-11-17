import { getFormatter, getTranslations } from "next-intl/server"
import { ExternalLink } from "lucide-react"
import { PoolPayment } from "@/services/users"
import { explorerTx } from "@/config/site"
import { EmptyState } from "./ui/Card"

export async function PaymentList({ payments }: { payments: PoolPayment[] }) {
  const t = await getTranslations("payments")
  const format = await getFormatter()
  if (payments.length === 0) return <EmptyState>{t("none")}</EmptyState>

  return (
    <ul className="flex flex-col divide-y">
      {payments.map((p) => (
        <li key={p.txHash} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <span className="text-muted-foreground">{p.timestamp ? format.dateTime(new Date(p.timestamp * 1000), { dateStyle: "medium" }) : `#${p.blockNumber}`}</span>
          <span className="flex items-center gap-2">
            <span className="font-semibold tabular-nums">{format.number(p.amount, { maximumFractionDigits: 2 })} RC</span>
            <a href={explorerTx(p.txHash)} target="_blank" rel="noopener noreferrer" className="text-link" title={t("viewTx")} aria-label={t("viewTx")}>
              <ExternalLink className="size-3.5" />
            </a>
          </span>
        </li>
      ))}
    </ul>
  )
}
