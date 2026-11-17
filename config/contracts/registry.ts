import { Interface, InterfaceAbi } from "ethers"
import sintropMainnet from "./sintrop-mainnet.json"

/**
 * Contract addresses and ABIs, generated from core-contracts by
 * `node scripts/sync-contracts.mjs ../core-contracts <deployment> <name>`.
 * NEXT_PUBLIC_CONTRACTS picks the set.
 */
interface ContractEntry {
  name: string
  address: string
  abi: InterfaceAbi
}

const sets: Record<string, ContractEntry[]> = {
  "sintrop-mainnet": sintropMainnet as ContractEntry[],
}

const set = sets[process.env.NEXT_PUBLIC_CONTRACTS ?? "sintrop-mainnet"] ?? sets["sintrop-mainnet"]

export type ContractName =
  | "ActivistPool"
  | "ActivistRules"
  | "CommunityRules"
  | "ContributorPool"
  | "ContributorRules"
  | "DeveloperPool"
  | "DeveloperRules"
  | "InspectionRules"
  | "InspectorPool"
  | "InspectorRules"
  | "InvitationRules"
  | "RegenerationCredit"
  | "RegenerationCreditImpact"
  | "RegenerationIndexRules"
  | "RegeneratorPool"
  | "RegeneratorRules"
  | "ResearcherPool"
  | "ResearcherRules"
  | "SupporterRules"
  | "ValidationPool"
  | "ValidationRules"
  | "VoteRules"

const byName = new Map(set.map((c) => [c.name, { address: c.address, iface: new Interface(c.abi) }]))

export function contract(name: ContractName): { address: string; iface: Interface } {
  const entry = byName.get(name)
  if (!entry) throw new Error(`contract ${name} missing from the registry`)
  return entry
}
