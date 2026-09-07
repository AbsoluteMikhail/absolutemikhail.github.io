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
    <section id="mentoring" className="exhibition-section relative overflow-hidden bg-background">
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
            Пишу курсы по Unreal Engine и C++, занимаюсь со студентами
            и помогаю командам с их играми. За это время работал как ментор
            со 100+ разработчиками. Если хотите разобрать свой код, продумать систему
            или подготовиться к собеседованию — ниже форматы встреч.
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

                <div className="mb-6">
                  <div
                    className={`h-8 w-8 flex items-center justify-center mb-6 ${
                      pkg.popular
                        ? "text-primary"
                        : "text-primary"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl xl:text-2xl font-display font-bold text-foreground mb-3">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="mb-7 border-b border-border/50 pb-7">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-foreground">
                      {pkg.price}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      за сессию
                    </span>
                  </div>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div>
                      <dt className="font-semibold text-foreground">Длительность</dt>
                      <dd className="mt-1 text-muted-foreground">{pkg.duration}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Подготовка</dt>
                      <dd className="mt-1 text-muted-foreground">{pkg.preparation}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Результат</dt>
                      <dd className="mt-1 text-muted-foreground">{pkg.result}</dd>
                    </div>
                  </dl>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
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
            Если не уверены, какой формат выбрать - помогу определиться и не
            переплачивать.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground/80">
            <span className="block">
              Большинство вопросов решаются за одну встречу.
            </span>
            <span className="block">
              Если потребуется больше времени - заранее обсудим план работы.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MentoringSection;
