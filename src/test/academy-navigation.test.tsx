import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AcademyDisclosure } from "@/components/academy/AcademyDisclosure";
import { MemoryRouter } from "react-router-dom";
import { AcademyNavigation } from "@/components/academy/AcademyNavigation";
import { getAcademyCourse } from "@/lib/academy";

describe("compact Academy navigation", () => {
  it("shows lessons directly when a course has only one module", () => {
    const course = getAcademyCourse("ai-intro")!;
    const active = course.lessons[1];
    const { container } = render(<MemoryRouter><AcademyNavigation course={course} activeLessonSlug={active.slug} headings={[{ id: "practice", text: "Практика", depth: 2 }]} /></MemoryRouter>);
    const menus = container.querySelectorAll('nav[aria-label="Уроки курса"]');
    expect(menus).toHaveLength(2);
    menus.forEach((menu) => {
      expect(menu.querySelector("details")).toBeNull();
      expect(menu.querySelectorAll('a[href^="/academy/"]')).toHaveLength(course.lessons.length);
      expect(menu.querySelector('a[aria-current="page"]')?.closest("li")?.querySelector('a[href="#practice"]')).not.toBeNull();
    });
    expect(container.querySelector("details > summary")?.textContent).toBe("Содержание и разделы");
  });

  it("places heading links inside the active lesson and opens its module", () => {
    const course = getAcademyCourse("ue-cpp-blueprint-devs")!;
    const active = course.lessons[course.lessons.length - 1];
    const { container: doc } = render(<MemoryRouter><AcademyNavigation course={course} activeLessonSlug={active.slug} headings={[{ id: "practice", text: "Практика", depth: 2 }]} /></MemoryRouter>);
    const activeLinks = doc.querySelectorAll('a[aria-current="page"]');
    expect(activeLinks.length).toBe(2);
    activeLinks.forEach((link) => {
      expect(link.getAttribute("href")).toBe(`/academy/${course.slug}/${active.slug}`);
      expect(link.closest("li")?.querySelector('a[href="#practice"]')).not.toBeNull();
      expect(link.closest("details")?.hasAttribute("open")).toBe(true);
    });
    expect(doc.querySelector("details")?.hasAttribute("open")).toBe(false);
    expect(doc.querySelectorAll('details:not([open])').length).toBeGreaterThan(1);
  });

  it("starts collapsed and closes with Escape while restoring focus to the summary", () => {
    render(<AcademyDisclosure label="Уроки курса"><a href="#lesson">Первый урок</a></AcademyDisclosure>);
    const summary = screen.getByText("Уроки курса");
    const details = summary.closest("details")!;
    expect(details).not.toHaveAttribute("open");
    details.open = true;
    const link = screen.getByRole("link", { name: "Первый урок" });
    link.focus();
    fireEvent.keyDown(link, { key: "Escape" });
    expect(details).not.toHaveAttribute("open");
    expect(summary).toHaveFocus();
  });

  it("collapses after selecting a heading without cancelling the anchor", () => {
    render(<AcademyDisclosure label="На странице"><a href="#practice">Практика</a></AcademyDisclosure>);
    const details = screen.getByText("На странице").closest("details")!;
    details.open = true;
    const link = screen.getByRole("link", { name: "Практика" });
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    fireEvent(link, click);
    expect(details).not.toHaveAttribute("open");
    expect(click.defaultPrevented).toBe(false);
  });
});
