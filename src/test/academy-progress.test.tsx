import { act, render, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { READING_SAVE_DELAY, useReadingProgress } from "@/components/academy/useReadingProgress";
import { ACADEMY_PROGRESS_KEY, parseAcademyProgress } from "@/lib/academyProgress";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); localStorage.clear(); });

describe("Academy reading position", () => {
  it("saves only after a visible reading pause and cancels pending jumps on scroll, hide or exit", () => {
    vi.useFakeTimers();
    let scroll = 1000;
    let visible: DocumentVisibilityState = "visible";
    let pending: FrameRequestCallback | undefined;
    vi.spyOn(document, "visibilityState", "get").mockImplementation(() => visible);
    vi.spyOn(window, "scrollY", "get").mockImplementation(() => scroll);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(1000);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { pending = callback; return 1; });
    const { container } = render(<article data-academy-reading />);
    vi.spyOn(container.querySelector("article")!, "getBoundingClientRect").mockImplementation(() => ({ top: -scroll, bottom: 3000 - scroll, height: 3000, left: 0, right: 760, width: 760, x: 0, y: -scroll, toJSON: () => ({}) }));
    const path = "/academy/demo/lesson";
    const { unmount } = renderHook(() => useReadingProgress(path, []));
    act(() => vi.advanceTimersByTime(READING_SAVE_DELAY - 1));
    expect(localStorage.getItem(ACADEMY_PROGRESS_KEY)).toBeNull();
    act(() => { scroll = 1200; window.dispatchEvent(new Event("scroll")); pending?.(0); });
    act(() => vi.advanceTimersByTime(READING_SAVE_DELAY - 1));
    expect(localStorage.getItem(ACADEMY_PROGRESS_KEY)).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(parseAcademyProgress(localStorage.getItem(ACADEMY_PROGRESS_KEY))[path].percent).toBe(60);
    act(() => { scroll = 1800; window.dispatchEvent(new Event("scroll")); pending?.(0); });
    act(() => { visible = "hidden"; document.dispatchEvent(new Event("visibilitychange")); vi.advanceTimersByTime(READING_SAVE_DELAY); });
    expect(parseAcademyProgress(localStorage.getItem(ACADEMY_PROGRESS_KEY))[path].percent).toBe(60);
    act(() => { visible = "visible"; document.dispatchEvent(new Event("visibilitychange")); pending?.(0); });
    act(() => vi.advanceTimersByTime(READING_SAVE_DELAY - 1));
    unmount();
    act(() => vi.advanceTimersByTime(READING_SAVE_DELAY));
    expect(parseAcademyProgress(localStorage.getItem(ACADEMY_PROGRESS_KEY))[path].percent).toBe(60);
  });

  it("tracks the article, highlights headings, clamps the ends and resets on another page", () => {
    let scroll = 0;
    let height = 3000;
    let pending: FrameRequestCallback | undefined;
    vi.spyOn(window, "scrollY", "get").mockImplementation(() => scroll);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(1000);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { pending = callback; return 1; });
    const cancel = vi.spyOn(window, "cancelAnimationFrame");
    const { container } = render(<article data-academy-reading><h2 id="intro">Введение</h2><h2 id="practice">Практика</h2></article>);
    const article = container.querySelector("article")!;
    const rect = (top: number, bottom: number) => ({ top, bottom, height: bottom - top, left: 0, right: 760, width: 760, x: 0, y: top, toJSON: () => ({}) });
    vi.spyOn(article, "getBoundingClientRect").mockImplementation(() => rect(100 - scroll, height + 100 - scroll));
    vi.spyOn(container.querySelector("#intro")!, "getBoundingClientRect").mockImplementation(() => rect(200 - scroll, 230 - scroll));
    vi.spyOn(container.querySelector("#practice")!, "getBoundingClientRect").mockImplementation(() => rect(1400 - scroll, 1430 - scroll));
    const headings = [{ id: "intro", text: "Введение", depth: 2 }, { id: "practice", text: "Практика", depth: 2 }];
    const { result, rerender, unmount } = renderHook(({ page }) => useReadingProgress(page, headings), { initialProps: { page: "first" } });
    const update = (position: number, event = "scroll") => act(() => {
      scroll = position;
      window.dispatchEvent(new Event(event));
      pending?.(0);
    });
    expect(result.current).toEqual({ percent: 0, activeHeading: "" });
    update(1052);
    expect(result.current).toEqual({ percent: 50, activeHeading: "intro" });
    update(1500);
    expect(result.current.activeHeading).toBe("practice");
    update(2200);
    expect(result.current.percent).toBe(100);
    height = 4000;
    update(1500, "resize");
    expect(result.current.percent).toBe(48);
    scroll = 0;
    rerender({ page: "second" });
    expect(result.current).toEqual({ percent: 0, activeHeading: "" });
    update(-100);
    expect(result.current.percent).toBe(0);
    unmount();
    expect(cancel).toHaveBeenCalled();
  });
});
