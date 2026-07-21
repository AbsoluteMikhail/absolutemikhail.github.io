import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, GraduationCap } from "lucide-react";
import { mentoredProjects } from "@/constants/mentoredProjects";

const MentoredProjectsSection = () => (
  <section id="mentored" className="scroll-mt-24 mt-32" aria-labelledby="mentored-projects-title">
    <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/[0.04] p-6 md:p-10 lg:p-12">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-display text-xs uppercase tracking-widest text-primary">
            <GraduationCap className="h-4 w-4" />
            Результат наставничества
          </div>
          <h2 id="mentored-projects-title" className="font-display text-3xl font-bold md:text-5xl">
            Проекты под моим
            <span className="gradient-text"> наставничеством</span>
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            Игры, которым я помогал пройти путь от идеи и первых систем до
            рабочего билда. Здесь результат принадлежит командам — моя задача
            была помочь им принять сильные технические и продуктовые решения.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-background/50 px-5 py-4 backdrop-blur-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-foreground">{mentoredProjects.length}</div>
            <div className="text-xs text-muted-foreground">публичных проекта</div>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        {mentoredProjects.map((project, index) => (
          <motion.a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: index * 0.07 }}
            className="group grid overflow-hidden rounded-3xl border border-border bg-card/60 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 sm:grid-cols-[190px_1fr]"
          >
            <div className="relative aspect-[315/250] overflow-hidden bg-secondary sm:aspect-auto sm:min-h-[240px]">
              <img
                src={project.cover}
                alt={`Обложка проекта ${project.title}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent sm:bg-gradient-to-r" />
            </div>

            <div className="flex min-w-0 flex-col p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-display uppercase tracking-widest text-primary">
                    {project.genre}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-auto space-y-2 border-t border-border/60 pt-5 text-xs">
                <div className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                  <span className="font-medium">{project.contribution}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {project.status}
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default MentoredProjectsSection;
