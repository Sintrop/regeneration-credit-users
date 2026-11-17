import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server"
import { Coins, Layers, UserPlus } from "lucide-react"
import { getRole, getUserType, parseAddress, RoleType } from "@/services/users"
import { getDirectory } from "@/services/community"
import { getPathname, Link } from "@/i18n/navigation"
import { profileHref } from "@/lib/routes"
import { formatRc, shortAddress } from "@/lib/format"
import { Card, CardBody, CardHeader, EmptyState, Stat } from "@/components/ui/Card"
import { ProfileHero } from "@/components/ProfileHero"
import { VerificationBanner } from "@/components/VerificationBanner"
import { NotRegistered } from "@/components/NotRegistered"
import { InspectionList } from "@/components/InspectionList"
import { PaymentList } from "@/components/PaymentList"

export const revalidate = 300
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; address: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, address: raw } = await params
  const address = parseAddress(raw)
  if (!address) return {}
  const type = await getUserType(address)
  if (type === "undefined" || type === "supporter" || type === "regenerator") return {}
  const role = await getRole(address, type)
  const t = await getTranslations({ locale, namespace: "roles" })
  return role ? { title: role.name, description: `${role.name} · ${t(type)}` } : {}
}

export default async function UserPage({ params }: Props) {
  const { locale, address: raw } = await params
  setRequestLocale(locale)
  const address = parseAddress(raw)
  if (!address) notFound()

  const type = await getUserType(address)
  if (type === "undefined") return <NotRegistered address={address} />
  if (type === "supporter" || type === "regenerator") redirect(getPathname({ locale, href: profileHref(type, address) }))

  const role = await getRole(address, type as RoleType)
  if (!role) return <NotRegistered address={address} />

  const t = await getTranslations("role")
  const tr = await getTranslations("roles")
  const format = await getFormatter()
  const names = new Map((await getDirectory()).map((u) => [u.address.toLowerCase(), u.name]))

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <VerificationBanner address={address} role={tr(type)} registeredAt={role.registeredAt} />
      <ProfileHero address={address} name={role.name} role={tr(type)} photo={role.photo} />

      <Card>
        <CardHeader title={t("summary")} subtitle={t(`about.${type}`)} />
        <CardBody>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<Layers className="size-5" />} label={t("level")} value={format.number(role.level)} hint={t("levelHint")} />
            {role.stats.map((s) => (
              <Stat key={s.key} label={t(`stats.${s.key}`)} value={format.number(s.value)} />
            ))}
            <Stat icon={<Coins className="size-5" />} label={t("received")} value={formatRc(role.received, locale)} />
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {type === "inspector" && (
            <Card>
              <CardHeader title={t("inspectionsTitle")} subtitle={t("inspectionsSubtitle", { count: role.inspections.length })} />
              <CardBody>
                <InspectionList inspections={role.inspections} perspective="inspector" names={names} />
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title={t("invitedTitle")} subtitle={t("invitedSubtitle", { count: role.invited.length })} />
            <CardBody>
              {role.invited.length === 0 ? (
                <EmptyState>{t("noInvited")}</EmptyState>
              ) : (
                <ul className="flex flex-col divide-y">
                  {role.invited.map((u) => (
                    <li key={u.address} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="flex items-center gap-2">
                        <UserPlus className="size-4 text-muted-foreground" aria-hidden />
                        <Link href={profileHref(u.type, u.address)} className="text-link hover:underline">
                          {names.get(u.address.toLowerCase()) || shortAddress(u.address)}
                        </Link>
                      </span>
                      <span className="text-muted-foreground">{u.type === "undefined" ? t("pending") : tr(u.type)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader title={t("paymentsTitle")} />
          <CardBody>
            <PaymentList payments={role.payments} />
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
