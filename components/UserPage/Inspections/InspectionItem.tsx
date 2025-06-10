import { InspectionProps } from "@/types/inspection";
import { TType } from "@/types/t";
import Image from "next/image";
import Link from "next/link";

interface Props {
  t: TType;
  inspection: InspectionProps;
}

export function InspectionItem({ inspection, t }: Props) {
  return (
    <div className="w-full py-5 border-b border-gray-300 flex flex-col relative">
      <StatusInspection status={inspection.status} t={t} />
      <p>ID: {inspection.id}</p>
      <p>{t('inspector')}: {inspection.inspector}</p>

      <div className="flex items-center gap-10 justify-center mt-3">
        <div className="w-32 h-32 bg-green-400 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center">
          <p className="text-sm">{t('proofPhoto')}</p>
          <Image
            alt="proof photo of inspection"
            src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${inspection.proofPhoto}`}
            width={128}
            height={128}
            className="absolute top-0 left-0"
          />
        </div>

        <ScoreItem
          label={t('treesResult')}
          value={inspection.treesResult}
        />

        <ScoreItem
          label={t('bioResult')}
          value={inspection.biodiversityResult}
        />

        <ScoreItem
          label={t('score')}
          value={inspection.regenerationScore}
        />
      </div>
      
      <div className="flex items-center gap-10 justify-center mt-3">
        <Link
          href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${inspection.report}`}
          target="_blank"
          rel="noreferer noopener"
          className="underline text-blue-600"
        >
          {t('report')}
        </Link>
      </div>
    </div>
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

interface StatusInspectionProps {
  status: number
  t: TType
}
function StatusInspection({ status, t }: StatusInspectionProps) {
  if (status === 2) {
    return (
      <div className="px-5 h-8 flex items-center justify-center rounded-2xl bg-green-700 w-fit absolute top-0 right-0">
        <p className="font-bold text-white">{t('valid')}</p>
      </div>
    )
  }

  if (status === 4) {
    return (
      <div className="px-5 h-8 flex items-center justify-center rounded-2xl bg-red-500 w-fit absolute top-0 right-0">
        <p className="font-bold text-white">{t('invalidated')}</p>
      </div>
    )
  }

  return <div />
}