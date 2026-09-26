export interface ExperienceCase {
  company: string;
  period: string;
  role: string;
  summary: string;
  details: string[];
  result: string;
  highlight: string;
  highlightLabel: string;
  featured?: boolean;
  icon: "gameplay" | "world" | "film";
}

export const productionExperience: ExperienceCase[] = [
  {
    company: "GamePunk Studio",
    period: "2024 — сейчас",
    role: "Senior Gameplay Programmer",
    summary:
      "Делаю игровые механики и сетевые системы на Unreal Engine 5 — от поведения оружия до стрельбы в co-op и PvP.",
    details: [
      "Data-driven архитектура оружия, снарядов и эффектов на C++ и Asset Manager.",
      "Server-authoritative стрельба с client-side prediction для co-op и PvP.",
      "Steam API: профиль, облачные сохранения и лидерборды.",
    ],
    result:
      "Проект вырос из победного хакатон-прототипа в публичный продукт, получил резидентство игрового кластера «Сколково» и вышел в финал «Игропрома».",
    highlight: "Steam API",
    highlightLabel: "профиль, сохранения и лидерборды в публичной сборке",
    featured: true,
    icon: "gameplay",
  },
  {
    company: "StepApp",
    period: "2022",
    role: "Unreal Engine 5 Developer",
    summary:
      "Строил большое интерактивное пространство: подгружал его по частям и оптимизировал системы, чтобы уложиться в ограничения памяти.",
    details: [
      "Level Streaming и асинхронная подгрузка секторов.",
      "Модульные системы экономики и крафта на Data Assets.",
      "Оптимизация physics assets и тяжёлых Tick-функций.",
    ],
    result:
      "Сделал настройку баланса независимой от пересборки проекта. Переработал тяжёлые Tick-функции и физические ассеты, чтобы снизить нагрузку игровых систем.",
    highlight: "Data Assets",
    highlightLabel: "настройка экономики и крафта без пересборки",
    icon: "world",
  },
  {
    company: "XOVP",
    period: "2021 — 2022",
    role: "UE Technical Artist / Developer",
    summary:
      "Использовал Unreal Engine за пределами игр: делал инструменты для кино, виртуальных съёмок и интерактивных трансляций.",
    details: [
      "Blueprint/C++-плагин синхронизации виртуального освещения и камеры.",
      "Оптимизация шейдеров и Niagara для LED Volume.",
      "Работа с многоэкранными real-time конфигурациями.",
    ],
    result:
      "В команде XOVP работал над виртуальным производством фильма «Воздух». Награду за визуальные эффекты получили студии XOVP и «Аламбик».",
    highlight: "«Воздух»",
    highlightLabel: "«Золотой орёл» за визуальные эффекты",
    icon: "film",
  },
];

export interface EngineeringStage {
  period: string;
  company: string;
  role: string;
  description: string;
  evidence?: string;
}

export const engineeringFoundation: EngineeringStage[] = [
  {
    period: "2011 — 2014",
    company: "Первый коммерческий IT-опыт",
    role: "Системный администратор",
    description:
      "Поддерживал рабочие места, сети и инфраструктуру. Учился отвечать за системы, которыми люди пользуются каждый день.",
  },
  {
    period: "2014 — 2017",
    company: "MAYKOR",
    role: "Инженер IT-инфраструктуры",
    description:
      "Обслуживал распределённую инфраструктуру федерального ритейла, банков и телекома.",
    evidence:
      "Проекты для X5 Group, O’STIN, «Спортмастера», Альфа-Банка, Райффайзенбанка, «МегаФона», МТС и «Ростелекома».",
  },
  {
    period: "2017 — 2021",
    company: "Компания «Тензор»",
    role: "Team Lead / инженер внедрения",
    description:
      "Руководил командой из трёх инженеров и автоматизировал обработку и валидацию данных на Python.",
    evidence:
      "Четыре года подряд — лучший инженер компании.",
  },
];
