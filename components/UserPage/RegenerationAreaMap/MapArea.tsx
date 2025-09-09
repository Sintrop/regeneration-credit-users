import { getCoordinates } from "@/services/regenerator/getCoordinates";
import { TType } from "@/types/t";
import { RegenerationAreaMap } from "./RegenerationAreaMap";

interface Props {
  t: TType;
  address: string;
}

export async function MapArea({ address, t }: Props) {
  const coordinates = await getCoordinates(address);

  return (
    <section className="w-full lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200 gap-3 p-5">
      <h3 className="font-bold text-black md:text-xl">
        {t("regenerationArea")}
      </h3>

      {coordinates.length > 0 && <RegenerationAreaMap coords={coordinates} />}

      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-400">{t("coordinates")}</p>
        {coordinates.map((item, index) => (
          <p className="text-black text-sm md:text-base" key={index}>
            Lat: {item.latitude}, Lng: {item.longitude}
          </p>
        ))}
      </div>
    </section>
  );
}
