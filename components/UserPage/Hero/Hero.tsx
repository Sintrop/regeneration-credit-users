import Image from "next/image";
import { ProofPhoto } from "@/components/ProofPhoto/ProofPhoto";
import { getAreaPhoto } from "@/services/regenerator/getAreaPhoto";
import { TType } from "@/types/t";
import BgFlorest from "@/public/assets/images/bg-florest.jpg";

interface Props {
  address: string;
  name: string;
  hashPhoto?: string;
  userType: number;
  t: TType;
}

export async function Hero({ address, name, hashPhoto, t, userType }: Props) {
  const areaPhoto = await getAreaPhoto(address);

  return (
    <div className="w-[90dvw] lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200">
      <div className="w-full h-[180px] relative bg-green-600">
        {areaPhoto === "" ? (
          <Image
            alt="hero image"
            width={720}
            height={300}
            className="w-full h-[180px] object-cover"
            src={BgFlorest}
          />
        ) : (
          <Image
            alt="hero image"
            width={720}
            height={300}
            className="w-full h-[180px] object-cover"
            src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${areaPhoto}`}
          />
        )}
      </div>

      <div className="mt-[-100px] flex flex-col p-5">
        <ProofPhoto hash={hashPhoto} address={address} size={120} />

        <section className="mt-5">
          <h1 className="font-bold md:text-xl">{name}</h1>
          <h2 className="text-black md:text-xl max-w-[90dvw] truncate text-ellipsis">
            {address}
          </h2>
          <p className="text-gray-700 text-sm md:text-base">
            {userType === 1 ? t("regenerator") : t("supporter")}
          </p>
        </section>
      </div>
    </div>
  );
}
