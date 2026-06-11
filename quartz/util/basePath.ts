import type { GlobalConfiguration } from "../cfg"

function trailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`
}

export function baseHrefForPage(
  cfg: GlobalConfiguration,
  slug: string,
  serve: boolean,
): string | undefined {
  if (slug !== "404") {
    return undefined
  }

  if (serve || !cfg.baseUrl) {
    return "/"
  }

  return trailingSlash(new URL(`https://${cfg.baseUrl}`).pathname)
}
