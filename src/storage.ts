export const LAST_KEY = "elsewhere:last";
export const LIFE_KEY = "elsewhere:unfinished-complete";

export interface LastSent {
  name: string;
  href: string;
  at: string;
}

export function readLast(): LastSent | null {
  try {
    const raw = sessionStorage.getItem(LAST_KEY);
    if (!raw) return null;
    return parseLast(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function writeLast(sent: LastSent): void {
  try {
    sessionStorage.setItem(LAST_KEY, JSON.stringify(sent));
  } catch {
    /* private mode */
  }
}

export function lifeWasFinished(): boolean {
  try {
    return localStorage.getItem(LIFE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markLifeFinished(): void {
  try {
    localStorage.setItem(LIFE_KEY, "1");
  } catch {
    /* private mode */
  }
}

function parseLast(value: unknown): LastSent | null {
  if (!isRecord(value)) return null;
  if (typeof value.name !== "string") return null;
  if (typeof value.href !== "string") return null;
  if (typeof value.at !== "string") return null;
  return { name: value.name, href: value.href, at: value.at };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
