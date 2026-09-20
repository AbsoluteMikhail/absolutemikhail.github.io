import { readFileSync } from "node:fs";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import CustomCursor from "@/components/CustomCursor";
import Logo from "@/components/Logo";

afterEach(() => vi.restoreAllMocks());

function mockPointer(fine: boolean, reducedMotion: boolean) {
  const matchMedia = window.matchMedia;
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    ...matchMedia(query),
    matches: query.includes("prefers-reduced-motion") ? reducedMotion : fine,
  }));
}

describe("custom cursor in dialogs", () => {
  it("moves the existing cursor above a modal and back without resetting its position", async () => {
    mockPointer(true, false);
    // JSDOM has no native top layer. Mock only its :modal detection.
    const matches = Element.prototype.matches;
    vi.spyOn(HTMLDialogElement.prototype, "matches").mockImplementation(function (selector) {
      return selector === ":modal" ? this.open : matches.call(this, selector);
    });
    const { rerender, unmount } = render(<><CustomCursor /><dialog /></>);
    const layer = document.querySelector(".custom-cursor-layer");
    const dot = document.querySelector<HTMLElement>(".custom-cursor-dot");
    expect(layer?.parentElement).toBe(document.body);
    expect(dot).not.toBeNull();
    fireEvent(window, new MouseEvent("pointermove", { clientX: 120, clientY: 80 }));
    expect(dot?.style.getPropertyValue("--cursor-x")).toBe("120px");

    rerender(<><CustomCursor /><dialog open /></>);
    await waitFor(() => expect(layer?.parentElement).toBe(document.querySelector("dialog")));
    expect(layer?.querySelector(".custom-cursor-dot")).toBe(dot);
    expect(dot?.style.getPropertyValue("--cursor-x")).toBe("120px");

    // Closing via unmount also removes the old dialog from the document.
    rerender(<CustomCursor />);
    await waitFor(() => expect(layer?.parentElement).toBe(document.body));
    expect(document.querySelectorAll(".custom-cursor")).toHaveLength(2);
    expect(dot?.style.getPropertyValue("--cursor-x")).toBe("120px");
    unmount();
    expect(document.querySelector(".custom-cursor-layer")).toBeNull();
    expect(document.documentElement).not.toHaveClass("custom-cursor-enabled");
  });

  it.each([
    { fine: false, reducedMotion: false },
    { fine: true, reducedMotion: true },
  ])("keeps the native pointer for $fine / reduced motion $reducedMotion", ({ fine, reducedMotion }) => {
    mockPointer(fine, reducedMotion);
    render(<CustomCursor />);
    expect(document.querySelector(".custom-cursor-layer")).toBeNull();
    expect(document.documentElement).not.toHaveClass("custom-cursor-enabled");
  });
});

describe("light theme cursor and logo styles", () => {
  const css = readFileSync("src/index.css", "utf8");

  it("keeps the custom cursor as a primary dot without neon bloom in light", () => {
    expect(css).toMatch(/html\.light \.custom-cursor-dot \{[^}]*box-shadow:\s*none/s);
    expect(css).toMatch(/html\.light \.custom-cursor-ring \{[^}]*box-shadow:\s*none/s);
    expect(css).toMatch(/html\.light \.custom-cursor-ring\.is-interactive \{[^}]*box-shadow:\s*none/s);
  });

  it("uses a soft logo hover shadow in light instead of a neon bloom", () => {
    render(<MemoryRouter><Logo /></MemoryRouter>);
    expect(document.querySelector("a.site-logo")).toBeInTheDocument();
    expect(css).toContain("html.light .site-logo:hover");
    expect(css).not.toMatch(/html\.light \.site-logo:hover \{[^}]*0 0 10px hsl\(var\(--primary\)\)/s);
  });
});
