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
    label: "разработки на Unreal Engine",
    linkLabel: "История специалиста",
    href: "https://skillbox.ru/media/gamedev/story-mihail-efremov/",
  },
  {
    icon: "award",
    value: "3 награды",
    label: "Gamebox Hack, tinyBuild и «Синеус»",
    linkLabel: "Проверить награды",
    href: "https://skillbox.ru/media/gamedev/story-mihail-efremov/",
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
    value: "3 проекта",
    label: "с публичными страницами в Steam и VK Play",
    linkLabel: "Смотреть проекты",
    href: "/projects",
  },
];
