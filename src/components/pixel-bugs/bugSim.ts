import { BUG_KINDS, SPRITES, type BugKind } from "@/components/pixel-bugs/bugSprites";

export type BugSize = "small" | "large" | "xl";

export type Bug = {
  id: number;
  kind: BugKind;
  size: BugSize;
  colorIndex: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  scale: number;
  hp: number;
  phase: number;
  flashUntil: number;
};

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export const MAX_BUGS = 6;

export const SIZE_STATS: Record<BugSize, { scale: number; hp: number; xp: number; speed: number }> = {
  small: { scale: 3, hp: 1, xp: 20, speed: 210 },
  large: { scale: 5, hp: 1, xp: 10, speed: 112 },
  xl: { scale: 7, hp: 2, xp: 10, speed: 68 },
};

export const xpFor = (size: BugSize) => SIZE_STATS[size].xp;

// Links, controls, pictures and cards punch a hole in the bug layer and refuse shots.
export const BUG_COVER_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "textarea",
  "select",
  "summary",
  "img",
  "video",
  "iframe",
  "embed",
  "object",
  "picture",
  "[role='button']",
  "article",
  "nav",
  ".analytics-banner",
  "dialog",
].join(",");

export const rollSize = (random: () => number): BugSize => {
  const roll = random();
  if (roll < 0.32) return "small";
  if (roll < 0.88) return "large";
  return "xl";
};

export const createBug = (
  id: number,
  viewportWidth: number,
  viewportHeight: number,
  random: () => number = Math.random,
): Bug => {
  const size = rollSize(random);
  const stats = SIZE_STATS[size];
  const kind = BUG_KINDS[Math.floor(random() * BUG_KINDS.length)] ?? "squid";
  const matrix = SPRITES[kind][0];
  const w = matrix[0].length * stats.scale;
  const h = matrix.length * stats.scale;
  const fromLeft = random() < 0.5;
  const speed = stats.speed * (0.86 + random() * 0.28);
  const minY = 76;
  const maxY = Math.max(minY, viewportHeight - 96 - h);
  return {
    id,
    kind,
    size,
    colorIndex: (id + Math.floor(random() * 5)) % 6,
    x: fromLeft ? -w - 6 : viewportWidth + 6,
    y: minY + random() * Math.max(1, maxY - minY),
    vx: fromLeft ? speed : -speed,
    vy: (random() - 0.5) * 28,
    w,
    h,
    scale: stats.scale,
    hp: stats.hp,
    phase: random() * Math.PI * 2,
    flashUntil: 0,
  };
};

export const advanceBug = (bug: Bug, dt: number, viewportWidth: number, viewportHeight: number): Bug | null => {
  let { y, vy } = bug;
  y += vy * dt;
  const minY = 72;
  const maxY = Math.max(minY, viewportHeight - 72 - bug.h);
  if (y < minY) {
    y = minY;
    vy = Math.abs(vy) || 10;
  } else if (y > maxY) {
    y = maxY;
    vy = -Math.abs(vy) || -10;
  }
  const x = bug.x + bug.vx * dt;
  if (x < -bug.w - 36 || x > viewportWidth + 36) return null;
  return { ...bug, x, y, vy };
};

export const bugDrawOrigin = (bug: Bug, timeMs: number) => ({
  x: Math.round(bug.x),
  y: Math.round(bug.y + Math.sin(timeMs / 380 + bug.phase) * 7),
});

export const pointInRect = (x: number, y: number, rect: Rect) =>
  x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;

export const opaqueAt = (bug: Bug, x: number, y: number, frame: 0 | 1, timeMs: number) => {
  const origin = bugDrawOrigin(bug, timeMs);
  const col = Math.floor((x - origin.x) / bug.scale);
  const row = Math.floor((y - origin.y) / bug.scale);
  const matrix = SPRITES[bug.kind][frame];
  if (row < 0 || col < 0 || row >= matrix.length || col >= matrix[row].length) return false;
  return matrix[row][col] === 1;
};

export const findHittableBug = (
  bugs: readonly Bug[],
  x: number,
  y: number,
  covers: readonly Rect[],
  frame: 0 | 1,
  timeMs: number,
): Bug | null => {
  if (covers.some((cover) => pointInRect(x, y, cover))) return null;
  for (let index = bugs.length - 1; index >= 0; index -= 1) {
    const bug = bugs[index];
    if (opaqueAt(bug, x, y, frame, timeMs)) return bug;
  }
  return null;
};

export const collectCoverRects = (width = window.innerWidth, height = window.innerHeight): Rect[] => {
  const margin = 140;
  const rects: Rect[] = [];
  document.querySelectorAll<HTMLElement>(BUG_COVER_SELECTOR).forEach((element) => {
    if (element.closest(".pixel-bug-layer")) return;
    const box = element.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) return;
    if (box.right < -margin || box.bottom < -margin || box.left > width + margin || box.top > height + margin) return;
    rects.push({ left: box.left, top: box.top, right: box.right, bottom: box.bottom });
  });
  return rects;
};
