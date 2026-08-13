export type Kind = "original" | "classic" | "cabinet";

export interface Destination {
  name: string;
  href: string;
  kind: Kind;
  external: boolean;
}

export const destinations: Destination[] = [
  { name: "The Usher", href: "usher.html", kind: "original", external: false },
  { name: "The Apology Bee", href: "bee.html", kind: "original", external: false },
  { name: "Unfinished", href: "unfinished.html", kind: "original", external: false },
  { name: "Please Press", href: "https://please-press.vercel.app", kind: "cabinet", external: true },
  { name: "Cursorling", href: "https://cursorling.vercel.app", kind: "cabinet", external: true },
  { name: "Chimemoji", href: "https://chimemoji.vercel.app", kind: "cabinet", external: true },
  { name: "Vapor Market", href: "https://vapor-market.vercel.app", kind: "cabinet", external: true },
  { name: "Pointer Pointer", href: "https://pointerpointer.com", kind: "classic", external: true },
  { name: "The Useless Web", href: "https://theuselessweb.com", kind: "classic", external: true },
  { name: "Staggering Beauty", href: "https://www.staggeringbeauty.com", kind: "classic", external: true },
  { name: "OMFG Dogs", href: "https://www.omfgdogs.com", kind: "classic", external: true },
  { name: "Cat Bounce", href: "https://cat-bounce.com", kind: "classic", external: true },
  { name: "Heeeeeeeey", href: "https://heeeeeeeey.com", kind: "classic", external: true },
];

export function pickRandom(avoidHref?: string): Destination {
  const pool = destinations.filter((item) => item.href !== avoidHref);
  const list = pool.length > 0 ? pool : destinations;
  const chosen = list[Math.floor(Math.random() * list.length)];
  if (!chosen) throw new Error("Elsewhere is empty.");
  return chosen;
}

export function byKind(kind: Kind): Destination[] {
  return destinations.filter((item) => item.kind === kind);
}
