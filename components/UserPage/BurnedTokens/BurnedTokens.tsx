import { getBioPerToken } from "@/services/supporter/getBioPerToken";
import { getBurnedTokens } from "@/services/supporter/getBurnedTokens";
import { getCarbonPerToken } from "@/services/supporter/getCarbonPerTokens";
import { getSoilPerToken } from "@/services/supporter/getSoilPerToken";
import { getTreesPerToken } from "@/services/supporter/getTreesPerToken";
import { TType } from "@/types/t";

interface Props {
  t: TType;
  address: string;
}

export async function BurnedTokens({ address, t }: Props) {
  const burnedTokens = await getBurnedTokens(address);
  const carbonPerToken = await getCarbonPerToken();
  const bioPerToken = await getBioPerToken();
  const treesPerToken = await getTreesPerToken();
  const soilPerToken = await getSoilPerToken();

  return (
    <section className="w-full lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200 gap-3 p-5">
      <h3 className="font-bold text-black text-xl">{t("contributedWith")}</h3>

      <div className="flex flex-wrap mt-5">
        <div className="w-full lg:w-[50%]">
          <p className="font-bold text-green-600 text-5xl">
            {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(burnedTokens)} RC
          </p>
        </div>

        <div className="w-full lg:w-[50%]">
          <p className="text-gray-400">{t('impact')}</p>

          <div className="flex flex-wrap justify-around">
            <ImpactItem
              label={t('carbon')}
              value={Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(burnedTokens * carbonPerToken)}
              suffix="g"
            />
            <ImpactItem
              label={t('bio')}
              value={Intl.NumberFormat('pt-BR', {maximumFractionDigits: 3}).format(burnedTokens * bioPerToken)}
            />
            <ImpactItem
              label={t('trees')}
              value={Intl.NumberFormat('pt-BR', {maximumFractionDigits: 3}).format(burnedTokens * treesPerToken)}
            />
            <ImpactItem
              label={t('soil')}
              value={Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(burnedTokens * soilPerToken)}
              suffix="m²"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface ImpactItemProps {
  label: string;
  value: string | number;
  suffix?: string;
}
function ImpactItem({ label, value, suffix }: ImpactItemProps) {
  return (
    <div className="flex flex-col items-center justify-center w-[120px] h-[100px]">
      <p className="font-bold text-green-600 text-xl">{value} {suffix && suffix}</p>
      <p>{label}</p>
    </div>
  )
}
