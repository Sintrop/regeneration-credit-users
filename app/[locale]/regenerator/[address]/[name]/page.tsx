import type { Metadata } from "next";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import { About } from "@/components/UserPage/About/About";
import { Hero } from "@/components/UserPage/Hero/Hero";
import { Score } from "@/components/UserPage/Score/Score";
import { getRegenerator } from "@/services/regenerator/getRegenerator";
import { Inspections } from "@/components/UserPage/Inspections/Inspections";
import { MapArea } from "@/components/UserPage/RegenerationAreaMap/MapArea";
import { UserDelations } from "@/components/UserPage/UserDelations/UserDelations";
import { getProjectDescription } from "@/services/regenerator/getProjectDescription";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

const i18nNamespaces = ["regenerator"];

type Props = {
  params: Promise<{ locale: string; address: string; name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, address } = await params;
  const regenerator = await getRegenerator(address);
  const projectDescription = await getProjectDescription(address);

  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  return {
    title: regenerator.name,
    description: projectDescription,
    openGraph: {
      type: "website",
      title: regenerator.name,
      description: projectDescription,
      alternateLocale: ["en", "pt"],
      url: `${websiteUrl}/${locale}/regenerator/${address}/${regenerator.name}`,
      locale,
      siteName: "Regeneration credit users",
    },
    alternates: {
      canonical: websiteUrl,
      languages: {
        en: `${websiteUrl}/en/regenerator/${address}/${regenerator.name}`,
        pt: `${websiteUrl}/pt/regenerator/${address}/${regenerator.name}`,
      },
    },
  };
}

export default async function SupporterPage({ params }: Props) {
  const { address, locale, name } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  const regenerator = await getRegenerator(address);
  const projectDescription = await getProjectDescription(address);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <Header t={t} />

      <main>
        <div className="container mx-auto px-5 lg:px-20 flex flex-col pb-10">
          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <div className="flex flex-col gap-3 w-[90dvw] lg:w-auto">
              <Hero
                address={address}
                name={regenerator ? regenerator.name : name}
                hashPhoto={regenerator && regenerator.proofPhoto}
                userType={1}
                t={t}
              />

              <About description={projectDescription} t={t} />

              <Score
                score={regenerator ? regenerator.regenerationScore.score : 0}
                totalArea={regenerator ? regenerator.totalArea : 0}
                totalInspections={
                  regenerator ? regenerator.totalInspections : 0
                }
                t={t}
              />

              <MapArea t={t} address={address} />

              <Inspections t={t} address={address} />
            </div>

            <div className="flex flex-col gap-3 w-[90dvw] lg:w-auto">
              <UserDelations address={address} t={t} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </TranslationsProvider>
  );
}
