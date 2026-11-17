import "server-only"
import { cache } from "react"
import { Result } from "ethers"
import { blockTimestamps, events, readMany } from "@/lib/chain"
import { fromWei } from "@/lib/format"
import { ipfsUrl } from "@/config/site"
import { ContractName } from "@/config/contracts/registry"
import type { UserType } from "./users"

const n = (v: unknown) => (v === null || v === undefined ? 0 : Number(v))
const str = (v: unknown) => (typeof v === "string" ? v : "")

export interface DirectoryUser {
  address: string
  type: Exclude<UserType, "undefined">
  name: string
}

const REGISTRATIONS: { type: DirectoryUser["type"]; contract: ContractName; event: string; addressArg: string }[] = [
  { type: "regenerator", contract: "RegeneratorRules", event: "RegeneratorRegistered", addressArg: "regeneratorAddress" },
  { type: "supporter", contract: "SupporterRules", event: "SupporterRegistered", addressArg: "supporterAddress" },
  { type: "inspector", contract: "InspectorRules", event: "InspectorRegistered", addressArg: "inspectorAddress" },
  { type: "researcher", contract: "ResearcherRules", event: "ResearcherRegistered", addressArg: "researcherAddress" },
  { type: "developer", contract: "DeveloperRules", event: "DeveloperRegistered", addressArg: "developerAddress" },
  { type: "contributor", contract: "ContributorRules", event: "ContributorRegistered", addressArg: "contributorAddress" },
  { type: "activist", contract: "ActivistRules", event: "ActivistRegistered", addressArg: "activistAddress" },
]

/** Every registered user with their name, from the registration events (one eth_getLogs per role). */
export const getDirectory = cache(async (): Promise<DirectoryUser[]> => {
  const lists = await Promise.all(
    REGISTRATIONS.map(async (r) => {
      const logs = await events(r.contract, r.event)
      return logs.map((e) => ({ address: str(e.args[r.addressArg]), type: r.type, name: str(e.args.name) }))
    }),
  )
  return lists.flat()
})

export interface RegeneratorSummary {
  address: string
  name: string
  photo: string | null
  totalArea: number
  score: number
  inspections: number
  invalidated: boolean
  coordinates: { lat: number; lng: number }[]
}

export const getRegenerators = cache(async (): Promise<RegeneratorSummary[]> => {
  const users = (await getDirectory()).filter((u) => u.type === "regenerator")
  const results = await readMany(
    users.flatMap((u) => [
      { contract: "RegeneratorRules" as const, fn: "getRegenerator", args: [u.address] },
      { contract: "RegeneratorRules" as const, fn: "getCoordinates", args: [u.address] },
    ]),
  )
  return users
    .map((u, i) => {
      const r = results[i * 2]?.[0]
      const coords = (results[i * 2 + 1]?.[0] as Result[]) ?? []
      const score = r?.regenerationScore
      return {
        address: u.address,
        name: str(r?.name) || u.name,
        photo: ipfsUrl(str(r?.proofPhoto)),
        totalArea: n(r?.totalArea),
        score: score && typeof score === "object" && "score" in score ? n(score.score) : n(score),
        inspections: n(r?.totalInspections),
        invalidated: Boolean(r?.isFullyInvalidated),
        coordinates: coords
          .map((c) => ({ lat: parseFloat(str(c.latitude)), lng: parseFloat(str(c.longitude)) }))
          .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng)),
      }
    })
    .sort((a, b) => b.score - a.score || b.totalArea - a.totalArea)
})

export interface SupporterSummary {
  address: string
  name: string
  photo: string | null
  certified: number
  offsets: number
}

export const getSupporters = cache(async (): Promise<SupporterSummary[]> => {
  const users = (await getDirectory()).filter((u) => u.type === "supporter")
  const results = await readMany(
    users.flatMap((u) => [
      { contract: "SupporterRules" as const, fn: "getSupporter", args: [u.address] },
      { contract: "RegenerationCredit" as const, fn: "certificate", args: [u.address] },
    ]),
  )
  return users
    .map((u, i) => {
      const s = results[i * 2]?.[0]
      return {
        address: u.address,
        name: str(s?.name) || u.name,
        photo: ipfsUrl(str(s?.profilePhoto)),
        certified: fromWei(results[i * 2 + 1]?.[0]),
        offsets: n(s?.offsetsCount),
      }
    })
    .sort((a, b) => b.certified - a.certified)
})

export interface Overview {
  trees: number
  biodiversity: number
  carbon: number
  area: number
  inspections: number
  regenerators: number
  supporters: number
  users: number
  certified: number
}

export const getOverview = cache(async (): Promise<Overview> => {
  const r = await readMany([
    { contract: "RegenerationCreditImpact", fn: "totalTreesImpact" },
    { contract: "RegenerationCreditImpact", fn: "totalBiodiversityImpact" },
    { contract: "RegenerationCreditImpact", fn: "totalCarbonImpact" },
    { contract: "RegenerationCreditImpact", fn: "totalAreaImpact" },
    { contract: "InspectionRules", fn: "realizedInspectionsCount" },
    { contract: "CommunityRules", fn: "userTypesCount", args: [1] },
    { contract: "CommunityRules", fn: "userTypesCount", args: [7] },
    { contract: "CommunityRules", fn: "usersCount" },
    { contract: "RegenerationCredit", fn: "totalCertified" },
  ])
  return {
    trees: n(r[0]?.[0]),
    biodiversity: n(r[1]?.[0]),
    carbon: n(r[2]?.[0]),
    area: n(r[3]?.[0]),
    inspections: n(r[4]?.[0]),
    regenerators: n(r[5]?.[0]),
    supporters: n(r[6]?.[0]),
    users: n(r[7]?.[0]),
    certified: fromWei(r[8]?.[0]),
  }
})

export type Activity =
  | { kind: "offset"; address: string; amount: number; itemId: number; timestamp: number | null; txHash: string; blockNumber: number }
  | { kind: "inspection"; regenerator: string; inspector: string; trees: number; biodiversity: number; timestamp: number | null; txHash: string; blockNumber: number }

export const getRecentActivity = cache(async (limit = 8): Promise<Activity[]> => {
  const [offsets, inspections] = await Promise.all([events("SupporterRules", "OffsetMade"), events("InspectionRules", "InspectionRealized")])
  const merged: Activity[] = [
    ...offsets.map((e) => ({
      kind: "offset" as const,
      address: str(e.args.supporterAddress),
      amount: fromWei(e.args.amountBurned),
      itemId: n(e.args.calculatorItemId),
      timestamp: null,
      txHash: e.transactionHash,
      blockNumber: e.blockNumber,
    })),
    ...inspections.map((e) => ({
      kind: "inspection" as const,
      regenerator: str(e.args.regeneratorAddress),
      inspector: str(e.args.inspectorAddress),
      trees: n(e.args.treesResult),
      biodiversity: n(e.args.biodiversityResult),
      timestamp: null,
      txHash: e.transactionHash,
      blockNumber: e.blockNumber,
    })),
  ]
    .sort((a, b) => b.blockNumber - a.blockNumber)
    .slice(0, limit)
  const timestamps = await blockTimestamps(merged.map((a) => a.blockNumber))
  return merged.map((a) => ({ ...a, timestamp: timestamps.get(a.blockNumber) ?? null }))
})
