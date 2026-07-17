import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { gameReviews, type GameReview } from "@/content/reviews";

const ReviewCard = ({ review }: { review: GameReview }) => (
  <div className="flex-shrink-0 w-[350px] p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
    <div className="flex gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < review.rating
              ? "fill-accent text-accent"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
    <p className="text-foreground/90 text-sm leading-relaxed mb-4">
      "{review.text}"
    </p>
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-foreground">{review.name}</span>
      <span className="text-xs text-muted-foreground">{review.game}</span>
    </div>
  </div>
);

const ReviewsSection = () => {
  // Triple the reviews for very long desktop screens to ensure seamless loop
  const duplicated = [...gameReviews, ...gameReviews, ...gameReviews];

  return (
    <section className="py-24 overflow-hidden bg-background/30">
      <div className="container mx-auto px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5"
        >
          <span className="text-xs font-display tracking-widest text-accent uppercase">
            Фидбек
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold"
        >
          <span className="gradient-text uppercase">Отзывы игроков</span>
        </motion.h2>
      </div>

      <div className="relative group overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />

        <div className="flex w-fit">
          <motion.div 
            className="flex gap-6 py-4 px-3"
            animate={{
              x: ["0%", "-33.333%"]
            }}
            transition={{
              duration: 80,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ x: 0 }}
          >
            {duplicated.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
