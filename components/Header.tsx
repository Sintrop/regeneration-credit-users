import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import LogoRC from "@/public/assets/images/rc.png"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { ThemeToggle } from "./ThemeToggle"

export async function Header() {
  const t = await getTranslations("nav")
  const item = "whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"

  return (
    <header className="z-20 border-b bg-background/90 backdrop-blur md:sticky md:top-0">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={LogoRC} alt="" width={36} height={36} className="size-9" priority />
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight uppercase">{t("brand")}</span>
            <span className="block text-xs text-muted-foreground">{t("subtitle")}</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:order-last">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <nav className="-mx-1 flex w-full overflow-x-auto sm:mx-0 sm:w-auto" aria-label={t("label")}>
          <Link href="/" className={item}>
            {t("home")}
          </Link>
          <Link href="/regenerators" className={item}>
            {t("regenerators")}
          </Link>
          <Link href="/supporters" className={item}>
            {t("supporters")}
          </Link>
          <Link href="/community" className={item}>
            {t("community")}
          </Link>
          <Link href="/#verify" className={item}>
            {t("verify")}
          </Link>
        </nav>
      </div>
    </header>
  )
}
