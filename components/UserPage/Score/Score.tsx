import { TType } from "@/types/t";

interface Props {
  t: TType;
  score: number;
  totalInspections: number;
  totalArea: number;
}

export function Score({ score, t, totalArea, totalInspections }: Props) {
  return (
    <section className="w-full lg:w-[720px] flex flex-wrap justify-center rounded-2xl overflow-hidden bg-gray-200 gap-10 p-5">
      <ScoreItem
        label={t('score')}
        value={score}
      />

      <ScoreItem
        label={t('inspections')}
        value={totalInspections}
      />

      <ScoreItem
        label={t('totalArea')}
        value={Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(totalArea)}
        suffix="m²"
      />
    </section>
  )
}

interface ScoreItemProps {
  label: string;
  value: number | string;
  suffix?: string
}

function ScoreItem({ label, value, suffix }: ScoreItemProps) {
  return (
    <div className="flex flex-col gap-1 item-center w-[150px]">
      <p className="font-bold text-black text-2xl text-center">{value} {suffix}</p>
      <p className="text-gray-700 text-center">{label}</p>
    </div>
  )
}