export type ProofIcon = "experience" | "award" | "course" | "projects";

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
    value: "6+ лет",
    label: "разработки игр и интерактивных систем на Unreal Engine",
    linkLabel: "Как всё начиналось",
    href: "https://skillbox.ru/media/gamedev/story-mihail-efremov/",
  },
  {
    icon: "award",
    value: "4 игровые награды",
    label: "Победы на хакатонах и участие в VFX фильма «Воздух», получившего «Золотой орёл»",
    linkLabel: "Смотреть достижения",
    href: "#timeline",
  },
  {
    icon: "course",
    value: "Автор курса",
    label: "«Разработчик игр на Unreal Engine 5 с нуля»",
    linkLabel: "Подробнее о программе",
    href: "https://l.skbx.pro/4TR7gF",
  },
  {
    icon: "projects",
    value: "12+ проектов",
    label: "публичные релизы, джемы и игровые прототипы",
    linkLabel: "Открыть портфолио",
    href: "/projects",
  },
];
