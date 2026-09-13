import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "../components/academy/MarkdownContent";
import { getHeadings } from "@/lib/academyMarkdown";

const renderMarkdown = (content: string) =>
  render(
    <MemoryRouter>
      <MarkdownContent content={content} />
    </MemoryRouter>,
  );

describe("Academy Markdown extensions", () => {
  it("keeps links clickable inside emphasis", () => {
    renderMarkdown("**[harness](https://code.claude.com/docs/en/glossary)**");
    expect(screen.getByRole("link", { name: "harness" })).toHaveAttribute("href", "https://code.claude.com/docs/en/glossary");
  });
  it("opens downloadable HTML examples as documents, not client-side routes", () => {
    renderMarkdown("[Пример](/academy/ai-intro/examples/index.html)\n\n[Урок](/academy/ai-intro/01-first-steps)");
    expect(screen.getByRole("link", { name: "Пример" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Урок" })).not.toHaveAttribute("target");
  });

  it("keeps long prompts in a native disclosure", () => {
    renderMarkdown(":::details Полный запрос\n> Нарисуй мастерскую.\n:::");
    const summary = screen.getByText("Полный запрос");
    expect(summary.closest("details")).not.toHaveAttribute("open");
    expect(screen.getByText("Нарисуй мастерскую.")).toBeInTheDocument();
  });

  it("renders a gallery with accessible image enlargement", async () => {
    renderMarkdown(":::gallery Образы\n![Портрет](/academy/ai-intro/portrait.webp)\n![Рисунок](/academy/ai-intro/art.webp)\n:::");
    expect(screen.getByRole("group", { name: "Образы" })).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Рисунок — увеличить" }));
    expect(screen.getByRole("dialog", { name: "Рисунок" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
  it("keeps headings from code examples out of the table of contents", () => {
    const content = "```md\n## Практика\n```\n\n## Практика\n\n## Практика";
    renderMarkdown(content);
    const headings = getHeadings(content);
    expect(headings.map((heading) => heading.id)).toEqual(["практика", "практика-2"]);
    headings.forEach((heading) => expect(document.getElementById(heading.id)).toBeInTheDocument());
  });

  it("renders a stray callout delimiter without getting stuck", () => {
    renderMarkdown("::: \n\nТекст после разделителя");
    expect(screen.getByText("Текст после разделителя")).toBeInTheDocument();
  });

  it("renders Markdown tables", () => {
    renderMarkdown(`| Эффект | Скорость |\n|---|---:|\n| Болото | 300 |`);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Болото")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
  });

  it("renders an accessible responsive flow diagram", () => {
    renderMarkdown(`:::flow Архитектура\nБолото | Яд\nSpeed Manager\nCharacter Movement\n:::`);

    expect(screen.getByRole("img", { name: /Архитектура/ })).toBeInTheDocument();
    expect(screen.getByText("Speed Manager")).toBeInTheDocument();
  });

  it("embeds only a BlueprintUE render URL and keeps a fallback link", () => {
    renderMarkdown(`:::blueprintue RecalculateSpeed\nhttps://blueprintue.com/blueprint/abc_123-/\n:::`);

    expect(screen.getByTitle("RecalculateSpeed")).toHaveAttribute(
      "src",
      "https://blueprintue.com/render/abc_123-/",
    );
    expect(screen.getByTitle("RecalculateSpeed")).toHaveAttribute("scrolling", "no");
    expect(screen.getByRole("link", { name: /Открыть отдельно/ })).toHaveAttribute(
      "href",
      "https://blueprintue.com/blueprint/abc_123-/",
    );
  });

  it("shows a Blueprint screenshot first and switches to the interactive graph", () => {
    renderMarkdown(`:::blueprintue RecalculateSpeed
https://blueprintue.com/render/abc_123-/
/academy/course/recalculate.jpg
Резервный кадр RecalculateSpeed
:::`);

    expect(screen.queryByTitle("RecalculateSpeed")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Резервный кадр RecalculateSpeed — увеличить/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Граф/ }));
    expect(screen.getByTitle("RecalculateSpeed")).toHaveAttribute(
      "src",
      "https://blueprintue.com/render/abc_123-/",
    );
  });

  it("opens Markdown images in an in-page lightbox", async () => {
    renderMarkdown(`![Тестовая сцена](/academy/course/scene.jpg)`);
    fireEvent.click(screen.getByRole("button", { name: /Тестовая сцена — увеличить/ }));

    expect(screen.getByRole("dialog", { name: "Тестовая сцена" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть изображение" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Тестовая сцена" })).not.toBeInTheDocument();
    });
  });
});
