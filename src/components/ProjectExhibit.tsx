import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/constants/projects";
import ProjectStatusIcon from "@/components/ProjectStatusIcon";
import { cn } from "@/lib/utils";

interface ProjectExhibitProps {
  project: Project;
  onSelect: (project: Project) => void;
  featured?: boolean;
}

export default function ProjectExhibit({ project, onSelect, featured = false }: ProjectExhibitProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45 }}
      className={cn("group relative flex min-w-0 flex-col gap-5", featured && "md:col-span-2 lg:grid lg:grid-cols-[1.65fr_1fr] lg:items-center lg:gap-10")}
    >
      <button
        type="button"
        onClick={() => onSelect(project)}
        aria-label={`Подробнее о проекте ${project.title}`}
        className="absolute inset-0 z-20 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <span className="sr-only">Подробнее о проекте {project.title}</span>
      </button>
      <div className="relative overflow-hidden rounded-xl bg-card">
        <img
          src={project.cover}
          srcSet={project.coverSrcSet}
          sizes={featured ? "(min-width: 1024px) 65vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          alt={`Обложка проекта ${project.title} в жанре ${project.genre}`}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]"
        />
        <span className="absolute bottom-4 left-4 rounded bg-background/85 px-3 py-2 font-display text-[10px] uppercase tracking-wider text-foreground backdrop-blur-md">{project.genre}</span>
      </div>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="font-display tracking-wider">{project.year}</span>
          <span className={cn("inline-flex items-center gap-2", project.stats === "Заморожен" && "text-sky-300")}>
            <ProjectStatusIcon status={project.stats} className="h-3.5 w-3.5" />{project.stats}
          </span>
        </div>
        <h3 className={cn("font-display text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary", featured && "lg:text-4xl")}>{project.title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{project.shortDesc}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {project.tech.map((tech) => <span key={tech} className="border-l border-primary/50 pl-2 text-[11px] text-muted-foreground">{tech}</span>)}
        </div>
        <span className="exhibition-link mt-3" aria-hidden="true">Подробнее<ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </motion.article>
  );
}
