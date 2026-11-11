import { Link } from "react-router-dom";
import type { Project } from "@/constants/projects";
import { trailingPath } from "@/constants/routeMetadata.js";
import { projectPath } from "@/lib/projectPages";
import { useGamePreview } from "@/lib/useGamePreview";

export default function GameCoverPreview({ project, priority = false }: { project: Project; priority?: boolean }) {
  const { preview, previewEvents } = useGamePreview(project.previewUrl);

  return (
    <Link
      to={trailingPath(projectPath(project.slug))}
      aria-label={`Подробнее об игре ${project.title}`}
      className="group relative block overflow-hidden rounded-xl bg-card"
      {...previewEvents}
    >
      <img
        src={project.cover}
        srcSet={project.coverSrcSet}
        sizes="(min-width: 1280px) 596px, (min-width: 768px) calc((100vw - 88px) / 2), calc(100vw - 48px)"
        width={project.coverWidth}
        height={project.coverHeight}
        alt={`Обложка игры ${project.title}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="aspect-video w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
      />
      {preview}
    </Link>
  );
}
