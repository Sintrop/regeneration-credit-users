/** URL slug for a user name; matches the RC Core desktop app and is tolerant of the mobile app's slugs. */
export function slugify(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "user"
  )
}

export const isAddressLike = (value: string) => /^0x[0-9a-fA-F]{40}$/.test(value)
