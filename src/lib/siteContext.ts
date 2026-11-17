import { isStudioPath, studioLocale } from "@/lib/studioLocale";

export type SiteContext = "studio" | "en" | "mikhail" | "academy";

export function siteContext(pathname: string, search = ""): SiteContext {
  if (studioLocale(pathname) === "en") return "en";
  if (/^\/(privacy|terms)\/?$/.test(pathname)) {
    const from = new URLSearchParams(search).get("from");
    return from === "mikhail" || from === "academy" || from === "en" ? from : "studio";
  }
  if (/^\/academy(?:\/|$)/.test(pathname)) return "academy";
  return isStudioPath(pathname) ? pathname.startsWith("/en") ? "en" : "studio" : "mikhail";
}

export const isStudioContext = (context: SiteContext) => context === "studio" || context === "en";
export const legalHref = (path: "/privacy/" | "/terms/", context: SiteContext) => context === "en" ? `/en${path}` : context === "studio" ? path : `${path}?from=${context}`;
export const contextHome = (context: SiteContext) => context === "studio" ? "/" : `/${context}/`;
