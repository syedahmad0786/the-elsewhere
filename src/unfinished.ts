import "./style.css";
import { must, mustCanvas } from "./dom";
import { mountGrain } from "./grain";
import { prefersReducedMotion } from "./motion";
import { LIFE_KEY, lifeWasFinished, markLifeFinished } from "./storage";

interface LifeBeat {
  at: number;
  text: string;
}

const BEATS: LifeBeat[] = [
  { at: 6, text: "learned to whistle" },
  { at: 12, text: "moved for someone" },
  { at: 18, text: "almost called" },
  { at: 24, text: "bought the good olives" },
  { at: 31, text: "kept a plant alive by accident" },
  { at: 38, text: "rehearsed an apology in the bath" },
  { at: 45, text: "learned the bus route by heart" },
  { at: 52, text: "threw away the box and needed the box" },
  { at: 59, text: "said we should do this more" },
  { at: 66, text: "stood in a doorway deciding" },
  { at: 73, text: "gave the dog a secret name" },
  { at: 80, text: "opened the app and closed the app" },
  { at: 86, text: "saved a receipt for the story" },
  { at: 91, text: "nearly became a person who jogs" },
  { at: 95, text: "left the light on for no one" },
];

const CEILING = 97.2;
let progress = 3.1;
let last = performance.now();
let nextBeat = 0;
let typing = false;
let sealed = false;

function init(): void {
  mountGrain(mustCanvas("paper-grain"));
  if (lifeWasFinished()) {
    showFinished();
    return;
  }
  armAbandon();
  tick();
}

function tick(): void {
  const now = performance.now();
  const dt = Math.min(48, now - last);
  last = now;
  progress += (CEILING - progress) * 0.00016 * dt + 0.0009 * dt;
  if (progress > CEILING) progress = CEILING;
  paintBar(progress);
  maybeEvent();
  window.requestAnimationFrame(tick);
}

function paintBar(value: number): void {
  must("fill").style.width = `${value}%`;
  must("percent").innerHTML = `LIFE&nbsp;&nbsp;${value.toFixed(1)}%`;
}

function maybeEvent(): void {
  const beat = BEATS[nextBeat];
  if (!beat || typing || progress < beat.at) return;
  nextBeat += 1;
  typeEvent(beat.text);
}

function typeEvent(text: string): void {
  const typed = must("typed");
  if (prefersReducedMotion()) {
    typed.textContent = text;
    return;
  }
  typing = true;
  let i = 0;
  const step = (): void => {
    i += 1;
    typed.textContent = text.slice(0, i);
    if (i < text.length) window.setTimeout(step, 26);
    else typing = false;
  };
  step();
}

function showFinished(): void {
  document.body.classList.add("is-complete");
  must("protocol").textContent = "TRANSFER COMPLETE";
  must("fill").style.width = "100%";
  must("percent").innerHTML = "LIFE&nbsp;&nbsp;100.0%";
  must("typed").textContent = "you left, so it finished without you.";
}

function armAbandon(): void {
  const leave = (): void => seal();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") leave();
  });
  window.addEventListener("pagehide", leave);
}

function seal(): void {
  if (sealed) return;
  sealed = true;
  markLifeFinished();
  beacon();
}

function beacon(): void {
  try {
    const body = new Blob([JSON.stringify({ finished: true, key: LIFE_KEY })], {
      type: "application/json",
    });
    navigator.sendBeacon(`${window.location.pathname}?sealed=1`, body);
  } catch {
    /* localStorage is the record */
  }
}

init();
