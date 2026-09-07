import { describe, expect, it } from "vitest";
import { academyCourses, academyTopics } from "@/lib/academy";
import { getAcademyMetadata, getAcademyRoute } from "@/lib/academyRoutes";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

describe("Academy route metadata", () => {
  it("gives every published page its own title and description", async () => {
    const paths = ["/academy", ...academyTopics.map((topic) => `/academy/topics/${topic.slug}`),
      ...academyCourses.flatMap((course) => [`/academy/${course.slug}`, ...course.lessons.map((lesson) => `/academy/${course.slug}/${lesson.slug}`)])];
    const metadata = await Promise.all(paths.map(resolvePageMetadata));
    expect(new Set(metadata.map((item) => item.title)).size).toBe(paths.length);
    metadata.forEach((item) => {
      expect(item.description).toBeTruthy();
      expect(item.robots).toBe("index, follow");
    });
    const course = academyCourses[0];
    expect(getAcademyMetadata(`/academy/${course.slug}`).description).toBe(course.description);
    expect(getAcademyMetadata(`/academy/${course.slug}/${course.lessons[0].slug}`).description).toBe(course.lessons[0].meta.description);
  });

  it("resolves trailing slashes and excludes unknown or overlong routes from indexing", () => {
    expect(getAcademyRoute("/academy/ue-cpp-blueprint-devs/").type).toBe("course");
    for (const path of ["/academy/missing", "/academy/topics/missing", "/academy/topics/cpp/extra", "/academy/ue-cpp-blueprint-devs/01-ue-cpp-environment/extra"]) {
      expect(getAcademyRoute(path).type).toBe("notFound");
      expect(getAcademyMetadata(path).robots).toContain("noindex");
    }
  });

  it("preserves the special privacy page indexing policy", async () => {
    expect((await resolvePageMetadata("/malena/privacy")).robots).toContain("noindex, nofollow, noarchive");
  });
});
