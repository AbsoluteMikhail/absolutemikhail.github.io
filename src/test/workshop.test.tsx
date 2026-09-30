import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import WorkshopSection from "@/components/WorkshopSection";
import { workshop } from "@/constants/workshop";

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

describe("Malena gallery", () => {
  it("opens on demand, wraps in both directions and selects portraits from thumbnails", () => {
    render(<WorkshopSection />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Открыть галерею Малены" }));
    const dialog = screen.getByRole("dialog", { name: "Как Малена видит себя" });
    const gallery = within(dialog);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(gallery.getByRole("button", { name: "Предыдущий портрет" }));
    expect(gallery.getByRole("img")).toHaveAttribute("src", workshop.malena.portraits[5].src);
    fireEvent.keyDown(gallery.getByRole("button", { name: "Следующий портрет" }), { key: "ArrowRight" });
    expect(gallery.getByRole("img")).toHaveAttribute("src", workshop.malena.portraits[0].src);
    fireEvent.click(gallery.getByRole("button", { name: "Следующий портрет" }));
    expect(gallery.getByRole("img")).toHaveAttribute("src", workshop.malena.portraits[1].src);
    fireEvent.keyDown(gallery.getByRole("button", { name: "Следующий портрет" }), { key: "ArrowLeft" });
    expect(gallery.getByRole("img")).toHaveAttribute("src", workshop.malena.portraits[0].src);

    workshop.malena.portraits.forEach((portrait, index) => {
      const thumbnail = gallery.getByRole("button", { name: `Открыть портрет ${index + 1}: ${portrait.title}` });
      fireEvent.click(thumbnail);
      expect(thumbnail).toHaveAttribute("aria-current", "true");
      expect(gallery.getByRole("img")).toHaveAttribute("src", portrait.src);
      expect(gallery.getByRole("status")).toHaveTextContent(`${index + 1} / 6`);
    });
    fireEvent.click(gallery.getByRole("button", { name: "Закрыть галерею" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("resets on reopening and supports native Escape cancellation and backdrop dismissal", () => {
    render(<WorkshopSection />);
    const trigger = screen.getByRole("button", { name: "Посмотреть галерею" });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Следующий портрет" }));
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: true, cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole("status")).toHaveTextContent("1 / 6");
    fireEvent.mouseDown(screen.getByRole("heading", { name: "Как Малена видит себя" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
