import { act, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AcademyContent } from "@/lib/academyContent";
import Academy from "@/pages/Academy";

const content = vi.hoisted(() => ({
  peek: vi.fn(),
  load: vi.fn<(path: string) => Promise<AcademyContent>>(),
}));
vi.mock("@/lib/academyContent", () => ({ academyContent: content }));

const firstPath = "/academy/ue-cpp-blueprint-devs/01-ue-cpp-environment";
const secondPath = "/academy/ue-cpp-blueprint-devs/02-unreal-codegen";

beforeEach(() => {
  content.peek.mockReset();
  content.load.mockReset();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("asynchronous Academy reader", () => {
  it("never replaces the current lesson with an older download that finishes late", async () => {
    let finishFirst!: (value: AcademyContent) => void;
    content.load.mockImplementation((path) => path.endsWith("01-ue-cpp-environment.md")
      ? new Promise((resolve) => { finishFirst = resolve; })
      : Promise.resolve({ body: "Текст нового урока", headings: [] }));
    render(<MemoryRouter initialEntries={[firstPath]}>
      <Link to={secondPath}>Открыть другой урок</Link><Academy />
    </MemoryRouter>);
    expect(screen.getByRole("status")).toHaveTextContent("Загрузка материала");
    fireEvent.click(screen.getByRole("link", { name: "Открыть другой урок" }));
    expect(await screen.findByText("Текст нового урока")).toBeInTheDocument();
    await act(async () => finishFirst({ body: "Текст старого урока", headings: [] }));
    expect(screen.queryByText("Текст старого урока")).not.toBeInTheDocument();
  });

  it("lets the visitor retry a failed article without reloading the whole site", async () => {
    content.load.mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValue({ body: "Восстановленный материал", headings: [] });
    render(<MemoryRouter initialEntries={[firstPath]}><Academy /></MemoryRouter>);
    expect(await screen.findByRole("alert")).toHaveTextContent("Не удалось загрузить материал");
    fireEvent.click(screen.getByRole("button", { name: "Повторить загрузку" }));
    expect(await screen.findByText("Восстановленный материал")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
