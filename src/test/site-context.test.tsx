import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { contextHome, isStudioContext, legalHref, siteContext } from "@/lib/siteContext";
import Legal from "@/pages/Legal";
import LegalLinks from "@/components/LegalLinks";
import PrivacyControls from "@/components/PrivacyControls";
import { ContactMessenger } from "@/components/ContactMessenger";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("legal and dialog appearance", () => {
  it.each([
    ["/", "", "studio", "/"], ["/en/", "", "en", "/en/"],
    ["/mikhail/", "", "mikhail", "/mikhail/"], ["/academy/course/lesson", "", "academy", "/academy/"],
    ["/privacy/", "?from=academy", "academy", "/academy/"], ["/terms/", "?from=mikhail", "mikhail", "/mikhail/"],
    ["/en/privacy/", "", "en", "/en/"], ["/en/terms/", "?from=academy", "en", "/en/"],
    ["/terms/", "?from=en", "en", "/en/"], ["/privacy/", "?from=https://evil.example", "studio", "/"],
  ])("resolves %s%s without storing navigation history", (path, search, context, home) => {
    const result = siteContext(path, search);
    expect(result).toBe(context); expect(contextHome(result)).toBe(home);
    expect(legalHref("/privacy/", result)).toBe(context === "en" ? "/en/privacy/" : context === "studio" ? "/privacy/" : `/privacy/?from=${context}`);
  });

  it.each(["studio", "mikhail", "academy", "en"] as const)("preserves %s appearance across documents and reloadable links", context => {
    render(<MemoryRouter initialEntries={[legalHref("/terms/", context)]}><Legal /></MemoryRouter>);
    expect(screen.getByRole("link", { name: context === "en" ? "Back to home" : "На сайт" })).toHaveAttribute("href", contextHome(context));
    expect(screen.getByRole("heading", { level: 1 }).closest('.studio-legal') !== null).toBe(isStudioContext(context));
    expect(screen.getByRole("link", { name: context === "en" ? "privacy policy" : "политика конфиденциальности" })).toHaveAttribute("href", legalHref("/privacy/", context));
    expect(screen.getByRole("link", { name: context === "en" ? "Privacy Policy" : "Политика конфиденциальности" })).toHaveAttribute("href", legalHref("/privacy/", context));
  });

  it.each(["/mikhail/", "/academy/"])("keeps footer documents in the originating section %s", path => {
    render(<MemoryRouter initialEntries={[path]}><LegalLinks /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Политика конфиденциальности" })).toHaveAttribute("href", `/privacy/?from=${path.split('/')[1]}`);
  });

  it.each([true, false])("uses the requested contact appearance without changing dismissal (studio: %s)", studio => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
    render(<ContactMessenger studio={studio} />);
    fireEvent.click(screen.getByRole("button", { name: "Связаться" }));
    expect(screen.getByRole("dialog").classList.contains("studio-dialog")).toBe(studio);
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: true, cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it.each(["/", "/en/", "/privacy/?from=en", "/en/privacy/", "/en/terms/", "/mikhail/", "/academy/"])("themes analytics settings from the current route %s", path => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
    render(<MemoryRouter initialEntries={[path]}><LegalLinks /><PrivacyControls /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: path.includes("en") ? "Analytics settings" : "Настройки аналитики" }));
    const url = new URL(path, "https://gamepunk.ru");
    expect(screen.getByRole("dialog").classList.contains("studio-dialog")).toBe(isStudioContext(siteContext(url.pathname, url.search)));
  });
});
