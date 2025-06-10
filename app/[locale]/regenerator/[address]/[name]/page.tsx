import type { Metadata } from "next";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import { About } from "@/components/UserPage/About/About";
import { BurnedTokens } from "@/components/UserPage/BurnedTokens/BurnedTokens";
import { Hero } from "@/components/UserPage/Hero/Hero";
import { Score } from "@/components/UserPage/Score/Score";
import { getRegenerator } from "@/services/regenerator/getRegenerator";
import LogoRC from "@/public/assets/images/rc.png";
import Image from "next/image";
import { Inspections } from "@/components/UserPage/Inspections/Inspections";
import { MapArea } from "@/components/UserPage/RegenerationAreaMap/MapArea";

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
        <div className="container mx-auto px-5 pt-10 lg:px-20 flex flex-col">
          <div className="flex items-center justify-center gap-3">
            <Image
              alt="Logo regeneration credit"
              src={LogoRC}
              width={50}
              height={50}
              quality={100}
            />
            <p className="text-balck font-bold uppercase">{t('regenerationCredit')}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <div className="flex flex-col gap-3">
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
                totalInspections={
                  regenerator ? regenerator.totalInspections : 0
                }
                t={t}
              />

              <MapArea t={t} address={address} />

              <Inspections t={t} address={address} />
            </div>

            <div className="flex flex-col gap-3">
              <BurnedTokens address={address} t={t} />
            </div>
          </div>
        </div>
      </main>
    </TranslationsProvider>
  );
}
