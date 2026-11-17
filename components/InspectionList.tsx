import { getFormatter, getTranslations } from "next-intl/server"
import { ExternalLink, FileText, Images } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Inspection } from "@/services/users"
import { shortAddress } from "@/lib/format"
import { Badge, EmptyState } from "./ui/Card"

const tones = { open: "muted", accepted: "warning", inspected: "success", invalidated: "danger" } as const

/** Inspections as a timeline. `perspective` decides which counterpart is shown. */
export async function InspectionList({
  inspections,
  perspective,
  names,
}: {
  inspections: Inspection[]
  perspective: "regenerator" | "inspector"
  /** lowercase address → name, to show the regenerator's name on an inspector's page */
  names?: Map<string, string>
}) {
  const t = await getTranslations("inspection")
  const format = await getFormatter()
  const date = (ts: number | null) => (ts ? format.dateTime(new Date(ts * 1000), { dateStyle: "medium" }) : "—")

  if (inspections.length === 0) return <EmptyState>{t("none")}</EmptyState>

  return (
    <ol className="flex flex-col divide-y">
      {inspections.map((i) => {
        const done = i.status === "inspected" || i.status === "invalidated"
        return (
          <li key={i.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{t("title", { id: i.id })}</span>
              <Badge tone={tones[i.status]}>{t(`status.${i.status}`)}</Badge>
              <span className="text-sm text-muted-foreground">{done ? t("inspectedOn", { date: date(i.inspectedAt) }) : t("requestedOn", { date: date(i.createdAt) })}</span>
            </div>

            <p className="text-sm text-muted-foreground">
              {perspective === "regenerator" ? t("by") : t("at")}{" "}
              {perspective === "regenerator" ? (
                i.inspector ? (
                  <Link href={`/user/${i.inspector}`} className="text-link hover:underline">
                    {i.inspectorName || shortAddress(i.inspector)}
                  </Link>
                ) : (
                  "—"
                )
              ) : (
                <Link href={`/regenerator/${i.regenerator}`} className="text-link hover:underline">
                  {names?.get(i.regenerator.toLowerCase()) || shortAddress(i.regenerator)}
                </Link>
              )}
            </p>

            {done && (
              <dl className="grid grid-cols-3 gap-2 sm:max-w-md">
                {[
                  ["trees", i.trees],
                  ["biodiversity", i.biodiversity],
                  ["score", i.score],
                ].map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-muted px-3 py-2">
                    <dt className="text-xs text-muted-foreground">{t(key as string)}</dt>
                    <dd className="text-lg font-semibold tabular-nums">{format.number(value as number)}</dd>
                  </div>
                ))}
              </dl>
            )}

            {i.status === "invalidated" && <p className="text-sm text-danger">{t("invalidatedNote", { date: date(i.invalidatedAt) })}</p>}

            {done && (
              <div className="flex flex-wrap gap-2">
                {i.photosUrl && (
                  <a href={i.photosUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm hover:bg-muted">
                    <Images className="size-4" aria-hidden />
                    {t("photos")}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                )}
                {i.reportUrl && (
                  <a href={i.reportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm hover:bg-muted">
                    <FileText className="size-4" aria-hidden />
                    {t("report")}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
