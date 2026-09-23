import { getAcademyCourse, getAcademyLesson, getLessonAvailabilityLabel, isLessonReady } from "@/lib/academy";

/** Подборка ссылается на каталог; описания, обложки и статусы берём из метаданных. */
export interface AcademyHighlight {
  courseSlug: string;
  lessonSlug?: string;
  audience: string;
}

export const academyHighlights: AcademyHighlight[] = [
  {
    courseSlug: "data-driven-speed-modifiers",
    lessonSlug: "01-data-assets-spasli-boloto",
    audience: "Для тех, кто уже работает с Blueprint",
  },
  {
    courseSlug: "ue-localization",
    audience: "Для разработчиков многоязычной игры",
  },
  {
    courseSlug: "ai-intro",
    lessonSlug: "01-first-steps",
    audience: "Для первого знакомства с нейросетями",
  },
];

export const resolveAcademyHighlights = (highlights = academyHighlights) => highlights.map((highlight) => {
  const course = getAcademyCourse(highlight.courseSlug);
  const lesson = highlight.lessonSlug ? getAcademyLesson(highlight.courseSlug, highlight.lessonSlug) : undefined;
  if (!course || (highlight.lessonSlug && !lesson)) {
    throw new Error(`Academy highlight not found: ${highlight.courseSlug}/${highlight.lessonSlug || ""}`);
  }
  if (lesson ? !isLessonReady(course, lesson) : course.status !== "Опубликован") {
    throw new Error(`Academy highlight is not ready: ${highlight.courseSlug}/${highlight.lessonSlug || ""}`);
  }
  return {
    ...highlight,
    href: `/academy/${course.slug}${lesson ? `/${lesson.slug}` : ""}`,
    title: lesson?.meta.title || course.title,
    description: lesson?.meta.description || course.description,
    cover: lesson?.cover || course.cover,
    coverAlt: lesson?.coverAlt || course.coverAlt,
    format: lesson ? getLessonAvailabilityLabel(course, lesson) : course.format,
  };
});
