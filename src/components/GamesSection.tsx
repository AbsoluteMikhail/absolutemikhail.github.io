import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import gribnikCover from "@/assets/projects/gribnik/cover.jpg";
import duelantCover from "@/assets/projects/duelant/cover.jpg";
import kolobokCover from "@/assets/projects/kolobok/cover.jpg";

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
    title: "G.R.I.B.N.I.K. в лесу дураков",
    genre: "FPS / Horror / Simulator",
    year: "2025",
    cover: gribnikCover,
    shortDesc:
      "Уникальная смесь симулятора грибника с дробовиком и хоррора в стиле PSX. Выживайте в странном лесу, где ваш единственный друг — старый кибер-холодильник.",
    fullDesc:
      "Герой просыпается в светлом, но пугающем лесу. Единственное спасение — ржавый кибер-холодильник, который служит базой. Если не вернуться к нему до темноты, лес поглотит вас. \n\nОсобенности игры:\n— Атмосферная Low-Poly графика в духе эпохи PlayStation 1;\n— Кибернизированные герои русских народных сказок;\n— Глубокое взаимодействие с грибами и вариативность прохождения;\n— Нарративное окружение и музыка, отсылающая к классике S.T.A.L.K.E.R. и Doom;\n— Две концовки, раскрывающие истинный смысл происходящего.",
    tech: ["Unreal Engine 5", "Blender", "FMOD", "PSX Shader Stack"],
    players: "В разработке",
  },
  {
    id: 2,
    title: "DUELANT",
    genre: "Duel Simulator",
    year: "В разработке",
    cover: duelantCover,
    shortDesc:
      "Адреналиновые дуэли в разных эпохах под присмотром ИИ-помощницы Малены. Кровь, деньги и 30 секунд, чтобы доказать, кто здесь лучший стрелок.",
    fullDesc:
      "Недалекое будущее. Виртуальные дуэли стали легальным способом заработка и развлечения. В роли молодого дуэлянта вам предстоит сражаться в разных сеттингах — от Дикого Запада до киберпанка. \n\nКлючевые фишки:\n— 30-секундные динамичные поединки;\n— Сопровождение харизматичной ИИ-спутницы Малены;\n— Система отстрела конечностей и прокачка способностей;\n— Элементы Roguelike: риск обнуления прогресса в турнирном режиме;\n— Динамическая смена погоды и времени суток, влияющая на геймплей.",
    tech: ["Unreal Engine 5", "Niagara VFX", "Advanced IK System"],
    players: "Demo soon",
  },
  {
    id: 3,
    title: "КОЛОБОК против ЯЩЕРОВ",
    genre: "Arcade / Arkanoid",
    year: "2024",
    cover: kolobokCover,
    shortDesc:
      "Безумный арканоид о защите Руси-матушки. Помогите харизматичному комку теста отбить атаку легионов ящеров и спасти родной дом.",
    fullDesc:
      "Ящеры вторглись на Русь! Лишь Колобок, выпрыгнувший из печки, готов принять вызов. Катитесь, отскакивайте и крушите врагов в этом динамичном переосмыслении классического арканоида. \n\nВас ждет:\n— 21 уникальный уровень в разных локациях;\n— 3 уровня сложности: от новичка до мастера;\n— Бесконечный режим для самых стойких защитников;\n— 18 оригинальных музыкальных треков;\n— Легионы ящеров с уникальным поведением;\n— Море юмора и достижений.",
    tech: ["Unity", "C#", "Aseprite", "Original OST"],
    players: "10K+",
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
                  <span className="text-sm text-muted-foreground">{game.players}</span>
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
                  <span className="text-sm text-muted-foreground">{selectedGame.players}</span>
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
