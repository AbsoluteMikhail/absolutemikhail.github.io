import { fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByTitle("RecalculateSpeed")).toHaveAttribute("scrolling", "no");
    expect(screen.getByRole("link", { name: /Открыть отдельно/ })).toHaveAttribute(
      "href",
      "https://blueprintue.com/blueprint/abc_123-/",
    );
  });

  it("switches a BlueprintUE embed to its local screenshot", () => {
    renderMarkdown(`:::blueprintue RecalculateSpeed
https://blueprintue.com/render/abc_123-/
/academy/course/recalculate.jpg
Резервный кадр RecalculateSpeed
:::`);

    fireEvent.click(screen.getByRole("button", { name: /Скриншот/ }));

    expect(screen.queryByTitle("RecalculateSpeed")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Резервный кадр RecalculateSpeed — увеличить/ })).toBeInTheDocument();
  });

  it("opens Markdown images in an in-page lightbox", () => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.setAttribute("open", "");
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.removeAttribute("open");
      },
    });

    renderMarkdown(`![Тестовая сцена](/academy/course/scene.jpg)`);
    fireEvent.click(screen.getByRole("button", { name: /Тестовая сцена — увеличить/ }));

    expect(screen.getByRole("dialog", { name: "Тестовая сцена" })).toHaveAttribute("open");
    fireEvent.click(screen.getByRole("button", { name: "Закрыть изображение" }));
    expect(screen.queryByRole("dialog", { name: "Тестовая сцена" })).not.toBeInTheDocument();
  });
});
