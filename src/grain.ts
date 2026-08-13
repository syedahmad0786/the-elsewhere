import { prefersReducedMotion } from "./motion";

const live = new WeakSet<HTMLCanvasElement>();

export function mountGrain(canvas: HTMLCanvasElement): void {
  if (live.has(canvas)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  live.add(canvas);
  paintNoise(ctx, canvas, 34);
  if (prefersReducedMotion()) return;
  window.setInterval(() => paintNoise(ctx, canvas, 34), 140);
}

export function dissolve(ms: number): Promise<void> {
  const layer = document.getElementById("ritual");
  if (!(layer instanceof HTMLElement)) return Promise.resolve();
  layer.hidden = false;
  layer.classList.add("is-on");
  const grain = layer.querySelector("canvas");
  if (grain instanceof HTMLCanvasElement) mountGrain(grain);
  return wait(ms);
}

export function liftDissolve(): void {
  const layer = document.getElementById("ritual");
  if (!(layer instanceof HTMLElement)) return;
  layer.classList.remove("is-on");
  window.setTimeout(() => {
    layer.hidden = true;
  }, 400);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function paintNoise(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  alpha: number,
): void {
  const w = 160;
  const h = 160;
  canvas.width = w;
  canvas.height = h;
  const img = ctx.createImageData(w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 120 + Math.random() * 90;
    img.data[i] = n;
    img.data[i + 1] = n - 10;
    img.data[i + 2] = n - 22;
    img.data[i + 3] = alpha;
  }
  ctx.putImageData(img, 0, 0);
}
