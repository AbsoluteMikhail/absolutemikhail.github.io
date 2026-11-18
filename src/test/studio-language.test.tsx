import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";
import { PageLoadError } from "@/components/PageLoadError";
import { render as renderPage, prerenderPaths } from "@/entry-server";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

describe("studio languages", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });
  it("switches both ways while preserving the current section and query", () => {
    render(<MemoryRouter initialEntries={["/?ref=studio#projects"]}><Index /></MemoryRouter>);
    const english = screen.getAllByRole("link", { name: "English" });
    expect(english).toHaveLength(2);
    expect(english[0]).toHaveAttribute("href", "/en/?ref=studio#projects");
    fireEvent.click(english[0]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("WE MAKE GAMES WITH ATTITUDE");
    const russian = screen.getAllByRole("link", { name: "Русский" });
    expect(russian[1]).toHaveAttribute("href", "/?ref=studio#projects");
    fireEvent.click(russian[1]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ДЕЛАЕМ ИГРЫ С ХАРАКТЕРОМ");
  });

  it("translates contact options without changing their reveal mechanism", async () => {
    const { container } = render(<MemoryRouter initialEntries={["/en/"]}><Index /></MemoryRouter>);
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Contact" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading")).toHaveTextContent("How would you like to get in touch?");
    await waitFor(() => expect(within(dialog).getByRole("button", { name: /Message on Telegram/ })).toBeVisible());
    expect(within(dialog).getByRole("button", { name: /Send an email/ })).toBeVisible();
    fireEvent.click(within(dialog).getByRole("button", { name: "Close contact options" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it.each([["/", "Малена", "Рождённая помнить", "Следующий портрет"], ["/en/", "Malena", "Born to Remember", "Next portrait"]])("opens Malena's gallery from %s and resets it on reopening", (path, title, album, next) => {
    const { container } = render(<MemoryRouter initialEntries={[path]}><Index /></MemoryRouter>);
    const trigger = container.querySelector<HTMLAnchorElement>(".studio-project-3")!;
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: title });
    expect(dialog).toHaveTextContent(album);
    expect(within(dialog).getByRole("link")).toHaveAttribute("href", trigger.href);
    fireEvent.click(within(dialog).getByRole("button", { name: next }));
    expect(within(dialog).getByRole("status")).toHaveTextContent("2 / 6");
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(trigger);
    expect(within(screen.getByRole("dialog", { name: title })).getByRole("status")).toHaveTextContent("1 / 6");
  });

  it("keeps untranslated destinations explicit and does not invent English archive routes", () => {
    render(<MemoryRouter initialEntries={["/en/"]}><Index /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Academy (in Russian)" })).toHaveAttribute("href", "/academy/");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/en/privacy/");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/en/terms/");
    expect(screen.getByRole("link", { name: "More (in Russian)" })).toHaveAttribute("href", "/mikhail/");
    fireEvent.click(screen.getByRole("link", { name: "Explore game: DUELANT" }));
    expect(screen.getByRole("link", { name: "Project page (in Russian)" })).toHaveAttribute("href", "/projects/duelant/");
  });

  it("offers English recovery controls if the studio fails to load", () => {
    const previousUrl = window.location.href;
    window.history.replaceState(null, "", "/en/");
    try {
      render(<PageLoadError compact />);
      expect(screen.getByRole("alert")).toHaveTextContent("Some page features could not load");
      expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/en/");
      expect(screen.getByRole("button", { name: "Reload page" })).toBeVisible();
    } finally {
      window.history.replaceState(null, "", previousUrl);
    }
  });

  it("prerenders English content and consent before JavaScript", async () => {
    expect(prerenderPaths).toContain("/en");
    const html = await renderPage("/en/");
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(Array.from(doc.querySelectorAll("h1 .studio-title-line"), line => line.textContent)).toEqual(["WE MAKE", "GAMES", "WITH ATTITUDE"]);
    expect(html).toContain("Without analytics");
    expect(html).toContain("PSX-style horror");
    expect(html).not.toContain("Настройки аналитики");
    expect(new DOMParser().parseFromString(html, "text/html").body.textContent).not.toMatch(/[А-Яа-яЁё]/);
    const metadata = await resolvePageMetadata("/en/");
    expect(metadata.language).toBe("en");
    expect(metadata.alternates).toEqual((await resolvePageMetadata("/")).alternates);
    expect(metadata.structuredData?.url).toBe("https://gamepunk.ru/en/");
    expect((await resolvePageMetadata("/academy/")).alternates).toBeUndefined();
  });
});
