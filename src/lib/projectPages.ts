import { projects, type Project } from "@/constants/projects";

export type ProjectPage = Pick<Project, "slug" | "title" | "genre" | "cover" | "coverSrcSet" | "role" | "caseStudy" | "development"> & {
  category: "Игра";
  description: string;
  body: string;
  year?: string;
  status?: string;
  tech: string[];
  screenshots: string[];
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
