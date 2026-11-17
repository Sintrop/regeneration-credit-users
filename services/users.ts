import "server-only"
import { cache } from "react"
import { Result } from "ethers"
import { blockTimestamps, events, read, readMany, Read } from "@/lib/chain"
import { fromWei, toChecksum } from "@/lib/format"
import { ipfsUrl } from "@/config/site"
import { contract, ContractName } from "@/config/contracts/registry"

export const USER_TYPES = ["undefined", "regenerator", "inspector", "researcher", "developer", "contributor", "activist", "supporter"] as const
export type UserType = (typeof USER_TYPES)[number]
export type RoleType = Exclude<UserType, "undefined" | "regenerator" | "supporter">

const n = (v: unknown) => (v === null || v === undefined ? 0 : Number(v))
const str = (v: unknown) => (typeof v === "string" ? v : "")

export const getUserType = cache(async (address: string): Promise<UserType> => {
  const [type] = await read("CommunityRules", "getUser", [address])
  return USER_TYPES[n(type)] ?? "undefined"
})

export interface ImpactPerToken {
  carbon: number
  trees: number
  biodiversity: number
  area: number
}

export const getImpactPerToken = cache(async (): Promise<ImpactPerToken> => {
  const [carbon, trees, biodiversity, area] = await readMany(
    ["carbonPerToken", "treesPerToken", "biodiversityPerToken", "areaPerToken"].map((fn) => ({ contract: "RegenerationCreditImpact" as const, fn })),
  )
  // values come scaled by 1e18, the same way the apps read them for the certificates
  return {
    carbon: fromWei(carbon?.[0]),
    trees: fromWei(trees?.[0]),
    biodiversity: fromWei(biodiversity?.[0]),
    area: fromWei(area?.[0]),
  }
})

/* ------------------------------------------------------------------ supporter */

export interface CalculatorItem {
  id: number
  item: string
  unit: string
  thesis: string
  carbonImpact: number
  createdBy: string
}

export interface Offset {
  id: number
  amount: number
  itemId: number
  message: string
  blockNumber: number
  timestamp: number | null
  txHash: string
}

export interface Commitment extends CalculatorItem {
  contributed: number
}

export interface SupporterData {
  address: string
  name: string
  description: string
  photo: string | null
  registeredBlock: number
  registeredAt: number | null
  certified: number
  perToken: ImpactPerToken
  offsets: Offset[]
  offsetsTotal: number
  directBurns: number
  items: Record<number, CalculatorItem>
  commitments: Commitment[]
  commissions: { total: number; count: number }
}

async function calculatorItems(ids: number[]): Promise<Record<number, CalculatorItem>> {
  const unique = [...new Set(ids)].filter((id) => id > 0)
  const results = await readMany(unique.map((id) => ({ contract: "ResearcherRules" as const, fn: "getCalculatorItem", args: [id] })))
  const items: Record<number, CalculatorItem> = {}
  results.forEach((r, i) => {
    const item = r?.[0]
    if (!item) return
    items[unique[i]] = {
      id: unique[i],
      item: str(item.item),
      unit: str(item.unit),
      thesis: str(item.thesis),
      carbonImpact: n(item.carbonImpact),
      createdBy: str(item.createdBy),
    }
  })
  return items
}

