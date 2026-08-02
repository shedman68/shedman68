/* ═══════════════════ DOSE Daily — content ═══════════════════
   All educational content and action definitions live here,
   separate from app logic, so each chemical can be filled in
   as its material is added.

   Distilled in original wording from the DOSE framework in
   TJ Power's "The DOSE Effect".                              */

"use strict";

/* ─── The four chemicals ─── */

const CHEMS = {
  d: { key: "d", letter: "D", name: "Dopamine",   line: "Drive & motivation" },
  o: { key: "o", letter: "O", name: "Oxytocin",   line: "Connection & love" },
  s: { key: "s", letter: "S", name: "Serotonin",  line: "Mood & energy" },
  e: { key: "e", letter: "E", name: "Endorphins", line: "Stress relief" },
};

/* ─── Chemical-level education ───
   Mirrors the book's summary page for each chemical.
   `bites` are the bite-sized cards shown in the learn sheet
   and rotated one-per-day as "Today's insight".            */

const CHEM_INFO = {
  d: {
    ready: true,
    fn: ["Motivation", "Concentration"],
    principles: ["Makes hard work feel good", "Controls your pleasure–pain balance"],
    low: ["Demotivated", "Distracted", "Low mood"],
    high: ["Motivated", "Determined", "Excited"],
    drains: ["Sugary foods", "Alcohol, drugs & vapes", "Pornography",
             "Gambling", "Online shopping", "Social media"],
    bites: [
      { title: "The pleasure–pain balance",
        body: "Your brain works hard to keep pleasure and pain level. Every effortless hit of pleasure gets paid back with a dip on the other side. Earn your dopamine through effort instead and the balance tips your way — the work comes first, and the good feeling lasts far longer." },
      { title: "It makes hard work feel good",
        body: "Dopamine is released as you move toward something that matters, not only when you arrive. That's why a difficult task you're making progress on can feel better than an easy one you've finished." },
      { title: "The signs it's running low",
        body: "Demotivated, distracted, low in mood. When that becomes your default setting, the fix usually isn't more stimulation — it's less of the cheap kind." },
      { title: "What quietly drains it",
        body: "Sugary food, alcohol and vapes, porn, gambling, online shopping, social media. All fast, all effortless, and all of them leave your baseline lower than they found it." },
      { title: "Every resisted urge is a rep",
        body: "Pick the quick-dopamine habit with the strongest grip on you. Each time the urge arrives and you don't act on it, that's one rep in the gym for your brain — and the muscle you're training is willpower." },
    ],
  },

  /* Awaiting book pages — the app degrades gracefully until then. */
  o: { ready: false, bites: [] },
  s: { ready: false, bites: [] },
  e: { ready: false, bites: [] },
};

/* ─── The 20 actions, five per chemical ───
   `learn` is optional: bites (why it works), steps (a protocol),
   and chips (a quick reference list).                        */

