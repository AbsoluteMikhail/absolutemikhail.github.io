import { motion } from "framer-motion";
import { Check, Clapperboard, Code2, Gauge, Network, Sparkles } from "lucide-react";
import { productionExperience, type ExperienceCase } from "@/content/experience";

const experienceIcons: Record<ExperienceCase["icon"], typeof Code2> = {
  gameplay: Network,
  world: Gauge,
  film: Clapperboard,
};

const ProductionExperienceSection = () => (
  <section id="production" className="relative scroll-mt-20 overflow-hidden border-b border-border/60 bg-background py-24">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-primary/[0.08] blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/5 blur-[120px]" />
    </div>

    <div className="container relative z-10 mx-auto px-6">
      <div className="mb-14 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
        <div>
          <p className="mb-3 font-display text-[10px] uppercase tracking-[0.24em] text-primary">
            6+ лет коммерческой разработки
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
            <span className="gradient-text uppercase">Коммерческий опыт</span>
            <span className="mt-2 block text-foreground">Что я делал в командах</span>
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end lg:text-lg">
          Работал с сетевым геймплеем, большими интерактивными пространствами,
          оптимизацией и real-time инструментами для кино.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {productionExperience.map((item, index) => {
          const Icon = experienceIcons[item.icon];
          return (
            <motion.article
              key={item.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`group relative overflow-hidden rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/45 md:p-9 ${
                item.featured
                  ? "border-primary/30 bg-primary/[0.055] lg:col-span-2"
                  : "border-border bg-card/35"
              }`}
            >
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/[0.08] blur-3xl transition-colors group-hover:bg-primary/[0.12]" />
              <div className={`relative grid gap-8 ${item.featured ? "lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.55fr)]" : ""}`}>
                <div>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full border border-border bg-background/55 px-3 py-1.5 text-xs text-muted-foreground">
                      {item.period}
                    </span>
                  </div>
                  <p className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">{item.role}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">{item.company}</h3>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                    {item.summary}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-sm leading-6 text-foreground/80">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-end rounded-2xl border border-white/8 bg-background/45 p-6">
                  <Sparkles className="mb-5 h-5 w-5 text-primary" />
                  <strong className="font-display text-4xl text-foreground">{item.metric}</strong>
                  <span className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.metricLabel}</span>
                  <div className="my-5 h-px bg-gradient-to-r from-primary/45 to-transparent" />
                  <p className="text-sm leading-6 text-foreground/75">{item.result}</p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

export default ProductionExperienceSection;
