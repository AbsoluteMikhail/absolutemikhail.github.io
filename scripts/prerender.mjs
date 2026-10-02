import { access } from "node:fs/promises";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";
import {
  absoluteUrl,
  canonicalUrl,
  defaultSocialImage,
  getPageStructuredData,
  renderSitemap,
  routeMetadata,
} from "../src/constants/routeMetadata.js";

const distDirectory = resolve("dist");
const serverEntryPath = resolve("dist-ssr", "entry-server.js");
const templatePath = resolve(distDirectory, "index.html");
const template = await readFile(templatePath, "utf8");
// Tracking loaders must stay behind the client consent choice on every route.
if (/googletagmanager\.com|google-analytics\.com|mc\.yandex\./i.test(template)) {
  throw new Error("Analytics must not load unconditionally from the HTML template");
}

// The client bundle is a production build, so React's server renderer must use
// the same mode. Otherwise the generated Suspense markup can fail hydration.
process.env.NODE_ENV ??= "production";
const { prerenderPaths, render, resolvePageMetadata } = await import(pathToFileURL(serverEntryPath).href);

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const isIndexable = (metadata) =>
  !metadata.robots
    .toLowerCase()
    .split(",")
    .map((directive) => directive.trim())
    .includes("noindex");

const replaceOrInsertHeadTag = (html, matcher, tag) => {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
};

// Framer Motion serializes its initial animation state during SSR. Without
// JavaScript, that leaves large parts of the prerendered page at opacity: 0
// or translated outside the viewport. The client replaces (rather than
// hydrates) this markup, so we can expose the final readable state here while
// preserving the normal entrance animations in the client render.
const revealPrerenderedContent = (markup) =>
  markup.replace(/\sstyle="([^"]*)"/g, (attribute, serializedStyles) => {
    let changed = false;
    const visibleStyles = serializedStyles
      .split(";")
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .flatMap((declaration) => {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) return [declaration];

        const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
        const value = declaration.slice(separatorIndex + 1).trim();

        if (property === "opacity" && /^0(?:\.0+)?$/.test(value)) {
          changed = true;
          return ["opacity:1"];
        }

        if (property === "transform") {
          changed = true;
          return [];
        }

        return [declaration];
      });

    if (!changed) return attribute;
    return visibleStyles.length > 0 ? ` style="${visibleStyles.join(";")}"` : "";
  });

const removeHeadTag = (html, matcher) => html.replace(matcher, "");

// The hero portrait is the mobile LCP image. Ask for it before the font
// preloads and keep those fonts from competing at the same priority. Metric
// fallbacks in fonts.css cover the gap; other routes keep the original hints.
const prioritizeHomepageLcp = (html) => {
  const heroSrc = html.match(/<img\b[^>]*\bsrc="([^"]*\/hero-photo-[^"]+)"/i)?.[1];
  if (!heroSrc) throw new Error("Homepage hero image was not prerendered");
  const preload = `<link rel="preload" as="image" href="${heroSrc}" fetchpriority="high" />`;
  const withFonts = html.replace(
    /(<link rel="preload" href="\/fonts\/[^"]+" as="font" type="font\/woff2" crossorigin)( \/>)/g,
    '$1 fetchpriority="low"$2',
  );
  const viewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
  if (!withFonts.includes(viewport)) throw new Error("Homepage viewport meta is missing");
  const prioritized = withFonts.replace(viewport, `${viewport}\n    ${preload}`);
  if (!prioritized.includes(`href="${heroSrc}"`)) {
    throw new Error("Homepage hero preload was not inserted");
  }
  return prioritized;
};

