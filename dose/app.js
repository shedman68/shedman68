/* ═══════════════════ DOSE Daily ═══════════════════
   A gentle daily checklist for the four feel-good brain
   chemicals, inspired by the DOSE framework.
   All data lives in localStorage on this device only.  */

"use strict";

/* ─── The 20 actions, five per chemical ─── */

const CHEMS = {
  d: { key: "d", letter: "D", name: "Dopamine",   line: "Drive & motivation" },
  o: { key: "o", letter: "O", name: "Oxytocin",   line: "Connection & love" },
  s: { key: "s", letter: "S", name: "Serotonin",  line: "Mood & energy" },
  e: { key: "e", letter: "E", name: "Endorphins", line: "Stress relief" },
};

const ACTIONS = [
  // Dopamine
  { id: "flow",       chem: "d", time: "morning", emoji: "🎯", title: "Flow State",
    desc: "One distraction-free block of deep focus on the thing that matters most. Push through the first awkward 15 minutes and let momentum take over." },
  { id: "discipline", chem: "d", time: "morning", emoji: "🛏️", title: "Discipline",
    desc: "Win the small stuff early — make your bed, tidy your space. An ordered environment quiets a cluttered mind." },
  { id: "phonefast",  chem: "d", time: "morning", emoji: "📵", title: "Phone Fasting",
    desc: "Keep your phone out of reach for the first hour of the day (and the last). Let your brain wake up before the internet does." },
  { id: "coldwater",  chem: "d", time: "morning", emoji: "🧊", title: "Cold Water",
    desc: "Finish your shower cold for 30–60 seconds. It bites for a moment, then repays you with energy and drive all morning." },
  { id: "pursuit",    chem: "d", time: "midday",  emoji: "🧭", title: "My Pursuit",
    desc: "A short stretch of time outdoors, phone-free, dreaming about and planning the future you're building." },

  // Oxytocin
  { id: "contribution", chem: "o", time: "midday",  emoji: "🤝", title: "Contribution",
    desc: "Do one thing today that supports someone else, however small. Helping others is the fastest route to feeling connected." },
  { id: "touch",        chem: "o", time: "evening", emoji: "🫂", title: "Touch",
    desc: "Hug the people (or pets) you love. Warm physical connection settles your whole nervous system." },
  { id: "social",       chem: "o", time: "midday",  emoji: "☕", title: "Social Life",
    desc: "Reach out or meet up — a walk, a coffee, or just a genuine check-in message to someone you care about." },
  { id: "gratitude",    chem: "o", time: "evening", emoji: "🙏", title: "Gratitude",
    desc: "Pause for a few seconds and name one thing you're honestly grateful for today. Small and specific beats big and vague." },
  { id: "achievements", chem: "o", time: "evening", emoji: "🏅", title: "Achievements",
    desc: "Notice your progress. Celebrate one step you took today instead of instantly chasing the next one." },

  // Serotonin
  { id: "nature",     chem: "s", time: "midday",  emoji: "🌳", title: "Nature",
    desc: "Get to some green or blue space and actually take it in — look, listen, breathe. A park bench counts." },
  { id: "sunlight",   chem: "s", time: "morning", emoji: "☀️", title: "Sunlight",
    desc: "Get daylight in your eyes before you get social media in your brain. A few minutes outside early sets your whole day's rhythm." },
  { id: "guthealth",  chem: "s", time: "midday",  emoji: "🥗", title: "Gut Health",
    desc: "Feed your gut real food today — fruit, veg, protein, water — and go easy on the ultra-processed stuff." },
  { id: "underthink", chem: "s", time: "evening", emoji: "🌬️", title: "Underthinking",
    desc: "A few minutes of slow breathing to quiet a busy mind. In slowly through the nose, out even slower." },
  { id: "deepsleep",  chem: "s", time: "evening", emoji: "😴", title: "Deep Sleep",
    desc: "Protect tonight's sleep: a reasonable bedtime, phone out of the bedroom. Tomorrow's mood is built tonight." },

  // Endorphins
  { id: "exercise",   chem: "e", time: "midday",  emoji: "🏃", title: "Exercise",
    desc: "Move your body in a way you could keep doing for years — walk, lift, run, swim, play. Any movement counts." },
  { id: "heat",       chem: "e", time: "evening", emoji: "🛁", title: "Heat",
    desc: "A hot bath, shower or sauna — let heat melt the tension of the day away from your phone." },
  { id: "music",      chem: "e", time: "morning", emoji: "🎶", title: "Music",
    desc: "Put on songs you love and sing along. Loudly is better. Dancing is extra credit." },
  { id: "laughter",   chem: "e", time: "evening", emoji: "😂", title: "Laughter",
    desc: "Find the funny side today — share a laugh with someone, or watch something that genuinely cracks you up." },
  { id: "stretch",    chem: "e", time: "morning", emoji: "🧘", title: "Stretching",
    desc: "Give your body the stretch it's asking for — reach up, hang, twist. One or two minutes is plenty." },
];

