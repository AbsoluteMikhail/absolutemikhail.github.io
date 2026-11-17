import { useEffect, type RefObject } from "react";
import { trackAnalytics } from "@/lib/analytics";

export function useRutubeAnalytics(open: boolean, player: RefObject<HTMLIFrameElement>, projectId: string) {
  useEffect(() => {
    if (!open) return;
    let started = false;
    let completed = false;
    let duration = 0;
    const milestones = new Set<number>();
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== "https://rutube.ru" || !player.current?.contentWindow || event.source !== player.current.contentWindow) return;
      let message: unknown = event.data;
      if (typeof message === "string") {
        try { message = JSON.parse(message); } catch { return; }
      }
      if (!message || typeof message !== "object" || !("type" in message) || !("data" in message)) return;
      const data = message.data;
      if (!data || typeof data !== "object") return;
      if (message.type === "player:durationChange" && "duration" in data && typeof data.duration === "number" && Number.isFinite(data.duration) && data.duration > 0) {
        duration = data.duration;
      }
      if (message.type === "player:currentTime") {
        // Current embeds use currentTime; Rutube's published API also documents time.
        const time = "currentTime" in data ? data.currentTime : "time" in data ? data.time : null;
        if (typeof time !== "number" || !Number.isFinite(time) || time <= 0) return;
        if (!started) {
          started = true;
          trackAnalytics("video_start", { project_id: projectId });
        }
        if (duration > 0) for (const percent of [25, 50, 75]) {
          if (time / duration * 100 >= percent && !milestones.has(percent)) {
            milestones.add(percent);
            trackAnalytics("video_progress", { project_id: projectId, video_percent: percent });
          }
        }
      }
      if (message.type === "player:playComplete" && started && !completed) {
        completed = true;
        trackAnalytics("video_complete", { project_id: projectId, video_percent: 100 });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, player, projectId]);
}
