import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { routeMetadata, siteUrl } from "../src/constants/routeMetadata.js";

const distDirectory = resolve("dist");
const templatePath = resolve(distDirectory, "index.html");
const template = await readFile(templatePath, "utf8");

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

const renderRouteHtml = (metadata) => {
  const canonicalUrl = `${siteUrl}${metadata.path === "/" ? "/" : metadata.path}`;
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

  return tags.reduce(
    (html, [matcher, tag]) => replaceOrInsertHeadTag(html, matcher, tag),
    template,
  );
};

for (const metadata of routeMetadata) {
  const outputDirectory = metadata.path === "/"
    ? distDirectory
    : resolve(distDirectory, metadata.path.slice(1));
  const outputPath = resolve(outputDirectory, "index.html");

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, renderRouteHtml(metadata), "utf8");
}

console.log(`Generated ${routeMetadata.length} route HTML files in ${distDirectory}`);
