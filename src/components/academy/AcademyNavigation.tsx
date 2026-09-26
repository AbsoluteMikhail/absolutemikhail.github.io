import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { AcademyDisclosure } from "@/components/academy/AcademyDisclosure";
import { TableOfContents } from "@/components/academy/MarkdownContent";
import { groupLessonsByBlock, getLessonAvailabilityLabel, type AcademyCourse } from "@/lib/academy";
import type { AcademyHeading } from "@/lib/academyMarkdown";
import { cn } from "@/lib/utils";
import { useReadingProgress } from "@/components/academy/useReadingProgress";
import { resumeReadingHref, useAcademyProgress } from "@/lib/academyProgress";

type AcademyNavigationProps = {
  course: AcademyCourse;
  activeLessonSlug?: string;
  headings: AcademyHeading[];
  activeHeading?: string;
};

const CourseNavigation = ({ course, activeLessonSlug, headings, activeHeading }: AcademyNavigationProps) => {
  const blocks = groupLessonsByBlock(course.lessons);
  return (
  <div>
    <Link
      aria-current={!activeLessonSlug ? "page" : undefined}
      className={cn("mb-2 block rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-primary", !activeLessonSlug && "bg-primary/10 text-primary")}
      to={`/academy/${course.slug}`}
    >
      {course.lessons.length ? "О курсе" : course.title}
    </Link>
    {!activeLessonSlug && <TableOfContents headings={headings} activeHeading={activeHeading} />}
    {course.lessons.length > 0 && (
      <nav aria-label="Уроки курса" className="mt-4 space-y-3">
        {blocks.map((block, index) => {
          const lessons = (
            <ol className="space-y-1" key={block.title}>
              {block.lessons.map((lesson) => {
                const active = activeLessonSlug === lesson.slug;
                return (
                  <li key={lesson.slug}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground",
                      )}
                      to={`/academy/${course.slug}/${lesson.slug}`}
                    >
                      <span aria-hidden="true" className="pt-0.5 text-xs tabular-nums opacity-60">{String(lesson.order).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="block leading-5">{lesson.meta.title}</span>
                        <span className="mt-1 block text-[11px] opacity-70">{getLessonAvailabilityLabel(course, lesson)}</span>
                      </span>
                    </Link>
                    {active && <TableOfContents headings={headings} activeHeading={activeHeading} />}
                  </li>
                );
              })}
            </ol>
          );
          if (blocks.length === 1) return lessons;
          return <details
            className="group/module"
            key={`${activeLessonSlug ?? "overview"}-${block.title}`}
            open={activeLessonSlug ? block.lessons.some((lesson) => lesson.slug === activeLessonSlug) : index === 0}
          >
            <summary className="mb-1 flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
              {block.title}
              <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-open/module:rotate-180 motion-reduce:transition-none" />
            </summary>
            <div className="ml-3 border-l border-border/70 pl-3">{lessons}</div>
          </details>
        })}
      </nav>
    )}
  </div>
  );
};

const ReadingProgress = ({ percent, mobile = false }: { percent: number; mobile?: boolean }) => (
  <div className={cn(mobile ? "mt-3 lg:hidden" : "mb-5 px-3")}>
    <div className="mb-2 flex justify-between gap-3 text-[11px] text-muted-foreground">
      <span>Прочитано</span><span className="tabular-nums">{percent}%</span>
    </div>
    <div
      aria-label="Прочитано на странице"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      role="progressbar"
      className={cn("h-0.5 overflow-hidden bg-border", mobile && "fixed inset-x-0 top-16 z-40")}
    >
      <div className="h-full origin-left bg-gradient-to-r from-primary to-accent" style={{ transform: `scaleX(${percent / 100})` }} />
    </div>
  </div>
);

export const AcademyNavigation = (props: AcademyNavigationProps) => {
  const path = `/academy/${props.course.slug}${props.activeLessonSlug ? `/${props.activeLessonSlug}` : ""}`;
  const reading = useReadingProgress(path, props.headings);
  const saved = useAcademyProgress()[path];
  const resume = saved && saved.percent > reading.percent + 3 && saved.heading && props.headings.some((heading) => heading.id === saved.heading)
    ? <a href={resumeReadingHref(path, { ...saved, percent: Math.min(saved.percent, 99) })} className="mb-4 block px-3 py-2 text-xs leading-5 text-accent underline underline-offset-4">Продолжить с сохранённого раздела · {saved.percent}%</a>
    : null;
  return (
  <aside aria-label="Навигация по материалу" className="min-w-0 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100svh-8rem)] lg:flex-col lg:self-start lg:border-r lg:border-border lg:pr-5">
    <Link className="mb-3 inline-flex min-h-11 shrink-0 items-center gap-2 text-sm text-muted-foreground hover:text-primary" to="/academy">
      <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Все материалы
    </Link>
    <div className="lg:hidden">
      <AcademyDisclosure key={`${props.course.slug}-${props.activeLessonSlug ?? "overview"}`} label="Содержание и разделы">
        <CourseNavigation {...props} activeHeading={reading.activeHeading} />
      </AcademyDisclosure>
      <ReadingProgress percent={reading.percent} mobile />
      {resume}
    </div>
    <div className="hidden lg:flex lg:min-h-0 lg:flex-col">
      <div className="shrink-0">
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{props.course.format}</p>
        {props.course.lessons.length > 0 && <Link className="mb-5 block px-3 font-display text-base font-bold leading-6 hover:text-primary" to={`/academy/${props.course.slug}`}>{props.course.title}</Link>}
        <ReadingProgress percent={reading.percent} />
        {resume}
      </div>
      <div className="min-h-0 overflow-y-auto overscroll-contain">
        <CourseNavigation {...props} activeHeading={reading.activeHeading} />
      </div>
    </div>
  </aside>
  );
};
