import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";
import { ContactMessenger } from "@/components/ContactMessenger";
import { startAnalytics, stopAnalytics, trackAnalytics } from "@/lib/analytics";
import { PRIVACY_KEY, PRIVACY_MAX_AGE, saveAnalyticsChoice } from "@/lib/privacyPreferences";

const google = vi.fn();
const yandex = vi.fn();
const target = window as Window & { gtag?: typeof google; ym?: typeof yandex };
beforeEach(() => {
  stopAnalytics(); localStorage.clear(); window.history.replaceState(null, "", "/");
  google.mockReset(); yandex.mockReset(); target.gtag = google; target.ym = yandex;
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
});
afterEach(() => { cleanup(); stopAnalytics(); localStorage.clear(); vi.restoreAllMocks(); });
const approve = () => { saveAnalyticsChoice("accepted"); startAnalytics(); google.mockClear(); yandex.mockClear(); };

describe("studio analytics events", () => {
  it("sends nothing before consent, after refusal, expiry, withdrawal or on excluded pages", () => {
    trackAnalytics("contact_open");
    saveAnalyticsChoice("rejected"); startAnalytics(); trackAnalytics("contact_open");
    expect(google).not.toHaveBeenCalled(); expect(yandex).not.toHaveBeenCalled();
    approve();
    localStorage.setItem(PRIVACY_KEY, JSON.stringify({ version: 1, choice: "accepted", savedAt: Date.now() - PRIVACY_MAX_AGE }));
    trackAnalytics("contact_open");
    saveAnalyticsChoice("accepted"); window.history.replaceState(null, "", "/malena/privacy/");
    trackAnalytics("contact_open");
    expect(google).not.toHaveBeenCalled(); expect(yandex).not.toHaveBeenCalled();
    window.history.replaceState(null, "", "/"); stopAnalytics(); google.mockClear(); yandex.mockClear();
    trackAnalytics("contact_open");
    expect(google).not.toHaveBeenCalled(); expect(yandex).not.toHaveBeenCalled();
  });

  it("sends the same event to both counters with language and path, without query or fragment", () => {
    approve(); window.history.replaceState(null, "", "/en/?email=private#studio");
    trackAnalytics("project_open", { project_id: "duelant", placement: "project_card" });
    const payload = { project_id: "duelant", placement: "project_card", page_path: "/en/", site_language: "en" };
    expect(google).toHaveBeenCalledExactlyOnceWith("event", "project_open", payload);
    expect(yandex).toHaveBeenCalledExactlyOnceWith(110478218, "reachGoal", "project_open", payload);
  });

  it("does not replay actions performed before approval and tolerates counter failures", () => {
    trackAnalytics("contact_open"); approve();
    expect(google).not.toHaveBeenCalled();
    google.mockImplementation(() => { throw new Error("blocked"); });
    expect(() => trackAnalytics("contact_open")).not.toThrow(); expect(yandex).toHaveBeenCalledOnce();
    yandex.mockImplementation(() => { throw new Error("blocked"); });
    google.mockReset();
    expect(() => trackAnalytics("contact_open")).not.toThrow(); expect(google).toHaveBeenCalledOnce();
    yandex.mockReset();
  });

  it("distinguishes the two studio contact buttons and counts opening Malena’s gallery", () => {
    approve(); render(<MemoryRouter><Index /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Связаться" }));
    expect(google).toHaveBeenLastCalledWith("event", "contact_open", expect.objectContaining({ placement: "header" }));
    fireEvent.click(screen.getByRole("button", { name: "Закрыть окно связи" }));
    fireEvent.click(screen.getByRole("button", { name: "Написать нам" }));
    expect(google).toHaveBeenLastCalledWith("event", "contact_open", expect.objectContaining({ placement: "contact" }));
    fireEvent.click(screen.getByRole("button", { name: "Закрыть окно связи" }));
    fireEvent.click(screen.getByRole("link", { name: "Открыть карточку Малены" }));
    expect(google).toHaveBeenLastCalledWith("event", "project_open", expect.objectContaining({ project_id: "malena" }));
    expect(screen.getByRole("dialog", { name: "Малена" })).toBeInTheDocument();
  });

  it("tracks the selected channel without exposing the address or message", () => {
    approve(); const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(<ContactMessenger analyticsPlacement="contact" message="Private request" />);
    fireEvent.click(screen.getByRole("button", { name: "Связаться" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: /Написать в Telegram/ }));
    expect(google).toHaveBeenLastCalledWith("event", "contact_select", { placement: "contact", contact_method: "telegram", page_path: "/", site_language: "ru" });
    expect(open).toHaveBeenCalledOnce(); expect(screen.queryByRole("dialog")).toBeNull();
  });
});
