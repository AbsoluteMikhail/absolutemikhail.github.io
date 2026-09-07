import { SectionTitle } from "@/components/ui/section-title";
import { SectionBadge } from "@/components/ui/section-badge";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { ContactMessenger } from "@/components/ContactMessenger";

const FinalTrustSection = () => (
  <section className="exhibition-section exhibition-warm relative overflow-hidden border-y border-primary/25">
    <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    <div className="container relative z-10 mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="max-w-2xl">
          <SectionBadge className="mb-5" icon={<MessageCircle className="h-4 w-4 text-primary" />}>
            Будем на связи
          </SectionBadge>
          <SectionTitle>
            Есть о чём поговорить?
          </SectionTitle>
          <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            Обсудить разработку, спросить о менторинге или поделиться впечатлениями
            от моей игры — можно просто написать. Если нужна помощь с проектом,
            расскажите о задаче: вместе поймём, смогу ли я быть полезен.
          </p>
        </div>

        <ContactMessenger
          size="lg"
          className="inline-flex shrink-0 items-center justify-center gap-2 box-glow"
        >
          Написать Михаилу
          <ArrowUpRight className="h-4 w-4" />
        </ContactMessenger>
      </motion.div>
    </div>
  </section>
);

export default FinalTrustSection;
