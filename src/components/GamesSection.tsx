import { SectionTitle } from "@/components/ui/section-title";
import { SectionBadge } from "@/components/ui/section-badge";
import { useState } from "react";
import { motion } from "framer-motion";
import { buttonStyles } from "@/components/ui/button";
import {
  ArrowUpRight,
  ChevronRight,
  Gamepad2,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/constants/projects";
import { mentoredProjects } from "@/constants/mentoredProjects";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import type { Project } from "@/constants/projects";
import ProjectExhibit from "@/components/ProjectExhibit";

const GamesSection = () => {
  const [selectedGame, setSelectedGame] = useState<Project | null>(null);

  const handleOpenModal = (game: Project) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <section id="games" className="exhibition-section relative bg-gradient-to-b from-background via-primary/[0.035] to-background">
      <div className="container mx-auto px-6">
        <div className="mb-12 max-w-4xl md:mb-16">
          <SectionBadge
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            size="md"
          >
            Собственные игры и работа в командах
          </SectionBadge>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="gradient-text">Игры, к которым</span>
            <br />
            <span className="text-foreground">я приложил руку</span>
          </SectionTitle>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Дуэли, вампиры в VR, грибник с дробовиком и Колобок против ящеров.
            Здесь — собственные игры и проекты, над которыми я работал в команде.
            Откройте обложку, чтобы посмотреть видео, скриншоты и подробности.
          </motion.p>
        </div>

        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:gap-x-12 lg:gap-y-14">
          {projects.filter((game) => game.stats !== "Заморожен").map((game, i) => (
            <ProjectExhibit key={game.id} project={game} featured={i === 0} onSelect={handleOpenModal} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-8 border-y border-border py-8 lg:grid-cols-2 lg:gap-16"
        >
          <Link
            to="/projects#jams"
            className="group relative py-2"
          >
            <div className="relative">
              <div className="mb-6 flex items-start justify-between gap-4">
                <span className="flex h-8 items-center text-primary">
                  <Gamepad2 className="h-6 w-6" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                Джемы и эксперименты
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                С чего начинаются игры
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                В общем архиве — 20 игровых проектов, включая короткие эксперименты
                и джемовые работы. DUELANT тоже начинался как идея для джема,
                а затем вырос в большой коммерческий проект.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border-l border-border pl-3 pr-1 py-1 text-xs text-muted-foreground">
                  От джемов до релизов
                </span>
                <span className="inline-flex items-center gap-1.5 border-l border-border pl-3 pr-1 py-1 text-xs text-muted-foreground">
                  <Trophy className="h-3.5 w-3.5 text-primary" /> 6-е место
                </span>
                <span className="border-l border-border pl-3 pr-1 py-1 text-xs text-muted-foreground">
                  Steam · VK Play · itch.io
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/projects#mentored"
            className="group relative py-2"
          >
            <div className="relative">
              <div className="mb-6 flex items-start justify-between gap-4">
                <span className="flex h-8 items-center text-primary">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                Игры моих подопечных
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                {mentoredProjects.length} проектов под наставничеством
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                Эти игры сделали команды, которым я помогал с архитектурой
                и разработкой. Здесь можно посмотреть, до чего они дошли,
                и открыть их проекты.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {mentoredProjects.map(({ title }) => (
                  <span
                    key={title}
                    className="border-l border-border pl-3 pr-1 py-1 text-xs text-muted-foreground"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#timeline"
            className={buttonStyles({ variant: "outline", size: "lg", className: "inline-flex items-center justify-center" })}
          >
            Моя история
          </a>
          <Link
            to="/projects"
            className={buttonStyles({ variant: "primary", size: "lg", className: "group inline-flex items-center gap-2" })}
          >
            Все проекты
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <ProjectDetailModal
        project={selectedGame}
        isOpen={selectedGame !== null}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default GamesSection;
