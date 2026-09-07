import { SectionTitle } from "@/components/ui/section-title";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { projects } from "@/constants/projects";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import type { Project } from "@/constants/projects";
import ProjectExhibit from "@/components/ProjectExhibit";
import SiteFooter from "@/components/SiteFooter";
import ScrollToTop from "@/components/ScrollToTop";
import ItchProjectsSection from "@/components/ItchProjectsSection";
import MentoredProjectsSection from "@/components/MentoredProjectsSection";
import ReviewsSection from "@/components/ReviewsSection";

const Projects = () => {
  const { hash } = useLocation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const activeProjects = projects.filter((project) => project.stats !== "Заморожен");
  const frozenProjects = projects.filter((project) => project.stats === "Заморожен");

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-16 pt-28 md:pt-36">
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
                className="text-4xl md:text-6xl font-display font-bold tracking-tight"
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
              Здесь живут мои релизы, командные работы, джемовые эксперименты и замороженные идеи. Можно рассматривать обложки, открывать игры и прослеживать, как менялись проекты.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
            {activeProjects.map((project) => (
              <ProjectExhibit key={project.id} project={project} onSelect={setSelectedProject} />
            ))}
          </div>

          {frozenProjects.length > 0 && (
            <section className="mt-20 border-t border-border pt-12 md:mt-28" aria-labelledby="frozen-projects-title">
              <div className="mb-12 max-w-3xl">
                <div className="exhibition-label text-sky-300">
                  Архив разработки
                </div>
                <SectionTitle id="frozen-projects-title">
                  Заморожены, <span className="gradient-text">но не забыты</span>
                </SectionTitle>
                <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                  Эти проекты остановились до релиза. Я оставил их в архиве: здесь есть
                  работающие механики, идеи и опыт, который пригодился в следующих играх.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
                {frozenProjects.map((project) => (
                  <ProjectExhibit key={project.id} project={project} onSelect={setSelectedProject} />
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