export const getSupporter = cache(async (address: string): Promise<SupporterData | null> => {
  const [supporterRes, certificateRes, commitmentsRes] = await readMany([
    { contract: "SupporterRules", fn: "getSupporter", args: [address] },
    { contract: "RegenerationCredit", fn: "certificate", args: [address] },
    { contract: "SupporterRules", fn: "getReductionCommitments", args: [address] },
  ])
  const s = supporterRes?.[0]
  if (!s || n(s.id) === 0) return null

  const [perToken, offsetEvents, commissionEvents] = await Promise.all([
    getImpactPerToken(),
    events("SupporterRules", "OffsetMade", [address]),
    events("SupporterRules", "CommissionsPaid", [null, address]),
  ])

  const commitmentIds = ((commitmentsRes?.[0] as unknown[]) ?? []).map(n)
  const offsets: Offset[] = offsetEvents
    .map((e) => ({
      id: n(e.args.offsetId),
      amount: fromWei(e.args.amountBurned),
      itemId: n(e.args.calculatorItemId),
      message: str(e.args.message),
      blockNumber: e.blockNumber,
      timestamp: null as number | null,
      txHash: e.transactionHash,
    }))
    .reverse()

  const [items, certificates, timestamps] = await Promise.all([
    calculatorItems([...offsets.map((o) => o.itemId), ...commitmentIds]),
    readMany(commitmentIds.map((id) => ({ contract: "SupporterRules" as const, fn: "calculatorItemCertificates", args: [address, id] }))),
    blockTimestamps([...offsets.map((o) => o.blockNumber), n(s.createdAt)]),
  ])
  offsets.forEach((o) => (o.timestamp = timestamps.get(o.blockNumber) ?? null))

  const certified = fromWei(certificateRes?.[0])
  const offsetsTotal = offsets.reduce((sum, o) => sum + o.amount, 0)

  return {
    address,
    name: str(s.name),
    description: str(s.description),
    photo: ipfsUrl(str(s.profilePhoto)),
    registeredBlock: n(s.createdAt),
    registeredAt: timestamps.get(n(s.createdAt)) ?? null,
    certified,
    perToken,
    offsets,
    offsetsTotal,
    // burns made with RegenerationCredit.burnTokens, outside SupporterRules.offset
    directBurns: Math.max(0, certified - offsetsTotal),
    items,
    commitments: commitmentIds
      .filter((id) => items[id])
      .map((id, i) => ({ ...items[id], contributed: fromWei(certificates[i]?.[0]) })),
    commissions: {
      total: commissionEvents.reduce((sum, e) => sum + fromWei(e.args.amount), 0),
      count: commissionEvents.length,
    },
  }
})

/* ---------------------------------------------------------------- regenerator */

export type InspectionStatus = "open" | "accepted" | "inspected" | "invalidated"
const INSPECTION_STATUS: InspectionStatus[] = ["open", "accepted", "inspected", "invalidated"]

export interface Inspection {
  id: number
  status: InspectionStatus
  regenerator: string
  inspector: string | null
  inspectorName: string | null
  trees: number
  biodiversity: number
  score: number
  photosUrl: string | null
  reportUrl: string | null
  createdBlock: number
  inspectedBlock: number
  invalidatedBlock: number
  createdAt: number | null
  inspectedAt: number | null
  invalidatedAt: number | null
}

export interface Delation {
  id: number
  informer: string
  title: string
  testimony: string
  block: number
  timestamp: number | null
}

export interface PoolPayment {
  amount: number
  blockNumber: number
  timestamp: number | null
  txHash: string
}

export interface RegeneratorData {
  address: string
  name: string
  description: string
  photo: string | null
  areaPhoto: string | null
  totalArea: number
  score: number
  totalInspections: number
  pendingInspection: boolean
  fullyInvalidated: boolean
  registeredBlock: number
  registeredAt: number | null
  coordinates: { lat: number; lng: number }[]
  inspections: Inspection[]
  treesAverage: number
  biodiversityAverage: number
  payments: PoolPayment[]
  received: number
  delations: Delation[]
}

const ZERO = "0x0000000000000000000000000000000000000000"

function scoreOf(value: unknown): number {
  // regenerationScore is a struct ({ score }) in the deployed ABI
  if (value && typeof value === "object" && "score" in (value as Record<string, unknown>)) return n((value as { score: unknown }).score)
  if (Array.isArray(value)) return n(value[0])
  return n(value)
}

async function poolPayments(pool: ContractName, address: string): Promise<PoolPayment[]> {
  const transfers = await events("RegenerationCredit", "Transfer", [contract(pool).address, address])
  const timestamps = await blockTimestamps(transfers.map((t) => t.blockNumber))
  return transfers
    .map((t) => ({
      amount: fromWei(t.args.value),
      blockNumber: t.blockNumber,
      timestamp: timestamps.get(t.blockNumber) ?? null,
      txHash: t.transactionHash,
    }))
    .reverse()
}

