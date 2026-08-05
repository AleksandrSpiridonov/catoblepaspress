import { FullSlug } from "./path"

export function canonicalUrlForSlug(baseUrl: string, slug: FullSlug | string): string {
  const base = new URL(`https://${baseUrl}`)
  const normalizedSlug = slug === "index" ? "" : slug.replace(/^\/+|\/+$/g, "")
  const basePath = base.pathname.replace(/^\/+|\/+$/g, "")
  base.pathname =
    normalizedSlug === ""
      ? `/${basePath}`
      : `/${[basePath, normalizedSlug].filter(Boolean).join("/")}`
  return base.toString()
}
