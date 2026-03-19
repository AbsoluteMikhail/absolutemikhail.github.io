import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ExternalLink, Calendar, Users, Rocket, Code, Layout } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import gribnikCover from "@/assets/projects/gribnik/cover.jpg";
import duelantCover from "@/assets/projects/duelant/cover.jpg";
import kolobokCover from "@/assets/projects/kolobok/cover.jpg";
import LegalModal from "@/components/LegalModal";
import { legalContent } from "@/constants/legalContent";

const projects = [
  {
    id: 2,
    title: "DUELANT",
    genre: "Duel Simulator",
    year: "2026",
    cover: duelantCover,
    desc: "Динамичный симулятор дуэлей в виртуальных мирах будущего. Короткие и яростные схватки, где всё решает реакция и выбор оружия.",
    tech: ["Unreal Engine 5", "Niagara VFX", "Advanced IK"],
    stats: "В разработке",
    type: "Game",
    storeUrl: "https://store.steampowered.com/app/2854500?curator_clanid=45056388&utm_source=absolute&utm_medium=portfolio"
  },
  {
    id: 1,
    title: "G.R.I.B.N.I.K. в лесу дураков",
    genre: "FPS / Horror",
    year: "2025",
    cover: gribnikCover,
    desc: "Атмосферный хоррор-симулятор выживания в стиле PSX. Исследуйте странный лес, собирайте грибы и защищайтесь от сказочных тварей.",
    tech: ["Unreal Engine 5", "Blender", "PSX Shader Stack"],
    stats: "В разработке",
    type: "Game",
    storeUrl: "https://vkplay.ru/play/game/gribnik-the-forest-of-fools-44079"
  },
  {
    id: 3,
    title: "КОЛОБОК против ЯЩЕРОВ",
    genre: "Arcade / Arkanoid",
    year: "2024",
    cover: kolobokCover,
    desc: "Защитите Русь-матушку от вторжения легионов ящеров в этом безумном арканоиде с харизматичным героем и драйвовым саундтреком.",
    tech: ["Unreal Engine 5", "Niagara VFX", "Original OST"],
    stats: "10K+ Игроков",
    type: "Game",
    storeUrl: "https://vkplay.ru/play/game/kolobok-protiv-jascherov-arkanoid-40059"
  }
];

const Projects = () => {
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "terms" | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
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

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-card/40 backdrop-blur-sm border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={project.cover} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-display uppercase tracking-widest text-primary">
                      {project.genre}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground font-display tracking-widest uppercase">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {project.year}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      {project.stats}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((t) => (
                      <span 
                        key={t}
                        className="px-2.5 py-1 rounded-md bg-secondary/50 border border-border text-[10px] text-secondary-foreground font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {project.storeUrl && (
                    <a
                      href={project.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-display tracking-widest uppercase font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      Смотреть проект
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Footer inside container */}
          <div className="pt-8 mt-24 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-muted-foreground">
              © 2026 Absolute Mikhail. Crafted with passion for GameDev.
            </p>
            <div className="flex gap-8">
              <button
                onClick={() => setActiveLegalModal("privacy")}
                className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveLegalModal("terms")}
                className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </main>

      <LegalModal
        isOpen={activeLegalModal !== null}
        onClose={() => setActiveLegalModal(null)}
        title={activeLegalModal ? legalContent[activeLegalModal].title : ""}
        content={activeLegalModal ? legalContent[activeLegalModal].content : null}
      />

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-64 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default Projects;
