import { getAnalyticsChoice } from "@/lib/privacyPreferences";

export const BUG_SCORE_COOKIE = "gamepunk-bug-xp";
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
  const base = state.shown ? state.total : stored;
  return { shown: true, total: clampScore(base + points) };
};

export const readStoredBugScore = (): number => {
  if (typeof document === "undefined") return 0;
  if (getAnalyticsChoice() !== "accepted") return 0;
  const row = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${BUG_SCORE_COOKIE}=`));
  if (!row) return 0;
  const value = Number(row.slice(BUG_SCORE_COOKIE.length + 1));
  if (!Number.isSafeInteger(value) || value < 0 || value > 999_999) return 0;
  return value;
};

export const writeStoredBugScore = (score: number) => {
  if (typeof document === "undefined") return;
  if (getAnalyticsChoice() !== "accepted") return;
  document.cookie = `${BUG_SCORE_COOKIE}=${clampScore(score)}; Max-Age=${BUG_SCORE_MAX_AGE}; Path=/; SameSite=Lax`;
};
