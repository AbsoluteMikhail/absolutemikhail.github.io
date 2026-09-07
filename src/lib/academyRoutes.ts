import { getAcademyCourse, getAcademyLesson, getAcademyTopic, type AcademyCourse, type AcademyLesson, type AcademyTopic } from "@/lib/academy";
import { findRouteMetadata, normalizePathname, notFoundMetadata } from "@/constants/routeMetadata.js";

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

export const getAcademyMetadata = (pathname: string) => {
  const route = getAcademyRoute(pathname);
  if (route.type === "notFound") return notFoundMetadata;
  if (route.type === "home") return findRouteMetadata("/academy")!;
  const title = route.type === "topic" ? `${route.topic.title} — материалы`
    : route.type === "course" ? route.course.title
    : `${route.lesson.meta.title} — урок ${route.course.lessons.indexOf(route.lesson) + 1}`;
  const description = route.type === "topic" ? route.topic.description
    : route.type === "course" ? route.course.description : route.lesson.meta.description;
  return { title: `${title} | Absolute Mikhail Academy`, description, robots: "index, follow" };
};
