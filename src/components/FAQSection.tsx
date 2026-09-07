import { SectionTitle } from "@/components/ui/section-title";
import { SectionBadge } from "@/components/ui/section-badge";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/content/faq";

const FAQSection = () => (
  <section id="faq" className="exhibition-section bg-background">
    <div className="container mx-auto grid gap-x-16 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className="mb-8 max-w-xl lg:sticky lg:top-28"
      >
        <SectionBadge>FAQ</SectionBadge>
        <SectionTitle>
          Что важно знать перед консультацией
        </SectionTitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        viewport={{ once: true }}
        className="min-w-0 border-t border-border"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-border/70"
            >
              <AccordionTrigger className="py-6 text-left font-body text-base font-semibold leading-6 text-foreground hover:text-primary hover:no-underline">
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
        className="mt-6 max-w-2xl text-sm leading-6 text-muted-foreground lg:col-start-2"
      >
        Не нашли ответа? Опишите задачу в Telegram — я помогу выбрать формат.
      </motion.p>
    </div>
  </section>
);

export default FAQSection;
