import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/constants/projects";
import { studioCopy, studioGameDescriptions } from "@/constants/studioCopy";
import type { StudioLocale } from "@/lib/studioLocale";
import { useGamePreview } from "@/lib/useGamePreview";
import { trackAnalytics } from "@/lib/analytics";
import { useRutubeAnalytics } from "@/lib/useRutubeAnalytics";
import Modal from "@/components/ui/modal";
import { buttonStyles } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

export default function StudioGameCard({ project, index, locale }: { project: Project; index: number; locale: StudioLocale }) {
  const copy = studioCopy[locale];
  const title = project.slug === "gribnik" ? "G.R.I.B.N.I.K." : project.title;
  const [open, setOpen] = useState(false);
  const videoUrl = project.videoUrl ? new URL(project.videoUrl) : null;
  videoUrl?.searchParams.delete("autoplay");
  const trigger = useRef<HTMLAnchorElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  useRutubeAnalytics(open, player, project.slug);
  const titleId = useId();
  const { preview, previewEvents } = useGamePreview(project.previewUrl);
  const description = locale === "en" ? studioGameDescriptions[project.slug] ?? project.shortDesc : project.shortDesc;
  const status = project.stats === "В разработке" ? copy.inDevelopment : project.stats === "В релизе" ? copy.released : project.stats;

  return <>
    <Link
      ref={trigger}
      to={`/projects/${project.slug}/`}
      className={`studio-project studio-project-${index + 1}`}
      aria-label={`${copy.openGame}: ${title}`}
      aria-haspopup="dialog"
      {...previewEvents}
      onClick={(event) => {
        trackAnalytics("project_open", { project_id: project.slug, placement: "project_card" });
        // Keep normal links for no-JS visitors and modifier-clicks into the archive.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        previewEvents.onBlur();
        setOpen(true);
      }}
    >
      <div className="studio-project-image">
        <img src={project.cover} srcSet={project.coverSrcSet} sizes={index === 0 ? "(max-width: 600px) 100vw, 60vw" : "(max-width: 600px) 100vw, 40vw"} width={project.coverWidth} height={project.coverHeight} loading={index === 0 ? "eager" : "lazy"} decoding="async" alt={`${copy.cover} ${title}`} />
        {preview}
      </div>
      <div className="studio-project-caption"><div><h3>{title}</h3><p>{copy.gameTypes[index]}</p></div><ArrowUpRight aria-hidden="true" /></div>
    </Link>
    <Modal isOpen={open} onClose={() => setOpen(false)} labelledBy={titleId} returnFocusRef={trigger} className="studio-game-dialog">
      <article className="studio-page studio-game-sheet" lang={locale}>
        <header className="studio-game-head">
          <div><p className="studio-game-kicker">{copy.gameDialog}</p><h2 id={titleId}>{title}</h2></div>
          <IconButton variant="quiet" className="studio-game-close" aria-label={copy.closeGame} onClick={() => setOpen(false)}><X aria-hidden="true" /></IconButton>
        </header>
        <div className="studio-game-body">
          <div className="studio-game-media">
            {videoUrl
              ? <iframe ref={player} src={videoUrl.href} title={`${copy.gameVideo}: ${title}`} allowFullScreen />
              : <img src={project.cover} width={project.coverWidth} height={project.coverHeight} alt={`${copy.cover} ${title}`} />}
          </div>
          {project.videoUrl && <a className="studio-text-link" href={project.videoUrl} target="_blank" rel="noopener noreferrer">{copy.openVideoSeparately}<ArrowUpRight aria-hidden="true" /></a>}
          <div className="studio-game-meta"><span>{status}</span><span>{project.genre}</span></div>
          <p className="studio-game-description">{description}</p>
          <div className="studio-game-actions">
            {project.storeLinks?.map(store => <a key={store.url} className={buttonStyles({ variant: "unstyled", size: "none", effect: "none", className: "studio-button" })} href={store.url} target="_blank" rel="noopener noreferrer">{store.label}<ArrowUpRight aria-hidden="true" /></a>)}
            <Link className="studio-text-link" to={`/projects/${project.slug}/`} onClick={() => setOpen(false)}>{copy.fullProject}<ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
      </article>
    </Modal>
  </>;
}
