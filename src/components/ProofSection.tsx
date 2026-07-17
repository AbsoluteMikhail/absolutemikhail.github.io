import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Gamepad2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { proofItems, type ProofIcon } from "@/content/proof";

const icons: Record<ProofIcon, typeof Trophy> = {
  experience: BriefcaseBusiness,
  award: Trophy,
  course: BookOpen,
  projects: Gamepad2,
};

const ProofSection = () => (
  <section id="proof" aria-labelledby="proof-title" className="scroll-mt-20 border-y border-border/60 bg-card/25 py-12 md:py-16">
    <div className="container mx-auto px-6">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 font-display text-[10px] uppercase tracking-[0.22em] text-primary">
            Проверяемый опыт
          </p>
          <h2 id="proof-title" className="font-display text-2xl font-bold md:text-3xl">
            Коротко о практике и результатах
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Курс, награды и проекты открываются по ссылкам — факты можно проверить до первой встречи.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {proofItems.map((item, index) => {
          const Icon = icons[item.icon];
          const external = item.href.startsWith("http");
          const content = (
            <>
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <strong className="block font-display text-2xl text-foreground">{item.value}</strong>
              <span className="mt-2 block min-h-12 text-sm leading-6 text-muted-foreground">{item.label}</span>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                {item.linkLabel}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </>
          );

          return (
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              key={item.label}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {external ? (
                <a className="group block h-full rounded-2xl border border-border bg-background/55 p-6 transition-all hover:-translate-y-1 hover:border-primary/45" href={item.href} rel="noopener noreferrer" target="_blank">
                  {content}
                </a>
              ) : (
                <Link className="group block h-full rounded-2xl border border-border bg-background/55 p-6 transition-all hover:-translate-y-1 hover:border-primary/45" to={item.href}>
                  {content}
                </Link>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

export default ProofSection;
