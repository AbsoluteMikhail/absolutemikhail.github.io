import { motion } from "framer-motion";
import { useRef } from "react";
import { Trophy, Star, Rocket, Award } from "lucide-react";

const milestones = [
  {
    year: "2026",
    title: "Лучший геймдизайн — G.R.I.B.N.I.K.",
    desc: "Награда за геймдизайн",
    icon: Award,
  },
  {
    year: "2025",
    title: "«Золотой Орёл» и Сколково",
    desc: "Премия за VFX в «Воздухе» и резидентство кластера видеоигр «Сколково»",
    icon: Award,
  },
  {
    year: "2024",
    title: "Автор курса «C++ в UE»",
    desc: "Записал курс для крупнейшей EdTech‑платформы",
    icon: Rocket,
  },
  {
    year: "2023",
    title: "Соло‑победа на «Синеус»",
    desc: "Первое место на офлайн‑хакатоне «Синеус»",
    icon: Trophy,
  },
  {
    year: "2022",
    title: "Кино и лайв‑ивенты",
    desc: "Работа над фильмом «Воздух» и концертом «Выпускной ВКонтакте 2022»",
    icon: Star,
  },
  {
    year: "2021",
    title: "Победа на Gamebox Hack",
    desc: "Также — «Выбор tinyBuild» на Unreal Engine Dev Contest",
    icon: Trophy,
  },
];

const TimelineSection = () => {
  return (
    <section id="timeline" className="py-24 bg-background/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5"
          >
            <span className="text-xs font-display tracking-widest text-primary uppercase">
              Мой путь
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold"
          >
            <span className="gradient-text uppercase">Достижения</span>
          </motion.h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line for all screens */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-primary/50 md:-translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex items-center justify-between md:justify-normal gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary z-10 -translate-x-1/2 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

                {/* Content Card */}
                <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="bg-card/40 backdrop-blur-sm border border-border p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                    <div className={`flex items-center gap-4 mb-3 ${i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <m.icon className="w-6 h-6" />
                      </div>
                      <span className="font-display text-2xl font-bold text-primary/80">
                        {m.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">
                      {m.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
