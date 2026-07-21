export type ProofIcon = "experience" | "award" | "instructor" | "projects";

export interface ProofItem {
  icon: ProofIcon;
  value: string;
  label: string;
  linkLabel: string;
  href: string;
}

export const proofItems: ProofItem[] = [
  {
    icon: "experience",
    value: "11 лет",
    label: "в экосистеме Unreal Engine;\n6+ лет — в коммерческой разработке",
    linkLabel: "Production-опыт",
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
    value: "20 проектов",
    label: "публичные релизы, джемы и игровые прототипы",
    linkLabel: "Открыть портфолио",
    href: "/projects",
  },
];
