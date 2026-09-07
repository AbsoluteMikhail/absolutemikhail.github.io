import { motion } from "framer-motion";
import { Check, Clapperboard, Code2, Gauge, Network } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { SectionBadge } from "@/components/ui/section-badge";
import { productionExperience, type ExperienceCase } from "@/content/experience";
import { cn } from "@/lib/utils";

const experienceIcons: Record<ExperienceCase["icon"], typeof Code2> = {
  gameplay: Network, world: Gauge, film: Clapperboard,
};

const ProductionExperienceSection = () => (
  <section id="production" className="exhibition-section scroll-mt-20">
    <div className="container mx-auto px-6">
      <div className="exhibition-header">
        <div>
          <SectionBadge>6+ лет коммерческой разработки</SectionBadge>
          <SectionTitle>
            <span className="gradient-text">Работа в командах.</span>
            <span className="mt-2 block">Игры, большие миры и кино</span>
          </SectionTitle>
        </div>
        <p className="max-w-xl text-base leading-7 text-muted-foreground lg:pb-1 lg:text-lg">
          Здесь — команды, в которых я работал, и мой вклад в общие проекты:
          сетевой геймплей, большие интерактивные пространства, оптимизация
          и инструменты для съёмок в Unreal Engine.
        </p>
      </div>
      <div className="border-t border-border">
        {productionExperience.map((item) => {
          const Icon = experienceIcons[item.icon];
          return (
            <motion.article
              key={item.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45 }}
              className={cn("grid gap-7 border-b border-border px-4 py-8 md:px-6 md:py-10 lg:grid-cols-[0.75fr_1.5fr_0.8fr] lg:gap-10", item.featured && "bg-gradient-to-r from-primary/[0.07] via-transparent to-transparent")}
            >
              <div>
                <div className="mb-5 flex items-center gap-3 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-semibold tracking-wider">{item.period}</span>
                </div>
                <h3 className="font-display text-2xl font-bold">{item.company}</h3>
                <p className="mt-3 text-[10px] uppercase leading-5 tracking-[0.14em] text-muted-foreground">{item.role}</p>
              </div>
              <div>
                <p className="text-base leading-7 text-foreground">{item.summary}</p>
                <ul className="mt-5 space-y-3">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l-2 border-primary/60 pl-5 lg:pl-6">
                <strong className="gradient-text font-display text-4xl font-bold">{item.metric}</strong>
                <p className="mt-2 text-[10px] uppercase leading-5 tracking-[0.12em] text-foreground">{item.metricLabel}</p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.result}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);
export default ProductionExperienceSection;