const byId = Object.fromEntries(ACTIONS.map(a => [a.id, a]));

const DEFAULT_CHOSEN = { d: "coldwater", o: "gratitude", s: "sunlight", e: "exercise" };

const PRAISE = {
  d: ["Dopamine, earned the real way. 🎯", "That's genuine drive. Nice.", "Motivation bank: topped up."],
  o: ["That's connection. It counts double. 💗", "Oxytocin flowing — someone felt that too.", "Warmth given is warmth kept."],
  s: ["Serotonin says thank you. ☀️", "Mood foundations: strengthened.", "Steady energy, coming up."],
  e: ["Endorphins unlocked. 💪", "Stress doesn't stand a chance.", "That one always pays you back."],
};

const MILESTONES = { 3: "3-day streak — a pattern is forming. 🔥", 7: "A full week! This is who you are now. 🔥",
  14: "Two weeks strong. Remarkable. 🔥", 30: "30 days. You've rewired something. 🏆" };

/* ─── State ─── */

const STORE_KEY = "doseDaily_v1";

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.checks && s.chosen) return s;
    }
  } catch (e) { /* corrupted storage — start fresh */ }
  return { chosen: { ...DEFAULT_CHOSEN }, checks: {}, onboarded: false };
}

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

/* ─── Date helpers ─── */

function dkey(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"),
        day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function today() { return dkey(new Date()); }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

function todayChecks() { return state.checks[today()] || []; }

function isChecked(id) { return todayChecks().includes(id); }

function chemsDone(dayKey) {
  const done = new Set();
  for (const id of state.checks[dayKey] || []) {
    const a = byId[id];
    if (a) done.add(a.chem);
  }
  return done;
}

/* Chosen actions completed today, as a set of chem keys */
function chosenDoneToday() {
  const done = new Set();
  const checks = todayChecks();
  for (const c of Object.keys(CHEMS)) {
    if (checks.includes(state.chosen[c])) done.add(c);
  }
  return done;
}

function streak() {
  let n = 0;
  // today counts if anything is checked; a quiet today doesn't break the streak yet
  let i = (todayChecks().length > 0) ? 0 : 1;
  for (; ; i++) {
    const key = dkey(daysAgo(i));
    if ((state.checks[key] || []).length > 0) n++;
    else break;
    if (i > 3650) break;
  }
  return n;
}

function fullDoseDays() {
  let n = 0;
  for (const key of Object.keys(state.checks)) {
    const checks = state.checks[key];
    if (Object.values(state.chosen).every(id => checks.includes(id))) n++;
  }
  return n;
}

/* ─── Elements ─── */

const $ = id => document.getElementById(id);

let currentTab = defaultTab();
let currentView = "today";

function defaultTab() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "midday";
  return "evening";
}

