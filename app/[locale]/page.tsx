import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server"
import { ClipboardCheck, Flame, HeartHandshake, Leaf, Ruler, Sprout, TreePine, Users } from "lucide-react"
import { getDirectory, getOverview, getRecentActivity, getRegenerators, getSupporters } from "@/services/community"
import { formatArea, formatCarbon, formatRc, shortAddress } from "@/lib/format"
import { profileHref } from "@/lib/routes"
import { explorerTx } from "@/config/site"
import { Link } from "@/i18n/navigation"
import { Card, CardBody, CardHeader, Stat } from "@/components/ui/Card"
import { SearchBox } from "@/components/SearchBox"
import { LazyAreaMap as AreaMap } from "@/components/LazyAreaMap"
import { HowToVerify } from "@/components/HowToVerify"
import { Avatar } from "@/components/Avatar"

export const revalidate = 300

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("home")
  const tr = await getTranslations("roles")
  const format = await getFormatter()

  const [overview, directory, regenerators, supporters, activity] = await Promise.all([
    getOverview(),
    getDirectory(),
    getRegenerators(),
    getSupporters(),
    getRecentActivity(8),
  ])
  const names = new Map(directory.map((u) => [u.address.toLowerCase(), u.name]))
  const roleLabels = Object.fromEntries(["regenerator", "supporter", "inspector", "researcher", "developer", "contributor", "activist"].map((k) => [k, tr(k)]))
  const date = (ts: number | null) => (ts ? format.dateTime(new Date(ts * 1000), { dateStyle: "medium" }) : "")

  const areas = regenerators
    .filter((r) => r.coordinates.length > 0)
    .map((r) => ({ name: r.name, href: profileHref("regenerator", r.address, r.name), coordinates: r.coordinates }))

  return (
    <main className="flex flex-col">
      <section className="bg-hero text-hero-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-hero-foreground/70 uppercase">{t("kicker")}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">{t("title")}</h1>
            <p className="mt-3 text-lg text-hero-foreground/80">{t("subtitle")}</p>
          </div>
          <div className="max-w-2xl">
            <SearchBox users={directory} roleLabels={roleLabels} />
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Card>
          <CardHeader title={t("impactTitle")} subtitle={t("impactSubtitle")} />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat icon={<TreePine className="size-5" />} label={t("trees")} value={format.number(overview.trees)} />
              <Stat icon={<Sprout className="size-5" />} label={t("biodiversity")} value={format.number(overview.biodiversity)} />
              <Stat icon={<Leaf className="size-5" />} label={t("carbon")} value={formatCarbon(overview.carbon, locale)} />
              <Stat icon={<Ruler className="size-5" />} label={t("area")} value={formatArea(overview.area, locale)} />
              <Stat icon={<Users className="size-5" />} label={t("regenerators")} value={format.number(overview.regenerators)} />
              <Stat icon={<ClipboardCheck className="size-5" />} label={t("inspections")} value={format.number(overview.inspections)} />
              <Stat icon={<HeartHandshake className="size-5" />} label={t("supporters")} value={format.number(overview.supporters)} />
              <Stat icon={<Flame className="size-5" />} label={t("certified")} value={formatRc(overview.certified, locale, 0)} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t("mapTitle")} subtitle={t("mapSubtitle", { count: areas.length })} />
          <CardBody>
            <AreaMap areas={areas} height={420} />
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <Card>
            <CardHeader
              title={t("topRegenerators")}
              action={
                <Link href="/regenerators" className="text-sm text-link hover:underline">
                  {t("seeAll")}
                </Link>
              }
            />
            <CardBody>
              <ul className="flex flex-col divide-y">
                {regenerators.slice(0, 6).map((r) => (
                  <li key={r.address}>
                    <Link href={profileHref("regenerator", r.address, r.name)} className="flex items-center gap-3 py-2.5 hover:opacity-80">
                      <Avatar address={r.address} photo={r.photo} name={r.name} size={36} />
                      <span className="min-w-0 flex-1 truncate font-medium">{r.name}</span>
                      <span className="shrink-0 text-right text-sm text-muted-foreground">
                        {t("scoreShort", { score: format.number(r.score) })} · {formatArea(r.totalArea, locale)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title={t("topSupporters")}
              action={
                <Link href="/supporters" className="text-sm text-link hover:underline">
                  {t("seeAll")}
                </Link>
              }
            />
            <CardBody>
              <ul className="flex flex-col divide-y">
                {supporters.slice(0, 6).map((s) => (
                  <li key={s.address}>
                    <Link href={profileHref("supporter", s.address, s.name)} className="flex items-center gap-3 py-2.5 hover:opacity-80">
                      <Avatar address={s.address} photo={s.photo} name={s.name} size={36} />
                      <span className="min-w-0 flex-1 truncate font-medium">{s.name}</span>
                      <span className="shrink-0 text-sm font-medium tabular-nums">{formatRc(s.certified, locale, 0)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader title={t("activityTitle")} />
          <CardBody>
            <ul className="flex flex-col divide-y">
              {activity.map((a) => (
                <li key={a.txHash + a.kind} className="flex flex-col gap-1 py-3 text-sm first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  {a.kind === "offset" ? (
                    <span className="flex flex-wrap items-center gap-1.5">
                      <Flame className="size-4 text-brand" aria-hidden />
                      {t.rich("activityOffset", {
                        name: names.get(a.address.toLowerCase()) || shortAddress(a.address),
                        amount: formatRc(a.amount, locale),
                        who: (chunks) => (
                          <Link href={profileHref("supporter", a.address, names.get(a.address.toLowerCase()))} className="font-medium text-link hover:underline">
                            {chunks}
                          </Link>
                        ),
                      })}
                    </span>
                  ) : (
                    <span className="flex flex-wrap items-center gap-1.5">
                      <ClipboardCheck className="size-4 text-brand" aria-hidden />
                      {t.rich("activityInspection", {
                        name: names.get(a.regenerator.toLowerCase()) || shortAddress(a.regenerator),
                        trees: format.number(a.trees),
                        who: (chunks) => (
                          <Link href={profileHref("regenerator", a.regenerator, names.get(a.regenerator.toLowerCase()))} className="font-medium text-link hover:underline">
                            {chunks}
                          </Link>
                        ),
                      })}
                    </span>
                  )}
                  <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                    {date(a.timestamp)}
                    <a href={explorerTx(a.txHash)} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                      {t("tx")}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <HowToVerify />
      </div>
    </main>
  )
}
