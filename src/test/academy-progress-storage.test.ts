import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ACADEMY_PROGRESS_KEY, ACADEMY_PROGRESS_MAX_AGE, getCourseProgress, parseAcademyProgress, resumeReadingHref, saveAcademyProgress } from "@/lib/academyProgress";
import { getAcademyCourse } from "@/lib/academy";

const path = "/academy/ai-intro/01-first-steps";
beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("saved Academy reading", () => {
  it("retains the furthest reading position after reopening the beginning", () => {
    expect(saveAcademyProgress(path, 54, "практика")).toBe(true);
    saveAcademyProgress(path, 0, "");
    saveAcademyProgress(path, 12, "введение");
    const records = parseAcademyProgress(localStorage.getItem(ACADEMY_PROGRESS_KEY));
    expect(records[path].percent).toBe(54);
    expect(resumeReadingHref(path, records[path])).toBe(`${path}#${encodeURIComponent("практика")}`);
    saveAcademyProgress(path, 100, "итоги");
    expect(parseAcademyProgress(localStorage.getItem(ACADEMY_PROGRESS_KEY))[path].percent).toBe(100);
  });

  it("ignores expired, malformed and future records", () => {
    const now = Date.now();
    for (const savedAt of [now - ACADEMY_PROGRESS_MAX_AGE, now + 1000]) {
      expect(parseAcademyProgress(JSON.stringify({ [path]: { percent: 54, heading: "x", savedAt } }), now)).toEqual({});
    }
    expect(parseAcademyProgress("broken")).toEqual({});
    expect(parseAcademyProgress(JSON.stringify({ [path]: { percent: "54", heading: "x", savedAt: now } }))).toEqual({});
    expect(saveAcademyProgress("https://example.org", 54, "x")).toBe(false);
  });

  it("tolerates blocked storage", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(saveAcademyProgress(path, 54, "practice")).toBe(false);
    expect(localStorage.getItem(ACADEMY_PROGRESS_KEY)).toBeNull();
  });

  it("averages ready lessons and resumes an unfinished one, then the next unread lesson", () => {
    const source = getAcademyCourse("ai-intro")!;
    const course = { ...source, lessons: source.lessons.map((lesson, i) => ({ ...lesson, meta: { ...lesson.meta, status: i === 2 ? "Анонс" : "Урок" } })) };
    const first = `/academy/${course.slug}/${course.lessons[0].slug}`;
    const second = `/academy/${course.slug}/${course.lessons[1].slug}`;
    const records = { [first]: { percent: 54, heading: "practice", savedAt: Date.now() } };
    expect(getCourseProgress(course, records)).toEqual({ started: true, percent: 27, href: `${first}#practice` });
    records[first].percent = 100;
    expect(getCourseProgress(course, records)).toEqual({ started: true, percent: 50, href: second });
    expect(getCourseProgress(course, { ...records, [second]: { percent: 100, heading: "", savedAt: Date.now() } }).percent).toBe(100);
  });

  it("uses the article itself for a material without lessons", () => {
    const course = getAcademyCourse("ue-localization")!;
    const article = `/academy/${course.slug}`;
    expect(getCourseProgress(course, { [article]: { percent: 54, heading: "text", savedAt: Date.now() } }))
      .toEqual({ started: true, percent: 54, href: `${article}#text` });
  });
});
