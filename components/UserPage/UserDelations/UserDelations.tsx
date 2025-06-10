import { getDelations } from "@/services/user/getDelations";
import { TType } from "@/types/t";
import { DelationItem } from "./DelationItem";

interface Props {
  t: TType;
  address: string;
}

export async function UserDelations({ address, t }: Props) {
  const delations = await getDelations(address);

  return (
    <section className="w-full lg:w-[300px] flex flex-col items-center rounded-2xl bg-gray-200 p-5">
      <p className="text-gray-400 text-center text-sm">{t("delations")} ({delations.length})</p>

      {delations.length === 0 ? (
        <div className="flex flex-col w-full h-[150px] items-center justify-center">
          <p className="text-gray-400">{t("noDelations")}</p>
        </div>
      ) : (
        <>
          {delations.map((item, index) => (
            <DelationItem key={index} delation={item} />
          ))}
        </>
      )}
    </section>
  );
}
