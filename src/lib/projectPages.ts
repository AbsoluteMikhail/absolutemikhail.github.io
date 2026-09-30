import { absoluteUrl, canonicalUrl, findRouteMetadata, siteUrl } from "@/constants/routeMetadata.js";
import { projects, type Project } from "@/constants/projects";
import type { PageMetadata } from "@/lib/pageMetadata";

export type ProjectPage = Pick<Project, "slug" | "title" | "genre" | "cover" | "coverSrcSet" | "coverWidth" | "coverHeight" | "role" | "caseStudy" | "development" | "screenshots"> & {
  category: "Игра";
  description: string;
  body: string;
  year?: string;
  status?: string;
  tech: string[];
  videoUrl?: string;
  links: Array<{ label: string; url: string }>;
};

export const projectPages: ProjectPage[] = [
  ...projects.map((project): ProjectPage => ({
    ...project,
    category: "Игра",
    description: project.shortDesc,
    body: project.fullDesc,
    status: project.stats,
    links: project.storeLinks ?? (project.storeUrl ? [{ label: "Смотреть проект", url: project.storeUrl }] : []),
  })),
];

export const projectPath = (slug: string) => `/projects/${slug}`;
export const findProjectPage = (slug: string) => projectPages.find((project) => project.slug === slug);

const mikhail = {
  "@type": "Person",
  name: "Михаил Ефремов",
  url: `${siteUrl}/`,
};

export const projectsIndexMetadata = (): PageMetadata => ({
  ...findRouteMetadata("/projects")!,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Игры и проекты",
    itemListElement: projectPages.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: canonicalUrl(projectPath(project.slug)),
    })),
  },
});

export const projectPageMetadata = (project: ProjectPage): PageMetadata => {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: project.title,
    description: project.description,
    genre: project.genre,
    inLanguage: "ru",
    url: canonicalUrl(projectPath(project.slug)),
    image: absoluteUrl(project.cover),
  };
  if (project.status === "В релизе" && project.year) data.datePublished = project.year;
  if (project.role?.startsWith("Автор")) data.author = mikhail;
  else if (project.role) data.contributor = mikhail;

  return {
    title: `${project.title} — ${project.category} | Absolute Mikhail`,
    description: project.description,
    robots: "index, follow",
    image: project.cover,
    imageAlt: `Обложка игры ${project.title}`,
    imageWidth: project.coverWidth,
    imageHeight: project.coverHeight,
    structuredData: data,
  };
};
