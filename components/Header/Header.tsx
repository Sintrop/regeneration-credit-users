import Image from "next/image";
import Link from "next/link";

import { TType } from "@/types/t";
import LogoRC from "@/public/assets/images/rc.png";

interface Props {
  t: TType;
}
export function Header({ t }: Props) {
  return (
    <header className="py-5 w-full flex items-center justify-center">
      <Link href="/" className="flex items-center justify-center gap-3">
        <Image
          alt="Logo regeneration credit"
          src={LogoRC}
          width={50}
          height={50}
          quality={100}
        />
        <p className="text-balck font-bold uppercase">
          {t("regenerationCredit")}
        </p>
      </Link>
    </header>
  );
}
