import { SectionTitle } from "@/components/ui/section-title";
import { motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, Gamepad2, GraduationCap, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { proofItems, type ProofIcon } from "@/content/proof";

const icons: Record<ProofIcon, typeof Trophy> = {
  experience: BriefcaseBusiness,
  award: Trophy,
  instructor: GraduationCap,
  projects: Gamepad2,
};

const ProofSection = () => (
  <section id="proof" aria-labelledby="proof-title" className="scroll-mt-20 border-y border-border/60 bg-card/40 py-10 md:py-14">
    <div className="container mx-auto px-6">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="exhibition-label">
            Если мы ещё не знакомы
          </p>
          <SectionTitle id="proof-title" size="compact">
            Несколько ориентиров
          </SectionTitle>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Разработка, хакатоны и преподавание — разные стороны того, чем я занимаюсь.
          Отсюда можно перейти к работам, занятиям или истории победы.
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        {proofItems.map((item, index) => {
          const Icon = icons[item.icon];
          const external = item.href.startsWith("http");
          const content = (
            <>
              <span className="mb-4 flex h-8 items-center text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <strong className="block font-display text-3xl font-bold tracking-tight text-foreground">{item.value}</strong>
              <span className="mt-2 block min-h-12 whitespace-pre-line text-sm leading-6 text-muted-foreground">{item.label}</span>
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
                <a className="group block h-full border-t border-border py-6 transition-colors hover:border-primary" href={item.href} rel="noopener noreferrer" target="_blank">
                  {content}
                </a>
              ) : (
                <Link className="group block h-full border-t border-border py-6 transition-colors hover:border-primary" to={item.href}>
                  {content}
                </Link>
              )}
            </motion.article>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.45 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-3 grid gap-3 border-t border-primary/30 pt-6 md:grid-cols-[minmax(0,0.7fr)_minmax(0,2fr)] md:items-center md:gap-8"
      >
        <p className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
          Победы и награды
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Gamebox Hack — победитель · Unreal Engine Dev Contest — выбор tinyBuild ·
          «Синеус» — 1-е место и главный приз · G.R.I.B.N.I.K. — награда «Лучший геймдизайн».
        </p>
      </motion.div>
    </div>
  </section>
);

export default ProofSection;
