import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
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
});

describe("main navigation", () => {
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
