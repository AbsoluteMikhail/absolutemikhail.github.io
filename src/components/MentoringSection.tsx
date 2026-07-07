import { motion } from "framer-motion";
import { Check, MessageCircle, SearchCode, Network } from "lucide-react";
import { ContactTelegram } from "@/components/ContactTelegram";

const packages = [
  {
    icon: MessageCircle,
    title: "Консультация",
    price: "1 000 ₽",
    period: "/ час",
    description:
      "Быстро разберем любой вопрос по Unreal Engine, C++, Blueprint или разработке игр.",
    features: [
      "Разберем именно вашу проблему в Unreal Engine.",
      "Blueprint, C++, архитектура проекта и gameplay systems.",
      "Карьерный совет, портфолио и подготовка к собеседованию.",
      "Оценка идеи и выбор следующего шага в разработке.",
      "Лучший вариант, если не знаете, с чего начать или застряли в развитии проекта.",
    ],
    buttonText: "Выбрать консультацию",
    telegramMessage: "Привет! Хочу записаться на консультацию по Unreal Engine.",
    popular: false,
  },
  {
    icon: SearchCode,
    title: "Разбор проекта",
    price: "3 000 ₽",
    period: "/ час",
    description:
      "Приходишь со своим проектом - уходишь с понятным планом действий.",
    features: [
      "Смотрим код, Blueprint-графы, структуру проекта и проблемные места.",
      "Ищем архитектурные ошибки, баги, узкие места и лишнюю сложность.",
      "Составляем roadmap: что чинить сейчас, что отложить, что удалить.",
      "Определяем следующие шаги, чтобы проект стал ближе к релизу.",
    ],
    buttonText: "Разобрать проект",
    telegramMessage: "Привет! Хочу записаться на разбор проекта.",
    popular: true,
  },
  {
    icon: Network,
    title: "Архитектурная сессия",
    price: "5 000 ₽",
    period: "/ час",
    description: "Для сложных систем, production-решений и технических развилок.",
    features: [
      "GAS, Subsystems, Multiplayer, Plugin Architecture и Mass.",
      "Проектирование gameplay systems и production-подходов.",
      "Code Review сложных модулей, технических рисков и зависимостей.",
      "Разбор архитектурной задачи, которую опасно решать наугад.",
    ],
    buttonText: "Обсудить архитектуру",
    telegramMessage: "Привет! Хочу записаться на архитектурную сессию.",
    popular: false,
  },
];

const MentoringSection = () => {
  return (
    <section id="mentoring" className="py-24 relative overflow-hidden bg-background">
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
          className="text-center mb-20"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            <span className="text-[10px] font-display tracking-[0.2em] text-primary uppercase">
              Работаем один на один
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            <span className="gradient-text uppercase">Менторинг</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Помогаю разработчикам на Unreal Engine быстрее доводить проекты до
            рабочего состояния, готовиться к собеседованиям и строить
            масштабируемую архитектуру.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`group relative rounded-3xl border p-8 md:p-10 flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                  pkg.popular
                    ? "border-primary/50 bg-primary/5 shadow-2xl shadow-primary/10"
                    : "border-border bg-card/40 backdrop-blur-sm hover:border-primary/30"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-[10px] font-display font-bold uppercase tracking-widest gradient-primary text-primary-foreground shadow-lg shadow-primary/20">
                    Популярный
                  </div>
                )}

                <div className="mb-8">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${
                      pkg.popular
                        ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-secondary text-primary"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="mb-8 pb-8 border-b border-border/50">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold text-foreground">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">
                      {pkg.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <ContactTelegram
                  message={pkg.telegramMessage}
                  className={`block text-center py-4 rounded-2xl font-display text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                    pkg.popular
                      ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                      : "border border-primary/20 text-primary hover:bg-primary/5 active:scale-95"
                  }`}
                >
                  {pkg.buttonText}
                </ContactTelegram>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm font-medium">
            Если не уверены, какой формат выбрать - помогу определиться и не
            переплачивать.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground/80">
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
