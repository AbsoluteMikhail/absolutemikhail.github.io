import { readFileSync } from "node:fs";
import { act, render, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PixelBugGate from "@/components/pixel-bugs/PixelBugGate";
import {
  advanceBug,
  collectCoverRects,
  createBug,
  findHittableBug,
  xpFor,
  type Bug,
} from "@/components/pixel-bugs/bugSim";
import { SPRITES } from "@/components/pixel-bugs/bugSprites";
import {
  BUG_SCORE_COOKIE,
  BUG_SCORE_MAX_AGE,
  EMPTY_SCORE,
  formatBugScore,
  formatBugXp,
  readStoredBugScore,
  registerKill,
  writeStoredBugScore,
} from "@/components/pixel-bugs/bugScore";
import Index from "@/pages/Index";
import { PRIVACY_KEY, saveAnalyticsChoice, useAnalyticsChoice } from "@/lib/privacyPreferences";

const originalObserver = window.IntersectionObserver;

function mockPointer(fine: boolean, reducedMotion: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reducedMotion : fine,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

class TrackingObserver {
  static callback: IntersectionObserverCallback | null = null;

  constructor(callback: IntersectionObserverCallback) {
    TrackingObserver.callback = callback;
  }

  observe() {}

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }

  root = null;

  rootMargin = "";

  thresholds = [];
}

function PrivacyProbe() {
  useAnalyticsChoice();
  return null;
}

function resetPrivacy() {
  localStorage.clear();
  const view = render(<PrivacyProbe />);
  act(() => window.dispatchEvent(new StorageEvent("storage", { key: PRIVACY_KEY })));
  view.unmount();
  document.cookie.split(";").forEach((part) => {
    const name = part.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; Max-Age=0; Path=/`;
  });
}

const squid: Bug = {
  id: 1,
  kind: "squid",
  size: "large",
  colorIndex: 0,
  x: 0,
  y: 0,
  vx: 30,
  vy: 0,
  w: 65,
  h: 40,
  scale: 5,
  hp: 1,
  phase: 0,
  flashUntil: 0,
};

const originalGetContext = HTMLCanvasElement.prototype.getContext;

beforeEach(() => {
  TrackingObserver.callback = null;
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof originalGetContext;
  resetPrivacy();
});

afterEach(() => {
  window.IntersectionObserver = originalObserver;
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  document.querySelectorAll(".pixel-bug-layer").forEach((node) => node.remove());
  vi.restoreAllMocks();
  resetPrivacy();
});

describe("pixel bug rules", () => {
  it("keeps two animated frames for every sprite", () => {
    for (const frames of Object.values(SPRITES)) {
      expect(frames).toHaveLength(2);
      expect(frames[0]).toHaveLength(frames[1].length);
      expect(frames[0].some((row, y) => row.some((cell, x) => cell !== frames[1][y][x]))).toBe(true);
    }
  });

  it("scores a small bug higher and keeps +10 XP as the usual reward", () => {
    expect(xpFor("large")).toBe(10);
    expect(xpFor("xl")).toBe(10);
    expect(xpFor("small")).toBe(20);
    expect(formatBugXp(10)).toBe("+10 XP");
    expect(formatBugScore(40)).toBe("XP 0040");
  });

  it("adds the stored total only after the first kill of the visit", () => {
    expect(registerKill(EMPTY_SCORE, 10, 30)).toEqual({ shown: true, total: 40 });
    expect(registerKill({ shown: true, total: 40 }, 20, 0)).toEqual({ shown: true, total: 60 });
    expect(registerKill(EMPTY_SCORE, 10, 0)).toEqual({ shown: true, total: 10 });
  });

  it("does not shoot through a link or an empty sprite cell", () => {
    expect(findHittableBug([squid], 11, 1, [], 0, 0)).toBe(squid);
    expect(findHittableBug([squid], 0, 0, [], 0, 0)).toBeNull();
    expect(findHittableBug([squid], 11, 1, [{ left: 0, top: 0, right: 40, bottom: 40 }], 0, 0)).toBeNull();
  });

  it("drops a bug once it crawls off the page", () => {
    const next = advanceBug({ ...squid, x: 200, vx: 80 }, 1, 220, 800);
    expect(next).toBeNull();
    const inside = advanceBug({ ...squid, x: 20, vx: 10 }, 0.5, 800, 800);
    expect(inside?.x).toBeGreaterThan(20);
  });

  it("spawns outside the viewport", () => {
    const bug = createBug(3, 800, 600, () => 0.1);
    expect(bug.x < 0 || bug.x > 800).toBe(true);
  });

  it("collects a link box and ignores controls inside the bug layer", () => {
    const link = document.createElement("a");
    link.href = "/projects/";
    link.getBoundingClientRect = () => ({
      left: 10, top: 20, right: 80, bottom: 50, width: 70, height: 30, x: 10, y: 20, toJSON() { return {}; },
    });
    const layer = document.createElement("div");
    layer.className = "pixel-bug-layer";
    const nested = document.createElement("a");
    nested.href = "/academy/";
    nested.getBoundingClientRect = () => ({
      left: 1, top: 1, right: 40, bottom: 20, width: 39, height: 19, x: 1, y: 1, toJSON() { return {}; },
    });
    layer.append(nested);
    document.body.append(link, layer);
    const rects = collectCoverRects(1000, 800);
    expect(rects).toContainEqual({ left: 10, top: 20, right: 80, bottom: 50 });
    expect(rects).not.toContainEqual({ left: 1, top: 1, right: 40, bottom: 20 });
    link.remove();
    layer.remove();
  });
});

describe("bug score cookie", () => {
  it("stays in memory unless analytics cookies are allowed", () => {
    document.cookie = `${BUG_SCORE_COOKIE}=80; Path=/`;
    expect(readStoredBugScore()).toBe(0);
    writeStoredBugScore(90);
    expect(document.cookie).toContain(`${BUG_SCORE_COOKIE}=80`);
    expect(document.cookie).not.toContain(`${BUG_SCORE_COOKIE}=90`);

    saveAnalyticsChoice("accepted");
    expect(readStoredBugScore()).toBe(80);
    const writes: string[] = [];
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
    if (!descriptor?.get || !descriptor.set) throw new Error("cookie descriptor missing");
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => descriptor.get?.call(document),
      set: (value: string) => {
        writes.push(value);
        descriptor.set?.call(document, value);
      },
    });
    try {
      writeStoredBugScore(90);
    } finally {
      delete (document as { cookie?: string }).cookie;
    }
    expect(writes[0]).toContain(`${BUG_SCORE_COOKIE}=90`);
    expect(writes[0]).toContain("Path=/");
    expect(writes[0]).toContain("SameSite=Lax");
    expect(writes[0]).toContain(`Max-Age=${BUG_SCORE_MAX_AGE}`);
    expect(readStoredBugScore()).toBe(90);
  });

  it("ignores a saved score after a refusal", () => {
    saveAnalyticsChoice("rejected");
    document.cookie = `${BUG_SCORE_COOKIE}=80; Path=/`;
    expect(readStoredBugScore()).toBe(0);
    writeStoredBugScore(15);
    expect(document.cookie).not.toContain(`${BUG_SCORE_COOKIE}=15`);
  });
});

describe("pixel bug gate", () => {
  it("does not enter the prerendered homepage", () => {
    const html = renderToString(<MemoryRouter><Index /></MemoryRouter>);
    expect(html).not.toContain("pixel-bug");
    expect(readFileSync("src/pages/Index.tsx", "utf8")).not.toContain("PixelBugField");
    expect(readFileSync("src/components/pixel-bugs/PixelBugGate.tsx", "utf8")).toContain('import("./PixelBugField")');
    expect(readFileSync("src/App.tsx", "utf8")).not.toContain("pixel-bugs");
  });

  it.each([
    { fine: false, reducedMotion: false },
    { fine: true, reducedMotion: true },
  ])("stays dormant for fine=$fine reduced=$reducedMotion", async ({ fine, reducedMotion }) => {
    mockPointer(fine, reducedMotion);
    window.IntersectionObserver = TrackingObserver as unknown as typeof IntersectionObserver;
    render(<div id="games"><PixelBugGate /></div>);
    await act(async () => {
      TrackingObserver.callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(document.querySelector(".pixel-bug-layer")).toBeNull();
  });

  it("starts only after the games section is on screen and hides the score until a kill", async () => {
    mockPointer(true, false);
    window.IntersectionObserver = TrackingObserver as unknown as typeof IntersectionObserver;
    saveAnalyticsChoice("accepted");
    document.cookie = `${BUG_SCORE_COOKIE}=80; Path=/`;
    const view = render(<div id="games"><PixelBugGate /></div>);
    expect(document.querySelector(".pixel-bug-layer")).toBeNull();
    expect(TrackingObserver.callback).not.toBeNull();

    await act(async () => {
      TrackingObserver.callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    await waitFor(() => expect(document.querySelector(".pixel-bug-layer")).not.toBeNull());
    expect(document.querySelector(".pixel-bug-layer")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector(".pixel-bug-score")).toBeNull();
    expect(document.cookie).toContain(`${BUG_SCORE_COOKIE}=80`);
    expect(document.querySelector(".pixel-bug-layer button, .pixel-bug-layer a, .pixel-bug-layer [tabindex]")).toBeNull();
    view.unmount();
    expect(document.querySelector(".pixel-bug-layer")).toBeNull();
  });
});
