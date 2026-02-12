import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import gameCover1 from "@/assets/game-cover-1.jpg";
import gameCover2 from "@/assets/game-cover-2.jpg";
import gameCover3 from "@/assets/game-cover-3.jpg";

interface Game {
  id: number;
  title: string;
  genre: string;
  year: string;
  cover: string;
  shortDesc: string;
  fullDesc: string;
  tech: string[];
  players: string;
}

const games: Game[] = [
  {
    id: 1,
    title: "Dragon's Wrath",
    genre: "Action RPG",
    year: "2024",
    cover: gameCover1,
    shortDesc:
      "Эпическое тёмное фэнтези с открытым миром, динамичной боевой системой и глубоким сюжетом о борьбе добра и зла.",
    fullDesc:
      "Dragon's Wrath — это масштабная Action RPG в мрачном фэнтезийном мире. Игрок берёт на себя роль последнего выжившего рыцаря ордена Огня, который должен остановить пробуждение древнего дракона. Игра предлагает обширный открытый мир с десятками подземелий, уникальную систему магии и крафта, а также нелинейный сюжет с множеством концовок. Разработка заняла 3 года и была полностью выполнена мной.",
    tech: ["Unreal Engine 5", "Blender", "FMOD"],
    players: "50K+",
  },
  {
    id: 2,
    title: "Stellar Command",
    genre: "Sci-Fi Shooter",
    year: "2022",
    cover: gameCover2,
    shortDesc:
      "Космический шутер с процедурно генерируемыми мирами и мультиплеером на 64 игрока.",
    fullDesc:
      "Stellar Command переносит игроков в далёкое будущее, где человечество колонизировало десятки звёздных систем. Вы командуете отрядом космических истребителей и участвуете в масштабных космических сражениях. Уникальная система процедурной генерации создаёт бесконечное разнообразие миссий и карт. Мультиплеер поддерживает до 64 игроков одновременно.",
    tech: ["Unity", "Photon", "Substance Painter"],
    players: "30K+",
  },
  {
    id: 3,
    title: "Neon Streets",
    genre: "Cyberpunk Adventure",
    year: "2023",
    cover: gameCover3,
    shortDesc:
      "Киберпанк-приключение в неоновом мегаполисе будущего с элементами стелса и головоломками.",
    fullDesc:
      "Neon Streets — это атмосферное приключение в стилистике киберпанка. Вы играете за хакера, который раскрывает заговор мегакорпораций. Игра сочетает элементы стелса, хакерские головоломки и динамичные погони по крышам небоскрёбов. Особое внимание уделено атмосфере: дождливые улицы, неоновые вывески, джазовый саундтрек.",
    tech: ["Godot 4", "Aseprite", "Audacity"],
    players: "20K+",
  },
];

const GamesSection = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

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
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 items-center cursor-pointer group`}
              onClick={() => setSelectedGame(game)}
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
                  <span className="text-sm text-muted-foreground">{game.players} игроков</span>
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

      {/* Game Detail Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedGame(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-3xl w-full bg-card border border-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedGame.cover}
                alt={selectedGame.title}
                className="w-full aspect-video object-cover"
              />

              <div className="p-8 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full gradient-primary text-xs font-display text-primary-foreground tracking-wider uppercase">
                    {selectedGame.genre}
                  </span>
                  <span className="text-sm text-muted-foreground">{selectedGame.year}</span>
                  <span className="text-sm text-muted-foreground">{selectedGame.players} игроков</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  {selectedGame.title}
                </h2>

                <p className="text-muted-foreground leading-relaxed text-lg">
                  {selectedGame.fullDesc}
                </p>

                <div className="flex flex-wrap gap-2 pt-4">
                  {selectedGame.tech.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-2 rounded-lg bg-secondary text-sm text-secondary-foreground font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GamesSection;
