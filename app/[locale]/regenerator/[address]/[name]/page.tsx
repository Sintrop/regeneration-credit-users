import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import { getRegenerator } from "@/services/regenerator/getRegenerator";
import type { Metadata } from "next";

const i18nNamespaces = ["regenerator-page"];

type Props = {
  params: Promise<{ locale: string; address: string; name: string; }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale;
  const { t } = await initTranslations(locale, i18nNamespaces);

  return {
    title: t("seo-title"),
    description: t("seo-description"),
  };
}

export default async function SupporterPage({ params }: Props) {
  const { address, locale, name } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  const regenerator = await getRegenerator(address)

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main>
        <div className="container mx-auto px-5 py-10 lg:py-20 lg:px-20">
          {address}
          {name}
        </div>
      </main>
    </TranslationsProvider>
  );
}
