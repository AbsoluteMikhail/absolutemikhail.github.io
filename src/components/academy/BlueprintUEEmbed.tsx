import { ExternalLink } from "lucide-react";

type BlueprintUEEmbedProps = {
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

export const BlueprintUEEmbed = ({ title, url }: BlueprintUEEmbedProps) => {
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
        <a href={urls.pageUrl} rel="noreferrer" target="_blank">
          Открыть отдельно
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <iframe
        allowFullScreen
        className="academy-blueprintue__frame"
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups"
        src={urls.embedUrl}
        title={title}
      />
      <p className="academy-blueprintue__fallback">
        Не загрузилось? <a href={urls.pageUrl} rel="noreferrer" target="_blank">Откройте BlueprintUE в новой вкладке</a>.
      </p>
    </figure>
  );
};
