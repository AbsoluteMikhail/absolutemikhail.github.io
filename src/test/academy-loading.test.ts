import { describe, expect, it, vi } from "vitest";
import { createAcademyContentLoader } from "@/lib/academyContent";
import { academyCourses } from "@/lib/academy";

describe("Academy article loading", () => {
  it("keeps article text out of the catalog and loads only the requested document", async () => {
    expect(academyCourses.every((course) => !("body" in course) && course.lessons.every((lesson) => !("body" in lesson)))).toBe(true);
    const first = vi.fn().mockResolvedValue("---\ntitle: Первый\n---\n## Начало\nТекст первого урока");
    const second = vi.fn().mockResolvedValue("Текст второго урока");
    const loader = createAcademyContentLoader({ first, second });
    const [a, b] = await Promise.all([loader.load("first"), loader.load("first")]);
    expect(a.body).toBe("## Начало\nТекст первого урока");
    expect(a).toBe(b);
    expect(loader.peek("first")).toBe(a);
    await loader.load("first");
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it("allows a failed download to be retried", async () => {
    const importer = vi.fn().mockRejectedValueOnce(new Error("Offline")).mockResolvedValue("Урок загрузился");
    const loader = createAcademyContentLoader({ lesson: importer });
    await expect(loader.load("lesson")).rejects.toThrow("Offline");
    expect(loader.peek("lesson")).toBeUndefined();
    expect((await loader.load("lesson")).body).toBe("Урок загрузился");
    expect(importer).toHaveBeenCalledTimes(2);
    await expect(loader.load("missing")).rejects.toThrow("not found");
  });
});
