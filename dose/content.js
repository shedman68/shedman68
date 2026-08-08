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

  s: {
    ready: true,
    fn: ["Mood", "Energy"],
    principles: ["90–95% is created in your gut", "The happier your body, the happier your mind"],
    low: ["Anxious", "Tired"],
    high: ["Good mood", "Energetic"],
    drains: ["Unhealthy food", "Lack of sleep", "Lack of nature", "Lack of sunlight"],
    quote: "The happier your body, the happier your mind.",
    bites: [
      { title: "It isn't really a brain chemical",
        body: "Between 90 and 95% of your serotonin is produced in your gut, not your head — which sets it apart from the other three entirely. How you feed and treat your body isn't a side issue here. It's the main mechanism." },
      { title: "Mood and energy are the same dial",
        body: "These are the two functions to associate with serotonin, and watching them together makes the link obvious: when your energy is on the floor, holding a calm, positive mood is close to impossible. A surprising amount of low mood is really a tiredness problem." },
      { title: "The vagus nerve is the line between them",
        body: "Eleven of your twelve cranial nerves run upward into the brain. One runs down — through your throat, your chest, into your abdomen. It's the vagus, from the Latin for “wandering”, and it carries a constant report on your heart rate, breathing, digestion, mood and energy. “Mental health” sounds like a head thing. Your body is filing reports all day." },
      { title: "Emotion means energy in motion",
        body: "That's literally what the word means. Difficult feelings — sadness, worry, low mood — are movement, not malfunction. They've arrived for a reason and they're carrying information." },
      { title: "Your feelings are feedback",
        body: "Your body's whole aim is to keep you alive. Healthy behaviour is rewarded with a good feeling so you repeat it; unhealthy behaviour produces a bad one to get you to stop. Emotions aren't obstacles to route around — they're messages about how you're living." },
      { title: "Distraction makes it worse",
        body: "The instinct when something uncomfortable surfaces is to reach for sugar or a scroll. Those are quick-dopamine behaviours, and they don't settle the feeling — they compound it." },
      { title: "That's why we call them gut feelings",
        body: "Look closely at a difficult emotion and you'll often notice it feels like it's coming from your body rather than your head. It is." },
      { title: "What serotonin actually wants",
        body: "Your ancestors woke to bright natural light, spent their days outdoors, ate unprocessed food, drank fresh water and slept in real darkness. That's the life this chemical was built for — and a fairly precise list of what's missing from a modern day." },
    ],
  },

  e: {
    ready: true,
    fn: ["Coping with stress", "Physical health"],
    principles: ["They require hard physical exertion", "A natural brain and body de-stresser"],
    low: ["Stressed", "Angry"],
    high: ["Positive", "Relaxed"],
    drains: ["Lack of exercise", "Sedentary lifestyle", "Lack of laughter", "Chronic stress"],
    quote: "Feeling stressed? Ah — I must boost my endorphins.",
    bites: [
      { title: "Built for outrunning predators",
        body: "Your ancestors needed to keep moving through pain when something was chasing them, and endorphins are what made that possible. Nothing is hunting you now — but the stress still arrives, and the same system still clears it." },
      { title: "This one wants real exertion",
        body: "Endorphins can't be talked into existence. You have to physically push your body in some way. The “runner's high” is exactly this: a significant endorphin lift arising from what the body is being put through." },
      { title: "Your built-in de-stresser",
        body: "The simplest way to hold onto this: when you notice you're stressed, the thought shouldn't be “I need to calm down.” It should be “I need to boost my endorphins.”" },
      { title: "Exercise is only one of five",
        body: "Pushing your body doesn't have to mean the gym. Heat, music, laughter and stretching all reach the same place — which matters a great deal if injury, disability or circumstance puts exercise out of reach." },
    ],
  },
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
    short: "Keep serving others at the front of your mind.",
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
    short: "Increase the physical connection in your life.",
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
    short: "Make time to connect deeply with those you love.",
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
    short: "Immerse your mind in the joy of your experiences.",
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
    short: "Celebrate the effort and progress you're making.",
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
        { title: "It pays you twice",
          body: "Noticing progress toward your pursuit doesn't only build oxytocin — it builds dopamine as well, raising the motivation to keep striving for the thing you're actually after." },
        { title: "Self-talk works like a see-saw",
          body: "When you catch negative self-talk starting up, go back to your achievements and remind yourself what you've done recently. If the see-saw has tipped one way, something has to actively push it back." },
      ],
      steps: [
        { title: "Mornings",
          body: "Pair it with your gratitude practice: ask the gratitude question first, then the achievements one. It works while you're making the bed or brushing your teeth, but it's far better on a phone-free morning walk." },
        { title: "As you finish work",
          body: "Working lives run on never-ending task lists, and it's easy to graft all day and still hear a voice listing what you didn't get done. On your way out, take a few minutes to credit yourself for the progress you actually made." },
      ],
      prompt: {
        label: "Your daily achievements question",
        question: "In this moment right now, what is the number one achievement I feel most proud of?",
        follow: "It doesn't need to be anything huge — just something telling you your life is heading in a good direction. Then celebrate it the way a loving parent would: “Well done.” “It's great you've kept at this.” “Here's what it's done for me…” Do that consistently and you stop cataloguing where you fall short and start noticing that you're making progress. Progress breeds progress.",
      },
      quote: "Create a new voice in your mind. One that celebrates you.",
      list: {
        title: "Examples of daily achievements",
        items: ["Time spent away from your phone", "Focusing better while working",
                "Reading more", "Connecting with family and friends",
                "Doing something kind for someone", "More physical touch in your life",
                "Being more grateful each day", "Talking about your appearance more kindly",
                "Time in natural environments", "Exercising more regularly",
                "Eating and drinking better", "Keeping a more organised home"],
      },
      challenge: {
        title: "The 7-day Achievements Challenge",
        body: "Ask yourself the daily achievements question once every morning and once after work, every day for the next seven days. Keep your capacity to notice and celebrate other people's achievements at the front of your mind too.",
      },
    },
  },

  /* ── Serotonin ── */
  {
    id: "nature", chem: "s", time: "midday", emoji: "🌳", title: "Nature",
    short: "Connect with the natural world, headphone free.",
    desc: "Get to some green or blue space and actually take it in — look, listen, breathe. A park bench counts.",
    learn: {
      bites: [
        { title: "300,000 years of practice",
          body: "Your neurobiology was shaped over roughly 300,000 years of moving through the natural world. It expects close contact with nature and a great deal of daylight — and modern life has quietly relocated almost all of it indoors." },
        { title: "One of the four causes",
          body: "Lack of time in nature is named as one of the four direct causes of low serotonin, alongside poor food, poor sleep and too little sunlight. It isn't a nice-to-have on the list." },
        { title: "Trees are quietly medicating you",
          body: "Every plant emits natural chemicals called phytoncides, which protect it from bacteria and fungus. Breathe them in and your natural killer cells — a core part of your immune system — rise significantly. Coniferous trees like pine give off the most, which is why a pine wood can lift you so fast." },
        { title: "Forest bathing is an actual prescription",
          body: "Japan coined shinrin-yoku — forest bathing — after noticing what extreme hours in city environments were doing to people. Doctors began prescribing forest time for stress, anxiety, depression, anger and sleep. The participants weren't doing anything clever: they were simply paying attention with their senses." },
        { title: "You start wanting to be more natural",
          body: "Spend enough time out there and something shifts. You want to eat better, move more, sleep properly, be kinder. Your instincts already want all of that — nature just turns the volume up on them." },
        { title: "It's where the other habits live",
          body: "A phone-free walk is the natural home for your gratitude question, your achievements question and your pursuit thinking. One walk can feed three chemicals at once." },
      ],
      steps: [
        { title: "Spend time in nature alone",
          body: "Use it to properly connect with the environment around you — tune into what you're seeing, smelling and hearing. It may not feel amazing straight away. You're building a relationship, and what nature gives back grows as that relationship does." },
        { title: "Make nature part of your social life",
          body: "Go for walks with friends and family. Learning to socialise outdoors deepens your connection to the place and to each other at the same time." },
      ],
      list: {
        title: "The nature checklist",
        note: "What the forest-therapy participants actually did — immerse yourself in the present through your senses.",
        items: ["Sight — count how many different colours you can see",
                "Sound — listen closely to everything you can hear around you",
                "Smell — breathe in deeply as you walk and notice what you smell"],
      },
      challenge: {
        title: "The Nature Challenge",
        body: "Three headphone-free walks over the next week. No podcast, no music — just you and what's actually there.",
      },
    },
  },
  {
    id: "sunlight", chem: "s", time: "morning", emoji: "☀️", title: "Sunlight",
    short: "View sunlight as soon as possible after waking.",
    desc: "Get daylight in your eyes before you get social media in your brain. A few minutes outside early sets your whole day's rhythm.",
    learn: {
      bites: [
        { title: "Any daylight counts",
          body: "You don't need a forest or a clear blue sky. Any exposure to daylight, in nature or not, is genuinely beneficial for your serotonin. The bar is far lower than people assume." },
        { title: "It follows the nature problem",
          body: "Lack of sunlight is largely downstream of spending your days indoors. Fix the time-outside problem and this one mostly fixes itself." },
        { title: "It isn't only serotonin",
          body: "Bright morning light also gives you a healthy, natural rise in cortisol and dopamine. That combination is what starts a day energetic, positive and motivated — and it genuinely does not need to be sunny for you to get it." },
        { title: "Think of the sun as a wireless charger",
          body: "Face toward it in a way that feels comfortable and safe, and let it top you up for the day ahead. Never stare at it — anything causing pain or strain in your eyes is doing you no good at all." },
      ],
      list: [
        {
          title: "How long you need outside",
          items: ["Sunny: 5–10 min", "Cloudy: 10–15 min", "Overcast: up to 30 min"],
        },
        {
          title: "Making it work",
          items: ["On sunny days, leave sunglasses off for the first ten minutes — your brain needs to register the daylight unfiltered.",
                  "Waking while it's still dark? Turn on plenty of lights immediately, then get ten to fifteen minutes outside once you can."],
        },
      ],
    },
  },
  {
    id: "guthealth", chem: "s", time: "midday", emoji: "🥗", title: "Gut Health",
    short: "Swap processed food for whole food.",
    desc: "Feed your gut real food today — fruit, veg, protein, water — and go easy on the ultra-processed stuff.",
    learn: {
      bites: [
        { title: "Your gut has priorities",
          body: "Send it nutritious food and it gets straight on with making serotonin. Send it sugary, fatty, processed food and it spends its energy trying to clear that out of your body instead — and serotonin drops to the bottom of the list." },
        { title: "The spike and the dip",
          body: "Unhealthy food gives you a sugar-driven dopamine spike that genuinely feels great for a moment. Then digestion brings a dip in mood and energy, and with it the craving for another hit. That loop is a mechanism, not a character flaw." },
        { title: "Protein fills you up, carbs don't",
          body: "You could eat an enormous plate of pasta, bread or chips. Build the same plate around chicken, salmon, eggs or tofu and you'll fill up far sooner, because protein and its amino acids satiate your body far more efficiently. If portion control is your struggle, this is the lever." },
        { title: "Not all carbs behave the same",
          body: "Simple carbs — white bread, white pasta, cereal, crisps, fries — are low in fibre and heavy in starch, so your body converts them to sugar fast and you get the spike and the crash. Complex carbs from vegetables release slowly and hold your energy steady. Carbs aren't the enemy; these particular ones are the problem." },
        { title: "Coffee has a timing problem",
          body: "Waking triggers a natural rise in cortisol that starts your energy system for the day. Drink coffee inside the first thirty minutes and that rise gets disrupted — your body runs on the caffeine instead of its own system, and that's a primary cause of the afternoon crash." },
        { title: "Probiotics feed the factory",
          body: "Your gut is full of bacteria arriving through everything you eat and drink, and certain strains — lactobacillus among them — are especially good for gut health. A healthier gut makes more serotonin naturally, which shows up as better mood, energy and immunity." },
        { title: "Willpower is lowest when you're low",
          body: "Tiredness, sadness and boredom all shrink your willpower, and that's exactly when ultra-processed food is hardest to refuse. The real fix isn't resisting better in the moment — it's having less of it in the house." },
      ],
      steps: [
        { title: "Make protein the main event",
          body: "The guidance is roughly one gram of protein per pound of body weight — 150 grams a day if you weigh 150 pounds. For most people that means significantly more than they currently eat, and building the plate around it rather than around pasta." },
        { title: "Let vegetables be your carbs",
          body: "Courgette, aubergine, carrots, broccoli, peppers — high in fibre, absorbed slowly, and carrying a huge range of vitamins and minerals that nourish your gut. Legumes (lentils, peas, beans) do the same job." },
        { title: "Push your coffee back",
          body: "Wait at least ninety minutes after waking, ideally closer to two hours, and let your own cortisol rise do its job first. A good pairing: coffee, then straight into a demanding focus session — caffeine lifts dopamine as well." },
        { title: "Try the 80:20 rule",
          body: "Eighty per cent nutritious food, twenty per cent treats. Eating well all the time would be ideal, but sustainable beats perfect — especially at the start of a change." },
        { title: "Experiment with intermittent fasting",
          body: "Shortening your eating window — pushing your first meal to 11am or noon turns a twelve-hour window into eight or nine — is associated with steadier energy, better concentration and weight that's easier to maintain. Keep drinking water throughout. Entirely optional: if it doesn't appeal, or it doesn't feel good when you try it, leave it." },
      ],
      groups: {
        title: "Where to get protein",
        sets: [
          { name: "Meat", items: ["Chicken", "Grass-fed beef", "Turkey"] },
          { name: "Fish", items: ["Salmon", "Trout", "Cod"] },
          { name: "Dairy", items: ["Yoghurt"] },
          { name: "Plants", items: ["Tofu", "Seitan", "Beans and legumes"] },
        ],
      },
      caution: "Probiotics are not a substitute for medication. If you're taking something for your mental health and it's working, that's great — follow your GP's or psychiatrist's guidance. Probiotics may offer additional support alongside it.",
      challenge: [
        {
          title: "The protein challenge",
          body: "For the next week, eat meals with far more protein in them — make it the primary thing on your plate rather than the carbohydrate. Pair it with vegetables as your carb source.",
        },
        {
          title: "The trolley challenge",
          body: "Next time you're at the supermarket, use a bag to split your trolley in two. Keep the eighty per cent nearest you full of nutritious food, and allow yourself a handful of treats in the final twenty. You'll come home with far more good food than bad — and that's what you'll reach for later.",
        },
      ],
    },
  },
  {
    id: "underthink", chem: "s", time: "evening", emoji: "🌬️", title: "Underthinking",
    short: "Calm your body to calm your thinking.",
    desc: "Resonance breathing — six slow breaths a minute — to settle your nervous system and quieten an overactive mind.",
    learn: {
      bites: [
        { title: "Six breaths a minute",
          body: "That's what resonance breathing means: slowing right down to six full breaths per minute. It calms your nervous system, raises your vagal tone and lifts your mood — all from something you're doing anyway." },
        { title: "The exhale does the work",
          body: "Longer out than in is the entire mechanism. Extending the out-breath is what tells your body the emergency is over." },
        { title: "Train it before you need it",
          body: "This works in an acute moment of worry, but it works far better if you've practised. Treat it like a muscle in the gym — a few minutes each morning and you'll settle yourself far more efficiently when the overthinking actually arrives." },
        { title: "Children already know this one",
          body: "Watch a child settle after being upset and you'll see it: a double breath in, then a long breath out. That's the physiological sigh, and nobody taught it to them — the body reaches for it to calm its own nervous system." },
        { title: "Listening beats overriding",
          body: "The aim isn't to argue your feelings away. It's to get quiet enough to hear what they're telling you about how you're living — and then to move your behaviour toward it." },
      ],
      steps: [
        { title: "Three breaths, then close your eyes",
          body: "Sit down and take three full inhales and exhales. Close your eyes on the third exhale, then take three more." },
        { title: "Choose your breathing",
          body: "Resonance breathing or sigh breathing — whichever of the two genuinely calms you more. Breathe that way for two to three minutes." },
        { title: "Scan your body head to toe",
          body: "Start at your head: any sensations in your eyes, nose or mouth? Then your throat, shoulders, chest and stomach. Then your thighs, and down to your feet. You're learning to feel your body, not fix it." },
        { title: "Open your eyes",
          body: "The whole practice takes under five minutes, and your brain comes out of it calmer, clearer and more focused. Done each morning, it compounds." },
      ],
      quote: "Becoming an underthinker is possible, starting from today.",
      list: [
        {
          title: "Two breathing patterns",
          items: ["Resonance breathing — in through the nose for four seconds, out through the mouth for six. Ten-second cycles, six breaths a minute.",
                  "Sigh breathing — a deep breath in through the nose, then a short sharp top-up breath in, then a long sigh out through the mouth. Double inhale, big exhale."],
        },
        {
          title: "When you're already overthinking",
          items: ["Breathe first — calm the body before you try to sort out the thought.",
                  "Vocalise it — call, voice-note or meet someone you trust and describe what's happening. Explaining it is what processes and rationalises it. Journalling does the same job on paper.",
                  "Turn to gratitude — overthinking pulls your brain toward fear. Gratitude reminds it what's actually fine, and that's the reassurance it needs to settle."],
        },
      ],
      challenge: [
        {
          title: "Ten sigh breaths, now",
          body: "Sit comfortably, close your eyes and take a few normal breaths. Then perform ten sigh breaths — double inhale, then a long exhale. The bigger and louder the exhale, the better.",
        },
        {
          title: "The morning calming practice",
          body: "Run the full practice each morning for the next week. Find a calming spot at home, or a good bench on a walk, and treat it like training a muscle.",
        },
      ],
    },
  },
  {
    id: "deepsleep", chem: "s", time: "evening", emoji: "😴", title: "Deep Sleep",
    short: "Optimise your sleep to optimise your wellbeing.",
    desc: "Protect tonight's sleep: a reasonable bedtime, phone out of the bedroom. Tomorrow's mood is built tonight.",
    learn: {
      bites: [
        { title: "Technology is the modern sleep thief",
          body: "Demanding work plus a real attachment to our phones: late nights scrolling, checking in the small hours, reaching for it the second we wake. Each of those creates genuine problems for your neurobiology." },
        { title: "Anxious and tired travel together",
          body: "The two signs of low serotonin are anxiousness and tiredness — and sleep sits underneath both. It's rarely the most exciting action on the list, and it's often the one doing the most work." },
        { title: "Tonight's sleep starts this morning",
          body: "The moment daylight hits your eyes, the waking half of your body clock starts running. The faster your energy system starts in the morning, the faster it settles in the evening — so aim to see daylight within thirty minutes of waking, for at least ten minutes." },
        { title: "Your body has to earn sleep",
          body: "If your day runs bed to car to desk to sofa without ever physically pushing your body, it never comes to require deep sleep — so it doesn't ask for it. Daily movement isn't a bonus here, it's the prerequisite." },
        { title: "You don't have to do all of it",
          body: "There's a long list of things that improve sleep and all of them are worth something. Pick two or three that feel manageable in your life right now rather than attempting an overhaul." },
      ],
      list: [
        {
          title: "Six areas that shape your sleep",
          items: ["Morning sunlight", "Daily movement", "Your environment",
                  "Night-time tech", "Your diet", "Calming your mind"],
        },
        {
          title: "Calming a busy mind at night",
          items: ["A consistent bedtime — your brain learns the pattern and starts preparing itself",
                  "Gratitude as you lie there, especially on the nights that feel worried",
                  "Resonance breathing afterwards, and again if you wake in the night",
                  "Writing — keep pen and paper by the bed and get the thoughts out of your head",
                  "Listening — on nights you truly can't sleep, stop fighting it and put on sleep music or a calm podcast"],
        },
      ],
      challenge: {
        title: "Chase the light",
        body: "For the next week, get outside for at least ten minutes within thirty minutes of waking. In winter, a sunrise alarm clock does a similar job — it wakes you with light over half an hour instead of noise.",
      },
    },
  },

  /* ── Endorphins ── */
  {
    id: "exercise", chem: "e", time: "midday", emoji: "🏃", title: "Exercise",
    short: "Find your favourite way to get moving.",
    desc: "Move your body in a way you could keep doing for years — walk, lift, run, swim, play. Any movement counts.",
    learn: {
      bites: [
        { title: "Two different jobs",
          body: "Strength and endurance aren't the same training. Strength is lifting, bodyweight work, resistance bands. Endurance is walking, running, cycling, swimming, classes, martial arts, sport. A good week has some of each." },
        { title: "Pick what you'd still be doing in ten years",
          body: "The best exercise isn't the most efficient one — it's the one you'll keep choosing. Enjoyment is the variable that decides whether any of this survives contact with a busy month." },
      ],
      groups: {
        title: "Choose your methods",
        note: "Pick one way to strengthen your body and one way to train your endurance.",
        sets: [
          { name: "Strengthening", items: ["Lifting weights", "Bodyweight training", "Resistance bands"] },
          { name: "Endurance", items: ["Walking", "Running", "Cycling", "Swimming",
              "Gym classes", "Martial arts", "Sport"] },
          { name: "Staying motivated", items: ["Competitions", "Smart decisions"] },
        ],
      },
      challenge: {
        title: "The Exercise Challenge",
        body: "Two strength-training sessions and two endurance sessions over the next week. Four in total — that's the whole ask.",
      },
    },
  },
  {
    id: "heat", chem: "e", time: "evening", emoji: "🛁", title: "Heat",
    short: "Immerse yourself in saunas or hot baths.",
    desc: "A hot bath or a sauna — a simple daily practice of immersing yourself in a hot environment, away from your phone.",
    learn: {
      bites: [
        { title: "Exertion without the exercise",
          body: "Heat puts your body under real physical stress, which is why it reaches endorphins the same way a hard session does. It's one of the routes that stays open when exercise isn't available to you." },
        { title: "Leave the phone outside",
          body: "The point isn't only the heat — it's twenty minutes where nothing can reach you. Bringing your phone in undoes most of what you came for." },
      ],
    },
  },
  {
    id: "music", chem: "e", time: "morning", emoji: "🎶", title: "Music",
    short: "Sing and dance daily, especially mornings.",
    desc: "Put on songs you love and sing along. Dancing counts double. Mornings are the best time for it.",
    learn: {
      bites: [
        { title: "Singing and dancing, not just listening",
          body: "Listening is pleasant. Singing along and moving is what actually shifts you — it's physical exertion wearing a disguise, which is exactly what endorphins want." },
        { title: "Learn the words",
          body: "Knowing the lyrics to the songs you love is a small, silly investment that pays out every single time one comes on. It's the difference between hearing a song and being inside it." },
      ],
    },
  },
  {
    id: "laughter", chem: "e", time: "evening", emoji: "😂", title: "Laughter",
    short: "Spend time where laughter happens.",
    desc: "Put yourself in the rooms where laughter happens — with people who make you laugh, or something that genuinely cracks you up.",
    learn: {
      bites: [
        { title: "Design the environment, not the mood",
          body: "You can't decide to find things funny. What you can do is get yourself into the places and the company where laughter happens regularly — that's the actual lever." },
        { title: "It's total presence",
          body: "When something is so funny that every worry drops away for a moment, you're as present as you ever get. That's not a side effect of the laugh — it's most of the value." },
        { title: "Less doom, more daft",
          body: "Complaining and rehearsing the news puts you in the opposite environment. Not denial — just noticing that a steady diet of gloom makes the funny side harder to find." },
      ],
    },
  },
  {
    id: "stretch", chem: "e", time: "morning", emoji: "🧘", title: "Stretching",
    short: "A short, consistent routine that mobilises you.",
    desc: "Three movements, three times through. It takes a minute or two and it's unbelievably effective.",
    learn: {
      bites: [
        { title: "Blood to the brain",
          body: "Reaching tall and folding down sends a rush of blood into your head, and endorphins along with it. You feel it immediately — which is rare for something this small." },
        { title: "Mobility is use-it-or-lose-it",
          body: "Run this routine three times a day and your range of movement starts to come back. Not over months — you'll notice within a week or two." },
      ],
      stepsTitle: "Building up to a hang",
      steps: [
        { title: "Hands on, feet down",
          body: "Place your hands on the bar and keep your feet on the floor. Slightly slacken your legs and just feel what it's like to hold yourself up." },
        { title: "One foot, then the other",
          body: "As confidence builds, lift one foot off the floor. Then the other. Be careful — there's no prize for rushing this." },
        { title: "Three seconds, then five, then ten",
          body: "Build gradually toward thirty seconds. Done daily, this decompresses your spine, lengthens your body and keeps it mobile — endorphins now, and a different quality of life in twenty years." },
      ],
      movements: [{
        title: "The routine",
        note: "Three movements. Go through the whole thing three times.",
        items: [
          { figure: "reachup", name: "Reach-ups",
            body: "Standing tall, reach your hands as high as you can and try to touch the ceiling." },
          { figure: "reachdown", name: "Reach-downs",
            body: "Lean forward and reach down toward your toes. Stretch as far as you comfortably can, until you feel it in the back of your legs. Don't hurt yourself." },
          { figure: "twist", name: "Twists",
            body: "Raise your arms in front of you, palms facing down. Twist your arms around your body, first to the left, then to the right. You may hear a few cracks in your back." },
        ],
        cadence: [
          { label: "So…", lines: ["Reach tall, reach down to your toes",
                                  "Reach tall, reach down to your toes",
                                  "Reach tall, reach down to your toes"] },
          { label: "Now…", lines: ["Hands up in front of you",
                                   "Twist left, twist right",
                                   "Twist left, twist right",
                                   "Twist left, twist right"] },
        ],
      }, {
        title: "Bar hanging",
        note: "Every time you pass a pull-up bar or monkey bars, hang from it.",
        items: [
          { figure: "hang", name: "The hang",
            body: "Picture a seventy-five-year-old hanging from a bar in the park. You'd be astounded — and that's the point. Simply hanging decompresses your spine and keeps your body mobile and strong." },
        ],
      }],
      challenge: {
        title: "Three times a day",
        body: "Run the routine three times a day for a week. It costs you a couple of minutes and your mobility will start to shift.",
      },
    },
  },
];