function parseInspection(raw: Result, id: number): Omit<Inspection, "inspectorName" | "createdAt" | "inspectedAt" | "invalidatedAt"> {
  const inspector = str(raw.inspector)
  return {
    id,
    status: INSPECTION_STATUS[n(raw.status)] ?? "open",
    regenerator: str(raw.regenerator),
    inspector: inspector && inspector !== ZERO ? inspector : null,
    trees: n(raw.treesResult),
    biodiversity: n(raw.biodiversityResult),
    score: n(raw.regenerationScore),
    photosUrl: ipfsUrl(str(raw.proofPhotos)),
    reportUrl: ipfsUrl(str(raw.justificationReport)),
    createdBlock: n(raw.createdAt),
    inspectedBlock: n(raw.inspectedAt),
    invalidatedBlock: n(raw.invalidatedAt),
  }
}

/** Inspections by id with inspector names and dates. */
export async function getInspections(ids: number[]): Promise<Inspection[]> {
  const raws = await readMany(ids.map((id) => ({ contract: "InspectionRules" as const, fn: "getInspection", args: [id] })))
  const parsed = raws.map((r, i) => (r?.[0] ? parseInspection(r[0], ids[i]) : null)).filter((x): x is NonNullable<typeof x> => !!x)

  const inspectors = [...new Set(parsed.map((p) => p.inspector).filter((a): a is string => !!a))]
  const [names, timestamps] = await Promise.all([
    readMany(inspectors.map((a) => ({ contract: "InspectorRules" as const, fn: "getInspector", args: [a] }))),
    blockTimestamps(parsed.flatMap((p) => [p.createdBlock, p.inspectedBlock, p.invalidatedBlock])),
  ])
  const nameOf = new Map(inspectors.map((a, i) => [a.toLowerCase(), str(names[i]?.[0]?.name) || null]))

  return parsed.map((p) => ({
    ...p,
    inspectorName: p.inspector ? (nameOf.get(p.inspector.toLowerCase()) ?? null) : null,
    createdAt: timestamps.get(p.createdBlock) ?? null,
    inspectedAt: timestamps.get(p.inspectedBlock) ?? null,
    invalidatedAt: timestamps.get(p.invalidatedBlock) ?? null,
  }))
}

export const getRegenerator = cache(async (address: string): Promise<RegeneratorData | null> => {
  const [regRes, descRes, areaPhotoRes, coordsRes, historyRes, delationIdsRes] = await readMany([
    { contract: "RegeneratorRules", fn: "getRegenerator", args: [address] },
    { contract: "RegeneratorRules", fn: "projectDescriptions", args: [address] },
    { contract: "RegeneratorRules", fn: "areaPhoto", args: [address] },
    { contract: "RegeneratorRules", fn: "getCoordinates", args: [address] },
    { contract: "InspectionRules", fn: "getInspectionsHistory", args: [address] },
    { contract: "CommunityRules", fn: "getUserDelations", args: [address] },
  ])
  const r = regRes?.[0]
  if (!r || n(r.id) === 0) return null

  const ids = ((historyRes?.[0] as unknown[]) ?? []).map(n)
  const delationIds = ((delationIdsRes?.[0] as unknown[]) ?? []).map(n)

  const [inspections, payments, delationRaws] = await Promise.all([
    getInspections(ids),
    poolPayments("RegeneratorPool", address),
    readMany(delationIds.map((id) => ({ contract: "CommunityRules" as const, fn: "delationsById", args: [id] }))),
  ])
  const delationBlocks = delationRaws.map((d) => n(d?.createdAtBlock))
  const timestamps = await blockTimestamps([n(r.createdAt), ...delationBlocks])

  // the certificate shows Math.ceil(sum / count) over the whole inspection history (useUserInspections in the apps)
  const sum = (key: "trees" | "biodiversity") => inspections.reduce((total, i) => total + i[key], 0)
  const count = inspections.length

  return {
    address,
    name: str(r.name),
    description: str(descRes?.[0]),
    photo: ipfsUrl(str(r.proofPhoto)),
    areaPhoto: ipfsUrl(str(areaPhotoRes?.[0])),
    totalArea: n(r.totalArea),
    score: scoreOf(r.regenerationScore),
    totalInspections: n(r.totalInspections),
    pendingInspection: Boolean(r.pendingInspection),
    fullyInvalidated: Boolean(r.isFullyInvalidated),
    registeredBlock: n(r.createdAt),
    registeredAt: timestamps.get(n(r.createdAt)) ?? null,
    coordinates: ((coordsRes?.[0] as Result[]) ?? [])
      .map((c) => ({ lat: parseFloat(str(c.latitude)), lng: parseFloat(str(c.longitude)) }))
      .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng)),
    inspections: [...inspections].reverse(),
    treesAverage: count ? Math.ceil(sum("trees") / count) : 0,
    biodiversityAverage: count ? Math.ceil(sum("biodiversity") / count) : 0,
    payments,
    received: payments.reduce((total, p) => total + p.amount, 0),
    delations: delationRaws
      .map((d, i) =>
        d
          ? {
              id: delationIds[i],
              informer: str(d.informer),
              title: str(d.title),
              testimony: str(d.testimony),
              block: n(d.createdAtBlock),
              timestamp: timestamps.get(n(d.createdAtBlock)) ?? null,
            }
          : null,
      )
      .filter((d): d is Delation => !!d)
      .reverse(),
  }
})

