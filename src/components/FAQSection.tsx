import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "С какими задачами ко мне чаще всего обращаются?",
    answer:
      "Архитектура проекта, gameplay systems, оптимизация, подготовка к собеседованию, ревью кода и доведение проекта до релиза.",
  },
  {
    question: "Подойдет ли менторинг, если я только начинаю?",
    answer:
      "Да. Главное - понимать базовые принципы Unreal Engine. Если опыта совсем нет, сначала определим план развития, чтобы не тратить время на случайные темы.",
  },
  {
    question: "Можно ли прийти только с Blueprint?",
    answer:
      "Да. Можно разбирать Blueprint-логику, архитектуру графов, оптимизацию, миграцию части логики в C++ и общий план развития проекта.",
  },
  {
    question: "Как проходит консультация?",
    answer:
      "Созваниваемся, ты показываешь проект или экран, вместе разбираем проблему и фиксируем следующие шаги. Если формат включает запись и конспект, после занятия ты получаешь материалы.",
  },
  {
    question: "Что можно принести на консультацию и как подготовиться?",
    answer:
      "GitHub, архив проекта, Blueprint, C++ код, тестовое задание, GDD, идею игры или список вопросов. Лучше заранее коротко описать цель и текущую проблему.",
  },
  {
    question: "Можно ли разобрать тестовое задание или подготовиться к собеседованию?",
    answer:
      "Да. Можно разобрать тестовое, пройти технические вопросы, найти слабые места в портфолио и подготовить план, как увереннее пройти интервью.",
  },
  {
    question: "Когда я честно скажу, что не смогу помочь?",
    answer:
      "Если задача выходит за пределы моей специализации или консультация не принесет пользы, я прямо скажу об этом еще до начала работы.",
  },
];

const FAQSection = () => (
  <section id="faq" className="relative overflow-hidden bg-background py-24">
    <div className="container relative z-10 mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-3xl text-center"
      >
        <div className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">
            FAQ
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold md:text-5xl">
          Что важно знать перед консультацией
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/35 px-5 md:px-7"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-border/70"
            >
              <AccordionTrigger className="py-5 text-left font-display text-sm font-bold uppercase tracking-[0.12em] text-foreground hover:text-primary hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-7 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        viewport={{ once: true }}
        className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-muted-foreground"
      >
        Остались вопросы? Ниже - отзывы разработчиков, с которыми мы уже
        работали.
      </motion.p>
    </div>
  </section>
);

export default FAQSection;
