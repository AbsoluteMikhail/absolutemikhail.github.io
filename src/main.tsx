import { createRoot } from "react-dom/client";
import App, { type InitialRoute } from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

const loadInitialPage = async () => {
  const pathname = window.location.pathname;

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
    return { InitialPage: module.default, initialRoute: "academy" as InitialRoute };
  }

  return {};
};

const bootstrap = async () => {
  const app = <App {...await loadInitialPage()} />;

  // The generated HTML stays visible while the current route chunk loads.
  // React then takes over in one commit, avoiding hydration conflicts from
  // browser-only effects while keeping the full page available without JS.
  rootElement.replaceChildren();
  createRoot(rootElement).render(app);
};

void bootstrap();