/* ─── Render: today ─── */

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Up late or up early?";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function renderHeader() {
  $("greeting").textContent = greeting();
  $("dateLine").textContent = new Date().toLocaleDateString(undefined,
    { weekday: "long", day: "numeric", month: "long" });
  $("streakNum").textContent = streak();
}

function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
  const large = (a1 - a0) > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

const CHEM_COLORS = { d: "var(--d)", o: "var(--o)", s: "var(--s)", e: "var(--e)" };

function renderRing() {
  const done = chosenDoneToday();
  const order = ["d", "o", "s", "e"];
  const gap = 9; // degrees between segments
  let svg = "";
  order.forEach((c, i) => {
    const a0 = i * 90 + gap / 2, a1 = (i + 1) * 90 - gap / 2;
    const on = done.has(c);
    svg += `<path class="ring-seg" d="${arcPath(60, 60, 51, a0, a1)}"
      fill="none" stroke="${on ? CHEM_COLORS[c] : "var(--surface-2)"}"
      stroke-width="10" stroke-linecap="round" opacity="${on ? 1 : 0.9}"/>`;
  });
  $("ring").innerHTML = svg;
  $("ringCount").textContent = `${done.size}/4`;

  $("chemChips").innerHTML = order.map(c =>
    `<div class="chip c-${c} ${done.has(c) ? "done" : ""}" title="${CHEMS[c].name}">${CHEMS[c].letter}</div>`
  ).join("");

  const lines = {
    0: "Your four chosen actions make a full DOSE day.",
    1: "One down — a good day is already banked.",
    2: "Halfway there. Nicely balanced so far.",
    3: "Three of four. One gentle push left.",
    4: "Full DOSE day. That's the whole game. 🎉",
  };
  $("heroLine").textContent = lines[done.size];
}

function renderNudge() {
  const el = $("nudge");
  const checks = todayChecks();

  // find the chosen action with the longest drought (≥3 days, incl. today)
  let worst = null, worstGap = 2;
  for (const c of Object.keys(CHEMS)) {
    const id = state.chosen[c];
    if (checks.includes(id)) continue;
    let gap = 0;
    for (let i = 0; i <= 30; i++) {
      if ((state.checks[dkey(daysAgo(i))] || []).includes(id)) break;
      gap++;
    }
    if (gap > worstGap) { worstGap = gap; worst = byId[id]; }
  }

  if (worst && Object.keys(state.checks).length >= 2) {
    const days = worstGap > 30 ? "a while" : `${worstGap} days`;
    el.innerHTML = `💡 It's been ${days} since <b>${worst.emoji} ${worst.title}</b> — maybe today's the day?`;
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

function renderTabs() {
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("active", t.dataset.time === currentTab);
  });
}

function renderActions() {
  const list = $("actionList");
  const actions = ACTIONS.filter(a => a.time === currentTab);
  // chosen first, then unchecked before checked
  actions.sort((a, b) => {
    const ac = Object.values(state.chosen).includes(a.id) ? 0 : 1;
    const bc = Object.values(state.chosen).includes(b.id) ? 0 : 1;
    if (ac !== bc) return ac - bc;
    return (isChecked(a.id) ? 1 : 0) - (isChecked(b.id) ? 1 : 0);
  });

  list.innerHTML = actions.map(a => {
    const chosen = Object.values(state.chosen).includes(a.id);
    const checked = isChecked(a.id);
    return `
    <div class="action ${checked ? "checked" : ""}" data-id="${a.id}">
      <button class="action-row" data-toggle="${a.id}" aria-pressed="${checked}">
        <span class="action-emoji">${a.emoji}</span>
        <span class="action-main">
          <span class="action-title">${a.title}${chosen ? '<span class="star">⭐</span>' : ""}</span>
          <span class="action-meta">
            <span class="tag c-${a.chem}">${CHEMS[a.chem].letter}</span>
            <span class="action-hint">${CHEMS[a.chem].name}${chosen ? " · your pick" : ""}</span>
          </span>
        </span>
        <span class="check">✓</span>
      </button>
      <div class="action-desc">${a.desc}</div>
    </div>`;
  }).join("");
}

