import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getSupporters } from "@/services/community"
import { formatRc } from "@/lib/format"
import { profileHref } from "@/lib/routes"
import { DirectoryList } from "@/components/DirectoryList"

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "directory" })
  return { title: t("supportersTitle"), description: t("supportersSubtitle") }
}

export default async function Supporters({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("directory")
  const supporters = await getSupporters()
  const total = supporters.reduce((sum, s) => sum + s.certified, 0)

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("supportersTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("supportersSubtitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("supportersTotal", { count: supporters.length, amount: formatRc(total, locale, 0) })}</p>
      </div>
      <DirectoryList
        items={supporters.map((s) => ({
          address: s.address,
          name: s.name,
          href: profileHref("supporter", s.address, s.name),
          photo: s.photo,
          meta: [formatRc(s.certified, locale), t("offsets", { count: s.offsets })],
        }))}
      />
    </main>
  )
}
