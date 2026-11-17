import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { studioCopy } from "@/constants/studioCopy";
import type { StudioLocale } from "@/lib/studioLocale";
import { cn } from "@/lib/utils";

interface StudioPortraitProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  locale: StudioLocale;
  bartsev?: boolean;
  children: ReactNode;
}

const StudioPortrait = ({ src, alt, width, height, locale, bartsev, children }: StudioPortraitProps) => {
  const copy = studioCopy[locale];
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const image = useRef<HTMLImageElement>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout>>();
  const clearRetry = useCallback(() => {
    clearTimeout(retryTimer.current);
    retryTimer.current = undefined;
  }, []);
  const loaded = useCallback(() => {
    clearRetry();
    setStatus("loaded");
  }, [clearRetry]);
  const failed = useCallback(() => {
    if (attempt > 0) { setStatus("error"); return; }
    setStatus("loading");
    if (retryTimer.current !== undefined) return;
    // One delayed retry bypasses a cached failure without creating a request loop.
    retryTimer.current = setTimeout(() => {
      retryTimer.current = undefined;
      setStatus("loading");
      setAttempt(1);
    }, 800);
  }, [attempt]);

  useEffect(() => {
    if (image.current?.complete) {
      if (image.current.naturalWidth > 0) loaded();
      else failed();
    }
    return clearRetry;
  }, [attempt, src, loaded, failed, clearRetry]);

  return (
    <div className={cn("studio-portrait", bartsev && "studio-portrait-bartsev")} data-state={status}>
      <div className={bartsev ? "studio-portrait-crop" : "studio-portrait-image"}>
        <img key={attempt} ref={image} src={attempt ? `${src}${src.includes("?") ? "&" : "?"}portrait-retry=${attempt}` : src}
          width={width} height={height} loading="lazy" decoding="async" alt={alt} onLoad={loaded} onError={failed} />
      </div>
      {status === "loaded" && children}
      {status === "error" && <div className="studio-portrait-error">
        <p role="status">{copy.photoError}</p>
        <Button variant="unstyled" size="none" effect="none" aria-label={`${copy.photoRetry}: ${alt}`} onClick={() => {
          setStatus("loading"); setAttempt(value => value + 1);
        }}>{copy.photoRetry}</Button>
      </div>}
    </div>
  );
};

export default StudioPortrait;
