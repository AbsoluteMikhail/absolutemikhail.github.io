import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Navbar from "@/components/Navbar";

const renderNavigation = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <Navbar />
    <Routes>
      <Route path="/academy" element={<h1>Материалы Академии</h1>} />
      <Route path="*" element={<h1>Портфолио</h1>} />
    </Routes>
  </MemoryRouter>,
);

afterEach(() => {
  document.body.style.overflow = "";
  vi.restoreAllMocks();
});

describe("main navigation", () => {
  it("uses the persistent menu button as the contact dialog focus origin", () => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
    const rect = document.body.getBoundingClientRect();
    vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue(Object.assign([rect], { item: () => rect }));
    renderNavigation("/projects/duelant");
    const toggle = screen.getByRole("button", { name: "Открыть меню" });
    fireEvent.click(toggle);
    const menu = document.getElementById(toggle.getAttribute("aria-controls")!);
    const contact = within(menu!).getByRole("button", { name: "Связаться" });
    contact.focus();
    fireEvent.click(contact);
    const dialog = screen.getByRole("dialog");
    fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("opens Academy from the projects page instead of returning to the homepage", () => {
    renderNavigation("/projects");
    fireEvent.click(screen.getByRole("link", { name: "Академия" }));
    expect(screen.getByRole("heading", { name: "Материалы Академии" })).toBeInTheDocument();
  });

  it("opens Academy from the mobile menu and restores page scrolling", () => {
    document.body.style.overflow = "auto";
    renderNavigation("/");
    const toggle = screen.getByRole("button", { name: "Открыть меню" });
    fireEvent.click(toggle);
    expect(document.body.style.overflow).toBe("hidden");

    const menu = document.getElementById(toggle.getAttribute("aria-controls")!);
    fireEvent.click(within(menu!).getByRole("link", { name: "Академия" }));
    expect(screen.getByRole("heading", { name: "Материалы Академии" })).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("auto");
  });
});
