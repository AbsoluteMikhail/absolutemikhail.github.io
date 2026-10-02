import { readFileSync } from "node:fs";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
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

async function flushCursorFrame() {
  await act(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
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
    const reticle = document.querySelector<HTMLElement>(".custom-cursor-reticle");
    expect(layer?.parentElement).toBe(document.body);
    expect(reticle).not.toBeNull();
    fireEvent(window, new MouseEvent("pointermove", { clientX: 120, clientY: 80 }));
    await flushCursorFrame();
    expect(reticle?.style.getPropertyValue("--cursor-x")).toBe("120px");

    rerender(<><CustomCursor /><dialog open /></>);
    await waitFor(() => expect(layer?.parentElement).toBe(document.querySelector("dialog")));
    expect(layer?.querySelector(".custom-cursor-reticle")).toBe(reticle);
    expect(reticle?.style.getPropertyValue("--cursor-x")).toBe("120px");

    // Closing via unmount also removes the old dialog from the document.
    rerender(<CustomCursor />);
    await waitFor(() => expect(layer?.parentElement).toBe(document.body));
    expect(document.querySelectorAll(".custom-cursor")).toHaveLength(1);
    expect(reticle?.style.getPropertyValue("--cursor-x")).toBe("120px");
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

describe("crosshair labels and click", () => {
  it("does not render the cursor into static markup", () => {
    expect(renderToString(<CustomCursor />)).toBe("");
  });

  it("shows contextual captions and keeps the text cursor on fields", async () => {
    mockPointer(true, false);
    render(
      <>
        <CustomCursor />
        <a href="/projects/duelant" data-cursor="play">Проект</a>
        <a href="/academy/course" data-cursor="read">Урок</a>
        <button type="button" data-cursor="view">Кадр</button>
        <a href="https://example.com/store" target="_blank" rel="noreferrer">Магазин</a>
        <a href="https://itch.io/game">Внешняя</a>
        <a href="https://example.com/override" target="_blank" data-cursor="play">Игра снаружи</a>
        <a href="/projects">Архив</a>
        <input type="text" aria-label="Поле" />
        <textarea aria-label="Текст" />
      </>,
    );

    const label = document.querySelector(".reticle-label");
    const reticle = document.querySelector(".custom-cursor-reticle");

    fireEvent.pointerOver(document.querySelector("a[data-cursor='play']")!);
    expect(label).toHaveTextContent("PLAY");
    expect(reticle).toHaveClass("is-focused");

    fireEvent.pointerOver(document.querySelector("a[data-cursor='read']")!);
    expect(label).toHaveTextContent("READ");

    fireEvent.pointerOver(document.querySelector("button[data-cursor='view']")!);
    expect(label).toHaveTextContent("VIEW");

    fireEvent.pointerOver(document.querySelector("a[target='_blank']:not([data-cursor])")!);
    expect(label).toHaveTextContent("OPEN");

    fireEvent.pointerOver(document.querySelector("a[href='https://itch.io/game']")!);
    expect(label).toHaveTextContent("OPEN");

    fireEvent.pointerOver(document.querySelector("a[data-cursor='play'][target='_blank']")!);
    expect(label).toHaveTextContent("PLAY");

    fireEvent.pointerOver(document.querySelector("a[href='/projects']")!);
    expect(label?.textContent).toBe("");
    expect(reticle).toHaveClass("is-focused");

    fireEvent.pointerOver(document.querySelector("input")!);
    expect(reticle).toHaveClass("is-hidden");
    expect(label).not.toHaveClass("is-on");

    fireEvent.pointerOver(document.querySelector("textarea")!);
    expect(reticle).toHaveClass("is-hidden");
    fireEvent.pointerDown(document.querySelector("textarea")!);
    expect(document.querySelector(".cursor-spark")).toBeNull();
  });

  it("yields to the system cursor over an embedded player and keeps the crosshair over video", async () => {
    mockPointer(true, false);
    const { rerender } = render(
      <>
        <CustomCursor />
        <button type="button" data-cursor="play">Смотреть</button>
        <video aria-label="Ролик" />
        <a href="/projects/duelant" data-cursor="play">Проект</a>
      </>,
    );

    const label = document.querySelector(".reticle-label");
    const reticle = document.querySelector(".custom-cursor-reticle");
    const play = document.querySelector("button")!;

    fireEvent.pointerOver(play);
    expect(label).toHaveTextContent("PLAY");

    fireEvent.pointerOver(document.querySelector("video")!);
    expect(reticle).not.toHaveClass("is-hidden");
    expect(label?.textContent).toBe("");

    fireEvent(window, new MouseEvent("pointermove", { clientX: 30, clientY: 40 }));
    await flushCursorFrame();
    document.elementFromPoint = () => null;
    vi.spyOn(document, "elementFromPoint").mockImplementation(() => document.querySelector("iframe"));
    rerender(
      <>
        <CustomCursor />
        <iframe title="Плеер" />
        <a href="/projects/duelant" data-cursor="play">Проект</a>
      </>,
    );
    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    });
    expect(reticle).toHaveClass("is-hidden");
    expect(reticle).not.toHaveClass("is-visible");
    expect(label).not.toHaveClass("is-on");

    fireEvent.mouseEnter(document.documentElement);
    expect(reticle).toHaveClass("is-hidden");

    fireEvent.pointerOver(document.querySelector("a[data-cursor='play']")!);
    expect(label).toHaveTextContent("PLAY");
    expect(reticle).not.toHaveClass("is-hidden");
    expect(document.documentElement.style.cursor).toBe("none");
  });

  it("spawns a short pixel burst and clears it", async () => {
    mockPointer(true, false);
    render(<CustomCursor />);
    fireEvent(window, new MouseEvent("pointerdown", { clientX: 40, clientY: 50, button: 0 }));
    expect(document.querySelectorAll(".cursor-spark").length).toBeGreaterThan(5);
    expect(document.querySelector(".cursor-spark-flash")).not.toBeNull();
    await waitFor(() => expect(document.querySelector(".cursor-spark")).toBeNull(), { timeout: 1000 });
  });
});

