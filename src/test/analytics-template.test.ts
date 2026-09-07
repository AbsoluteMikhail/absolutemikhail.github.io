import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

describe("analytics HTML bootstrap", () => {
  it("only prepares the local gtag queue and never embeds external counters", () => {
    const html = readFileSync("index.html", "utf8");
    // jsdom does not enable external resources here: no network traffic.
    const dom = new JSDOM(html, { runScripts: "dangerously", url: "https://gamepunk.ru/" });
    expect(html).not.toMatch(/googletagmanager\.com|google-analytics\.com|mc\.yandex\./);
    const target = dom.window as unknown as { gtag: (...args: unknown[]) => void; dataLayer: IArguments[] };
    expect(target.dataLayer).toHaveLength(0);
    target.gtag("consent", "default", { analytics_storage: "denied" });
    expect(Object.prototype.toString.call(target.dataLayer[0])).toBe("[object Arguments]");
    expect(Array.from(target.dataLayer[0])).toEqual(["consent", "default", { analytics_storage: "denied" }]);
    expect(dom.window.document.querySelectorAll('script[src]:not([type="module"])')).toHaveLength(0);
    dom.window.close();
  });
});
