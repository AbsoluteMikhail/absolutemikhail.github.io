import { useEffect, useState } from "react";
import type { AcademyHeading } from "@/lib/academyMarkdown";
import { saveAcademyProgress } from "@/lib/academyProgress";

export const READING_SAVE_DELAY = 8000;

export const useReadingProgress = (pageKey: string, headings: AcademyHeading[]) => {
  const [reading, setReading] = useState({ percent: 0, activeHeading: "" });

  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-academy-reading]");
    if (!article) return;
    let frame = 0;
    let timer: number | undefined;
    let pending: { percent: number; heading: string } | undefined;
    const cancelSave = () => {
      window.clearTimeout(timer);
      timer = undefined;
      pending = undefined;
    };
    const update = () => {
      frame = 0;
      const bounds = article.getBoundingClientRect();
      const start = Math.max(0, bounds.top + window.scrollY - 96);
      const end = bounds.bottom + window.scrollY - window.innerHeight;
      const percent = end <= start
        ? (bounds.bottom <= window.innerHeight ? 100 : 0)
        : Math.floor(Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))) * 100);
      let activeHeading = "";
      for (const heading of headings) {
        if (heading.depth < 2 || heading.depth > 3) continue;
        const target = document.getElementById(heading.id);
        if (target && target.getBoundingClientRect().top <= 128) activeHeading = heading.id;
      }
      setReading((previous) => previous.percent === percent && previous.activeHeading === activeHeading
        ? previous : { percent, activeHeading });
      if (pending && (pending.percent !== percent || pending.heading !== activeHeading)) cancelSave();
      if (percent > 0 && document.visibilityState === "visible" && timer === undefined) {
        pending = { percent, heading: activeHeading };
        timer = window.setTimeout(() => {
          if (pending && document.visibilityState === "visible") saveAcademyProgress(pageKey, pending.percent, pending.heading);
          cancelSave();
        }, READING_SAVE_DELAY);
      }
    };
    const schedule = () => {
      cancelSave();
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pagehide", cancelSave);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") cancelSave();
      else schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    observer?.observe(article);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      cancelSave();
      window.removeEventListener("pagehide", cancelSave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pageKey, headings]);

  return reading;
};
