import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AcademySection from "@/components/AcademySection";
import GamesSection from "@/components/GamesSection";
import MentoringSection from "@/components/MentoringSection";
import Index from "@/pages/Index";
import { featuredProjects } from "@/constants/projects";
import { academyHighlights, resolveAcademyHighlights } from "@/content/academyHighlights";
import {
  countCourseLessons,
  getAcademyCourse,
  getLessonAvailabilityLabel,
  isLessonReady,
} from "@/lib/academy";

describe("homepage product hierarchy", () => {
  it("puts games and academy before production experience in the document order", () => {
    const { container } = render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );

    const games = container.querySelector("#games");
    const academy = container.querySelector("#academy");
    const mentoring = container.querySelector("#mentoring");
    const production = container.querySelector("#production");
    const timeline = container.querySelector("#timeline");

    expect(games).not.toBeNull();
    expect(academy).not.toBeNull();
    expect(mentoring).not.toBeNull();
    expect(production).not.toBeNull();
    expect(timeline).not.toBeNull();

    const position = (node: Element | null) =>
      node ? Array.from(container.querySelectorAll("section")).indexOf(node as HTMLElement) : -1;

    expect(position(games)).toBeLessThan(position(academy));
    expect(position(academy)).toBeLessThan(position(mentoring));
    expect(position(mentoring)).toBeLessThan(position(production));
    expect(position(production)).toBeLessThan(position(timeline));
  });

  it("shows a featured project subset rather than the full non-frozen catalog", () => {
    render(
      <MemoryRouter>
        <GamesSection />
      </MemoryRouter>,
    );

    const featured = featuredProjects();
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.length).toBeLessThanOrEqual(5);
    expect(screen.getByRole("button", { name: "Подробнее о проекте DUELANT" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Подробнее о проекте ЗВЁЗДНЫЙ КОЧЕВНИК" })).not.toBeInTheDocument();
  });

  it("links academy highlights to real published materials", () => {
    render(
      <MemoryRouter>
        <AcademySection />
      </MemoryRouter>,
    );

    expect(academyHighlights).toHaveLength(3);
    for (const material of resolveAcademyHighlights()) {
      expect(screen.getByRole("link", { name: material.title })).toHaveAttribute("href", material.href);
    }
    expect(screen.getByRole("link", { name: "Открыть Академию" })).toHaveAttribute("href", "/academy");
  });

  it("keeps mentoring contact actions and clarifies format boundaries", () => {
    render(<MentoringSection />);
    expect(screen.getByRole("button", { name: "Выбрать консультацию" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Разобрать проект" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Обсудить архитектуру" })).toBeInTheDocument();
    expect(screen.getByText(/не заменяет полный аудит/i)).toBeInTheDocument();
    expect(screen.getAllByRole("list", { name: "Что разберём" })).toHaveLength(3);
    expect(screen.getAllByText(/До встречи:/)).toHaveLength(3);
    expect(screen.getAllByText(/После встречи:/)).toHaveLength(3);
  });
});

describe("academy lesson availability", () => {
  it("does not infer lesson readiness from the course status", () => {
    const course = getAcademyCourse("ai-intro")!;
    const lesson = { ...course.lessons[0], meta: { ...course.lessons[0].meta, status: "" } };
    expect(isLessonReady(course, lesson)).toBe(false);
    expect(getLessonAvailabilityLabel(course, lesson)).toBe("Материал");
    expect(isLessonReady({ ...course, status: "Тестируется" }, course.lessons[0])).toBe(true);
  });

  it("rejects missing and unfinished highlight targets instead of silently linking a different page", () => {
    expect(() => resolveAcademyHighlights([{ courseSlug: "ai-intro", lessonSlug: "missing", audience: "" }])).toThrow(/not found/);
    expect(() => resolveAcademyHighlights([{ courseSlug: "ue-cpp-blueprint-devs", lessonSlug: "01-ue-cpp-environment", audience: "" }])).toThrow(/not ready/);
  });
  it("separates planned and available lesson counts for the testing C++ course", () => {
    const course = getAcademyCourse("ue-cpp-blueprint-devs")!;
    const counts = countCourseLessons(course);

    expect(course.status).toBe("Тестируется");
    expect(counts.planned).toBe(course.lessons.length);
    expect(counts.available).toBe(0);
    expect(isLessonReady(course, course.lessons[0])).toBe(false);
    expect(getLessonAvailabilityLabel(course, course.lessons[0])).toBe("Анонс");
  });

  it("marks published lessons with explicit status as ready", () => {
    const course = getAcademyCourse("data-driven-speed-modifiers")!;
    const lesson = course.lessons[0];
    expect(lesson.meta.status).toBe("Урок");
    expect(isLessonReady(course, lesson)).toBe(true);
    expect(countCourseLessons(course)).toEqual({ planned: 1, available: 1 });
  });
});
