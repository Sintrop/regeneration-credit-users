"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Download, Link2, MessageCircle, Share2 } from "lucide-react"

interface Props {
  url: string
  title: string
  imageUrl: string
}

/** Share the public page and download the certificate image. */
export function ShareBar({ url, title, imageUrl }: Props) {
  const t = useTranslations("share")
  const [copied, setCopied] = useState(false)
  const base = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:cursor-pointer"
  const button = `${base} border bg-card hover:bg-muted`

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard not available
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url })
    } catch {
      // cancelled or unsupported
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a href={`${imageUrl}${imageUrl.includes("?") ? "&" : "?"}download=1`} className={`${base} bg-brand font-medium text-brand-foreground hover:bg-brand-strong`}>
        <Download className="size-4" aria-hidden />
        {t("download")}
      </a>
      <button type="button" onClick={copy} className={button}>
        {copied ? <Check className="size-4 text-success" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        {copied ? t("copied") : t("copyLink")}
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" className={button}>
        <MessageCircle className="size-4" aria-hidden />
        WhatsApp
      </a>
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button type="button" onClick={nativeShare} className={button}>
          <Share2 className="size-4" aria-hidden />
          {t("more")}
        </button>
      )}
    </div>
  )
}
