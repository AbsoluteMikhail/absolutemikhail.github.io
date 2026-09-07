import { SectionTitle } from "@/components/ui/section-title";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, GraduationCap } from "lucide-react";
import { mentoredProjects } from "@/constants/mentoredProjects";

const MentoredProjectsSection = () => (
  <section id="mentored" className="scroll-mt-24 mt-20 border-t border-border pt-12 md:mt-28" aria-labelledby="mentored-projects-title">
    <div className="relative">

      <div className="relative mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="exhibition-label">
            <GraduationCap className="h-4 w-4" />
            Рядом с другими разработчиками
          </div>
          <SectionTitle id="mentored-projects-title">
            Проекты под моим
            <span className="gradient-text"> наставничеством</span>
          </SectionTitle>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            Эти игры создали команды, с которыми я работал как ментор.
            Помогал продумывать архитектуру, разбирать технические вопросы
            и доводить проекты до рабочего билда. Авторство и результат — их.
          </p>
        </div>

        <div className="flex items-center gap-4 border-l-2 border-primary pl-5 py-2">
          <div className="flex h-11 w-11 items-center justify-center text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-foreground">{mentoredProjects.length}</div>
            <div className="text-xs text-muted-foreground">публичных проекта</div>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
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
            className="group grid min-w-0 gap-5 xl:grid-cols-[170px_1fr]"
          >
            <div className="relative aspect-[315/250] overflow-hidden rounded-xl bg-secondary xl:aspect-auto xl:min-h-[240px]">
              <img
                src={project.cover}
                alt={`Обложка проекта ${project.title}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent sm:bg-gradient-to-r" />
            </div>

            <div className="flex min-w-0 flex-col">
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

              <div className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs">
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
