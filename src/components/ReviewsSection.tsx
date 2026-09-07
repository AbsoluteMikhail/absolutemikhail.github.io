import { SectionTitle } from "@/components/ui/section-title";
import { SectionBadge } from "@/components/ui/section-badge";
import { useId, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { Pause, Play, Star } from "lucide-react";
import { gameReviews, type GameReview } from "@/content/reviews";
import { projects } from "@/constants/projects";

const storeUrls = new Map(
  projects.map((project) => [
    project.id,
    project.storeLinks?.[0]?.url ?? project.storeUrl,
  ]),
);

const ReviewCard = ({ review, decorative = false }: { review: GameReview; decorative?: boolean }) => {
  const storeUrl = review.projectId ? storeUrls.get(review.projectId) : undefined;

  return (
    <div className="review-card flex-shrink-0 w-[min(350px,85vw)] p-6 rounded-lg bg-card/50 border-t border-primary/40">
    <div className="flex gap-1 mb-3" aria-label={`Оценка ${review.rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, review.rating - i));
        return (
          <span key={i} className="relative h-4 w-4" aria-hidden="true">
            <Star className="absolute inset-0 h-4 w-4 text-muted-foreground/30" />
            {fill > 0 && (
              <Star
                className="absolute inset-0 h-4 w-4 fill-accent text-accent"
                style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
              />
            )}
          </span>
        );
      })}
    </div>
    <p className="text-foreground/90 text-sm leading-relaxed mb-4">
      "{review.text}"
    </p>
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-foreground">{review.name}</span>
      {storeUrl && !decorative ? (
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm"
          aria-label={`${review.game} — открыть страницу игры`}
        >
          {review.game}
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">{review.game}</span>
      )}
    </div>
  </div>
  );
};

const ReviewsSection = () => {
  const [paused, setPaused] = useState(false);
  const trackId = useId();

  return (
    <section className="py-14 md:py-20 overflow-hidden bg-card/25">
      <div className="container mx-auto px-6 mb-16 text-center">
        <SectionBadge
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          tone="accent"
          size="md"
        >
          Фидбек
        </SectionBadge>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}

        >
          <span className="gradient-text uppercase">Отзывы игроков</span>
        </SectionTitle>
        <IconButton
          type="button"
          variant="outline"
          aria-label={paused ? "Возобновить прокрутку отзывов" : "Приостановить прокрутку отзывов"}
          aria-pressed={paused}
          aria-controls={trackId}
          onClick={() => setPaused((value) => !value)}
          className="review-motion-toggle mt-5"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </IconButton>
      </div>

      <div
        className="review-viewport relative overflow-hidden"
        onTouchStart={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)
            && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            event.currentTarget.scrollLeft = 0;
          }
        }}
      >
        {/* Fade edges */}
        <div className="review-fade absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
        <div className="review-fade absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />

        <div id={trackId} className="review-marquee flex w-max" data-paused={paused}>
          <div className="flex shrink-0 gap-6 px-3 py-4">
            {gameReviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
          {/* One matching copy makes the loop seamless without duplicate tab stops. */}
          <div className="review-copy flex shrink-0 gap-6 px-3 py-4" aria-hidden="true">
            {gameReviews.map((review, i) => (
              <ReviewCard key={i} review={review} decorative />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
