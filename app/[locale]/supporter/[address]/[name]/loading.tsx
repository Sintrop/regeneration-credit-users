import LogoRC from "@/public/assets/images/rc.png";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-5">
      <div className="flex items-center justify-center gap-3">
        <Image
          alt="Logo regeneration credit"
          src={LogoRC}
          width={50}
          height={50}
          quality={100}
        />
        <p className="text-balck font-bold uppercase">Regeneration Credit</p>
      </div>

      <div className="w-10 h-10 bg-green-700 animate-spin" />
    </div>
  );
}
