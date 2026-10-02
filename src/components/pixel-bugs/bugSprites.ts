export type BugKind = "squid" | "crab" | "octopus";

const parse = (rows: string[]) => rows.map((row) => [...row].map((cell) => (cell === "#" ? 1 : 0)));

const squid = [
  parse([
    "..#.......#..",
    "...#.....#...",
    "..#########..",
    ".##.#...#.##.",
    "#############",
    "#.#########.#",
    "#.#.......#.#",
    "..##.....##..",
  ]),
  parse([
    "..#.......#..",
    "...#.....#...",
    "..#########..",
    ".##.#...#.##.",
    "#############",
    "#.#########.#",
    ".#.#.....#.#.",
    "#..##...##..#",
  ]),
];

const crab = [
  parse([
    "#.#.......#.#",
    ".#.#.....#.#.",
    "..#########..",
    ".###.#.#.###.",
    "#############",
    "##.#######.##",
    "#.#.#...#.#.#",
    "..#.......#..",
  ]),
  parse([
    "..#.......#..",
    "#.#.#...#.#.#",
    "..#########..",
    ".###.#.#.###.",
    "#############",
    "##.#######.##",
    ".#.#.....#.#.",
    "#...#...#...#",
  ]),
];

const octopus = [
  parse([
    "...#######...",
    ".###########.",
    "###.#...#.###",
    "#############",
    "#############",
    ".#.###.###.#.",
    "#.#.......#.#",
    ".#.#.....#.#.",
  ]),
  parse([
    "...#######...",
    ".###########.",
    "###.#...#.###",
    "#############",
    "#############",
    "#.###...###.#",
    ".#.#.#.#.#.#.",
    "#...#...#...#",
  ]),
];

export const SPRITES: Record<BugKind, number[][][]> = {
  squid,
  crab,
  octopus,
};

export const BUG_KINDS: BugKind[] = ["squid", "crab", "octopus"];

const EXTRA_COLORS = ["152 62% 48%", "196 85% 58%", "280 65% 66%"];

const hslToken = (token: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return value ? `hsl(${value})` : "";
};

export const bugPalette = () => {
  const colors = [hslToken("--primary"), hslToken("--accent"), hslToken("--foreground"), ...EXTRA_COLORS.map((value) => `hsl(${value})`)]
    .filter((color) => color.length > 0);
  return colors.length > 0 ? colors : ["hsl(5 92% 60%)", "hsl(27 100% 60%)", "hsl(35 20% 96%)"];
};

export const outlineColor = () => hslToken("--background") || "hsl(225 15% 7%)";

const cache = new Map<string, HTMLCanvasElement>();

export const clearSpriteCache = () => {
  cache.clear();
};

export const spriteImage = (kind: BugKind, frame: 0 | 1, scale: number, color: string) => {
  const key = `${kind}:${frame}:${scale}:${color}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const matrix = SPRITES[kind][frame];
  const canvas = document.createElement("canvas");
  canvas.width = matrix[0].length * scale;
  canvas.height = matrix.length * scale;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (matrix[y][x]) ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
  cache.set(key, canvas);
  return canvas;
};
