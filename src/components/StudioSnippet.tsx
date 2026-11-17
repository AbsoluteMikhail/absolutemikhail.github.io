import { StudioHeroCollage, StudioHeroTitle } from "@/components/StudioHero";
import studioLogo from "@/assets/studio/gamepunk-logo.svg";
import { studioCopy } from "@/constants/studioCopy";
import type { StudioLocale } from "@/lib/studioLocale";
import "@/components/studio-snippet.css";

const StudioSnippet = ({ locale }: { locale: StudioLocale }) => {
  const copy = studioCopy[locale];
  return (
    <main className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="snippet-frame">
        <div id="og-snippet-container" className="studio-page studio-snippet" lang={locale}>
          <img className="studio-snippet-logo" src={studioLogo} width="1756" height="551" alt="GamePunk" />
          <StudioHeroTitle locale={locale} />
          <p className="studio-snippet-description">{copy.description}<br />{copy.descriptionEnd}</p>
          <p className="studio-snippet-label">{copy.independent[0]}<br />{copy.independent[1]}</p>
          <StudioHeroCollage locale={locale} className="studio-snippet-collage" />
        </div>
      </div>
    </main>
  );
};

export default StudioSnippet;
