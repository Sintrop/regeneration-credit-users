import type { Metadata } from "next";
import Image from "next/image";
import LogoRC from "@/public/assets/images/rc.png";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import { getSupporter } from "@/services/supporter/getSupporter";
import { Hero } from "@/components/UserPage/Hero/Hero";
import { BurnedTokens } from "@/components/UserPage/BurnedTokens/BurnedTokens";
import { About } from "@/components/UserPage/About/About";
import { ReductionCommitments } from "@/components/UserPage/ReductionCommitments/ReductionCommitments";
import Link from "next/link";

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

  const supporter = await getSupporter(address);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main>
        <div className="container mx-auto px-5 pt-10 lg:px-20 flex flex-col pb-10">
          <Link href="/" className="flex items-center justify-center gap-3">
            <Image
              alt="Logo regeneration credit"
              src={LogoRC}
              width={50}
              height={50}
              quality={100}
            />
            <p className="text-balck font-bold uppercase">
              {t("regenerationCredit")}
            </p>
          </Link>

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
    </TranslationsProvider>
  );
}
