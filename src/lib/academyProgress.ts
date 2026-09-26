import { useMemo, useSyncExternalStore } from "react";
import { isLessonReady, type AcademyCourse } from "@/lib/academy";

export const ACADEMY_PROGRESS_KEY = "gamepunk-academy-progress-v1";
export const ACADEMY_PROGRESS_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const changeEvent = "gamepunk-academy-progress";
export type ReadingRecord = { percent: number; heading: string; savedAt: number };
export type ReadingRecords = Record<string, ReadingRecord>;
const validPath = (path: string) => /^\/academy\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/.test(path);

export const parseAcademyProgress = (raw: string | null, now = Date.now()): ReadingRecords => {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const records: ReadingRecords = {};
    for (const [path, value] of Object.entries(data)) {
      if (!validPath(path) || !value || typeof value !== "object") continue;
      const record = value as Record<string, unknown>;
      if (typeof record.percent !== "number" || !Number.isInteger(record.percent) || record.percent < 1 || record.percent > 100
        || typeof record.heading !== "string" || record.heading.length > 500
        || typeof record.savedAt !== "number" || !Number.isFinite(record.savedAt)
        || record.savedAt > now || now - record.savedAt >= ACADEMY_PROGRESS_MAX_AGE) continue;
      records[path] = { percent: record.percent, heading: record.heading, savedAt: record.savedAt };
    }
    return records;
  } catch { return {}; }
};

const read = () => {
  try { return window.localStorage.getItem(ACADEMY_PROGRESS_KEY); } catch { return null; }
};
const subscribe = (listener: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === ACADEMY_PROGRESS_KEY || event.key === null) listener();
  };
  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", onStorage);
  };
};
export const useAcademyProgress = () => {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  return useMemo(() => parseAcademyProgress(raw), [raw]);
};

export const saveAcademyProgress = (path: string, percent: number, heading: string) => {
  if (!validPath(path) || !Number.isFinite(percent) || percent < 1) return false;
  const records = parseAcademyProgress(read());
  const previous = records[path];
  const next = Math.min(100, Math.round(percent));
  if (previous && previous.percent >= next) return true;
  records[path] = { percent: next, heading: heading.slice(0, 500), savedAt: Date.now() };
  try {
    window.localStorage.setItem(ACADEMY_PROGRESS_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event(changeEvent));
    return true;
  } catch { return false; }
};

export const resumeReadingHref = (path: string, record?: ReadingRecord) =>
  record?.heading && record.percent < 100 ? `${path}#${encodeURIComponent(record.heading)}` : path;

export const getCourseProgress = (course: AcademyCourse, records: ReadingRecords) => {
  const base = `/academy/${course.slug}`;
  const paths = course.lessons.length
    ? course.lessons.filter((lesson) => isLessonReady(course, lesson)).map((lesson) => `${base}/${lesson.slug}`)
    : [base];
  const started = paths.some((path) => records[path]);
  const sum = paths.reduce((total, path) => total + (records[path]?.percent ?? 0), 0);
  const complete = paths.length > 0 && paths.every((path) => records[path]?.percent === 100);
  const percent = complete ? 100 : Math.min(99, Math.round(sum / (paths.length || 1)));
  const unfinished = paths.filter((path) => records[path] && records[path].percent < 100)
    .sort((a, b) => records[b].savedAt - records[a].savedAt)[0];
  const next = unfinished ?? paths.find((path) => !records[path]);
  return { started, percent, href: started && next ? resumeReadingHref(next, records[next]) : base };
};
