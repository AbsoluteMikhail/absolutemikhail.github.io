import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HeroSection from "@/components/HeroSection";
import GamesSection from "@/components/GamesSection";
import ItchProjectsSection from "@/components/ItchProjectsSection";
import ProofSection from "@/components/ProofSection";

// A different count catches consumers that still copy the current number.
vi.mock("@/constants/portfolioStats", () => ({
  gameProjectCount: 23,
  gameProjectCountLabel: "игровых проекта",
  projectCountLabel: "проекта",
}));

describe("shared portfolio statistics", () => {
  it.each([
    ["hero", HeroSection, "23 игровых проекта"],
    ["archive introduction", GamesSection, "23 игровых проекта"],
    ["catalogue", ItchProjectsSection, "23игровых проекта"],
    ["achievements", ProofSection, "23 проекта"],
  ] as const)("updates %s from the shared source", (_name, Section, expected) => {
    const { container } = render(<MemoryRouter><Section /></MemoryRouter>);
    expect(container).toHaveTextContent(expected);
    expect(container).not.toHaveTextContent(/\b(?:20|21)\s*(?:игров\S*\s+)?проект/);
  });
});