/* ─── Reflection questions ───
   The book's own way of helping you decide which action to take
   forward. Shown at the foot of each action sheet, next to the
   button that makes it your daily pick.                       */

const REFLECT = {
  flow: "Does training your capacity to enter deep focus each day excite you? Can you learn to push past those first fifteen minutes of discomfort in order to reach a state of relaxed accomplishment?",
  discipline: "Does discipline need to be your focus right now — building your dopamine by living in a more careful, diligent way? Can you become disciplined at waking up and making your bed, and keeping your home clutter-free?",
  phonefast: "Are you addicted to your phone? Be honest. Can you commit to ignoring it when you first wake up, and to an hour away from it each evening?",
  coldwater: "Do you need to develop your tenacity, your willpower, your ability to embrace discomfort? Do you want to feel strong and empowered when facing a challenge?",
  pursuit: "Do you need a clear goal — one meaningful enough that you'd willingly give up moments of indulgence to reach it? Can you spend a short period each day outdoors, phone-free, dreaming and planning?",

  contribution: "Do you feel you're adequately focused on supporting the people around you? Are you satisfied with the contribution you're making? Sometimes it's a big thing; often it's simply calling someone and listening.",
  touch: "Does physically connecting with people and animals bring you peace? Has the amount of physical connection in your life quietly reduced? Can you hug your friends and family more?",
  social: "Do you feel happy and energised when you're with people? Can you see friends and family more often — coffee, walks, dinners, exercise? Can you ask yourself daily: have I done something fun with somebody else today?",
  gratitude: "Do you want an underlying feeling of happiness each day? We live in a world of more — more money, better holidays, more followers — and desire for what you don't have is a life of dissatisfaction. Can you take a moment daily to ask what you're most grateful for?",
  achievements: "Do you want to genuinely believe in yourself — to believe you can achieve what you set your mind to? Can you take a moment each day to celebrate some small progress you've made?",

  nature: "Have you begun to feel the power of the natural world? Can you spend a short period out there each day — a park, a forest, a beach, a river — and disconnect from technology long enough to listen, look, smell and touch what's around you?",
  sunlight: "Does sunlight change how you feel? Have you tried seeing daylight before social media each morning? It can be in nature, but it doesn't have to be — a moment outside a coffee shop counts.",
  guthealth: "Does the answer lie in what you eat and drink? Does a life fuelled by natural, nutritious food appeal — energy crashes gone, a calm and consistent mood in their place? Can you swap ultra-processed for whole foods, raise your protein, and stay properly hydrated?",
  underthink: "Does your mind feel busy? Do you overthink and worry regularly? Can you start a simple, slow breathing practice for a few minutes a day — one that not only helps you navigate the hard moments, but eventually stops them arriving so often?",
  deepsleep: "Does a proper night's sleep change how you feel the next day? Can you make sleep a greater priority — and are you willing to trade late nights for earlier, happier mornings?",

  exercise: "Do you want to feel fitter? Stronger? If you ask yourself right now — do I need to move more? — what does your body answer? Your goal here is sustainability, not a big regime you abandon in two weeks.",
  heat: "Does heat make you feel calm? Have you sat in a bath or a sauna and come out genuinely calmer? Could a simple daily practice of hot immersion, away from your phone, be your method?",
  music: "How does music make you feel — and more specifically, how do singing and dancing make you feel? Euphoric? Present? Happy? Can you dance more often, and learn the words to the songs you love?",
  laughter: "Do you laugh enough? Are there moments where something is so funny that every worry slips away and you're completely present? Can you get into those rooms more often — and complain less, and give the doom and gloom of the news a rest?",
  stretch: "Does your body feel like it needs stretching? Ask it right now: would you like me to stretch you more? Can you do your reach-ups, reach-downs and twists each morning, and hang from a bar more often?",
};

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
