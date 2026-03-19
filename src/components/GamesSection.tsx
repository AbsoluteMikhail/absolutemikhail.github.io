import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Calendar, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/constants/projects";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import type { Project } from "@/constants/projects";

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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
        >
          <span className="gradient-text uppercase">Мои проекты</span>
        </motion.h2>

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
                  alt={game.title}
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
                  <Users className="w-4 h-4 text-muted-foreground ml-4" />
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
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
