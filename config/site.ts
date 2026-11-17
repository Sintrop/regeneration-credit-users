const trim = (value: string | undefined, fallback: string) => (value ?? fallback).replace(/\/+$/, "")

export const site = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.sintrop.com",
  ipfsGateway: trim(process.env.NEXT_PUBLIC_IPFS_GATEWAY, "https://ipfs.sintrop.com"),
  explorerUrl: trim(process.env.NEXT_PUBLIC_EXPLORER_URL, "https://explorer.sintrop.com"),
  websiteUrl: trim(process.env.NEXT_PUBLIC_WEBSITE_URL, "https://users.regenerationcredit.org"),
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "",
  mainSiteUrl: "https://regenerationcredit.org",
  docsUrl: "https://docs.regenerationcredit.org",
  githubUrl: "https://github.com/Sintrop/regeneration-credit",
  /** pages are rebuilt in the background at most this often (seconds) */
  revalidate: 300,
}

export const ipfsUrl = (hash?: string | null) => (hash ? `${site.ipfsGateway}/ipfs/${hash}` : null)
export const explorerTx = (hash: string) => `${site.explorerUrl}/tx/${hash}`
export const explorerAddress = (address: string) => `${site.explorerUrl}/address/${address}`
export const explorerBlock = (block: number) => `${site.explorerUrl}/block/${block}`
