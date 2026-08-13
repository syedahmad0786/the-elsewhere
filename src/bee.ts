import "./style.css";
import { must, mustCanvas } from "./dom";
import { mountGrain } from "./grain";
import { prefersReducedMotion } from "./motion";
import { trackPointer, type Pointer } from "./pointer";

interface Spring {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const APOLOGIES = [
  "sorry about the picnic",
  "I thought the jam was communal",
  "please tell the flowers I panicked",
  "the sandwich was already emotionally complicated",
  "I filed the sting under networking",
  "I told the hive you seemed approachable",
  "this is my formal written apology to the blanket",
  "I panicked in a way that involved your sleeve",
  "the queen has been cc’d. I regret the cc",
  "I believed the lemonade was a public utility",
  "please do not name the species after this",
  "I have put myself in a timeout on this dandelion",
];

const IDLE_MS = 900;
const bee: Spring = { x: 80, y: 120, vx: 0, vy: 0 };
let target: Pointer = { x: 160, y: 180 };
let lastMove = performance.now();
let apologyIndex = 0;
let speaking = false;

function init(): void {
  mountGrain(mustCanvas("paper-grain"));
  trackPointer((point) => {
    target = point;
    lastMove = performance.now();
  });
  cycleApology();
  window.setInterval(cycleApology, 4800);
  tick();
}

function tick(): void {
  const idle = performance.now() - lastMove > IDLE_MS;
  const k = idle ? 0.018 : 0.055;
  const damp = idle ? 0.72 : 0.8;
  const goal = idle ? landSpot(target) : chaseSpot(target);
  stepSpring(bee, goal.x, goal.y, k, damp);
  paint(idle);
  window.requestAnimationFrame(tick);
}

function stepSpring(s: Spring, tx: number, ty: number, k: number, damp: number): void {
  s.vx = (s.vx + (tx - s.x) * k) * damp;
  s.vy = (s.vy + (ty - s.y) * k) * damp;
  s.x += s.vx;
  s.y += s.vy;
}

function chaseSpot(point: Pointer): Pointer {
  return { x: point.x - 18, y: point.y - 28 };
}

function landSpot(point: Pointer): Pointer {
  return { x: point.x - 42, y: point.y + 36 };
}

function paint(idle: boolean): void {
  const wrap = must("bee-wrap");
  wrap.style.transform = `translate(${bee.x}px, ${bee.y}px)`;
  wrap.classList.toggle("is-alight", idle);
  const speed = Math.hypot(bee.vx, bee.vy);
  wrap.classList.toggle("is-weeping", idle && speed < 0.45);
}

function cycleApology(): void {
  if (speaking) return;
  const bubble = must("bubble");
  const idle = performance.now() - lastMove > IDLE_MS;
  if (idle) {
    bubble.textContent = "snf";
    return;
  }
  if (prefersReducedMotion()) {
    bubble.textContent = nextLine();
    return;
  }
  speaking = true;
  typeInto(bubble, nextLine(), () => {
    speaking = false;
  });
}

function nextLine(): string {
  const line = APOLOGIES[apologyIndex % APOLOGIES.length];
  apologyIndex += 1;
  return line ?? "sorry";
}

function typeInto(el: HTMLElement, text: string, done: () => void): void {
  let i = 0;
  const step = (): void => {
    i += 1;
    el.textContent = text.slice(0, i);
    if (i < text.length) window.setTimeout(step, 22);
    else done();
  };
  step();
}

init();
