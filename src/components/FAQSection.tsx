import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/content/faq";

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
        Не нашли ответа? Опишите задачу в Telegram — я помогу выбрать формат.
      </motion.p>
    </div>
  </section>
);

export default FAQSection;
