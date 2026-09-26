import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Play, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { SectionBadge } from "@/components/ui/section-badge";
import { SectionTitle } from "@/components/ui/section-title";
import { Button, buttonStyles } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import Modal from "@/components/ui/modal";
import { findProjectPage, projectPages, projectPath, type ProjectPage } from "@/lib/projectPages";
import NotFound from "@/pages/NotFound";

const ProjectArticle = ({ project }: { project: ProjectPage }) => {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState<number | null>(null);
  const next = projectPages[(projectPages.indexOf(project) + 1) % projectPages.length];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pb-20 pt-28 outline-none md:pt-36">
        <article className="container mx-auto px-6">
          <Link to="/projects" className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Все проекты
          </Link>
          <header className="mb-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div className="min-w-0">
              <SectionBadge>{project.category}</SectionBadge>
              <h1 className="mt-5 break-words font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h1>
              <p className="mt-5 text-sm text-primary">{[project.genre, project.year, project.status].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="space-y-5 border-l-2 border-primary pl-5">
              {project.role && <div><p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Моё участие</p><p className="text-lg font-semibold">{project.role}</p></div>}
              <div className="flex flex-wrap gap-3">
                {project.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={buttonStyles({ size: "sm", className: "inline-flex items-center gap-2" })}>{link.label}<ExternalLink className="h-4 w-4" /></a>)}
              </div>
            </div>
          </header>
          <figure className="overflow-hidden rounded-xl bg-card">
            <img src={project.cover} srcSet={project.coverSrcSet} sizes="(min-width: 1400px) 1352px, 100vw" alt={`Обложка игры ${project.title}`} loading="eager" {...{ fetchpriority: "high" }} decoding="async" className="aspect-video w-full object-contain" />
          </figure>
          {project.development?.length ? (
            <section className="border-b border-border py-12 md:py-16" aria-labelledby="project-development-title">
              <SectionTitle id="project-development-title" size="compact" className="mb-8">
                {project.role ? "Моё участие и разработка" : "О разработке"}
              </SectionTitle>
              <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2 lg:gap-x-20">
                {project.development.map((fact) => (
                  <div key={fact.title} className="min-w-0 border-l-2 border-primary/50 pl-5">
                    <dt className="text-lg font-semibold">{fact.title}</dt>
                    <dd className="mt-3 max-w-prose leading-7 text-muted-foreground">{fact.text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          <div className="grid gap-10 py-12 md:py-16 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
            <div>
              <SectionTitle size="compact">Об игре</SectionTitle>
              {project.tech.length > 0 && <ul className="mt-6 flex flex-wrap gap-2" aria-label="Технологии">{project.tech.map((tech) => <li key={tech} className="rounded border border-border px-3 py-2 text-xs text-muted-foreground">{tech}</li>)}</ul>}
            </div>
            <div className="min-w-0 space-y-4 text-base leading-8 text-muted-foreground md:text-lg">
              {project.body.split("\n").filter((line) => line.trim()).map((line, index) => <p key={index}>{line}</p>)}
            </div>
          </div>
          {project.caseStudy && <section className="border-t border-border py-12">
            <SectionTitle size="compact" className="mb-8">Инженерный кейс</SectionTitle>
            <dl className="grid gap-8 md:grid-cols-2">{Object.entries({ Контекст: project.caseStudy.context, "Личная роль": project.caseStudy.role, Задача: project.caseStudy.challenge, Ограничения: project.caseStudy.constraints, Решение: project.caseStudy.solution, Результат: project.caseStudy.outcome }).map(([label, value]) => <div key={label}><dt className="font-semibold text-primary">{label}</dt><dd className="mt-2 leading-7 text-muted-foreground">{value}</dd></div>)}</dl>
            {project.caseStudy.evidence?.length ? <ul className="mt-8 space-y-2">{project.caseStudy.evidence.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </section>}
          {project.videoUrl && <section className="border-t border-border py-12" aria-labelledby="project-video-title">
            <SectionTitle id="project-video-title" size="compact" className="mb-8">В движении</SectionTitle>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-card">
              {playing ? <iframe src={project.videoUrl} title={`Видео проекта ${project.title}`} className="h-full w-full border-0" allow="autoplay; fullscreen" allowFullScreen /> : <button type="button" onClick={() => setPlaying(true)} aria-label={`Воспроизвести видео проекта ${project.title}`} className="group relative h-full w-full">
                <img src={project.cover} srcSet={project.coverSrcSet} sizes="(min-width: 1400px) 1352px, 100vw" loading="lazy" alt="" className="h-full w-full object-contain brightness-50" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white"><span className="rounded-full bg-primary p-5 text-primary-foreground"><Play className="h-8 w-8" /></span><span className="text-sm font-semibold">Смотреть видео</span></span>
              </button>}
            </div>
          </section>}
          {project.screenshots.length > 0 && <section className="border-t border-border py-12" aria-labelledby="project-gallery-title">
            <SectionTitle id="project-gallery-title" size="compact" className="mb-8">Кадры из игры</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">{project.screenshots.map((src, index) => <a key={src} href={src} onClick={(event) => { if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); setFrame(index); }} aria-label={`Увеличить кадр ${index + 1}`} className="overflow-hidden rounded-lg bg-card"><img src={src} alt={`Скриншот ${project.title}, кадр ${index + 1}`} loading="lazy" decoding="async" className="aspect-video w-full object-contain transition-transform motion-safe:hover:scale-[1.02]" /></a>)}</div>
          </section>}
          <nav aria-label="Другие проекты" className="mt-8 flex flex-col justify-between gap-6 border-t border-border pt-8 sm:flex-row">
            <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Весь архив</Link>
            <Link to={projectPath(next.slug)} className="inline-flex min-h-11 items-center gap-3 font-semibold hover:text-primary">{next.title}<ArrowRight className="h-4 w-4 shrink-0" /></Link>
          </nav>
        </article>
      </main>
      <SiteFooter projectsPage /><ScrollToTop />
      <Modal isOpen={frame !== null} onClose={() => setFrame(null)} labelledBy="project-frame-title">
        <div className="w-full max-w-6xl rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-4"><h2 id="project-frame-title" className="text-sm">{project.title} · Кадр {(frame ?? 0) + 1} / {project.screenshots.length}</h2><IconButton aria-label="Закрыть изображение" onClick={() => setFrame(null)}><X className="h-5 w-5" /></IconButton></div>
          {frame !== null && <img src={project.screenshots[frame]} alt={`Скриншот ${project.title}, кадр ${frame + 1}`} className="max-h-[65svh] w-full object-contain" />}
          <div className="mt-4 flex justify-between gap-3"><Button variant="outline" size="sm" onClick={() => setFrame(((frame ?? 0) - 1 + project.screenshots.length) % project.screenshots.length)}>Назад</Button><Button variant="outline" size="sm" onClick={() => setFrame(((frame ?? 0) + 1) % project.screenshots.length)}>Далее</Button></div>
        </div>
      </Modal>
    </div>
  );
};

export default function Project() {
  const { slug } = useParams();
  const project = findProjectPage(slug ?? "");
  return project ? <ProjectArticle key={project.slug} project={project} /> : <NotFound />;
}
