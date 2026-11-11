import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GameCoverPreview from "@/components/GameCoverPreview";
import ProjectExhibit from "@/components/ProjectExhibit";
import ItchProjectsSection from "@/components/ItchProjectsSection";
import MentoredProjectsSection from "@/components/MentoredProjectsSection";
import { gamepunkGames } from "@/constants/projects";
import { itchProjects } from "@/constants/itchProjects";
import { mentoredProjects } from "@/constants/mentoredProjects";

const project = { ...gamepunkGames[0], previewUrl: "/preview.mp4" };
const renderPreview = () => {
  const result = render(<MemoryRouter><GameCoverPreview project={project} /></MemoryRouter>);
  return { link: screen.getByRole("link"), video: result.container.querySelector("video")! };
};

beforeEach(() => {
  const originalMatchMedia = window.matchMedia;
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({ ...originalMatchMedia(query), matches: true }));
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
});
afterEach(() => vi.restoreAllMocks());

describe("game cover video previews", () => {
  it("downloads only after hover, reveals actual playback and stops on leave", () => {
    const { link, video } = renderPreview();
    expect(video).not.toHaveAttribute("src");
    expect(video).toHaveAttribute("preload", "none");
    expect(video.muted).toBe(true);
    fireEvent.pointerEnter(link, { pointerType: "mouse" });
    expect(video).toHaveAttribute("src", project.previewUrl);
    expect(video.play).toHaveBeenCalledOnce();
    expect(video).not.toHaveClass("opacity-100");
    fireEvent.playing(video);
    expect(video).toHaveClass("opacity-100");
    fireEvent.pointerLeave(link);
    expect(video.pause).toHaveBeenCalled();
    expect(video).not.toHaveClass("opacity-100");
    fireEvent.playing(video);
    expect(video).not.toHaveClass("opacity-100");
  });

  it("also starts on keyboard focus and stops when focus or page visibility is lost", () => {
    const { link, video } = renderPreview();
    fireEvent.focus(link);
    fireEvent.playing(video);
    expect(video).toHaveClass("opacity-100");
    fireEvent.blur(link);
    expect(video).not.toHaveClass("opacity-100");
    fireEvent.focus(link);
    fireEvent.playing(video);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(video).not.toHaveClass("opacity-100");
  });

  it("keeps images for reduced motion and devices without precise hover", () => {
    vi.mocked(window.matchMedia).mockReturnValue({ ...window.matchMedia(""), matches: false });
    const { link, video } = renderPreview();
    fireEvent.pointerEnter(link);
    fireEvent.focus(link);
    expect(video).not.toHaveAttribute("src");
    expect(video.play).not.toHaveBeenCalled();
  });

  it("retains the cover on blocked playback and stops retrying a broken source", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new DOMException("Autoplay blocked", "NotAllowedError"));
    const { link, video } = renderPreview();
    await act(async () => fireEvent.focus(link));
    expect(video).not.toHaveClass("opacity-100");
    fireEvent.error(video);
    fireEvent.pointerLeave(link);
    fireEvent.pointerEnter(link);
    expect(video.play).toHaveBeenCalledOnce();
  });

  it("keeps only the current card playing", () => {
    const result = render(<MemoryRouter>
      <GameCoverPreview project={project} />
      <GameCoverPreview project={{ ...project, title: "Second game", slug: "second-game" }} />
    </MemoryRouter>);
    const links = screen.getAllByRole("link");
    const videos = result.container.querySelectorAll("video");
    fireEvent.focus(links[0]);
    fireEvent.playing(videos[0]);
    expect(videos[0]).toHaveClass("opacity-100");
    fireEvent.pointerEnter(links[1]);
    fireEvent.playing(videos[1]);
    expect(videos[0]).not.toHaveClass("opacity-100");
    expect(videos[1]).toHaveClass("opacity-100");
    expect(videos[0].pause).toHaveBeenCalled();
  });

  it("previews homepage cards through their overlay while preserving modal selection", () => {
    const select = vi.fn();
    const result = render(<MemoryRouter><ProjectExhibit project={project} onSelect={select} /></MemoryRouter>);
    const card = screen.getByRole("article");
    const video = result.container.querySelector("video")!;
    fireEvent.pointerEnter(card);
    expect(video.play).toHaveBeenCalledOnce();
    fireEvent.playing(video);
    expect(video).toHaveClass("opacity-100");
    fireEvent.click(screen.getByRole("button", { name: `Подробнее о проекте ${project.title}` }));
    expect(select).toHaveBeenCalledExactlyOnceWith(project);
  });

  it("previews jam cards while keeping mentored cards static and their external links intact", () => {
    const result = render(<MemoryRouter><ItchProjectsSection /><MentoredProjectsSection /></MemoryRouter>);
    for (const item of itchProjects.filter((game) => game.previewUrl)) {
      const card = result.container.querySelector<HTMLAnchorElement>(`a[href="${item.url}"]`)!;
      const video = card.querySelector("video")!;
      expect(card).toHaveAttribute("target", "_blank");
      expect(video).not.toHaveAttribute("src");
      fireEvent.pointerEnter(card);
      expect(video).toHaveAttribute("src", item.previewUrl);
      fireEvent.playing(video);
      expect(video).toHaveClass("opacity-100");
      fireEvent.pointerLeave(card);
      expect(video).not.toHaveClass("opacity-100");
    }
    for (const item of mentoredProjects) {
      const card = result.container.querySelector<HTMLAnchorElement>(`a[href="${item.url}"]`)!;
      expect(card).toHaveAttribute("target", "_blank");
      fireEvent.pointerEnter(card);
      fireEvent.focus(card);
      expect(card.querySelector("video")).toBeNull();
    }
  });
});
