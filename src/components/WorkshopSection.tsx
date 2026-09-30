import { useState } from "react";
import { ArrowUpRight, Images } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import MalenaGallery from "@/components/MalenaGallery";
import { SectionBadge } from "@/components/ui/section-badge";
import { SectionTitle } from "@/components/ui/section-title";
import { workshop } from "@/constants/workshop";
import { cn } from "@/lib/utils";

const WorkshopSection = () => {
  const { malena, plugins, tools } = workshop;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <section id="workshop" aria-labelledby="workshop-title" className="exhibition-section scroll-mt-20 border-y border-border/60 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="mb-10 max-w-3xl md:mb-14">
          <SectionBadge size="md">Боты · плагины · эксперименты</SectionBadge>
          <SectionTitle id="workshop-title">За пределами <span className="gradient-text">игр</span></SectionTitle>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{workshop.introduction}</p>
        </div>

        <div className="grid items-start gap-x-8 gap-y-8 md:grid-cols-2 lg:gap-x-10 lg:gap-y-10">
          <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
            <figure>
              <button
                type="button"
                aria-label="Открыть галерею Малены"
                aria-haspopup="dialog"
                onClick={() => setIsGalleryOpen(true)}
                className="group relative block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <img
                  src={malena.portrait}
                  srcSet={malena.portraitSrcSet}
                  sizes="(min-width: 1400px) 656px, (min-width: 768px) calc(50vw - 40px), calc(100vw - 48px)"
                  width={896}
                  height={1200}
                  alt={malena.portraitAlt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover object-top lg:aspect-[4/3]"
                />
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-3 py-2 text-xs text-white group-hover:bg-black group-focus-visible:ring-2 group-focus-visible:ring-primary">
                  <Images aria-hidden="true" className="h-4 w-4" />{malena.portraits.length} портретов
                </span>
              </button>
              <figcaption className="px-6 pt-4 text-xs text-muted-foreground lg:px-8">{malena.caption}</figcaption>
            </figure>
            <div className="p-6 pt-5 lg:p-8 lg:pt-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{malena.category}</p>
              <h3 className="mt-3 font-display text-2xl font-bold lg:text-3xl">{malena.title}</h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">{malena.description}</p>
              <a href={malena.url} target="_blank" rel="noopener noreferrer" className={buttonStyles({ size: "sm", className: "mt-6 max-w-full text-center" })}>
                {malena.linkLabel}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </a>
              <Button variant="text" size="none" aria-haspopup="dialog" onClick={() => setIsGalleryOpen(true)} className="mt-3 flex min-h-11 items-center gap-2 text-sm">
                <Images aria-hidden="true" className="h-4 w-4" />Посмотреть галерею
              </Button>
            </div>
          </article>

          <article className="flex min-w-0 flex-col self-stretch rounded-xl border border-border bg-gradient-to-br from-primary/[0.07] via-card to-card p-6 lg:p-8">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{plugins.category}</p>
            <h3 aria-label={plugins.title} className="my-8 font-display text-3xl font-bold uppercase leading-snug tracking-tight lg:text-5xl">
              {plugins.title.split(" ").map((word, index) => (
                <span key={word} className={cn(index > 0 && "block text-primary")}>{word}{" "}</span>
              ))}
            </h3>
            <p className="max-w-lg text-sm leading-7 text-muted-foreground md:text-base">{plugins.description}</p>
            <ol className="my-8">
              {plugins.items.map((plugin, index) => (
                <li key={plugin.url} className="border-t border-border">
                  <a href={plugin.url} target="_blank" rel="noopener noreferrer" className="flex min-h-20 items-center gap-4 py-5 text-sm transition-colors hover:text-primary lg:text-base">
                    <span aria-hidden="true" className="shrink-0 font-display text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{plugin.title}</span>
                      <span className="mt-2 block text-sm font-normal leading-6 text-muted-foreground">{plugin.description}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                  </a>
                </li>
              ))}
            </ol>
            <a href={plugins.url} target="_blank" rel="noopener noreferrer" className="exhibition-link mt-auto min-h-11 w-fit">
              {plugins.linkLabel}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </a>
          </article>

          {tools.map((tool) => (
            <article key={tool.id} className="min-w-0 border-t border-border pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span aria-hidden="true" className="font-display text-xl text-primary">{tool.mark}</span>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{tool.category}</p>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold leading-snug lg:text-2xl">{tool.title}</h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">{tool.description}</p>
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="exhibition-link mt-4 min-h-11">
                {tool.linkLabel}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </a>
            </article>
          ))}
        </div>
      </div>
      {isGalleryOpen && <MalenaGallery onClose={() => setIsGalleryOpen(false)} />}
    </section>
  );
};

export default WorkshopSection;
