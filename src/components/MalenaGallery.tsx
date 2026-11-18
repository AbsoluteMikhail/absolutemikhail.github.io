import { useId, useState, type RefObject } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import Modal from "@/components/ui/modal";
import { IconButton } from "@/components/ui/icon-button";
import { buttonStyles } from "@/components/ui/button";
import { studioCopy } from "@/constants/studioCopy";
import type { StudioLocale } from "@/lib/studioLocale";
import { workshop } from "@/constants/workshop";
import { cn } from "@/lib/utils";

interface MalenaGalleryProps {
  onClose: () => void;
  studioLocale?: StudioLocale;
  returnFocusRef?: RefObject<HTMLElement>;
}

const MalenaGallery = ({ onClose, studioLocale, returnFocusRef }: MalenaGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const titleId = useId();
  const { portraits } = workshop.malena;
  const currentPortrait = portraits[currentIndex];
  const en = studioLocale === "en";
  const copy = studioLocale && studioCopy[studioLocale];
  const caption = en ? currentPortrait.en : currentPortrait;
  const move = (step: number) => {
    setCurrentIndex((index) => (index + step + portraits.length) % portraits.length);
  };

  return (
    <Modal isOpen onClose={onClose} labelledBy={titleId} returnFocusRef={returnFocusRef} className={copy ? "studio-game-dialog" : "p-2 sm:p-4"}>
      <div
        lang={studioLocale}
        className={copy ? "studio-page studio-game-sheet studio-malena-sheet" : "flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:max-h-[calc(100dvh-2rem)]"}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className={copy ? "studio-game-head" : "flex shrink-0 items-center justify-between gap-3 px-4 py-3"}>
          <div>
            {copy && <p className="studio-game-kicker">{copy.malenaCategory}</p>}
            <h2 id={titleId} className="font-display text-base font-bold sm:text-lg">{copy?.malena ?? workshop.malena.caption}</h2>
          </div>
          <IconButton aria-label={en ? "Close gallery" : "Закрыть галерею"} onClick={onClose} className={copy ? "studio-game-close" : "h-11 w-11 shrink-0"}>
            <X aria-hidden="true" className="h-5 w-5" />
          </IconButton>
        </div>

        {copy && <div className="studio-malena-about studio-game-body">
          <p className="studio-game-description">{copy.malenaDescription}</p>
          <p className="studio-game-description">{copy.malenaAlbumNote}</p>
          <div className="studio-game-actions">
            <a href={workshop.malena.url} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "unstyled", size: "none", effect: "none", className: "studio-button" })}>
              {en ? "Chat with Malena" : workshop.malena.linkLabel}<ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>}
        <div className="min-h-0 bg-background">
          <img
            key={currentPortrait.src}
            src={currentPortrait.src}
            width={896}
            height={1200}
            alt={caption.alt}
            decoding="async"
            className={copy ? "studio-malena-portrait" : "h-[min(65dvh,48rem)] max-h-[calc(100dvh-15rem)] min-h-0 w-full object-contain"}
          />
        </div>

        <div className="shrink-0 space-y-2 px-3 pb-3 pt-2 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <IconButton aria-label={en ? "Previous portrait" : "Предыдущий портрет"} onClick={() => move(-1)} className="h-11 w-11 shrink-0">
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </IconButton>
            <p role="status" aria-live="polite" aria-atomic="true" className="text-center text-sm text-muted-foreground">
              {currentIndex + 1} / {portraits.length} · {caption.title}
            </p>
            <IconButton aria-label={en ? "Next portrait" : "Следующий портрет"} onClick={() => move(1)} className="h-11 w-11 shrink-0">
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </IconButton>
          </div>

          <div role="group" aria-label={en ? "Choose a portrait" : "Выбрать портрет"} className="mx-auto grid max-w-sm grid-cols-6 gap-1.5 p-1 sm:gap-2">
            {portraits.map((portrait, index) => (
              <button
                key={portrait.src}
                data-cursor="view"
                type="button"
                aria-label={en ? `View portrait ${index + 1}: ${portrait.en.title}` : `Открыть портрет ${index + 1}: ${portrait.title}`}
                aria-current={currentIndex === index ? "true" : undefined}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "min-h-11 min-w-0 overflow-hidden rounded-md border-2 transition-colors",
                  currentIndex === index ? "border-primary" : "border-transparent hover:border-primary/50",
                )}
              >
                <img src={portrait.thumbnail} width={160} height={214} alt="" decoding="async" className="aspect-[3/4] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MalenaGallery;
