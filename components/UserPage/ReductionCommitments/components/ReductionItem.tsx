import { getCalculatorCertificates } from "@/services/supporter/getCalculatorCertificates";
import { CalculatorItemProps } from "@/types/researcher";
import { TType } from "@/types/t";

interface Props {
  calculatorItem: CalculatorItemProps;
  t: TType;
  address: string;
}

export async function ReductionItem({ calculatorItem, t, address }: Props) {
  const certificate = await getCalculatorCertificates(
    address,
    calculatorItem.id
  );

  return (
    <div className="flex flex-col py-3 border-b border-gray-300">
      <p className="font-semibold">{calculatorItem.item}</p>

      <div className="flex flex-wrap mt-3 gap-10">
        <ImpactItem
          label={t("carbonImpact")}
          value={Intl.NumberFormat("pt-BR").format(calculatorItem.carbonImpact)}
          suffix="g"
        />

        <ImpactItem
          label={t("totalContributed")}
          value={Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 5,
          }).format(certificate)}
          suffix="RC"
        />
      </div>
    </div>
  );
}

interface ImpactItemProps {
  label: string;
  value: string | number;
  suffix?: string;
}
function ImpactItem({ label, value, suffix }: ImpactItemProps) {
  return (
    <div className="flex flex-col items-center justify-center w-[150px] h-[60px]">
      <p className="font-bold text-green-600 text-xl">
        {value} {suffix && suffix}
      </p>
      <p className="text-center">{label}</p>
    </div>
  );
}
