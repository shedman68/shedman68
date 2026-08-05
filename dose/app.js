/* ═══════════════════ DOSE Daily ═══════════════════
   A gentle daily checklist for the four feel-good brain
   chemicals. Content lives in content.js.
   All data stays in localStorage on this device only.   */

"use strict";

const byId = Object.fromEntries(ACTIONS.map(a => [a.id, a]));

const DEFAULT_CHOSEN = { d: "coldwater", o: "gratitude", s: "sunlight", e: "exercise" };

const CHEM_COLORS = { d: "var(--d)", o: "var(--o)", s: "var(--s)", e: "var(--e)" };

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

function dayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
}

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
  // a quiet today doesn't break the streak until the day is over
  let i = (todayChecks().length > 0) ? 0 : 1;
  for (; ; i++) {
    if ((state.checks[dkey(daysAgo(i))] || []).length > 0) n++;
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

/* ─── Insight rotation ───
   One bite-sized card per day, cycling through every piece of
   learn content in the app.                                */

function allBites() {
  const out = [];
  for (const c of Object.keys(CHEMS)) {
    for (const b of (CHEM_INFO[c].bites || [])) out.push({ ...b, chem: c, from: "chem" });
  }
  for (const a of ACTIONS) {
    for (const b of ((a.learn && a.learn.bites) || [])) out.push({ ...b, chem: a.chem, from: a.id });
  }
  return out;
}

function todaysInsight() {
  const bites = allBites();
  if (!bites.length) return null;
  return bites[dayOfYear() % bites.length];
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
      stroke-width="10" stroke-linecap="round"/>`;
  });
  $("ring").innerHTML = svg;
  $("ringCount").textContent = `${done.size}/4`;

  $("chemChips").innerHTML = order.map(c =>
    `<button class="chip c-${c} ${done.has(c) ? "done" : ""}" data-chem="${c}"
      aria-label="About ${CHEMS[c].name}">${CHEMS[c].letter}</button>`
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

  // the chosen action with the longest drought (3+ days)
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

function renderInsight() {
  const el = $("insight");
  const bite = todaysInsight();
  if (!bite) { el.classList.add("hidden"); return; }
  el.className = `insight card c-${bite.chem}`;
  el.innerHTML = `
    <div class="insight-label">
      <span class="dot c-${bite.chem}"></span>Today's insight · ${CHEMS[bite.chem].name}
    </div>
    <div class="insight-title">${bite.title}</div>
    <p class="insight-body">${bite.body}</p>
    <button class="learn-link" data-learn="${bite.from}" data-chem="${bite.chem}">
      ${bite.from === "chem" ? `More on ${CHEMS[bite.chem].name}` : `More on ${byId[bite.from].title}`} →
    </button>`;
}

function renderTabs() {
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("active", t.dataset.time === currentTab);
  });
}

function renderActions() {
  const actions = ACTIONS.filter(a => a.time === currentTab);
  // chosen first, then unchecked before checked
  actions.sort((a, b) => {
    const ac = Object.values(state.chosen).includes(a.id) ? 0 : 1;
    const bc = Object.values(state.chosen).includes(b.id) ? 0 : 1;
    if (ac !== bc) return ac - bc;
    return (isChecked(a.id) ? 1 : 0) - (isChecked(b.id) ? 1 : 0);
  });

  $("actionList").innerHTML = actions.map(a => {
    const chosen = Object.values(state.chosen).includes(a.id);
    const checked = isChecked(a.id);
    return `
    <div class="action ${checked ? "checked" : ""}">
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
      <div class="action-desc">
        ${a.short}
        ${a.learn ? `<button class="learn-link" data-learn="${a.id}">Why it works →</button>` : ""}
      </div>
    </div>`;
  }).join("");
}

function renderToday() {
  renderHeader();
  renderRing();
  renderNudge();
  renderInsight();
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
    const done = chemsDone(key);
    const dots = ["d", "o", "s", "e"].map(c =>
      `<span class="hm-dot c-${c} ${done.has(c) ? "on" : ""}"></span>`).join("");
    return `<div class="hm-day ${key === tKey ? "today" : ""} ${d > now ? "future" : ""}"
      title="${key}">${dots}</div>`;
  }).join("");

  $("legend").innerHTML = ["d", "o", "s", "e"].map(c =>
    `<span><span class="dot c-${c}"></span>${CHEMS[c].name}</span>`).join("");

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

/* ─── Toast & celebration ─── */

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
    html += `<span class="confetti" style="left:${Math.random() * 100}%;
      background:${colors[i % colors.length]};
      animation-duration:${1.6 + Math.random() * 1.4}s;
      animation-delay:${Math.random() * 0.5}s"></span>`;
  }
  box.innerHTML = html;
  setTimeout(() => { box.classList.add("hidden"); box.innerHTML = ""; }, 3600);
}

