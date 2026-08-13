export function playSting(): void {
  try {
    const ctx = new AudioContext();
    void ctx.resume();
    tone(ctx, 523.25, 0, 0.09);
    tone(ctx, 392, 0.08, 0.12);
    rustle(ctx);
    window.setTimeout(() => void ctx.close(), 700);
  } catch {
    /* audio is ornamental */
  }
}

function tone(ctx: AudioContext, freq: number, when: number, dur: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + when);
  osc.stop(ctx.currentTime + when + dur + 0.02);
}

function rustle(ctx: AudioContext): void {
  const length = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  src.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 1400;
  gain.gain.value = 0.04;
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start();
}
