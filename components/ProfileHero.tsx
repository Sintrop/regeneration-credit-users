import Image from "next/image"
import { ReactNode } from "react"
import BgForest from "@/public/assets/images/bg-florest.jpg"
import { Avatar } from "./Avatar"
import { CopyButton } from "./CopyButton"
import { Badge } from "./ui/Card"

interface Props {
  address: string
  name: string
  role: string
  photo: string | null
  cover?: string | null
  description?: string
  extra?: ReactNode
}

export function ProfileHero({ address, name, role, photo, cover, description, extra }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="relative h-36 bg-hero sm:h-48">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- area photo from IPFS
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <Image src={BgForest} alt="" fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover opacity-80" priority />
        )}
      </div>
      <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:gap-5">
        <div className="-mt-12 sm:-mt-14">
          <Avatar address={address} photo={photo} name={name} size={104} className="ring-4" />
        </div>
        <div className="min-w-0 flex-1 sm:pb-1">
          <Badge>{role}</Badge>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight break-words sm:text-3xl">{name}</h1>
          <p className="mt-1 flex items-center gap-1 font-mono text-xs text-muted-foreground sm:text-sm">
            <span className="break-all">{address}</span>
            <CopyButton value={address} />
          </p>
        </div>
        {extra && <div className="sm:pb-1">{extra}</div>}
      </div>
      {description && <p className="border-t px-5 py-4 text-sm leading-relaxed whitespace-pre-line text-foreground/90">{description}</p>}
    </section>
  )
}