/* ─── Checking off ─── */

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
    const pool = PRAISE[byId[id].chem];
    toast(pool[Math.floor(Math.random() * pool.length)]);
    if (navigator.vibrate) navigator.vibrate(12);
  }
  save();

  if (chosenDoneToday().size === 4 && before === 3) {
    setTimeout(() => { toast("Full DOSE day! 🎉"); confetti(); }, 700);
  }
  const newStreak = streak();
  if (newStreak > prevStreak && MILESTONES[newStreak]) {
    setTimeout(() => toast(MILESTONES[newStreak]), 1400);
  }

  renderToday();
}

/* ═══════════════ Sheets ═══════════════ */

function openSheet(html) {
  $("sheetContent").innerHTML = html;
  $("sheetBackdrop").classList.remove("hidden");
  $("sheet").scrollTop = 0;
}

function closeSheet() { $("sheetBackdrop").classList.add("hidden"); }

function sheetHead(kicker, title, color) {
  return `
    <div class="sheet-head">
      <div>
        ${kicker ? `<div class="sheet-kicker" style="color:${color}">${kicker}</div>` : ""}
        <h2>${title}</h2>
      </div>
      <button class="sheet-close" data-close aria-label="Close">✕</button>
    </div>`;
}

function pillList(title, items, cls) {
  // sentence-length entries read better as rows than as tags
  const long = items.some(i => i.length > 30);
  const inner = long
    ? `<div class="note-list">${items.map(i => `<div class="note-item">${i}</div>`).join("")}</div>`
    : `<div class="pills">${items.map(i => `<span class="pill ${cls || ""}">${i}</span>`).join("")}</div>`;
  return `<div class="pill-group"><div class="pill-title">${title}</div>${inner}</div>`;
}

function biteCards(bites, chem) {
  return bites.map(b => `
    <div class="bite c-${chem}">
      <div class="bite-title">${b.title}</div>
      <p class="bite-body">${b.body}</p>
    </div>`).join("");
}

/* ── Chemical sheet ── */

function openChemSheet(chem) {
  const info = CHEM_INFO[chem], c = CHEMS[chem], color = CHEM_COLORS[chem];

  if (!info.ready) {
    openSheet(`
      ${sheetHead(c.line, c.name, color)}
      <p class="sheet-sub">The deeper ${c.name.toLowerCase()} material is still being added. Its five daily actions are already here and working.</p>
      ${actionRows(chem)}`);
    return;
  }

  openSheet(`
    ${sheetHead(c.line, c.name, color)}
    <div class="fact-grid">
      <div class="fact"><div class="fact-label">What it does</div>${info.fn.map(f => `<div class="fact-item">${f}</div>`).join("")}</div>
      <div class="fact"><div class="fact-label">How it works</div>${info.principles.map(f => `<div class="fact-item">${f}</div>`).join("")}</div>
    </div>

    <div class="fact-grid">
      <div class="fact low"><div class="fact-label">Running low</div>${info.low.map(f => `<div class="fact-item">${f}</div>`).join("")}</div>
      <div class="fact high"><div class="fact-label">Topped up</div>${info.high.map(f => `<div class="fact-item">${f}</div>`).join("")}</div>
    </div>

    ${pillList("What drains it", info.drains, "drain")}

    ${info.quote ? `<blockquote class="quote c-${chem}">“${info.quote}”</blockquote>` : ""}

    <div class="section-label">Worth knowing</div>
    ${biteCards(info.bites, chem)}

    <div class="section-label">Your ${c.name.toLowerCase()} actions</div>
    ${actionRows(chem)}`);
}

