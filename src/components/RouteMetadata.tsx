import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  absoluteUrl,
  canonicalUrl,
  defaultSocialImage,
  findRouteMetadata,
  getPageStructuredData,
  normalizePathname,
  notFoundMetadata,
} from "@/constants/routeMetadata.js";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";
import type { PageMetadata } from "@/lib/pageMetadata";

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
  return element;
};

const removeMeta = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const RouteMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let active = true;
    const normalizedPathname = normalizePathname(pathname);
    const fallback = findRouteMetadata(normalizedPathname) ?? notFoundMetadata;

    const applyMetadata = (metadata: PageMetadata) => {
      if (!active) return;
      const image = metadata.image ? absoluteUrl(metadata.image) : defaultSocialImage.url;
      const imageAlt = metadata.image ? metadata.imageAlt || defaultSocialImage.alt : defaultSocialImage.alt;
      const width = metadata.image ? metadata.imageWidth : defaultSocialImage.width;
      const height = metadata.image ? metadata.imageHeight : defaultSocialImage.height;

      document.title = metadata.title;
      upsertMeta('meta[name="description"]', "name", "description", metadata.description);
      upsertMeta('meta[name="robots"]', "name", "robots", metadata.robots ?? "index, follow");
      upsertMeta('meta[property="og:title"]', "property", "og:title", metadata.title);
      upsertMeta('meta[property="og:description"]', "property", "og:description", metadata.description);
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl(normalizedPathname));
      upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "Absolute Mikhail");
      upsertMeta('meta[property="og:type"]', "property", "og:type", metadata.ogType ?? "website");
      upsertMeta('meta[property="og:image"]', "property", "og:image", image);
      upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", imageAlt);
      upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
      upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
      upsertMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", imageAlt);
      if (width && height) {
        upsertMeta('meta[property="og:image:width"]', "property", "og:image:width", String(width));
        upsertMeta('meta[property="og:image:height"]', "property", "og:image:height", String(height));
      } else {
        removeMeta('meta[property="og:image:width"]');
        removeMeta('meta[property="og:image:height"]');
      }

      const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      canonical?.setAttribute("href", canonicalUrl(normalizedPathname));

      const data = getPageStructuredData(metadata);
      let structuredData = document.head.querySelector<HTMLScriptElement>("#structured-data");
      if (!data) {
        structuredData?.remove();
        return;
      }
      if (!structuredData) {
        structuredData = document.createElement("script");
        structuredData.id = "structured-data";
        structuredData.type = "application/ld+json";
        document.head.appendChild(structuredData);
      }
      structuredData.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
    };
    void resolvePageMetadata(normalizedPathname).then(applyMetadata, () => applyMetadata(fallback));
    return () => { active = false; };
  }, [pathname]);

  return null;
};

export default RouteMetadata;
