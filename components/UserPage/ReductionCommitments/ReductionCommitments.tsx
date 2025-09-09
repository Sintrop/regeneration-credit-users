//import { getDescription } from "@/services/regenerator/getDescription";
import { getReductionCommitments } from "@/services/supporter/getReductionCommitments";
import { TType } from "@/types/t";
import { ReductionItem } from "./components/ReductionItem";

interface Props {
  address: string;
  t: TType;
}

export async function ReductionCommitments({ address, t }: Props) {
  const response = await getReductionCommitments(address);

  return (
    <section className="w-full lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200 gap-3 p-5">
      <h3 className="font-bold text-black md:text-xl">
        {t("reductionCommitments")}
      </h3>

      {response.length === 0 ? (
        <div>
          <p className="">{t("noReductionCommitments")}</p>
        </div>
      ) : (
        <>
          {response.map((item, index) => (
            <ReductionItem
              key={index}
              address={address}
              calculatorItem={item}
              t={t}
            />
          ))}
        </>
      )}
    </section>
  );
}
