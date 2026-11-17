import heroCollage from "@/assets/studio/hero-collage.webp";
import studioLogo from "@/assets/studio/gamepunk-logo.svg";
import unrealSticker from "@/assets/studio/unreal-five-sticker.webp";
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
          <h1><span><mark>{copy.hero[0]}</mark>.</span><span>{copy.hero[1]}</span><span>{copy.hero[2]}</span></h1>
          <p className="studio-snippet-description">{copy.description}<br />{copy.descriptionEnd}</p>
          <p className="studio-snippet-label">{copy.independent[0]}<br />{copy.independent[1]}</p>
          <div className="studio-snippet-collage">
            <img className="studio-snippet-art" src={heroCollage} width="1088" height="1440" alt={copy.collageAlt} />
            <img className="studio-snippet-sticker" src={unrealSticker} width="384" height="351" alt={copy.stickerAlt} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudioSnippet;
