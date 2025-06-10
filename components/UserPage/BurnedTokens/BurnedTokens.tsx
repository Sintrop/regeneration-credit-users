import { TType } from "@/types/t";

interface Props {
  t: TType;
  address: string;
}

export function BurnedTokens({ address, t }: Props) {
  return (
    <section className="w-full lg:w-[300px] h-[200px] flex flex-col justify-center items-center rounded-2xl bg-gray-200 p-5">
      <p className="text-center text-gray-500">{t('burnedTokens')}</p>

      <p className="font-bold text-green-600 text-5xl mt-10">1.600 RC</p>
    </section>
  )
}