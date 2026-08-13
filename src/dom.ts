export function must(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el;
}

export function mustButton(id: string): HTMLButtonElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLButtonElement)) {
    throw new Error(`Missing button #${id}`);
  }
  return el;
}

export function mustCanvas(id: string): HTMLCanvasElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLCanvasElement)) {
    throw new Error(`Missing canvas #${id}`);
  }
  return el;
}
