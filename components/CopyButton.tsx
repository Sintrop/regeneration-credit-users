"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Copy } from "lucide-react"

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const t = useTranslations("common")
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? t("copied") : (label ?? t("copy"))}
      title={copied ? t("copied") : (label ?? t("copy"))}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:cursor-pointer hover:bg-muted hover:text-foreground"
    >
      {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
    </button>
  )
}
