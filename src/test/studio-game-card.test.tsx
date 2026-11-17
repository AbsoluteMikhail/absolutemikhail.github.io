import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StudioGameCard from "@/components/StudioGameCard";
import { projects } from "@/constants/projects";

const project = projects.find(project => project.slug === "duelant")!;
const mount = (locale: "ru" | "en" = "en") => render(<MemoryRouter><StudioGameCard project={project} index={0} locale={locale} /></MemoryRouter>);

beforeEach(() => {
  const matchMedia = window.matchMedia;
  vi.spyOn(window, "matchMedia").mockImplementation(query => ({ ...matchMedia(query), matches: true }));
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("studio game cards", () => {
  it("loads previews only on hover and autoplays the full video on opening", () => {
    const { container } = mount();
    const trigger = screen.getByRole("link", { name: "Explore game: DUELANT" });
    const preview = container.querySelector("video")!;
    expect(preview).not.toHaveAttribute("src");
    expect(container.querySelector("iframe")).toBeNull();
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    expect(preview).toHaveAttribute("src", project.previewUrl);
    fireEvent.playing(preview);
    expect(preview).toHaveClass("opacity-100");
    fireEvent.click(trigger);
    expect(preview).not.toHaveClass("opacity-100");
    const dialog = screen.getByRole("dialog", { name: "DUELANT" });
    expect(dialog.querySelector("video")).toBeNull();
    const player = dialog.querySelector("iframe")!;
    expect(player).toHaveAttribute("src", `${project.videoUrl}?autoplay=true`);
    expect(player).toHaveAttribute("allow", "autoplay; fullscreen");
    expect(player).not.toHaveAttribute("src", project.previewUrl);
    expect(player).toHaveAttribute("allowfullscreen");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close project" }));
    expect(player).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it.each(["ru", "en"] as const)("offers canonical store links and closes on Escape or backdrop in %s", locale => {
    mount(locale);
    const trigger = screen.getByRole("link");
    fireEvent.click(trigger);
    let dialog = screen.getByRole("dialog");
    for (const store of project.storeLinks!) expect(within(dialog).getByRole("link", { name: store.label })).toHaveAttribute("href", store.url);
    expect(dialog).toHaveTextContent(locale === "en" ? "High-stakes duels" : project.shortDesc);
    fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(trigger);
    dialog = screen.getByRole("dialog");
    const backdropPress = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    fireEvent(dialog, backdropPress);
    expect(backdropPress.defaultPrevented).toBe(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps modifier-click navigation and a direct full-video link", () => {
    mount();
    const trigger = screen.getByRole("link");
    let intercepted = true;
    document.addEventListener("click", event => {
      intercepted = event.defaultPrevented;
      event.preventDefault(); // JSDOM cannot open a new tab.
    }, { once: true });
    fireEvent.click(trigger, { ctrlKey: true });
    expect(intercepted).toBe(false);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveAttribute("href", "/projects/duelant/");
    fireEvent.click(trigger);
    expect(screen.getByRole("link", { name: "Open video separately" })).toHaveAttribute("href", project.videoUrl);
    expect(screen.getByRole("link", { name: "Project page (in Russian)" })).toHaveAttribute("href", "/projects/duelant/");

  });
  it("uses the full GRIBNIK video and resets the player on reopening", () => {
    const game = projects.find(project => project.slug === "gribnik")!;
    render(<MemoryRouter><StudioGameCard project={game} index={1} locale="ru" /></MemoryRouter>);
    const trigger = screen.getByRole("link");
    fireEvent.click(trigger);
    const firstPlayer = screen.getByRole("dialog").querySelector("iframe");
    expect(firstPlayer).toHaveAttribute("src", `${game.videoUrl}?autoplay=true`);
    fireEvent.click(screen.getByRole("button", { name: "Закрыть проект" }));
    fireEvent.click(trigger);
    expect(firstPlayer).not.toBeInTheDocument();
    expect(screen.getByRole("dialog").querySelector("iframe")).toHaveAttribute("src", `${game.videoUrl}?autoplay=true`);
  });

  it("preserves existing player options when enabling autoplay", () => {
    const videoUrl = `${project.videoUrl}?skinColor=d4ff39&autoplay=false`;
    render(<MemoryRouter><StudioGameCard project={{ ...project, videoUrl }} index={0} locale="en" /></MemoryRouter>);
    fireEvent.click(screen.getByRole("link"));
    const url = new URL(screen.getByRole("dialog").querySelector("iframe")!.src);
    expect(url.searchParams.get("skinColor")).toBe("d4ff39");
    expect(url.searchParams.getAll("autoplay")).toEqual(["true"]);
  });

});
