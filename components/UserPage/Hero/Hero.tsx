import { ProofPhoto } from "@/components/ProofPhoto/ProofPhoto";
import { TType } from "@/types/t";
import Image from "next/image";

interface Props {
  address: string;
  name: string;
  hashPhoto?: string
  userType: number;
  t: TType;
}

export function Hero({ address, name, hashPhoto, t, userType }: Props) {
  return (
    <div className="w-full lg:w-[720px] flex flex-col rounded-2xl overflow-hidden bg-gray-200">
      <Image
        alt="hero image"
        width={720}
        height={300}
        className="w-full h-[180px] object-contain"
        src="https://media.licdn.com/dms/image/v2/D4D16AQHeHqc6oE892Q/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1721152808386?e=1755129600&v=beta&t=ybbp_ojxBWTE-8qmGzwj6GyEpb_ikCEsmBgbG7IO4_8"
      />

      <div className="mt-[-100px] flex flex-col p-5">
        <ProofPhoto hash={hashPhoto} address={address} size={120} />

        <section className="mt-5">
          <h1 className="font-bold text-xl">{name}</h1>
          <p className="text-gray-700">
            {userType === 1 ? t('regenerator') : t('supporter')}
          </p>
        </section>
      </div>
    </div>
  )
}