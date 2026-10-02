type BugProbe = (x: number, y: number) => boolean;

let probe: BugProbe | null = null;

export const setBugCursorProbe = (next: BugProbe | null) => {
  probe = next;
};

export const isBugUnderCursor = (x: number, y: number) => probe?.(x, y) ?? false;
