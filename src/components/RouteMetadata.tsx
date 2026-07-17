import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageMetadata {
  title: string;
  description: string;
  robots?: string;
}

const defaultMetadata: PageMetadata = {
  title: "Менторинг Unreal Engine 5 и C++ | Absolute Mikhail",
  description:
    "Персональный менторинг по Unreal Engine 5, C++, Blueprint, архитектуре игровых систем и подготовке проекта к релизу.",
};

const routeMetadata: Array<{ matches: (pathname: string) => boolean; metadata: PageMetadata }> = [
  {
    matches: (pathname) => pathname === "/projects",
    metadata: {
      title: "Игры и проекты на Unreal Engine | Absolute Mikhail",
      description:
        "Авторские игры Absolute Mikhail на Unreal Engine: DUELANT, G.R.I.B.N.I.K. и «КОЛОБОК против ЯЩЕРОВ».",
    },
  },
  {
    matches: (pathname) => pathname.startsWith("/academy"),
    metadata: {
      title: "Academy: C++ и Blueprint в Unreal Engine | Absolute Mikhail",
      description:
        "Практические материалы по C++, Blueprint, архитектуре и разработке игровых систем в Unreal Engine.",
    },
  },
  {
    matches: (pathname) => pathname === "/music",
    metadata: {
      title: "Музыка из игр | Absolute Mikhail",
      description: "Авторская музыка и звуковые материалы из игровых проектов Absolute Mikhail.",
    },
  },
  {
    matches: (pathname) => pathname === "/twitch",
    metadata: {
      title: "Twitch-интерактив | Absolute Mikhail",
      description: "Интерактивная Twitch-сцена для трансляций Absolute Mikhail.",
      robots: "noindex, nofollow",
    },
  },
  {
    matches: (pathname) => pathname === "/og-snippet",
    metadata: {
      title: "Превью сайта | Absolute Mikhail",
      description: "Служебная страница изображения для социальных сетей.",
      robots: "noindex, nofollow",
    },
  },
];

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
};

const RouteMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const match = routeMetadata.find((route) => route.matches(pathname));
    const isKnownRoute = pathname === "/" || Boolean(match);
    const metadata = match?.metadata ?? (isKnownRoute
      ? defaultMetadata
      : {
          title: "Страница не найдена | Absolute Mikhail",
          description: "Запрошенная страница не найдена.",
          robots: "noindex, nofollow",
        });
    const canonicalUrl = `https://absolutemikhail.github.io${pathname === "/" ? "/" : pathname}`;

    document.title = metadata.title;
    upsertMeta('meta[name="description"]', "name", "description", metadata.description);
    upsertMeta('meta[name="robots"]', "name", "robots", metadata.robots ?? "index, follow");
    upsertMeta('meta[property="og:title"]', "property", "og:title", metadata.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", metadata.description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    canonical?.setAttribute("href", canonicalUrl);
  }, [pathname]);

  return null;
};

export default RouteMetadata;
