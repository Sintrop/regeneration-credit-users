import Image from "next/image";
import LogoRC from "@/public/assets/images/rc.png";
import { TType } from "@/types/t";

interface Props {
  t: TType;
}
export function LogoHome({ t }: Props) {
  return (
    <div className="flex items-center gap-5">
      <Image
        src={LogoRC}
        alt="Regeneration credit logo"
        width={70}
        height={70}
        quality={100}
      />

      <div className="flex flex-col items-end">
        <h2 className="text-black font-bold text-3xl">
          {t("regenerationCredit")}
        </h2>
        <p className="font-bold text-gray-600">{t("users")}</p>
      </div>
    </div>
  );
}