function renderToday() {
  renderHeader();
  renderRing();
  renderNudge();
  renderTabs();
  renderActions();
}

/* ─── Render: patterns ─── */

function renderPatterns() {
  const st = streak(), full = fullDoseDays();
  const totalDays = Object.keys(state.checks).filter(k => state.checks[k].length).length;
  $("statsRow").innerHTML = `
    <div class="stat"><span class="stat-num">🔥 ${st}</span><span class="stat-label">day streak</span></div>
    <div class="stat"><span class="stat-num">${full}</span><span class="stat-label">full DOSE days</span></div>
    <div class="stat"><span class="stat-num">${totalDays}</span><span class="stat-label">active days</span></div>`;

  // 4 whole weeks (Mon–Sun), ending with the current week
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // 0 = Monday
  const cells = [];
  for (let i = dow + 21; i >= dow - 6; i--) cells.push(daysAgo(i));

  const tKey = today();
  $("heatmap").innerHTML = cells.map(d => {
    const key = dkey(d);
    const future = d > now;
    const done = chemsDone(key);
    const dots = ["d", "o", "s", "e"].map(c =>
      `<span class="hm-dot c-${c} ${done.has(c) ? "on" : ""}"></span>`).join("");
    return `<div class="hm-day ${key === tKey ? "today" : ""} ${future ? "future" : ""}"
      title="${key}">${dots}</div>`;
  }).join("");

  $("legend").innerHTML = ["d", "o", "s", "e"].map(c =>
    `<span><span class="dot c-${c}"></span>${CHEMS[c].name}</span>`).join("");

  // last 7 days per chemical
  $("chemBars").innerHTML = ["d", "o", "s", "e"].map(c => {
    let n = 0;
    for (let i = 0; i < 7; i++) if (chemsDone(dkey(daysAgo(i))).has(c)) n++;
    return `
    <div class="cb-row">
      <span class="cb-name">${CHEMS[c].name}</span>
      <div class="cb-track"><div class="cb-fill c-${c}" style="width:${(n / 7) * 100}%"></div></div>
      <span class="cb-count">${n}</span>
    </div>`;
  }).join("");
}

/* ─── Interactions ─── */

let toastTimer = null;
function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.remove("hidden", "out");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.classList.add("hidden"), 350);
  }, 2200);
}

function confetti() {
  const box = $("celebrate");
  box.classList.remove("hidden");
  const colors = ["#ff6f5e", "#ec5fa3", "#ffb020", "#8b7cf6", "#2fb07c"];
  let html = "";
  for (let i = 0; i < 60; i++) {
    const left = Math.random() * 100, delay = Math.random() * 0.5,
          dur = 1.6 + Math.random() * 1.4, color = colors[i % colors.length];
    html += `<span class="confetti" style="left:${left}%;background:${color};
      animation-duration:${dur}s;animation-delay:${delay}s"></span>`;
  }
  box.innerHTML = html;
  setTimeout(() => { box.classList.add("hidden"); box.innerHTML = ""; }, 3600);
}

function toggleAction(id) {
  const key = today();
  if (!state.checks[key]) state.checks[key] = [];
  const list = state.checks[key];
  const idx = list.indexOf(id);
  const before = chosenDoneToday().size;
  const prevStreak = streak();

  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(id);
    const a = byId[id];
    const pool = PRAISE[a.chem];
    toast(pool[Math.floor(Math.random() * pool.length)]);
    if (navigator.vibrate) navigator.vibrate(12);
  }
  save();

  const after = chosenDoneToday().size;
  if (after === 4 && before === 3) {
    setTimeout(() => { toast("Full DOSE day! 🎉"); confetti(); }, 700);
  }
  const newStreak = streak();
  if (newStreak > prevStreak && MILESTONES[newStreak]) {
    setTimeout(() => toast(MILESTONES[newStreak]), 1400);
  }

  renderToday();
}

