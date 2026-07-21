import { motion } from "framer-motion";
import { ArrowUpRight, Trophy, Star, Rocket, Award, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { milestones, type TimelineIcon } from "@/content/timeline";

const timelineIcons: Record<TimelineIcon, typeof Trophy> = {
  award: Award,
  rocket: Rocket,
  trophy: Trophy,
  star: Star,
};

const TimelineSection = () => {
  return (
    <section id="timeline" className="py-24 bg-background/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5"
          >
            <span className="text-xs font-display tracking-widest text-primary uppercase">
              Путь в Unreal Engine
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            <span className="gradient-text uppercase">От самообучения</span>
            <span className="mt-2 block text-foreground uppercase">до Unreal Authorized Instructor</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground"
          >
            Начал изучать Unreal Engine в 2015 году. Через пять лет он стал
            профессией, а затем привёл меня к релизам, кино, наградам и преподаванию.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line for all screens */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-primary/50 md:-translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex items-center justify-between md:justify-normal gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary z-10 -translate-x-1/2 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

                {/* Content Card */}
                <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="bg-card/40 backdrop-blur-sm border border-border p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                    <div className={`flex items-center gap-4 mb-3 ${i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {(() => {
                          const Icon = timelineIcons[m.icon];
                          return <Icon className="h-6 w-6" />;
                        })()}
                      </div>
                      <span className="font-display text-2xl font-bold text-primary/80">
                        {m.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">
                      {m.title}
                    </h3>
                    <p
                      className={`leading-relaxed text-muted-foreground ${
                        m.singleLineDescription
                          ? "lg:whitespace-nowrap lg:text-sm xl:text-base"
                          : ""
                      }`}
                    >
                      {m.description}
                    </p>
                    {m.links && (
                      <div className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 ${i % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                        {m.links.map((link) =>
                          link.href.startsWith("http") ? (
                            <a
                              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80"
                              href={link.href}
                              key={link.href}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {link.label}
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <Link
                              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80"
                              key={link.href}
                              to={link.href}
                            >
                              {link.label}
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-primary/20 bg-card/35 px-6 py-5 shadow-xl shadow-black/10 backdrop-blur-sm sm:px-8">
            <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-lg shadow-primary/10">
              <Moon className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="relative text-sm leading-relaxed text-muted-foreground sm:text-base">
              Днём я проектировал и внедрял IT-системы, а по ночам осваивал геймдев.
              Со временем ночные прототипы превратились в профессию, победы и публичные продукты. <br/>
              <span className="text-foreground">Вместо плаща у меня всё ещё Unreal Engine =)</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TimelineSection;
