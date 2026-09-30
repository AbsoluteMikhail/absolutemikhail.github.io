import { describe, expect, it } from "vitest";
import { canonicalUrl, renderSitemap } from "@/constants/routeMetadata.js";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

describe("page metadata", () => {
  it("builds canonical URLs without a trailing slash", () => {
    expect(canonicalUrl("/")).toBe("https://gamepunk.ru/");
    expect(canonicalUrl("/projects/duelant/")).toBe("https://gamepunk.ru/projects/duelant");
    expect(canonicalUrl("/academy/ai-intro")).toBe("https://gamepunk.ru/academy/ai-intro");
  });

  it("describes the portfolio home as a person and keeps the shared social image", async () => {
    const metadata = await resolvePageMetadata("/");
    expect(metadata.image).toBeUndefined();
    expect(metadata.structuredData).toMatchObject({
      "@type": "Person",
      name: "Михаил Ефремов",
      alternateName: "Absolute Mikhail",
      jobTitle: "Senior Gameplay Programmer",
    });
    expect(metadata.structuredData?.sameAs).toContain("https://www.youtube.com/@Absolute-Unreal");
    expect(metadata.structuredData?.hasCredential).toMatchObject({
      name: "Unreal Authorized Instructor",
    });
  });

  it("uses a project cover for VideoGame metadata without claiming authorship of team work", async () => {
    const duelant = await resolvePageMetadata("/projects/duelant");
    const dixotomia = await resolvePageMetadata("/projects/dixotomia");
    const kolobok = await resolvePageMetadata("/projects/kolobok-protiv-yascherov");
    expect(duelant.image).toBeTruthy();
    expect(duelant.imageWidth).toBe(1280);
    expect(duelant.imageHeight).toBe(720);
    expect(duelant.structuredData).toMatchObject({ "@type": "VideoGame", name: "DUELANT" });
    expect(duelant.structuredData?.author).toMatchObject({ name: "Михаил Ефремов" });
    expect(duelant.structuredData?.datePublished).toBeUndefined();
    expect(dixotomia.structuredData?.author).toBeUndefined();
    expect(dixotomia.structuredData?.contributor).toMatchObject({ name: "Михаил Ефремов" });
    expect(kolobok.structuredData?.datePublished).toBe("2024");
  });

  it("uses academy covers, course and article schema, and real updated dates", async () => {
    const course = await resolvePageMetadata("/academy/data-driven-speed-modifiers");
    const lesson = await resolvePageMetadata("/academy/data-driven-speed-modifiers/01-data-assets-spasli-boloto");
    const freshLesson = await resolvePageMetadata("/academy/ai-intro/01-first-steps");
    expect(course.image).toBe("/academy/data-driven-speed-modifiers/cover.jpg");
    expect(course.updated).toBe("2026-09-02");
    expect(course.structuredData).toMatchObject({ "@type": "Course", name: "Data Assets спасли моё болото" });
    expect(lesson.structuredData).toMatchObject({ "@type": "Article" });
    expect(lesson.ogType).toBe("article");
    expect(lesson.updated).toBeUndefined();
    expect(freshLesson.updated).toBe("2026-09-21");
    expect((await resolvePageMetadata("/academy")).structuredData).toMatchObject({ "@type": "ItemList" });
  });

  it("distinguishes standalone articles and collections from course routes", async () => {
    const article = await resolvePageMetadata("/academy/ue-localization");
    expect(article.ogType).toBe("article");
    expect(article.structuredData).toMatchObject({
      "@type": "Article",
      headline: "Локализация в Unreal Engine: текст, субтитры, озвучка и текстуры",
      author: { name: "Михаил Ефремов" },
      dateModified: "2026-09-21",
    });
    expect(article.structuredData?.provider).toBeUndefined();
    const collection = await resolvePageMetadata("/academy/useful-ue");
    expect(collection.ogType).toBe("website");
    expect(collection.structuredData?.["@type"]).toBe("CollectionPage");
    const course = await resolvePageMetadata("/academy/ai-intro");
    expect(course.structuredData?.["@type"]).toBe("Course");
  });

  it("adds lastmod only for dates that already exist", () => {
    const xml = renderSitemap([
      { pathname: "/academy/ai-intro", updated: "2026-09-21" },
      { pathname: "/", updated: undefined },
      { pathname: "/projects/duelant", updated: "not-a-date" },
    ]);
    expect(xml).toContain("<loc>https://gamepunk.ru/academy/ai-intro</loc>\n    <lastmod>2026-09-21</lastmod>");
    expect(xml).toContain("<loc>https://gamepunk.ru/</loc>\n  </url>");
    expect(xml).not.toContain("<loc>https://gamepunk.ru/</loc>\n    <lastmod>");
    expect(xml).not.toContain("not-a-date");
  });
});
