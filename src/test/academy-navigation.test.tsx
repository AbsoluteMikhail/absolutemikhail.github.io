import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AcademyDisclosure } from "@/components/academy/AcademyDisclosure";

describe("compact Academy navigation", () => {
  it("starts collapsed and closes with Escape while restoring focus to the summary", () => {
    render(<AcademyDisclosure label="Уроки курса"><a href="#lesson">Первый урок</a></AcademyDisclosure>);
    const summary = screen.getByText("Уроки курса");
    const details = summary.closest("details")!;
    expect(details).not.toHaveAttribute("open");
    details.open = true;
    const link = screen.getByRole("link", { name: "Первый урок" });
    link.focus();
    fireEvent.keyDown(link, { key: "Escape" });
    expect(details).not.toHaveAttribute("open");
    expect(summary).toHaveFocus();
  });

  it("collapses after selecting a heading without cancelling the anchor", () => {
    render(<AcademyDisclosure label="На странице"><a href="#practice">Практика</a></AcademyDisclosure>);
    const details = screen.getByText("На странице").closest("details")!;
    details.open = true;
    const link = screen.getByRole("link", { name: "Практика" });
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    fireEvent(link, click);
    expect(details).not.toHaveAttribute("open");
    expect(click.defaultPrevented).toBe(false);
  });
});
