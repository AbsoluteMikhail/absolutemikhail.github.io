export interface ExperienceCase {
  company: string;
  period: string;
  role: string;
  summary: string;
  details: string[];
  result: string;
  metric: string;
  metricLabel: string;
  featured?: boolean;
  icon: "gameplay" | "world" | "film";
}

export const productionExperience: ExperienceCase[] = [
  {
    company: "GamePunk Studio",
    period: "2024 — сейчас",
    role: "Senior Gameplay Programmer",
    summary:
      "Развиваю core gameplay и сетевые системы коммерческого проекта на Unreal Engine 5.",
    details: [
      "Data-driven архитектура оружия, снарядов и эффектов на C++ и Asset Manager.",
      "Server-authoritative стрельба с client-side prediction для co-op и PvP.",
      "Steam API: профиль, облачные сохранения и лидерборды.",
    ],
    result:
      "Проект вырос из победного хакатон-прототипа в публичный продукт, получил резидентство игрового кластера «Сколково» и вышел в финал «Игропрома».",
    metric: "+40%",
    metricLabel: "к скорости прототипирования механик",
    featured: true,
    icon: "gameplay",
  },
  {
    company: "StepApp",
    period: "2022",
    role: "Unreal Engine 5 Developer",
    summary:
      "Строил системы для масштабного интерактивного пространства в условиях жёстких лимитов памяти.",
    details: [
      "Level Streaming и асинхронная подгрузка секторов.",
      "Модульные системы экономики и крафта на Data Assets.",
      "Оптимизация physics assets и тяжёлых Tick-функций.",
    ],
    result:
      "Ускорил кадр за счёт системной оптимизации и сделал настройку баланса независимой от пересборки проекта.",
    metric: "−20%",
    metricLabel: "frame time после оптимизации",
    icon: "world",
  },
  {
    company: "XOVP",
    period: "2021 — 2022",
    role: "UE Technical Artist / Developer",
    summary:
      "Разрабатывал real-time инструменты для virtual production, кино и интерактивных трансляций.",
    details: [
      "Blueprint/C++-плагин синхронизации виртуального освещения и камеры.",
      "Оптимизация шейдеров и Niagara для LED Volume.",
      "Работа с многоэкранными real-time конфигурациями.",
    ],
    result:
      "Участвовал в VP/VFX-производстве фильма «Воздух», получившего премию «Золотой орёл» за визуальные эффекты.",
    metric: "60 FPS",
    metricLabel: "без просадок в production-сценах",
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
      "Поддержка рабочих мест, сетей и инфраструктуры — ответственность за системы, которыми люди пользуются каждый день.",
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
      "−30% ручных операций; четыре года подряд — лучший инженер компании.",
  },
];
