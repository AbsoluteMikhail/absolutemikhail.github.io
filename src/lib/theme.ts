import { useLayoutEffect, useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";

export const THEME_KEY = "gamepunk-theme-v1";
export const THEME_VERSION = 1;
export const THEME_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
export const THEME_CLASS = "light";
export const THEME_CHANGE_EVENT = "gamepunk-theme-change";

export type ColorTheme = "light" | "dark";

let sessionTheme: ColorTheme | null = null;

export const resetThemeSession = () => {
  sessionTheme = null;
};

export const isForcedDarkPath = (pathname: string) => {
  const path = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  return path === "/snippet";
};

export const parseStoredTheme = (raw: string | null, now = Date.now()): ColorTheme | null => {
  if (!raw) return null;
  try {
    const record: unknown = JSON.parse(raw);
    if (!record || typeof record !== "object") return null;
    const { version, choice, savedAt } = record as Record<string, unknown>;
    if (version !== THEME_VERSION || (choice !== "light" && choice !== "dark")
      || typeof savedAt !== "number" || !Number.isFinite(savedAt)
      || savedAt > now || now - savedAt >= THEME_MAX_AGE) return null;
    return choice;
  } catch {
    return null;
  }
};

export const resolveThemePreference = (
  stored: ColorTheme | null,
  prefersLight: boolean | null,
): ColorTheme => stored ?? (prefersLight ? "light" : "dark");

export const resolveAppliedTheme = (preference: ColorTheme, pathname: string): ColorTheme => (
  isForcedDarkPath(pathname) ? "dark" : preference
);

const prefersLightScheme = (): boolean | null => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  } catch {
    return null;
  }
};

const readStoredTheme = (): ColorTheme | null => {
  try {
    return parseStoredTheme(localStorage.getItem(THEME_KEY));
  } catch {
    return null;
  }
};

export const getThemePreference = (): ColorTheme => {
  if (typeof window === "undefined") return "dark";
  if (sessionTheme) return sessionTheme;
  return resolveThemePreference(readStoredTheme(), prefersLightScheme());
};

export const applyDocumentTheme = (theme: ColorTheme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle(THEME_CLASS, theme === "light");
  root.style.colorScheme = theme;
};

export const saveThemePreference = (choice: ColorTheme) => {
  sessionTheme = null;
  let persisted = false;
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify({
      version: THEME_VERSION,
      choice,
      savedAt: Date.now(),
    }));
    persisted = true;
  } catch {
    sessionTheme = choice;
    try { localStorage.removeItem(THEME_KEY); } catch { /* Session-only choice. */ }
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  return persisted;
};

export const setThemePreference = (choice: ColorTheme, pathname?: string) => {
  const persisted = saveThemePreference(choice);
  const path = pathname
    ?? (typeof window === "undefined" ? "/" : window.location.pathname);
  applyDocumentTheme(resolveAppliedTheme(choice, path));
  return persisted;
};

const subscribe = (notify: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_KEY && event.key !== null) return;
    sessionTheme = null;
    notify();
  };
  const media = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;
  window.addEventListener(THEME_CHANGE_EVENT, notify);
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", notify);
  window.addEventListener("pageshow", notify);
  media?.addEventListener("change", notify);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, notify);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", notify);
    window.removeEventListener("pageshow", notify);
    media?.removeEventListener("change", notify);
  };
};

export const useThemePreference = () => (
  useSyncExternalStore(subscribe, getThemePreference, (): ColorTheme => "dark")
);

export const ThemeSync = () => {
  const preference = useThemePreference();
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    applyDocumentTheme(resolveAppliedTheme(preference, pathname));
  }, [preference, pathname]);
  return null;
};
