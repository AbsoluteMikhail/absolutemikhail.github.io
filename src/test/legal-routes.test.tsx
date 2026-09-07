import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppContent } from "@/App";
import Legal from "@/pages/Legal";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

describe("legal documents", () => {
  it.each([
    ["/privacy", "Политика конфиденциальности"],
    ["/terms", "Пользовательское соглашение"],
  ])("opens %s directly with its own document and metadata", async (path, title) => {
    render(<MemoryRouter initialEntries={[path]}><AppContent InitialPage={Legal} initialRoute="legal" /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
    expect((await resolvePageMetadata(path)).title).toContain(title);
    expect((await resolvePageMetadata(path)).robots).toBe("noindex, follow");
    expect(screen.getByRole("link", { name: "На сайт" })).toHaveAttribute("href", "/");
  });

  it("offers the exact public code license and privacy settings from documents", () => {
    const view = render(<MemoryRouter initialEntries={["/terms"]}><Legal /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "лицензии 0BSD" })).toHaveAttribute("href", "/academy-code-license.txt");
    view.unmount();
    render(<MemoryRouter initialEntries={["/privacy"]}><AppContent InitialPage={Legal} initialRoute="legal" /></MemoryRouter>);
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
    fireEvent.click(screen.getByRole("button", { name: "изменить настройки аналитики" }));
    expect(screen.getByRole("dialog", { name: "Настройки аналитики" })).toBeInTheDocument();
  });
});