describe("light theme cursor and logo styles", () => {
  const css = readFileSync("src/index.css", "utf8");

  it("lets an embedded player use the system cursor without fading the crosshair out over it", () => {
    expect(css).toMatch(/html\.custom-cursor-enabled :is\(iframe, embed, object\) \{\s*cursor:\s*auto !important;/);
    expect(css).toMatch(/\.custom-cursor-reticle\.is-hidden,\s*\.custom-cursor-reticle\.is-hidden \.reticle-label \{\s*opacity:\s*0;\s*transition:\s*none;/);
  });

  it("keeps the light crosshair crisp, without a neon bloom", () => {
    expect(css).toMatch(/html\.light \.custom-cursor-reticle :is\(\.reticle-dot, \.reticle-arm\) \{[^}]*box-shadow:\s*0 0 0 1px hsl\(var\(--background\)\)/s);
    expect(css).toMatch(/html\.light \.cursor-spark \{[^}]*box-shadow:\s*0 0 0 1px hsl\(var\(--background\)\)/s);
    expect(css).not.toMatch(/html\.light \.custom-cursor-reticle[\s\S]*0 0 (?:8|18|22|28|42)px/);
  });

  it("uses a soft logo hover shadow in light instead of a neon bloom", () => {
    render(<MemoryRouter><Logo /></MemoryRouter>);
    expect(document.querySelector("a.site-logo")).toBeInTheDocument();
    expect(css).toContain("html.light .site-logo:hover");
    expect(css).not.toMatch(/html\.light \.site-logo:hover \{[^}]*0 0 10px hsl\(var\(--primary\)\)/s);
  });
});
