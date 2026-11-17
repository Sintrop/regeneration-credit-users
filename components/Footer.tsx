import { getTranslations } from "next-intl/server"
import { BookText, Earth, Github, Search } from "lucide-react"
import { site } from "@/config/site"

export async function Footer() {
  const t = await getTranslations("footer")
  const links = [
    { href: site.mainSiteUrl, label: t("website"), icon: Earth },
    { href: site.explorerUrl, label: t("explorer"), icon: Search },
    { href: site.docsUrl, label: t("docs"), icon: BookText },
    { href: site.githubUrl, label: "GitHub", icon: Github },
  ]
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="max-w-md">{t("note")}</p>
        <nav className="flex flex-wrap gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-muted hover:text-foreground">
              <Icon className="size-4" aria-hidden />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
