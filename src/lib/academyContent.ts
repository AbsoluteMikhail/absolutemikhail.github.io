import { getHeadings, parseAcademyFrontmatter, type AcademyHeading } from "@/lib/academyMarkdown";
import { getAcademyRoute } from "@/lib/academyRoutes";

export type AcademyContent = { body: string; headings: AcademyHeading[] };
type ContentImporters = Record<string, () => Promise<string>>;

export const createAcademyContentLoader = (importers: ContentImporters) => {
  const ready = new Map<string, AcademyContent>();
  const pending = new Map<string, Promise<AcademyContent>>();

  const load = (path: string): Promise<AcademyContent> => {
    const cached = ready.get(path);
    if (cached) return Promise.resolve(cached);
    const existing = pending.get(path);
    if (existing) return existing;
    const importer = importers[path];
    if (!importer) return Promise.reject(new Error(`Academy content not found: ${path}`));

    const request = importer().then((raw) => {
      const { body } = parseAcademyFrontmatter(raw);
      const content = { body, headings: getHeadings(body) };
      ready.set(path, content);
      return content;
    }).finally(() => pending.delete(path));
    pending.set(path, request);
    return request;
  };

  return { load, peek: (path: string) => ready.get(path) };
};

export const academyContent = createAcademyContentLoader(import.meta.glob<string>("../content/academy/*/*.md", {
  import: "default",
  query: "?raw",
}));

export const preloadAcademyPage = async (pathname: string) => {
  const route = getAcademyRoute(pathname);
  if (route.type === "course") await academyContent.load(route.course.path);
  if (route.type === "lesson") await academyContent.load(route.lesson.path);
};
