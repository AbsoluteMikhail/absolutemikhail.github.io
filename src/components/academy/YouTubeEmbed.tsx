type YouTubeEmbedProps = {
  title?: string;
  url: string;
};

const getYouTubeId = (url: string) => {
  const trimmedUrl = url.trim();

  try {
    const parsedUrl = new URL(trimmedUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com") {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

      if (pathParts[0] === "embed" || pathParts[0] === "shorts") {
        return pathParts[1] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const YouTubeEmbed = ({ title = "YouTube video", url }: YouTubeEmbedProps) => {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <a className="text-primary underline underline-offset-4" href={url} rel="noreferrer" target="_blank">
        {title}
      </a>
    );
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card/40">
      <div className="aspect-video w-full bg-black">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
        />
      </div>
      {title ? (
        <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          {title}
        </figcaption>
      ) : null}
    </figure>
  );
};
