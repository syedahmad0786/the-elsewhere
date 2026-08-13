export interface Pointer {
  x: number;
  y: number;
}

export function trackPointer(onMove: (point: Pointer) => void): void {
  const emit = (event: PointerEvent): void => {
    onMove({ x: event.clientX, y: event.clientY });
  };
  window.addEventListener("pointermove", emit, { passive: true });
  window.addEventListener("pointerdown", emit, { passive: true });
}
