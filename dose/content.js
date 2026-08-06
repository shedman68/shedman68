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
      { title: "Your first hit sets the direction",
        body: "Wherever your brain gets its first dopamine of the day, it keeps steering you that way for hours afterwards. Start with scrolling and it will hunt for more of the same. Start with something that took a little effort and the whole day tilts toward effort." },
      { title: "You're in the driving seat",
        body: "This is the part worth keeping: how motivated you feel isn't fixed. Lean on the quick hits and anything meaningful starts to feel like a chore. Prioritise the earned kind and chasing the life you actually want gets easier than it's ever been." },
    ],
  },

  o: {
    ready: true,
    fn: ["Relationships", "Confidence"],
    principles: ["Requires good-quality in-person connection", "Requires positive, grateful self-talk"],
    low: ["Lonely", "Unconfident"],
    high: ["Connected", "Confident"],
    drains: ["Lack of socialising", "Phones during social time", "Online comparison", "Critical self-talk"],
    quote: "Happiness is equal to reality minus expectations.",
    bites: [
      { title: "The great facilitator of life",
        body: "Oxytocin is what makes you want to bond, work alongside people and care for them. It's also the first chemical you ever ran on — it surges in your mum's brain at your birth to create the pair bond, and in yours to make you want that love right back." },
      { title: "It flows in both directions",
        body: "In any moment where love is given or received, both people get the rise. There is no version of this where being warm toward someone costs you something." },
      { title: "It wants you in the room",
        body: "Screens are a poor substitute for presence. What oxytocin responds to is good-quality, in-person connection — and a phone pulling your attention mid-conversation is enough to weaken it." },
      { title: "Loneliness is a health issue, not a mood",
        body: "We evolved to survive in groups, so exclusion registers as a genuine threat. Prolonged loneliness is now considered about as damaging to your health as smoking." },
      { title: "The other half is how you talk to yourself",
        body: "Giving and receiving love isn't only something you do with other people. An inner narrator that judges how you look, how you live and how successful you are is one of the biggest drains on oxytocin there is." },
      { title: "Happiness = reality − expectations",
        body: "Worth reading slowly. When reality overshoots what you expected, happiness turns up on its own. Most disappointment is an expectations problem rather than a reality problem." },
    ],
  },

  /* Awaiting book pages — the app degrades gracefully until then. */
  s: { ready: false, bites: [] },
  e: { ready: false, bites: [] },
};

/* ─── The 20 actions, five per chemical ───
   `short`  one line, shown on the daily checklist
   `desc`   fuller framing, opens the detail sheet
   `learn`  optional depth: bites, steps, quote, groups, list, challenge */

