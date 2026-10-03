import { getAnalyticsChoice } from "@/lib/privacyPreferences";

export const BUG_SCORE_COOKIE = "gamepunk-bug-xp";
// Keep this key stable across deployments; the cookie remains a fallback.
export const BUG_SCORE_STORAGE_KEY = BUG_SCORE_COOKIE;
export const BUG_SCORE_MAX_AGE = 60 * 60 * 24 * 365;

export type ScoreState = {
  shown: boolean;
  total: number;
};

export const EMPTY_SCORE: ScoreState = { shown: false, total: 0 };

const clampScore = (value: number) => Math.max(0, Math.min(999_999, Math.floor(value)));

export const formatBugScore = (total: number) => `XP ${String(clampScore(total)).padStart(4, "0")}`;

export const formatBugXp = (points: number) => `+${points} XP`;

export const registerKill = (state: ScoreState, points: number, stored: number): ScoreState => {
  const base = Math.max(state.total, stored);
  return { shown: true, total: clampScore(base + points) };
};

const parseScore = (value: unknown): number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 999_999 ? value : 0;

export const readStoredBugScore = (): number => {
  if (typeof document === "undefined") return 0;
  if (getAnalyticsChoice() !== "accepted") return 0;
  let cookieScore = 0;
  let localScore = 0;
  try {
    const row = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${BUG_SCORE_COOKIE}=`));
    if (row) cookieScore = parseScore(Number(row.slice(BUG_SCORE_COOKIE.length + 1)));
  } catch { /* Storage may be blocked independently. */ }
  try {
    const raw = localStorage.getItem(BUG_SCORE_STORAGE_KEY);
    const record: unknown = raw ? JSON.parse(raw) : null;
    if (record && typeof record === "object") {
      const { total, savedAt } = record as Record<string, unknown>;
      if (typeof savedAt === "number" && Number.isFinite(savedAt) && savedAt <= Date.now()
        && Date.now() - savedAt < BUG_SCORE_MAX_AGE * 1000) localScore = parseScore(total);
    }
  } catch { /* The existing cookie still works without localStorage. */ }
  return Math.max(cookieScore, localScore);
};

export const writeStoredBugScore = (score: number) => {
  if (typeof document === "undefined") return;
  if (getAnalyticsChoice() !== "accepted") return;
  const total = Math.max(clampScore(score), readStoredBugScore());
  try {
    localStorage.setItem(BUG_SCORE_STORAGE_KEY, JSON.stringify({ total, savedAt: Date.now() }));
  } catch { /* Fall back to the cookie or this visit's in-memory score. */ }
  try {
    document.cookie = `${BUG_SCORE_COOKIE}=${total}; Max-Age=${BUG_SCORE_MAX_AGE}; Path=/; SameSite=Lax`;
  } catch { /* localStorage can still preserve the score. */ }
};
