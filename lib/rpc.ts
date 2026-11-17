import { site } from "@/config/site"

export class RpcError extends Error {
  constructor(
    message: string,
    public code?: number,
  ) {
    super(message)
    this.name = "RpcError"
  }
}

let nextId = 1

/** Several JSON-RPC calls in one HTTP request; results keep the order of `calls`. */
export async function rpcBatch<T = unknown>(calls: { method: string; params: unknown[] }[]): Promise<T[]> {
  if (calls.length === 0) return []
  const first = nextId
  nextId += calls.length

  const response = await fetch(site.rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calls.map((c, i) => ({ jsonrpc: "2.0", id: first + i, method: c.method, params: c.params }))),
  })
  if (!response.ok) throw new RpcError(`http ${response.status}`, response.status)

  const body = (await response.json()) as { id: number; result?: T; error?: { message: string; code: number } }[]
  const byId = new Map(body.map((item) => [item.id, item]))
  return calls.map((_, i) => {
    const item = byId.get(first + i)
    if (!item) throw new RpcError("missing batch item")
    if (item.error) throw new RpcError(item.error.message, item.error.code)
    return item.result as T
  })
}

export async function rpc<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
  const [result] = await rpcBatch<T>([{ method, params }])
  return result
}
