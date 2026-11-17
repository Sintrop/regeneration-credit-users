import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getDirectory } from "@/services/community"
import { profileHref } from "@/lib/routes"
import { DirectoryList } from "@/components/DirectoryList"

export const revalidate = 300

const ORDER = ["inspector", "activist", "researcher", "developer", "contributor"] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "directory" })
  return { title: t("communityTitle"), description: t("communitySubtitle") }
}

export default async function Community({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("directory")
  const tr = await getTranslations("roles")
  const tp = await getTranslations("role")
  const directory = await getDirectory()

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("communityTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("communitySubtitle")}</p>
      </div>
      {ORDER.map((type) => {
        const users = directory.filter((u) => u.type === type)
        if (users.length === 0) return null
        return (
          <section key={type} className="flex flex-col gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                {tr(`${type}_plural`)} <span className="text-muted-foreground">({users.length})</span>
              </h2>
              <p className="text-sm text-muted-foreground">{tp(`about.${type}`)}</p>
            </div>
            <DirectoryList items={users.map((u) => ({ address: u.address, name: u.name, href: profileHref(u.type, u.address), meta: [tr(type)] }))} />
          </section>
        )
      })}
    </main>
  )
}
