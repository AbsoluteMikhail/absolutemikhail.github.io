import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ContactMessenger } from "@/components/ContactMessenger";
import GamesSection from "@/components/GamesSection";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import LegalModal from "@/components/LegalModal";
import { decodeContactLink, encodedContactLinks } from "@/constants/contactLinks";
import { projects } from "@/constants/projects";

// jsdom does not implement the dialog top layer. These tests cover React
// wiring; the real top layer and focus behavior are also verified in the browser.
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value() { this.setAttribute("open", ""); },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value() { this.removeAttribute("open"); },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.style.overflow = "";
});

describe("contact dialog", () => {
  it("opens a labelled modal and restores scrolling when Escape requests closure", () => {
    document.body.style.overflow = "auto";
    render(<ContactMessenger />);
    fireEvent.click(screen.getByRole("button", { name: "Связаться" }));

    const dialog = screen.getByRole("dialog", { name: "Где вам удобнее?" });
    expect(dialog).toHaveAttribute("open");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("only dismisses a pointer press on the backdrop", () => {
    render(<ContactMessenger />);
    fireEvent.click(screen.getByRole("button", { name: "Связаться" }));
    fireEvent.mouseDown(screen.getByText("Выберите удобный способ связи — отвечу лично."));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("wraps Tab in both directions and restores the trigger on close", () => {
    // Layout is absent in jsdom; all buttons in this fixture are visible.
    const rect = document.body.getBoundingClientRect();
    vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue(
      Object.assign([rect], { item: (index: number) => index === 0 ? rect : null }),
    );
    render(<ContactMessenger />);
    const trigger = screen.getByRole("button", { name: "Связаться" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    const buttons = within(dialog).getAllByRole("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];

    first.focus();
    fireEvent.keyDown(first, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(first).toHaveFocus();
    fireEvent.click(first);
    expect(trigger).toHaveFocus();
  });

  it("preserves the selected mentoring message when opening Telegram", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const message = "Хочу разобрать C++ и Blueprint";
    render(<ContactMessenger message={message} />);
    fireEvent.click(screen.getByRole("button", { name: "Связаться" }));
    fireEvent.click(screen.getByRole("button", { name: /Написать в Telegram/ }));

    expect(open).toHaveBeenCalledWith(
      `${decodeContactLink(encodedContactLinks.telegram)}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("portfolio and legal dialogs", () => {
  it("resets a selected slide when an open dialog switches to a shorter gallery", async () => {
    const first = projects.find((item) => item.slug === "duelant")!;
    const second = projects.find((item) => item.slug === "malenastrom")!;
    const view = render(<ProjectDetailModal project={first} isOpen onClose={() => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: "Предыдущий кадр" }));
    await waitFor(() => expect(screen.getByRole("img", { name: /Скриншот проекта/ })).toHaveAttribute("src", first.screenshots[first.screenshots.length - 1].src));
    view.rerender(<ProjectDetailModal project={second} isOpen onClose={() => undefined} />);
    expect(screen.getByRole("img", { name: /Скриншот проекта/ })).toHaveAttribute("src", second.screenshots[0].src);
  });

  it("uses the cover when a project has neither video nor screenshots", () => {
    const project = { ...projects[0], videoUrl: undefined, screenshots: [] };
    render(<ProjectDetailModal project={project} isOpen onClose={() => undefined} />);
    expect(screen.getByRole("img", { name: `Обложка проекта ${project.title}` })).toHaveAttribute("src", project.cover);
    expect(screen.queryByRole("button", { name: "Следующий кадр" })).not.toBeInTheDocument();
  });

  it("starts a project without video on its first screenshot and cycles only through images", async () => {
    const project = projects.find((item) => item.slug === "malenastrom")!;
    render(<ProjectDetailModal project={project} isOpen onClose={() => undefined} />);
    expect(screen.queryByRole("button", { name: /Воспроизвести видео/ })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Скриншот проекта/ })).toHaveAttribute("src", project.screenshots[0].src);
    fireEvent.click(screen.getByRole("button", { name: "Предыдущий кадр" }));
    await waitFor(() => expect(screen.getByRole("img", { name: /Скриншот проекта/ })).toHaveAttribute("src", project.screenshots[2].src));
    fireEvent.click(screen.getByRole("button", { name: "Следующий кадр" }));
    await waitFor(() => expect(screen.getByRole("img", { name: /Скриншот проекта/ })).toHaveAttribute("src", project.screenshots[0].src));
  });

  it("exposes project cards as buttons and resets the gallery between projects", () => {
    render(<MemoryRouter><GamesSection /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Подробнее о проекте DUELANT" }));
    expect(screen.getByRole("dialog", { name: "DUELANT" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Следующий кадр" }));
    expect(screen.getByRole("button", { name: "Открыть кадр 2 из 6" })).toHaveAttribute("aria-current", "true");
    fireEvent.click(screen.getByRole("button", { name: "Закрыть описание проекта" }));
    fireEvent.click(screen.getByRole("button", { name: "Подробнее о проекте Dixotomia" }));
    expect(screen.getByRole("dialog", { name: "Dixotomia" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Открыть кадр 1 из 5" })).toHaveAttribute("aria-current", "true");
  });

  it("handles native cancellation for legal content and cleans up on unmount", () => {
    const onClose = vi.fn();
    const { unmount } = render(<LegalModal isOpen onClose={onClose} title="Документ" content={<p>Текст документа</p>} />);
    fireEvent(screen.getByRole("dialog", { name: "Документ" }), new Event("cancel", { bubbles: true, cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
