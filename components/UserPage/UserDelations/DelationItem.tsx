import { DelationProps } from "@/types/user"
import { Jazzicon } from "@ukstv/jazzicon-react"

interface Props {
  delation: DelationProps
}

export function DelationItem({ delation }: Props) {
  return (
    <div className="w-full py-3 border-b border-gray-300 flex flex-col">
      <div className="flex gap-2">
        <Jazzicon address={delation.informer} className="w-10 h-10"/>
        <div className="flex flex-col max-w-[80%]">
          <p className="text-sm text-gray-400">#{delation.id}</p>
          <p className="text-sm text-ellipsis truncate">{delation.informer}</p>
        </div>
      </div>

      <div className="flex flex-col mt-2">
        <p className="font-bold">{delation.title}</p>
        <p>{delation.testimony}</p>
      </div>
    </div>
  )
}