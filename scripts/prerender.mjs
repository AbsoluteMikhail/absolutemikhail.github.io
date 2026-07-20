import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  findRouteMetadata,
  notFoundMetadata,
  routeMetadata,
  siteUrl,
} from "../src/constants/routeMetadata.js";

const distDirectory = resolve("dist");
const serverEntryPath = resolve("dist-ssr", "entry-server.js");
const templatePath = resolve(distDirectory, "index.html");
const template = await readFile(templatePath, "utf8");

// The client bundle is a production build, so React's server renderer must use
// the same mode. Otherwise the generated Suspense markup can fail hydration.
process.env.NODE_ENV ??= "production";
const { prerenderPaths, render } = await import(pathToFileURL(serverEntryPath).href);

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

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

const renderRouteHtml = (pathname, metadata, renderedMarkup = "") => {
  const canonicalUrl = `${siteUrl}${pathname === "/" ? "/" : pathname}`;
  const title = escapeAttribute(metadata.title);
  const description = escapeAttribute(metadata.description);
  const robots = escapeAttribute(metadata.robots);

  const tags = [
    [/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`],
    [/<meta\b[^>]*\bname=["']description["'][^>]*>/i, `<meta name="description" content="${description}" />`],
    [/<meta\b[^>]*\bname=["']robots["'][^>]*>/i, `<meta name="robots" content="${robots}" />`],
    [/<link\b[^>]*\brel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`],
    [/<meta\b[^>]*\bproperty=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}" />`],
    [/<meta\b[^>]*\bproperty=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description}" />`],
    [/<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`],
    [/<meta\b[^>]*\bproperty=["']og:type["'][^>]*>/i, '<meta property="og:type" content="website" />'],
    [/<meta\b[^>]*\bname=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${title}" />`],
    [/<meta\b[^>]*\bname=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${description}" />`],
  ];

  const html = tags.reduce(
    (html, [matcher, tag]) => replaceOrInsertHeadTag(html, matcher, tag),
    template,
  );

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

for (const pathname of outputPaths) {
  const metadata = findRouteMetadata(pathname) ?? notFoundMetadata;
  const renderedMarkup = renderedPaths.has(pathname) ? await render(pathname) : "";
  const outputDirectory = pathname === "/"
    ? distDirectory
    : resolve(distDirectory, pathname.slice(1));
  const outputPath = resolve(outputDirectory, "index.html");

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, renderRouteHtml(pathname, metadata, renderedMarkup), "utf8");
}

console.log(
  `Generated ${outputPaths.size} route HTML files (${renderedPaths.size} with rendered content) in ${distDirectory}`,
);
