import { motion } from "framer-motion";
import { ArrowUpRight, Trophy, Star, Rocket, Award, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTitle } from "@/components/ui/section-title";
import { SectionBadge } from "@/components/ui/section-badge";
import { milestones, type TimelineIcon } from "@/content/timeline";

const timelineIcons: Record<TimelineIcon, typeof Trophy> = { award: Award, rocket: Rocket, trophy: Trophy, star: Star };

const TimelineSection = () => (
  <section id="timeline" className="exhibition-section exhibition-warm scroll-mt-20 border-y border-border/60">
    <div className="container mx-auto px-6">
      <div className="exhibition-header">
        <div>
          <SectionBadge>Личная хронология · с 2015 года</SectionBadge>
          <SectionTitle>
            <span className="gradient-text">Как я сюда пришёл</span>
            <span className="mt-2 block">и что было по дороге</span>
          </SectionTitle>
        </div>
        <p className="max-w-xl text-base leading-7 text-muted-foreground lg:text-lg">
          В 2015 году я начал самостоятельно изучать Unreal Engine. Через пять лет
          он стал профессией. Здесь собраны первые шаги, релизы, кино, победы
          и преподавание — события, из которых складывался мой путь.
        </p>
      </div>
      <div className="border-t border-border">
        {milestones.map((milestone) => {
          const Icon = timelineIcons[milestone.icon];
          return (
            <motion.article
              key={milestone.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="grid gap-4 border-b border-border py-7 md:grid-cols-[160px_1fr] md:gap-8 md:py-9 lg:grid-cols-[220px_1fr]"
            >
              <div className="flex items-center gap-4 md:items-start">
                <span className="gradient-text font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{milestone.year}</span>
                <Icon className="h-5 w-5 shrink-0 text-primary/70 md:mt-3" aria-hidden="true" />
              </div>
              <div className="max-w-3xl">
                <h3 className="font-display text-xl font-bold md:text-2xl">{milestone.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{milestone.description}</p>
                {milestone.links && (
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                    {milestone.links.map((link) => link.href.startsWith("http") ? (
                      <a className="exhibition-link" href={link.href} key={link.href} rel="noopener noreferrer" target="_blank">
                        {link.label}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link className="exhibition-link" key={link.href} to={link.href}>
                        {link.label}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
      <div className="mt-10 flex max-w-4xl items-start gap-5 md:ml-auto md:mt-14">
        <Moon className="mt-1 h-7 w-7 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          Днём я проектировал и внедрял IT-системы, а по ночам осваивал геймдев.
          Со временем ночные прототипы превратились в профессию, победы и публичные продукты.
          <span className="mt-3 block text-foreground">Вместо плаща у меня всё ещё Unreal Engine =)</span>
        </p>
      </div>
    </div>
  </section>
);
export default TimelineSection;