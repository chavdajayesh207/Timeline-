export interface SavedHighlight {
  id: string;
  bookName: string;
  author: string;
  text: string;
  colorTag: "Facts" | "Quotes" | "Insights" | "Debates";
  note?: string;
  createdAt: string;
}

export const WISDOM_QUOTES = {
  Motivation: [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
    { text: "Your action is your true companion on the long journey of time.", author: "RigVeda" }
  ],
  Philosophy: [
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "It is the mark of an educated mind to entertain a thought without accepting it.", author: "Aristotle" },
    { text: "The universe is change; our life is what our thoughts make it.", author: "Marcus Aurelius" }
  ],
  Krishna: [
    { text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.", author: "Lord Krishna" },
    { text: "The mind is restless and difficult to control, but it can be conquered by constant practice and detachment.", author: "Lord Krishna" },
    { text: "Delusion arises from anger, and mind loss of reason from delusion.", author: "Lord Krishna" }
  ],
  Buddha: [
    { text: "Peace comes from within. Do not seek it without.", author: "Gautama Buddha" },
    { text: "The root of suffering is attachment.", author: "Gautama Buddha" },
    { text: "Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened.", author: "Gautama Buddha" }
  ],
  Mahavira: [
    { text: "Do not injure, abuse, oppress, enslave, insult, torment, torture, or kill any creature or living being.", author: "Lord Mahavira" },
    { text: "Fight with yourself, why fight with external foes? He who conquers himself through himself will obtain happiness.", author: "Lord Mahavira" },
    { text: "A render of truth acknowledges that perspective is multi-faceted and endless.", author: "Lord Mahavira" }
  ],
  Osho: [
    { text: "Be — don't try to become.", author: "Osho" },
    { text: "Courage is a love affair with the unknown.", author: "Osho" },
    { text: "Experience life in all possible ways — good-bad, bitter-sweet, dark-light.", author: "Osho" }
  ],
  Stoicism: [
    { text: "People are disturbed not by things, but by the views they take of things.", author: "Epictetus" },
    { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
    { text: "We suffer more often in imagination than in reality.", author: "Seneca" }
  ],
  Success: [
    { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
    { text: "Once you start working on something, don't be afraid of failure and don't abandon it.", author: "Chanakya" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
  ]
};

export const REFLECTIONS = {
  Stoicism: {
    title: "The Discipline of Assent",
    author: "Epictetus / Marcus Aurelius",
    text: "Stoicism teaches us that while we cannot control external events, we have total sovereignty over our internal judgments. To practice the discipline of assent is to pause before reacting, examining our impressions as if they were coins—checking their weight and authenticity before letting them into our vault. When a negative thought arises, tell it: 'You are just an impression, not the reality itself.'",
    tagline: "Pause, analyze, decide with absolute composure."
  },
  Buddhism: {
    title: "The Philosophy of Impermanence (Anicca)",
    author: "Gautama Buddha",
    text: "Everything that has the nature of arising also has the nature of ceasing. When you observe your mind, note how thoughts, physical sensations, and outer sounds float into existence and float away like river leaves. Greed and anger arise only when we try to freeze these flowing waters. By accepting the fluid impermanence of the moment, deep, immovable peace is realized.",
    tagline: "Cling to nothing, flow with everything."
  },
  Vedanta: {
    title: "Atman as the Universal Witness",
    author: "Adi Shankaracharya",
    text: "You are not the mind; you are not the tired physical vessel. Vedanta guides us to realize that we are the pristine, eternal Witness (Sakshi) behind every passing cloud of thought. Just as a movie screen remains undamaged by the dramatic fire or raging storms projected upon it, your absolute awareness is forever untouched, clean, and complete.",
    tagline: "Thou art the boundless light behind the shadows."
  },
  "Self Improvement": {
    title: "The Power of Atomic Sincerity",
    author: "James Clear & Patanjali",
    text: "A grand habit is not constructed through massive, stressful efforts. It is constructed through quiet daily sincerity. Reading just 10 pages a day mounts to 12 entire wisdom volumes in a single year. Aligning your environment to quiet digital noises, adopting a daily streak, and committing to micro-steps yields unmatched intellectual compound interest over a lifetime.",
    tagline: "Quiet discipline beats sudden motivational surges."
  }
};

export const INITIAL_HIGHLIGHTS: SavedHighlight[] = [
  {
    id: "h1",
    bookName: "Meditations",
    author: "Marcus Aurelius",
    text: "The universe is change; our life is what our thoughts make it.",
    colorTag: "Quotes",
    note: "Absolutely foundational. Reminds me that psychological narrative shapes all external circumstances.",
    createdAt: "2026-06-09T12:00:00Z"
  },
  {
    id: "h2",
    bookName: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    text: "A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.",
    colorTag: "Facts",
    note: "Explains how echo chambers function. The illusion of truth effect.",
    createdAt: "2026-06-09T14:30:00Z"
  },
  {
    id: "h3",
    bookName: "Atomic Habits",
    author: "James Clear",
    text: "Every action you take is a vote for the type of person you wish to become.",
    colorTag: "Insights",
    note: "Focus on identity-based habits rather than target outcomes. This is beautiful.",
    createdAt: "2026-06-09T16:15:00Z"
  }
];

export const AMBIENT_TRACKS = [
  { id: "om", name: "Deep Cosmic Om ॐ", artist: "Mantra Resonance", src: "om" },
  { id: "flute", name: "Vedic Flute Meditation", artist: "Classical Bamboo Wood", src: "flute" },
  { id: "rain", name: "Cozy Night Library Rain", artist: "Nature Acoustics", src: "rain" },
  { id: "bowls", name: "Tibetan Singing Bowls", artist: "Zen Monastery", src: "bowls" }
];
