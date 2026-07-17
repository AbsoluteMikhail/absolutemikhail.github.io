export const siteUrl = "https://absolutemikhail.github.io";

export const routeMetadata = [
  {
    path: "/",
    match: "exact",
    title: "Портфолио и менторинг Unreal Engine | Absolute Mikhail",
    description:
      "Инди-разработчик и ментор по Unreal Engine 5. Игры, C++, Blueprint, архитектура игровых систем и помощь с доведением проектов до релиза.",
    robots: "index, follow",
  },
  {
    path: "/projects",
    match: "exact",
    title: "Игры и проекты на Unreal Engine | Absolute Mikhail",
    description:
      "Авторские игры Absolute Mikhail на Unreal Engine: DUELANT, G.R.I.B.N.I.K. и «КОЛОБОК против ЯЩЕРОВ».",
    robots: "index, follow",
  },
  {
    path: "/academy",
    match: "prefix",
    title: "Academy: C++ и Blueprint в Unreal Engine | Absolute Mikhail",
    description:
      "Практические материалы по C++, Blueprint, архитектуре и разработке игровых систем в Unreal Engine.",
    robots: "index, follow",
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
    title: "Absolute Mikhail | Разработчик игр на Unreal Engine",
    description:
      "Инди-разработчик и ментор по Unreal Engine. C++, Blueprint, игровые системы, архитектура, проекты и социальные сети.",
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
