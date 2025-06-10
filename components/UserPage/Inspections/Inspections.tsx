import { getInspections } from "@/services/regenerator/getInspections";
import { TType } from "@/types/t";
import { InspectionItem } from "./InspectionItem";

interface Props {
  t: TType;
  address: string;
}

export async function Inspections({ address, t }: Props) {
  const inspections = await getInspections(address)

  return (
    <section className="w-full lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200 gap-3 p-5">
      <h3 className="font-bold text-black text-xl">{t('inspections')}</h3>

      {inspections.length === 0 ? (
        <div>

        </div>
      ) : (
        <>
          {inspections.map((item, index) => (
            <InspectionItem
              key={index}
              t={t}
              inspection={item}
            />
          ))}
        </>
      )}
    </section>
  )
}
