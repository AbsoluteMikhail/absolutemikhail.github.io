import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonStyles } from "@/components/ui/button";
import { SectionBadge } from "@/components/ui/section-badge";
import { SectionTitle } from "@/components/ui/section-title";
import { academyIntro } from "@/content/academyIntro";

const AcademySection = () => (
  <section id="academy" aria-labelledby="academy-heading" className="scroll-mt-20 border-y border-border/60 bg-card/30 py-12 md:py-16">
    <div className="container mx-auto grid items-center gap-8 px-6 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="max-w-3xl">
        <SectionBadge tone="accent" icon={<BookOpen aria-hidden="true" className="h-5 w-5 shrink-0" />}>
          {academyIntro.eyebrow}
        </SectionBadge>
        <SectionTitle id="academy-heading" size="compact" className="mb-5">
          {academyIntro.title}
        </SectionTitle>
        <p className="whitespace-pre-line text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          {academyIntro.description}
        </p>
      </div>
      <Link to={academyIntro.href} className={buttonStyles({ size: "sm", className: "justify-self-start" })}>
        {academyIntro.linkLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  </section>
);

export default AcademySection;
