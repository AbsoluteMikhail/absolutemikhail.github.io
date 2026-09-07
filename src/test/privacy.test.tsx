import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PrivacyControls from "@/components/PrivacyControls";
import LegalLinks from "@/components/LegalLinks";
import { startAnalytics, stopAnalytics } from "@/lib/analytics";
import {
  getAnalyticsChoice, PRIVACY_KEY, PRIVACY_MAX_AGE, saveAnalyticsChoice,
} from "@/lib/privacyPreferences";

type TestWindow = Window & { gtag?: ReturnType<typeof vi.fn>; dataLayer?: unknown[]; ym?: (...args: unknown[]) => void; "ga-disable-G-ZXRCS636DL"?: boolean };
const target = window as TestWindow;
const loaders = () => document.querySelectorAll('script[data-site-analytics="true"]');

beforeEach(() => {
  stopAnalytics();
  localStorage.clear();
  // Also clear the in-memory fallback via the public cross-tab notification.
  window.dispatchEvent(new StorageEvent("storage", { key: PRIVACY_KEY }));
  window.history.replaceState(null, "", "/");
  target.gtag = vi.fn();
  target.dataLayer = [];
  delete target.ym;
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true, value() { this.setAttribute("open", ""); },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true, value() { this.removeAttribute("open"); },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  stopAnalytics();
  localStorage.clear();
  // A temporary subscriber resets any session-only choice from a previous test.
  const view = render(<MemoryRouter><PrivacyControls /></MemoryRouter>);
  act(() => window.dispatchEvent(new StorageEvent("storage", { key: PRIVACY_KEY })));
  view.unmount();
});

describe("analytics choice", () => {
  it("keeps counters absent until explicit approval, including after refusal and refresh", () => {
    const view = render(<MemoryRouter><PrivacyControls /></MemoryRouter>);
    expect(screen.getByRole("complementary", { name: "Выбор аналитики" })).toBeInTheDocument();
    startAnalytics();
    expect(loaders()).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Без аналитики" }));
    expect(getAnalyticsChoice()).toBe("rejected");
    expect(loaders()).toHaveLength(0);
    view.unmount();
    render(<MemoryRouter><PrivacyControls /></MemoryRouter>);
    expect(screen.queryByRole("complementary", { name: "Выбор аналитики" })).not.toBeInTheDocument();
    expect(loaders()).toHaveLength(0);
  });

  it("loads each counter once on approval and preserves disabled advertising options", () => {
    render(<MemoryRouter><PrivacyControls /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Разрешить аналитику" }));
    expect(getAnalyticsChoice()).toBe("accepted");
    expect(loaders()).toHaveLength(2);
    expect(target.gtag).toHaveBeenCalledWith("consent", "default", expect.objectContaining({ analytics_storage: "granted", ad_storage: "denied", ad_personalization: "denied" }));
    expect(target.gtag).toHaveBeenCalledWith("config", "G-ZXRCS636DL", expect.objectContaining({ allow_google_signals: false, allow_ad_personalization_signals: false }));
    startAnalytics();
    expect(loaders()).toHaveLength(2);
  });

  it("withdrawal cancels pending loaders and clears only analytics storage", () => {
    saveAnalyticsChoice("accepted");
    document.cookie = "_ga=test; path=/";
    document.cookie = "site-unrelated=keep; path=/";
    localStorage.setItem("_ym_uid", "analytics");
    localStorage.setItem("unrelated", "keep");
    startAnalytics();
    expect(stopAnalytics()).toBe(true);
    expect(target["ga-disable-G-ZXRCS636DL"]).toBe(true);
    expect(loaders()).toHaveLength(0);
    expect(document.cookie).not.toContain("_ga=");
    expect(document.cookie).toContain("site-unrelated=keep");
    expect(localStorage.getItem("_ym_uid")).toBeNull();
    expect(localStorage.getItem("unrelated")).toBe("keep");
    expect(target.dataLayer).toHaveLength(0);
    expect(stopAnalytics()).toBe(false);
  });

  it.each(["/privacy", "/terms", "/malena/privacy", "/malena/privacy/", "/MALENA/PRIVACY", "/music", "/twitch", "/snippet"])("never starts counters on %s, even with a saved approval", (path) => {
    saveAnalyticsChoice("accepted");
    window.history.replaceState(null, "", path);
    render(<MemoryRouter initialEntries={[path]}><PrivacyControls /></MemoryRouter>);
    startAnalytics();
    expect(loaders()).toHaveLength(0);
    expect(screen.queryByRole("complementary", { name: "Выбор аналитики" })).not.toBeInTheDocument();
  });

  it("does not erase an approved analytics cookie just to read the policy", () => {
    saveAnalyticsChoice("accepted");
    document.cookie = "_ga=approved; path=/";
    window.history.replaceState(null, "", "/privacy");
    render(<MemoryRouter initialEntries={["/privacy"]}><PrivacyControls /></MemoryRouter>);
    expect(document.cookie).toContain("_ga=approved");
    expect(loaders()).toHaveLength(0);
  });

  it("reopens settings from the footer and responds to changes in another tab", () => {
    saveAnalyticsChoice("rejected");
    render(<MemoryRouter><LegalLinks /><PrivacyControls /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Настройки аналитики" }));
    expect(screen.getByRole("dialog", { name: "Настройки аналитики" })).toBeInTheDocument();
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: true, cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    act(() => {
      localStorage.removeItem(PRIVACY_KEY);
      window.dispatchEvent(new StorageEvent("storage", { key: PRIVACY_KEY }));
    });
    expect(screen.getByRole("complementary", { name: "Выбор аналитики" })).toBeInTheDocument();
    expect(loaders()).toHaveLength(0);
  });

  it("does not treat malformed, outdated or expired records as consent", () => {
    for (const record of ["broken", "null", JSON.stringify({ version: 0, choice: "accepted", savedAt: Date.now() }), JSON.stringify({ version: 1, choice: "accepted", savedAt: Date.now() - PRIVACY_MAX_AGE })]) {
      localStorage.setItem(PRIVACY_KEY, record);
      expect(getAnalyticsChoice()).toBeNull();
      startAnalytics();
      expect(loaders()).toHaveLength(0);
    }
  });

  it("still permits refusal if browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<MemoryRouter><PrivacyControls /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Без аналитики" }));
    expect(getAnalyticsChoice()).toBe("rejected");
    expect(screen.getByRole("status")).toHaveTextContent("Браузер не сохранил выбор");
    expect(loaders()).toHaveLength(0);
  });
});
