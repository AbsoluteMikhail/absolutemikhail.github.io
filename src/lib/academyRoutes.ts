import { getAcademyCourse, getAcademyCoursesByTopic, getAcademyLesson, getAcademyTopic, getLatestAcademyUpdate, academyCourses, type AcademyCourse, type AcademyLesson, type AcademyTopic } from "@/lib/academy";
import { absoluteUrl, canonicalUrl, findRouteMetadata, normalizePathname, notFoundMetadata, siteUrl } from "@/constants/routeMetadata.js";
import { publicImageMeta } from "@/lib/publicImageMeta";
import type { PageMetadata } from "@/lib/pageMetadata";

export type AcademyRoute =
  | { type: "home" }
  | { type: "topic"; topic: AcademyTopic }
  | { type: "course"; course: AcademyCourse }
  | { type: "lesson"; course: AcademyCourse; lesson: AcademyLesson }
  | { type: "notFound" };

export const getAcademyRoute = (pathname: string): AcademyRoute => {
  const path = normalizePathname(pathname);
  if (path === "/academy") return { type: "home" };
  if (!path.startsWith("/academy/")) return { type: "notFound" };
  const parts = path.slice("/academy/".length).split("/");
  if (parts.length > 2 || parts.some((part) => !part)) return { type: "notFound" };
  const [section, child] = parts;
  if (section === "topics") {
    const topic = child ? getAcademyTopic(child) : undefined;
    return topic ? { type: "topic", topic } : { type: "notFound" };
  }
  const course = getAcademyCourse(section);
  if (!course) return { type: "notFound" };
  if (!child) return { type: "course", course };
  const lesson = getAcademyLesson(section, child);
  return lesson ? { type: "lesson", course, lesson } : { type: "notFound" };
};

const mikhail = {
  "@type": "Person",
  name: "Михаил Ефремов",
  url: `${siteUrl}/`,
};

// The catalogue uses "course" routes for standalone articles and collections too.
const materialSchemaType = (course: AcademyCourse) => {
  if (course.format === "Статья") return "Article";
  if (course.format === "Подборка") return "CollectionPage";
  return "Course";
};

const imageFields = (src?: string, alt?: string) => {
  if (!src) return {};
  const size = publicImageMeta[src];
  return {
    image: src,
    imageAlt: alt || "Обложка материала",
    imageWidth: size?.width,
    imageHeight: size?.height,
  };
};

const courseList = (courses: readonly AcademyCourse[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: courses.map((course, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: course.title,
    url: canonicalUrl(`/academy/${course.slug}`),
  })),
});

export const getAcademyMetadata = (pathname: string): PageMetadata => {
  const route = getAcademyRoute(pathname);
  if (route.type === "notFound") return notFoundMetadata;
  const breadcrumbs = [
    { name: "Главная", pathname: "/" },
    { name: "Academy", pathname: "/academy" },
  ];
  if (route.type === "home") {
    return {
      ...findRouteMetadata("/academy")!,
      updated: getLatestAcademyUpdate(academyCourses),
      breadcrumbs,
      structuredData: courseList(academyCourses),
    };
  }
  const title = route.type === "topic" ? `${route.topic.title} — материалы`
    : route.type === "course" ? route.course.title
    : `${route.lesson.meta.title} — урок ${route.course.lessons.indexOf(route.lesson) + 1}`;
  const description = route.type === "topic" ? route.topic.description
    : route.type === "course" ? route.course.description : route.lesson.meta.description;
  if (route.type === "topic") {
    breadcrumbs.push({ name: route.topic.title, pathname: `/academy/topics/${route.topic.slug}` });
  } else {
    breadcrumbs.push({ name: route.course.title, pathname: `/academy/${route.course.slug}` });
    if (route.type === "lesson") {
      breadcrumbs.push({ name: route.lesson.meta.title, pathname: `/academy/${route.course.slug}/${route.lesson.slug}` });
    }
  }
  const base = { title: `${title} | Absolute Mikhail Academy`, description, robots: "index, follow", breadcrumbs };
  if (route.type === "topic") {
    const courses = getAcademyCoursesByTopic(route.topic.slug);
    return {
      ...base,
      updated: getLatestAcademyUpdate(courses),
      structuredData: courses.length ? courseList(courses) : undefined,
    };
  }
  if (route.type === "course") {
    const schemaType = materialSchemaType(route.course);
    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: route.course.title,
      description: route.course.description,
      url: canonicalUrl(`/academy/${route.course.slug}`),
      inLanguage: "ru",
      ...(schemaType === "Course" ? { provider: mikhail } : { author: mikhail }),
    };
    if (schemaType === "Article") data.headline = route.course.title;
    if (route.course.cover) data.image = absoluteUrl(route.course.cover);
    if (route.course.updated) data.dateModified = route.course.updated;
    return {
      ...base,
      ...imageFields(route.course.cover, route.course.coverAlt),
      updated: route.course.updated,
      ogType: schemaType === "Article" ? "article" : "website",
      structuredData: data,
    };
  }
  const cover = route.lesson.cover || route.course.cover;
  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: route.lesson.meta.title,
    description: route.lesson.meta.description,
    url: canonicalUrl(`/academy/${route.course.slug}/${route.lesson.slug}`),
    inLanguage: "ru",
    author: mikhail,
    isPartOf: {
      "@type": materialSchemaType(route.course),
      name: route.course.title,
      url: canonicalUrl(`/academy/${route.course.slug}`),
    },
  };
  if (cover) article.image = absoluteUrl(cover);
  if (route.lesson.updated) article.dateModified = route.lesson.updated;
  return {
    ...base,
    ...imageFields(cover, route.lesson.coverAlt || route.course.coverAlt),
    ogType: "article",
    updated: route.lesson.updated,
    structuredData: article,
  };
};
