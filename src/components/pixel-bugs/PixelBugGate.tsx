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
        if (!entries.some((entry) => entry.isIntersecting)) return;
        seenGames = true;
        observer?.disconnect();
        observer = null;
        start();
      });
      observer.observe(games);
    };

    watchGames();
    pointer.addEventListener("change", watchGames);
    motion.addEventListener("change", watchGames);
    return () => {
      cancelled = true;
      pointer.removeEventListener("change", watchGames);
      motion.removeEventListener("change", watchGames);
      stop();
    };
  }, []);

  if (!Field) return null;
  return <Field />;
};

export default PixelBugGate;
