import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import RouteMetadata from "@/components/RouteMetadata";
import { canonicalUrl, defaultSocialImage, getPageStructuredData } from "@/constants/routeMetadata.js";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

describe("client route metadata", () => {
  let initialHead: string;
  beforeEach(() => {
    initialHead = document.head.innerHTML;
    document.head.innerHTML = '<link rel="canonical" href="https://gamepunk.ru/"><script id="structured-data" type="application/ld+json">{}</script>';
  });
  afterEach(() => { document.head.innerHTML = initialHead; });

  it("updates prerendered JSON-LD and social images on navigation and removes stale breadcrumbs", async () => {
    const paths = [
      "/projects/duelant/",
      "/games/",
      "/academy/ai-intro/01-first-steps/",
      "/academy/topics/tools/",
      "/academy/",
      "/malena/privacy/",
      "/",
      "/en/",
      "/en/privacy/",
      "/en/terms/",
      "/privacy/",
      "/mikhail/",
      "/projects/not-a-game/",
    ];
    render(<MemoryRouter initialEntries={[paths[0]]}>
      <RouteMetadata />
      {paths.map((path) => <Link key={path} to={path}>{path}</Link>)}
    </MemoryRouter>);

    for (const path of paths) {
      fireEvent.click(screen.getByRole("link", { name: path }));
      const metadata = await resolvePageMetadata(path);
      const data = getPageStructuredData(metadata);
      await waitFor(() => {
        expect(document.title).toBe(metadata.title);
        expect(document.documentElement.lang).toBe(metadata.language ?? "ru");
        const alternates = [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')];
        expect(alternates.map(link => [link.hreflang, link.href])).toEqual((metadata.alternates ?? []).map(link => [link.language, canonicalUrl(link.pathname)]));
        expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", canonicalUrl(path));
        expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", metadata.robots);
        expect(document.head.querySelector('meta[property="og:site_name"]')).toHaveAttribute("content", metadata.siteName ?? (metadata.alternates ? "GamePunk" : "Absolute Mikhail"));
        const scripts = document.head.querySelectorAll("#structured-data");
        expect(scripts).toHaveLength(data ? 1 : 0);
        if (data) expect(JSON.parse(scripts[0].textContent!)).toEqual(data);
        const image = document.head.querySelector('meta[property="og:image"]')?.getAttribute("content");
        expect(image).toBe(metadata.image ? `https://gamepunk.ru${metadata.image}` : defaultSocialImage.url);
        expect(document.head.querySelector('meta[name="twitter:image"]')).toHaveAttribute("content", image);
      });
    }
  });
});
