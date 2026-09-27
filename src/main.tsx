import App, { type InitialRoute } from "./App.tsx";
import { applyDocumentTheme, getThemePreference, resolveAppliedTheme } from "@/lib/theme";
import { installAssetRecovery } from "@/lib/assetRecovery";
import { bootstrapApplication } from "@/lib/bootstrapApplication";
import "./index.css";

applyDocumentTheme(resolveAppliedTheme(getThemePreference(), window.location.pathname));

const rootElement = document.getElementById("root")!;
installAssetRecovery();

const loadInitialPage = async () => {
  const pathname = window.location.pathname;

  if (["/privacy", "/privacy/", "/terms", "/terms/"].includes(pathname)) {
    const module = await import("@/pages/Legal");
    return { InitialPage: module.default, initialRoute: "legal" as InitialRoute };
  }

  if (pathname.replace(/\/+$/, "") === "/snippet") {
    const module = await import("@/pages/OGSnippet");
    return { InitialPage: module.default, initialRoute: "snippet" as InitialRoute };
  }
  if (pathname.startsWith("/projects/") && pathname !== "/projects/") {
    const module = await import("@/pages/Project");
    return { InitialPage: module.default, initialRoute: "project" as InitialRoute };
  }

  if (pathname === "/") {
    const module = await import("./pages/Index");
    return { InitialPage: module.default, initialRoute: "home" as InitialRoute };
  }

  if (pathname === "/projects" || pathname === "/projects/") {
    const module = await import("./pages/Projects");
    return { InitialPage: module.default, initialRoute: "projects" as InitialRoute };
  }

  if (pathname === "/academy" || pathname.startsWith("/academy/")) {
    const module = await import("./pages/Academy");
    const { preloadAcademyPage } = await import("@/lib/academyContent");
    // Keep the prerendered article visible until its own chunk is ready.
    // The reader provides a retry UI if loading fails.
    await preloadAcademyPage(pathname).catch(() => undefined);
    return { InitialPage: module.default, initialRoute: "academy" as InitialRoute };
  }

  return {};
};

void bootstrapApplication(rootElement, async () => <App {...await loadInitialPage()} />);
