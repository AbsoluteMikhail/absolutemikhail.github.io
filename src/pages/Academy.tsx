import type React from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  ChevronLeft,
  Code2,
  Compass,
  FileText,
  GraduationCap,
  Layers,
  PlayCircle,
} from "lucide-react";
import {
  academyCourses,
  getAcademyCourse,
  getAcademyLesson,
  groupLessonsByBlock,
  type AcademyCourse,
  type AcademyLesson,
} from "@/lib/academy";
import { MarkdownContent, TableOfContents } from "@/components/academy/MarkdownContent";
import { YouTubeEmbed } from "@/components/academy/YouTubeEmbed";

const AcademyShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link className="flex items-center gap-3" to="/academy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold uppercase tracking-widest">
              Academy
            </span>
            <span className="block text-[11px] text-muted-foreground">Absolute Mikhail</span>
          </span>
        </Link>

        <Link
          className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary sm:flex"
          to="/"
        >
          <ChevronLeft className="h-4 w-4" />
          На сайт
        </Link>
      </div>
    </header>

    {children}
  </div>
);

const CourseMeta = ({ course }: { course: AcademyCourse }) => (
  <div className="grid gap-3 sm:grid-cols-3">
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <BookOpen className="mb-3 h-5 w-5 text-primary" />
      <p className="text-2xl font-display font-bold">{course.lessons.length || "Docs"}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {course.lessons.length ? "уроков" : "материалы"}
      </p>
    </div>
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <Boxes className="mb-3 h-5 w-5 text-accent" />
      <p className="text-lg font-display font-bold">{course.project || "Gameplay sandbox"}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">сквозной проект</p>
    </div>
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <Compass className="mb-3 h-5 w-5 text-emerald-400" />
      <p className="text-lg font-display font-bold">{course.status || "В работе"}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">статус</p>
    </div>
  </div>
);

