import heroCollage from "@/assets/studio/hero-collage.webp";
import { studioCopy } from "@/constants/studioCopy";
import type { StudioLocale } from "@/lib/studioLocale";

export function StudioHeroTitle({ locale }: { locale: StudioLocale }) {
  const { hero } = studioCopy[locale];
  return (
    <h1 id="studio-title">
      <span className="studio-title-line"><span className="studio-title-highlight">{hero[0]}</span></span>{" "}
      <span className="studio-title-line">
        <span className="studio-title-marked">{hero[1]}
          <svg viewBox="0 0 600 24" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path d="M7 17C126 4 357 5 591 13" /><path d="M13 19C153 9 375 7 587 15" />
          </svg>
        </span>
      </span>
    </h1>
  );
}

export function StudioHeroCollage({ locale, className }: { locale: StudioLocale; className: string }) {
  const copy = studioCopy[locale];
  return (
    <div className={className}>
      <img className="studio-collage-art" src={heroCollage} width="1088" height="1440" alt={copy.collageAlt} {...{ fetchpriority: "high" }} />
      <span className="studio-character-sticker">
        {copy.characterSticker}<br />
        <small>{copy.releaseNote}</small>
      </span>
    </div>
  );
}
