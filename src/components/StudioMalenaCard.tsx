import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import MalenaGallery from "@/components/MalenaGallery";
import { studioCopy } from "@/constants/studioCopy";
import { workshop } from "@/constants/workshop";
import { trackAnalytics } from "@/lib/analytics";
import type { StudioLocale } from "@/lib/studioLocale";
import { useGamePreview } from "@/lib/useGamePreview";

export default function StudioMalenaCard({ locale }: { locale: StudioLocale }) {
  const copy = studioCopy[locale];
  const { malena } = workshop;
  const trigger = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const { preview, previewEvents } = useGamePreview(malena.previewUrl);

  return <>
    <a ref={trigger} href={malena.url} target="_blank" rel="noopener noreferrer"
      className="studio-project studio-project-3" aria-haspopup="dialog" aria-label={copy.openMalena}
      {...previewEvents}
      onClick={(event) => {
        trackAnalytics("project_open", { project_id: "malena", placement: "project_card" });
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        previewEvents.onBlur();
        setOpen(true);
      }}>
      <div className="studio-project-image">
        <img src={malena.studioCover} srcSet={malena.studioCoverSrcSet} sizes="(max-width: 600px) 100vw, 40vw"
          width="960" height="540" loading="lazy" decoding="async" alt={copy.malenaAlt} />
        {preview}
      </div>
      <div className="studio-project-caption"><div><h3>{copy.malena}</h3><p>{copy.malenaType}</p></div><ArrowUpRight aria-hidden="true" /></div>
    </a>
    {open && <MalenaGallery studioLocale={locale} onClose={() => setOpen(false)} returnFocusRef={trigger} />}
  </>;
}
