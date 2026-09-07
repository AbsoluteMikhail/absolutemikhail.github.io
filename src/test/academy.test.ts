import { describe, expect, it } from "vitest";
import {
  academyTopics,
  getAcademyCourse,
  getAcademyCoursesByTopic,
  getAcademyTopic,
  getLatestAcademyUpdate,
  parseAcademyUpdatedDate,
  sortAcademyCoursesByUpdated,
} from "../lib/academy";

describe("academy content structure", () => {
  it("sorts recent materials by update date without changing lesson or source order", () => {
    const course = getAcademyCourse("ue-cpp-blueprint-devs")!;
    const older = { ...course, title: "Older", updated: "2026-08-31", order: 1 };
    const newer = { ...course, title: "Newer", updated: "2026-09-02", order: 3 };
    const sameDay = { ...course, title: "Same day", updated: "2026-09-02", order: 2 };
    const undated = { ...course, title: "Undated", updated: undefined, order: 0 };
    const source = [older, undated, newer, sameDay];

    expect(sortAcademyCoursesByUpdated(source)).toEqual([sameDay, newer, older, undated]);
    expect(source).toEqual([older, undated, newer, sameDay]);
    expect(newer.lessons).toBe(course.lessons);
  });

  it("raises a course in the feed when one of its lessons receives a newer update", () => {
    expect(getLatestAcademyUpdate([
      { updated: "2026-08-20" },
      {},
      { updated: "2026-09-02" },
      { updated: "2026-08-31" },
    ])).toBe("2026-09-02");
    expect(getLatestAcademyUpdate([{}, {}])).toBeUndefined();
  });

  it("rejects impossible and ambiguous update dates instead of silently misordering materials", () => {
    expect(parseAcademyUpdatedDate("2024-02-29")).toBe("2024-02-29");
    expect(parseAcademyUpdatedDate()).toBeUndefined();
    expect(() => parseAcademyUpdatedDate("2026-02-29", "lesson.md")).toThrow("lesson.md");
    expect(() => parseAcademyUpdatedDate("02.09.2026")).toThrow("YYYY-MM-DD");
  });

  it("exposes all four Academy topics", () => {
    expect(academyTopics.map((topic) => topic.slug)).toEqual([
      "cpp",
      "unreal-engine",
      "ai",
      "tools",
    ]);
  });

  it("can place one material in several topics", () => {
    const course = getAcademyCourse("ue-cpp-blueprint-devs");

    expect(course?.format).toBe("Курс");
    expect(getAcademyCoursesByTopic("cpp")).toContain(course);
    expect(getAcademyCoursesByTopic("unreal-engine")).toContain(course);
  });

  it("keeps empty topics available for future materials", () => {
    expect(getAcademyTopic("ai")?.title).toBe("Нейросети");
    expect(getAcademyCoursesByTopic("ai")).toEqual([]);
  });

  it("publishes Data-Driven as a covered mini-course with one video lesson", () => {
    const course = getAcademyCourse("data-driven-speed-modifiers");

    expect(course?.format).toBe("Мини-курс");
    expect(course?.cover).toBe("/academy/data-driven-speed-modifiers/cover.jpg");
    expect(course?.lessons).toHaveLength(1);
    expect(course?.lessons[0].meta.youtube).toBe("https://youtu.be/Q8SXNGHKD8s");
    expect(course?.lessons[0].meta.videoIntro).toContain("Лень читать");
  });
});