const LessonSidebar = ({
  activeLessonSlug,
  course,
}: {
  activeLessonSlug?: string;
  course: AcademyCourse;
}) => (
  <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
    <Link
      className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      to="/academy"
    >
      <ArrowLeft className="h-4 w-4" />
      Все курсы
    </Link>

    <div className="rounded-lg border border-border bg-card/35 p-4">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Курс</p>
      <Link className="font-display text-lg font-bold transition-colors hover:text-primary" to={`/academy/${course.slug}`}>
        {course.title}
      </Link>
    </div>

    <div className="mt-6 space-y-6">
      {groupLessonsByBlock(course.lessons).map((block) => (
        <div key={block.title}>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            {block.title}
          </p>
          <div className="space-y-1">
            {block.lessons.map((lesson) => (
              <Link
                className={`block rounded-md border px-3 py-2 text-sm transition-colors ${
                  activeLessonSlug === lesson.slug
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/30 hover:text-foreground"
                }`}
                key={lesson.slug}
                to={`/academy/${course.slug}/${lesson.slug}`}
              >
                <span className="mr-2 text-xs opacity-60">{lesson.meta.video}</span>
                {lesson.meta.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </aside>
);

const CourseCard = ({ course }: { course: AcademyCourse }) => (
  <Link
    className="group block rounded-lg border border-border bg-card/45 p-6 transition-all hover:border-primary/45 hover:bg-card/70 hover:shadow-2xl hover:shadow-primary/10"
    to={`/academy/${course.slug}`}
  >
    <div className="mb-8 flex items-start justify-between gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
        <Code2 className="h-5 w-5" />
      </div>
      <span className="rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {course.status || "В работе"}
      </span>
    </div>

    <h2 className="mb-3 font-display text-2xl font-bold transition-colors group-hover:text-primary">
      {course.title}
    </h2>
    <p className="mb-6 max-w-2xl text-sm leading-6 text-muted-foreground">{course.description}</p>

    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/40 px-2.5 py-1">
        <BookOpen className="h-3.5 w-3.5" />
        {course.lessons.length ? `${course.lessons.length} уроков` : "материалы"}
      </span>
      {course.project ? (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/40 px-2.5 py-1">
          <Boxes className="h-3.5 w-3.5" />
          {course.project}
        </span>
      ) : null}
    </div>
  </Link>
);

const AcademyHome = () => (
  <AcademyShell>
    <main className="container mx-auto px-6 py-16 lg:py-24">
      <section className="mb-12 max-w-4xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">Документация к курсам</p>
        <h1 className="mb-6 font-display text-4xl font-bold leading-tight md:text-6xl">
          Academy для конспектов, материалов и структуры курса
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Скрытый раздел сайта, доступный по прямой ссылке. Контент редактируется через Markdown-файлы:
          уроки, картинки, ссылки, списки, цитаты и блоки кода без постоянной правки React.
        </p>
        <blockquote className="mt-8 max-w-2xl rounded-lg border-l-4 border-primary bg-card/45 px-5 py-4">
          <p className="text-xl font-display font-bold leading-8">
            "нормально делай нормально будет"
          </p>
          <footer className="mt-3 text-sm text-muted-foreground">абсолютный михаил =)</footer>
        </blockquote>
      </section>

      <div className="grid gap-5">
        {academyCourses.map((course) => (
          <CourseCard course={course} key={course.slug} />
        ))}
      </div>
    </main>
  </AcademyShell>
);

const CoursePage = ({ course }: { course: AcademyCourse }) => (
  <AcademyShell>
    <main className="container mx-auto grid gap-10 px-6 py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-14 xl:grid-cols-[280px_minmax(0,760px)_220px]">
      <LessonSidebar course={course} />

      <article>
        <div className="mb-8 rounded-lg border border-border bg-card/30 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">Курс</p>
          <h1 className="mb-4 font-display text-4xl font-bold leading-tight md:text-5xl">{course.title}</h1>
          <p className="text-lg leading-8 text-muted-foreground">{course.description}</p>
        </div>

        <CourseMeta course={course} />

        <MarkdownContent className="mt-10" content={course.body} />

        {course.lessons.length ? (
          <section className="mt-14">
            <h2 className="mb-6 font-display text-2xl font-bold">Уроки курса</h2>
            <div className="space-y-8">
              {groupLessonsByBlock(course.lessons).map((block) => (
                <div key={block.title}>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                    {block.title}
                  </p>
                  <div className="grid gap-3">
                    {block.lessons.map((lesson) => (
                      <Link
                        className="group rounded-lg border border-border bg-card/35 p-4 transition-colors hover:border-primary/45 hover:bg-card/60"
                        key={lesson.slug}
                        to={`/academy/${course.slug}/${lesson.slug}`}
                      >
                        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                          <PlayCircle className="h-4 w-4" />
                          Видео {lesson.meta.video}
                        </div>
                        <h3 className="mb-2 font-display text-xl font-bold transition-colors group-hover:text-primary">
                          {lesson.meta.title}
                        </h3>
                        <p className="text-sm leading-6 text-muted-foreground">{lesson.meta.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <TableOfContents headings={course.headings} />
    </main>
  </AcademyShell>
);

const LessonPager = ({
  course,
  lesson,
}: {
  course: AcademyCourse;
  lesson: AcademyLesson;
}) => {
  const lessonIndex = course.lessons.findIndex((item) => item.slug === lesson.slug);
  const previousLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null;

  return (
    <nav className="mt-14 grid gap-3 border-t border-border pt-8 md:grid-cols-2">
      {previousLesson ? (
        <Link
          className="rounded-lg border border-border bg-card/35 p-4 transition-colors hover:border-primary/45 hover:bg-card/60"
          to={`/academy/${course.slug}/${previousLesson.slug}`}
        >
          <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Предыдущий урок
          </span>
          <span className="font-display font-bold">{previousLesson.meta.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {nextLesson ? (
        <Link
          className="rounded-lg border border-border bg-card/35 p-4 text-right transition-colors hover:border-primary/45 hover:bg-card/60"
          to={`/academy/${course.slug}/${nextLesson.slug}`}
        >
          <span className="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            Следующий урок
            <ArrowRight className="h-4 w-4" />
          </span>
          <span className="font-display font-bold">{nextLesson.meta.title}</span>
        </Link>
      ) : null}
    </nav>
  );
};

const LessonPage = ({ course, lesson }: { course: AcademyCourse; lesson: AcademyLesson }) => (
  <AcademyShell>
    <main className="container mx-auto grid gap-10 px-6 py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-14 xl:grid-cols-[280px_minmax(0,760px)_220px]">
      <LessonSidebar activeLessonSlug={lesson.slug} course={course} />

      <article>
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          to={`/academy/${course.slug}`}
        >
          <ArrowLeft className="h-4 w-4" />
          К описанию курса
        </Link>

        <div className="mb-8 rounded-lg border border-border bg-card/30 p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs text-primary">
              <PlayCircle className="h-3.5 w-3.5" />
              Видео {lesson.meta.video}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              {lesson.meta.block}
            </span>
          </div>
          <h1 className="mb-4 font-display text-4xl font-bold leading-tight md:text-5xl">{lesson.meta.title}</h1>
          <p className="text-lg leading-8 text-muted-foreground">{lesson.meta.description}</p>
        </div>

        <div className="mb-8 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card/35 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <AlertIcon />
              Главная боль
            </p>
            <p className="leading-7">{lesson.meta.pain}</p>
          </div>
          <div className="rounded-lg border border-border bg-card/35 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Главная мысль
            </p>
            <p className="leading-7">{lesson.meta.mainIdea}</p>
          </div>
        </div>

        {lesson.meta.youtube ? (
          <div className="mb-10">
            <YouTubeEmbed title={lesson.meta.title} url={lesson.meta.youtube} />
          </div>
        ) : null}

        <MarkdownContent content={lesson.body} />
        <LessonPager course={course} lesson={lesson} />
      </article>

      <TableOfContents headings={lesson.headings} />
    </main>
  </AcademyShell>
);

const AlertIcon = () => <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary))]" />;

const AcademyNotFound = () => (
  <AcademyShell>
    <main className="container mx-auto flex min-h-[70vh] items-center px-6 py-16">
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">Academy 404</p>
        <h1 className="mb-4 font-display text-4xl font-bold">Материал не найден</h1>
        <p className="mb-8 max-w-xl text-muted-foreground">
          Такого курса или урока пока нет. Проверь адрес или вернись на главную Academy.
        </p>
        <Link className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" to="/academy">
          <ArrowLeft className="h-4 w-4" />
          В Academy
        </Link>
      </div>
    </main>
  </AcademyShell>
);

const Academy = () => {
  const params = useParams();
  const path = params["*"] || "";
  const [courseSlug, lessonSlug] = path.split("/").filter(Boolean);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (!courseSlug) {
    return <AcademyHome />;
  }

  const course = getAcademyCourse(courseSlug);

  if (!course) {
    return <AcademyNotFound />;
  }

  if (!lessonSlug) {
    return <CoursePage course={course} />;
  }

  const lesson = getAcademyLesson(courseSlug, lessonSlug);

  if (!lesson) {
    return <AcademyNotFound />;
  }

  return <LessonPage course={course} lesson={lesson} />;
};

export default Academy;
