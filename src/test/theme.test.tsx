import { act, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "@/components/Navbar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  THEME_KEY, THEME_MAX_AGE, applyDocumentTheme, getThemePreference,
  parseStoredTheme, resetThemeSession, resolveAppliedTheme, resolveThemePreference,
  saveThemePreference,
} from "@/lib/theme";
import Academy from "@/pages/Academy";

const stored = (choice: "light" | "dark", savedAt = Date.now()) => JSON.stringify({
  version: 1, choice, savedAt,
});

const resetTheme = () => {
  localStorage.clear();
  resetThemeSession();
  window.dispatchEvent(new StorageEvent("storage", { key: THEME_KEY }));
  document.documentElement.classList.remove("light");
  document.documentElement.style.colorScheme = "";
};

beforeEach(() => {
  resetTheme();
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
  resetTheme();
});

describe("theme preference", () => {
  it("keeps prerendered dark without a stored choice or light system preference", () => {
    expect(parseStoredTheme(null)).toBeNull();
    expect(resolveThemePreference(null, false)).toBe("dark");
    expect(resolveThemePreference(null, null)).toBe("dark");
    expect(getThemePreference()).toBe("dark");
  });

  it("prefers a valid stored choice over the system scheme and ignores expired records", () => {
    expect(resolveThemePreference("dark", true)).toBe("dark");
    expect(resolveThemePreference("light", false)).toBe("light");
    expect(parseStoredTheme(stored("light", Date.now() - THEME_MAX_AGE))).toBeNull();
    expect(parseStoredTheme("{not-json")).toBeNull();
    expect(parseStoredTheme(stored("light"))).toBe("light");
  });

  it("falls back to prefers-color-scheme when storage is empty", () => {
    const matchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...matchMedia(query),
      matches: query.includes("prefers-color-scheme: light"),
    }));
    expect(getThemePreference()).toBe("light");
  });

  it("keeps a session choice when storage cannot be written", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(saveThemePreference("light")).toBe(false);
    expect(getThemePreference()).toBe("light");
    applyDocumentTheme(getThemePreference());
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("forces dark on /snippet even when the stored choice is light", () => {
    expect(resolveAppliedTheme("light", "/snippet/")).toBe("dark");
    expect(resolveAppliedTheme("light", "/academy")).toBe("light");
  });
});

describe("theme toggle", () => {
  it("exposes a named button, switches themes with a click, and restores after remount", async () => {
    const view = render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Включить светлую тему" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await act(async () => { fireEvent.click(button); });
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(JSON.parse(localStorage.getItem(THEME_KEY)!).choice).toBe("light");
    expect(screen.getByRole("button", { name: "Включить тёмную тему" })).toHaveAttribute("aria-pressed", "true");
    view.unmount();

    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Включить тёмную тему" })).toBeInTheDocument();
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("does not present a control during prerender", () => {
    render(<ThemeToggle ssr />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("is reachable from both headers", () => {
    const nav = render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Включить светлую тему" })).toBeInTheDocument();
    nav.unmount();
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<MemoryRouter initialEntries={["/academy"]}><Academy /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Включить светлую тему" })).toBeInTheDocument();
  });

  it("toggles from the keyboard on a native button", async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Включить светлую тему" });
    button.focus();
    expect(button).toHaveFocus();
    await act(async () => { fireEvent.click(button); });
    expect(getThemePreference()).toBe("light");
  });
});

describe("theme HTML bootstrap", () => {
  const html = readFileSync("index.html", "utf8");

  it("applies a stored light choice before the module bundle", () => {
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      url: "https://gamepunk.ru/",
      beforeParse(window) {
        window.localStorage.setItem(THEME_KEY, stored("light"));
      },
    });
    expect(dom.window.document.documentElement.classList.contains("light")).toBe(true);
    expect(dom.window.document.documentElement.style.colorScheme).toBe("light");
    dom.window.close();
  });

  it("leaves snippet pages dark despite a stored light choice", () => {
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      url: "https://gamepunk.ru/snippet",
      beforeParse(window) {
        window.localStorage.setItem(THEME_KEY, stored("light"));
      },
    });
    expect(dom.window.document.documentElement.classList.contains("light")).toBe(false);
    dom.window.close();
  });
});
