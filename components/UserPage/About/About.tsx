import { TType } from "@/types/t";

interface Props {
  t: TType;
  description: string;
}

export async function About({ t, description }: Props) {
  return (
    <section className="w-full lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200 gap-3 p-5">
      <h3 className="font-bold text-black text-xl">{t("about")}</h3>
      <p className="text-black">{description}</p>
    </section>
  );
}
