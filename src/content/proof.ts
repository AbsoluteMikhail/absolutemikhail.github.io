import { gameProjectCount, projectCountLabel } from "@/constants/portfolioStats";

export type ProofIcon = "experience" | "award" | "instructor" | "projects";

export interface ProofItem {
  icon: ProofIcon;
  value: string;
  label: string;
  linkLabel: string;
  href: string;
}

export const profileExperience = { unrealYears: 11, commercialYears: 6 };

export const proofItems: ProofItem[] = [
  {
    icon: "experience",
    value: `${profileExperience.unrealYears} лет`,
    label: `в экосистеме Unreal Engine;\n${profileExperience.commercialYears}+ лет — в коммерческой разработке`,
    linkLabel: "Работа в командах",
    href: "#production",
  },
  {
    icon: "instructor",
    value: "UAI 2026",
    label: "Unreal Authorized Instructor и автор образовательных программ",
    linkLabel: "Об обучении",
    href: "#mentoring",
  },
  {
    icon: "award",
    value: "1-е место",
    label: "соло-победа и главный приз офлайн-хакатона «Синеус»",
    linkLabel: "История победы",
    href: "https://skillbox.ru/media/gamedev/story-mihail-efremov/",
  },
  {
    icon: "projects",
    value: `${gameProjectCount} ${projectCountLabel}`,
    label: "публичные релизы, джемы и игровые прототипы",
    linkLabel: "Посмотреть игры",
    href: "/projects",
  },
];
