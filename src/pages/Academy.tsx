import type React from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Braces,
  BookOpen,
  Boxes,
  ChevronLeft,
  Code2,
  Compass,
  FileText,
  Gamepad2,
  GraduationCap,
  Layers,
  PlayCircle,
  Tag,
  Wrench,
} from "lucide-react";
import {
  academyCourses,
  academyTopics,
  getAcademyCourse,
  getAcademyCoursesByTopic,
  getAcademyLesson,
  getAcademyTopic,
  groupLessonsByBlock,
  type AcademyCourse,
  type AcademyLesson,
  type AcademyTopic,
} from "@/lib/academy";
import { MarkdownContent, TableOfContents } from "@/components/academy/MarkdownContent";
import { YouTubeEmbed } from "@/components/academy/YouTubeEmbed";

const AcademyShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background pt-16 text-foreground">
    <header className="fixed left-0 top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-6">
        <Link
          className="flex items-center gap-3 transition-all duration-300 hover:drop-shadow-[0_0_10px_hsl(var(--primary))]"
          to="/academy"
        >
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

        <div className="flex items-center gap-5">
          <nav className="hidden items-center gap-4 xl:flex" aria-label="Направления Academy">
            {academyTopics.map((topic) => (
              <Link
                className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
                key={topic.slug}
                to={`/academy/topics/${topic.slug}`}
              >
                {topic.title}
              </Link>
            ))}
          </nav>

          <Link
            className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary sm:flex"
            to="/"
          >
            <ChevronLeft className="h-4 w-4" />
            На сайт
          </Link>
        </div>
      </div>
    </header>

    {children}
  </div>
);

const CourseMeta = ({ course }: { course: AcademyCourse }) => (
  <div className="grid gap-3 sm:grid-cols-3">
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <BookOpen className="mb-3 h-5 w-5 text-primary" />
      <p className="text-2xl font-display font-bold">{course.lessons.length || 1}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {course.lessons.length ? "уроков" : "материал"}
      </p>
    </div>
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <Boxes className="mb-3 h-5 w-5 text-accent" />
      <p className="text-lg font-display font-bold">{course.project || course.format}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {course.project ? "сквозной проект" : "формат"}
      </p>
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
  <aside className="lg:self-start">
    <div className="lg:fixed lg:left-6 lg:top-[6.5rem] lg:flex lg:max-h-[calc(100vh-6.5rem)] lg:w-[280px] lg:flex-col 2xl:left-[calc((100vw-1400px)/2+1.5rem)]">
      <div className="shrink-0">
        <Link
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          to="/academy"
        >
          <ArrowLeft className="h-4 w-4" />
          Все материалы
        </Link>

        <div className="rounded-lg border border-border bg-card/35 p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.24em] text-primary">{course.format}</p>
          <Link className="font-display text-lg font-bold transition-colors hover:text-primary" to={`/academy/${course.slug}`}>
            {course.title}
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-6 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
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
    </div>
  </aside>
);

const TopicIcon = ({ slug, className = "h-5 w-5" }: { slug: string; className?: string }) => {
  if (slug === "cpp") return <Braces className={className} />;
  if (slug === "unreal-engine") return <Gamepad2 className={className} />;
  if (slug === "ai") return <BrainCircuit className={className} />;
  if (slug === "tools") return <Wrench className={className} />;
  return <Code2 className={className} />;
};

