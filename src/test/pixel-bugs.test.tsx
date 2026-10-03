import { readFileSync } from "node:fs";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PixelBugGate from "@/components/pixel-bugs/PixelBugGate";
import {
  advanceBug,
  bugDrawOrigin,
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
  BUG_SCORE_STORAGE_KEY,
  EMPTY_SCORE,
  formatBugScore,
  formatBugXp,
  readStoredBugScore,
  registerKill,
  writeStoredBugScore,
} from "@/components/pixel-bugs/bugScore";
import Index from "@/pages/Index";
import * as bugSim from "@/components/pixel-bugs/bugSim";
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

describe("bug score storage", () => {
  it("stays in memory unless analytics cookies are allowed", () => {
    document.cookie = `${BUG_SCORE_COOKIE}=80; Path=/`;
    expect(readStoredBugScore()).toBe(0);
    writeStoredBugScore(90);
    expect(document.cookie).toContain(`${BUG_SCORE_COOKIE}=80`);
    expect(document.cookie).not.toContain(`${BUG_SCORE_COOKIE}=90`);
    expect(localStorage.getItem(BUG_SCORE_STORAGE_KEY)).toBeNull();

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
    expect(JSON.parse(localStorage.getItem(BUG_SCORE_STORAGE_KEY)!)).toMatchObject({ total: 90 });
  });

  it("ignores a saved score after a refusal", () => {
    saveAnalyticsChoice("rejected");
    document.cookie = `${BUG_SCORE_COOKIE}=80; Path=/`;
    expect(readStoredBugScore()).toBe(0);
    writeStoredBugScore(15);
    expect(document.cookie).not.toContain(`${BUG_SCORE_COOKIE}=15`);
    expect(localStorage.getItem(BUG_SCORE_STORAGE_KEY)).toBeNull();
  });

  it("keeps the larger saved total and restores it after the cookie disappears", () => {
    saveAnalyticsChoice("accepted");
    document.cookie = `${BUG_SCORE_COOKIE}=80; Path=/`;
    writeStoredBugScore(10);
    document.cookie = `${BUG_SCORE_COOKIE}=; Max-Age=0; Path=/`;
    expect(readStoredBugScore()).toBe(80);
    expect(registerKill(EMPTY_SCORE, 10, readStoredBugScore()).total).toBe(90);
    expect(registerKill({ shown: true, total: 10 }, 10, 80).total).toBe(90);
  });

  it("falls back to cookies when localStorage cannot be written", () => {
    saveAnalyticsChoice("accepted");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(() => writeStoredBugScore(90)).not.toThrow();
    expect(readStoredBugScore()).toBe(90);
  });

  it("falls back to localStorage when cookies are blocked", () => {
    saveAnalyticsChoice("accepted");
    vi.spyOn(document, "cookie", "get").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(document, "cookie", "set").mockImplementation(() => { throw new Error("blocked"); });
    expect(() => writeStoredBugScore(90)).not.toThrow();
    expect(readStoredBugScore()).toBe(90);
  });

  it.each([
    "broken json",
    JSON.stringify({ total: -1, savedAt: Date.now() }),
    JSON.stringify({ total: "80", savedAt: Date.now() }),
    JSON.stringify({ total: 1.5, savedAt: Date.now() }),
    JSON.stringify({ total: 1_000_000, savedAt: Date.now() }),
    JSON.stringify({ total: 80, savedAt: Date.now() + 60_000 }),
    JSON.stringify({ total: 80, savedAt: Date.now() - BUG_SCORE_MAX_AGE * 1000 }),
  ])("ignores invalid or expired local records: %s", (record) => {
    saveAnalyticsChoice("accepted");
    localStorage.setItem(BUG_SCORE_STORAGE_KEY, record);
    expect(readStoredBugScore()).toBe(0);
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
      fireEvent.wheel(window);
      fireEvent.scroll(window);
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
      fireEvent.wheel(window);
      fireEvent.scroll(window);
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

  it("ignores restored scroll and resets activation when the page remounts", async () => {
    mockPointer(true, false);
    window.IntersectionObserver = TrackingObserver as unknown as typeof IntersectionObserver;
    const mount = () => render(<div id="games"><PixelBugGate /></div>);
    const view = mount();
    const setVisibleBounds = () => vi.spyOn(document.getElementById("games")!, "getBoundingClientRect")
      .mockReturnValue({ top: 100, bottom: 500 } as DOMRect);
    setVisibleBounds();
    await act(async () => {
      fireEvent.scroll(window);
      TrackingObserver.callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(document.querySelector(".pixel-bug-layer")).toBeNull();
    await act(async () => {
      fireEvent.wheel(window);
      fireEvent.scroll(window);
    });
    await waitFor(() => expect(document.querySelector(".pixel-bug-layer")).not.toBeNull());
    view.unmount();
    const reloaded = mount();
    setVisibleBounds();
    await act(async () => {
      fireEvent.scroll(window);
      TrackingObserver.callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(document.querySelector(".pixel-bug-layer")).toBeNull();
    expect(document.querySelector(".pixel-bug-score")).toBeNull();
    reloaded.unmount();
  });

  it.each(["wheel", "keyboard", "link"])("waits for games after %s navigation", async (input) => {
    mockPointer(true, false);
    window.IntersectionObserver = TrackingObserver as unknown as typeof IntersectionObserver;
    const view = render(<div id="games"><PixelBugGate /></div>);
    const bounds = vi.spyOn(document.getElementById("games")!, "getBoundingClientRect")
      .mockReturnValue({ top: window.innerHeight + 100, bottom: window.innerHeight + 500 } as DOMRect);
    await act(async () => {
      if (input === "wheel") fireEvent.wheel(window);
      else if (input === "keyboard") fireEvent.keyDown(window, { key: "PageDown" });
      else fireEvent.pointerDown(window);
      fireEvent.scroll(window);
    });
    expect(document.querySelector(".pixel-bug-layer")).toBeNull();
    bounds.mockReturnValue({ top: 100, bottom: 500 } as DOMRect);
    await act(async () => fireEvent.scroll(window));
    await waitFor(() => expect(document.querySelector(".pixel-bug-layer")).not.toBeNull());
    view.unmount();
  });

  it("counts a kill once in StrictMode and hides the score together with disabled targets", async () => {
    let fine = true;
    const listeners = new Set<() => void>();
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      get matches() { return query.includes("prefers-reduced-motion") ? false : fine; },
      media: query, onchange: null, addListener: () => {}, removeListener: () => {},
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => listeners.add(listener as () => void),
      removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => listeners.delete(listener as () => void),
      dispatchEvent: () => false,
    }));
    window.IntersectionObserver = TrackingObserver as unknown as typeof IntersectionObserver;
    HTMLCanvasElement.prototype.getContext = (() => ({
      clearRect: () => {}, setTransform: () => {}, drawImage: () => {}, fillRect: () => {},
    })) as unknown as typeof originalGetContext;
    const bug = { ...squid, x: 100, y: 120, vx: 0 };
    vi.spyOn(bugSim, "createBug").mockImplementation(() => ({ ...bug }));
    let nextFrame: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { nextFrame = callback; return 1; });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    saveAnalyticsChoice("accepted");
    document.cookie = `${BUG_SCORE_COOKIE}=80; Path=/`;
    const view = render(<StrictMode><div id="games"><PixelBugGate /></div></StrictMode>);
    await act(async () => {
      fireEvent.wheel(window);
      fireEvent.scroll(window);
      TrackingObserver.callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    await waitFor(() => expect(document.querySelector(".pixel-bug-layer")).not.toBeNull());
    let now = performance.now();
    act(() => {
      for (let frame = 0; frame < 6; frame += 1) { now += 50; nextFrame(now); }
      const origin = bugDrawOrigin(bug, now);
      fireEvent(window, new MouseEvent("pointerdown", { button: 0, clientX: origin.x + 11, clientY: origin.y + 1 }));
    });
    expect(document.querySelector(".pixel-bug-score")).toHaveTextContent("XP 0090");
    expect(readStoredBugScore()).toBe(90);
    act(() => { fine = false; listeners.forEach((listener) => listener()); });
    expect(document.querySelector(".pixel-bug-layer")).toBeNull();
    expect(document.querySelector(".pixel-bug-score")).toBeNull();
    expect(readStoredBugScore()).toBe(90);
    view.unmount();
  });
});
