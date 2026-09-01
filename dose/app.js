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

/* Stamped on every save and carried into exports, so a future sync or
   migration can tell which shape it's looking at. Bump on breaking
   changes to the stored structure. Must be declared before load() runs. */
const SCHEMA = 3;

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.checks && s.chosen) {
        if (!s.details) s.details = {};  // v2: which examples were ticked
        s.v = SCHEMA;
        return s;
      }
    }
  } catch (e) { /* corrupted storage — start fresh */ }
  return { v: SCHEMA, chosen: { ...DEFAULT_CHOSEN }, checks: {}, details: {}, onboarded: false };
}

function save() {
  state.v = SCHEMA;
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

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

/* which examples were ticked for an action today */
function todayDetails(id) {
  const d = state.details[today()];
  return (d && d[id]) || [];
}

/* how many times this action has been done in the last 7 days.
   Competence feedback ("your 3rd this week") reinforces without
   turning the app into a scoreboard — see PHILOSOPHY.md §7. */
function countThisWeek(id) {
  let n = 0;
  for (let i = 0; i < 7; i++) {
    if ((state.checks[dkey(daysAgo(i))] || []).includes(id)) n++;
  }
  return n;
}

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

/* transient flags so a freshly-completed thing can animate once */
let flashChem = null, flashEx = null;

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
    const L = a.learn || {};
    for (const b of (L.bites || [])) out.push({ ...b, chem: a.chem, from: a.id });
    for (const b of ((L.extended && L.extended.bites) || [])) out.push({ ...b, chem: a.chem, from: a.id });
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
    svg += `<path class="ring-seg ${on && c === flashChem ? "just" : ""}"
      pathLength="1" d="${arcPath(60, 60, 51, a0, a1)}"
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
  const yesterday = state.checks[dkey(daysAgo(1))] || [];

  if (Object.keys(state.checks).length < 2) { el.classList.add("hidden"); return; }

  /* Never miss twice. One missed day barely dents a forming habit —
     two in a row is where habits actually die. So the only moment worth
     nudging is the day after a miss, and the ask is small. */
  for (const c of Object.keys(CHEMS)) {
    const id = state.chosen[c];
    if (checks.includes(id) || yesterday.includes(id)) continue;
    if (countThisWeek(id) === 0) continue;      // not an established habit yet
    const a = byId[id];
    el.innerHTML = `↩️ You missed <b>${a.emoji} ${a.title}</b> yesterday — never miss twice.
      <span class="nudge-tiny">${TINY[id]}</span>`;
    el.classList.remove("hidden");
    return;
  }

  // otherwise, the chosen action with the longest drought (3+ days)
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

  if (worst) {
    const days = worstGap > 30 ? "a while" : `${worstGap} days`;
    el.innerHTML = `💡 It's been ${days} since <b>${worst.emoji} ${worst.title}</b> — is that a gap worth closing, or just not your thing?
      <span class="nudge-tiny">${TINY[worst.id]}</span>`;
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

function renderInsight() {
  const el = $("insightBtn");
  const bite = todaysInsight();
  if (!bite) { el.classList.add("hidden"); return; }
  el.classList.remove("hidden");
  el.className = `insight-btn c-${bite.chem}`;
  el.innerHTML = `<span class="dot c-${bite.chem}"></span>
    <span class="ib-label">Today's insight</span>
    <span class="ib-title">${bite.title}</span>
    <span class="ib-chev">›</span>`;
}

function openInsightSheet() {
  const bite = todaysInsight();
  if (!bite) return;
  openSheet(`
    ${sheetHead(`Today's insight · ${CHEMS[bite.chem].name}`, bite.title, CHEM_COLORS[bite.chem])}
    <p class="insight-read">${bite.body}</p>
    <div class="sheet-cta">
      <button class="btn-small" data-learn="${bite.from}" data-chem="${bite.chem}">
        ${bite.from === "chem" ? `More on ${CHEMS[bite.chem].name}` : `More on ${byId[bite.from].title}`}
      </button>
      <button class="btn-primary" data-close>Got it</button>
    </div>`);
}

/* ─── "How are you feeling?" — the way in ─── */

let feelPick = null;

function openFeelSheet(picked) {
  feelPick = picked;
  let body = sheetHead("Start here", "How are you feeling?", "");

  body += `
    <p class="sheet-lead">Pick whatever is closest. There's no wrong answer, and
      you don't need to know any of the chemistry — that's the app's job.</p>
    <div class="ex-grid">
      ${FEELINGS.map(f => `
        <button class="ex c-${f.chem} ${picked === f.word ? "on" : ""}"
          data-feel="${f.word}">${f.word}</button>`).join("")}
      <button class="ex ${picked === "ok" ? "on" : ""} feel-ok" data-feel="ok">Actually, fine</button>
    </div>`;

  if (picked === "ok") {
    body += `
      <div class="diagnosis">
        <div class="diag-line">Good. Then pick whatever appeals.</div>
        <p class="diag-why">A decent day is the best time to do the thing you'd struggle
          to face on a bad one. Your four are below.</p>
      </div>
      ${suggestionList(Object.values(state.chosen).map(id => byId[id]))}`;
  } else if (picked) {
    const chem = FEELINGS.find(f => f.word === picked).chem;
    const d = DIAGNOSIS[chem];
    body += `
      <div class="diagnosis c-${chem}">
        <div class="diag-line">${d.line}</div>
        <p class="diag-why">${d.why}</p>
      </div>
      <div class="section-label">What tends to help</div>
      ${suggestionList(suggestFor(chem))}`;
  }

  body += `<div class="sheet-cta"><button class="btn-primary" data-close>Close</button></div>`;
  openSheet(body, Boolean(picked));
}

/* three actions for a chemical, favouring ones that suit the time of day
   and ones you haven't already done today */
function suggestFor(chem) {
  const slot = defaultTab();
  return ACTIONS
    .filter(a => a.chem === chem)
    .sort((a, b) => {
      const score = x => (isChecked(x.id) ? 4 : 0) + (x.time === slot ? 0 : 1);
      return score(a) - score(b);
    })
    .slice(0, 3);
}

function suggestionList(list) {
  return `<div class="mini-list">` + list.map(a => `
    <button class="suggest ${isChecked(a.id) ? "done" : ""}" data-learn="${a.id}">
      <span class="mini-emoji">${a.emoji}</span>
      <span class="mini-main">
        <span class="mini-title">${a.title}</span>
        <span class="mini-sub">${TINY[a.id]}</span>
      </span>
      <span class="action-state">${isChecked(a.id) ? "✓" : "›"}</span>
    </button>`).join("") + `</div>`;
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
    const detail = todayDetails(a.id);
    return `
    <button class="action ${checked ? "checked" : ""}" data-learn="${a.id}">
      <span class="action-head">
        <span class="action-emoji">${a.emoji}</span>
        <span class="action-main">
          <span class="action-title">${a.title}${chosen ? '<span class="star">⭐</span>' : ""}</span>
          <span class="action-meta">
            <span class="tag c-${a.chem}">${CHEMS[a.chem].letter}</span>
            <span class="gives c-${a.chem}">${GIVES[a.id]}</span>
          </span>
        </span>
        <span class="action-state">${checked ? "✓" : "›"}</span>
      </span>

      <span class="action-desc">${a.short}</span>

      ${detail.length
        ? `<span class="action-picked">${detail.map(d => `<span>${d}</span>`).join("")}</span>`
        : `<span class="action-cta c-${a.chem}">See what counts →</span>`}
    </button>`;
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
function toast(msg, sub) {
  const el = $("toast");
  el.innerHTML = sub
    ? `<span>${msg}</span><span class="toast-sub">${sub}</span>`
    : `<span>${msg}</span>`;
  el.classList.toggle("stacked", Boolean(sub));
  el.classList.remove("hidden", "out");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.classList.add("hidden"), 350);
  }, sub ? 2800 : 2200);
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

function toggleAction(id, quiet) {
  const key = today();
  if (!state.checks[key]) state.checks[key] = [];
  const list = state.checks[key];
  const idx = list.indexOf(id);
  const before = chosenDoneToday().size;
  const prevStreak = streak();

  if (idx >= 0) {
    list.splice(idx, 1);
    // un-ticking the action drops any examples recorded against it
    if (state.details[key]) delete state.details[key][id];
  } else {
    list.push(id);
    const chem = byId[id].chem;
    const pool = PRAISE[chem];
    const n = countThisWeek(id);
    // praise first, then a plain fact about progress — informational, not a score
    toast(pool[Math.floor(Math.random() * pool.length)],
          n > 1 ? `${ORDINAL[n] || n + "th"} time this week` : null);
    flashChem = chem;
    setTimeout(() => { flashChem = null; }, 900);
    if (!quiet && navigator.vibrate) navigator.vibrate(12);
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

function openSheet(html, keepScroll) {
  const top = keepScroll ? $("sheet").scrollTop : 0;
  $("sheetContent").innerHTML = html;
  $("sheetBackdrop").classList.remove("hidden");
  $("sheet").scrollTop = top;
}

function closeSheet() {
  $("sheetBackdrop").classList.add("hidden");
  feelPick = null;
}

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

function pillList(title, items, cls, note) {
  // sentence-length entries read better as rows than as tags
  const long = items.some(i => i.length > 30);
  const inner = long
    ? `<div class="note-list">${items.map(i => `<div class="note-item">${i}</div>`).join("")}</div>`
    : `<div class="pills">${items.map(i => `<span class="pill ${cls || ""}">${i}</span>`).join("")}</div>`;
  return `<div class="pill-group">
    <div class="pill-title">${title}</div>
    ${note ? `<p class="group-note">${note}</p>` : ""}
    ${inner}</div>`;
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

  const facts = (a, b) => (a || b) ? `<div class="fact-grid">${a || ""}${b || ""}</div>` : "";
  const fact = (label, items, cls) => items
    ? `<div class="fact ${cls || ""}"><div class="fact-label">${label}</div>${
        items.map(f => `<div class="fact-item">${f}</div>`).join("")}</div>`
    : "";

  const bites = info.bites || [];

  openSheet(`
    ${sheetHead(c.line, c.name, color)}
    ${facts(fact("What it does", info.fn), fact("How it works", info.principles))}
    ${facts(fact("Running low", info.low, "low"), fact("Topped up", info.high, "high"))}
    ${info.drains ? pillList("What drains it", info.drains, "drain") : ""}
    ${info.quote ? `<blockquote class="quote c-${chem}">“${info.quote}”</blockquote>` : ""}
    ${bites.length ? `<div class="section-label">Worth knowing</div>${biteCards(bites, chem)}` : ""}
    ${!info.ready ? `<p class="sheet-sub">More ${c.name.toLowerCase()} material is still being added.</p>` : ""}
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

/* ── Movement figures ──
   Simple line-art poses drawn in currentColor so they inherit the
   chemical's accent and work in both light and dark themes.      */

const FIGURES = {
  /* standing tall, both arms stretched overhead */
  reachup: `
    <circle cx="50" cy="42" r="7"/>
    <path d="M43 54 H57"/>
    <path d="M50 54 V80"/>
    <path d="M43 54 L34 16"/><path d="M57 54 L66 16"/>
    <path d="M50 80 L42 106"/><path d="M50 80 L58 106"/>
    <g opacity=".4">
      <path d="M18 58 V30"/><path d="M14 36 L18 29 L22 36"/>
      <path d="M82 58 V30"/><path d="M78 36 L82 29 L86 36"/>
    </g>`,
  /* side view, folded forward reaching for the toes */
  reachdown: `
    <circle cx="70" cy="66" r="7"/>
    <path d="M44 54 L63 62"/>
    <path d="M63 64 L55 100"/>
    <path d="M44 54 L41 104"/><path d="M44 54 L49 104"/>
    <path d="M39 105 H55"/>
    <g opacity=".4">
      <path d="M86 52 V86"/><path d="M82 80 L86 87 L90 80"/>
    </g>`,
  /* hanging from a bar, feet clear of the floor */
  hang: `
    <path d="M22 22 H78"/>
    <circle cx="50" cy="46" r="7"/>
    <path d="M38 24 V40"/><path d="M62 24 V40"/>
    <path d="M38 40 L46 52"/><path d="M62 40 L54 52"/>
    <path d="M50 53 V78"/>
    <path d="M50 78 L43 96 L47 106"/><path d="M50 78 L57 96 L53 106"/>`,
  /* front view, arms swung across the body */
  twist: `
    <circle cx="50" cy="26" r="7"/>
    <path d="M50 34 V70"/>
    <path d="M50 42 L76 35"/><path d="M50 47 L74 45"/>
    <path d="M50 70 L42 104"/><path d="M50 70 L58 104"/>
    <g opacity=".4">
      <path d="M30 56 A 20 7 0 1 0 66 52"/>
      <path d="M60 46 L67 51 L61 57"/>
    </g>`,
};

function movementBlock(m, chem) {
  return `
    <div class="movement">
      <div class="fig c-${chem}">
        <svg viewBox="0 0 100 120" aria-hidden="true" fill="none"
          stroke="currentColor" stroke-width="3.2"
          stroke-linecap="round" stroke-linejoin="round">${FIGURES[m.figure] || ""}</svg>
      </div>
      <div class="movement-main">
        <div class="movement-name">${m.name}</div>
        <p class="movement-body">${m.body}</p>
      </div>
    </div>`;
}

/* ── Action sheet ── */

let openWhy = null;   // which "why" chunk is expanded
let whyFor = null;    // and which action it belongs to

function openActionSheet(id, keepScroll) {
  const a = byId[id], chem = CHEMS[a.chem], color = CHEM_COLORS[a.chem];
  const L = a.learn || {};
  const picked = todayDetails(id);
  const done = isChecked(id);
  const weekCount = countThisWeek(id);

  if (whyFor !== id) { openWhy = null; whyFor = id; }

  let body = `
    ${sheetHead(`${chem.name} · ${TIME_LABEL[a.time]}`, `${a.emoji} ${a.title}`, color)}
    <p class="sheet-lead">${a.short}</p>`;

  /* ── 1. how to do it ── */

  if (L.steps) {
    body += `<div class="section-label">${L.stepsTitle || "How to do it"}</div><div class="steps">` +
      L.steps.map((s, i) => `
        <div class="step">
          <div class="step-num c-${a.chem}">${i + 1}</div>
          <div class="step-main">
            <div class="step-title">${s.title}</div>
            <p class="step-body">${s.body}</p>
          </div>
        </div>`).join("") + `</div>`;
  }

  if (L.movements) {
    for (const M of (Array.isArray(L.movements) ? L.movements : [L.movements])) {
      body += `<div class="section-label">${M.title}</div>`;
      if (M.note) body += `<p class="group-note">${M.note}</p>`;
      body += M.items.map(m => movementBlock(m, a.chem)).join("");
      if (M.cadence) {
        body += `<div class="cadence">${M.cadence.map(c => `
          <div class="cadence-col">
            <div class="cadence-label c-${a.chem}">${c.label}</div>
            ${c.lines.map(l => `<div class="cadence-line">${l}</div>`).join("")}
          </div>`).join("")}</div>`;
      }
    }
  }

  if (L.prompt) {
    const p = L.prompt;
    body += `
      <div class="prompt c-${a.chem}">
        <div class="prompt-label">${p.label}</div>
        <div class="prompt-q">“${p.question}”</div>
        ${p.examples ? `<ul class="prompt-examples">${p.examples.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}
        ${p.follow ? `<p class="prompt-follow">${p.follow}</p>` : ""}
      </div>`;
  }

  if (L.groups) {
    body += `<div class="section-label">${L.groups.title}</div>`;
    if (L.groups.note) body += `<p class="group-note">${L.groups.note}</p>`;
    body += L.groups.sets.map(s => `
      <div class="group-block">
        <div class="group-name c-${a.chem}">${s.name}</div>
        <div class="pills">${s.items.map(i => `<span class="pill">${i}</span>`).join("")}</div>
      </div>`).join("");
  }

  if (L.list) {
    const lists = Array.isArray(L.list) ? L.list : [L.list];
    body += lists.map(l => pillList(l.title, l.items, "", l.note)).join("");
  }

  if (L.caution) body += `<div class="caution">${L.caution}</div>`;

  /* ── 2. log it — ticking an example is the whole interaction ── */

  body += `
    <div class="section-label">What did you do?</div>
    <p class="group-note">Tap whatever you managed. Even the smallest one counts.</p>
    <div class="ex-grid">
      ${(EXAMPLES[id] || []).map(x => `
        <button class="ex c-${a.chem} ${picked.includes(x) ? "on" : ""} ${x === flashEx ? "just" : ""}"
          data-ex="${id}" data-exval="${x.replace(/"/g, "&quot;")}">${x}</button>`).join("")}
    </div>
    ${done && weekCount > 1
      ? `<p class="competence">✓ Logged — that's your ${ORDINAL[weekCount] || weekCount + "th"} this week.</p>`
      : done ? `<p class="competence">✓ Logged for today.</p>` : ""}`;

  /* ── 3. why it works, in chunks you can open one at a time ── */

  const why = L.bites || [];

  if (why.length) {
    body += `<div class="section-label">Why this works</div>${whyList(why, a.chem, 0)}`;
  }

  if (L.extended) {
    body += `
      <div class="section-label">${L.extended.title}</div>
      <p class="extra-note">${L.extended.note}</p>
      ${whyList(L.extended.bites, a.chem, why.length)}`;
  }

  if (L.quote) body += `<blockquote class="quote c-${a.chem}">“${L.quote}”</blockquote>`;

  if (L.challenge) {
    const list = Array.isArray(L.challenge) ? L.challenge : [L.challenge];
    body += list.map(c => `
      <div class="challenge c-${a.chem}">
        <div class="challenge-label">Challenge</div>
        <div class="challenge-title">${c.title}</div>
        <p class="challenge-body">${c.body}</p>
        ${c.items ? `<ul class="challenge-list">${c.items.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}
      </div>`).join("");
  }

  if (REFLECT[id]) {
    body += `
      <div class="reflect c-${a.chem}">
        <div class="reflect-label">Is this your one?</div>
        <p class="reflect-body">${REFLECT[id]}</p>
      </div>`;
  }

  body += `<div class="sheet-cta">${chooseCta(a, chem)}</div>`;
  openSheet(body, keepScroll);
}

/* Why, as headlines you open one at a time — the reasoning is worth
   having, a wall of it is not. `offset` keeps indices unique across
   the two groups on a sheet. */
function whyList(bites, chem, offset) {
  return `<div class="why-list">` + bites.map((b, i) => {
    const n = i + offset;
    const open = openWhy === n;
    return `
      <div class="why-item ${open ? "open" : ""}">
        <button class="why-head" data-why="${n}">
          <span class="why-dot c-${chem}"></span>
          <span class="why-title">${b.title}</span>
          <span class="why-chev">${open ? "−" : "+"}</span>
        </button>
        ${open ? `<p class="why-body">${b.body}</p>` : ""}
      </div>`;
  }).join("") + `</div>`;
}

/* the pick-this / close pair at the foot of an action sheet */
function chooseCta(a, chem) {
  const isChosen = state.chosen[a.chem] === a.id;
  return `
    ${isChosen
      ? `<div class="chosen-note">⭐ This is your daily ${chem.name.toLowerCase()} action.</div>`
      : `<button class="btn-small" data-choose="${a.id}">Make this my ${chem.name.toLowerCase()} action</button>`}
    <button class="btn-primary" data-close>Got it</button>`;
}

/* ticking an example records the detail and marks the action done;
   clearing the last one un-marks it again */
function toggleExample(id, value) {
  const key = today();
  if (!state.details[key]) state.details[key] = {};
  const list = state.details[key][id] || (state.details[key][id] = []);
  const i = list.indexOf(value);

  if (i >= 0) list.splice(i, 1);
  else list.push(value);

  flashEx = i >= 0 ? null : value;
  setTimeout(() => { flashEx = null; }, 500);

  const shouldBeChecked = list.length > 0;
  if (shouldBeChecked !== isChecked(id)) toggleAction(id, true);
  else save();

  if (navigator.vibrate) navigator.vibrate(8);
  renderToday();
  openActionSheet(id, true);
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
      <div class="set-label">Daily reminders</div>
      <div id="reminderBox"></div>
    </div>

    <div class="set-group">
      <div class="set-label">Your data</div>
      <div class="set-row-btns">
        <button class="btn-small" data-act="export">Export data</button>
        <button class="btn-small" data-act="redo">Re-run intro</button>
        <button class="btn-small btn-danger" data-act="reset">Reset everything</button>
      </div>
    </div>
    <p class="sheet-sub">Your DOSE history is stored only on this device. Export now and then to keep a backup.</p>`);

  renderReminders();
}

/* ─── Reminders ─── */

const DEFAULT_SLOTS = ["08:00", "13:00", "20:00"];

function reminderSlots() {
  const r = state.reminders;
  return (r && Array.isArray(r.slots) && r.slots.length) ? r.slots : DEFAULT_SLOTS;
}

async function renderReminders() {
  const box = $("reminderBox");
  if (!box) return;

  const blocker = PUSH.blocker();
  if (blocker) {
    box.innerHTML = `<p class="sheet-sub" style="margin:0">${blocker}</p>`;
    return;
  }

  const on = Boolean(state.reminders && state.reminders.enabled) && Boolean(await PUSH.subscription());
  const slots = reminderSlots();

  box.innerHTML = `
    <button class="btn-done ${on ? "is-done" : ""}" data-act="rem-toggle">
      ${on ? "✓ Reminders on" : "Turn on reminders"}
    </button>
    <div class="rem-times ${on ? "" : "dim"}">
      ${["Morning", "Midday", "Evening"].map((label, i) => `
        <label class="rem-row">
          <span>${label}</span>
          <input type="time" class="rem-input" data-slot="${i}"
            value="${slots[i] || DEFAULT_SLOTS[i]}" ${on ? "" : "disabled"}>
        </label>`).join("")}
    </div>
    <p class="sheet-sub" style="margin:10px 0 0">
      A gentle nudge, nothing more — no counts, no guilt. Only the times and this
      device's notification token leave your phone.</p>`;
}

async function setReminders(enable) {
  const slots = reminderSlots();
  try {
    if (enable) {
      await PUSH.enable(slots);
      state.reminders = { enabled: true, slots };
      toast("Reminders on. 🔔");
    } else {
      await PUSH.disable();
      state.reminders = { enabled: false, slots };
      toast("Reminders off.");
    }
    save();
  } catch (e) {
    toast(String(e.message || e).includes("Permission") ? "Notifications were declined." : "Couldn't reach the server.");
  }
  renderReminders();
}

async function saveReminderTimes() {
  const inputs = [...document.querySelectorAll(".rem-input")];
  const slots = inputs.map(i => i.value).filter(Boolean);
  if (slots.length !== inputs.length) return;
  state.reminders = { enabled: true, slots };
  save();
  try {
    await PUSH.update(slots);
    toast("Times updated.");
  } catch {
    toast("Saved on device — couldn't reach the server.");
  }
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
  d: "The chemical creating your drive. It controls how motivated you feel and your capacity to stay focused on your goals — built naturally by completing challenging things, and spiked then crashed by everything quick the modern world offers. Pick the one you'll actually do:",
  o: "The chemical that gives our purpose a scientific shape: love for yourself and the people around you. It's built through service to others and service to yourself. Pick the one that would change most:",
  s: "The natural chemical. It wants you to eat real food, sleep deeply, and breathe in the outdoors — and it's built mostly in your gut. Pick the one that would shift your mood and energy most:",
  e: "The chemicals that de-stress your brain and body. Our modern world is fast and, honestly, stressful — so having something that reduces that on demand is quite a gift. Pick the one you'd genuinely look forward to:",
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
  if (toggle) {
    toggleAction(toggle.dataset.toggle);
    // if we're ticking from inside the feeling sheet, keep it in sync
    if (feelPick && !$("sheetBackdrop").classList.contains("hidden")) openFeelSheet(feelPick);
    return;
  }

  const feel = e.target.closest("[data-feel]");
  if (feel) return openFeelSheet(feel.dataset.feel);

  const whyBtn = e.target.closest("[data-why]");
  if (whyBtn) {
    const n = Number(whyBtn.dataset.why);
    openWhy = openWhy === n ? null : n;
    return openActionSheet(whyFor, true);
  }

  const ex = e.target.closest("[data-ex]");
  if (ex) return toggleExample(ex.dataset.ex, ex.dataset.exval);

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
    if (act.dataset.act === "rem-toggle") {
      return setReminders(!(state.reminders && state.reminders.enabled));
    }
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
  if (e.target.closest(".rem-input")) return saveReminderTimes();

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

$("feelBtn").addEventListener("click", () => openFeelSheet(null));
$("insightBtn").addEventListener("click", openInsightSheet);

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