function actionRows(chem) {
  return `<div class="mini-list">` + ACTIONS.filter(a => a.chem === chem).map(a => `
    <button class="mini-row" data-learn="${a.id}">
      <span class="mini-emoji">${a.emoji}</span>
      <span class="mini-main">
        <span class="mini-title">${a.title}</span>
        <span class="mini-sub">${a.short}</span>
      </span>
      <span class="mini-arrow">›</span>
    </button>`).join("") + `</div>`;
}

const TIME_LABEL = { morning: "☀️ Morning", midday: "🌤 Midday", evening: "🌙 Evening" };

/* ── Action sheet ── */

function openActionSheet(id) {
  const a = byId[id], chem = CHEMS[a.chem], color = CHEM_COLORS[a.chem];
  const L = a.learn;

  let body = `
    ${sheetHead(`${chem.name} · ${TIME_LABEL[a.time]}`, `${a.emoji} ${a.title}`, color)}
    <p class="sheet-lead">${a.desc}</p>`;

  if (L && L.bites) {
    body += `<div class="section-label">Why it works</div>${biteCards(L.bites, a.chem)}`;
  }

  if (L && L.steps) {
    body += `<div class="section-label">How to do it</div><div class="steps">` +
      L.steps.map((s, i) => `
        <div class="step">
          <div class="step-num c-${a.chem}">${i + 1}</div>
          <div class="step-main">
            <div class="step-title">${s.title}</div>
            <p class="step-body">${s.body}</p>
          </div>
        </div>`).join("") + `</div>`;
  }

  if (L && L.quote) {
    body += `<blockquote class="quote c-${a.chem}">“${L.quote}”</blockquote>`;
  }

  if (L && L.groups) {
    body += `<div class="section-label">${L.groups.title}</div>`;
    if (L.groups.note) body += `<p class="group-note">${L.groups.note}</p>`;
    body += L.groups.sets.map(s => `
      <div class="group-block">
        <div class="group-name c-${a.chem}">${s.name}</div>
        <div class="pills">${s.items.map(i => `<span class="pill">${i}</span>`).join("")}</div>
      </div>`).join("");
  }

  if (L && L.list) body += pillList(L.list.title, L.list.items);

  if (L && L.challenge) {
    body += `
      <div class="challenge c-${a.chem}">
        <div class="challenge-label">Challenge</div>
        <div class="challenge-title">${L.challenge.title}</div>
        <p class="challenge-body">${L.challenge.body}</p>
      </div>`;
  }

  if (!L) body += `<p class="sheet-sub">More detail on this action is being added.</p>`;

  const isChosen = state.chosen[a.chem] === a.id;
  body += `
    <div class="sheet-cta">
      ${isChosen
        ? `<div class="chosen-note">⭐ This is your daily ${chem.name.toLowerCase()} action.</div>`
        : `<button class="btn-small" data-choose="${a.id}">Make this my ${chem.name.toLowerCase()} action</button>`}
      <button class="btn-primary" data-close>Got it</button>
    </div>`;

  openSheet(body);
}

/* ── Settings sheet ── */

