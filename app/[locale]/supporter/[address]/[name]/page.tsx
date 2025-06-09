import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
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

export default async function RegeneratorPage({ params }: Props) {
  const { address, locale, name } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main>
        <div className="container mx-auto px-5 lg:px-20">
          {address}
          {name}
        </div>
      </main>
    </TranslationsProvider>
  );
}
