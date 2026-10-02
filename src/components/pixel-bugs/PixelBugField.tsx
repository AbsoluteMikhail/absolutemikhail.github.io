import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { setBugCursorProbe } from "@/components/pixel-bugs/bugCursor";
import {
  EMPTY_SCORE,
  formatBugScore,
  formatBugXp,
  readStoredBugScore,
  registerKill,
  writeStoredBugScore,
  type ScoreState,
} from "@/components/pixel-bugs/bugScore";
import {
  advanceBug,
  bugDrawOrigin,
  collectCoverRects,
  createBug,
  findHittableBug,
  MAX_BUGS,
  xpFor,
  type Bug,
  type Rect,
} from "@/components/pixel-bugs/bugSim";
import {
  bugPalette,
  clearSpriteCache,
  outlineColor,
  spriteImage,
} from "@/components/pixel-bugs/bugSprites";
import { useAnalyticsChoice } from "@/lib/privacyPreferences";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
};

type XpPop = {
  id: number;
  text: string;
  x: number;
  y: number;
};

type World = {
  bugs: Bug[];
  covers: Rect[];
  frame: 0 | 1;
  time: number;
};

const overlaps = (box: Rect, cover: Rect) =>
  box.left < cover.right && box.right > cover.left && box.top < cover.bottom && box.bottom > cover.top;

