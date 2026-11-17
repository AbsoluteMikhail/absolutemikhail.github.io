import { describe, expect, it } from "vitest";
import { canonicalUrl, renderSitemap, trailingPath } from "@/constants/routeMetadata.js";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

describe("page metadata", () => {
  it("separates the studio identity from the personal portfolio", async () => {
    const studio = await resolvePageMetadata("/");
    const person = await resolvePageMetadata("/mikhail");
    expect(studio.structuredData).toMatchObject({ "@type": "Organization", name: "GamePunk", url: "https://gamepunk.ru/" });
    expect(studio.image).toBe("/studio-social.png");
    expect(person.structuredData).toMatchObject({ "@type": "Person", url: "https://gamepunk.ru/mikhail/" });
  });
  it("builds canonical URLs with the trailing slash GitHub Pages serves", () => {
    expect(canonicalUrl("/")).toBe("https://gamepunk.ru/");
    expect(canonicalUrl("/projects/duelant/")).toBe("https://gamepunk.ru/projects/duelant/");
    expect(canonicalUrl("/academy/ai-intro")).toBe("https://gamepunk.ru/academy/ai-intro/");
    expect(trailingPath("/projects#jams")).toBe("/projects/#jams");
    expect(trailingPath("/academy-code-license.txt")).toBe("/academy-code-license.txt");
    expect(trailingPath("#mentoring")).toBe("#mentoring");
  });

  it("describes the portfolio home as a person and keeps the shared social image", async () => {
    const metadata = await resolvePageMetadata("/mikhail/");
    expect(metadata.image).toBe("/snippet.jpg");
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
    expect(course.image).toBe("/academy/data-driven-speed-modifiers/cover.webp");
    expect(course.updated).toBe("2026-10-13");
    expect(course.structuredData).toMatchObject({ "@type": "Course", name: "Data Assets спасли моё болото" });
    expect(lesson.structuredData).toMatchObject({ "@type": "Article" });
    expect(lesson.ogType).toBe("article");
    expect(lesson.updated).toBe("2026-10-13");
    expect(freshLesson.updated).toBe("2026-10-24");
    expect((await resolvePageMetadata("/academy")).structuredData).toMatchObject({ "@type": "ItemList" });
  });

  it("gives the three sections distinct previews and keeps course covers", async () => {
    const studio = await resolvePageMetadata("/");
    const englishStudio = await resolvePageMetadata("/en/");
    const mikhail = await resolvePageMetadata("/mikhail/");
    const academy = await resolvePageMetadata("/academy/");
    expect([studio.image, mikhail.image, academy.image]).toEqual(["/studio-social.png", "/snippet.jpg", "/academy-social.jpg"]);
    expect(englishStudio.image).toBe("/studio-social-en.png");
    expect(academy.siteName).toBe("Absolute Mikhail Academy");
    expect(academy.imageWidth).toBe(1200);
    expect(academy.imageHeight).toBe(630);
    expect((await resolvePageMetadata("/academy/topics/cpp/")).image).toBe(academy.image);
    expect((await resolvePageMetadata("/academy/ue-cpp-blueprint-devs/")).image).toBe(academy.image);
    expect((await resolvePageMetadata("/academy/data-driven-speed-modifiers/")).image).toBe("/academy/data-driven-speed-modifiers/cover.webp");
  });

  it("distinguishes standalone articles and collections from course routes", async () => {
    const article = await resolvePageMetadata("/academy/ue-localization");
    expect(article.ogType).toBe("article");
    expect(article.structuredData).toMatchObject({
      "@type": "Article",
      headline: "Локализация в Unreal Engine: текст, субтитры, озвучка и текстуры",
      author: { name: "Михаил Ефремов" },
      dateModified: "2026-10-13",
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
    expect(xml).toContain("<loc>https://gamepunk.ru/academy/ai-intro/</loc>\n    <lastmod>2026-09-21</lastmod>");
    expect(xml).toContain("<loc>https://gamepunk.ru/</loc>\n  </url>");
    expect(xml).not.toContain("<loc>https://gamepunk.ru/</loc>\n    <lastmod>");
    expect(xml).not.toContain("not-a-date");
  });
});
