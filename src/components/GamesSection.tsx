import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  ChevronRight,
  ExternalLink,
  Gamepad2,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/constants/projects";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import type { Project } from "@/constants/projects";
import ProjectStatusIcon from "@/components/ProjectStatusIcon";

const GamesSection = () => {
  const [selectedGame, setSelectedGame] = useState<Project | null>(null);

  const handleOpenModal = (game: Project) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <section id="games" className="py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5"
          >
            <span className="text-xs font-display tracking-widest text-primary uppercase">
              Практика
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            <span className="gradient-text uppercase">Я не только преподаю —</span>
            <br />
            <span className="text-foreground uppercase">я сам делаю игры</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Все, что обсуждаем на консультациях, основано не на теории, а на
            реальных проектах.
          </motion.p>
        </div>

        <div className="space-y-16">
          {projects.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 items-center cursor-pointer group`}
              onClick={() => handleOpenModal(game)}
            >
              {/* Cover */}
              <div className="w-full md:w-1/2 relative overflow-hidden rounded-xl">
                <img
                  src={game.cover}
                  alt={`Обложка игры ${game.title} в жанре ${game.genre}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-display text-primary tracking-wider uppercase">
                    {game.genre}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{game.year}</span>
                  <ProjectStatusIcon
                    status={game.stats}
                    className="ml-4 h-4 w-4 text-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground">{game.stats}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-display font-bold text-foreground group-hover:text-glow transition-all">
                  {game.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {game.shortDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {game.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-md bg-secondary text-xs text-secondary-foreground font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 text-sm text-primary font-display tracking-wider uppercase group-hover:gap-3 transition-all">
                  Подробнее <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid gap-6 lg:grid-cols-2"
        >
          <Link
            to="/projects#jams"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 md:p-8"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-colors group-hover:bg-primary/15" />
            <div className="relative">
              <div className="mb-6 flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Gamepad2 className="h-6 w-6" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                Публичная практика
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                12+ опубликованных проектов
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                От прототипов, собранных за несколько дней, до полноценных
                релизов. DUELANT тоже начался как джемовая идея и вырос в большой
                коммерческий проект.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                  От джемов до релизов
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                  <Trophy className="h-3.5 w-3.5 text-primary" /> 6-е место
                </span>
                <span className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                  Steam · VK Play · itch.io
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/projects#mentored"
            className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 md:p-8"
          >
            <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl transition-colors group-hover:bg-primary/15" />
            <div className="relative">
              <div className="mb-6 flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                Результаты менторинга
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                4 публичных проекта команд
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                Помогаю командам пройти путь от идеи и архитектуры до рабочего
                билда, который можно скачать и показать игрокам.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Гость древности",
                  "Phantasma",
                  "Potato Ded",
                  "Any World",
                ].map((title) => (
                  <span
                    key={title}
                    className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground"
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
            href="#mentoring"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full gradient-primary text-primary-foreground font-display text-sm font-semibold tracking-wider uppercase box-glow transition-transform hover:scale-105"
          >
            Обсудить менторинг
          </a>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary border border-border text-foreground font-display text-sm tracking-wider uppercase hover:bg-primary/10 hover:border-primary/50 transition-all group"
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
