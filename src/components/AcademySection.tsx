import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonStyles } from "@/components/ui/button";
import { SectionBadge } from "@/components/ui/section-badge";
import { SectionTitle } from "@/components/ui/section-title";
import { academyIntro } from "@/content/academyIntro";
import { resolveAcademyHighlights } from "@/content/academyHighlights";

const materials = resolveAcademyHighlights();

const AcademySection = () => (
  <section id="academy" aria-labelledby="academy-heading" className="exhibition-section scroll-mt-20 border-y border-border/60 bg-card/30">
    <div className="container mx-auto px-6">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <SectionBadge tone="accent" icon={<BookOpen aria-hidden="true" className="h-5 w-5 shrink-0" />}>
            {academyIntro.eyebrow}
          </SectionBadge>
          <SectionTitle id="academy-heading" className="mb-5">{academyIntro.title}</SectionTitle>
          <p className="max-w-2xl whitespace-pre-line text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {academyIntro.description}
          </p>
        </div>
        <Link to={academyIntro.href} className={buttonStyles({ variant: "outline", size: "sm", className: "self-start shrink-0 lg:self-end" })}>
          {academyIntro.linkLabel}<ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
        {materials.map((material) => (
          <article key={material.href} className="group relative flex min-w-0 flex-col">
            {material.cover && (
              <div className="mb-5 overflow-hidden rounded-lg bg-card">
                <img src={material.cover} alt={material.coverAlt || material.title} loading="lazy" decoding="async"
                  className="aspect-video w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />
              </div>
            )}
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">{material.format}</p>
            <h3 className="mt-3 font-display text-xl font-bold leading-snug text-foreground">
              <Link className="transition-colors after:absolute after:inset-0 after:rounded-lg hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-background" to={material.href}>
                {material.title}
              </Link>
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{material.description}</p>
            <p className="mt-4 text-xs leading-5 text-foreground/80">{material.audience}</p>
            <span aria-hidden="true" className="exhibition-link mt-auto pt-5">Читать материал<ArrowRight className="h-4 w-4" /></span>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default AcademySection;
