import { Jazzicon } from "@ukstv/jazzicon-react";
import Image from "next/image";

interface Props {
  address: string;
  hash?: string;
  size?: number;
}

export function ProofPhoto({ hash, size = 50, address }: Props) {
  return (
    <div
      className="relative rounded-full overflow-hidden border-2 border-black"
      style={{ width: size, height: size }}
    >
      {hash ? (
        <Image
          alt="profile photo"
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${hash}`}
          className="w-full h-full rounded-full object-cover absoulte top-0 left-0 z-10"
          width={200}
          height={200}
        />
      ) : (
        <Jazzicon
          address={address}
          className={`w-full h-full rounded-full z-0`}
        />
      )}
    </div>
  );
}