/* ─── Settings sheet ─── */

function openSettings() {
  const c = $("sheetContent");
  c.innerHTML = `
    <h2>Settings</h2>
    <p class="sheet-sub">Your chosen action per chemical — the four that make a full DOSE day.</p>
    ${Object.keys(CHEMS).map(ch => `
      <div class="set-group">
        <div class="set-label" style="color:${CHEM_COLORS[ch]}">${CHEMS[ch].name} — ${CHEMS[ch].line}</div>
        <select class="set-select" data-chem="${ch}">
          ${ACTIONS.filter(a => a.chem === ch).map(a =>
            `<option value="${a.id}" ${state.chosen[ch] === a.id ? "selected" : ""}>${a.emoji} ${a.title}</option>`
          ).join("")}
        </select>
      </div>`).join("")}
    <div class="set-group">
      <div class="set-label">Your data</div>
      <div class="set-row-btns">
        <button class="btn-small" id="btnExport">Export data</button>
        <button class="btn-small" id="btnRedoOb">Re-run intro</button>
        <button class="btn-small btn-danger" id="btnReset">Reset everything</button>
      </div>
    </div>
    <p class="sheet-sub" style="margin-top:6px">Everything is stored only on this device. Export now and then to keep a backup.</p>`;

  c.querySelectorAll(".set-select").forEach(sel => {
    sel.addEventListener("change", () => {
      state.chosen[sel.dataset.chem] = sel.value;
      save();
      renderToday();
    });
  });
  c.querySelector("#btnExport").addEventListener("click", exportData);
  c.querySelector("#btnRedoOb").addEventListener("click", () => { closeSettings(); startOnboarding(); });
  c.querySelector("#btnReset").addEventListener("click", () => {
    if (confirm("Delete all history and choices on this device?")) {
      localStorage.removeItem(STORE_KEY);
      state = load();
      closeSettings();
      startOnboarding();
    }
  });

  $("sheetBackdrop").classList.remove("hidden");
}

