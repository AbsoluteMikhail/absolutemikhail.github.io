import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StudioPortrait from "@/components/StudioPortrait";

const portrait = (locale: "ru" | "en" = "ru") => <StudioPortrait src="/portrait.webp" alt="Mikhail" width={292} height={363} locale={locale}><svg data-testid="outline" /></StudioPortrait>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(false);
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("studio portrait recovery", () => {
  it("shows the outline only after the photo loads", () => {
    render(portrait());
    expect(screen.queryByTestId("outline")).toBeNull();
    fireEvent.load(screen.getByRole("img"));
    expect(screen.getByTestId("outline")).toBeInTheDocument();
  });

  it("recognizes a cached image whose load event happened before mounting", () => {
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(292);
    render(portrait());
    expect(screen.getByTestId("outline")).toBeInTheDocument();
  });

  it("retries once, stops after a second failure and lets the visitor recover", () => {
    render(portrait());
    fireEvent.error(screen.getByRole("img"));
    fireEvent.error(screen.getByRole("img"));
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(800));
    expect(screen.getByRole("img")).toHaveAttribute("src", "/portrait.webp?portrait-retry=1");
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("status")).toHaveTextContent("Фото не загрузилось");
    expect(screen.queryByTestId("outline")).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Повторить: Mikhail" }));
    expect(screen.getByRole("img")).toHaveAttribute("src", "/portrait.webp?portrait-retry=2");
    fireEvent.load(screen.getByRole("img"));
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByTestId("outline")).toBeInTheDocument();
  });

  it("cancels the pending retry when a photo loads or the component unmounts", () => {
    const view = render(portrait());
    fireEvent.error(screen.getByRole("img"));
    fireEvent.load(screen.getByRole("img"));
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.error(screen.getByRole("img"));
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("handles an already failed image and translates the fallback", () => {
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    render(portrait("en"));
    act(() => vi.advanceTimersByTime(800));
    expect(screen.getByRole("status")).toHaveTextContent("Photo could not load");
    expect(screen.getByRole("button", { name: "Retry: Mikhail" })).toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });
});
