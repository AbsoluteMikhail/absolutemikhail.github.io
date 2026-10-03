import { useEffect, useState, type ComponentType } from "react";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type FieldComponent = ComponentType;

const PixelBugGate = () => {
  const [Field, setField] = useState<FieldComponent | null>(null);

  useEffect(() => {
    const pointer = window.matchMedia(FINE_POINTER_QUERY);
    const motion = window.matchMedia(REDUCED_MOTION_QUERY);
    let cancelled = false;
    let seenGames = false;
    let navigationRequested = false;
    let userScrolled = false;
    let observer: IntersectionObserver | null = null;
    let loaded: FieldComponent | null = null;

    const allowed = () => pointer.matches && !motion.matches;

    const stop = () => {
      observer?.disconnect();
      observer = null;
      setField(null);
    };

    const start = () => {
      if (cancelled || !allowed()) return;
      if (loaded) {
        setField(() => loaded);
        return;
      }
      void import("./PixelBugField").then((mod) => {
        if (cancelled || !allowed()) return;
        const component = mod.default;
        loaded = component;
        setField(() => component);
      });
    };

    const watchGames = () => {
      if (!allowed()) {
        stop();
        return;
      }
      if (seenGames) {
        start();
        return;
      }
      const games = document.getElementById("games");
      if (!games || observer) return;
      observer = new IntersectionObserver((entries) => {
        if (!userScrolled || !entries.some((entry) => entry.isIntersecting)) return;
        seenGames = true;
        observer?.disconnect();
        observer = null;
        start();
      });
      observer.observe(games);
    };

    const requestNavigation = () => { navigationRequested = true; };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Enter"].includes(event.key)) {
        requestNavigation();
      }
    };
    const onScroll = () => {
      // Reload restoration and layout shifts must not restart the game.
      if (!navigationRequested || seenGames || !allowed()) return;
      userScrolled = true;
      const games = document.getElementById("games");
      if (!games) return;
      const bounds = games.getBoundingClientRect();
      // The section may already intersect after a reload, so the observer
      // does not necessarily emit another entry when the reader scrolls.
      if (bounds.top >= window.innerHeight || bounds.bottom <= 0) return;
      seenGames = true;
      observer?.disconnect();
      observer = null;
      start();
    };

    watchGames();
    window.addEventListener("wheel", requestNavigation, { passive: true });
    window.addEventListener("pointerdown", requestNavigation, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    pointer.addEventListener("change", watchGames);
    motion.addEventListener("change", watchGames);
    return () => {
      cancelled = true;
      window.removeEventListener("wheel", requestNavigation);
      window.removeEventListener("pointerdown", requestNavigation);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      pointer.removeEventListener("change", watchGames);
      motion.removeEventListener("change", watchGames);
      stop();
    };
  }, []);

  if (!Field) return null;
  return <Field />;
};

export default PixelBugGate;
