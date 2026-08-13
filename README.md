# The Elsewhere

A high-production **Take me somewhere useless** portal — accession **FT–012** — plus three original one-joke rooms. Visual language: editorial museum, cream paper, ink, Cormorant Garamond, IBM Plex Mono, film grain, accession stamps. A 2026 revival of the old useless web, not a clone of it.

Author: Ahmad Bukhari. License: MIT, 2026. GitHub: [syedahmad0786/the-elsewhere](https://github.com/syedahmad0786/the-elsewhere).

## Routes

| File | Room |
|---|---|
| `index.html` | The portal. Giant brass plate. 1.5s film-grain dissolve, then a random destination. |
| `usher.html` | **The Usher** — a white glove that always points at you from the nearest viewport edge. |
| `bee.html` | **The Apology Bee** — spring-physics chase, increasingly specific apologies, weeps if you stop. |
| `unfinished.html` | **Unfinished** — a loading bar that is a life. It reaches 100% only after you leave. |

The portal’s random pool mixes those three rooms, other Fun Toys (`please-press`, `cursorling`, `chimemoji`, `vapor-market`), and classic public useless web (pointerpointer, theuselessweb, staggeringbeauty, omfgdogs, cat-bounce, heeeeeeeey). External links open in a new tab.

`?go=1` on the portal auto-triggers the ritual once. A “last sent” line appears if this session already dispatched you. **Send word** copies `I was sent elsewhere.` plus the URL; **Keep a card** downloads a 1080×1350 cream-paper PNG (`ELSEWHERE · FT–012`).

`prefers-reduced-motion` skips the grain dissolve and types instantly.

## Run

```bash
npm install
npm run dev
```

Build / preview:

```bash
npm run build
npm run preview
```

Vite 6 + TypeScript, vanilla (no React). Multi-page app. `base` is `./`.

## Webring

Every footer:

- hub — https://fun-toys-alpha.vercel.app
- prev — https://rake-garden.vercel.app
- next — https://elsewho.vercel.app (placeholder)

## Notes

Unfinished uses `localStorage` plus `navigator.sendBeacon` when the tab hides or the page unloads. Coming back, the bar is already complete: *you left, so it finished without you.*
