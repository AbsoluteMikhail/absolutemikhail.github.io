import { findRouteMetadata, normalizePathname, notFoundMetadata } from "@/constants/routeMetadata.js";

// Shared by client navigation and the static HTML generator. The portfolio
// does not download Academy's catalog unless an Academy URL is requested.
export const resolvePageMetadata = async (pathname: string) => {
  const path = normalizePathname(pathname);
  if (path === "/academy" || path.startsWith("/academy/")) {
    const { getAcademyMetadata } = await import("@/lib/academyRoutes");
    return getAcademyMetadata(path);
  }
  return findRouteMetadata(path) ?? notFoundMetadata;
};
