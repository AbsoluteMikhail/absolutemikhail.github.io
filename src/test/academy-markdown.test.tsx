import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "../components/academy/MarkdownContent";

const renderMarkdown = (content: string) =>
  render(
    <MemoryRouter>
      <MarkdownContent content={content} />
    </MemoryRouter>,
  );

describe("Academy Markdown extensions", () => {
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
    expect(screen.getByRole("link", { name: /Открыть отдельно/ })).toHaveAttribute(
      "href",
      "https://blueprintue.com/blueprint/abc_123-/",
    );
  });
});
