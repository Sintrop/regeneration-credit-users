import { ValidationProps } from "@/types/validation";
import { Jazzicon } from "@ukstv/jazzicon-react";

interface Props {
  validation: ValidationProps
}

export function ValidationItem({ validation }: Props) {
  return (
    <div className="flex gap-3">
      <Jazzicon address={validation.validator} className="w-10 h-10"/>
      <div className="flex flex-col">
        <p className="font-semibold">{validation.validator}</p>
        <p>{validation.justification}</p>
      </div>
    </div>
  )
}