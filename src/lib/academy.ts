export type AcademyDocType = "course" | "lesson";

export type AcademyTopic = {
  description: string;
  emptyState: string;
  slug: string;
  title: string;
};

export type AcademyDocument = {
  cover?: string;
  coverAlt?: string;
  meta: Record<string, string>;
  path: string;
  slug: string;
  type: AcademyDocType;
  updated?: string;
};

export type AcademyLesson = AcademyDocument & {
  course: string;
  order: number;
};

export type AcademyCourse = AcademyDocument & {
  description: string;
  format: string;
  lessons: AcademyLesson[];
  order: number;
  project?: string;
  status?: string;
  tags: string[];
  title: string;
  topics: string[];
};

export const academyTopics: AcademyTopic[] = [
  {
    slug: "cpp",
    title: "C++",
    description: "Язык, архитектура и инженерное мышление разработчика.",
    emptyState: "Здесь появятся материалы о современном C++, памяти, архитектуре и практиках разработки.",
  },
  {
    slug: "unreal-engine",
    title: "Unreal Engine",
    description: "От Blueprint до production-систем и масштабируемого gameplay.",
    emptyState: "Здесь появятся курсы, разборы и практические материалы по Unreal Engine.",
  },
  {
    slug: "ai",
    title: "Нейросети",
    description: "Модели, AI-инструменты и собственные практические проекты.",
    emptyState: "Здесь появятся сравнения нейросетей, практические гайды и проекты с AI.",
  },
  {
    slug: "tools",
    title: "Инструменты и IT",
    description: "Движки, программы, сервисы и рабочие процессы.",
    emptyState: "Здесь появятся обзоры инструментов, сравнения движков и материалы об IT-практике.",
  },
];

const contentModules = import.meta.glob<Record<string, string>>("../content/academy/*/*.md", {
  eager: true,
  import: "default",
  query: "?academy-meta",
});

const getSlugFromPath = (path: string) => {
  const parts = path.replace(/\\/g, "/").split("/");
  const fileName = parts[parts.length - 1].replace(/\.md$/, "");

  return fileName === "index" ? parts[parts.length - 2] : fileName;
};

const parseCommaSeparatedValues = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const parseAcademyUpdatedDate = (value?: string, path = "Academy material") => {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${path}: updated must be a valid YYYY-MM-DD date`);
  }
  return value;
};

export const getLatestAcademyUpdate = (documents: ReadonlyArray<{ updated?: string }>) =>
  documents.reduce<string | undefined>((latest, document) =>
    document.updated && (!latest || document.updated > latest) ? document.updated : latest, undefined);

const documents = Object.entries(contentModules).map(([path, meta]) => {
  const type = (meta.type || "lesson") as AcademyDocType;

  return {
    cover: meta.cover || undefined,
    coverAlt: meta.coverAlt || meta.title || undefined,
    meta,
    path,
    slug: meta.slug || getSlugFromPath(path),
    type,
    updated: parseAcademyUpdatedDate(meta.updated, path),
  } satisfies AcademyDocument;
});

const sortByOrder = <T extends { order: number; title?: string; meta?: Record<string, string> }>(items: T[]) =>
  [...items].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }

    return (a.title || a.meta?.title || "").localeCompare(b.title || b.meta?.title || "", "ru");
  });

export const academyCourses: AcademyCourse[] = sortByOrder(
  documents
    .filter((document) => document.type === "course")
    .map((course) => {
      const lessons = sortByOrder(
        documents
          .filter((document) => document.type === "lesson" && document.meta.course === course.slug)
          .map((lesson) => ({
            ...lesson,
            course: lesson.meta.course,
            order: Number(lesson.meta.order || 0),
          })),
      );

      return {
        ...course,
        description: course.meta.description || "",
        format: course.meta.format || "Курс",
        lessons,
        order: Number(course.meta.order || 0),
        project: course.meta.project,
        status: course.meta.status,
        tags: parseCommaSeparatedValues(course.meta.tags),
        title: course.meta.title || course.slug,
        topics: parseCommaSeparatedValues(course.meta.topics),
        updated: getLatestAcademyUpdate([course, ...lessons]),
      };
    }),
);

export const sortAcademyCoursesByUpdated = (courses: readonly AcademyCourse[]) =>
  [...courses].sort((a, b) =>
    (b.updated || "").localeCompare(a.updated || "") ||
    a.order - b.order ||
    a.title.localeCompare(b.title, "ru"));

export const recentAcademyCourses = sortAcademyCoursesByUpdated(academyCourses);

export const getAcademyCourse = (courseSlug: string) =>
  academyCourses.find((course) => course.slug === courseSlug);

export const getAcademyLesson = (courseSlug: string, lessonSlug: string) =>
  getAcademyCourse(courseSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug);

export const getAcademyTopic = (topicSlug: string) =>
  academyTopics.find((topic) => topic.slug === topicSlug);

export const getAcademyCoursesByTopic = (topicSlug: string) =>
  academyCourses.filter((course) => course.topics.includes(topicSlug));

export const groupLessonsByBlock = (lessons: AcademyLesson[]) =>
  lessons.reduce<Array<{ title: string; lessons: AcademyLesson[] }>>((groups, lesson) => {
    const blockTitle = lesson.meta.block || "Без блока";
    const existingGroup = groups.find((group) => group.title === blockTitle);

    if (existingGroup) {
      existingGroup.lessons.push(lesson);
      return groups;
    }

    groups.push({ title: blockTitle, lessons: [lesson] });
    return groups;
  }, []);