const ACTIONS = [
  /* ── Dopamine ── */
  {
    id: "flow", chem: "d", time: "morning", emoji: "🎯", title: "Flow State",
    desc: "One distraction-free block of deep focus on the thing that matters most. Push through the first awkward fifteen minutes and let momentum take over.",
    learn: {
      bites: [
        { title: "The first fifteen minutes are the wall",
          body: "At the start of a task your dopamine is still low and your brain goes hunting for an escape. This is the hardest part by a long way. Get past fifteen minutes and momentum takes over — that's the doorway into flow." },
        { title: "One task beats a long list",
          body: "Huge to-do lists are how procrastination starts: you look at everything at once and reach for your phone instead. Switching between tasks can cost you around 40% of your productivity. Pick one thing and finish it." },
        { title: "Harder work pays you more",
          body: "The more effort a task demands, the more dopamine your brain builds from it. Tackle the challenging thing in the morning and the lift carries through the rest of your day." },
      ],
      steps: [
        { title: "Select the task",
          body: "Choose one specific task you can realistically finish in the time you have. Challenging but achievable is the sweet spot — feeling yourself close in on the goal is what keeps the dopamine coming." },
        { title: "Tell someone",
          body: "Say out loud to a colleague or friend exactly what you're about to do: “I'm going to finish that presentation now.” Accountability makes you far more likely to see it through." },
        { title: "Eliminate distraction",
          body: "Close every app you might escape into — email, messaging, social — and don't reopen them until the task is done." },
        { title: "The stopwatch challenge",
          body: "Airplane mode on, start your phone's stopwatch, and leave it face up in another room. When you break, go and see how long you lasted. Then beat it tomorrow. Aim for fifteen minutes first, then thirty, then forty-five." },
      ],
      chips: {
        title: "Flow can happen in",
        items: ["Running or the gym", "Playing an instrument", "Painting or drawing",
                "Writing or journalling", "Coding or problem solving", "Gardening",
                "Cleaning", "Reading"],
      },
    },
  },
  {
    id: "discipline", chem: "d", time: "morning", emoji: "🛏️", title: "Discipline",
    desc: "Win the small stuff early — make your bed, tidy your space. An ordered environment quiets a cluttered mind.",
    learn: {
      bites: [
        { title: "Your space is your mind, externalised",
          body: "An organised room tends to produce organised thinking. Clean it, then notice how much clearer your head feels for the rest of the day." },
        { title: "Start with the bed",
          body: "Getting up and making your bed is a tiny, deliberate win banked before the day has had a chance to push you around." },
      ],
    },
  },
  {
    id: "phonefast", chem: "d", time: "morning", emoji: "📵", title: "Phone Fasting",
    desc: "Keep your phone out of reach for the first hour of the day, and an hour before bed. Let your brain wake up before the internet does.",
    learn: {
      bites: [
        { title: "The first hour sets the tone",
          body: "Reaching for your phone on waking hands your attention away before you've had the chance to claim it yourself. Protect that first hour and the whole day starts differently." },
        { title: "Finding space from it is a skill",
          body: "Distance from your phone isn't a single decision, it's a capacity you build. It isn't easy at first, and it keeps repaying you for years." },
      ],
    },
  },
  {
    id: "coldwater", chem: "d", time: "morning", emoji: "🧊", title: "Cold Water",
    desc: "Finish your shower cold for 30–60 seconds. It bites for a moment, then repays you with energy and drive all morning.",
    learn: {
      bites: [
        { title: "Deliberate discomfort, on your terms",
          body: "Cold water genuinely hurts for a moment — that's the point. You're training your ability to meet something unpleasant and stay in it, which is exactly the muscle you need when real challenges arrive." },
        { title: "The payoff outlasts the shock",
          body: "What follows is a stretch of accomplishment, energy and drive that a warm shower will never hand you." },
      ],
    },
  },
  {
    id: "pursuit", chem: "d", time: "midday", emoji: "🧭", title: "My Pursuit",
    desc: "A short stretch of time outdoors, phone-free, dreaming about and planning the future you're building.",
    learn: {
      bites: [
        { title: "A goal worth giving things up for",
          body: "The test of a real pursuit is simple: is it compelling enough that you'd let go of the easy hits — the scrolling, the sugar, the drink — in order to reach it?" },
        { title: "Dream it somewhere without a screen",
          body: "A short walk outdoors, no phone, just thinking about where you're heading. Nothing is more powerful than a vision of the future that lights a fire inside you." },
      ],
    },
  },

  /* ── Oxytocin ── */
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

  /* ── Serotonin ── */
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

  /* ── Endorphins ── */
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

/* ─── Praise & milestones ─── */

const PRAISE = {
  d: ["Dopamine, earned the real way. 🎯", "That's genuine drive. Nice.", "Motivation bank: topped up."],
  o: ["That's connection. It counts double. 💗", "Oxytocin flowing — someone felt that too.", "Warmth given is warmth kept."],
  s: ["Serotonin says thank you. ☀️", "Mood foundations: strengthened.", "Steady energy, coming up."],
  e: ["Endorphins unlocked. 💪", "Stress doesn't stand a chance.", "That one always pays you back."],
};

const MILESTONES = {
  3: "3-day streak — a pattern is forming. 🔥",
  7: "A full week! This is who you are now. 🔥",
  14: "Two weeks strong. Remarkable. 🔥",
  30: "30 days. You've rewired something. 🏆",
};
