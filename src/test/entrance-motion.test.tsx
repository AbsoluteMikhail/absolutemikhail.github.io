import { act, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EntranceDiv } from "@/components/ui/entrance-motion";

const Example = () => (
  <EntranceDiv
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1 }}
  >
    Содержание раздела
  </EntranceDiv>
);

afterEach(() => vi.restoreAllMocks());

const mockPreference = (preference: string, initial = true) => {
  const original = window.matchMedia;
  const listeners = new Set<() => void>();
  let enabled = initial;
  vi.spyOn(window, "matchMedia").mockImplementation((query): MediaQueryList => ({
    ...original(query),
    matches: enabled && query.includes(preference),
    addEventListener: (_event: string, listener: EventListenerOrEventListenerObject | null) => {
      if (typeof listener === "function") listeners.add(listener as () => void);
    },
    removeEventListener: (_event: string, listener: EventListenerOrEventListenerObject | null) => {
      if (typeof listener === "function") listeners.delete(listener as () => void);
    },
  }));
  return (next: boolean) => {
    enabled = next;
    listeners.forEach((listener) => listener());
  };
};

describe("content entrance policy", () => {
  it.each(["max-width: 767px", "hover: none", "prefers-reduced-motion: reduce"])(
    "shows offscreen content immediately for %s",
    (preference) => {
      mockPreference(preference);
      render(<Example />);
      expect(screen.getByText("Содержание раздела")).toHaveStyle({ opacity: "1", transform: "none" });
    },
  );

  it("preserves the desktop entrance until the section enters the viewport", () => {
    render(<Example />);
    expect(screen.getByText("Содержание раздела")).toHaveStyle({ opacity: "0" });
  });

  it("reveals a waiting section when reduced motion is enabled without reloading", async () => {
    const update = mockPreference("prefers-reduced-motion: reduce", false);
    render(<Example />);
    expect(screen.getByText("Содержание раздела")).toHaveStyle({ opacity: "0" });
    act(() => update(true));
    await waitFor(() => {
      expect(screen.getByText("Содержание раздела")).toHaveStyle({ opacity: "1", transform: "none" });
    });
  });

  it("renders visible content on the server", () => {
    const html = renderToString(<Example />);
    expect(html).toContain("Содержание раздела");
    expect(html).toContain("opacity:1");
    expect(html).not.toContain("opacity:0");
  });
});
