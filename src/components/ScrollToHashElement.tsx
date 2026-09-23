import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToHashElement = () => {
  const { hash, key } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!hash) {
      // A new page starts at the top, including returning home from Academy.
      // Leave browser Back/Forward restoration and initial loads alone.
      if (navigationType !== "POP") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // A malformed escape sequence must not break navigation.
    }

    let frame = 0;
    const scrollToTarget = () => {
      frame = 0;
      const element = document.getElementById(id);
      if (!element) return;
      observer.disconnect();
      element.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    };
    const scheduleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(scrollToTarget);
    };
    // Lazy routes can commit after this effect. Observe DOM additions until
    // the destination exists, and scroll after the page's mount effects.
    const observer = new MutationObserver(scheduleScroll);
    observer.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true });
    scheduleScroll();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [hash, key, navigationType]);

  return null;
};

export default ScrollToHashElement;