const formatMaterialCount = (count: number) => {
  if (count % 10 === 1 && count % 100 !== 11) return `${count} материал`;
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} материала`;
  }
  return `${count} материалов`;
};

const TopicCard = ({ topic }: { topic: AcademyTopic }) => {
  const materialCount = getAcademyCoursesByTopic(topic.slug).length;

  return (
    <Link
      className="group flex min-h-56 flex-col rounded-lg border border-border bg-card/45 p-5 transition-all hover:-translate-y-1 hover:border-primary/45 hover:bg-card/70 hover:shadow-2xl hover:shadow-primary/10"
      to={`/academy/topics/${topic.slug}`}
    >
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <TopicIcon slug={topic.slug} />
      </div>
      <h2 className="mb-3 font-display text-2xl font-bold transition-colors group-hover:text-primary">
        {topic.title}
      </h2>
      <p className="text-sm leading-6 text-muted-foreground">{topic.description}</p>
      <p className="mt-auto pt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {formatMaterialCount(materialCount)}
      </p>
    </Link>
  );
};

const CourseCard = ({ course }: { course: AcademyCourse }) => (
  <Link
    className="group flex h-full flex-col rounded-lg border border-border bg-card/45 p-5 transition-all hover:border-primary/45 hover:bg-card/70 hover:shadow-2xl hover:shadow-primary/10"
    to={`/academy/${course.slug}`}
  >
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
        <TopicIcon slug={course.topics[0]} />
      </div>
      <span className="rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {course.format}
      </span>
    </div>

    <h2 className="mb-3 font-display text-2xl font-bold transition-colors group-hover:text-primary">
      {course.title}
    </h2>
    <p className="mb-5 text-sm leading-6 text-muted-foreground">{course.description}</p>

    <div className="mt-auto flex flex-wrap gap-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/40 px-2.5 py-1">
        <BookOpen className="h-3.5 w-3.5" />
        {course.lessons.length ? `${course.lessons.length} уроков` : "материалы"}
      </span>
      {course.status ? (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/40 px-2.5 py-1">
          <Compass className="h-3.5 w-3.5" />
          {course.status}
        </span>
      ) : null}
      {course.tags.map((tag) => (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/40 px-2.5 py-1" key={tag}>
          <Tag className="h-3.5 w-3.5" />
          {tag}
        </span>
      ))}
    </div>
  </Link>
);

const AcademyHome = () => (
  <AcademyShell>
    <main className="container mx-auto px-6 py-10 lg:py-14">
      <section className="mb-12 max-w-4xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">База знаний</p>
        <h1 className="mb-6 font-display text-4xl font-bold leading-tight md:text-6xl">
          Absolute Mikhail Academy
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Практические материалы о разработке, Unreal Engine, C++, нейросетях и инструментах.
        </p>
        <blockquote className="mt-8 max-w-2xl rounded-lg border-l-4 border-primary bg-card/45 px-5 py-4">
          <p className="text-xl font-display font-bold leading-8">
            "Нормально делай, нормально будет!"
          </p>
          <footer className="mt-3 text-sm text-muted-foreground">Абсолютный Михаил</footer>
        </blockquote>
      </section>

      <section aria-labelledby="academy-topics" className="mb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">О чём</p>
            <h2 className="font-display text-3xl font-bold" id="academy-topics">Направления</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {academyTopics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>

      <section aria-labelledby="academy-materials">
        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Что изучить</p>
          <h2 className="font-display text-3xl font-bold" id="academy-materials">Материалы</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {academyCourses.map((course) => (
            <CourseCard course={course} key={course.slug} />
          ))}
        </div>
      </section>
    </main>
  </AcademyShell>
);

const TopicPage = ({ topic }: { topic: AcademyTopic }) => {
  const courses = getAcademyCoursesByTopic(topic.slug);

  return (
    <AcademyShell>
      <main className="container mx-auto px-6 py-10 lg:py-14">
        <Link
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          to="/academy"
        >
          <ArrowLeft className="h-4 w-4" />
          Все направления
        </Link>

        <section className="mb-12 max-w-3xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
            <TopicIcon className="h-7 w-7" slug={topic.slug} />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">Направление</p>
          <h1 className="mb-5 font-display text-4xl font-bold leading-tight md:text-6xl">{topic.title}</h1>
          <p className="text-lg leading-8 text-muted-foreground">{topic.description}</p>
        </section>

        <section aria-labelledby="topic-materials">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold" id="topic-materials">Материалы</h2>
            <span className="text-sm text-muted-foreground">{formatMaterialCount(courses.length)}</span>
          </div>

          {courses.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((course) => (
                <CourseCard course={course} key={course.slug} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/25 px-6 py-12">
              <p className="mb-2 font-display text-xl font-bold">Раздел готов к новым материалам</p>
              <p className="max-w-2xl leading-7 text-muted-foreground">{topic.emptyState}</p>
            </div>
          )}
        </section>
      </main>
    </AcademyShell>
  );
};

const CoursePage = ({ course }: { course: AcademyCourse }) => (
  <AcademyShell>
    <main className="container mx-auto grid gap-10 px-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-10 xl:grid-cols-[280px_minmax(0,760px)_220px]">
      <LessonSidebar course={course} />

      <article>
        <div className="mb-8 rounded-lg border border-border bg-card/30 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">{course.format}</p>
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
    <main className="container mx-auto grid gap-10 px-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-10 xl:grid-cols-[280px_minmax(0,760px)_220px]">
      <LessonSidebar activeLessonSlug={lesson.slug} course={course} />

      <article>
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
  const [sectionSlug, childSlug, extraSlug] = path.split("/").filter(Boolean);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (!sectionSlug) {
    return <AcademyHome />;
  }

  if (sectionSlug === "topics") {
    const topic = childSlug && !extraSlug ? getAcademyTopic(childSlug) : undefined;
    return topic ? <TopicPage topic={topic} /> : <AcademyNotFound />;
  }

  const course = getAcademyCourse(sectionSlug);

  if (!course) {
    return <AcademyNotFound />;
  }

  if (!childSlug) {
    return <CoursePage course={course} />;
  }

  const lesson = !extraSlug ? getAcademyLesson(sectionSlug, childSlug) : undefined;

  if (!lesson) {
    return <AcademyNotFound />;
  }

  return <LessonPage course={course} lesson={lesson} />;
};

export default Academy;
