import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server"
import { ClipboardCheck, Coins, Ruler, Sprout, TreePine, Trophy } from "lucide-react"
import { getRegenerator, getUserType, parseAddress } from "@/services/users"
import { site } from "@/config/site"
import { formatArea, formatNumber, formatRc, shortAddress, slugify } from "@/lib/format"
import { getPathname } from "@/i18n/navigation"
import { profileHref } from "@/lib/routes"
import { Badge, Card, CardBody, CardHeader, EmptyState, Stat } from "@/components/ui/Card"
import { ProfileHero } from "@/components/ProfileHero"
import { VerificationBanner } from "@/components/VerificationBanner"
import { ShareBar } from "@/components/ShareBar"
import { NotRegistered } from "@/components/NotRegistered"
import { InspectionList } from "@/components/InspectionList"
import { PaymentList } from "@/components/PaymentList"
import { LazyAreaMap as AreaMap } from "@/components/LazyAreaMap"
import { CoordinatesDownload } from "@/components/CoordinatesDownload"

export const revalidate = 300
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; address: string; slug?: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, address: raw } = await params
  const address = parseAddress(raw)
  if (!address) return {}
  const r = await getRegenerator(address)
  if (!r) return {}
  const t = await getTranslations({ locale, namespace: "regenerator" })
  const description = r.description || t("metaDescription", { name: r.name, area: formatArea(r.totalArea, locale), inspections: r.totalInspections })
  const href = `/regenerator/${address}/${slugify(r.name)}`
  const path = getPathname({ locale, href })
  const image = `/api/certificate/regenerator/${address}?lang=${locale}`
  return {
    title: r.name,
    description,
    alternates: { canonical: path, languages: Object.fromEntries(["pt", "en"].map((l) => [l, getPathname({ locale: l, href })])) },
    openGraph: { title: r.name, description, url: path, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: r.name, description, images: [image] },
  }
}

export default async function RegeneratorPage({ params }: Props) {
  const { locale, address: raw, slug } = await params
  setRequestLocale(locale)
  const address = parseAddress(raw)
  if (!address) notFound()

  const r = await getRegenerator(address)
  if (!r) {
    const type = await getUserType(address)
    if (type !== "undefined") redirect(getPathname({ locale, href: profileHref(type, address) }))
    const tr = await getTranslations("roles")
    return <NotRegistered address={address} expected={tr("regenerator")} />
  }

  const canonical = slugify(r.name)
  if (slug?.[0] !== canonical || (slug?.length ?? 0) > 1) redirect(getPathname({ locale, href: `/regenerator/${address}/${canonical}` }))

  const t = await getTranslations("regenerator")
  const tr = await getTranslations("roles")
  const format = await getFormatter()
  const pageUrl = `${site.websiteUrl}${getPathname({ locale, href: `/regenerator/${address}/${canonical}` })}`
  const imageUrl = `/api/certificate/regenerator/${address}?lang=${locale}`
  const realized = r.inspections.filter((i) => i.status === "inspected")

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <VerificationBanner address={address} role={tr("regenerator")} registeredAt={r.registeredAt} />

      <ProfileHero
        address={address}
        name={r.name}
        role={tr("regenerator")}
        photo={r.photo}
        cover={r.areaPhoto}
        description={r.description}
        extra={
          <div className="flex flex-wrap gap-2">
            {r.pendingInspection && <Badge tone="warning">{t("pendingInspection")}</Badge>}
            {r.fullyInvalidated && <Badge tone="danger">{t("invalidated")}</Badge>}
          </div>
        }
      />

      <Card id="certificate">
        <CardHeader title={t("certificateTitle")} subtitle={t("certificateSubtitle")} action={<ShareBar url={pageUrl} title={t("shareTitle", { name: r.name })} imageUrl={imageUrl} />} />
        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Stat icon={<Trophy className="size-5" />} label={t("score")} value={format.number(r.score)} hint={t("scoreHint")} />
            <Stat icon={<ClipboardCheck className="size-5" />} label={t("inspections")} value={format.number(r.totalInspections)} />
            <Stat icon={<Ruler className="size-5" />} label={t("area")} value={formatArea(r.totalArea, locale)} hint={`${formatNumber(r.totalArea, locale)} m²`} />
            <Stat icon={<TreePine className="size-5" />} label={t("treesAverage")} value={format.number(r.treesAverage)} hint={t("averageHint", { count: r.inspections.length })} />
            <Stat icon={<Sprout className="size-5" />} label={t("biodiversityAverage")} value={format.number(r.biodiversityAverage)} hint={t("averageHint", { count: r.inspections.length })} />
          </div>
          <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">{t("scoreNote")}</p>
        </CardBody>
      </Card>

      <Card id="area">
        <CardHeader title={t("areaTitle")} subtitle={t("areaSubtitle", { area: formatArea(r.totalArea, locale), points: r.coordinates.length })} action={<CoordinatesDownload name={r.name} coordinates={r.coordinates} />} />
        <CardBody>
          {r.coordinates.length === 0 ? <EmptyState>{t("noCoordinates")}</EmptyState> : <AreaMap areas={[{ name: r.name, coordinates: r.coordinates }]} />}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <Card className="lg:col-span-2" id="inspections">
          <CardHeader title={t("inspectionsTitle")} subtitle={t("inspectionsSubtitle", { realized: realized.length, total: r.inspections.length })} />
          <CardBody>
            <InspectionList inspections={r.inspections} perspective="regenerator" />
          </CardBody>
        </Card>

        <div className="flex flex-col gap-6">
          <Card id="payments">
            <CardHeader title={t("receivedTitle")} subtitle={t("receivedSubtitle")} />
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-tint text-tint-foreground">
                  <Coins className="size-5" aria-hidden />
                </span>
                <span className="text-2xl font-bold tabular-nums">{formatRc(r.received, locale)}</span>
              </div>
              <PaymentList payments={r.payments} />
            </CardBody>
          </Card>

          <Card id="delations">
            <CardHeader title={t("delationsTitle", { count: r.delations.length })} subtitle={t("delationsSubtitle")} />
            <CardBody>
              {r.delations.length === 0 ? (
                <EmptyState>{t("noDelations")}</EmptyState>
              ) : (
                <ul className="flex flex-col divide-y">
                  {r.delations.map((d) => (
                    <li key={d.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                      <p className="font-medium">{d.title}</p>
                      <p className="text-sm whitespace-pre-line">{d.testimony}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("delationBy", { informer: shortAddress(d.informer) })}
                        {d.timestamp ? ` · ${format.dateTime(new Date(d.timestamp * 1000), { dateStyle: "medium" })}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  )
}
