import "./style.css";
import { playSting } from "./audio";
import { byKind, pickRandom, type Destination, type Kind } from "./destinations";
import { must, mustButton, mustCanvas } from "./dom";
import { dissolve, liftDissolve, mountGrain } from "./grain";
import { prefersReducedMotion } from "./motion";
import { downloadCard, shareSentence } from "./share";
import { readLast, writeLast } from "./storage";

const TITLES: Record<Kind, string> = {
  original: "Original",
  classic: "Classic",
  cabinet: "Cabinet",
};

function init(): void {
  mountGrain(mustCanvas("paper-grain"));
  renderLast();
  renderDirectory(must("directory"));
  mustButton("go").addEventListener("click", () => void sendElsewhere(false));
  mustButton("share-sentence").addEventListener("click", () => void onShare());
  mustButton("share-card").addEventListener("click", () => void onCard());
  maybeAutoGo();
}

function renderLast(): void {
  const line = must("last-sent");
  const last = readLast();
  if (!last) {
    line.hidden = true;
    return;
  }
  line.hidden = false;
  line.textContent = `Last sent: ${last.name}`;
}

function renderDirectory(root: HTMLElement): void {
  const kinds: Kind[] = ["original", "classic", "cabinet"];
  root.replaceChildren(...kinds.map((kind) => wing(kind)));
}

function wing(kind: Kind): HTMLElement {
  const article = document.createElement("article");
  article.className = "wing";
  const heading = document.createElement("h2");
  heading.textContent = TITLES[kind];
  const list = document.createElement("ul");
  byKind(kind).forEach((item) => list.append(linkItem(item)));
  article.append(heading, list);
  return article;
}

function linkItem(item: Destination): HTMLLIElement {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = item.href;
  a.textContent = item.name;
  if (item.external) {
    a.target = "_blank";
    a.rel = "noreferrer noopener";
  }
  li.append(a);
  return li;
}

async function sendElsewhere(auto: boolean): Promise<void> {
  const btn = mustButton("go");
  if (btn.dataset.busy === "1") return;
  btn.dataset.busy = "1";
  try {
    const dest = pickRandom(readLast()?.href);
    writeLast({ name: dest.name, href: dest.href, at: new Date().toISOString() });
    if (!auto) playSting();
    await dispatch(dest, auto);
  } finally {
    btn.dataset.busy = "0";
  }
}

async function dispatch(dest: Destination, auto: boolean): Promise<void> {
  if (dest.external) {
    if (auto) {
      window.location.assign(dest.href);
      return;
    }
    window.open(dest.href, "_blank", "noopener,noreferrer");
    if (!prefersReducedMotion()) await dissolve(1500);
    liftDissolve();
    renderLast();
    return;
  }
  if (!prefersReducedMotion()) await dissolve(1500);
  window.location.assign(dest.href);
}

function maybeAutoGo(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.get("go") !== "1") return;
  history.replaceState({}, "", window.location.pathname);
  void sendElsewhere(true);
}

async function onShare(): Promise<void> {
  const note = must("share-note");
  try {
    const result = await shareSentence(window.location.href);
    note.textContent = result === "copied" ? "Copied." : result === "sent" ? "Sent." : "";
  } catch {
    note.textContent = "The sentence stayed here.";
  }
}

async function onCard(): Promise<void> {
  const note = must("share-note");
  try {
    await downloadCard();
    note.textContent = "Card kept.";
  } catch {
    note.textContent = "The card would not print.";
  }
}

init();
