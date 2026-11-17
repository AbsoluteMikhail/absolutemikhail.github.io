import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";

describe("studio homepage", () => {
  it("offers real projects and keeps the personal archive and Academy accessible", () => {
    const { container } = render(<MemoryRouter><Index /></MemoryRouter>);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelector('a[href="/projects/duelant/"]')).not.toBeNull();
    expect(container.querySelector('a[href="/projects/gribnik/"]')).not.toBeNull();
    expect(container.querySelector('a[href="https://t.me/MalenaOnline_bot"]')).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Личная страница" })).toHaveAttribute("href", "/mikhail/");
    expect(screen.getAllByRole("link", { name: "Проекты Михаила" }).every(link => link.getAttribute("href") === "/projects/")).toBe(true);
    expect(screen.getByRole("link", { name: "Академия" })).toHaveAttribute("href", "/academy/");
    expect(container.querySelectorAll('a[href^="#"]')).not.toHaveLength(0);
    for (const link of container.querySelectorAll('a[href^="#"]')) {
      expect(container.querySelector(link.getAttribute("href")!)).not.toBeNull();
    }
  });

  it("allows reopening analytics settings from the new footer", () => {
    const settings = vi.fn();
    window.addEventListener("gamepunk-privacy-settings", settings);
    render(<MemoryRouter><Index /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Настройки аналитики" }));
    expect(settings).toHaveBeenCalledOnce();
    window.removeEventListener("gamepunk-privacy-settings", settings);
  });
});
