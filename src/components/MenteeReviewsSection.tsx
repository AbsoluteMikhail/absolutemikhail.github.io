import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";
import { menteeReviews } from "@/content/reviews";

const MenteeReviewsSection = () => (
  <section id="mentee-reviews" className="relative overflow-hidden bg-background py-24">
    <div className="container relative z-10 mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className="mb-12 max-w-5xl"
      >
        <div className="mb-4 inline-block rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.2em] text-accent">
            Отзывы учеников
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold md:text-5xl">
          Что говорят после занятий
        </h2>
        <p className="mt-5 text-lg leading-8 text-foreground/70 md:whitespace-nowrap">
          Большинство учеников приходят с собственными проектами или готовятся к работе в индустрии.
        </p>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-3">
        {menteeReviews.map((review, index) => (
          <motion.article
            className="flex h-full flex-col rounded-lg border border-border bg-card/45 p-6 transition-colors hover:border-primary/35 hover:bg-card/65"
            initial={{ opacity: 0, y: 30 }}
            key={review.name}
            transition={{ delay: index * 0.12, duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <MessageSquareQuote className="mb-5 h-7 w-7 text-primary" />
            <div className="mb-6 flex-1 space-y-4 text-sm leading-7 text-foreground/80">
              {review.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraph}>
                  {paragraphIndex === 0 ? `"${paragraph}` : paragraph}
                  {paragraphIndex === review.paragraphs.length - 1 ? `"` : ""}
                </p>
              ))}
            </div>
            <div className="border-t border-border/60 pt-4">
              <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-foreground">
                {review.name}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default MenteeReviewsSection;
