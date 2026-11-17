import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StudioGameCard from "@/components/StudioGameCard";
import { projects } from "@/constants/projects";
import { trackAnalytics } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackAnalytics: vi.fn() }));
const project = projects.find(p => p.slug === "duelant")!;
const mount = () => render(<MemoryRouter><StudioGameCard project={project} index={0} locale="en" /></MemoryRouter>);
const open = () => { fireEvent.click(screen.getByRole("link", { name: "Explore game: DUELANT" })); return screen.getByTitle("Game video: DUELANT") as HTMLIFrameElement; };
const send = (player: HTMLIFrameElement, type: string, data: unknown, origin = "https://rutube.ru") => fireEvent(window, new MessageEvent("message", { origin, source: player.contentWindow, data: JSON.stringify({ type, data }) }));
beforeEach(() => {
  vi.mocked(trackAnalytics).mockClear();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("full trailer analytics", () => {
  it("separates project opening from playback and deduplicates milestones across pause, seeking and replay", () => {
    mount(); const player = open();
    expect(trackAnalytics).toHaveBeenCalledExactlyOnceWith("project_open", { project_id: "duelant", placement: "project_card" });
    send(player, "player:ready", {}); send(player, "player:currentTime", { currentTime: 0 });
    expect(trackAnalytics).toHaveBeenCalledTimes(1);
    send(player, "player:durationChange", { duration: 100 });
    for (const currentTime of [1, 26, 26, 52, 12, 78, 99]) send(player, "player:currentTime", { currentTime });
    send(player, "player:playComplete", {}); send(player, "player:playComplete", {});
    expect(vi.mocked(trackAnalytics).mock.calls.map(([name, p]) => [name, p?.video_percent])).toEqual([
      ["project_open", undefined], ["video_start", undefined], ["video_progress", 25], ["video_progress", 50], ["video_progress", 75], ["video_complete", 100],
    ]);
  });

  it("ignores spoofed, malformed and invalid messages", () => {
    mount(); const player = open(); vi.mocked(trackAnalytics).mockClear();
    send(player, "player:currentTime", { currentTime: 4 }, "https://rutube.ru.evil.example");
    fireEvent(window, new MessageEvent("message", { origin: "https://rutube.ru", source: window, data: JSON.stringify({ type: "player:currentTime", data: { currentTime: 4 } }) }));
    for (const data of ["{", "null", "[]", JSON.stringify({ type: "player:currentTime", data: null })]) fireEvent(window, new MessageEvent("message", { origin: "https://rutube.ru", source: player.contentWindow, data }));
    for (const currentTime of [-1, "5", null]) send(player, "player:currentTime", { currentTime });
    send(player, "player:playComplete", {});
    expect(trackAnalytics).not.toHaveBeenCalled();
    send(player, "player:currentTime", { time: 3 });
    expect(trackAnalytics).toHaveBeenCalledExactlyOnceWith("video_start", { project_id: "duelant" });
  });

  it("removes the listener on close and starts a fresh measurement on reopening", () => {
    const view = mount(); const first = open();
    send(first, "player:currentTime", { currentTime: 2 });
    const source = first.contentWindow;
    fireEvent.click(screen.getByRole("button", { name: "Close project" }));
    vi.mocked(trackAnalytics).mockClear();
    fireEvent(window, new MessageEvent("message", { origin: "https://rutube.ru", source, data: JSON.stringify({ type: "player:currentTime", data: { currentTime: 5 } }) }));
    expect(trackAnalytics).not.toHaveBeenCalled();
    const second = open(); send(second, "player:currentTime", { currentTime: 1 });
    expect(trackAnalytics).toHaveBeenCalledTimes(2);
    view.unmount();
  });
});
