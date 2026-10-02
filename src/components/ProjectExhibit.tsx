import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/constants/projects";
import ProjectStatusIcon from "@/components/ProjectStatusIcon";
import { cn } from "@/lib/utils";

type ProjectExhibitProps = {
  project: Project;
  featured?: boolean;
  priority?: boolean;
} & ({ onSelect: (project: Project) => void; href?: never } | { href: string; onSelect?: never });

const coverSizes = {
  featured: "(min-width: 1024px) calc((min(100vw, 1280px) - 3rem) * 0.623), calc(100vw - 3rem)",
  // Two columns from 768px. Container is full-bleed until 1400px; px-6 is 3rem and the gap is 2.5rem.
  // At 1440px the card is 656px, so 1x and 2x (~1312px) both skip the 640w file.
  // Under 768px the slot stays below 640px at Lighthouse DPR 1.75.
  archive: "(min-width: 1400px) calc((1400px - 3rem - 2.5rem) / 2), (min-width: 768px) calc((100vw - 3rem - 2.5rem) / 2), calc(100vw - 3rem)",
  home: "(min-width: 1024px) calc((min(100vw, 1280px) - 3rem - 4rem) / 3), (min-width: 768px) calc((min(100vw, 1280px) - 3rem - 2rem) / 2), calc(100vw - 3rem)",
};

export default function ProjectExhibit({ project, onSelect, href, featured = false, priority = false }: ProjectExhibitProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45 }}
      className={cn("group relative flex min-w-0 flex-col gap-5", featured && "lg:col-span-3 lg:grid lg:grid-cols-[1.65fr_1fr] lg:items-center lg:gap-10")}
    >
      {href ? <Link to={href} aria-label={`Подробнее о проекте ${project.title}`} className="absolute inset-0 z-20 rounded-xl focus-visible:ring-2 focus-visible:ring-primary" /> : <button
        type="button"
        onClick={() => onSelect?.(project)}
        aria-label={`Подробнее о проекте ${project.title}`}
        className="absolute inset-0 z-20 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <span className="sr-only">Подробнее о проекте {project.title}</span>
      </button>}
      <div className="relative overflow-hidden rounded-xl bg-card">
        <img
          src={project.cover}
          srcSet={project.coverSrcSet}
          sizes={featured ? coverSizes.featured : href ? coverSizes.archive : coverSizes.home}
          alt={`Обложка проекта ${project.title} в жанре ${project.genre}`}
          width={project.coverWidth}
          height={project.coverHeight}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchpriority: "high" } : { fetchpriority: "low" })}
          decoding="async"
          className="aspect-video w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]"
        />
        <span className="absolute bottom-4 left-4 rounded bg-background/85 px-3 py-2 font-display text-[10px] uppercase tracking-wider text-foreground backdrop-blur-md">{project.genre}</span>
      </div>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="font-display tracking-wider">{project.year}</span>
          <span className={cn("inline-flex items-center gap-2", project.stats === "Заморожен" && "text-sky-300 [html.light_&]:text-sky-800")}>
            <ProjectStatusIcon status={project.stats} className="h-3.5 w-3.5" />{project.stats}
          </span>
        </div>
        <h2 className={cn("font-display text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary", featured && "lg:text-4xl")}>{project.title}</h2>
        {project.role && <p className="mt-3 text-xs font-medium leading-5 text-primary">{project.role}</p>}
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{project.shortDesc}</p>
        <span className="exhibition-link mt-4" aria-hidden="true">Подробнее<ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </motion.article>
  );
}
