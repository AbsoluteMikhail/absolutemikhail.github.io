import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReviewsSection from "@/components/ReviewsSection";
import { gameReviews } from "@/content/reviews";

describe("review playback controls", () => {
  it("provides a persistent pause toggle for touch and keyboard users", () => {
    render(<ReviewsSection />);
    const pause = screen.getByRole("button", { name: "Приостановить прокрутку отзывов" });
    expect(pause).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(pause);
    const resume = screen.getByRole("button", { name: "Возобновить прокрутку отзывов" });
    expect(resume).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(resume);
    expect(screen.getByRole("button", { name: "Приостановить прокрутку отзывов" })).toHaveAttribute("aria-pressed", "false");
  });

  it("does not repeat review links in the tab order or accessibility tree", () => {
    const { container } = render(<ReviewsSection />);
    const copy = container.querySelector<HTMLElement>(".review-copy")!;
    expect(copy).toHaveAttribute("aria-hidden", "true");
    expect(within(copy).queryAllByRole("link", { hidden: true })).toHaveLength(0);
    expect(screen.getAllByRole("link")).toHaveLength(gameReviews.length);
  });
});
