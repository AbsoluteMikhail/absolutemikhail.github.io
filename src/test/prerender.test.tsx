// @vitest-environment node
import { renderToString } from "react-dom/server";
import { motion } from "framer-motion";
import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@/entry-server";
import { motionInitial } from "@/lib/motion";
import { donationAlertsUrl } from "@/constants/contactLinks";

const documents: JSDOM[] = [];
beforeEach(() => vi.stubEnv("SSR", true));
afterEach(() => {
  documents.splice(0).forEach((dom) => dom.window.close());
  vi.unstubAllEnvs();
});

const parseMarkup = (html: string) => {
  const dom = new JSDOM(html);
  documents.push(dom);
  return dom.window.document;
};

describe("readable server rendering", () => {
  it.each([
    "/", "/projects/", "/projects/duelant/", "/snippet/", "/privacy/", "/terms/",
    "/malena/privacy/", "/academy/ai-intro/01-first-steps/",
  ])("renders %s with its content ready and no invisible entrance state", async (path) => {
    const doc = parseMarkup(await render(path));
    expect(doc.querySelector('template[data-msg]')?.getAttribute("data-msg")).toBeUndefined();
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelector("h1")?.textContent?.trim()).not.toBe("");
    expect(doc.querySelector("main")).not.toBeNull();
    expect(doc.querySelector('template[data-msg]')).toBeNull();
    for (const element of doc.querySelectorAll<HTMLElement>("main [style], header[style]")) {
      expect(element.style.opacity, element.outerHTML.slice(0, 200)).not.toBe("0");
    }
  });

  it("keeps the initial reading progress at zero in server HTML", async () => {
    const doc = parseMarkup(await render("/academy/ai-intro/01-first-steps/"));
    const bars = doc.querySelectorAll('[role="progressbar"]');
    expect(bars).toHaveLength(2);
    for (const bar of bars) {
      expect(bar.getAttribute("aria-valuenow")).toBe("0");
      expect(bar.querySelector<HTMLElement>("div")?.style.transform).toBe("scaleX(0)");
    }
    expect(doc.querySelector("details > summary")?.textContent).toContain("Содержание и разделы");
  });

  it.each([
    ["/academy/ue-localization/", true],
    ["/academy/ai-intro/", true],
    ["/academy/ai-intro/01-first-steps/", true],
    ["/academy/ue-cpp-blueprint-devs/", false],
    ["/academy/ue-cpp-blueprint-devs/01-ue-cpp-environment/", false],
    ["/academy/", false],
  ])("offers optional author support on ready materials only: %s", async (path, shown) => {
    const doc = parseMarkup(await render(path));
    const links = doc.querySelectorAll(`a[href="${donationAlertsUrl}"]`);
    expect(links).toHaveLength(shown ? 1 : 0);
    if (shown) {
      expect(links[0].getAttribute("target")).toBe("_blank");
      expect(links[0].getAttribute("rel")).toBe("noopener noreferrer");
      expect(doc.getElementById("support-author-title")?.textContent).toBe("Материал пригодился?");
    }
    expect(doc.querySelector('iframe[src*="donationalerts"], script[src*="donationalerts"]')).toBeNull();
  });

  it("does not confuse a missing page with Academy during SSR", async () => {
    const doc = parseMarkup(await render("/projects/duelant/extra/"));
    expect(doc.querySelector("h1")?.textContent).toBe("404");
  });

  it("disables SSR entrance states while retaining intentional transforms", () => {
    const doc = parseMarkup(renderToString(
      <>
        <motion.div initial={motionInitial({ opacity: 0, y: 24 })} animate={{ opacity: 1, y: 0 }}>Content</motion.div>
        <div style={{ transform: "rotate(12deg)", opacity: 0 }}>Decoration</div>
      </>,
    ));
    const [content, decoration] = doc.querySelectorAll("div");
    expect(content.style.opacity).toBe("1");
    expect(content.style.transform).toBe("none");
    expect(decoration.style.transform).toBe("rotate(12deg)");
    expect(decoration.style.opacity).toBe("0");
  });

  it("keeps client entrance animations", () => {
    vi.stubEnv("SSR", false);
    const initial = { opacity: 0, y: 24 };
    expect(motionInitial(initial)).toBe(initial);
  });
});
