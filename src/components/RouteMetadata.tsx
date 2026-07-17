import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  findRouteMetadata,
  normalizePathname,
  notFoundMetadata,
  siteUrl,
} from "@/constants/routeMetadata.js";

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
    const normalizedPathname = normalizePathname(pathname);
    const metadata = findRouteMetadata(normalizedPathname) ?? notFoundMetadata;
    const canonicalUrl = `${siteUrl}${normalizedPathname === "/" ? "/" : normalizedPathname}`;

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
