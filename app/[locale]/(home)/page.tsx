import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import type { Metadata } from "next";

const i18nNamespaces = ["home"];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale;
  const { t } = await initTranslations(locale, i18nNamespaces);

  return {
    title: t("seo-title"),
    description: t("seo-description"),
  };
}

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main>
        <div className="container mx-auto px-5 lg:px-20">
          teste
        </div>
      </main>
    </TranslationsProvider>
  );
}