const ACTIONS = [
  /* ── Dopamine ── */
  {
    id: "flow", chem: "d", time: "morning", emoji: "🎯", title: "Flow State",
    short: "Enter deep states of focus.",
    desc: "One distraction-free block of deep focus on the thing that matters most. Push past the first fifteen minutes and momentum takes over.",
    learn: {
      bites: [
        { title: "The first fifteen minutes are the wall",
          body: "At the start of a task your dopamine is still low and your brain goes hunting for an escape. This is the hardest part by a long way. Get past fifteen minutes and momentum takes over — that's the doorway into flow." },
        { title: "One task beats a long list",
          body: "Huge to-do lists are how procrastination starts: you look at everything at once and reach for your phone instead. Switching between tasks can cost you around 40% of your productivity. Pick one thing and finish it." },
        { title: "Harder work pays you more",
          body: "The more effort a task demands, the more dopamine your brain builds from it. Tackle the challenging thing in the morning and the lift carries through the rest of your day." },
        { title: "Some brains feel it more",
          body: "A lower dopamine baseline means a steeper rise during an activity you genuinely love. That's why an ADHD brain can find starting almost impossible, then disappear into hyperfocus once it's in. Finding the right activity matters more, not less." },
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
      groups: {
        title: "Find something you love",
        note: "Flow needs an activity worth entering. Experiment until one of these genuinely pulls you in.",
        sets: [
          { name: "Artistic", items: ["Drawing", "Writing", "Painting", "Music", "Video", "Craft", "Knitting"] },
          { name: "Educational", items: ["Studying", "Problem solving", "Puzzles", "Podcasts", "Reading", "Learning a new skill"] },
          { name: "Sport-based", items: ["Football", "Swimming", "Working out", "Dance", "Golf", "Yoga", "Cycling"] },
        ],
      },
      challenge: {
        title: "The 7-day Flow State Challenge",
        body: "One deep-focus session on your chosen activity every day for the next seven days — morning, afternoon, or both. Tell someone close to you that you're doing it. Every time you notice the pull of distraction and stay with the task anyway, you strengthen the part of your brain that makes focus possible.",
      },
    },
  },
  {
    id: "discipline", chem: "d", time: "morning", emoji: "🛏️", title: "Discipline",
    short: "Keep an organised, clean and calm home.",
    desc: "Win the small stuff early — make your bed, tidy your space. An ordered environment quiets a cluttered mind.",
    learn: {
      bites: [
        { title: "Your space is your mind, externalised",
          body: "An organised room tends to produce organised thinking. Clean it, then notice how much clearer your head feels for the rest of the day." },
        { title: "Start with the bed",
          body: "Getting up and making your bed is a tiny, deliberate win banked before the day has had a chance to push you around — and it's the first dopamine of your day, earned rather than swiped." },
      ],
      list: {
        title: "Healthy ways to start a morning",
        items: ["Making your bed", "Going outside", "Cold shower", "Washing your face",
                "Reading", "Brushing your teeth"],
      },
    },
  },
  {
    id: "phonefast", chem: "d", time: "morning", emoji: "📵", title: "Phone Fasting",
    short: "Find space from your phone, morning and evening.",
    desc: "A daily commitment to time away from your phone — a protected stretch of the morning, and a proper block in the evening.",
    learn: {
      bites: [
        { title: "The first hour sets the tone",
          body: "Reaching for your phone on waking hands your attention away before you've had a chance to claim it yourself. Protect that first stretch and the whole day starts differently." },
        { title: "Finding space from it is a skill",
          body: "Distance from your phone isn't a single decision, it's a capacity you build. It isn't easy at first, and it keeps repaying you for years." },
      ],
      steps: [
        { title: "The morning fast",
          body: "Don't touch your phone until one of two things has happened: you're washed, dressed and ready for the day, or you've been outside and seen daylight." },
        { title: "The evening fast",
          body: "Aim for a minimum of sixty unbroken minutes in the evening without seeing your phone at all. Evenings are where scrolling quietly eats the time meant for connection, rest and exercise." },
      ],
      quote: "I must see sunlight before I see social media.",
      list: {
        title: "Good windows for the evening fast",
        items: ["While exercising — phone in a locker, or airplane mode and music only",
                "While cooking and eating dinner — phone in another room"],
      },
    },
  },
  {
    id: "coldwater", chem: "d", time: "morning", emoji: "🧊", title: "Cold Water",
    short: "Turn your shower cold to supercharge motivation.",
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
    short: "Choose the goal you're really seeking in life.",
    desc: "A phone-free walk outdoors, thinking properly about the future you're building and what you're actually aiming at.",
    learn: {
      bites: [
        { title: "A goal worth giving things up for",
          body: "The test of a real pursuit is simple: is it compelling enough that you'd let go of the easy hits — the scrolling, the sugar, the drink — in order to reach it?" },
        { title: "Hopes need quiet to become plans",
          body: "Most of us have hopes and dreams and stay too distracted to do anything with them. Nothing is more powerful than a vision of the future that lights a fire inside you — but it needs uninterrupted time to take shape." },
      ],
      steps: [
        { title: "Walk without your phone",
          body: "Head somewhere natural, ideally in the morning. If you need the phone with you to feel safe, put it in your bag on airplane mode." },
        { title: "Ask yourself two questions",
          body: "“What is my pursuit?” and “What am I really seeking in my life right now?” Talk it through out loud with yourself if that helps — it usually does." },
        { title: "Give it real time, in silence",
          body: "No podcasts, no music. Around forty-five minutes of genuinely turning the question over is what separates coming home with a plan from coming home with a vague intention." },
      ],
      list: {
        title: "The pursuit you want most",
        items: ["Career", "Family", "Health", "Creativity", "Your DOSE"],
      },
      challenge: {
        title: "Find your pursuit",
        body: "Take the walk in silence, then tell someone you're close to exactly which of the five you've chosen and why it matters to you right now.",
      },
    },
  },

  /* ── Oxytocin ── */
  {
    id: "contribution", chem: "o", time: "midday", emoji: "🤝", title: "Contribution",
    short: "Support someone other than yourself.",
    desc: "Do one thing today that supports someone else, however small. Helping others is the fastest route back to feeling connected.",
    learn: {
      bites: [
        { title: "Serving others serves you too",
          body: "The person you help feels it, and so do you — that's the design, not a happy accident. Orienting your day toward the people you love turns out to be one of the most satisfying things you can do." },
        { title: "You already contribute more than you credit",
          body: "It's easy to put enormous effort into your work and your family without ever recognising it as contribution. Noticing what you already give isn't vanity — it's the part most people skip." },
        { title: "Even strangers count",
          body: "Research from 2014 found that brief, fleeting connections with strangers measurably lift both wellbeing and your sense of community. The quick exchange with someone at the till may matter more than you'd guess — to them and to you." },
      ],
      groups: {
        title: "Four places to contribute",
        note: "Read through and notice which of the four instinctively feels most important to you and the people around you right now. Start there.",
        sets: [
          { name: "Friends and family", items: ["Financial support", "Cleaning and organising", "Childcare",
              "Emotional support", "Cooking", "Educating", "Quality time",
              "Celebrating their wins", "Surprises"] },
          { name: "Work", items: ["High-quality work", "A good team environment", "Taking the initiative",
              "Being a good leader", "Solving problems", "Making an impact"] },
          { name: "Charitable work", items: ["Food bank volunteering", "Donating blood", "Mentoring",
              "Animal shelters", "Litter picks", "Elderly companionship",
              "Fundraising", "Donating possessions"] },
          { name: "Community", items: ["Smile at strangers", "Nod and say hello", "A word with the barista",
              "Chat with shop staff", "Take part in local life"] },
        ],
      },
      challenge: {
        title: "The 7-day Contribution Challenge",
        body: "One random act of kindness every day for the next seven days, from any of the four areas. Small counts.",
        items: ["Cook someone a nice meal", "Help somebody with their kids",
                "Spend time really listening to someone", "Help a colleague with something hard",
                "Give time or possessions to a charity", "Invent your own act of kindness"],
      },
    },
  },
  {
    id: "touch", chem: "o", time: "evening", emoji: "🫂", title: "Touch",
    short: "Hug the people or pets you love.",
    desc: "Hug the people (or pets) you love. Warm physical connection settles your whole nervous system.",
    learn: {
      bites: [
        { title: "The original delivery method",
          body: "Physical touch is how you first received love at all — one of the ways oxytocin was progressively built in you long before you could understand a word. It still works exactly the same way." },
      ],
    },
  },
  {
    id: "social", chem: "o", time: "midday", emoji: "☕", title: "Social Life",
    short: "Make real, undivided contact with someone.",
    desc: "Reach out or meet up — a walk, a coffee, or a proper conversation with someone you care about.",
    learn: {
      bites: [
        { title: "A phone on the table costs you",
          body: "When attention gets pulled away mid-conversation, the connection never fully lands. This is the other reason to protect your evening phone fast — it isn't only about dopamine." },
        { title: "Ask a better question",
          body: "“How was your day?” earns you a shrug. “What did you enjoy most today?” earns you an actual conversation, and the oxytocin that comes with it." },
        { title: "We were built to do things together",
          body: "Your ancestors spent their time building, walking, exploring, hunting and foraging side by side. Shared activity, not sitting opposite someone, is the native format for human connection." },
        { title: "Nature makes people listen better",
          body: "Research found that when people socialise in natural environments they pay closer attention to one another and connect more deeply. A walk somewhere green beats a table indoors." },
      ],
      groups: {
        title: "Two ways to connect properly",
        note: "Both give you quality time with someone and a second chemical for free.",
        sets: [
          { name: "Exercising together", items: ["Jogging", "Cycling", "Lifting weights", "Dance classes",
              "Yoga", "Pilates", "Martial arts", "Playing sport"] },
          { name: "In nature", items: ["Walking", "Cycling", "Relaxing on the grass",
              "Looking at and smelling plants"] },
        ],
      },
    },
  },
  {
    id: "gratitude", chem: "o", time: "evening", emoji: "🙏", title: "Gratitude",
    short: "Notice what's good — and say thank you.",
    desc: "Two halves: feeling grateful for what you already have, and telling someone out loud that you're grateful for them.",
    learn: {
      bites: [
        { title: "The only real antidote to comparison",
          body: "Comparison is the act of dwelling on what you don't have — wealth, homes, holidays, looks, experiences. Gratitude is the one move that reverses it, because it makes you think actively about what you do have." },
        { title: "Your inner critic isn't broken",
          body: "A mind that spots its own mistakes and pushes for progress is genuinely useful — that's why you have one. The problem is a world that feeds it endless alternative ways to look, feel and live, until the analysis never stops." },
        { title: "The news quietly trains your outlook",
          body: "Your brain is a learning machine and it conditions easily. Hearing every day that the wider world is going wrong changes how you read your own life. Deliberately noticing what's good is the counterweight." },
        { title: "Specific beats general",
          body: "“I'm grateful for my family” barely registers. “Who in my family am I grateful for right now, and why?” puts you properly inside the feeling. The more specific you get, the more immersed your mind becomes." },
        { title: "Most people run on unacknowledged effort",
          body: "Plenty of people pour themselves into a team or a family and never hear that it landed — motherhood being the clearest case of all. Saying a specific thank you is how you fix that for someone in about ten seconds." },
        { title: "Small and daily beats big and rare",
          body: "Gratitude lifts you the moment you do it, but the real prize is compound. Small consistent changes multiply over time into genuine psychological transformation — the more consistently you practise, the more it gives back." },
      ],
      steps: [
        { title: "Sharing gratitude",
          body: "Tell someone. Thank your partner, friend, colleague or child for something specific they do — how they show up, what they cook, that they listen. Gratitude and oxytocin have been called the glue that binds adults into meaningful relationships, and you both get the rise." },
        { title: "Feeling grateful",
          body: "The quieter half: noticing and appreciating what's already good in your life. Pick one area, get specific about it, and stay with it for a moment rather than ticking it off." },
      ],
      prompt: {
        label: "Your daily gratitude question",
        question: "In this moment right now, what is the number one thing I feel most grateful for?",
        examples: ["“I feel really grateful to have … in my life”",
                   "“I feel really grateful for the home I live in”",
                   "“I feel really grateful that my body is healthy”",
                   "“I feel really grateful for the opportunities I have”"],
        follow: "Pick whichever is most prominent in your mind, then spend a few minutes on it: Why do I feel grateful for this? How is it impacting my life? What would it be like if this person, thing or experience wasn't here? Do that twice a day and the shift in your thinking is seismic.",
      },
      quote: "Comparison is the thief of joy.",
      list: [
        {
          title: "Two moments that work best",
          note: "Pair a new habit with something already fixed in your routine.",
          items: ["Mornings — as you make your bed, shower or brush your teeth. Best of all on a morning walk, before you've seen any social media.",
                  "Bedtime — it calms a noisy mind and reassures your brain that you're safe, and often rather better than safe."],
        },
        {
          title: "I am grateful for…",
          note: "Read through and pick three you genuinely connect with right now.",
          items: ["A specific friend or family member", "My home and living environment",
                  "My health, my ability to move, my energy", "My financial stability",
                  "The opportunities becoming possible for me", "Nature and the beautiful world we live in",
                  "What I get to eat and drink each day", "My learning and understanding"],
        },
      ],
      challenge: {
        title: "The 7-day Gratitude Challenge",
        body: "Ask yourself the daily gratitude question once every morning and once every night for the next seven days. As you go, keep gratitude towards other people at the front of your mind too — say it out loud when someone supports you.",
      },
    },
  },
  {
    id: "achievements", chem: "o", time: "evening", emoji: "🏅", title: "Achievements",
    short: "Celebrate a step you took today.",
    desc: "Notice your progress out loud. Celebrate one step you took today instead of instantly chasing the next one.",
    learn: {
      bites: [
        { title: "Two sets of parents",
          body: "Picture a child raised by parents who only name what they're getting wrong, and another whose parents name what they're getting right. One grows up unsure of themselves and what they're good at; the other believes in their own skills. Nothing differs but the style of communication. Now ask which set your inner voice sounds like." },
        { title: "Same week, two different lives",
          body: "Two people eat well Monday to Friday, then both demolish a pizza on Saturday. One decides they're terrible at this and always will be. The other notes they just ate well for five straight days. Identical behaviour — and radically different outcomes a year later." },
        { title: "Habits need noticing to survive",
          body: "To make a good habit stick, you have to build the ability to notice and regularly celebrate your progress toward it. Effort you never acknowledge quietly stops feeling worth repeating." },
        { title: "Your brain rewires with repetition",
          body: "Neuroplasticity is your brain reorganising itself through experience. Brush your teeth with the wrong hand for a month and it becomes normal; keep going three months and the original hand feels strange. Your inner voice works exactly the same way." },
        { title: "It spills outward",
          body: "The oxytocin from recognising achievements is linked to sharing positive emotions, trusting people more, cooperating better and stronger group cohesion. Celebrating yourself quietly makes you better company." },
      ],
      steps: [
        { title: "Mornings",
          body: "Pair it with your gratitude question. Straight after asking what you're most grateful for, ask yourself what you've most recently achieved. Best done on the same phone-free morning walk." },
        { title: "The end of the working day",
          body: "The second natural moment. After anything intense it's easy to spend the evening with your mind listing what you didn't finish. Name the progress you did make instead." },
      ],
      quote: "Create a new voice in your mind. One that celebrates you.",
    },
  },

  /* ── Serotonin ── */
  { id: "nature",     chem: "s", time: "midday",  emoji: "🌳", title: "Nature",
    short: "Get into green or blue space and take it in.",
    desc: "Get to some green or blue space and actually take it in — look, listen, breathe. A park bench counts." },
  { id: "sunlight",   chem: "s", time: "morning", emoji: "☀️", title: "Sunlight",
    short: "See daylight before you see a screen.",
    desc: "Get daylight in your eyes before you get social media in your brain. A few minutes outside early sets your whole day's rhythm." },
  { id: "guthealth",  chem: "s", time: "midday",  emoji: "🥗", title: "Gut Health",
    short: "Feed your gut real food today.",
    desc: "Feed your gut real food today — fruit, veg, protein, water — and go easy on the ultra-processed stuff." },
  { id: "underthink", chem: "s", time: "evening", emoji: "🌬️", title: "Underthinking",
    short: "Breathe slowly and quiet a busy mind.",
    desc: "A few minutes of slow breathing to quiet a busy mind. In slowly through the nose, out even slower." },
  { id: "deepsleep",  chem: "s", time: "evening", emoji: "😴", title: "Deep Sleep",
    short: "Protect tonight's sleep.",
    desc: "Protect tonight's sleep: a reasonable bedtime, phone out of the bedroom. Tomorrow's mood is built tonight." },

  /* ── Endorphins ── */
  { id: "exercise",   chem: "e", time: "midday",  emoji: "🏃", title: "Exercise",
    short: "Move your body in a way you enjoy.",
    desc: "Move your body in a way you could keep doing for years — walk, lift, run, swim, play. Any movement counts." },
  { id: "heat",       chem: "e", time: "evening", emoji: "🛁", title: "Heat",
    short: "Let heat melt the day's tension.",
    desc: "A hot bath, shower or sauna — let heat melt the tension of the day away from your phone." },
  { id: "music",      chem: "e", time: "morning", emoji: "🎶", title: "Music",
    short: "Play songs you love and sing along.",
    desc: "Put on songs you love and sing along. Loudly is better. Dancing is extra credit." },
  { id: "laughter",   chem: "e", time: "evening", emoji: "😂", title: "Laughter",
    short: "Find the funny side today.",
    desc: "Find the funny side today — share a laugh with someone, or watch something that genuinely cracks you up." },
  { id: "stretch",    chem: "e", time: "morning", emoji: "🧘", title: "Stretching",
    short: "Give your body the stretch it's asking for.",
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
