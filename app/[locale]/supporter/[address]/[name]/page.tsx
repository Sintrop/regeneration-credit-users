import type { Metadata } from "next";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import { getSupporter } from "@/services/supporter/getSupporter";
import { Hero } from "@/components/UserPage/Hero/Hero";
import { BurnedTokens } from "@/components/UserPage/BurnedTokens/BurnedTokens";
import { About } from "@/components/UserPage/About/About";
import { ReductionCommitments } from "@/components/UserPage/ReductionCommitments/ReductionCommitments";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

const i18nNamespaces = ["supporter"];

type Props = {
  params: Promise<{ locale: string; address: string; name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, address } = await params;

  const supporter = await getSupporter(address);

  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  return {
    title: supporter.name,
    description: supporter.description,
    openGraph: {
      type: "website",
      title: supporter.name,
      description: supporter.description,
      alternateLocale: ["en", "pt"],
      url: `${websiteUrl}/${locale}/supporter/${address}/${supporter.name}`,
      locale,
      siteName: "Regeneration credit users",
    },
    alternates: {
      canonical: websiteUrl,
      languages: {
        en: `${websiteUrl}/en/supporter/${address}/${supporter.name}`,
        pt: `${websiteUrl}/pt/supporter/${address}/${supporter.name}`,
      },
    },
  };
}

export default async function SupporterPage({ params }: Props) {
  const { address, locale, name } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  const supporter = await getSupporter(address);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <Header t={t} />
      <main>
        <div className="md:container md:mx-auto px-5 lg:px-20 flex flex-col pb-10">
          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <div className="flex flex-col gap-3">
              <Hero
                address={address}
                name={supporter ? supporter.name : name}
                hashPhoto={supporter && supporter.profilePhoto}
                userType={7}
                t={t}
              />

              <About t={t} description={supporter.description} />

              <BurnedTokens address={address} t={t} />

              <ReductionCommitments address={address} t={t} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </TranslationsProvider>
  );
}
