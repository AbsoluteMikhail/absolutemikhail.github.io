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
  singleLineDescription?: boolean;
}

export const milestones: Milestone[] = [
  {
    year: "2026",
    title: "Unreal Authorized Instructor",
    description:
      "Получил статус Unreal Authorized Instructor; G.R.I.B.N.I.K. отмечена наградой «Лучший геймдизайн».",
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
      {
        label: "Награда фильма",
        href: "https://www.kinopoisk.ru/media/news/4010661/",
      },
      {
        label: "Резидентство в Сколково",
        href: "https://t.me/AbsoluteUnderground/482",
      },
    ],
  },
  {
    year: "2024",
    title: "GamePunk Studio и авторский курс",
    description:
      "Перешёл к core gameplay и multiplayer коммерческого проекта; выпустил программу «Разработчик игр на Unreal Engine 5 с нуля».",
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
    title: "Коммерческий production",
    description:
      "Virtual production фильма «Воздух», интерактивные трансляции и разработка больших пространств в StepApp.",
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
        label: "Gamebox Hack",
        href: "https://www.youtube.com/watch?v=Bb_tg1Rl10Y&t=8400s",
      },
      {
        label: "Выбор tinyBuild",
        href: "https://unrealcontest.ru/2021/winners/",
      },
    ],
  },
  {
    year: "2020",
    title: "Unreal становится профессией",
    description:
      "Начало коммерческой разработки: gameplay, AI, VR и первые production-задачи на Unreal Engine.",
    icon: "rocket",
  },
  {
    year: "2015",
    title: "Начало пути в Unreal Engine",
    description:
      "Самостоятельное изучение движка, C++, игровых систем и первые собственные прототипы.",
    icon: "star",
  },
];
