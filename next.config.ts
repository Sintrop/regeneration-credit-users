import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const ipfsHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://ipfs.sintrop.com").hostname
  } catch {
    return "ipfs.sintrop.com"
  }
})()

const nextConfig: NextConfig = {
  images: {
    // only the IPFS gateway goes through the image optimizer
    remotePatterns: [{ protocol: "https", hostname: ipfsHost, pathname: "/ipfs/**" }],
  },
}

export default withNextIntl(nextConfig)
