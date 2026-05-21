export type AcademyDocType = "course" | "lesson";

export type AcademyHeading = {
  depth: number;
  id: string;
  text: string;
};

export type AcademyDocument = {
  body: string;
  headings: AcademyHeading[];
  meta: Record<string, string>;
  path: string;
  slug: string;
  type: AcademyDocType;
};

export type AcademyLesson = AcademyDocument & {
  course: string;
  order: number;
};

export type AcademyCourse = AcademyDocument & {
  description: string;
  lessons: AcademyLesson[];
  order: number;
  project?: string;
  status?: string;
  tags: string[];
  title: string;
};

const contentModules = import.meta.glob<string>("../content/academy/**/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const parseFrontmatter = (raw: string) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    return { body: raw.trim(), meta: {} as Record<string, string> };
  }

  const meta = match[1].split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return acc;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (key) {
      acc[key] = value;
    }

    return acc;
  }, {});

  return {
    body: raw.slice(match[0].length).trim(),
    meta,
  };
};

export const slugify = (value: string) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
};

export const getHeadings = (body: string): AcademyHeading[] => {
  const usedIds = new Map<string, number>();

  return body
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const text = match![2].trim();
      const baseId = slugify(text);
      const currentCount = usedIds.get(baseId) ?? 0;
      const id = currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`;

      usedIds.set(baseId, currentCount + 1);

      return {
        depth: match![1].length,
        id,
        text,
      };
    });
};

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

const documents = Object.entries(contentModules).map(([path, raw]) => {
  const { body, meta } = parseFrontmatter(raw);
  const type = (meta.type || "lesson") as AcademyDocType;

  return {
    body,
    headings: getHeadings(body),
    meta,
    path,
    slug: meta.slug || getSlugFromPath(path),
    type,
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
        lessons,
        order: Number(course.meta.order || 0),
        project: course.meta.project,
        status: course.meta.status,
        tags: parseCommaSeparatedValues(course.meta.tags),
        title: course.meta.title || course.slug,
      };
    }),
);

export const getAcademyCourse = (courseSlug: string) =>
  academyCourses.find((course) => course.slug === courseSlug);

export const getAcademyLesson = (courseSlug: string, lessonSlug: string) =>
  getAcademyCourse(courseSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug);

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
