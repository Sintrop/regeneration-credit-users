import type { Metadata } from "next";

import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";

import { SearchInput } from "./components/SearchInput";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

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

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="flex flex-col w-full h-screen justify-between">
        <Header t={t} />

        <main>
          <div className="container mx-auto h-full px-5 lg:px-20 flex flex-col items-center justify-center w-full gap-10">
            <SearchInput />
          </div>
        </main>

        <Footer />
      </div>
    </TranslationsProvider>
  );
}
