const CARD_W = 1080;
const CARD_H = 1350;
const PAPER = "#f4ead8";
const INK = "#1a1612";
const WAX = "#6e2c24";
const RULE = "#b9a888";

export async function shareSentence(url: string): Promise<string> {
  const text = `I was sent elsewhere. ${url}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "ELSEWHERE", text, url });
      return "sent";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
    }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}

export async function downloadCard(): Promise<void> {
  const canvas = await drawShareCard();
  await savePng(canvas, "elsewhere-ft-012.png");
}

async function drawShareCard(): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw a card.");
  await readyFonts();
  fillPaper(ctx);
  drawFrame(ctx);
  drawType(ctx);
  return canvas;
}

async function readyFonts(): Promise<void> {
  try {
    await Promise.race([
      document.fonts.load('700 160px "Cormorant Garamond"'),
      wait(900),
    ]);
  } catch {
    /* Georgia will do */
  }
}

function fillPaper(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 1;
  for (let y = 90; y < CARD_H - 70; y += 42) {
    ctx.beginPath();
    ctx.moveTo(72, y);
    ctx.lineTo(CARD_W - 72, y);
    ctx.stroke();
  }
}

function drawFrame(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, CARD_W - 96, CARD_H - 96);
  ctx.strokeRect(60, 60, CARD_W - 120, CARD_H - 120);
}

function drawType(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = WAX;
  ctx.font = '500 28px "IBM Plex Mono", monospace';
  ctx.textAlign = "center";
  ctx.fillText("ACCESSION FT–012", CARD_W / 2, 180);
  ctx.fillStyle = INK;
  ctx.font = '700 148px "Cormorant Garamond", Georgia, serif';
  ctx.fillText("ELSEWHERE", CARD_W / 2, 430);
  ctx.font = 'italic 42px "Cormorant Garamond", Georgia, serif';
  ctx.fillText("I was sent elsewhere.", CARD_W / 2, 720);
  ctx.font = '500 26px "IBM Plex Mono", monospace';
  ctx.fillText("ELSEWHERE · FT–012", CARD_W / 2, 1180);
  ctx.fillText("a Fun Toy · 2026", CARD_W / 2, 1224);
}

async function savePng(canvas: HTMLCanvasElement, name: string): Promise<void> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) resolve(file);
      else reject(new Error("The card refused to become a file."));
    }, "image/png");
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
