//import { getDescription } from "@/services/regenerator/getDescription";
import { TType } from "@/types/t";

interface Props {
  address: string;
  t: TType;
}

export async function About({ address, t }: Props) {
  //const description = await getDescription(address);

  return (
    <section className="w-full lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200 gap-3 p-5">
      <h3 className="font-bold text-black text-xl">{t('about')}</h3>
      <p className="text-black">{address}</p>
    </section>
  )
}
