import App from "./App.tsx";
import { applyDocumentTheme, getThemePreference, resolveAppliedTheme } from "@/lib/theme";
import { installAssetRecovery } from "@/lib/assetRecovery";
import { bootstrapApplication } from "@/lib/bootstrapApplication";
import { loadInitialPage } from "@/lib/appRoutes";
import "./index.css";

applyDocumentTheme(resolveAppliedTheme(getThemePreference(), window.location.pathname));

const rootElement = document.getElementById("root")!;
installAssetRecovery();

void bootstrapApplication(rootElement, async () => (
  <App {...await loadInitialPage(window.location.pathname, { tolerateAcademyContentError: true })} />
));
