import { Result, zeroPadValue } from "ethers"
import { contract, ContractName } from "@/config/contracts/registry"
import { rpc, rpcBatch } from "./rpc"

export interface Read {
  contract: ContractName
  fn: string
  args?: unknown[]
}

const CHUNK = 100

/** Reads many view functions in JSON-RPC batches. A failed read returns null instead of failing the batch. */
export async function readMany(reads: Read[]): Promise<(Result | null)[]> {
  const out: (Result | null)[] = []
  for (let i = 0; i < reads.length; i += CHUNK) {
    const chunk = reads.slice(i, i + CHUNK)
    const calls = chunk.map((r) => {
      const c = contract(r.contract)
      return { method: "eth_call", params: [{ to: c.address, data: c.iface.encodeFunctionData(r.fn, r.args ?? []) }, "latest"] }
    })
    const body = await rpcBatchSettled(calls)
    body.forEach((raw, j) => {
      const r = chunk[j]
      try {
        out.push(raw === null ? null : contract(r.contract).iface.decodeFunctionResult(r.fn, raw))
      } catch {
        out.push(null)
      }
    })
  }
  return out
}

export async function read(contractName: ContractName, fn: string, args: unknown[] = []): Promise<Result> {
  const [result] = await readMany([{ contract: contractName, fn, args }])
  if (!result) throw new Error(`${contractName}.${fn} failed`)
  return result
}

async function rpcBatchSettled(calls: { method: string; params: unknown[] }[]): Promise<(string | null)[]> {
  try {
    return await rpcBatch<string>(calls)
  } catch {
    // one bad call makes the whole batch throw; retry one by one so the others still resolve
    return Promise.all(calls.map((c) => rpc<string>(c.method, c.params).catch(() => null)))
  }
}

export interface DecodedEvent {
  name: string
  args: Result
  blockNumber: number
  transactionHash: string
  logIndex: number
}

/** Logs of one event of a contract, decoded, oldest first. `topics` filter the indexed parameters in order. */
export async function events(contractName: ContractName, eventName: string, indexed: (string | null)[] = []): Promise<DecodedEvent[]> {
  const c = contract(contractName)
  const fragment = c.iface.getEvent(eventName)
  if (!fragment) throw new Error(`event ${eventName} not found in ${contractName}`)
  const topics = [fragment.topicHash, ...indexed.map((v) => (v ? zeroPadValue(v, 32).toLowerCase() : null))]
  while (topics.length > 1 && topics[topics.length - 1] === null) topics.pop()

  const logs = await rpc<{ topics: string[]; data: string; blockNumber: string; transactionHash: string; logIndex: string }[]>("eth_getLogs", [
    { address: c.address, topics, fromBlock: "0x0", toBlock: "latest" },
  ])
  return logs.map((log) => ({
    name: eventName,
    args: c.iface.decodeEventLog(fragment, log.data, log.topics),
    blockNumber: Number(BigInt(log.blockNumber)),
    transactionHash: log.transactionHash,
    logIndex: Number(BigInt(log.logIndex)),
  }))
}

/** Unix timestamps (seconds) of the given blocks, fetched in batches. */
export async function blockTimestamps(numbers: number[]): Promise<Map<number, number>> {
  const unique = [...new Set(numbers.filter((n) => Number.isFinite(n) && n > 0))]
  const map = new Map<number, number>()
  for (let i = 0; i < unique.length; i += CHUNK) {
    const chunk = unique.slice(i, i + CHUNK)
    const blocks = await rpcBatch<{ timestamp: string } | null>(
      chunk.map((n) => ({ method: "eth_getBlockByNumber", params: ["0x" + n.toString(16), false] })),
    )
    blocks.forEach((b, j) => b && map.set(chunk[j], Number(BigInt(b.timestamp))))
  }
  return map
}

export async function latestBlock(): Promise<{ number: number; timestamp: number }> {
  const b = await rpc<{ number: string; timestamp: string }>("eth_getBlockByNumber", ["latest", false])
  return { number: Number(BigInt(b.number)), timestamp: Number(BigInt(b.timestamp)) }
}
