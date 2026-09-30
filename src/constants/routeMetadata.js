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
    path: "/privacy",
    match: "exact",
    title: "Политика конфиденциальности | Absolute Mikhail",
    description: "Как gamepunk.ru использует аналитику, обрабатывает обращения и позволяет управлять выбором посетителя.",
    robots: "noindex, follow",
  },
  {
    path: "/terms",
    match: "exact",
    title: "Пользовательское соглашение | Absolute Mikhail",
    description: "Условия использования материалов gamepunk.ru и свободная лицензия на авторские учебные примеры кода.",
    robots: "noindex, follow",
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

export const defaultSocialImage = {
  url: `${siteUrl}/snippet.jpg`,
  alt: "Absolute Mikhail: портфолио игр и менторинг по Unreal Engine 5",
  width: 1200,
  height: 630,
};

export const normalizePathname = (pathname) => {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
};

export const canonicalUrl = (pathname) => {
  const path = normalizePathname(pathname);
  return `${siteUrl}${path === "/" ? "/" : path}`;
};

export const absoluteUrl = (value) => {
  if (!value) return defaultSocialImage.url;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export const renderSitemap = (entries) => {
  const urls = entries
    .map(({ pathname, updated }) => {
      const lastmod = typeof updated === "string" && /^\d{4}-\d{2}-\d{2}$/.test(updated)
        ? `\n    <lastmod>${updated}</lastmod>`
        : "";
      return `  <url>\n    <loc>${escapeXml(canonicalUrl(pathname))}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

export const findRouteMetadata = (pathname) => {
  const normalizedPathname = normalizePathname(pathname);

  return routeMetadata.find((route) =>
    route.match === "prefix"
      ? normalizedPathname === route.path || normalizedPathname.startsWith(`${route.path}/`)
      : normalizedPathname === route.path,
  );
};