const PixelBugField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World>({ bugs: [], covers: [], frame: 0, time: 0 });
  const choice = useAnalyticsChoice();
  const [score, setScore] = useState<ScoreState>(EMPTY_SCORE);
  const [pops, setPops] = useState<XpPop[]>([]);
  const onKillRef = useRef<(points: number, x: number, y: number) => void>(() => {});

  onKillRef.current = (points, x, y) => {
    const id = performance.now();
    setPops((items) => [...items.slice(-8), { id, text: formatBugXp(points), x, y }]);
    setScore((state) => {
      const next = registerKill(state, points, readStoredBugScore());
      writeStoredBugScore(next.total);
      return next;
    });
  };

  useEffect(() => {
    if (choice === "accepted" && score.shown) writeStoredBugScore(score.total);
  }, [choice, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let context: CanvasRenderingContext2D | null = null;
    try {
      context = canvas.getContext("2d");
    } catch {
      context = null;
    }
    if (!context) return undefined;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || motion.matches) return undefined;

    const bugs: Bug[] = [];
    const particles: Particle[] = [];
    let palette = bugPalette();
    let outline = outlineColor();
    let raf = 0;
    let last = performance.now();
    let spawnIn = 0.2;
    let nextId = 1;
    let coversAt = 0;
    let coversDirty = true;
    const cssSize = { width: window.innerWidth, height: window.innerHeight };
    let suppressClick = false;
    let suppressTimer = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (!shoot(event.clientX, event.clientY)) return;
      suppressClick = true;
      event.preventDefault();
      window.clearTimeout(suppressTimer);
      suppressTimer = window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    };

    const onPointerUp = () => {
      if (!suppressClick) return;
      window.clearTimeout(suppressTimer);
      suppressTimer = window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    };

    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      window.clearTimeout(suppressTimer);
      event.preventDefault();
      event.stopPropagation();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssSize.width = window.innerWidth;
      cssSize.height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(cssSize.width * dpr));
      canvas.height = Math.max(1, Math.round(cssSize.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = false;
      coversDirty = true;
    };

    const refreshCovers = (now: number) => {
      const due = coversDirty ? now - coversAt > 80 : now - coversAt > 500;
      if (!due) return;
      coversAt = now;
      coversDirty = false;
      worldRef.current.covers = collectCoverRects(cssSize.width, cssSize.height);
    };

    const burst = (bug: Bug, color: string, time: number) => {
      const origin = bugDrawOrigin(bug, time);
      const cx = origin.x + bug.w / 2;
      const cy = origin.y + bug.h / 2;
      for (let index = 0; index < 12; index += 1) {
        const angle = (Math.PI * 2 * index) / 12 + (Math.random() - 0.5) * 0.5;
        const speed = 36 + Math.random() * 80;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 18,
          life: 0.46,
          max: 0.46,
          color,
          size: 3 + (index % 3),
        });
      }
      while (particles.length > 72) particles.shift();
    };

    const shoot = (x: number, y: number) => {
      const world = worldRef.current;
      const bug = findHittableBug(world.bugs, x, y, world.covers, world.frame, world.time);
      if (!bug) return false;
      if (bug.hp > 1) {
        bug.hp -= 1;
        bug.flashUntil = performance.now() + 150;
        return true;
      }
      const index = world.bugs.indexOf(bug);
      if (index >= 0) world.bugs.splice(index, 1);
      const color = palette[bug.colorIndex % palette.length] ?? palette[0];
      burst(bug, color, world.time);
      onKillRef.current(xpFor(bug.size), x, y);
      return true;
    };

    const draw = (now: number) => {
      const { width, height } = cssSize;
      context.clearRect(0, 0, width, height);
      const frame = worldRef.current.frame;
      const boxes: Rect[] = [];
      for (const bug of worldRef.current.bugs) {
        const origin = bugDrawOrigin(bug, now);
        const color = now < bug.flashUntil
          ? (palette[2] ?? "#fff")
          : (palette[bug.colorIndex % palette.length] ?? palette[0]);
        const sprite = spriteImage(bug.kind, frame, bug.scale, color);
        const shadow = spriteImage(bug.kind, frame, bug.scale, outline);
        context.drawImage(shadow, origin.x - 1, origin.y);
        context.drawImage(shadow, origin.x + 1, origin.y);
        context.drawImage(shadow, origin.x, origin.y - 1);
        context.drawImage(shadow, origin.x, origin.y + 1);
        context.drawImage(sprite, origin.x, origin.y);
        boxes.push({ left: origin.x - 1, top: origin.y - 1, right: origin.x + bug.w + 1, bottom: origin.y + bug.h + 1 });
      }
      for (const particle of particles) {
        context.globalAlpha = Math.max(0, particle.life / particle.max);
        context.fillStyle = particle.color;
        context.fillRect(Math.round(particle.x), Math.round(particle.y), particle.size, particle.size);
        boxes.push({
          left: particle.x,
          top: particle.y,
          right: particle.x + particle.size,
          bottom: particle.y + particle.size,
        });
      }
      context.globalAlpha = 1;
      for (const cover of worldRef.current.covers) {
        if (!boxes.some((box) => overlaps(box, cover))) continue;
        context.clearRect(cover.left, cover.top, cover.right - cover.left, cover.bottom - cover.top);
      }
    };

    const paused = () => document.hidden || document.body.classList.contains("modal-open");

    const loop = (now: number) => {
      raf = 0;
      if (paused()) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      refreshCovers(now);
      spawnIn -= dt;
      if (spawnIn <= 0 && bugs.length < MAX_BUGS) {
        bugs.push(createBug(nextId, cssSize.width, cssSize.height));
        nextId += 1;
        spawnIn = bugs.length < 3 ? 0.55 : 1.7 + Math.random() * 0.8;
      }
      for (let index = bugs.length - 1; index >= 0; index -= 1) {
        const next = advanceBug(bugs[index], dt, cssSize.width, cssSize.height);
        if (next) bugs[index] = next;
        else bugs.splice(index, 1);
      }
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life -= dt;
        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 70 * dt;
      }
      worldRef.current.bugs = bugs;
      worldRef.current.frame = Math.floor(now / 280) % 2 === 0 ? 0 : 1;
      worldRef.current.time = now;
      draw(now);
      raf = window.requestAnimationFrame(loop);
    };

    const resume = () => {
      if (paused() || raf) return;
      last = performance.now();
      raf = window.requestAnimationFrame(loop);
    };

    const onScroll = () => {
      coversDirty = true;
    };

    const onTheme = () => {
      clearSpriteCache();
      palette = bugPalette();
      outline = outlineColor();
    };

    worldRef.current.bugs = bugs;
    setBugCursorProbe((x, y) => {
      const world = worldRef.current;
      return findHittableBug(world.bugs, x, y, world.covers, world.frame, world.time) !== null;
    });

    resize();
    const themeObserver = new MutationObserver(onTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const modalObserver = new MutationObserver(resume);
    modalObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointerup", onPointerUp, true);
    window.addEventListener("click", onClick, true);
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(suppressTimer);
      setBugCursorProbe(null);
      themeObserver.disconnect();
      modalObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("click", onClick, true);
      clearSpriteCache();
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pixel-bug-layer" aria-hidden="true">
      <canvas ref={canvasRef} />
      {pops.map((pop) => (
        <span
          key={pop.id}
          className="pixel-bug-xp"
          style={{ ["--xp-x" as string]: `${pop.x}px`, ["--xp-y" as string]: `${pop.y}px` }}
          onAnimationEnd={() => setPops((items) => items.filter((item) => item.id !== pop.id))}
        >
          {pop.text}
        </span>
      ))}
      {score.shown && <div className="pixel-bug-score">{formatBugScore(score.total)}</div>}
    </div>,
    document.body,
  );
};

export default PixelBugField;
