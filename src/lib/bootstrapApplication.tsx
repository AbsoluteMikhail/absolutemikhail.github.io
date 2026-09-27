import { type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { PageLoadError } from "@/components/PageLoadError";

export const bootstrapApplication = async (root: HTMLElement, load: () => Promise<ReactNode>) => {
  try {
    const app = await load();
    // createRoot replaces the prerendered HTML at commit time. Clearing it
    // before render would expose an empty screen while React is scheduled.
    const application = createRoot(root);
    application.render(app);
    return application;
  } catch (error) {
    console.error("Page startup failed", error);
    // Keep the readable prerendered page, and add recovery controls outside it.
    const notice = document.createElement("div");
    root.before(notice);
    const recovery = createRoot(notice);
    recovery.render(<PageLoadError compact={root.hasChildNodes()} />);
    return recovery;
  }
};
