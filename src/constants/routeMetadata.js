export const siteUrl = "https://gamepunk.ru";

/** @type {(import("../lib/pageMetadata").PageMetadata & { path: string, match: "exact" | "prefix" })[]} */
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

/** @param {string} pathname */
export const normalizePathname = (pathname) => {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
};

/** @param {string} pathname */
export const canonicalUrl = (pathname) => {
  const path = normalizePathname(pathname);
  return `${siteUrl}${path === "/" ? "/" : `${path}/`}`;
};

// GitHub Pages answers the directory URL (trailing slash) with 200 and redirects the slash-less form.
/** @param {string} value */
export const trailingPath = (value) => {
  if (typeof value !== "string" || value.length === 0) return value;
  if (value.startsWith("#") || /^(https?:)?\/\//i.test(value) || value.startsWith("mailto:")) return value;

  const hashIndex = value.indexOf("#");
  const beforeHash = hashIndex >= 0 ? value.slice(0, hashIndex) : value;
  const hash = hashIndex >= 0 ? value.slice(hashIndex) : "";
  const queryIndex = beforeHash.indexOf("?");
  const path = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  if (!path.startsWith("/")) return value;

  const segment = path.split("/").filter(Boolean).pop() || "";
  if (segment.includes(".")) return value;

  const normalized = path === "/" ? "/" : path.replace(/\/+$/, "") || "/";
  if (normalized === "/") return `/${query}${hash}`;
  return `${normalized}/${query}${hash}`;
};

/** @param {string | undefined} value */
export const absoluteUrl = (value) => {
  if (!value) return defaultSocialImage.url;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

/** @param {string} value */
const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

/** @param {{ pathname: string, updated?: string }[]} entries */
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

/** @param {string} pathname */
export const findRouteMetadata = (pathname) => {
  const normalizedPathname = normalizePathname(pathname);

  return routeMetadata.find((route) =>
    route.match === "prefix"
      ? normalizedPathname === route.path || normalizedPathname.startsWith(`${route.path}/`)
      : normalizedPathname === route.path,
  );
};