/* --------------------------------------------------------------- other roles */

const ROLE_CONTRACTS: Record<RoleType, { rules: ContractName; getter: string; pool: ContractName }> = {
  inspector: { rules: "InspectorRules", getter: "getInspector", pool: "InspectorPool" },
  researcher: { rules: "ResearcherRules", getter: "getResearcher", pool: "ResearcherPool" },
  developer: { rules: "DeveloperRules", getter: "getDeveloper", pool: "DeveloperPool" },
  contributor: { rules: "ContributorRules", getter: "getContributor", pool: "ContributorPool" },
  activist: { rules: "ActivistRules", getter: "getActivist", pool: "ActivistPool" },
}

export interface RoleData {
  address: string
  type: RoleType
  name: string
  photo: string | null
  level: number
  registeredBlock: number
  registeredAt: number | null
  stats: { key: string; value: number }[]
  payments: PoolPayment[]
  received: number
  inspections: Inspection[]
  invited: { address: string; type: UserType; blockNumber: number }[]
}

export const getRole = cache(async (address: string, type: RoleType): Promise<RoleData | null> => {
  const cfg = ROLE_CONTRACTS[type]
  const raw = (await readMany([{ contract: cfg.rules, fn: cfg.getter, args: [address] }]))[0]?.[0]
  if (!raw || n(raw.id) === 0) return null

  const stats: { key: string; value: number }[] = []
  if (type === "inspector") stats.push({ key: "inspectionsDone", value: n(raw.totalInspections) }, { key: "giveUps", value: n(raw.giveUps) })
  if (type === "researcher")
    stats.push({ key: "researches", value: n(raw.publishedResearches) }, { key: "calculatorItems", value: n(raw.publishedItems) })
  if (type === "developer") stats.push({ key: "reports", value: n(raw.totalReports) })
  if (type === "contributor") stats.push({ key: "contributions", value: n(raw.totalContributions) })

  const [payments, inspectionEvents, invitedEvents] = await Promise.all([
    poolPayments(cfg.pool, address),
    type === "inspector" ? events("InspectionRules", "InspectionRealized", [null, address]) : Promise.resolve([]),
    events("InvitationRules", "UserInvited", [address]),
  ])
  const [inspections, timestamps, invitedTypes] = await Promise.all([
    getInspections(inspectionEvents.map((e) => n(e.args.inspectionId)).reverse()),
    blockTimestamps([n(raw.createdAt)]),
    readMany(invitedEvents.map((e) => ({ contract: "CommunityRules" as const, fn: "getUser", args: [str(e.args.invited)] }))),
  ])

  return {
    address,
    type,
    name: str(raw.name),
    photo: ipfsUrl(str(raw.proofPhoto)),
    level: n(raw.pool?.level),
    registeredBlock: n(raw.createdAt),
    registeredAt: timestamps.get(n(raw.createdAt)) ?? null,
    stats,
    payments,
    received: payments.reduce((total, p) => total + p.amount, 0),
    inspections,
    invited: invitedEvents
      .map((e, i) => ({ address: str(e.args.invited), type: USER_TYPES[n(invitedTypes[i]?.[0])] ?? "undefined", blockNumber: e.blockNumber }))
      .reverse(),
  }
})

export function parseAddress(value: string): string | null {
  return toChecksum(decodeURIComponent(value))
}
