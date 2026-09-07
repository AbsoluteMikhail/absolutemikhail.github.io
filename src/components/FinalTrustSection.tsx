import { SectionTitle } from "@/components/ui/section-title";
import { SectionBadge } from "@/components/ui/section-badge";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { ContactMessenger } from "@/components/ContactMessenger";

const FinalTrustSection = () => (
  <section className="relative overflow-hidden border-y border-border/50 bg-secondary/20 py-20">
    <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    <div className="container relative z-10 mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className="mx-auto flex max-w-4xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between"
      >
        <div className="max-w-2xl">
          <SectionBadge className="mb-5" icon={<ShieldCheck className="h-4 w-4 text-primary" />}>
            Честный подбор формата
          </SectionBadge>
          <SectionTitle>
            Не уверены, какой формат выбрать?
          </SectionTitle>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Опишите свой проект в удобном мессенджере. Я помогу определить, какой формат
            консультации действительно нужен. Если окажется, что я не смогу
            помочь, честно скажу об этом.
          </p>
        </div>

        <ContactMessenger
          message="Привет! Хочу описать проект и понять, какой формат консультации подойдет."
          size="lg"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full box-glow"
        >
          Помогите выбрать
          <ArrowUpRight className="h-4 w-4" />
        </ContactMessenger>
      </motion.div>
    </div>
  </section>
);

export default FinalTrustSection;
