import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { AppContent } from "@/App";
import Legal from "@/pages/Legal";
import { render as renderPage, prerenderPaths } from "@/entry-server";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

afterEach(cleanup);

describe("English legal documents", () => {
  it.each([["privacy", "Privacy Policy"], ["terms", "Terms of Use"]])("prerenders the complete %s document in English", async (kind, title) => {
    expect(prerenderPaths).toContain(`/en/${kind}`);
    const html = await renderPage(`/en/${kind}/`);
    const document = new DOMParser().parseFromString(html, "text/html");
    expect(document.querySelector("h1")?.textContent).toBe(title);
    expect(document.querySelectorAll("article section")).toHaveLength(5);
    expect(document.body.textContent).not.toMatch(/[А-Яа-яЁё]/);
    expect(document.querySelector('a[href="/en/"]')).not.toBeNull();
    expect(document.querySelector('footer a[href="/en/privacy/"]')).not.toBeNull();
    expect(document.querySelector('footer a[href="/en/terms/"]')).not.toBeNull();
    const metadata = await resolvePageMetadata(`/en/${kind}/`);
    expect(metadata.language).toBe("en");
    expect(metadata.robots).toBe("noindex, follow");
    expect(metadata.title).toContain(title);
    expect(metadata.alternates).toEqual((await resolvePageMetadata(`/${kind}/`)).alternates);
  });

  it("keeps the language switch on the same document and section", () => {
    const view = render(<MemoryRouter initialEntries={["/en/terms/#educational-code"]}><Legal /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Русский" })).toHaveAttribute("href", "/terms/#educational-code");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "0BSD license" })).toHaveAttribute("href", "/academy-code-license.txt");
    view.unmount();
    render(<MemoryRouter initialEntries={["/terms/#educational-code"]}><Legal /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/terms/#educational-code");
  });

  it("translates the old English-origin links too", () => {
    render(<MemoryRouter initialEntries={["/privacy/?from=en"]}><Legal /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Privacy Policy");
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/en/terms/");
  });

  it("opens English contacts and analytics settings from the document", () => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value() { this.setAttribute("open", ""); } });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value() { this.removeAttribute("open"); } });
    render(<MemoryRouter initialEntries={["/en/privacy/"]}><AppContent InitialPage={Legal} initialRoute="legal" /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Contact about the website and your data" }));
    expect(within(screen.getByRole("dialog")).getByRole("heading")).toHaveTextContent("How would you like to get in touch?");
    fireEvent.click(screen.getByRole("button", { name: "Close contact options" }));
    fireEvent.click(screen.getByRole("button", { name: "change your analytics settings" }));
    const dialog = screen.getByRole("dialog", { name: "Analytics settings" });
    expect(within(dialog).getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/en/privacy/");
  });
});
