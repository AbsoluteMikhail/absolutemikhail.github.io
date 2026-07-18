import { fireEvent, render, screen } from "@testing-library/react";
import { Link } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";

vi.mock("../pages/Projects", () => ({
  default: () => <h1>ВСЕ ПРОЕКТЫ</h1>,
}));

const InitialHome = () => <Link to="/projects">Все проекты</Link>;

describe("client-side routing", () => {
  it("keeps rendering when navigation loads a lazy route", async () => {
    window.history.replaceState(null, "", "/");

    render(<App InitialPage={InitialHome} initialRoute="home" />);
    fireEvent.click(screen.getByRole("link", { name: "Все проекты" }));

    expect(
      await screen.findByRole("heading", { name: "ВСЕ ПРОЕКТЫ" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/projects");
  });
});
