import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import { About } from "@/components/UserPage/About/About";
import { Hero } from "@/components/UserPage/Hero/Hero";
import { Score } from "@/components/UserPage/Score/Score";
import { getRegenerator } from "@/services/regenerator/getRegenerator";
import type { Metadata } from "next";

const i18nNamespaces = ["regenerator-page"];

type Props = {
  params: Promise<{ locale: string; address: string; name: string }>;
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

  const regenerator = await getRegenerator(address);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main>
        <div className="container mx-auto px-5 py-10 lg:py-20 lg:px-20 flex flex-col items-center gap-3">
          <Hero
            address={address}
            name={regenerator ? regenerator.name : name}
            hashPhoto={regenerator && regenerator.proofPhoto}
            userType={1}
            t={t}
          />

          <About
            aboutText="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
            t={t}
          />

          <Score
            score={regenerator ? regenerator.regenerationScore.score : 0}
            totalArea={regenerator ? regenerator.totalArea : 0}
            totalInspections={regenerator ? regenerator.totalInspections : 0}
            t={t}
          />
        </div>
      </main>
    </TranslationsProvider>
  );
}
