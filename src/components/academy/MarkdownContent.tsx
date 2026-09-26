import type React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { slugify, type AcademyHeading } from "@/lib/academyMarkdown";
import { YouTubeEmbed } from "@/components/academy/YouTubeEmbed";
import { AcademyFlowDiagram } from "@/components/academy/AcademyFlowDiagram";
import { BlueprintUEEmbed } from "@/components/academy/BlueprintUEEmbed";
import { cn } from "@/lib/utils";
import { AcademyDisclosure } from "@/components/academy/AcademyDisclosure";
import { AcademyImageLightbox } from "@/components/academy/AcademyImageLightbox";

type MarkdownContentProps = {
  className?: string;
  content: string;
};

type MarkdownBlock =
  | { type: "blockquote"; lines: string[] }
  | { type: "callout"; body: string[]; intent: string; title?: string }
  | { type: "code"; code: string; language: string }
  | { type: "heading"; depth: number; id: string; text: string }
  | { type: "hr" }
  | { type: "image"; alt: string; src: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "paragraph"; text: string };

const isTableRow = (line: string) => /^\|.*\|$/.test(line.trim());

const isTableDivider = (line: string) => {
  if (!isTableRow(line)) return false;
  const cells = line.trim().slice(1, -1).split("|");
  return cells.length > 0 && cells.every((cell) => /^\s*:?-{3,}:?\s*$/.test(cell));
};

const parseTableRow = (line: string) =>
  line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());

const isStructuralLine = (line: string) =>
  /^(#{1,6})\s+/.test(line) ||
  /^```/.test(line) ||
  /^:::\w*/.test(line) ||
  /^>\s?/.test(line) ||
  /^-\s+/.test(line) ||
  /^\d+\.\s+/.test(line) ||
  /^---+$/.test(line) ||
  /^!\[.*?\]\(.+?\)$/.test(line);

const parseMarkdown = (content: string): MarkdownBlock[] => {
  const lines = content.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  const headingIds = new Map<string, number>();
  let index = 0;

  const getHeadingId = (text: string) => {
    const baseId = slugify(text);
    const count = headingIds.get(baseId) ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    headingIds.set(baseId, count + 1);
    return id;
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    const codeMatch = trimmedLine.match(/^```(\w+)?/);
    if (codeMatch) {
      const code: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }

      blocks.push({
        code: code.join("\n"),
        language: codeMatch[1] || "",
        type: "code",
      });
      index += 1;
      continue;
    }

    const calloutMatch = trimmedLine.match(/^:::(\w+)\s*(.*)$/);
    if (calloutMatch) {
      const body: string[] = [];
      index += 1;

      while (index < lines.length && lines[index].trim() !== ":::") {
        body.push(lines[index]);
        index += 1;
      }

      blocks.push({
        body,
        intent: calloutMatch[1],
        title: calloutMatch[2],
        type: "callout",
      });
      index += 1;
      continue;
    }

    // A stray closing delimiter is visible text, never a parser loop.
    if (trimmedLine.startsWith(":::")) {
      blocks.push({ type: "paragraph", text: trimmedLine });
      index += 1;
      continue;
    }

    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const text = headingMatch[2].trim();

      blocks.push({
        depth: headingMatch[1].length,
        id: getHeadingId(text),
        text,
        type: "heading",
      });
      index += 1;
      continue;
    }

    if (isTableRow(trimmedLine) && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = parseTableRow(trimmedLine);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }

      blocks.push({ headers, rows, type: "table" });
      continue;
    }

    if (/^---+$/.test(trimmedLine)) {
      blocks.push({ type: "hr" });
      index += 1;
      continue;
    }

    const imageMatch = trimmedLine.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imageMatch) {
      blocks.push({
        alt: imageMatch[1],
        src: imageMatch[2],
        type: "image",
      });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmedLine)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push({ lines: quoteLines, type: "blockquote" });
      continue;
    }

    if (/^-\s+/.test(trimmedLine) || /^\d+\.\s+/.test(trimmedLine)) {
      const ordered = /^\d+\.\s+/.test(trimmedLine);
      const items: string[] = [];
      const itemPattern = ordered ? /^\d+\.\s+/ : /^-\s+/;

      while (index < lines.length && itemPattern.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(itemPattern, ""));
        index += 1;
      }

      blocks.push({ items, ordered, type: "list" });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length && lines[index].trim() && !isStructuralLine(lines[index].trim())) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({
      text: paragraphLines.join(" "),
      type: "paragraph",
    });
  }

  return blocks;
};

