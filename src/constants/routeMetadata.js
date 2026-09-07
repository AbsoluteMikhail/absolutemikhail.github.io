export const siteUrl = "https://gamepunk.ru";

export const routeMetadata = [
  {
    path: "/",
    match: "exact",
    title: "Михаил Ефремов / Absolute Mikhail — игры, опыт и менторинг Unreal Engine",
    description:
      "Игры и история Михаила Ефремова / Absolute Mikhail: проекты на Unreal Engine, работа в командах, путь в разработке и менторинг от Unreal Authorized Instructor.",
    robots: "index, follow",
  },
  {
    path: "/projects",
    match: "exact",
    title: "Игры и проекты на Unreal Engine | Absolute Mikhail",
    description:
      "Игровой архив Absolute Mikhail: собственные и командные проекты на Unreal Engine, релизы, джемы, эксперименты и замороженные разработки.",
    robots: "index, follow",
  },
  {
    path: "/academy",
    match: "prefix",
    title: "Academy: Unreal Engine, C++, нейросети и инструменты | Absolute Mikhail",
    description:
      "Практические курсы, статьи и подборки об Unreal Engine, C++, нейросетях, инструментах и разработке.",
    robots: "index, follow",
  },
  {
    path: "/malena/privacy",
    match: "exact",
    title: "Политика конфиденциальности Malena",
    description: "Политика конфиденциальности и правила использования Telegram-бота Malena.",
    robots: "noindex, nofollow, noarchive, nosnippet, noimageindex",
  },
  {
    path: "/music",
    match: "exact",
    title: "Музыка из игр | Absolute Mikhail",
    description: "Авторская музыка и звуковые материалы из игровых проектов Absolute Mikhail.",
    robots: "noindex, nofollow",
  },
  {
    path: "/twitch",
    match: "exact",
    title: "Twitch-интерактив | Absolute Mikhail",
    description: "Интерактивная Twitch-сцена для трансляций Absolute Mikhail.",
    robots: "noindex, nofollow",
  },
  {
    path: "/snippet",
    match: "exact",
    title: "Михаил Ефремов | Senior Gameplay Programmer",
    description:
      "Senior Gameplay Programmer и Unreal Authorized Instructor. Unreal Engine, C++, multiplayer, AI и архитектура игровых систем.",
    robots: "index, follow",
  },
];

export const notFoundMetadata = {
  title: "Страница не найдена | Absolute Mikhail",
  description: "Запрошенная страница не найдена.",
  robots: "noindex, nofollow",
};

export const normalizePathname = (pathname) => {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
};

export const findRouteMetadata = (pathname) => {
  const normalizedPathname = normalizePathname(pathname);

  return routeMetadata.find((route) =>
    route.match === "prefix"
      ? normalizedPathname === route.path || normalizedPathname.startsWith(`${route.path}/`)
      : normalizedPathname === route.path,
  );
};
