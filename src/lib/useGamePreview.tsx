import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

const previewMediaQuery = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
let stopCurrentPreview: (() => void) | undefined;

export function useGamePreview(previewUrl?: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef(false);
  const failedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    if (activeRef.current) stopCurrentPreview = undefined;
    activeRef.current = false;
    const video = videoRef.current;
    if (video) {
      if (video.getAttribute("src")) video.pause();
      if (video.readyState > 0) video.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  const start = () => {
    const video = videoRef.current;
    if (!video || !previewUrl || activeRef.current || failedRef.current || !window.matchMedia(previewMediaQuery).matches) return;
    stopCurrentPreview?.();
    stopCurrentPreview = stop;
    activeRef.current = true;
    // Assign only on intent: even metadata must not download for untouched cards.
    if (!video.getAttribute("src")) video.src = previewUrl;
    void video.play().catch(() => {
      if (activeRef.current && video.paused) setPlaying(false);
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const media = window.matchMedia(previewMediaQuery);
    const onMediaChange = () => { if (!media.matches) stop(); };
    const onVisibilityChange = () => { if (document.hidden) stop(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop(); });
    observer.observe(video);
    media.addEventListener("change", onMediaChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      if (activeRef.current) stopCurrentPreview = undefined;
      activeRef.current = false;
      if (video.getAttribute("src")) video.pause();
      observer.disconnect();
      media.removeEventListener("change", onMediaChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [stop]);

  return {
    previewEvents: {
      onPointerEnter: (event: PointerEvent) => { if (event.pointerType !== "touch") start(); },
      onPointerLeave: stop,
      onFocus: start,
      onBlur: stop,
    },
    preview: previewUrl && <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={() => { if (activeRef.current) setPlaying(true); else videoRef.current?.pause(); }}
      onPause={() => setPlaying(false)}
      onError={() => { failedRef.current = true; stop(); }}
      className={cn("pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 motion-reduce:hidden", playing && "opacity-100")}
    />,
  };
}
