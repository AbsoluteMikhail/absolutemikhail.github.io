import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, select, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], [data-cursor="interactive"]';
const NATIVE_CURSOR_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"], [class*="cursor-grab"], [class*="cursor-grabbing"]';
// Cross-origin players keep their own cursor and swallow pointer events.
// A same-document <video> still receives events, so the crosshair can follow it.
const EMBEDDED_PLAYER_SELECTOR = "iframe, embed, object";

const CURSOR_LABELS: Record<string, string> = {
  play: "PLAY",
  read: "READ",
  view: "VIEW",
  external: "OPEN",
};

const SPARK_COUNT = 6;
const SPARK_MS = 280;

const isExternalAnchor = (anchor: Element) => {
  if (anchor.getAttribute("target") === "_blank") return true;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("/") || href.startsWith("#") || href.startsWith("?") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    return new URL(href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
};

const resolveCursorLabel = (target: Element | null) => {
  if (!target) return "";
  const marked = target.closest("[data-cursor]");
  const token = marked?.getAttribute("data-cursor")?.trim().toLowerCase() ?? "";
  if (token in CURSOR_LABELS) return CURSOR_LABELS[token];
  const anchor = target.closest("a[href]");
  return anchor && isExternalAnchor(anchor) ? CURSOR_LABELS.external : "";
};

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [cursorLayer, setCursorLayer] = useState<HTMLDivElement | null>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const sparkHostRef = useRef<HTMLDivElement | null>(null);

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

    const layer = document.createElement("div");
    layer.className = "custom-cursor-layer";
    layer.setAttribute("aria-hidden", "true");
    const sparkHost = document.createElement("div");
    sparkHost.className = "cursor-spark-host";
    layer.appendChild(sparkHost);
    sparkHostRef.current = sparkHost;

    const updateLayer = () => {
      const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>("dialog[open]"));
      const target = dialogs.reverse().find((dialog) => dialog.matches(":modal")) ?? document.body;
      // A modal lives in the browser's top layer. Move the portal host into it
      // while preserving the same cursor elements and their current position.
      if (layer.parentElement !== target) target.appendChild(layer);
    };
    updateLayer();
    setCursorLayer(layer);
    const observer = new MutationObserver(updateLayer);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });

    return () => {
      observer.disconnect();
      sparkHostRef.current = null;
      layer.remove();
      setCursorLayer(null);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const reticle = reticleRef.current;
    const label = labelRef.current;
    const sparkHost = sparkHostRef.current;
    if (!reticle || !label || !sparkHost) return;

    document.documentElement.classList.add("custom-cursor-enabled");

    let frame = 0;
    let queued = false;
    let hasPosition = false;
    let x = -100;
    let y = -100;
    let moveX = 0;
    let moveY = 0;
    let useNativeCursor = false;
    let overEmbedded = false;
    const timers = new Set<number>();

    const paint = () => {
      queued = false;
      const flip = x > window.innerWidth - 88;
      const raise = y > window.innerHeight - 40;
      for (const element of [reticle, label]) {
        element.style.setProperty("--cursor-x", `${x}px`);
        element.style.setProperty("--cursor-y", `${y}px`);
        element.classList.toggle("is-label-flip", flip);
        element.classList.toggle("is-label-raise", raise);
      }
      if (!useNativeCursor) reticle.classList.add("is-visible");
    };

    const queuePaint = () => {
      if (queued) return;
      queued = true;
      frame = window.requestAnimationFrame(paint);
    };

    const applyPointerTarget = (target: Element | null) => {
      const interactive = Boolean(target?.closest(INTERACTIVE_SELECTOR));
      const embedded = Boolean(target?.closest(EMBEDDED_PLAYER_SELECTOR));
      useNativeCursor = embedded || (Boolean(target?.closest(NATIVE_CURSOR_SELECTOR)) && !interactive);
      reticle.classList.toggle("is-hidden", useNativeCursor);
      if (useNativeCursor) reticle.classList.remove("is-visible");

      const caption = useNativeCursor ? "" : resolveCursorLabel(target);
      if (label.textContent !== caption) label.textContent = caption;
      label.classList.toggle("is-on", caption !== "");
      reticle.classList.toggle("is-focused", !useNativeCursor && (interactive || caption !== ""));
      if (!useNativeCursor && hasPosition) reticle.classList.add("is-visible");

      if (overEmbedded && !embedded) {
        // Chrome can keep the frame's arrow after the pointer comes back.
        document.documentElement.style.setProperty("cursor", "none", "important");
      }
      overEmbedded = embedded;
    };

    const syncFromPoint = () => {
      if (!hasPosition) return;
      const hit = document.elementFromPoint(x, y);
      if (hit instanceof Element) applyPointerTarget(hit);
    };

    const showCursor = () => {
      if (!hasPosition) return;
      const hit = document.elementFromPoint(x, y);
      if (hit instanceof Element) {
        applyPointerTarget(hit);
        return;
      }
      if (!useNativeCursor) reticle.classList.add("is-visible");
    };

    const hideCursor = () => {
      reticle.classList.remove("is-visible");
      label.classList.remove("is-on");
      if (!hasPosition) return;
      const hit = document.elementFromPoint(x, y);
      if (hit instanceof Element && hit.closest(EMBEDDED_PLAYER_SELECTOR)) applyPointerTarget(hit);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const nextX = Math.round(event.clientX);
      const nextY = Math.round(event.clientY);
      if (hasPosition) {
        moveX = nextX - x;
        moveY = nextY - y;
      }
      hasPosition = true;
      x = nextX;
      y = nextY;
      const target = event.target instanceof Element ? event.target : null;
      if (target) applyPointerTarget(target);
      queuePaint();
    };

    const handlePointerOver = (event: PointerEvent) => {
      // Inside a frame the page stops receiving moves, so the stored point is stale.
      // Place the crosshair at the boundary as soon as the pointer re-enters the page.
      if (Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
        x = Math.round(event.clientX);
        y = Math.round(event.clientY);
        hasPosition = true;
      }
      const target = event.target instanceof Element ? event.target : null;
      applyPointerTarget(target);
      queuePaint();
    };

    const removeSpark = (spark: HTMLElement) => {
      spark.remove();
    };

    const spawnSpark = (originX: number, originY: number, dx: number, dy: number, kind: "shard" | "flash" | "trail") => {
      while (sparkHost.childElementCount > 36) sparkHost.firstElementChild?.remove();
      const spark = document.createElement("span");
      spark.className = kind === "flash" ? "cursor-spark cursor-spark-flash" : "cursor-spark";
      if (kind === "trail") spark.classList.add("cursor-spark-trail");
      spark.style.setProperty("--spark-x", `${originX}px`);
      spark.style.setProperty("--spark-y", `${originY}px`);
      spark.style.setProperty("--spark-dx", `${dx}px`);
      spark.style.setProperty("--spark-dy", `${dy}px`);
      sparkHost.appendChild(spark);
      spark.addEventListener("animationend", () => removeSpark(spark), { once: true });
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        removeSpark(spark);
      }, SPARK_MS + 80);
      timers.add(timer);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (useNativeCursor || event.button !== 0) return;
      const originX = Math.round(event.clientX);
      const originY = Math.round(event.clientY);
      for (let index = 0; index < SPARK_COUNT; index += 1) {
        const angle = (Math.PI * 2 * index) / SPARK_COUNT + (Math.random() - 0.5) * 0.45;
        const distance = 12 + Math.random() * 14;
        spawnSpark(originX, originY, Math.cos(angle) * distance, Math.sin(angle) * distance, "shard");
      }
      spawnSpark(originX, originY, 0, 0, "flash");
      const speed = Math.hypot(moveX, moveY);
      if (speed > 3) {
        const backX = -moveX / speed;
        const backY = -moveY / speed;
        spawnSpark(originX, originY, backX * 10, backY * 10, "trail");
        spawnSpark(originX + backX * 6, originY + backY * 6, backX * 16, backY * 16, "trail");
      }
    };

    const scheduleSync = () => {
      window.requestAnimationFrame(syncFromPoint);
    };

    const embeddedObserver = new MutationObserver((records) => {
      const relevant = records.some((record) =>
        [...record.addedNodes, ...record.removedNodes].some((node) =>
          node instanceof Element &&
          (node.matches(EMBEDDED_PLAYER_SELECTOR) || node.querySelector(EMBEDDED_PLAYER_SELECTOR) !== null),
        ),
      );
      if (relevant) scheduleSync();
    });
    embeddedObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", scheduleSync, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    document.documentElement.addEventListener("mouseenter", showCursor);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      document.documentElement.style.removeProperty("cursor");
      embeddedObserver.disconnect();
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", scheduleSync);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      document.documentElement.removeEventListener("mouseenter", showCursor);
    };
  }, [enabled, cursorLayer]);

  if (!enabled || !cursorLayer) return null;

  return createPortal(
    <>
      <div ref={reticleRef} className="custom-cursor custom-cursor-reticle" aria-hidden="true">
        <span className="reticle-arm reticle-arm-n" />
        <span className="reticle-arm reticle-arm-e" />
        <span className="reticle-arm reticle-arm-s" />
        <span className="reticle-arm reticle-arm-w" />
        <span className="reticle-dot" />
      </div>
      <span ref={labelRef} className="reticle-label" />
    </>,
    cursorLayer,
  );
};

export default CustomCursor;
