import { SectionTitle } from "@/components/ui/section-title";
import { SectionBadge } from "@/components/ui/section-badge";
import { motion } from "framer-motion";
import { Check, MessageCircle, SearchCode, Network } from "lucide-react";
import { ContactMessenger } from "@/components/ContactMessenger";
import { mentoringButtonStyles } from "@/components/ui/button";
import { mentoringPackages, type MentoringIcon } from "@/content/mentoring";

const packageIcons: Record<MentoringIcon, typeof MessageCircle> = {
  consultation: MessageCircle,
  project: SearchCode,
  architecture: Network,
};

const MentoringSection = () => {
  return (
    <section id="mentoring" className="exhibition-section relative scroll-mt-20 overflow-hidden bg-background">
      {/* Background glow decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-4xl"
        >
          <SectionBadge>Unreal Authorized Instructor · 2026</SectionBadge>
          <SectionTitle className="mb-6">
            <span className="gradient-text">Делюсь тем,</span>
            <span className="mt-2 block text-foreground">с чем работаю сам</span>
          </SectionTitle>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl leading-7">
            Помогаю с Unreal Engine, C++ и собственными играми.
            Работал как ментор со 100+ разработчиками — от первых шагов
            до сложных систем. Можно прийти с одним вопросом или со своим проектом.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {mentoringPackages.map((pkg, index) => {
            const Icon = packageIcons[pkg.icon];
            return (
              <motion.div
                key={pkg.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`group relative rounded-xl border-t-2 p-6 md:p-7 flex flex-col ${
                  pkg.popular
                    ? "border-primary bg-gradient-to-b from-primary/10 to-card/35"
                    : "border-border bg-card/30"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-7 right-6 text-[9px] font-display font-bold uppercase tracking-widest text-primary">
                    Популярный
                  </div>
                )}

                <div className="mb-6 lg:min-h-[180px]">
                  <div className="mb-6 h-8 w-8 flex items-center justify-center text-primary">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl xl:text-2xl font-display font-bold text-foreground mb-3">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="mb-6 border-b border-border/50 pb-6">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-foreground">
                      {pkg.price}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      / {pkg.duration}
                    </span>
                  </div>
                </div>

                <ul aria-label="Что разберём" className="space-y-3 mb-6">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <div className="w-4 h-5 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="mb-6 border-l-2 border-primary/40 pl-4 text-sm leading-6 text-foreground/90">
                  <span className="mb-1 block text-xs text-muted-foreground">Например</span>
                  {pkg.exampleTask}
                </p>

                <div className="mt-auto space-y-3 border-t border-border/50 pt-5 pb-6 text-sm leading-6 text-muted-foreground">
                  <p>{pkg.preparation}</p>
                  <p className="text-foreground/90">{pkg.result}</p>
                </div>

                <ContactMessenger
                  message={pkg.telegramMessage}
                  variant="unstyled"
                  className={mentoringButtonStyles(pkg.popular)}
                >
                  {pkg.buttonText}
                </ContactMessenger>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 border-t border-border pt-6"
        >
          <p className="text-muted-foreground text-sm font-medium">
            Если не уверены, какой формат выбрать — помогу определиться и не
            переплачивать.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground/80">
            <span className="block">
              За час разбираем выбранную задачу. Такая встреча не заменяет полный аудит проекта.
            </span>
            <span className="mt-2 block">
              Большинство точечных вопросов решаются за одну сессию.
              Если потребуется больше времени — заранее обсудим план.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MentoringSection;
