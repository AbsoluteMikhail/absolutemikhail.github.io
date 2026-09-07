import { SectionTitle } from "@/components/ui/section-title";
import { motion } from "framer-motion";
import { Building2, Cpu, ServerCog } from "lucide-react";
import { engineeringFoundation } from "@/content/experience";

const stageIcons = [ServerCog, Building2, Cpu];

const EngineeringFoundationSection = () => (
  <section id="foundation" className="exhibition-section border-y border-border/60 bg-card/35">
    <div className="container mx-auto px-6">
      <div className="mb-10 max-w-4xl md:mb-14">
        <p className="exhibition-label">
          Первая глава · IT с 2011 года
        </p>
        <SectionTitle>
          <span className="gradient-text">Всё началось</span>
          <span className="mt-2 block text-foreground">с инженерной работы</span>
        </SectionTitle>
        <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
          Мой путь в IT начался с рабочих мест, сетей и инфраструктуры. Потом были
          автоматизация и руководство командой. Параллельно я учился делать игры —
          так инженерная работа постепенно встретилась с Unreal Engine.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {engineeringFoundation.map((stage, index) => {
          const Icon = stageIcons[index];
          return (
            <motion.article
              key={stage.period}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative border-t border-border pt-6"
            >
              <div className="relative">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="flex h-8 items-center text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-xl font-bold tracking-tight text-primary">{stage.period}</span>
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

      <div className="mt-10 max-w-3xl border-l-2 border-accent pl-5 text-sm leading-7 text-foreground md:text-base">
        Этот подход я и принёс в Unreal Engine:
        <br />
        разобраться в задаче, собрать устойчивое решение и довести его до результата.
      </div>
    </div>
  </section>
);

export default EngineeringFoundationSection;
