import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Project from "@/pages/Project";
import Projects from "@/pages/Projects";
import FAQSection from "@/components/FAQSection";
import { faqItems } from "@/content/faq";
import { itchProjects } from "@/constants/itchProjects";
import { mentoredProjects } from "@/constants/mentoredProjects";
import { projectPages, projectPath } from "@/lib/projectPages";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

describe("individual project pages", () => {
  it("gives every enabled project a unique indexable route and matching metadata", async () => {
    expect(new Set(projectPages.map((project) => project.slug)).size).toBe(projectPages.length);
    for (const project of projectPages) {
      const metadata = await resolvePageMetadata(projectPath(project.slug) + "/");
      expect(metadata.title).toContain(project.title);
      expect(metadata.description).toBe(project.description);
      expect(metadata.robots).toBe("index, follow");
    }
    expect((await resolvePageMetadata("/projects/not-a-game")).robots).toContain("noindex");
  });

  it("navigates from the catalog to a page and back without opening a dialog", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<MemoryRouter initialEntries={["/projects"]}><Routes>
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<Project />} />
    </Routes></MemoryRouter>);
    for (const project of projectPages) {
      expect(document.querySelector(`a[href="${projectPath(project.slug)}"]`)).not.toBeNull();
    }
    fireEvent.click(screen.getByRole("link", { name: "Подробнее о проекте DUELANT" }));
    expect(screen.getByRole("heading", { level: 1, name: "DUELANT" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Воспроизвести видео проекта DUELANT" }));
    expect(screen.getByTitle("Видео проекта DUELANT")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Dixotomia" }));
    expect(screen.getByRole("heading", { level: 1, name: "Dixotomia" })).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("link", { name: "Весь архив" }));
    expect(screen.getByRole("heading", { level: 1, name: "ВСЕ ПРОЕКТЫ" })).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it("links small and mentored games to their external pages and disables their local metadata", async () => {
    render(<MemoryRouter><Projects /></MemoryRouter>);
    for (const project of [...itchProjects, ...mentoredProjects]) {
      expect(document.querySelector(`a[href="${project.url}"]`)).toHaveAttribute("target", "_blank");
      expect(document.querySelector(`a[href="${projectPath(project.slug)}"]`)).toBeNull();
      expect(projectPages.some((page) => page.slug === project.slug)).toBe(false);
      expect((await resolvePageMetadata(projectPath(project.slug))).robots).toContain("noindex");
    }
    expect(screen.getByText(/Авторство и результат — их/)).toBeInTheDocument();
  });

  it.each(["relsu", "gerasim-protiv-besov"])("shows a not-found page for disabled project %s", (slug) => {
    render(<MemoryRouter initialEntries={[projectPath(slug)]}><Routes><Route path="/projects/:slug" element={<Project />} /></Routes></MemoryRouter>);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("includes all development facts in the server HTML without disclosures", () => {
    for (const project of projectPages.filter((page) => page.development?.length)) {
      const html = renderToString(<MemoryRouter initialEntries={[projectPath(project.slug)]}><Routes><Route path="/projects/:slug" element={<Project />} /></Routes></MemoryRouter>);
      const document = new DOMParser().parseFromString(html, "text/html");
      const section = document.querySelector('[aria-labelledby="project-development-title"]');
      expect(section).not.toBeNull();
      for (const fact of project.development ?? []) {
        expect(section?.textContent).toContain(fact.title);
        expect(section?.textContent).toContain(fact.text);
      }
      expect(section?.querySelector("details")).toBeNull();
    }
  });

  it("shows a not-found page for an unknown slug", () => {
    render(<MemoryRouter initialEntries={["/projects/not-a-game"]}><Routes><Route path="/projects/:slug" element={<Project />} /></Routes></MemoryRouter>);
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});

it("keeps all FAQ answers in native disclosures in the server HTML", () => {
  const html = renderToString(<FAQSection />);
  const document = new DOMParser().parseFromString(html, "text/html");
  expect(document.querySelectorAll("details > summary")).toHaveLength(faqItems.length);
  for (const item of faqItems) expect(document.body.textContent).toContain(item.answer);
});