function closeSettings() { $("sheetBackdrop").classList.add("hidden"); }

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `dose-daily-backup-${today()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ─── Onboarding ─── */

const OB_STEPS = ["intro", "d", "o", "s", "e"];
let obStep = 0;
let obChosen = { ...DEFAULT_CHOSEN };

const OB_INTRO = {
  title: "Meet your DOSE",
  body: "Four brain chemicals shape how your day feels: Dopamine (drive), Oxytocin (connection), Serotonin (mood) and Endorphins (stress relief). Pick one small action for each — those four become your daily goal. Everything else in the app is bonus, never homework.",
};

const OB_CHEM_INTRO = {
  d: "Drive, motivation and focus. Modern life spikes it cheaply; these actions rebuild it properly. Pick the one you'll actually do:",
  o: "Connection, warmth and belonging. It grows when you give it away. Pick your daily go-to:",
  s: "Steady mood and calm energy, built through light, food, sleep and nature. Pick yours:",
  e: "Your built-in stress release. Movement, heat, music, laughter. Pick your favourite:",
};

function startOnboarding() {
  obStep = 0;
  obChosen = { ...state.chosen };
  $("app").classList.add("hidden");
  $("onboarding").classList.remove("hidden");
  renderObStep();
}

function renderObStep() {
  const step = OB_STEPS[obStep];
  $("obBar").style.width = `${((obStep + 1) / OB_STEPS.length) * 100}%`;
  const c = $("obContent");

  if (step === "intro") {
    c.innerHTML = `
      <div>
        <div class="ob-kicker" style="background:linear-gradient(90deg,var(--d),var(--o),var(--s),var(--e));-webkit-background-clip:text;background-clip:text;color:transparent">DOSE Daily</div>
        <h2>${OB_INTRO.title}</h2>
        <p>${OB_INTRO.body}</p>
        <div class="ob-options">
          ${Object.keys(CHEMS).map(ch => `
            <div class="ob-option" style="border-color:transparent">
              <span class="ob-opt-emoji"><span class="tag c-${ch}" style="font-size:0.8rem;padding:4px 9px">${CHEMS[ch].letter}</span></span>
              <span><span class="ob-opt-title">${CHEMS[ch].name}</span>
              <div class="ob-opt-desc">${CHEMS[ch].line}</div></span>
            </div>`).join("")}
        </div>
      </div>`;
    $("obNext").textContent = "Let's pick my four";
  } else {
    const chem = CHEMS[step];
    c.innerHTML = `
      <div>
        <div class="ob-kicker c-${step}">${obStep} of 4 · ${chem.line}</div>
        <h2>${chem.name}</h2>
        <p>${OB_CHEM_INTRO[step]}</p>
        <div class="ob-options">
          ${ACTIONS.filter(a => a.chem === step).map(a => `
            <button class="ob-option c-${step} ${obChosen[step] === a.id ? "sel" : ""}" data-pick="${a.id}">
              <span class="ob-opt-emoji">${a.emoji}</span>
              <span><span class="ob-opt-title">${a.title}</span>
              <div class="ob-opt-desc">${a.desc}</div></span>
            </button>`).join("")}
        </div>
      </div>`;
    c.querySelectorAll("[data-pick]").forEach(btn => {
      btn.addEventListener("click", () => {
        obChosen[step] = btn.dataset.pick;
        c.querySelectorAll(".ob-option").forEach(b => b.classList.toggle("sel", b.dataset.pick === obChosen[step]));
      });
    });
    $("obNext").textContent = obStep === OB_STEPS.length - 1 ? "Start my first day" : "Continue";
  }
  window.scrollTo(0, 0);
}

function finishOnboarding() {
  state.chosen = { ...obChosen };
  state.onboarded = true;
  save();
  $("onboarding").classList.add("hidden");
  $("app").classList.remove("hidden");
  renderToday();
}

/* ─── Navigation ─── */

function showView(name) {
  currentView = name;
  $("viewToday").classList.toggle("hidden", name !== "today");
  $("viewPatterns").classList.toggle("hidden", name !== "patterns");
  $("navToday").classList.toggle("active", name === "today");
  $("navPatterns").classList.toggle("active", name === "patterns");
  if (name === "today") renderToday();
  if (name === "patterns") renderPatterns();
}

/* ─── Wire up ─── */

document.addEventListener("click", e => {
  const t = e.target.closest("[data-toggle]");
  if (t) toggleAction(t.dataset.toggle);
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => { currentTab = tab.dataset.time; renderTabs(); renderActions(); });
});

$("navToday").addEventListener("click", () => showView("today"));
$("navPatterns").addEventListener("click", () => showView("patterns"));
$("navSettings").addEventListener("click", openSettings);
$("streakBadge").addEventListener("click", () => showView("patterns"));

$("sheetBackdrop").addEventListener("click", e => { if (e.target === $("sheetBackdrop")) closeSettings(); });

$("obNext").addEventListener("click", () => {
  if (obStep === OB_STEPS.length - 1) finishOnboarding();
  else { obStep++; renderObStep(); }
});
$("obSkip").addEventListener("click", finishOnboarding);

/* re-render when returning to the app (new day, new time of day) */
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && state.onboarded && currentView === "today") {
    currentTab = defaultTab();
    renderToday();
  }
});

/* ─── Boot ─── */

if (state.onboarded) {
  $("app").classList.remove("hidden");
  renderToday();
} else {
  startOnboarding();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
