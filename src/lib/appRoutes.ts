import type { ComponentType } from "react";
import { matchRoutes } from "react-router-dom";

// One registry for lazy navigation and the initial page in the browser and SSR.
// Keep the catch-all last; loaders keep heavy pages out of the initial bundle.
export const appRoutes = [
  { id: "home", path: "/", load: () => import("@/pages/Index") },
  { id: "projects", path: "/projects", load: () => import("@/pages/Projects") },
  { id: "project", path: "/projects/:slug", load: () => import("@/pages/Project") },
  { id: "music", path: "/music", load: () => import("@/pages/Music") },
  { id: "twitch", path: "/twitch", load: () => import("@/pages/Twitch") },
  { id: "snippet", path: "/snippet", load: () => import("@/pages/OGSnippet") },
  { id: "legal", path: "/privacy", load: () => import("@/pages/Legal") },
  { id: "legal", path: "/terms", load: () => import("@/pages/Legal") },
  { id: "academy", path: "/academy/*", load: () => import("@/pages/Academy") },
  { id: "malenaPrivacy", path: "/malena/privacy", load: () => import("@/pages/MalenaPrivacy") },
  { id: "notFound", path: "*", load: () => import("@/pages/NotFound") },
] as const satisfies readonly { id: string; path: string; load: () => Promise<{ default: ComponentType }> }[];

export type AppRouteId = (typeof appRoutes)[number]["id"];

export const findAppRoute = (pathname: string) => matchRoutes([...appRoutes], pathname)?.[0].route;

export const loadInitialPage = async (
  pathname: string,
  { tolerateAcademyContentError = false }: { tolerateAcademyContentError?: boolean } = {},
) => {
  const route = findAppRoute(pathname);
  if (!route) throw new Error(`No application route for ${pathname}`);
  const module = await route.load();
  if (route.id === "academy") {
    const { preloadAcademyPage } = await import("@/lib/academyContent");
    // Keep the prerendered article until its chunk is ready. The browser's
    // reader can offer a retry, but a build must fail rather than publish it.
    await preloadAcademyPage(pathname).catch((error: unknown) => {
      if (!tolerateAcademyContentError) throw error;
    });
  }
  return { InitialPage: module.default, initialRoute: route.id };
};
