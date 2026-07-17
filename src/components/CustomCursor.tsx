import { useEffect, useRef, useState } from "react";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, select, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], [data-cursor="interactive"]';
const NATIVE_CURSOR_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"], [class*="cursor-grab"], [class*="cursor-grabbing"]';

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pointerQuery = window.matchMedia(FINE_POINTER_QUERY);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateAvailability = () =>
      setEnabled(pointerQuery.matches && !motionQuery.matches);

    updateAvailability();
    pointerQuery.addEventListener("change", updateAvailability);
    motionQuery.addEventListener("change", updateAvailability);

    return () => {
      pointerQuery.removeEventListener("change", updateAvailability);
      motionQuery.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor-enabled");

    let animationFrame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;

    const setPosition = (element: HTMLElement, x: number, y: number) => {
      element.style.setProperty("--cursor-x", `${x}px`);
      element.style.setProperty("--cursor-y", `${y}px`);
    };

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;
      setPosition(ring, ringX, ringY);
      animationFrame = window.requestAnimationFrame(animateRing);
    };

    const showCursor = () => {
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
    };

    const hideCursor = () => {
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      setPosition(dot, targetX, targetY);
      showCursor();
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const useNativeCursor = Boolean(target?.closest(NATIVE_CURSOR_SELECTOR));
      const interactive = Boolean(target?.closest(INTERACTIVE_SELECTOR));

      dot.classList.toggle("is-hidden", useNativeCursor);
      ring.classList.toggle("is-hidden", useNativeCursor);
      dot.classList.toggle("is-interactive", interactive && !useNativeCursor);
      ring.classList.toggle("is-interactive", interactive && !useNativeCursor);
    };

    const handlePointerDown = () => {
      dot.classList.add("is-pressed");
      ring.classList.add("is-pressed");
    };

    const handlePointerUp = () => {
      dot.classList.remove("is-pressed");
      ring.classList.remove("is-pressed");
    };

    setPosition(dot, targetX, targetY);
    setPosition(ring, ringX, ringY);
    animationFrame = window.requestAnimationFrame(animateRing);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    document.documentElement.addEventListener("mouseenter", showCursor);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      document.documentElement.removeEventListener("mouseenter", showCursor);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="custom-cursor custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor custom-cursor-dot" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
