import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { lazy, Suspense, type ComponentType } from "react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ScrollToHashElement from "@/components/ScrollToHashElement";

const scrollIntoView = vi.fn();

beforeEach(() => {
  scrollIntoView.mockClear();
  Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
});

afterEach(() => vi.restoreAllMocks());

describe("hash navigation", () => {
  it("waits for a lazy destination to commit before scrolling", async () => {
    let resolvePage!: (module: { default: ComponentType }) => void;
    const Projects = lazy(() => new Promise<{ default: ComponentType }>((resolve) => { resolvePage = resolve; }));

    render(
      <MemoryRouter>
        <ScrollToHashElement />
        <Suspense fallback={<p>Загрузка проектов</p>}>
          <Routes>
            <Route path="/" element={<Link to="/projects#jams">Джемовые проекты</Link>} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </Suspense>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Джемовые проекты" }));
    expect(await screen.findByText("Загрузка проектов")).toBeInTheDocument();
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    expect(scrollIntoView).not.toHaveBeenCalled();

    await act(async () => resolvePage({ default: () => <section id="jams">Джемы</section> }));

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1));
    expect(scrollIntoView.mock.instances[0]).toBe(screen.getByText("Джемы"));
  });

  it("decodes the anchor and respects reduced motion", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
    } as MediaQueryList));

    render(
      <MemoryRouter initialEntries={["/#%D1%86%D0%B5%D0%BB%D1%8C"]}>
        <ScrollToHashElement />
        <section id="цель">Цель</section>
      </MemoryRouter>,
    );

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" }));
    expect(scrollIntoView.mock.instances[0]).toBe(screen.getByText("Цель"));
  });

  it("stops watching a missing anchor after leaving the route", async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/#late"]}>
        <ScrollToHashElement />
      </MemoryRouter>,
    );
    unmount();
    const target = document.createElement("section");
    target.id = "late";
    document.body.append(target);
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    expect(scrollIntoView).not.toHaveBeenCalled();
    target.remove();
  });
});
