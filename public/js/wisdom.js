(function () {
  'use strict';

  // Rich repository of curated hourly quotes, translations, and reflections
  const DEFAULT_WISDOM_QUOTES = {
    stoicism: [
      {
        text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
        author: "Marcus Aurelius",
        source: "Meditations, Book IV",
        title: "The Citadel of the Mind",
        reflection: "Stoicism teaches us that while we cannot control external events, we have total sovereignty over our internal judgments. To practice this is to construct an inner citadel, pauses before reacting, examining our impressions check their accuracy before letting them define our mood.",
        tags: ["STOICISM", "SOVEREIGNTY", "MIND-POWER"]
      },
      {
        text: "We suffer more often in imagination than in reality.",
        author: "Seneca the Younger",
        source: "Letters from a Stoic",
        title: "Anxiety & Projected Suffering",
        reflection: "Our thoughts and worries often amplify problems before they even arrive. By staying firmly grounded in the active present moment, we deny our imagination the power to torment us with phantom fears.",
        tags: ["STOICISM", "IMAGINATION", "ANXIETY"]
      },
      {
        text: "The happiness of your life depends upon the quality of your thoughts.",
        author: "Marcus Aurelius",
        source: "Meditations, Book VII",
        title: "The Architecture of Thought",
        reflection: "The mind becomes dyed with the colors of its thoughts. If we harbor criticism and resentment, our world feels hostile. If we cultivate appreciation, our daily reality shifts into harmony.",
        tags: ["STOICISM", "HEALTH", "PERSPECTIVE"]
      },
      {
        text: "Difficulties strengthen the mind, as labor does the body.",
        author: "Seneca the Younger",
        source: "On Providence",
        title: "The Gym of Adversity",
        reflection: "We must welcome friction as a training partner. Every obstacle, inconvenience, or difficult interaction is a weights-set designed to grow our patience and resilience.",
        tags: ["STOICISM", "RESILIENCE", "GROWTH"]
      }
    ],
    osho: [
      {
        text: "Silence is the space in which situations occur.",
        author: "Osho",
        source: "The Path of Meditation",
        title: "The Art of Doing Nothing",
        reflection: "We are obsessed with constant movement, thinking progress is only achieved through action. But there is a sacred dimension to absolute passivity, wherein answers reveal themselves without effort.",
        tags: ["OSHO", "SILENCE", "PRESENCE"]
      },
      {
        text: "Be realistic: Plan for a miracle.",
        author: "Osho",
        source: "The Book of Wisdom",
        title: "Radical Trust",
        reflection: "Living completely in the head shrinks life down to logical formulas. By letting go of absolute control, we open our doors to cosmic timing and marvelous syncs.",
        tags: ["OSHO", "TRUST", "SURRENDER"]
      },
      {
        text: "Truth is not something to be found, it is something to be lived.",
        author: "Osho",
        source: "No Water, No Moon",
        title: "Direct Realization",
        reflection: "Intellectual debates are merely maps of the absolute. Sages teach us that reading libraries only serves a purpose when we leap into immediate direct experience and live our truths.",
        tags: ["OSHO", "TRUTH", "EXPERIENCE"]
      }
    ],
    buddhism: [
      {
        text: "The mind is everything. What you think you become.",
        author: "The Buddha",
        source: "Dhammapada, Verse 1",
        title: "The Origin of Self",
        reflection: "Every habit, behavior, and structural path of our lives starts with a single initial thought. By carefully guarding our mental gateways, we shape our path toward absolute peace and stability.",
        tags: ["BUDDHISM", "DHAMMAPADA", "CONSCIOUSNESS"]
      },
      {
        text: "Peace comes from within. Do not seek it without.",
        author: "The Buddha",
        source: "Sutta Nipata",
        title: "The Secret of True Peace",
        reflection: "We search for peace in validation, status, quiet settings, or material security, yet these are vulnerable to change. Real peace is the still center of the flame, found only by turning inward.",
        tags: ["BUDDHISM", "INWARD", "TRANQUILITY"]
      },
      {
        text: "Even as a solid rock is unshaken by the wind, so are the wise unshaken by praise or blame.",
        author: "The Buddha",
        source: "Dhammapada, Verse 81",
        title: "Unshakable Equanimity",
        reflection: "Relying on praise makes us fragile; fearing blame makes us cowards. True mastery is standing firm in our character, allowing praise and blame to slide off us like rainwater on glass.",
        tags: ["BUDDHISM", "EQUANIMITY", "MASTERY"]
      }
    ],
    krishna: [
      {
        text: "यो यच्छ्रद्धः स एव सः • As a person's faith is, so they are.",
        author: "Sri Krishna",
        source: "Bhagavad Gita, 17.3",
        title: "The Mirror of Deep Faith",
        reflection: "Your fundamental beliefs act as a powerful lens filtering all experiences. Your deepest faith is not what you intellectualize, but the active expectations that direct your decisions.",
        tags: ["VEDANTA", "FAITH", "GITA"]
      },
      {
        text: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions.",
        author: "Sri Krishna",
        source: "Bhagavad Gita, 2.47",
        title: "Karma Yoga Principle",
        reflection: "Anxiety is born when we obsess over future success, approval, or consequences. Perform your duties with absolute focal care, then release all outcomes to the cosmos.",
        tags: ["VEDANTA", "KARMA", "GITA"]
      },
      {
        text: "The quiet mind is the mirror in which absolute reality is reflected.",
        author: "Adi Shankaracharya",
        source: "Vivekachudamani",
        title: "Stillness & Silent Reflection",
        reflection: "Just as a turbid, flowing pond cannot project raw blue skies, an agitated mind cannot reveal the core self. Silence the internal dialogue, and your divine nature shines clearly.",
        tags: ["VEDANTA", "SHANKARA", "REFLECTION"]
      }
    ],
    meditation: [
      {
        text: "Quiet the mind and the soul will speak.",
        author: "Zen Proverb",
        source: "Ancient Teachings",
        title: "Inward Whisper",
        reflection: "In the turbulence of outer notifications, the faint voice of core intuition is drowned out. Sit in complete silence, watch your breathing, and let your internal wisdom guide your steps.",
        tags: ["MEDITATION", "ZEN", "SILENCE"]
      },
      {
        text: "Yoga is the cessation of the movements of the mind.",
        author: "Patanjali",
        source: "Yoga Sutras, 1.2",
        title: "The Core Axis of Yoga",
        reflection: "True yoga is not physical flexibility, but mental stillness. When the endless ripples of thoughts (vrittis) dissolve, the observer rests in its own pristine primordial nature.",
        tags: ["MEDITATION", "YOGA", "PATANJALI"]
      }
    ],
    psychology: [
      {
        text: "The privilege of a lifetime is to become who you truly are.",
        author: "Carl Jung",
        source: "The Undiscovered Self",
        title: "The Journey of Individuation",
        reflection: "We spend decades wearing masks to conform to parental, professional, and societal templates. True psychological strength is peeling away these personas to honor our authentic shadow and light.",
        tags: ["PSYCHOLOGY", "JUNG", "IDENTITY"]
      },
      {
        text: "When we are no longer able to change a situation, we are challenged to change ourselves.",
        author: "Viktor Frankl",
        source: "Man's Search for Meaning",
        title: "Radical Resilience",
        reflection: "Suffering is inevitable, but how we frame that suffering is the ultimate human freedom. Deep purpose survives any outer catastrophe.",
        tags: ["PSYCHOLOGY", "MEANING", "RESILIENCE"]
      }
    ],
    leadership: [
      {
        text: "An emperor must conquer first his own mind before he rules over legions.",
        author: "Marcus Aurelius",
        source: "Meditations, Book IX",
        title: "Sovereign Statecraft",
        reflection: "True power is not forcing others to obey through fear, but managing complete victory over our own lusts, temper, and impulses. Self-control is the sovereign standard of leading.",
        tags: ["LEADERSHIP", "SOVEREIGN", "STATECRAFT"]
      },
      {
        text: "He is most powerful who has power over himself.",
        author: "Seneca the Younger",
        source: "Letters to Lucilius",
        title: "The Ultimate Command",
        reflection: "Do not gaze at global status with desire. The luxury of masterfully navigating your own actions, speech, and attention is a crown that no external king can seize or challenge.",
        tags: ["LEADERSHIP", "DISCIPLINE", "POWER"]
      }
    ]
  };

  // State variables
  let WISDOM_QUOTES = JSON.parse(JSON.stringify(DEFAULT_WISDOM_QUOTES));
  let currentCategory = 'stoicism';
  let manualOffset = 0;
  let speakRate = 1.0; // TTS speed speed
  let currentSpeech = null;

  // Premium background photos corresponding to architectural themes of wisdom branches
  const CATEGORY_BG_IMAGES = {
    stoicism: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop', // Ancient Rome Column Arches
    osho: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop', // Zen Garden Shrines
    buddhism: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop', // Peaceful Meditation Statue
    krishna: 'https://images.unsplash.com/photo-1617653202545-930d963965d8?q=80&w=1200&auto=format&fit=crop', // Sacred Indian dawn temple
    meditation: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop', // Sunlight forest mist
    psychology: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop', // Modern architecture lines
    leadership: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop'  // Mountain summit overlook
  };

  // Beautiful header portraits shown above daily reflections
  const REFLECTION_HEADER_IMAGES = {
    stoicism: 'https://images.unsplash.com/photo-1607582013243-7f1c1fce98cf?q=80&w=800&auto=format&fit=crop',
    osho: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=800&auto=format&fit=crop',
    buddhism: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=800&auto=format&fit=crop',
    krishna: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop',
    meditation: 'https://images.unsplash.com/photo-1470019693664-1d202d2c0907?q=80&w=800&auto=format&fit=crop',
    psychology: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    leadership: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  };

  // Static timeline historical datasets (VedPuran library events)
  const TIMELINE_DATA = {
    "3000 BCE": {
      title: "The Rig Vedic Hymns",
      desc: "The oldest layer of Sanskrit literature and foundational cornerstone of Vedanta. These ancient liturgical hymns were memorized and transmitted orally over thousands of years through precise acoustic accents, capturing humanity's earliest cosmic meditations on reality (Rta) and conscious inquiry."
    },
    "1500 BCE": {
      title: "The Upanishads & Forest Sages",
      desc: "Sacred mystical texts marking the peak level of Vedic philosophy. Breaking away from mere physical ritualism, Upanishadic dialogue explores the absolute unity of the inner observer (Atman) with the ultimate cosmic canvas (Brahman). Written in rich books like Brihadaranyaka."
    },
    "500 BCE": {
      title: "Gautama Buddha Shakyamuni",
      desc: "Siddhartha Gautama achieves absolute awakening under the Bodhi tree. Rejecting both ascetic torment and elite self-indulgence, the Buddha reveals the Middle Way, formulating the Four Noble Truths and the analysis of craving as the root of all existential friction (Dukkha)."
    },
    "400 BCE": {
      title: "Socrates & Ethical Dialectic",
      desc: "In Athens, Socrates challenges public opinions by cross-examining assumptions. Treating the 'examined life' as the primary standard of self-care, his dialectic methodology lays the foundation for all Western intellectual philosophy and rational therapy."
    },
    "300 BCE": {
      title: "Zeno of Citium Found Stoicism",
      desc: "After surviving a tragic shipwreck, Zeno of Citium walks into Athens and begins teaching at the painted porch (Stoa Poikile). Stoicism is born—offering a highly practical virtue manual centered on the Dichotomy of Control."
    },
    "170 CE": {
      title: "Marcus Aurelius Meditations",
      desc: "The Emperor of Rome writes raw private diaries at military camps along German fronts. Meant entirely for self-examination, these notes combine the peak emotional discipline of Epictetus, formulating the Stoic concept of the 'Inner Citadel'."
    },
    "800 CE": {
      title: "Adi Shankaracharya's Advaita",
      desc: "A young genius travels across India reviving non-dual (Advaita) Vedanta. He establishes essential monasteries, authoring critical commentaries declaring that dualistic division is an illusion (Maya) hiding our shared divine source."
    },
    "1970 CE": {
      title: "Osho Zen Presence Wave",
      desc: "Contemporary sage Osho bridges the gaps between analytical psychotherapy and silent Eastern mindfulness. Presenting a radical pathless exploration, he teaches ecstatic dynamic meditations and silent conscious witnessing of ordinary life."
    },
    "2026 CE": {
      title: "Personal Digital Second Brain",
      desc: "The modern era merges cloud technology with ancient libraries. Wisdom users sync highlights, notes, and personal Stoicism cards, establishing a persistent, living garden of wisdom accessible across any tablet, terminal, or phone."
    }
  };

  // AI Assistant Questions Answers library (provides beautiful deep philosophical simulation)
  const AI_SAGE_REPLIES = {
    explain: [
      "This quote is a beautiful invitation to inspect the gap between trigger and response. Sages across time tell us that external events possess no value in themselves; it is our emotional labels and cognitive assent that generate despair. To master this is to construct an inner fortress.",
      "The passage advises us to double down on our immediate actions. Despair and worry look ahead to future outcomes, which are outside of our control. Focus single-mindedly on this current moment, making it an honest work of art.",
      "This insight mirrors the Vedanta truth: you are not your passing storm of thoughts, you are the sky in which they drift. Identifying as the untouched observer instantly dissolves anxiety and frees your attention."
    ],
    practical: [
      "1. Next time you receive a critical message or harsh remark, wait exactly 10 seconds. Do not reply. Breathe fully.\n2. Ask yourself: 'Is this detail inside my absolute sphere of ownership?' If not, discard its emotional weight immediately.\n3. Turn the obstacle into friction training to cement your patience.",
      "Apply the 'Micro-Virtue Standard' to your daily chore. Wash your cup as if it's the most critical temple ceremony. How you manage small, daily actions is how you manage global milestones."
    ],
    compare: [
      "While a Stoic constructs an active fortress of rational control (the Inner Citadel), the Buddha urges us to dissolve the very concept of a separate self (Anatta) to melt craving. Both converge at the same peak: absolute composure unshaken by external praise or blame.",
      "Lord Krishna in the Gita teaches 'Nishkama Karma'—acting perfectly without grasping at outcomes. The Stoics mirror this perfectly: they control their effort (actions) but yield all results (fruits of action) with graceful acceptance (Amor Fati)."
    ],
    general: [
      "That is a profound query! The ancient lineages teach us that self-examination is not a dry academic research, but an active rescue mission for the soul. Maintain your daily streaks and document observations in your second brain.",
      "True harmony is establishing perfect congruence between what you think, what you speak, and how you act daily. Begin with modest habits, and over semesters they accumulate into absolute integrity."
    ]
  };

  // Load custom wisdom entries from local storage
  function loadCustomQuotes() {
    try {
      const stored = localStorage.getItem('NalandaCustomWisdom');
      if (stored) {
        const customList = JSON.parse(stored);
        // Reset to default then append
        WISDOM_QUOTES = JSON.parse(JSON.stringify(DEFAULT_WISDOM_QUOTES));
        
        customList.forEach(item => {
          if (WISDOM_QUOTES[item.category]) {
            WISDOM_QUOTES[item.category].unshift(item);
          } else {
            WISDOM_QUOTES[item.category] = [item];
          }
        });
      }
    } catch (e) {
      console.error("Failed loading custom entries", e);
    }
  }

  // Save a new custom entry
  function saveCustomQuote(item) {
    try {
      const stored = localStorage.getItem('NalandaCustomWisdom') || '[]';
      const list = JSON.parse(stored);
      list.push(item);
      localStorage.setItem('NalandaCustomWisdom', JSON.stringify(list));
      
      // Update global local array
      loadCustomQuotes();
      renderWisdomQuote();
    } catch (e) {
      console.error("Failed saving custom entry", e);
    }
  }

  // Render quotes based on category and offset
  function renderWisdomQuote() {
    const quoteContainer = document.getElementById('wisdom-quote-card-container');
    if (!quoteContainer) return;

    loadCustomQuotes();

    const quotes = WISDOM_QUOTES[currentCategory] || WISDOM_QUOTES.stoicism;
    if (quotes.length === 0) return;

    // Carousel index wrapping
    let quoteIndex = manualOffset % quotes.length;
    if (quoteIndex < 0) quoteIndex = quotes.length + quoteIndex;
    const quote = quotes[quoteIndex];

    const bgImgUrl = CATEGORY_BG_IMAGES[currentCategory] || CATEGORY_BG_IMAGES.stoicism;
    
    // Style settings per branch
    let accentColor = '#eec366'; // Stoic Gold
    let badgeBg = 'bg-[#1b232a] text-[#eec366]';
    let bannerTitle = `${currentCategory.toUpperCase()}  •  SANCTUARY WISDOM`;

    if (currentCategory === 'osho') {
      accentColor = '#fda4af';
      badgeBg = 'bg-[#420101] text-[#fda4af]';
    } else if (currentCategory === 'buddhism') {
      accentColor = '#fda4af';
      badgeBg = 'bg-[#3b0712] text-[#fda4af]';
    } else if (currentCategory === 'krishna') {
      accentColor = '#fed7aa';
      badgeBg = 'bg-[#652003] text-[#fed7aa]';
    } else if (currentCategory === 'meditation') {
      accentColor = '#6ee7b7';
      badgeBg = 'bg-[#022c22] text-[#6ee7b7]';
    } else if (currentCategory === 'psychology') {
      accentColor = '#93c5fd';
      badgeBg = 'bg-[#172554] text-[#93c5fd]';
    } else if (currentCategory === 'leadership') {
      accentColor = '#e9d5ff';
      badgeBg = 'bg-[#3b0764] text-[#e9d5ff]';
    }

    // Dynamic scale for typography based on text content size
    let fontSizeClass = 'text-xl sm:text-2xl md:text-3xl';
    if (quote.text.length > 120) {
      fontSizeClass = 'text-sm sm:text-base md:text-lg';
    } else if (quote.text.length > 75) {
      fontSizeClass = 'text-base sm:text-lg md:text-xl';
    }

    quoteContainer.innerHTML = `
      <div class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
        
        <!-- Premium Cinematic Cover Backdrop Image (Unsplash photo with rich warm hues) -->
        <div class="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-60 scale-105 filter blur-[0.3px] brightness-[0.85]" style="background-image: url('${bgImgUrl}');"></div>
        
        <!-- Smooth Vignette Shadows Layout -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 z-0"></div>
        
        <!-- Rotating Sacred Mandala vector overlay -->
        <div class="absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] opacity-[0.06] animate-[spin_120s_linear_infinite] flex items-center justify-center pointer-events-none select-none z-0">
          <svg class="w-full h-full text-white" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" fill="none" stroke-width="0.3">
              <circle r="44" cx="50" cy="50"/>
              <circle r="34" cx="50" cy="50" stroke-dasharray="2,3" />
              <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" />
              <polygon points="50,16 79,33 79,66 50,83 21,66 21,33" stroke-linecap="round"/>
            </g>
          </svg>
        </div>
 
        <!-- 1. Hero Progress Ring Overlay (Fitness style ring with glow matching selected category accent) -->
        <div class="absolute top-5 right-5 flex items-center justify-center z-20 shadow-md">
          <div class="relative w-14 h-14 flex items-center justify-center bg-black/55 backdrop-blur-md rounded-full border border-white/10 select-none">
            <svg class="absolute inset-0 w-full h-full -rotate-90 p-1" viewBox="0 0 36 36">
              <path class="text-white/15" stroke-width="2.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path stroke-width="2.8" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-dasharray="100" stroke-dashoffset="22" style="stroke: ${accentColor}; filter: drop-shadow(0px 0px 3px ${accentColor}80);" />
            </svg>
            <div class="flex flex-col items-center justify-center">
              <span class="text-[11px] font-bold font-mono text-white leading-none">78%</span>
              <span class="text-[6.5px] text-white/60 uppercase font-mono tracking-wider mt-0.5 scale-90">Read</span>
            </div>
          </div>
        </div>
 
        <!-- Category Tagline Badge -->
        <div class="absolute top-5 left-5 flex items-center gap-2 z-10">
          <span class="inline-block w-2.5 h-2.5 rounded-full animate-ping" style="background-color: ${accentColor};"></span>
          <span class="font-label-caps text-[9px] tracking-[0.25em] text-white/95 uppercase font-bold text-left">${bannerTitle}</span>
        </div>
        </div>

        <!-- Central Content Area (Left-aligned for immersive layout) -->
        <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white z-10 w-full pt-20">
          <blockquote class="font-sans font-semibold tracking-tight ${fontSizeClass} italic max-w-3xl leading-relaxed mb-6 text-left text-white/95 drop-shadow-md select-none border-l-4 pl-4" style="border-color: ${accentColor}; font-style: italic;">
            "${quote.text}"
          </blockquote>
          
          <!-- Controller & Sages footer panel -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 border-t border-white/10 pt-4 w-full">
            <div class="flex items-center gap-3">
              <cite class="font-sans not-italic text-sm font-bold text-white pl-1">— ${quote.author}</cite>
              <span class="text-white/50 text-[11px] font-mono select-none bg-white/5 px-2 py-0.5 rounded border border-white/5">${quote.source}</span>
            </div>
            
            <!-- Audios Speeches Speed & Controls Deck -->
            <div class="flex items-center gap-2.5 flex-wrap">
              <!-- Cycle Carousel Controls -->
              <button id="wisdom-carousel-prev" class="p-1.5 bg-white/5 hover:bg-white/10 text-white/85 hover:text-white rounded-full transition-all active:scale-90 border border-white/5 cursor-pointer" title="Previous Insight">
                <i class="lucide-icon text-sm" data-lucide="chevron-left"></i>
              </button>
              <button id="wisdom-carousel-next" class="p-1.5 bg-white/5 hover:bg-white/10 text-white/85 hover:text-white rounded-full transition-all active:scale-95 border border-white/5 mr-2 cursor-pointer" title="Next Insight">
                <i class="lucide-icon text-sm" data-lucide="chevron-right"></i>
              </button>

              <!-- Speed synthesis rate switcher -->
              <div class="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-[10px] font-mono text-white/70">
                <span>Speed:</span>
                <select id="wisdom-speech-speed-selector" class="bg-transparent border-none text-white font-bold cursor-pointer focus:outline-none py-0.5">
                  <option value="0.8" class="text-black">0.8x</option>
                  <option value="1.0" class="text-black" selected>1.0x</option>
                  <option value="1.2" class="text-black">1.2x</option>
                  <option value="1.5" class="text-black">1.5x</option>
                </select>
              </div>

              <!-- Speak Wisdom Trigger Button -->
              <button id="wisdom-audible-trigger-btn" class="flex items-center gap-2 bg-white/15 backdrop-blur-md hover:bg-white/20 hover:border-white/25 text-white transition-all px-4 py-2 rounded-full border border-white/10 active:scale-95 text-xs cursor-pointer shadow-md">
                <i id="wisdom-audible-icon" class="lucide-icon text-sm" data-lucide="volume-2"></i>
                <span id="wisdom-audible-text" class="font-label-caps text-[10px] uppercase font-bold tracking-wider">Listen</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    // Setup speech speed listener
    document.getElementById('wisdom-speech-speed-selector')?.addEventListener('change', function (e) {
      speakRate = parseFloat(e.target.value) || 1.0;
      // Restart speech if active
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        speakActiveQuote(quote.text, quote.author);
      }
    });

    // Carousel buttons
    document.getElementById('wisdom-carousel-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      manualOffset--;
      window.speechSynthesis.cancel();
      renderWisdomQuote();
    });

    document.getElementById('wisdom-carousel-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      manualOffset++;
      window.speechSynthesis.cancel();
      renderWisdomQuote();
    });

    // Speech trigger
    document.getElementById('wisdom-audible-trigger-btn')?.addEventListener('click', () => {
      speakActiveQuote(quote.text, quote.author);
    });

    // Update reflection data card below
    updateCompanionReflection(quote, badgeBg);
  }

  // Update daily companion reflection segment
  function updateCompanionReflection(quote, badgeClass) {
    const title = document.getElementById('wisdom-reflection-title');
    const body = document.getElementById('wisdom-reflection-body');
    const tags = document.getElementById('wisdom-reflection-tags');
    const label = document.getElementById('wisdom-reflection-type-label');
    const portrait = document.getElementById('wisdom-reflection-image-banner');
    const portraitAuthor = document.getElementById('wisdom-reflection-author-byline');

    if (label) {
      label.textContent = `${currentCategory.toUpperCase()} COMPREHENSIVE INSIGHT`;
    }
    if (title) {
      title.textContent = quote.title || "The Architecture of Thought";
    }
    if (body) {
      body.textContent = quote.reflection || "Loading...";
    }
    if (portrait) {
      portrait.src = REFLECTION_HEADER_IMAGES[currentCategory] || REFLECTION_HEADER_IMAGES.stoicism;
    }
    if (portraitAuthor) {
      portraitAuthor.textContent = `${quote.author} • PORTRAIT`;
    }

    if (tags) {
      tags.innerHTML = '';
      if (quote.tags && Array.isArray(quote.tags)) {
        quote.tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = `${badgeClass} px-3 py-1 font-label-caps text-[10px] rounded uppercase tracking-wider font-semibold shadow-sm transition-all`;
          span.textContent = tag;
          tags.appendChild(span);
        });
      }
    }
  }

  // Speech generator function (TTS) with mobile compatibility and premium voice matching
  function speakActiveQuote(text, author) {
    const textSpan = document.getElementById('wisdom-audible-text');
    const iconSpan = document.getElementById('wisdom-audible-icon');

    if (!window.speechSynthesis) {
      alert("✨ Speech synthesis is not supported on this device. Try Google Chrome or Safari!");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (textSpan) textSpan.textContent = 'Listen';
      const currentIcon = document.getElementById('wisdom-audible-icon');
      if (currentIcon) currentIcon.outerHTML = '<i id="wisdom-audible-icon" class="lucide-icon text-sm" data-lucide="volume-2"></i>';
      return;
    }

    if (!text) return;

    if (textSpan) textSpan.textContent = 'Speaking...';
    const currentIcon = document.getElementById('wisdom-audible-icon');
    if (currentIcon) currentIcon.outerHTML = '<i id="wisdom-audible-icon" class="lucide-icon text-sm" data-lucide="volume-x"></i>';

    const cleanText = text.replace(/[\u0900-\u097F\•\—]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(`"${cleanText}", wisdom spoken by ${author}.`);
    utterance.rate = speakRate || 1.0;
    utterance.pitch = 0.95;

    // Retrieve premium english voice if available
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const premiumVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Arthur'))
        );
        if (premiumVoice) {
          utterance.voice = premiumVoice;
        }
      }
    } catch (voiceError) {
      console.warn("Could not load custom voices", voiceError);
    }

    utterance.onend = () => {
      if (textSpan) textSpan.textContent = 'Listen';
      const finalIcon = document.getElementById('wisdom-audible-icon');
      if (finalIcon) finalIcon.outerHTML = '<i id="wisdom-audible-icon" class="lucide-icon text-sm" data-lucide="volume-2"></i>';
    };

    utterance.onerror = (err) => {
      console.error("Speech Synthesis Error", err);
      if (textSpan) textSpan.textContent = 'Listen';
      const errIcon = document.getElementById('wisdom-audible-icon');
      if (errIcon) errIcon.outerHTML = '<i id="wisdom-audible-icon" class="lucide-icon text-sm" data-lucide="volume-2"></i>';
    };

    window.speechSynthesis.speak(utterance);
  }

  // Bind category filter chips clicks
  function setupFilterChips() {
    const chips = document.querySelectorAll('.wisdom-category-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', function () {
        chips.forEach(c => {
          c.classList.remove('active', 'bg-[#2D3F4A]', 'text-white');
          c.classList.add('bg-[#F3F0E6]', 'dark:bg-[#181F21]', 'border', 'border-[#E8E4D8]', 'dark:border-white/10', 'text-[#4A4A4A]', 'dark:text-[#E4E2DD]', 'hover:bg-[#EBE7DD]');
        });

        this.classList.remove('bg-[#F3F0E6]', 'dark:bg-[#181F21]', 'border', 'border-[#E8E4D8]', 'dark:border-white/10', 'text-[#4A4A4A]', 'dark:text-[#E4E2DD]', 'hover:bg-[#EBE7DD]');
        this.classList.add('active', 'bg-[#2D3F4A]', 'text-white');

        currentCategory = this.dataset.category || 'stoicism';
        manualOffset = 0;
        window.speechSynthesis.cancel();
        renderWisdomQuote();
      });
    });
  }

  // Setup historic timeline events
  function setupHistoricalTimeline() {
    const nodes = document.querySelectorAll('.timeline-node-btn');
    nodes.forEach(node => {
      node.addEventListener('click', function () {
        nodes.forEach(n => {
          n.classList.remove('active');
          const circle = n.querySelector('div');
          if (circle) circle.className = 'w-7 h-7 rounded-full bg-surface border-4 border-white dark:border-zinc-800 shadow-md flex items-center justify-center text-on-surface text-[11px] font-bold my-2 transition-all';
        });

        this.classList.add('active');
        const activeCircle = this.querySelector('div');
        if (activeCircle) {
          activeCircle.className = 'w-7 h-7 rounded-full bg-primary border-4 border-white dark:border-zinc-800 shadow-xl flex items-center justify-center text-white text-[11px] font-bold my-2 scale-110 transition-all';
        }

        const year = this.dataset.year;
        const details = TIMELINE_DATA[year];
        
        if (details) {
          const titleEl = document.getElementById('timeline-info-title');
          const yearEl = document.getElementById('timeline-info-year');
          const descEl = document.getElementById('timeline-info-description');

          if (titleEl) titleEl.textContent = details.title;
          if (yearEl) yearEl.textContent = year;
          if (descEl) descEl.textContent = details.desc;
        }
      });
    });
  }

  // Sliding AI assistant drawer logic
  function setupAIAssistant() {
    const triggerBtn = document.getElementById('wisdom-ai-chat-btn');
    const drawer = document.getElementById('wisdom-ai-drawer');
    const closeBtn = document.getElementById('wisdom-ai-close-drawer');
    const form = document.getElementById('wisdom-ai-input-form');
    const input = document.getElementById('wisdom-ai-text-input');
    const chatLog = document.getElementById('wisdom-ai-chat-log');
    const quickQueries = document.querySelectorAll('.wisdom-ai-quick-query');

    if (!triggerBtn || !drawer) return;

    // Open/Close
    triggerBtn.addEventListener('click', () => {
      drawer.classList.remove('translate-x-full');
    });

    closeBtn?.addEventListener('click', () => {
      drawer.classList.add('translate-x-full');
    });

    // Handle Quick Query Buttons
    quickQueries.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        if (query) {
          addUserChatMessage(query);
          generateSageReply(query);
        }
      });
    });

    // Form submission
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = input.value.trim();
      if (!txt) return;

      addUserChatMessage(txt);
      input.value = '';
      generateSageReply(txt);
    });

    function addUserChatMessage(text) {
      const bubble = document.createElement('div');
      bubble.className = "flex justify-end gap-2 items-start max-w-[85%] ml-auto";
      bubble.innerHTML = `
        <div class="bg-primary text-white p-3 rounded-lg rounded-tr-none border border-primary/10 text-xs leading-relaxed select-all">
          ${text}
        </div>
      `;
      chatLog.appendChild(bubble);
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    function generateSageReply(query) {
      // Show thinking bubble
      const thinking = document.createElement('div');
      thinking.className = "flex gap-2 items-start max-w-[85%] text-left";
      thinking.innerHTML = `
        <div class="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs flex-shrink-0">
          <i class="lucide-icon text-xs animate-spin" data-lucide="loader"></i>
        </div>
        <div class="bg-surface-container-high dark:bg-zinc-800 p-3 rounded-lg rounded-tl-none border border-outline-variant/10 text-xs text-on-surface-variant flex gap-1">
          <span class="animate-bounce">.</span><span class="animate-bounce" style="animation-delay:0.2s">.</span><span class="animate-bounce" style="animation-delay:0.4s">.</span>
        </div>
      `;
      chatLog.appendChild(thinking);
      chatLog.scrollTop = chatLog.scrollHeight;

      setTimeout(() => {
        // Remove thinking bubble
        chatLog.removeChild(thinking);

        // Select response category
        let category = 'general';
        const lowercaseQuery = query.toLowerCase();
        if (lowercaseQuery.includes('explain') || lowercaseQuery.includes('quote')) {
          category = 'explain';
        } else if (lowercaseQuery.includes('practical') || lowercaseQuery.includes('example')) {
          category = 'practical';
        } else if (lowercaseQuery.includes('compare') || lowercaseQuery.includes('buddha') || lowercaseQuery.includes('osho') || lowercaseQuery.includes('krishna')) {
          category = 'compare';
        }

        const list = AI_SAGE_REPLIES[category];
        const text = list[Math.floor(Math.random() * list.length)];

        // Append answer with typewriter effect
        const bubble = document.createElement('div');
        bubble.className = "flex gap-2 items-start max-w-[85%] text-left animate-fade-in";
        bubble.innerHTML = `
          <div class="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs flex-shrink-0 shadow-inner">
            <i class="lucide-icon text-xs" data-lucide="sparkles"></i>
          </div>
          <div id="ai-text-typing" class="bg-surface-container-high dark:bg-zinc-800 p-3 rounded-lg rounded-tl-none border border-outline-variant/10 text-xs text-on-surface leading-released select-all prose dark:prose-invert">
          </div>
        `;
        chatLog.appendChild(bubble);

        const textDiv = bubble.querySelector('#ai-text-typing');
        let index = 0;
        const speed = 12; // write speed

        function typeWriter() {
          if (index < text.length) {
            textDiv.textContent += text.charAt(index);
            index++;
            chatLog.scrollTop = chatLog.scrollHeight;
            setTimeout(typeWriter, speed);
          }
        }
        typeWriter();

      }, 1000);
    }
  }

  // Setup customer quote custom modal triggers
  function setupCreateWisdomModal() {
    const openBtns = document.querySelectorAll('#open-create-wisdom-modal-btn, .create-wisdom-btn');
    const modal = document.getElementById('wisdom-create-modal');
    const closeBtn = document.getElementById('wisdom-create-close');
    const cancelBtn = document.getElementById('wisdom-new-cancel');
    const form = document.getElementById('wisdom-create-form');

    if (!modal) return;

    openBtns.forEach(btn => {
      btn?.addEventListener('click', () => {
        modal.classList.remove('hidden');
      });
    });

    const closeModal = () => {
      modal.classList.add('hidden');
      form?.reset();
    };

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      const item = {
        title: document.getElementById('wisdom-new-title').value.trim(),
        category: document.getElementById('wisdom-new-category').value,
        mood: document.getElementById('wisdom-new-mood').value.trim(),
        text: document.getElementById('wisdom-new-text').value.trim(),
        reflection: document.getElementById('wisdom-new-reflection').value.trim(),
        author: "Scribe King (You)",
        source: "Personal Sanctuary",
        tags: document.getElementById('wisdom-new-tags').value.split(',').map(t => t.trim().toUpperCase()).filter(t => t.length > 0)
      };

      saveCustomQuote(item);
      closeModal();
      
      // Toast message success
      if (window.showTemporaryToast) {
        window.showTemporaryToast("✨ Wisdom archived in your Personal Sanctuary!");
      } else {
        alert("✨ Wisdom archived in your Personal Sanctuary!");
      }
    });
  }

  // Global wisdom pages initializer
  function initWisdomSection() {
    loadCustomQuotes();
    renderWisdomQuote();
    setupFilterChips();
    setupHistoricalTimeline();
    setupAIAssistant();
    setupCreateWisdomModal();
  }

  // Expose in global scope to hook with main application routing
  window.LuminaWisdom = {
    init: initWisdomSection,
    render: renderWisdomQuote,
    setCategory: function (cat) {
      currentCategory = cat;
      manualOffset = 0;
      window.speechSynthesis.cancel();
      
      const chips = document.querySelectorAll('.wisdom-category-chip');
      chips.forEach(chip => {
        if (chip.dataset.category === cat) {
          chip.classList.add('active', 'bg-[#2D3F4A]', 'text-white');
          chip.classList.remove('bg-[#F3F0E6]', 'dark:bg-[#181F21]', 'border', 'border-[#E8E4D8]', 'dark:border-white/10', 'text-[#4A4A4A]', 'dark:text-[#E4E2DD]', 'hover:bg-[#EBE7DD]');
        } else {
          chip.classList.remove('active', 'bg-[#2D3F4A]', 'text-white');
          chip.classList.add('bg-[#F3F0E6]', 'dark:bg-[#181F21]', 'border', 'border-[#E8E4D8]', 'dark:border-white/10', 'text-[#4A4A4A]', 'dark:text-[#E4E2DD]', 'hover:bg-[#EBE7DD]');
        }
      });

      renderWisdomQuote();
    }
  };

  // Run automatically when document is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initWisdomSection();
  } else {
    document.addEventListener('DOMContentLoaded', initWisdomSection);
  }

})();
