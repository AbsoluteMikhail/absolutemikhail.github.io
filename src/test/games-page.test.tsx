import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Games from "@/pages/Games";
import { gamepunkGames } from "@/constants/projects";
import { gamepunkLinks } from "@/constants/contactLinks";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

describe("games showcase", () => {
  it("shows the studio games and store links while keeping the personal portfolio separate", () => {
    render(<MemoryRouter initialEntries={["/games/"]}><Games /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: "Игры студии GamePunk" })).toBeInTheDocument();
    expect(screen.queryByRole("article", { name: "Dixotomia" })).not.toBeInTheDocument();
    expect(gamepunkGames.map((project) => project.slug)).toEqual([
      "duelant", "gribnik", "kolobok-protiv-yascherov", "star-nomad",
    ]);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    for (const project of gamepunkGames) {
      const card = screen.getByRole("article", { name: project.title });
      expect(within(card).getByRole("heading", { level: 2 })).toHaveTextContent(project.title);
      expect(within(card).getByRole("link", { name: `Об игре ${project.title}` })).toHaveAttribute("href", `/projects/${project.slug}/`);
      for (const url of project.storeLinks?.map((link) => link.url) ?? [project.storeUrl]) {
        expect(card.querySelector(`a[href="${url}"]`)).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
    expect(screen.getByRole("link", { name: "Портфолио разработчика" })).toHaveAttribute("href", "/projects/");
    expect(screen.getByRole("link", { name: "Игры" })).toHaveAttribute("href", "/#games");
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("loading", "eager");
    expect(screen.getByRole("link", { name: "Наши игры" })).toHaveAttribute("href", "#studio-games");
    expect(document.getElementById("studio-games")).toBeInTheDocument();
    const contacts = screen.getByRole("region", { name: "Будем на связи" });
    expect(within(contacts).getByRole("button", { name: "Написать нам" })).toBeInTheDocument();
    for (const [name, url] of [["YouTube", gamepunkLinks.youtube], ["X", gamepunkLinks.x], ["LinkedIn", gamepunkLinks.linkedin], ["Steam", gamepunkLinks.steam]]) {
      expect(within(contacts).getByRole("link", { name })).toHaveAttribute("href", url);
    }
    for (const slug of ["gribnik", "kolobok-protiv-yascherov", "star-nomad"]) {
      const project = gamepunkGames.find((game) => game.slug === slug)!;
      const card = screen.getByRole("article", { name: project.title });
      expect(within(card).getByRole("link", { name: `${project.title} — VK Play (новая вкладка)` })).toHaveTextContent("VK Play");
    }
  });

  it("keeps the game descriptions readable in HTML and the route indexable", async () => {
    const html = renderToString(<MemoryRouter><Games /></MemoryRouter>);
    for (const project of gamepunkGames) {
      expect(html).toContain(project.shortDesc);
    }
    const document = new DOMParser().parseFromString(html, "text/html");
    expect(document.querySelectorAll("video")).toHaveLength(4);
    expect(document.querySelector("video[src], video source")).toBeNull();
    expect(await resolvePageMetadata("/games/")).toMatchObject({
      title: "Игры студии GamePunk",
      robots: "index, follow",
    });
  });
});
