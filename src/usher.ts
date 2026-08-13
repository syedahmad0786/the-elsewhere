import "./style.css";
import { must, mustCanvas } from "./dom";
import { mountGrain } from "./grain";
import { trackPointer, type Pointer } from "./pointer";

type Edge = "top" | "right" | "bottom" | "left";

const ORIGIN_X = 12;
const ORIGIN_Y = 55;

let edge: Edge = "left";
let cursor: Pointer = { x: 0, y: 0 };
let noteTimer = 0;

function init(): void {
  mountGrain(mustCanvas("paper-grain"));
  cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  trackPointer((point) => {
    cursor = point;
  });
  must("stage").addEventListener("click", onUselessClick);
  pose(must("hand-wrap"));
  tick();
}

function tick(): void {
  pose(must("hand-wrap"));
  window.requestAnimationFrame(tick);
}

function pose(hand: HTMLElement): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  edge = chooseEdge(cursor.x, cursor.y, w, h, edge);
  const cuff = cuffOnEdge(edge, cursor, w, h);
  const angle = Math.atan2(cursor.y - cuff.y, cursor.x - cuff.x);
  hand.style.transform = `translate(${cuff.x - ORIGIN_X}px, ${cuff.y - ORIGIN_Y}px) rotate(${angle}rad)`;
  must("way").style.transform = `rotate(${-angle}rad)`;
}

function chooseEdge(x: number, y: number, w: number, h: number, current: Edge): Edge {
  const distances: Record<Edge, number> = {
    top: y,
    right: w - x,
    bottom: h - y,
    left: x,
  };
  let best = current;
  let bestD = distances[current] ?? 0;
  const keys: Edge[] = ["top", "right", "bottom", "left"];
  keys.forEach((key) => {
    const d = distances[key] ?? 0;
    if (d + 28 < bestD) {
      best = key;
      bestD = d;
    }
  });
  return best;
}

function cuffOnEdge(side: Edge, point: Pointer, w: number, h: number): Pointer {
  const pad = 10;
  if (side === "left") return { x: 0, y: clamp(point.y, pad, h - pad) };
  if (side === "right") return { x: w, y: clamp(point.y, pad, h - pad) };
  if (side === "top") return { x: clamp(point.x, pad, w - pad), y: 0 };
  return { x: clamp(point.x, pad, w - pad), y: h };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function onUselessClick(event: MouseEvent): void {
  const target = event.target;
  if (target instanceof HTMLAnchorElement) return;
  event.preventDefault();
  const note = must("gesture-note");
  note.hidden = false;
  window.clearTimeout(noteTimer);
  noteTimer = window.setTimeout(() => {
    note.hidden = true;
  }, 1600);
}

init();
