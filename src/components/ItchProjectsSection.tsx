import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Gamepad2,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { itchProjects } from "@/constants/itchProjects";

const authorityFacts = [
  { icon: Gamepad2, value: "20", label: "игровых проектов" },
  { icon: Timer, value: "2–8 дней", label: "на джемовый проект" },
  { icon: Users, value: "Соло + команда", label: "оба формата разработки" },
] as const;

const ItchProjectsSection = () => (
  <section id="jams" className="scroll-mt-24 mt-32" aria-labelledby="itch-projects-title">
    <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-display uppercase tracking-widest text-primary">
          <Trophy className="h-3.5 w-3.5" />
          Избранные джемы и эксперименты
        </div>
        <h2 id="itch-projects-title" className="font-display text-3xl font-bold md:text-5xl">
          Быстро проверяю идеи —
          <span className="gradient-text"> довожу до игры</span>
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
          Небольшие законченные проекты, созданные в жёстких временных рамках.
          Здесь — практика системного дизайна, прототипирования и командной разработки.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[560px]">
        {authorityFacts.map((fact) => (
          <div key={fact.value} className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-sm">
            <fact.icon className="mb-3 h-5 w-5 text-primary" />
            <div className="font-display text-sm font-bold text-foreground">{fact.value}</div>
            <div className="mt-1 text-[11px] leading-4 text-muted-foreground">{fact.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {itchProjects.map((project, index) => (
        <motion.a
          key={project.title}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ delay: Math.min(index * 0.06, 0.24) }}
          className="group overflow-hidden rounded-3xl border border-border bg-card/40 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
        >
          <div className="relative aspect-[315/250] overflow-hidden bg-secondary">
            <img
              src={project.cover}
              alt={`Обложка игры ${project.title}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-background/80 px-3 py-1 text-[10px] font-display uppercase tracking-widest text-primary backdrop-blur-md">
              {project.genre}
            </span>
            <span className="absolute bottom-4 left-4 text-xs font-display tracking-widest text-white/70">
              {project.year}
            </span>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {project.title}
              </h3>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            <p className="min-h-[60px] text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <div className="mt-6 space-y-2 border-t border-border/60 pt-5 text-xs">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="h-3.5 w-3.5 shrink-0" />
                <span className="font-medium">{project.achievement}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Code2 className="h-3.5 w-3.5 shrink-0" />
                <span>{project.role}</span>
                <span className="text-border">•</span>
                <span>{project.duration}</span>
              </div>
            </div>
          </div>
        </motion.a>
      ))}

      <motion.a
        href="https://mikhaile.itch.io/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="group flex min-h-[360px] flex-col justify-between overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/50 to-card/30 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Gamepad2 className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-display uppercase tracking-[0.2em] text-primary">Полный архив</p>
          <h3 className="mt-3 font-display text-3xl font-bold text-foreground">
            Больше игр на itch.io
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Ранние прототипы, командные проекты и другие игровые эксперименты.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest text-primary">
            Открыть профиль
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
        </div>
      </motion.a>
    </div>
  </section>
);

export default ItchProjectsSection;
