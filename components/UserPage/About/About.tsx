import { TType } from "@/types/t";

interface Props {
  aboutText: string;
  t: TType;
}

export function About({ aboutText, t }: Props) {
  return (
    <section className="w-full lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200 gap-3 p-5">
      <h3 className="font-bold text-black text-xl">{t('about')}</h3>
      <p className="text-black">{aboutText}</p>
    </section>
  )
}