const renderInline = (text: string) => {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      nodes.push(<strong key={`${match.index}-strong`}>{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={`${match.index}-code`}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isExternal = /^https?:\/\//.test(href);
        const isLocalFile = /^\/(?!\/)[^?#]+\.[a-z0-9]+(?:[?#].*)?$/i.test(href);

        nodes.push(
          isExternal || isLocalFile ? (
            <a key={`${match.index}-link`} href={href} rel="noreferrer" target="_blank">
              {label}
            </a>
          ) : (
            <Link key={`${match.index}-link`} to={href}>
              {label}
            </Link>
          ),
        );
      }
    } else if (token.startsWith("*")) {
      nodes.push(<em key={`${match.index}-em`}>{renderInline(token.slice(1, -1))}</em>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const calloutStyles: Record<string, { icon: React.ElementType; title: string; className: string }> = {
  note: {
    className: "academy-callout--note",
    icon: Info,
    title: "Заметка",
  },
  tip: {
    className: "academy-callout--tip",
    icon: Lightbulb,
    title: "Совет",
  },
  warning: {
    className: "academy-callout--warning",
    icon: AlertTriangle,
    title: "Важно",
  },
};

export const MarkdownContent = ({ className = "", content }: MarkdownContentProps) => {
  const blocks = parseMarkdown(content);

  return (
    <div className={`academy-prose ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = `h${Math.min(block.depth, 4)}` as keyof JSX.IntrinsicElements;

          return (
            <HeadingTag key={`${block.id}-${index}`} id={block.id}>
              {renderInline(block.text)}
            </HeadingTag>
          );
        }

        if (block.type === "paragraph") {
          return <p key={index}>{renderInline(block.text)}</p>;
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";

          return (
            <ListTag key={index}>
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote key={index}>
              {block.lines.map((quoteLine) => (
                <p key={quoteLine}>{renderInline(quoteLine)}</p>
              ))}
            </blockquote>
          );
        }

        if (block.type === "table") {
          return (
            <div className="academy-table-wrap" key={index}>
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th key={`${header}-${headerIndex}`} scope="col">
                        {renderInline(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${row.join("-")}-${rowIndex}`}>
                      {block.headers.map((_, cellIndex) => (
                        <td key={`${row[cellIndex] || "cell"}-${cellIndex}`}>
                          {renderInline(row[cellIndex] || "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "code") {
          return (
            <pre key={index}>
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={index}>
              <AcademyImageLightbox alt={block.alt} src={block.src} />
              {block.alt ? <figcaption>{block.alt}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === "callout") {
          if (block.intent === "details") {
            return <AcademyDisclosure key={index} label={block.title || "Подробнее"}>
              <MarkdownContent content={block.body.join("\n")} />
            </AcademyDisclosure>;
          }

          if (block.intent === "gallery") {
            const images = block.body.map((line) => line.trim().match(/^!\[(.*?)\]\((.+?)\)$/)).filter((match) => match !== null);
            return <div aria-label={block.title || "Галерея"} className={`academy-gallery my-8 grid items-start gap-4 sm:grid-cols-2 ${images.length > 2 ? "lg:grid-cols-3" : ""}`} key={index} role="group">
              {images.map((match, imageIndex) => <figure className="!my-0 min-w-0" key={`${match[2]}-${imageIndex}`}>
                <AcademyImageLightbox alt={match[1]} imageClassName="aspect-[3/4] w-full object-contain" src={match[2]} />
                <figcaption>{match[1]}</figcaption>
              </figure>)}
            </div>;
          }

          if (block.intent === "blueprintue") {
            const [url, fallbackImage, fallbackAlt] = block.body.map((line) => line.trim()).filter(Boolean);
            return (
              <BlueprintUEEmbed
                fallbackAlt={fallbackAlt}
                fallbackImage={fallbackImage}
                key={index}
                title={block.title || "Интерактивный Blueprint"}
                url={url || ""}
              />
            );
          }

          if (block.intent === "flow") {
            const layers = block.body
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line) => line.split("|").map((node) => node.trim()).filter(Boolean));

            return <AcademyFlowDiagram key={index} layers={layers} title={block.title} />;
          }

          if (block.intent === "youtube") {
            const [url, ...captionLines] = block.body.map((line) => line.trim()).filter(Boolean);
            const title = block.title || captionLines.join(" ");

            return <YouTubeEmbed key={index} title={title || "YouTube video"} url={url || ""} />;
          }

          const style = calloutStyles[block.intent] || calloutStyles.note;
          const Icon = style.icon;

          return (
            <aside className={`academy-callout ${style.className}`} key={index}>
              <div className="academy-callout__header">
                <Icon className="h-4 w-4" />
                <span>{block.title || style.title}</span>
              </div>
              <MarkdownContent content={block.body.join("\n")} />
            </aside>
          );
        }

        return <hr key={index} />;
      })}
    </div>
  );
};

export const TableOfContents = ({ headings, activeHeading }: { headings: AcademyHeading[]; activeHeading?: string }) => {
  const visibleHeadings = headings.filter((heading) => heading.depth > 1 && heading.depth <= 3);
  if (!visibleHeadings.length) return null;
  return <nav aria-label="На странице" className="my-3 ml-5 space-y-0.5 border-l border-primary/25">
    {visibleHeadings.map((heading) => (
      <a aria-current={activeHeading === heading.id ? "location" : undefined} className={cn(
        "block border-l-2 py-2 pl-4 pr-2 leading-5 transition-colors hover:text-primary",
        heading.depth === 3 ? "ml-6 border-border/70 text-xs text-muted-foreground" : "-ml-px border-transparent text-[13px] font-semibold text-foreground/85",
        activeHeading === heading.id && "border-accent bg-accent/5 text-foreground",
      )} href={`#${heading.id}`} key={heading.id}>
        {heading.text}
      </a>
    ))}
  </nav>;
};