const renderRouteHtml = (pathname, metadata, renderedMarkup = "") => {
  const pageUrl = canonicalUrl(pathname);
  const title = escapeAttribute(metadata.title);
  const description = escapeAttribute(metadata.description);
  const robots = escapeAttribute(metadata.robots);
  const image = escapeAttribute(metadata.image ? absoluteUrl(metadata.image) : defaultSocialImage.url);
  const imageAlt = escapeAttribute(metadata.image ? metadata.imageAlt || defaultSocialImage.alt : defaultSocialImage.alt);
  const imageWidth = metadata.image ? metadata.imageWidth : defaultSocialImage.width;
  const imageHeight = metadata.image ? metadata.imageHeight : defaultSocialImage.height;
  const ogType = metadata.ogType === "article" ? "article" : "website";

  const tags = [
    [/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`],
    [/<meta\b[^>]*\bname=["']description["'][^>]*>/i, `<meta name="description" content="${description}" />`],
    [/<meta\b[^>]*\bname=["']robots["'][^>]*>/i, `<meta name="robots" content="${robots}" />`],
    [/<link\b[^>]*\brel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${pageUrl}" />`],
    [/<meta\b[^>]*\bproperty=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}" />`],
    [/<meta\b[^>]*\bproperty=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description}" />`],
    [/<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${pageUrl}" />`],
    [/<meta\b[^>]*\bproperty=["']og:site_name["'][^>]*>/i, `<meta property="og:site_name" content="Absolute Mikhail" />`],
    [/<meta\b[^>]*\bproperty=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${ogType}" />`],
    [/<meta\b[^>]*\bproperty=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${image}" />`],
    [/<meta\b[^>]*\bproperty=["']og:image:alt["'][^>]*>/i, `<meta property="og:image:alt" content="${imageAlt}" />`],
    [/<meta\b[^>]*\bname=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${title}" />`],
    [/<meta\b[^>]*\bname=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${description}" />`],
    [/<meta\b[^>]*\bname=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${image}" />`],
    [/<meta\b[^>]*\bname=["']twitter:image:alt["'][^>]*>/i, `<meta name="twitter:image:alt" content="${imageAlt}" />`],
  ];
  if (imageWidth && imageHeight) {
    tags.push(
      [/<meta\b[^>]*\bproperty=["']og:image:width["'][^>]*>/i, `<meta property="og:image:width" content="${imageWidth}" />`],
      [/<meta\b[^>]*\bproperty=["']og:image:height["'][^>]*>/i, `<meta property="og:image:height" content="${imageHeight}" />`],
    );
  }

  const documentTemplate = ["/privacy", "/terms", "/malena/privacy"].includes(pathname)
    ? template.replace(/\s*<!-- Local command queue only:[\s\S]*?<\/script>/i, "")
    : template;
  const routeTemplate = pathname === "/malena/privacy"
    ? documentTemplate
        .replace(/\s*<!-- Google tag \(gtag\.js\) -->[\s\S]*?<\/script>/i, "")
        .replace(/\s*<!-- Yandex\.Metrika counter -->[\s\S]*?<!-- \/Yandex\.Metrika counter -->/i, "")
        .replace(/\s*<meta\b[^>]*\bname=["']twitter:site["'][^>]*>/i, "")
    : documentTemplate;

  let html = tags.reduce(
    (html, [matcher, tag]) => replaceOrInsertHeadTag(html, matcher, tag),
    routeTemplate,
  );
  if (!imageWidth || !imageHeight) {
    html = removeHeadTag(html, /\s*<meta\b[^>]*\bproperty=["']og:image:width["'][^>]*>/i);
    html = removeHeadTag(html, /\s*<meta\b[^>]*\bproperty=["']og:image:height["'][^>]*>/i);
  }
  const structuredData = getPageStructuredData(metadata);
  if (structuredData) {
    const json = JSON.stringify(structuredData).replaceAll("<", "\\u003c");
    const script = `<script type="application/ld+json" id="structured-data">${json}</script>`;
    html = html.replace("</head>", `    ${script}\n  </head>`);
  }

  const visibleMarkup = revealPrerenderedContent(renderedMarkup);

  return html.replace(
    /<div\s+id=["']root["']\s*><\/div>/i,
    () => `<div id="root">${visibleMarkup}</div>`,
  );
};

const outputPaths = new Set([
  ...routeMetadata.map((metadata) => metadata.path),
  ...prerenderPaths,
]);
const renderedPaths = new Set(prerenderPaths);
const resolvedMetadata = new Map();
const academyTitles = new Set();

const validateHtml = (html, pathname) => {
  if (html.includes("\u0000") || html.includes("\ufffd")) {
    throw new Error(`${pathname}: corrupted Unicode in prerendered HTML`);
  }
  if (pathname === "/snippet" || pathname.startsWith("/projects/")) {
    const { document } = new JSDOM(html).window;
    if (document.querySelectorAll("h1").length !== 1 || !document.querySelector("main")) {
      throw new Error(`${pathname}: public project and profile pages must be prerendered`);
    }
  }
  if (pathname === "/") {
    const { document } = new JSDOM(html).window;
    const disclosures = [...document.querySelectorAll("#faq details")];
    if (!disclosures.length || disclosures.some((item) => !item.querySelector("summary") || !item.querySelector("p")?.textContent.trim())) {
      throw new Error("Homepage FAQ answers must be readable without JavaScript");
    }
  }
  if (pathname === "/privacy" || pathname === "/terms") {
    const { document } = new JSDOM(html).window;
    if (document.querySelectorAll("h1").length !== 1 || !document.querySelector("article section")) {
      throw new Error(`${pathname}: legal document must be readable in the prerendered HTML`);
    }
    if (!document.querySelector('meta[name="robots"]')?.content.includes("noindex")) {
      throw new Error(`${pathname}: legal route must retain noindex`);
    }
  }
  if (pathname !== "/academy" && !pathname.startsWith("/academy/")) return;
  const { document } = new JSDOM(html).window;
  if (document.querySelectorAll("h1").length !== 1) throw new Error(`${pathname}: expected exactly one H1`);
  if (academyTitles.has(document.title)) throw new Error(`${pathname}: duplicate Academy title`);
  academyTitles.add(document.title);
  for (const link of document.querySelectorAll('nav[aria-label="На странице"] a[href^="#"]')) {
    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    if (!document.getElementById(id)) throw new Error(`${pathname}: missing heading #${id}`);
  }
  if (document.querySelector('[role="status"]')?.textContent.includes("Загрузка материала")) {
    throw new Error(`${pathname}: article was not ready for prerendering`);
  }
};

for (const pathname of outputPaths) {
  const metadata = await resolvePageMetadata(pathname);
  resolvedMetadata.set(pathname, metadata);
  const renderedMarkup = renderedPaths.has(pathname) ? await render(pathname) : "";
  const outputDirectory = pathname === "/"
    ? distDirectory
    : resolve(distDirectory, pathname.slice(1));
  const outputPath = resolve(outputDirectory, "index.html");
  const html = pathname === "/"
    ? prioritizeHomepageLcp(renderRouteHtml(pathname, metadata, renderedMarkup))
    : renderRouteHtml(pathname, metadata, renderedMarkup);
  validateHtml(html, pathname);

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

const sitemapEntries = [...outputPaths].flatMap((pathname) => {
  const metadata = resolvedMetadata.get(pathname);
  if (!isIndexable(metadata)) return [];
  return [{ pathname, updated: metadata.updated }];
});
const sitemapPath = resolve(distDirectory, "sitemap.xml");
await writeFile(sitemapPath, renderSitemap(sitemapEntries), "utf8");

for (const [pathname, metadata] of resolvedMetadata) {
  const imagePath = metadata.image ? metadata.image : "/snippet.jpg";
  if (!imagePath.startsWith("/") || imagePath.startsWith("//")) continue;
  const filePath = resolve(distDirectory, imagePath.slice(1).split("?")[0]);
  try {
    await access(filePath);
  } catch {
    throw new Error(`${pathname}: social image is missing from the build: ${imagePath}`);
  }
  const htmlPath = pathname === "/"
    ? resolve(distDirectory, "index.html")
    : resolve(distDirectory, pathname.slice(1), "index.html");
  const html = await readFile(htmlPath, "utf8");
  const canonical = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0] ?? "";
  if (!canonical.includes(`href="${canonicalUrl(pathname)}"`)) {
    throw new Error(`${pathname}: canonical must be ${canonicalUrl(pathname)}`);
  }
}

console.log(
  `Generated ${outputPaths.size} route HTML files (${renderedPaths.size} with rendered content) and a sitemap with ${sitemapEntries.length} URLs in ${distDirectory}`,
);