function openSettings() {
  openSheet(`
    ${sheetHead("", "Settings", "")}
    <p class="sheet-sub">Your chosen action per chemical — the four that make a full DOSE day.</p>
    ${Object.keys(CHEMS).map(ch => `
      <div class="set-group">
        <div class="set-label" style="color:${CHEM_COLORS[ch]}">${CHEMS[ch].name} — ${CHEMS[ch].line}</div>
        <select class="set-select" data-chem-select="${ch}">
          ${ACTIONS.filter(a => a.chem === ch).map(a =>
            `<option value="${a.id}" ${state.chosen[ch] === a.id ? "selected" : ""}>${a.emoji} ${a.title}</option>`
          ).join("")}
        </select>
      </div>`).join("")}
    <div class="set-group">
      <div class="set-label">Your data</div>
      <div class="set-row-btns">
        <button class="btn-small" data-act="export">Export data</button>
        <button class="btn-small" data-act="redo">Re-run intro</button>
        <button class="btn-small btn-danger" data-act="reset">Reset everything</button>
      </div>
    </div>
    <p class="sheet-sub">Everything is stored only on this device. Export now and then to keep a backup.</p>`);
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `dose-daily-backup-${today()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ═══════════════ Onboarding ═══════════════ */

const OB_STEPS = ["intro", "d", "o", "s", "e"];
let obStep = 0;
let obChosen = { ...DEFAULT_CHOSEN };

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
        <div class="ob-kicker grad">DOSE Daily</div>
        <h2>Meet your DOSE</h2>
        <p>Four brain chemicals shape how your day feels: Dopamine (drive), Oxytocin (connection), Serotonin (mood) and Endorphins (stress relief). Pick one small action for each — those four become your daily goal. Everything else in the app is bonus, never homework.</p>
        <div class="ob-options">
          ${Object.keys(CHEMS).map(ch => `
            <div class="ob-option static">
              <span class="tag c-${ch} big">${CHEMS[ch].letter}</span>
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

/* ═══════════════ Navigation ═══════════════ */

function showView(name) {
  currentView = name;
  $("viewToday").classList.toggle("hidden", name !== "today");
  $("viewPatterns").classList.toggle("hidden", name !== "patterns");
  $("navToday").classList.toggle("active", name === "today");
  $("navPatterns").classList.toggle("active", name === "patterns");
  if (name === "today") renderToday();
  if (name === "patterns") renderPatterns();
}

/* ═══════════════ Events ═══════════════ */

document.addEventListener("click", e => {
  const toggle = e.target.closest("[data-toggle]");
  if (toggle) return toggleAction(toggle.dataset.toggle);

  const learn = e.target.closest("[data-learn]");
  if (learn) {
    const id = learn.dataset.learn;
    return id === "chem" ? openChemSheet(learn.dataset.chem) : openActionSheet(id);
  }

  const chem = e.target.closest("[data-chem]");
  if (chem && chem.dataset.chem && !chem.dataset.learn) return openChemSheet(chem.dataset.chem);

  const choose = e.target.closest("[data-choose]");
  if (choose) {
    const a = byId[choose.dataset.choose];
    state.chosen[a.chem] = a.id;
    save();
    closeSheet();
    renderToday();
    return toast(`⭐ ${a.title} is now your ${CHEMS[a.chem].name.toLowerCase()} action.`);
  }

  if (e.target.closest("[data-close]")) return closeSheet();

  const act = e.target.closest("[data-act]");
  if (act) {
    if (act.dataset.act === "export") return exportData();
    if (act.dataset.act === "redo") { closeSheet(); return startOnboarding(); }
    if (act.dataset.act === "reset" && confirm("Delete all history and choices on this device?")) {
      localStorage.removeItem(STORE_KEY);
      state = load();
      closeSheet();
      return startOnboarding();
    }
  }

  const pick = e.target.closest("[data-pick]");
  if (pick) {
    const step = OB_STEPS[obStep];
    obChosen[step] = pick.dataset.pick;
    document.querySelectorAll(".ob-option").forEach(b =>
      b.classList.toggle("sel", b.dataset.pick === obChosen[step]));
  }
});

document.addEventListener("change", e => {
  const sel = e.target.closest("[data-chem-select]");
  if (sel) {
    state.chosen[sel.dataset.chemSelect] = sel.value;
    save();
    renderToday();
  }
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => { currentTab = tab.dataset.time; renderTabs(); renderActions(); });
});

$("navToday").addEventListener("click", () => showView("today"));
$("navPatterns").addEventListener("click", () => showView("patterns"));
$("navSettings").addEventListener("click", openSettings);
$("streakBadge").addEventListener("click", () => showView("patterns"));

$("sheetBackdrop").addEventListener("click", e => {
  if (e.target === $("sheetBackdrop")) closeSheet();
});

$("obNext").addEventListener("click", () => {
  if (obStep === OB_STEPS.length - 1) finishOnboarding();
  else { obStep++; renderObStep(); }
});
$("obSkip").addEventListener("click", finishOnboarding);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && state.onboarded && currentView === "today") {
    currentTab = defaultTab();
    renderToday();
  }
});

/* ═══════════════ Boot ═══════════════ */

if (state.onboarded) {
  $("app").classList.remove("hidden");
  renderToday();
} else {
  startOnboarding();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
