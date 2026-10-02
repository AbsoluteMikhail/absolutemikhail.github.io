import { afterEach, describe, expect, it, vi } from "vitest";
import { findAppRoute, loadInitialPage } from "@/lib/appRoutes";
import * as academyLoader from "@/lib/academyContent";

afterEach(() => vi.restoreAllMocks());

describe("shared application routes", () => {
  it.each([
    ["/", "home"],
    ["/projects", "projects"],
    ["/projects/", "projects"],
    ["/projects/duelant/", "project"],
    ["/snippet/", "snippet"],
    ["/privacy/", "legal"],
    ["/terms/", "legal"],
    ["/malena/privacy/", "malenaPrivacy"],
    ["/academy", "academy"],
    ["/academy/ai-intro/01-first-steps/", "academy"],
    ["/music/", "music"],
    ["/twitch/", "twitch"],
    ["/missing", "notFound"],
    ["/projects/duelant/extra", "notFound"],
    ["/academy-extra", "notFound"],
  ])("matches %s to %s for both initial loading and navigation", (path, id) => {
    expect(findAppRoute(path)?.id).toBe(id);
  });

  it("preloads only the selected Academy material before returning its page", async () => {
    const preload = vi.spyOn(academyLoader, "preloadAcademyPage").mockResolvedValue();
    const page = await loadInitialPage("/academy/ai-intro/01-first-steps/");
    expect(page.initialRoute).toBe("academy");
    expect(page.InitialPage).toBeTypeOf("function");
    expect(preload).toHaveBeenCalledExactlyOnceWith("/academy/ai-intro/01-first-steps/");
  });

  it("fails SSR on a broken article chunk and lets the client reader offer recovery", async () => {
    vi.spyOn(academyLoader, "preloadAcademyPage").mockRejectedValue(new Error("Article chunk failed"));
    await expect(loadInitialPage("/academy/ai-intro")).rejects.toThrow("Article chunk failed");
    await expect(loadInitialPage("/academy/ai-intro", { tolerateAcademyContentError: true }))
      .resolves.toMatchObject({ initialRoute: "academy" });
  });

  it("loads a direct Malena or unknown URL without preloading Academy", async () => {
    const preload = vi.spyOn(academyLoader, "preloadAcademyPage");
    expect((await loadInitialPage("/malena/privacy/")).initialRoute).toBe("malenaPrivacy");
    expect((await loadInitialPage("/missing/")).initialRoute).toBe("notFound");
    expect(preload).not.toHaveBeenCalled();
  });
});
