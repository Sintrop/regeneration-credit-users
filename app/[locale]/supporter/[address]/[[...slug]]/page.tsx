import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server"
import { ExternalLink, Flame, HandCoins, Leaf, Ruler, Sprout, TreePine } from "lucide-react"
import { getSupporter, getUserType, parseAddress } from "@/services/users"
import { explorerTx, site } from "@/config/site"
import { formatArea, formatCarbon, formatImpact, formatNumber, formatRc, slugify } from "@/lib/format"
import { getPathname } from "@/i18n/navigation"
import { Card, CardBody, CardHeader, EmptyState, Stat } from "@/components/ui/Card"
import { ProfileHero } from "@/components/ProfileHero"
import { VerificationBanner } from "@/components/VerificationBanner"
import { ShareBar } from "@/components/ShareBar"
import { NotRegistered } from "@/components/NotRegistered"
import { profileHref } from "@/lib/routes"

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
  const supporter = await getSupporter(address)
  if (!supporter) return {}
  const t = await getTranslations({ locale, namespace: "supporter" })
  const description = t("metaDescription", {
    name: supporter.name,
    amount: formatRc(supporter.certified, locale),
    carbon: formatCarbon(supporter.certified * supporter.perToken.carbon, locale),
  })
  const path = getPathname({ locale, href: `/supporter/${address}/${slugify(supporter.name)}` })
  const image = `/api/certificate/supporter/${address}?lang=${locale}`
  return {
    title: supporter.name,
    description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(["pt", "en"].map((l) => [l, getPathname({ locale: l, href: `/supporter/${address}/${slugify(supporter.name)}` })])),
    },
    openGraph: { title: supporter.name, description, url: path, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: supporter.name, description, images: [image] },
  }
}

