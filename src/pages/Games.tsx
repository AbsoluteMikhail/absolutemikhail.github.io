import { ArrowDown, ArrowRight, ArrowUpRight, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactMessenger } from "@/components/ContactMessenger";
import LegalLinks from "@/components/LegalLinks";
import Navbar from "@/components/Navbar";
import GameCoverPreview from "@/components/GameCoverPreview";
import { SteamIcon, YoutubeIcon } from "@/components/SocialIcons";
import { SectionTitle } from "@/components/ui/section-title";
import { buttonStyles } from "@/components/ui/button";
import { gamepunkLinks } from "@/constants/contactLinks";
import { gamepunkGames } from "@/constants/projects";
import { trailingPath } from "@/constants/routeMetadata.js";
import { projectPath } from "@/lib/projectPages";

const Games = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-6 pb-16 pt-28 md:pb-24 md:pt-36">
      <header className="relative isolate mb-14 pb-14 pt-8 text-center md:mb-20 md:pb-20 md:pt-12">
        <div aria-hidden="true" className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-[32rem] w-screen -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_70%)]" />
        <h1 className="mx-auto max-w-5xl font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          <span className="gradient-text">Игры студии GamePunk</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-2xl">Куём инди-игры с характером.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 md:mt-10">
          <a href="#studio-games" className={buttonStyles({ size: "lg" })}>Наши игры<ArrowDown aria-hidden="true" className="h-4 w-4" /></a>
          <a href={gamepunkLinks.steam} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "outline", size: "lg" })}><SteamIcon className="h-5 w-5" />Мы в Steam</a>
        </div>
      </header>

      <section id="studio-games" aria-label="Игры GamePunk" className="grid scroll-mt-28 gap-x-10 gap-y-14 md:grid-cols-2 md:gap-y-16">
        {gamepunkGames.map((project, index) => (
          <article key={project.id} className="flex min-w-0 flex-col" aria-labelledby={`game-${project.slug}`}>
            <GameCoverPreview project={project} priority={index === 0} />
            <p className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-5 text-muted-foreground">
              <span className="text-primary">{project.stats}</span>
              <span>{project.genre}</span>
              <span>{project.year}</span>
            </p>
            <h2 id={`game-${project.slug}`} className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
              <Link to={trailingPath(projectPath(project.slug))} className="transition-colors hover:text-primary">{project.title}</Link>
            </h2>
            <p className="mb-5 mt-3 text-sm leading-7 text-muted-foreground">{project.shortDesc}</p>
            <div className="mt-auto flex flex-wrap items-center gap-3">
              {(project.storeLinks ?? (project.storeUrl ? [{ label: "Играть", url: project.storeUrl }] : [])).map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} — ${link.label} (новая вкладка)`} className={buttonStyles({ variant: "outline", size: "sm", className: "inline-flex items-center gap-2" })}>
                  {link.label}<ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              ))}
              <Link to={trailingPath(projectPath(project.slug))} aria-label={`Об игре ${project.title}`} className={buttonStyles({ variant: "text", size: "sm", className: "inline-flex min-h-11 items-center gap-2" })}>
                Об игре<ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="studio-contact-title" className="mt-20 border-t border-border py-14 text-center md:mt-28 md:py-20">
        <SectionTitle id="studio-contact-title">Будем <span className="gradient-text">на связи</span></SectionTitle>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">Обсудить игру, предложить сотрудничество или просто поздороваться.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ContactMessenger variant="secondary" className="rounded-full"><Mail aria-hidden="true" className="h-5 w-5" />Написать нам</ContactMessenger>
          <a href={gamepunkLinks.youtube} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "secondary", className: "rounded-full" })}><YoutubeIcon className="h-5 w-5" />YouTube</a>
          <a href={gamepunkLinks.x} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "secondary", className: "rounded-full" })}>X<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
          <a href={gamepunkLinks.linkedin} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "secondary", className: "rounded-full" })}><Linkedin aria-hidden="true" className="h-5 w-5" />LinkedIn</a>
          <a href={gamepunkLinks.steam} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "secondary", className: "rounded-full" })}><SteamIcon className="h-5 w-5" />Steam</a>
        </div>
      </section>

      <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-20">
        <p className="text-sm text-muted-foreground">Другие работы Михаила Ефремова — в личном портфолио.</p>
        <Link to="/projects/" className="exhibition-link shrink-0 py-2">Портфолио разработчика<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
      </div>
    </main>
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/games/" className="font-display text-sm font-bold">GamePunk</Link>
          <a href="#studio-games" className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary">К играм<ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" /></a>
        </div>
        <LegalLinks />
      </div>
    </footer>
  </div>
);

export default Games;
