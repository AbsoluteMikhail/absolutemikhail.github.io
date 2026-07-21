import { motion } from "framer-motion";
import { Building2, Cpu, ServerCog } from "lucide-react";
import { engineeringFoundation } from "@/content/experience";

const stageIcons = [ServerCog, Building2, Cpu];

const EngineeringFoundationSection = () => (
  <section id="foundation" className="relative overflow-hidden border-b border-border/60 bg-card/20 py-20 md:py-24">
    <div className="container mx-auto px-6">
      <div className="mx-auto mb-14 max-w-4xl text-center">
        <p className="mb-3 font-display text-[10px] uppercase tracking-[0.24em] text-primary">
          До коммерческого геймдева
        </p>
        <h2 className="font-display text-3xl font-bold md:text-5xl">
          <span className="gradient-text uppercase">До разработки игр</span>
          <span className="mt-2 block text-foreground">откуда взялся инженерный подход</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
          Путь в IT начался в 2011 году: инфраструктура, эксплуатация, автоматизация и руководство командой.
          Это не геймдев, но именно там я научился отвечать за работающие системы,
          автоматизировать рутину и не бояться сложных технических задач.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
        {engineeringFoundation.map((stage, index) => {
          const Icon = stageIcons[index];
          return (
            <motion.article
              key={stage.period}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-background/55 p-7"
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/[0.06] blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-bold text-primary/85">{stage.period}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{stage.company}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{stage.role}</p>
                <p className="mt-5 text-sm leading-6 text-foreground/75">{stage.description}</p>
                {stage.evidence && (
                  <p className="mt-5 border-l-2 border-primary/45 pl-4 text-xs leading-5 text-muted-foreground">
                    {stage.evidence}
                  </p>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-primary/20 bg-primary/[0.04] px-6 py-5 text-center text-sm leading-6 text-foreground/80 md:text-base">
        Этот подход я и принёс в Unreal Engine: разобраться в задаче, собрать устойчивое решение и довести его до результата.
      </div>
    </div>
  </section>
);

export default EngineeringFoundationSection;
