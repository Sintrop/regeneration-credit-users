import type { UserType } from "@/services/users"
import { slugify } from "./slug"

/** Public profile path for any user type (supporters and regenerators keep the certificate QR format). */
export function profileHref(type: UserType, address: string, name?: string): string {
  const slug = name ? `/${slugify(name)}` : ""
  if (type === "supporter") return `/supporter/${address}${slug}`
  if (type === "regenerator") return `/regenerator/${address}${slug}`
  return `/user/${address}`
}
