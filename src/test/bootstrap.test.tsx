import { act, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bootstrapApplication } from "@/lib/bootstrapApplication";

let root: HTMLDivElement;
let mounted: Root | undefined;
beforeEach(() => {
  root = document.createElement("div");
  root.innerHTML = "<h1>Готовая статья</h1>";
  document.body.append(root);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  act(() => mounted?.unmount());
  mounted = undefined;
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("initial page startup", () => {
  it("retains the prerendered HTML until the loaded app commits", async () => {
    let finish!: (value: ReactNode) => void;
    const loading = bootstrapApplication(root, () => new Promise((resolve) => { finish = resolve; }));
    expect(screen.getByRole("heading")).toHaveTextContent("Готовая статья");
    await act(async () => {
      finish(<h1>Интерактивная статья</h1>);
      mounted = await loading;
    });
    expect(screen.getByRole("heading")).toHaveTextContent("Интерактивная статья");
  });

  it("keeps a readable article and adds recovery when the initial chunk fails", async () => {
    const originalArticle = root.firstChild;
    await act(async () => {
      mounted = await bootstrapApplication(root, () => Promise.reject(new TypeError("Failed to fetch dynamically imported module")));
    });
    expect(root.firstChild).toBe(originalArticle);
    expect(screen.getByRole("heading", { name: "Готовая статья" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось включить все функции страницы");
    expect(screen.getByRole("button", { name: "Обновить страницу" })).toBeInTheDocument();
  });

  it("shows a full recovery screen when no prerendered HTML is available", async () => {
    root.replaceChildren();
    await act(async () => {
      mounted = await bootstrapApplication(root, () => Promise.reject(new Error("Network error")));
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось открыть страницу");
  });
});
