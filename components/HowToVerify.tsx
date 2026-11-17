import { getTranslations } from "next-intl/server"
import { QrCode, ScanSearch, ShieldCheck, FileSearch } from "lucide-react"
import { site } from "@/config/site"
import { Card, CardBody, CardHeader } from "./ui/Card"

export async function HowToVerify() {
  const t = await getTranslations("howTo")
  const steps = [
    { icon: QrCode, key: "scan" },
    { icon: ShieldCheck, key: "compare" },
    { icon: FileSearch, key: "history" },
    { icon: ScanSearch, key: "explorer" },
  ]
  return (
    <Card id="verify">
      <CardHeader title={t("title")} subtitle={t("subtitle")} />
      <CardBody>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, key }, i) => (
            <li key={key} className="flex flex-col gap-2 rounded-xl bg-muted p-4">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex size-7 items-center justify-center rounded-full bg-brand text-xs text-brand-foreground">{i + 1}</span>
                <Icon className="size-4 text-brand" aria-hidden />
                {t(`${key}.title`)}
              </span>
              <p className="text-sm text-muted-foreground">{t(`${key}.body`)}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("more")}{" "}
          <a href={site.docsUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
            {t("docs")}
          </a>
        </p>
      </CardBody>
    </Card>
  )
}
