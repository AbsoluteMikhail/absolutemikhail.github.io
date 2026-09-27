import { fireEvent, render, screen } from "@testing-library/react";
import { Link } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

vi.mock("@/pages/Academy", () => { throw new TypeError("Failed to fetch dynamically imported module: /assets/Academy-old.js"); });

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("failed page navigation", () => {
  it("keeps a recovery screen when an Academy chunk cannot be loaded", async () => {
    render(<App InitialPage={() => <Link to="/academy">Академия</Link>} initialRoute="home" />);
    fireEvent.click(screen.getByRole("link", { name: "Академия" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Не удалось открыть страницу");
    expect(screen.getByRole("button", { name: "Обновить страницу" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
    expect(window.location.pathname).toBe("/academy");
  });
});
