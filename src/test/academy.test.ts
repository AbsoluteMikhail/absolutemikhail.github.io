import { describe, expect, it } from "vitest";
import {
  academyTopics,
  getAcademyCourse,
  getAcademyCoursesByTopic,
  getAcademyTopic,
} from "../lib/academy";

describe("academy content structure", () => {
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
