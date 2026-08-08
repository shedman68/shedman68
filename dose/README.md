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
- **Bite-sized learning**, never a wall of text: one rotating insight card a
  day on the home screen, a summary sheet per chemical (what it does, what
  drains it, what low and high feel like), and a "why it works / how to do
  it" sheet per action.

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
| `content.js` | Actions and all educational content |
| `app.js` | State, rendering, streaks, sheets |
| `sw.js` | Service worker for offline use |

Content is deliberately separated from logic: adding a chemical's material
means editing `content.js` only. Set a chemical's `ready: true` once its
summary fields are filled in.

Serve locally with `python3 -m http.server` and open `localhost:8000`.

## Roadmap

### Next

- [ ] Push notification nudges (installed iOS PWAs support these on iOS 16.4+)
- [ ] Calendar export for routines
- [ ] Custom/user-defined actions
- [ ] Resist counter for the quick-dopamine habit ("a rep in the gym for your brain")
- [ ] Built-in stopwatch for the Flow State challenge, storing your daily best

### Direction

See [PHILOSOPHY.md](PHILOSOPHY.md) for the posture underneath these — why
returns matter more than streaks, why change comes in small single steps,
and why nudges amplify strengths rather than chase weaknesses.


The checklist is the surface, not the point. Once there is enough history to
learn from, the app should help you *lean into* what you're drawn to:

- Surface what you do a lot of, what you clearly enjoy, and what you keep
  skipping — then ask **why**. Is it a weakness worth working on, or simply
  not for you? Both are useful answers.
- Let themes and actions you gravitate toward take up more room over time,
  rather than treating all twenty actions as equal forever.
- Connect the daily practice to a larger philosophy of meaning and personal
  energy drives — helping people find what actually powers their life.

Feedback loop: dogfood first, then a small group of friends, then iterate.
