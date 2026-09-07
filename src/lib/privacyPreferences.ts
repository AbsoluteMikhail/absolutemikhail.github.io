import { useSyncExternalStore } from "react";

export const PRIVACY_KEY = "gamepunk-privacy-v1";
export const PRIVACY_VERSION = 1;
export const PRIVACY_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
export type AnalyticsChoice = "accepted" | "rejected";

const changeEvent = "gamepunk-privacy-change";
const settingsEvent = "gamepunk-privacy-settings";
let sessionChoice: AnalyticsChoice | null = null;

export const getAnalyticsChoice = (): AnalyticsChoice | null => {
  if (typeof window === "undefined") return null;
  if (sessionChoice) return sessionChoice;
  try {
    const raw = localStorage.getItem(PRIVACY_KEY);
    if (!raw) return sessionChoice;
    const record: unknown = JSON.parse(raw);
    if (!record || typeof record !== "object") return null;
    const { version, choice, savedAt } = record as Record<string, unknown>;
    if (version !== PRIVACY_VERSION || (choice !== "accepted" && choice !== "rejected")
      || typeof savedAt !== "number" || !Number.isFinite(savedAt)
      || savedAt > Date.now() || Date.now() - savedAt >= PRIVACY_MAX_AGE) return null;
    return choice;
  } catch {
    return sessionChoice;
  }
};

export const saveAnalyticsChoice = (choice: AnalyticsChoice) => {
  sessionChoice = null;
  let persisted = false;
  try {
    localStorage.setItem(PRIVACY_KEY, JSON.stringify({ version: PRIVACY_VERSION, choice, savedAt: Date.now() }));
    persisted = true;
  } catch {
    sessionChoice = choice;
    // Avoid reviving an older approval if storage can no longer be written.
    try { localStorage.removeItem(PRIVACY_KEY); } catch { /* Session-only choice. */ }
  }
  window.dispatchEvent(new Event(changeEvent));
  return persisted;
};

const subscribe = (notify: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== PRIVACY_KEY && event.key !== null) return;
    sessionChoice = null;
    notify();
  };
  window.addEventListener(changeEvent, notify);
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", notify);
  window.addEventListener("pageshow", notify);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", notify);
    window.removeEventListener("pageshow", notify);
  };
};

export const useAnalyticsChoice = () => useSyncExternalStore(subscribe, getAnalyticsChoice, () => null);
export const openPrivacySettings = () => window.dispatchEvent(new Event(settingsEvent));
export const subscribePrivacySettings = (open: () => void) => {
  window.addEventListener(settingsEvent, open);
  return () => window.removeEventListener(settingsEvent, open);
};

export const isAnalyticsExcluded = (pathname: string) => {
  const path = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  return ["/malena/privacy", "/privacy", "/terms", "/music", "/twitch", "/snippet"].includes(path);
};
