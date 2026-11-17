import type { Metadata } from "next"
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server"
import { getRegenerators } from "@/services/community"
import { formatArea } from "@/lib/format"
import { profileHref } from "@/lib/routes"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { DirectoryList } from "@/components/DirectoryList"
import { LazyAreaMap as AreaMap } from "@/components/LazyAreaMap"

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "directory" })
  return { title: t("regeneratorsTitle"), description: t("regeneratorsSubtitle") }
}

export default async function Regenerators({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("directory")
  const format = await getFormatter()
  const regenerators = await getRegenerators()

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("regeneratorsTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("regeneratorsSubtitle")}</p>
      </div>
      <Card>
        <CardHeader title={t("mapTitle")} subtitle={t("count", { count: regenerators.length })} />
        <CardBody>
          <AreaMap
            areas={regenerators.filter((r) => r.coordinates.length).map((r) => ({ name: r.name, href: profileHref("regenerator", r.address, r.name), coordinates: r.coordinates }))}
            height={380}
          />
        </CardBody>
      </Card>
      <DirectoryList
        items={regenerators.map((r) => ({
          address: r.address,
          name: r.name,
          href: profileHref("regenerator", r.address, r.name),
          photo: r.photo,
          meta: [t("regeneratorMeta", { score: format.number(r.score), inspections: r.inspections }), formatArea(r.totalArea, locale)],
          badge: r.invalidated ? t("invalidated") : undefined,
        }))}
      />
    </main>
  )
}