export default async function SupporterPage({ params }: Props) {
  const { locale, address: raw, slug } = await params
  setRequestLocale(locale)
  const address = parseAddress(raw)
  if (!address) notFound()

  const supporter = await getSupporter(address)
  if (!supporter) {
    // a QR code or link may point to the wrong profile type: send it to the right one
    const type = await getUserType(address)
    if (type !== "undefined") redirect(getPathname({ locale, href: profileHref(type, address) }))
    const tr = await getTranslations("roles")
    return <NotRegistered address={address} expected={tr("supporter")} />
  }

  const canonical = slugify(supporter.name)
  if (slug?.[0] !== canonical || (slug?.length ?? 0) > 1) redirect(getPathname({ locale, href: `/supporter/${address}/${canonical}` }))

  const t = await getTranslations("supporter")
  const tr = await getTranslations("roles")
  const format = await getFormatter()
  const p = supporter.perToken
  const c = supporter.certified
  const pageUrl = `${site.websiteUrl}${getPathname({ locale, href: `/supporter/${address}/${canonical}` })}`
  const imageUrl = `/api/certificate/supporter/${address}?lang=${locale}`

  const impact = [
    { key: "carbon", value: formatCarbon(c * p.carbon, locale), perToken: formatCarbon(p.carbon, locale), icon: <Leaf className="size-5" /> },
    { key: "trees", value: formatImpact(c * p.trees, locale), perToken: formatNumber(p.trees, locale, 6), icon: <TreePine className="size-5" /> },
    { key: "biodiversity", value: formatImpact(c * p.biodiversity, locale), perToken: formatNumber(p.biodiversity, locale, 6), icon: <Sprout className="size-5" /> },
    { key: "area", value: formatArea(c * p.area, locale), perToken: formatArea(p.area, locale), icon: <Ruler className="size-5" /> },
  ]

  // totals per calculator item, from the offsets
  const byItem = new Map<number, number>()
  supporter.offsets.forEach((o) => byItem.set(o.itemId, (byItem.get(o.itemId) ?? 0) + o.amount))

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <VerificationBanner address={address} role={tr("supporter")} registeredAt={supporter.registeredAt} />

      <ProfileHero address={address} name={supporter.name} role={tr("supporter")} photo={supporter.photo} description={supporter.description} />

      <Card id="certificate">
        <CardHeader title={t("certificateTitle")} subtitle={t("certificateSubtitle")} action={<ShareBar url={pageUrl} title={t("shareTitle", { name: supporter.name })} imageUrl={imageUrl} />} />
        <CardBody className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">{t("contributedWith")}</p>
            <p className="text-4xl font-bold tracking-tight text-brand sm:text-5xl">{formatRc(c, locale)}</p>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">{t("fundingImpactOf")}</p>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {impact.map((item) => (
                <Stat key={item.key} icon={item.icon} label={t(`impact.${item.key}`)} value={item.value} hint={t("perToken", { value: item.perToken })} />
              ))}
            </div>
          </div>
          <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">{t("impactNote")}</p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <Card className="lg:col-span-2" id="offsets">
          <CardHeader title={t("offsetsTitle")} subtitle={t("offsetsSubtitle", { count: supporter.offsets.length })} />
          <CardBody>
            {supporter.offsets.length === 0 ? (
              <EmptyState>{t("noOffsets")}</EmptyState>
            ) : (
              <ol className="flex flex-col divide-y">
                {supporter.offsets.map((o) => (
                  <li key={o.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2 text-sm">
                        <Flame className="size-4 text-brand" aria-hidden />
                        <span className="font-semibold tabular-nums">{formatRc(o.amount, locale)}</span>
                        <span className="text-muted-foreground">·</span>
                        <span>{supporter.items[o.itemId]?.item ?? t("unknownItem", { id: o.itemId })}</span>
                      </p>
                      {o.message && <p className="mt-1 text-sm text-muted-foreground italic">“{o.message}”</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                      <span>{o.timestamp ? format.dateTime(new Date(o.timestamp * 1000), { dateStyle: "medium" }) : `#${o.blockNumber}`}</span>
                      <a href={explorerTx(o.txHash)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-link hover:underline">
                        {t("viewTx")}
                        <ExternalLink className="size-3" aria-hidden />
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {supporter.directBurns > 0.000001 && (
              <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">{t("directBurns", { amount: formatRc(supporter.directBurns, locale) })}</p>
            )}
          </CardBody>
        </Card>

        <div className="flex flex-col gap-6">
          {byItem.size > 0 && (
            <Card>
              <CardHeader title={t("byItemTitle")} />
              <CardBody>
                <ul className="flex flex-col gap-3">
                  {[...byItem.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .map(([itemId, amount]) => (
                      <li key={itemId} className="flex flex-col gap-1">
                        <div className="flex justify-between gap-2 text-sm">
                          <span>{supporter.items[itemId]?.item ?? `#${itemId}`}</span>
                          <span className="font-medium tabular-nums">{formatRc(amount, locale, 0)}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${(amount / supporter.offsetsTotal) * 100}%` }} />
                        </div>
                      </li>
                    ))}
                </ul>
              </CardBody>
            </Card>
          )}

          <Card id="commitments">
            <CardHeader title={t("commitmentsTitle")} subtitle={t("commitmentsSubtitle")} />
            <CardBody>
              {supporter.commitments.length === 0 ? (
                <EmptyState>{t("noCommitments")}</EmptyState>
              ) : (
                <ul className="flex flex-col divide-y">
                  {supporter.commitments.map((item) => (
                    <li key={item.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                      <p className="font-medium">{item.item}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("carbonPerUnit", { value: formatCarbon(item.carbonImpact, locale), unit: item.unit })}
                      </p>
                      <p className="text-sm">{t("contributedToItem", { amount: formatRc(item.contributed, locale) })}</p>
                      {item.thesis && (
                        <details className="text-sm text-muted-foreground">
                          <summary className="cursor-pointer hover:text-foreground">{t("thesis")}</summary>
                          <p className="mt-1 whitespace-pre-line">{item.thesis}</p>
                        </details>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          {supporter.commissions.count > 0 && (
            <Card>
              <CardBody className="flex items-start gap-3">
                <HandCoins className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <p className="text-sm">{t("commissions", { amount: formatRc(supporter.commissions.total, locale), count: supporter.commissions.count })}</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
