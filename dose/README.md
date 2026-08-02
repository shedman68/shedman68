# DOSE Daily 🧠

A minimal, installable web app (PWA) for keeping your four feel-good brain
chemicals in balance — **D**opamine, **O**xytocin, **S**erotonin and
**E**ndorphins — inspired by the DOSE framework from TJ Power's book
*The DOSE Effect*.

## How it works

- **20 actions, five per chemical**, each slotted into the moment of day it
  fits best (Morning / Midday / Evening).
- You **choose one action per chemical** — those four are your daily goal and
  fill the DOSE ring. Everything else is bonus, never homework.
- **Streaks are forgiving**: any day with at least one action keeps the flame
  alive.
- **Patterns view** shows a 4-week grid of which chemicals you fed each day,
  so you can spot what's quietly missing.
- One gentle **nudge** per day toward your most-neglected chosen action.
  Praise for what you did; no guilt for what you didn't.

All data stays in your browser's local storage — no accounts, no servers,
no tracking. Use *Settings → Export data* for a backup.

## Install on your phone

The app is a static site — enable GitHub Pages on this repo
(*Settings → Pages → Deploy from branch → `main` / root*), then open the
published URL on your phone:

- **iPhone:** open in Safari → Share → **Add to Home Screen**
- **Android:** open in Chrome → menu → **Add to Home screen**

It runs fully offline after the first load.

## Development

No build step, no dependencies. It's four files:

| File | Purpose |
|---|---|
| `index.html` | App shell and views |
| `styles.css` | Design system (light + dark mode) |
| `app.js` | Actions, state, rendering, streaks |
| `sw.js` | Service worker for offline use |

Serve locally with `python3 -m http.server` and open `localhost:8000`.

## Roadmap

- [ ] Push notification nudges (installed iOS PWAs support these on iOS 16.4+)
- [ ] Calendar export for routines
- [ ] Custom/user-defined actions
