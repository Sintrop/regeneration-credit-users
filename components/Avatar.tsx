import { cn } from "@/lib/utils"

/** Two hues derived from the address: the same wallet always gets the same colors, on server and client. */
function hues(address: string): [number, number] {
  const hex = address.replace(/^0x/i, "").toLowerCase().padEnd(8, "0")
  return [parseInt(hex.slice(0, 4), 16) % 360, parseInt(hex.slice(4, 8), 16) % 360]
}

function initials(name?: string): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean)
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

/** IPFS photo, or a deterministic gradient with the user's initials. */
export function Avatar({ address, photo, name, size = 48, className }: { address: string; photo?: string | null; name?: string; size?: number; className?: string }) {
  const [a, b] = hues(address)
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-card", className)}
      style={{ width: size, height: size, background: photo ? undefined : `linear-gradient(135deg, hsl(${a} 55% 45%), hsl(${b} 60% 35%))` }}
      aria-hidden
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- IPFS photos of any size; lazy-loaded
        <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold text-white" style={{ fontSize: Math.max(11, size * 0.36) }}>
          {initials(name)}
        </span>
      )}
    </span>
  )
}
