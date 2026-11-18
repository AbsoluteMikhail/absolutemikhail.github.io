import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

const previewMediaQuery = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const mobilePreviewQuery = "(hover: none) and (pointer: coarse) and (prefers-reduced-motion: no-preference)";
const visibleFraction = 0.6;
let stopCurrentPreview: (() => void) | undefined;

type PreviewControls = { start: () => void; stop: () => void };
let previewGroup: ReturnType<typeof createPreviewGroup> | undefined;

function createPreviewGroup() {
  const cards = new Map<Element, PreviewControls>();
  // Insertion order remembers which cover most recently crossed the threshold.
  const visible = new Set<Element>();
  const mobile = window.matchMedia(mobilePreviewQuery);
  const hover = window.matchMedia(previewMediaQuery);
  const updatePlayback = () => {
    if (document.hidden || document.body.classList.contains("modal-open")) {
      stopCurrentPreview?.();
    } else if (mobile.matches) {
      const latest = Array.from(visible).pop();
      if (latest) cards.get(latest)?.start();
      else stopCurrentPreview?.();
    }
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!cards.has(entry.target) || (entry.target as HTMLVideoElement).error) continue;
      if (entry.isIntersecting && entry.intersectionRatio >= visibleFraction) visible.add(entry.target);
      else visible.delete(entry.target);
      if (!entry.isIntersecting) cards.get(entry.target)?.stop();
    }
    updatePlayback();
  }, { threshold: [0, visibleFraction] });
  const onMediaChange = () => { stopCurrentPreview?.(); updatePlayback(); };
  const modalObserver = new MutationObserver(updatePlayback);
  modalObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", updatePlayback);
  mobile.addEventListener("change", onMediaChange);
  hover.addEventListener("change", onMediaChange);

  return {
    observe(video: HTMLVideoElement, controls: PreviewControls) {
      cards.set(video, controls);
      observer.observe(video);
      return () => {
        observer.unobserve(video);
        visible.delete(video);
        cards.delete(video);
        if (stopCurrentPreview === controls.stop) controls.stop();
        if (cards.size) {
          updatePlayback();
          return;
        }
        observer.disconnect();
        modalObserver.disconnect();
        document.removeEventListener("visibilitychange", updatePlayback);
        mobile.removeEventListener("change", onMediaChange);
        hover.removeEventListener("change", onMediaChange);
        previewGroup = undefined;
      };
    },
    skip(video: HTMLVideoElement) {
      if (visible.delete(video)) updatePlayback();
    },
  };
}

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

  const start = useCallback(() => {
    const video = videoRef.current;
    if (!video || !previewUrl || activeRef.current || failedRef.current || document.hidden || document.body.classList.contains("modal-open")) return;
    stopCurrentPreview?.();
    stopCurrentPreview = stop;
    activeRef.current = true;
    // Defer even the metadata request until playback is needed.
    if (!video.getAttribute("src")) video.src = previewUrl;
    void video.play().catch(() => {
      if (activeRef.current && video.paused) {
        stop();
        previewGroup?.skip(video);
      }
    });
  }, [previewUrl, stop]);

  const startOnIntent = () => {
    if (window.matchMedia(previewMediaQuery).matches) start();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    previewGroup ??= createPreviewGroup();
    return previewGroup.observe(video, { start, stop });
  }, [start, stop]);

  return {
    previewEvents: {
      onPointerEnter: (event: PointerEvent) => { if (event.pointerType !== "touch") startOnIntent(); },
      onPointerLeave: (event: PointerEvent) => { if (event.pointerType !== "touch") stop(); },
      onFocus: startOnIntent,
      onBlur: () => { if (window.matchMedia(previewMediaQuery).matches) stop(); },
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
      onError={event => { failedRef.current = true; stop(); previewGroup?.skip(event.currentTarget); }}
      className={cn("pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 motion-reduce:hidden", playing && "opacity-100")}
    />,
  };
}
