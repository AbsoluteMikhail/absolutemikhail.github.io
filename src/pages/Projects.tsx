import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ExternalLink, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { projects } from "@/constants/projects";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import type { Project } from "@/constants/projects";
import ProjectStatusIcon from "@/components/ProjectStatusIcon";
import SiteFooter from "@/components/SiteFooter";
import ScrollToTop from "@/components/ScrollToTop";
import ItchProjectsSection from "@/components/ItchProjectsSection";
import MentoredProjectsSection from "@/components/MentoredProjectsSection";
import ReviewsSection from "@/components/ReviewsSection";

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}

const ProjectCard = ({ project, index, onSelect }: ProjectCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(index * 0.1, 0.4) }}
    className="group relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
  >
    <button
      type="button"
      onClick={() => onSelect(project)}
      aria-label={`Подробнее о проекте ${project.title}`}
      className="absolute inset-0 z-20 cursor-pointer rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      <span className="sr-only">Подробнее о проекте {project.title}</span>
    </button>

    <div className="relative aspect-video overflow-hidden">
      <img
        src={project.cover}
        alt={`Обложка проекта ${project.title} в жанре ${project.genre}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
      <div className="absolute right-4 top-4">
        <div className="rounded-full border border-border bg-background/80 px-3 py-1 text-[10px] font-display uppercase tracking-widest text-primary backdrop-blur-md">
          {project.genre}
        </div>
      </div>
    </div>

    <div className="p-8">
      <div className="mb-4 flex items-center gap-4 text-xs font-display uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          {project.year}
        </span>
        <span className={`flex items-center gap-1.5 ${project.stats === "Заморожен" ? "text-sky-300" : ""}`}>
          <ProjectStatusIcon status={project.stats} className="h-3 w-3" />
          {project.stats}
        </span>
      </div>

      <h3 className="mb-4 text-2xl font-display font-bold text-foreground transition-colors group-hover:text-primary">
        {project.title}
      </h3>

      <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {project.shortDesc}
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-[10px] font-medium text-secondary-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
      >
        Подробнее
        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </div>
  </motion.article>
);

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const activeProjects = projects.filter((project) => project.stats !== "Заморожен");
  const frozenProjects = projects.filter((project) => project.stats === "Заморожен");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Назад на главную
              </Link>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-display font-bold"
              >
                ВСЕ <span className="gradient-text">ПРОЕКТЫ</span>
              </motion.h1>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-md md:text-right"
            >
              Архив моих работ: от небольших прототипов до полноценных релизов. Каждая игра — это отдельный мир и уникальный вызов.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} onSelect={setSelectedProject} />
            ))}
          </div>

          {frozenProjects.length > 0 && (
            <section className="mt-32" aria-labelledby="frozen-projects-title">
              <div className="mb-12 max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/5 px-4 py-1.5 text-xs font-display uppercase tracking-widest text-sky-300">
                  Архив разработки
                </div>
                <h2 id="frozen-projects-title" className="text-3xl font-display font-bold md:text-5xl">
                  Заморожены, <span className="gradient-text">но не забыты</span>
                </h2>
                <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                  Проекты, которые не дошли до релиза, но оставили после себя работающие механики,
                  сильные идеи и опыт, пригодившийся в следующих играх.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {frozenProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} onSelect={setSelectedProject} />
                ))}
              </div>
            </section>
          )}

          <ItchProjectsSection />
          <MentoredProjectsSection />
          
        </div>
      </main>
      <ReviewsSection />
      <SiteFooter projectsPage />
      <ScrollToTop />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-64 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default Projects;
