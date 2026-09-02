import { useState } from "react";
import { Code2, ExternalLink, ImageIcon } from "lucide-react";
import { AcademyImageLightbox } from "@/components/academy/AcademyImageLightbox";

type BlueprintUEEmbedProps = {
  fallbackAlt?: string;
  fallbackImage?: string;
  title: string;
  url: string;
};

const getBlueprintUEUrls = (value: string) => {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || !["blueprintue.com", "www.blueprintue.com"].includes(url.hostname)) {
      return null;
    }

    const match = url.pathname.match(/^\/(?:blueprint|render)\/([a-zA-Z0-9_-]+)\/?$/);
    if (!match) return null;

    const id = match[1];
    return {
      embedUrl: `https://blueprintue.com/render/${id}/`,
      pageUrl: `https://blueprintue.com/blueprint/${id}/`,
    };
  } catch {
    return null;
  }
};

export const BlueprintUEEmbed = ({ fallbackAlt, fallbackImage, title, url }: BlueprintUEEmbedProps) => {
  const [view, setView] = useState<"graph" | "image">(fallbackImage ? "image" : "graph");
  const urls = getBlueprintUEUrls(url);

  if (!urls) {
    return (
      <aside className="academy-callout border-amber-500/30 bg-amber-500/10 text-amber-300">
        Не удалось встроить BlueprintUE: проверьте публичную ссылку.
      </aside>
    );
  }

  return (
    <figure className="academy-blueprintue">
      <div className="academy-blueprintue__header">
        <figcaption>{title}</figcaption>
        <div className="academy-blueprintue__actions">
          {fallbackImage ? (
            <div aria-label="Способ просмотра Blueprint" className="academy-blueprintue__switcher" role="group">
              <button aria-pressed={view === "image"} onClick={() => setView("image")} type="button">
                <ImageIcon className="h-3.5 w-3.5" />
                Скриншот
              </button>
              <button aria-pressed={view === "graph"} onClick={() => setView("graph")} type="button">
                <Code2 className="h-3.5 w-3.5" />
                Граф
              </button>
            </div>
          ) : null}
          <a href={urls.pageUrl} rel="noreferrer" target="_blank">
            Открыть отдельно
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      {view === "graph" ? (
        <iframe
          allowFullScreen
          className="academy-blueprintue__frame"
          loading="lazy"
          onError={() => fallbackImage && setView("image")}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
          scrolling="no"
          src={urls.embedUrl}
          title={title}
        />
      ) : fallbackImage ? (
        <AcademyImageLightbox
          alt={fallbackAlt || `${title} — резервный скриншот`}
          className="academy-blueprintue__image"
          src={fallbackImage}
        />
      ) : null}
      <p className="academy-blueprintue__fallback">
        {fallbackImage && view === "image"
          ? "Для масштабирования и разбора нод выберите «Граф» или "
          : fallbackImage
            ? "Если граф не загрузился, вернитесь к «Скриншоту» или "
            : "Если граф не загрузился, "}
        <a href={urls.pageUrl} rel="noreferrer" target="_blank">откройте BlueprintUE отдельно</a>.
      </p>
    </figure>
  );
};
