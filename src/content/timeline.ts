export type TimelineIcon = "award" | "rocket" | "trophy" | "star";

export interface TimelineLink {
  label: string;
  href: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: TimelineIcon;
  links?: TimelineLink[];
}

export const milestones: Milestone[] = [
  {
    year: "2026",
    title: "Лучший геймдизайн — G.R.I.B.N.I.K.",
    description: "Награда за геймдизайн и развитие собственного игрового проекта.",
    icon: "award",
    links: [{ label: "Открыть проект", href: "/projects" }],
  },
  {
    year: "2025",
    title: "«Золотой орёл» и Сколково",
    description:
      "Работа над визуальными эффектами фильма «Воздух», отмеченного премией «Золотой орёл», и резидентство игрового кластера «Сколково».",
    icon: "award",
    links: [
      { label: "О визуальных эффектах", href: "https://xovp.ru/vozduh" },
      { label: "Профиль и достижения", href: "https://boosty.to/mikhail_e" },
    ],
  },
  {
    year: "2024",
    title: "Автор курса",
    description: "«Разработчик игр на Unreal Engine 5 с нуля».",
    icon: "rocket",
    links: [
      {
        label: "Подробнее о курсе",
        href: "https://l.skbx.pro/4TR7gF",
      },
    ],
  },
  {
    year: "2023",
    title: "Соло-победа на «Синеус»",
    description: "Первое место на офлайн-хакатоне и главный приз за игровой проект.",
    icon: "trophy",
    links: [
      {
        label: "История и награды",
        href: "https://skillbox.ru/media/gamedev/story-mihail-efremov/",
      },
    ],
  },
  {
    year: "2022",
    title: "Кино и прямые трансляции",
    description: "Работа над фильмом «Воздух» и концертом «Выпускной ВКонтакте 2022».",
    icon: "star",
    links: [{ label: "Производство фильма", href: "https://xovp.ru/vozduh" }],
  },
  {
    year: "2021",
    title: "Победа на Gamebox Hack",
    description: "Также — «Выбор tinyBuild» на Unreal Engine Dev Contest.",
    icon: "trophy",
    links: [
      {
        label: "Подтверждение наград",
        href: "https://skillbox.ru/media/gamedev/story-mihail-efremov/",
      },
    ],
  },
];
