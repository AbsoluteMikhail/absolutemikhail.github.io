import { readFile } from "node:fs/promises";
import type { Plugin } from "vite";
import { parseAcademyFrontmatter } from "../src/lib/academyMarkdown";

// Only frontmatter enters the eager catalog. Article bodies remain lazy chunks.
export const academyContentPlugin = (): Plugin => ({
  name: "academy-content-metadata",
  enforce: "pre",
  handleHotUpdate({ file, server }) {
    if (file.replace(/\\/g, "/").includes("/src/content/academy/") && file.endsWith(".md")) {
      // Refresh the reader's cache together with the catalog when an author edits Markdown.
      server.ws.send({ type: "full-reload" });
    }
  },
  async load(id) {
    if (!id.endsWith(".md?academy-meta")) return null;
    const filename = id.slice(0, -"?academy-meta".length);
    this.addWatchFile(filename);
    const { meta } = parseAcademyFrontmatter(await readFile(filename, "utf8"));
    if (!["course", "lesson"].includes(meta.type) || !meta.title) {
      throw new Error(`${filename}: Academy material requires type and title`);
    }
    return `export default ${JSON.stringify(meta)};`;
  },
});
