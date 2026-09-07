export type AcademyHeading = { depth: number; id: string; text: string };

export const parseAcademyFrontmatter = (raw: string) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    return { body: raw.trim(), meta: {} as Record<string, string> };
  }

  const meta = match[1].split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return acc;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (key) {
      acc[key] = value;
    }

    return acc;
  }, {});

  return {
    body: raw.slice(match[0].length).trim(),
    meta,
  };
};

export const slugify = (value: string) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
};

export const getHeadings = (body: string): AcademyHeading[] => {
  const usedIds = new Map<string, number>();
  let inCode = false;

  return body
    .split(/\r?\n/)
    .map((line) => {
      if (line.trim().startsWith("```")) { inCode = !inCode; return null; }
      return inCode ? null : line.trim().match(/^(#{1,6})\s+(.+)$/);
    })
    .filter(Boolean)
    .map((match) => {
      const text = match![2].trim();
      const baseId = slugify(text);
      const currentCount = usedIds.get(baseId) ?? 0;
      const id = currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`;

      usedIds.set(baseId, currentCount + 1);

      return {
        depth: match![1].length,
        id,
        text,
      };
    });
};
