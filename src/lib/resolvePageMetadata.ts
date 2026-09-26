import { findRouteMetadata, normalizePathname, notFoundMetadata } from "@/constants/routeMetadata.js";

// Shared by client navigation and the static HTML generator. The portfolio
// does not download Academy's catalog unless an Academy URL is requested.
export const resolvePageMetadata = async (pathname: string) => {
  const path = normalizePathname(pathname);
  if (path === "/academy" || path.startsWith("/academy/")) {
    const { getAcademyMetadata } = await import("@/lib/academyRoutes");
    return getAcademyMetadata(path);
  }
  if (path.startsWith("/projects/")) {
    const { findProjectPage } = await import("@/lib/projectPages");
    const project = findProjectPage(path.slice("/projects/".length));
    return project ? {
      title: `${project.title} — ${project.category} | Absolute Mikhail`,
      description: project.description,
      robots: "index, follow",
    } : notFoundMetadata;
  }
  return findRouteMetadata(path) ?? notFoundMetadata;
};
