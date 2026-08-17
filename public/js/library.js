(function () {
  'use strict';

  // ----------------------------------------------------
  // GITA & VEDAS DYNAMIC QUOTES MODULE
  // ----------------------------------------------------
  const GITA_QUOTES = [
    {
      text: '"यो यच्छ्रद्धः स एव सः" — As a man\'s faith is, so is he. Inspect your thoughts to change who you are.',
      author: 'Gita 17.3'
    },
    {
      text: '"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।" — You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
      author: 'Gita 2.47'
    },
    {
      text: '"उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।" — Elevate yourself through your own mind, and do not degrade yourself. For the mind can be the friend, and also the enemy of the self.',
      author: 'Gita 6.5'
    },
    {
      text: '"दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः।" — One whose mind remains undisturbed amidst misery, and who is free from longing in pleasure, is a sage of steady wisdom.',
      author: 'Gita 2.56'
    },
    {
      text: '"न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।" — In this world, there is nothing so purifying as sublime knowledge. One who is accomplished in Yoga finds this within naturally.',
      author: 'Gita 4.38'
    },
    {
      text: '"न जायते म्रियते वा कदाचिन्।" — The soul is never born, nor does it ever die. It is unborn, eternal, ever-existing, and primeval.',
      author: 'Gita 2.20'
    },
    {
      text: '"योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।" — Be steadfast in Yoga, O Arjuna. Perform your duty and abandon all attachment to success or failure. Such equanimity is called Yoga.',
      author: 'Gita 2.48'
    },
    {
      text: '"श्रद्धावांल्लभते ज्ञानं तत्परः संयतेन्द्रियः।" — The faithful, the dedicated, and those who have conquered their senses, attain sublime knowledge, and having attained it, quickly reach supreme peace.',
      author: 'Gita 4.39'
    }
  ];

  const VEDAS_QUOTES = [
    {
      text: '"आ नो भद्राः क्रतवो यन्तु विश्वतः।" — Let noble thoughts come to us from every side, unhindered and abundant.',
      author: 'Rigveda 1.89.1',
      veda: 'Rigveda'
    },
    {
      text: '"संगच्छध्वं संवदध्वं सं वो मनांसि जानताम्।" — Walk together, speak together, let your minds be in harmony as the ancient sages shared their thoughts.',
      author: 'Rigveda 10.191.2',
      veda: 'Rigveda'
    },
    {
      text: '"मित्रस्याहं चक्षुषा सर्वाणि भूतानि समीक्षे।" — May I look upon all living beings with the friendly eye of kindness, and may we all perceive each other as friends.',
      author: 'Yajurveda 36.18',
      veda: 'Yajurveda'
    },
    {
      text: '"अग्ने श्रेष्ठे पाथेय नय।" — O Light, guide us along the best path of truth and virtue, illuminating our minds with inner purity.',
      author: 'Samaveda 1822',
      veda: 'Samaveda'
    },
    {
      text: '"सहृदयं सांमनस्यमविद्वेषं कृणोमि वः।" — I make you all of one heart, one mind, free from hatred or resentment. Cherish one another as a mother loves her child.',
      author: 'Atharvaveda 3.30.1',
      veda: 'Atharvaveda'
    },
    {
      text: '"माता भूमिः पुत्रो अहं पृथिव्याः।" — Earth is the sacred mother, and I am a child of this Earth. Let us protect and honor her with every action.',
      author: 'Atharvaveda 12.1.12',
      veda: 'Atharvaveda'
    },
    {
      text: '"सं गच्छध्वं संघ मनः।" — Come together, think together, act in unison for the common welfare of humanity.',
      author: 'Rigveda 10.191.4',
      veda: 'Rigveda'
    },
    {
      text: '"ऋतस्य पन्थामन्वेति साधु।" — Follow the path of eternal moral order (Rta) diligently to gain light and joy.',
      author: 'Rigveda 1.124.3',
      veda: 'Rigveda'
    },
    {
      text: '"भद्रं कर्णेभिः शृणुयाम देवाः।" — O Divine, may we hear with our ears what is noble, and may we see with our eyes what is benevolent.',
      author: 'Yajurveda 25.21',
      veda: 'Yajurveda'
    },
    {
      text: '"स्वस्ति न इन्द्रो वृद्धश्रवाः।" — May the supreme energy bring spiritual prosperity, wisdom and boundless peace to our journey.',
      author: 'Samaveda 1855',
      veda: 'Samaveda'
    }
  ];

  let currentGitaQuoteIndex = 0;
  let currentVedasQuoteIndex = 0;
  let gitaQuoteTimer = null;
  let vedasQuoteTimer = null;

  function updateGitaQuoteUI() {
    const quoteEl = document.getElementById('home-gita-quote');
    const authorEl = document.getElementById('home-gita-quote-author');
    if (!quoteEl || !authorEl) return;
    
    quoteEl.style.transition = 'opacity 0.2s ease-in-out';
    authorEl.style.transition = 'opacity 0.2s ease-in-out';
    quoteEl.style.opacity = '0';
    authorEl.style.opacity = '0';
    
    setTimeout(() => {
      const q = GITA_QUOTES[currentGitaQuoteIndex];
      quoteEl.textContent = q.text;
      authorEl.textContent = q.author;
      quoteEl.style.opacity = '1';
      authorEl.style.opacity = '1';
    }, 200);
  }

  function updateVedasQuoteUI() {
    const quoteEl = document.getElementById('home-vedas-quote');
    const authorEl = document.getElementById('home-vedas-quote-author');
    const labelEl = document.getElementById('vedas-featured-label');
    if (!quoteEl || !authorEl) return;

    quoteEl.style.transition = 'opacity 0.2s ease-in-out';
    authorEl.style.transition = 'opacity 0.2s ease-in-out';
    if (labelEl) labelEl.style.transition = 'opacity 0.2s ease-in-out';

    quoteEl.style.opacity = '0';
    authorEl.style.opacity = '0';
    if (labelEl) labelEl.style.opacity = '0';

    setTimeout(() => {
      const q = VEDAS_QUOTES[currentVedasQuoteIndex];
      quoteEl.textContent = q.text;
      authorEl.textContent = q.author;
      if (labelEl) {
        labelEl.textContent = q.veda.toUpperCase();
        const vedaColors = {
          'Rigveda': 'text-[#38bdf8] bg-[#0c4a6e]/50 border border-[#0284c7]/20',
          'Samaveda': 'text-[#fb7185] bg-[#881337]/50 border border-[#f43f5e]/20',
          'Yajurveda': 'text-[#fbbf24] bg-[#78350f]/50 border border-[#d97706]/20',
          'Atharvaveda': 'text-[#34d399] bg-[#064e3b]/50 border border-[#059669]/20'
        };
        labelEl.className = `text-[9px] font-mono tracking-widest uppercase font-bold px-2.5 py-1 rounded transition-all ${vedaColors[q.veda] || 'text-[#9ca3af] bg-[#283234]'}`;
        labelEl.style.opacity = '1';
      }
      quoteEl.style.opacity = '1';
      authorEl.style.opacity = '1';
    }, 200);
  }

  function startQuoteTimers() {
    if (gitaQuoteTimer) clearInterval(gitaQuoteTimer);
    if (vedasQuoteTimer) clearInterval(vedasQuoteTimer);

    const rotationDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

    gitaQuoteTimer = setInterval(() => {
      currentGitaQuoteIndex = (currentGitaQuoteIndex + 1) % GITA_QUOTES.length;
      updateGitaQuoteUI();
    }, rotationDuration);

    vedasQuoteTimer = setInterval(() => {
      currentVedasQuoteIndex = (currentVedasQuoteIndex + 1) % VEDAS_QUOTES.length;
      updateVedasQuoteUI();
    }, rotationDuration);
  }

  // 15 Classic + Modern Niches Categories
  const NICHE_CATEGORIES = [
    { id: 'philosophy', title: 'Philosophy', icon: '📚', description: 'Ancient thoughts, modern logic, ethics, and existential quests' },
    { id: 'psychology', title: 'Psychology', icon: '<i class="lucide-icon text-lg mx-auto" data-lucide="brain"></i>', description: 'The inner workings of human mind, cognitive sciences, and behaviors' },
    { id: 'business', title: 'Business', icon: '<i class="lucide-icon text-lg mx-auto" data-lucide="coins"></i>', description: 'Strategies, management, corporate dynamics, and leadership' },
    { id: 'finance', title: 'Finance', icon: '📈', description: 'Markets, investments, wealth creation, and financial systems' },
    { id: 'technology', title: 'Technology', icon: '🤖', description: 'Software engineering, digital systems, AI, and futuristic mechanics' },
    { id: 'self_growth', title: 'Self Growth', icon: '🎯', description: 'Habits, mindfulness, mental mastery, and productivity' },
    { id: 'history', title: 'History', icon: '<i class="lucide-icon text-lg mx-auto" data-lucide="landmark"></i>', description: 'Ancient civilizations, empires, chronologies, and historical figures' },
    { id: 'science', title: 'Science', icon: '🔬', description: 'Physics, chemistry, biology, space cosmos, and experimental truth' },
    { id: 'health', title: 'Health', icon: '🏃', description: 'Holistic wellness, nutrition, physiology, and ancient medicine' },
    { id: 'creativity', title: 'Creativity', icon: '<i class="lucide-icon text-lg mx-auto" data-lucide="palette"></i>', description: 'Art, design theory, writing craft, and expressive masterpieces' },
    { id: 'career', title: 'Career', icon: '👨‍<i class="lucide-icon text-lg mx-auto" data-lucide="briefcase"></i>', description: 'Professional skill sets, work environments, and career trajectories' },
    { id: 'literature', title: 'Literature', icon: '📖', description: 'Classic poetry, legendary novels, short stories, and prose' },
    { id: 'biography', title: 'Biography', icon: '👤', description: 'Memoirs, personal letters, diaries, and live timelines of thinkers' },
    { id: 'spirituality', title: 'Spirituality', icon: '📿', description: 'Sacred texts, mandalas, higher states, and divine translations' },
    { id: 'exam_prep', title: 'Exam Prep', icon: '<i class="lucide-icon text-sm mx-auto" data-lucide="trophy"></i>', description: 'Curriculums, grammatical keys, academic notes, and mock guides' }
  ];

  // Old VEDPURAN_LIBRARY categories map to new niches
  const CATEGORY_MAP = {
    puranas: 'spirituality',
    vedas: 'spirituality',
    epics: 'literature',
    gita: 'philosophy',
    tantra: 'spirituality',
    philosophy: 'philosophy',
    ayurveda: 'health',
    stotras: 'spirituality',
    others: 'literature'
  };

  // High Quality Pre-Seeded Classic Masterpieces
  const SEEDED_BOOKS = [
    {
      id: 'seeded_meditations',
      name: "Meditations",
      author: "Marcus Aurelius",
      lang: "English",
      deva: "आत्म-चिंतन",
      category: "philosophy",
      categoryTitle: "Philosophy",
      cover: "https://covers.openlibrary.org/b/id/13139365-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/2162/2162-pdf.pdf", label: "📄 Full Text (English)" }]
    },
    {
      id: 'seeded_freud',
      name: "The Interpretation of Dreams",
      author: "Sigmund Freud",
      lang: "English",
      deva: "सपनों का अर्थ",
      category: "psychology",
      categoryTitle: "Psychology",
      cover: "https://covers.openlibrary.org/b/id/9266003-L.jpg",
      pdfs: [{ url: "https://lucian.uchicago.edu/blogs/graphtheory/files/2007/10/freud_dh.pdf", label: "📄 PDF - Freud Class" }]
    },
    {
      id: 'seeded_artofwar',
      name: "The Art of War",
      author: "Sun Tzu",
      lang: "English",
      deva: "युद्ध कला",
      category: "business",
      categoryTitle: "Business Strategy",
      cover: "https://covers.openlibrary.org/b/id/12836261-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/132/132-pdf.pdf", label: "📄 Strategy Manual PDF" }]
    },
    {
      id: 'seeded_richestman',
      name: "The Richest Man in Babylon",
      author: "George S. Clason",
      lang: "English",
      deva: "बेबीलोन का सबसे अमीर आदमी",
      category: "finance",
      categoryTitle: "Personal Finance",
      cover: "https://covers.openlibrary.org/b/id/14545924-L.jpg",
      pdfs: [{ url: "https://ccmpro.org/wp-content/uploads/2018/07/The-Richest-Man-In-Babylon.pdf", label: "📄 Wealth Guide" }]
    },
    {
      id: 'seeded_sicp',
      name: "Structure of Computer Programs (SICP)",
      author: "Harold Abelson",
      lang: "English",
      deva: "कंप्यूटर प्रोग्रामों की संरचना",
      category: "technology",
      categoryTitle: "Technology",
      cover: "https://covers.openlibrary.org/b/id/11186714-L.jpg",
      pdfs: [{ url: "https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.pdf", label: "📄 MIT Press Textbook" }]
    },
    {
      id: 'seeded_asamanthinketh',
      name: "As a Man Thinketh",
      author: "James Allen",
      lang: "English",
      deva: "जैसा मनुष्य सोचता है",
      category: "self_growth",
      categoryTitle: "Self Growth",
      cover: "https://covers.openlibrary.org/b/id/8301725-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/2425/2425-pdf.pdf", label: "📄 Personal Growth Classic" }]
    },
    {
      id: 'seeded_herodotus',
      name: "The History of Herodotus",
      author: "Herodotus",
      lang: "English",
      deva: "हेरोडोटस का इतिहास",
      category: "history",
      categoryTitle: "History",
      cover: "https://covers.openlibrary.org/b/id/11139414-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/2707/2707-pdf.pdf", label: "📄 Classical History" }]
    },
    {
      id: 'seeded_einstein',
      name: "Relativity: The Special and General Theory",
      author: "Albert Einstein",
      lang: "English",
      deva: "सापेक्षता का सिद्धांत",
      category: "science",
      categoryTitle: "Science",
      cover: "https://covers.openlibrary.org/b/id/11186676-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/36114/36114-pdf.pdf", label: "📄 Einstein Original Work" }]
    },
    {
      id: 'seeded_sushruta',
      name: "Sushruta Samhita",
      author: "Sushruta",
      lang: "Hindi",
      deva: "सुश्रुत संहिता",
      category: "health",
      categoryTitle: "Ancient Medicine",
      cover: "https://covers.openlibrary.org/b/id/11186701-L.jpg",
      pdfs: [{ url: "https://archive.org/download/TheSushrutaSamhita/TheSushrutaSamhitaHindi.pdf", label: "📄 Susruta Samhita PDF" }]
    },
    {
      id: 'seeded_davinci',
      name: "Thoughts on Art and Life",
      author: "Leonardo da Vinci",
      lang: "English",
      deva: "लियोनार्डो दा विंची विचार",
      category: "creativity",
      categoryTitle: "Creativity & Art",
      cover: "https://covers.openlibrary.org/b/id/11186733-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/15411/15411-pdf.pdf", label: "📄 Da Vinci Notes" }]
    },
    {
      id: 'seeded_prince',
      name: "The Prince",
      author: "Niccolò Machiavelli",
      lang: "English",
      deva: "राजकुमार",
      category: "career",
      categoryTitle: "Politics & Career Tactics",
      cover: "https://covers.openlibrary.org/b/id/12818862-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/1232/1232-pdf.pdf", label: "📄 Strategic Leadership" }]
    },
    {
      id: 'seeded_gitanjali',
      name: "Gitanjali",
      author: "Rabindranath Tagore",
      lang: "English",
      deva: "गीतांजलि",
      category: "literature",
      categoryTitle: "Literature & Poetry",
      cover: "https://covers.openlibrary.org/b/id/10543787-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/16166/16166-pdf.pdf", label: "📄 Nobel Prize Poetry" }]
    },
    {
      id: 'seeded_franklin',
      name: "The Autobiography of Benjamin Franklin",
      author: "Benjamin Franklin",
      lang: "English",
      deva: "बेंजामिन फ्रैंकलिन की आत्मकथा",
      category: "biography",
      categoryTitle: "Biography",
      cover: "https://covers.openlibrary.org/b/id/11116524-L.jpg",
      pdfs: [{ url: "https://www.gutenberg.org/files/2034/2034-pdf.pdf", label: "📄 Classic Autobiography" }]
    }
  ];

  let allBooks = [];
  let activeCategory = 'all';
  let searchQuery = '';
  let activeSegment = 'all';
  let activeLanguage = 'all';
  let selectedFileBlob = null; // Staged file for upload

  function decodeHtml(s) {
    if (!s) return '';
    const el = document.createElement('textarea');
    el.innerHTML = s;
    return el.value;
  }

  function bookId(book) {
    if (book.id) return book.id;
    return `${book.category}::${book.name}`;
  }

  // Generates an elegant, high-integrity vector SVG book cover page as a base64 or URI payload
  function generateDefaultCoverSvg(book) {
    const name = book.name || "Sacred Text";
    const author = book.author || "Ancient Vedic Rishi";
    const devaText = book.deva || "";
    const cat = book.category || "spirituality";
    const lang = book.lang || "Hindi";
    
    // Choose theme properties based on category
    let bgGrad = 'linear-gradient(135deg, #1f2326, #090b0c)';
    let borderStroke = '#e2c388';
    let centerMotif = '';
    let categoryLabel = 'Philosophy';
    let accentColor = '#f5e0a3';
    
    switch (cat) {
      case 'spirituality':
      case 'puranas':
      case 'vedas':
      case 'tantra':
      case 'stotras':
        bgGrad = 'linear-gradient(135deg, #500b08, #170201)';
        borderStroke = '#e5c06a'; // warm gold
        accentColor = '#f4a15a'; // marigold
        categoryLabel = '📿 Spirituality  •  Sacred';
        
        // Define center mandala motif
        centerMotif = `
          <g stroke="url(#gold-grad-cover)" fill="none" opacity="0.35" stroke-width="0.8" transform="translate(150, 225)">
            <circle r="55" />
            <circle r="44" stroke-dasharray="2,3" />
            <circle r="32" />
            <polygon points="0,-55 47.63,-27.5 47.63,27.5 0,55 -47.63,27.5 -47.63,-27.5" />
            <polygon points="27.5,-47.63 55,0 27.5,47.63 -27.5,47.63 -55,0 -27.5,-47.63" />
            <circle r="12" fill="url(#gold-grad-cover)" opacity="0.1" />
            <circle r="3" fill="url(#gold-grad-cover)" />
          </g>
        `;
        break;
        
      case 'philosophy':
      case 'gita':
        bgGrad = 'linear-gradient(135deg, #0f1d2d, #050b12)'; // deep navy sapphire
        borderStroke = '#dfd3c3'; // vintage ivory/gold
        accentColor = '#ecd29c';
        categoryLabel = '📚 Philosophy  •  Wisdom';
        
        // Athens / Pillar Motif
        centerMotif = `
          <g stroke="url(#gold-grad-cover)" fill="none" opacity="0.35" stroke-width="0.8" transform="translate(150, 225)">
            <polygon points="0,-50 40,-15 40,30 0,50 -40,30 -40,-15" />
            <polygon points="0,-40 30,-10 30,20 0,40 -30,20 -30,-10" />
            <line x1="-40" y1="10" x2="40" y2="10" />
            <circle r="14" />
            <polygon points="0,-12 10,5 -10,5" />
          </g>
        `;
        break;
        
      case 'health':
      case 'ayurveda':
        bgGrad = 'linear-gradient(135deg, #102d1a, #030e07)'; // forest emerald
        borderStroke = '#d8f3dc'; // soft mint
        accentColor = '#95d5b2';
        categoryLabel = '<i class="lucide-icon text-lg mx-auto" data-lucide="leaf"></i> Ayurveda  •  Wellness';
        
        // Healing Lotus Motif
        centerMotif = `
          <g stroke="url(#gold-grad-cover)" fill="none" opacity="0.4" stroke-width="1" transform="translate(150, 225)">
            <path d="M0,0 C12,-25 28,-25 0,-50 C-28,-25 -12,-25 0,0 Z" />
            <path d="M0,0 C25,-12 25,-28 50,0 C25,28 25,12 0,0 Z" transform="rotate(45)" />
            <path d="M0,0 C25,-12 25,-28 50,0 C25,28 25,12 0,0 Z" transform="rotate(-45)" />
            <path d="M0,0 C25,-12 25,-28 50,0 C25,28 25,12 0,0 Z" transform="rotate(90)" />
            <path d="M0,0 C25,-12 25,-28 50,0 C25,28 25,12 0,0 Z" transform="rotate(-90)" />
            <circle r="6" fill="url(#gold-grad-cover)" opacity="0.15" />
          </g>
        `;
        break;

      case 'biography':
        bgGrad = 'linear-gradient(135deg, #222530, #0a0b0f)';
        borderStroke = '#edf2f4';
        accentColor = '#f28482';
        categoryLabel = '👤 Biography  •  Lives';
        centerMotif = `
          <g stroke="url(#silver-grad-cover)" fill="none" opacity="0.35" stroke-width="0.8" transform="translate(150, 225)">
            <circle r="30" />
            <circle r="40" stroke-dasharray="3,3" />
            <ellipse cx="0" cy="-5" rx="10" ry="10" />
            <path d="M -20,20 C -20,5 20,5 20,20 Z" />
          </g>
        `;
        break;
        
      default:
        // Use default classic maroon ledger theme
        bgGrad = 'linear-gradient(135deg, #1b263b, #0d1b2a)';
        borderStroke = '#d4af37';
        accentColor = '#e5c595';
        categoryLabel = '📖 Classical Library';
        
        centerMotif = `
          <g stroke="url(#gold-grad-cover)" fill="none" opacity="0.4" stroke-width="0.8" transform="translate(150, 225)">
            <circle r="30" />
            <circle r="40" stroke-dasharray="4,4" />
            <polygon points="0,-45 12,-12 45,0 12,12 0,45 -12,12 -45,0 -12,-12" />
          </g>
        `;
        break;
    }
    
    // Choose appropriate title sizes depending on length
    let titleFontSize = "21px";
    if (name.length > 25) {
      titleFontSize = "16px";
    } else if (name.length > 15) {
      titleFontSize = "18px";
    }
    
    // Dynamic Sanskrit blessing string depending on category
    let headerSanskrit = devaText || "";
    if (!headerSanskrit) {
      if (cat === 'spirituality' || cat === 'puranas' || cat === 'vedas') {
        const blessings = ["ॐ तत् सत्", "सत्यमेव जयते", "स्वाध्याय परमं तपः", "ॐ शान्तिः शान्तिः"];
        headerSanskrit = blessings[name.length % blessings.length];
      } else {
        headerSanskrit = "सत्यमेव जयते";
      }
    }
    
    // Parse start and end colors safely
    const hexes = bgGrad.match(/#\w+/g) || ["#1f2326", "#090b0c"];
    const startColor = hexes[0] || "#1f2326";
    const endColor = hexes[1] || hexes[0] || "#090b0c";
    
    // Create direct clean SVG payload
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg-grad-cover" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${startColor}" />
      <stop offset="100%" stop-color="${endColor}" />
    </linearGradient>
    
    <!-- Gold Metallic Gradient -->
    <linearGradient id="gold-grad-cover" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a37624" />
      <stop offset="25%" stop-color="#eec366" />
      <stop offset="50%" stop-color="#b88e36" />
      <stop offset="75%" stop-color="#fdf0b0" />
      <stop offset="100%" stop-color="#805d15" />
    </linearGradient>

    <!-- Silver Gradient -->
    <linearGradient id="silver-grad-cover" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#70797b" />
      <stop offset="50%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
  </defs>
  
  <!-- Backdrop -->
  <rect width="100%" height="100%" fill="url(#bg-grad-cover)" />
  
  <!-- Outer double frames -->
  <rect x="12" y="12" width="276" height="426" fill="none" stroke="url(#gold-grad-cover)" stroke-width="1.25" rx="4" opacity="0.65" />
  <rect x="17" y="17" width="266" height="416" fill="none" stroke="url(#gold-grad-cover)" stroke-width="0.5" rx="3" opacity="0.4" />
  
  <!-- Elegant corner overlays -->
  <path d="M 17 32 L 32 17 M 17 40 L 40 17" stroke="url(#gold-grad-cover)" stroke-width="0.75" opacity="0.7" />
  <path d="M 283 32 L 268 17 M 283 40 L 260 17" stroke="url(#gold-grad-cover)" stroke-width="0.75" opacity="0.7" />
  <path d="M 17 418 L 32 433 M 17 410 L 40 433" stroke="url(#gold-grad-cover)" stroke-width="0.75" opacity="0.7" />
  <path d="M 283 418 L 268 433 M 283 410 L 260 433" stroke="url(#gold-grad-cover)" stroke-width="0.75" opacity="0.7" />
  
  <!-- Middle motif -->
  ${centerMotif}
  
  <!-- Text foreignObject element for responsive HTML wrap and typography -->
  <foreignObject x="25" y="25" width="250" height="400">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; color: ${accentColor}; text-align: center; padding: 15px; box-sizing: border-box;">
      
      <!-- Top Section -->
      <div>
        <span style="font-size: 8px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Hanken Grotesk', system-ui, sans-serif; font-weight: 700; color: #ecd29c; opacity: 0.85;">${categoryLabel}</span>
        <div style="width: 30px; height: 1px; background: url(#gold-grad-cover); margin: 6px auto 0; opacity: 0.6;"></div>
      </div>
      
      <!-- Middle Title Section -->
      <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; padding: 10px 0;">
        <h1 style="font-size: ${titleFontSize}; line-height: 1.35; font-weight: 600; font-family: 'Libre Caslon Text', 'Tiro Devanagari Sanskrit', 'Georgia', serif; color: #fdf5ea; margin: 0 0 6px 0; max-height: 110px; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${name}</h1>
        ${lang ? `<span style="font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'Hanken Grotesk', sans-serif; color: ${accentColor}; opacity: 0.65; margin-top: 4px;">[ ${lang} Edition ]</span>` : ""}
      </div>
      
      <!-- Bottom Section -->
      <div style="width: 100%;">
        ${headerSanskrit ? `<div style="font-size: 13px; font-weight: 500; font-family: 'Tiro Devanagari Sanskrit', 'Georgia', serif; color: #fdf5ea; letter-spacing: 0.5px; margin-bottom: 6px; text-shadow: 0 1.5px 3px rgba(0,0,0,0.3); opacity: 0.9;">${headerSanskrit}</div>` : ""}
        <div style="font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'Hanken Grotesk', system-ui, sans-serif; font-weight: 600; color: #ecd29c; opacity: 0.75; truncate: true; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">by ${author}</div>
      </div>
      
    </div>
  </foreignObject>
</svg>
`.trim();

    return "data:image/svg+xml;utf8," + encodeURIComponent(svgContent);
  }

  function bookId(book) {
    if (book.id) return book.id;
    return `${book.category}::${book.name}`;
  }

  function getProgress(book) {
    const key = `lumina_progress_${bookId(book)}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  }

  function setProgress(book, pct) {
    localStorage.setItem(`lumina_progress_${bookId(book)}`, String(pct));
  }

  function getLastRead() {
    try {
      return JSON.parse(localStorage.getItem('lumina_last_read') || 'null');
    } catch {
      return null;
    }
  }

  function setLastRead(book, pdfIndex) {
    localStorage.setItem('lumina_last_read', JSON.stringify({
      bookId: bookId(book),
      name: book.name,
      category: book.category,
      categoryTitle: book.categoryTitle,
      lang: book.lang,
      deva: book.deva,
      pdfs: book.pdfs,
      pdfIndex: pdfIndex || 0,
      progress: getProgress(book) || 15,
    }));
  }

  // Cover design renderer returning premium layout HTML depending on book's category
  function renderBookCoverMarkup(book) {
    const initial = book.name.charAt(0).toUpperCase();
    const cat = book.category;
    const isCustom = book.id && book.id.startsWith('custom_');

    let overlayHtml = '';
    let bgStyle = 'bg-gradient-to-br from-[#181f21] to-[#496269]';

    switch(cat) {
      case 'philosophy':
        bgStyle = 'bg-[#0d1b2a] border border-stone-800';
        overlayHtml = `
          <div class="absolute inset-2 border border-[#e0e1dd]/20 rounded flex flex-col justify-between p-3">
            <div class="h-2 border-b border-t border-[#e0e1dd]/40 flex justify-between px-1">
              <span class="text-[6px] text-[#e0e1dd]/40 font-mono tracking-wider">PHILOSOPHIA</span>
              <span class="text-[6px] text-[#e0e1dd]/40 font-mono tracking-wider">ETHICS</span>
            </div>
            <div class="text-center">
              <span class="text-[12px] text-stone-200/50 italic font-serif leading-none block mb-1">STATION</span>
              <span class="text-[10px] text-[#e0e1dd]/90 font-serif tracking-widest block uppercase truncate">${book.author || "SAGE"}</span>
            </div>
            <div class="h-2 border-b border-t border-[#e0e1dd]/40"></div>
          </div>
        `;
        break;

      case 'psychology':
        bgStyle = 'bg-[#1e003a] border border-purple-950';
        overlayHtml = `
          <div class="absolute inset-0 opacity-20 pointer-events-none">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="1.5" fill="#fff"/>
              <circle cx="80" cy="110" r="1.5" fill="#fff"/>
              <circle cx="30" cy="140" r="1" fill="#fff"/>
              <circle cx="70" cy="70" r="1.5" fill="#fff"/>
              <line x1="50" y1="50" x2="70" y2="70" stroke="#fff" stroke-width="0.3"/>
              <line x1="70" y1="70" x2="80" y2="110" stroke="#fff" stroke-width="0.3"/>
              <line x1="50" y1="50" x2="30" y2="140" stroke="#fff" stroke-width="0.3" stroke-dasharray="2,2"/>
            </svg>
          </div>
          <div class="absolute inset-3 border border-purple-500/10 rounded-lg flex flex-col justify-between p-2.5">
            <span class="text-[7px] text-[#dec9e9]/50 tracking-[0.2em] font-label-caps font-semibold">COGNITION</span>
            <div class="w-8 h-8 rounded-full bg-[#3c096c]/40 border border-purple-600/25 flex items-center justify-center font-bold text-xs text-[#dec9e9] mx-auto"><i class="lucide-icon text-lg mx-auto" data-lucide="brain"></i></div>
            <span class="text-[8px] text-[#dec9e9]/60 font-body-ui tracking-wider truncate w-full text-center">${book.author || "PSYCHE"}</span>
          </div>
        `;
        break;

      case 'business':
        bgStyle = 'bg-[#132a13] border border-emerald-950/40';
        overlayHtml = `
          <div class="absolute inset-0 opacity-[0.05]" style="background-image: repeating-linear-gradient(90deg, transparent, transparent 4px, #fff 4.5px, #fff 5px);"></div>
          <div class="absolute inset-2.5 border-2 border-[#d8f3dc]/30 rounded flex flex-col justify-between p-3 text-center">
            <span class="text-[8px] text-[#d8f3dc]/60 tracking-[0.25em] font-label-caps uppercase font-bold">STRATEGY</span>
            <div class="flex justify-center flex-col items-center">
              <i class="lucide-icon text-[#d8f3dc] text-lg select-none" data-lucide="sparkles"></i>
              <div class="w-6 h-[1px] bg-[#d8f3dc]/40 mt-1"></div>
            </div>
            <span class="text-[8px] text-[#d8f3dc]/60 font-body-ui font-semibold truncate uppercase w-full">${book.author || "LEADER"}</span>
          </div>
        `;
        break;

      case 'finance':
        bgStyle = 'bg-[#111] border border-stone-800';
        overlayHtml = `
          <div class="absolute inset-0 opacity-15" style="background-image: linear-gradient(#1b4332 0.5px, transparent 0.5px), linear-gradient(90deg, #1b4332 0.5px, transparent 0.5px); background-size: 10px 10px;"></div>
          <div class="absolute inset-2.5 border border-[#52b788]/20 bg-[#121212]/80 flex flex-col justify-between p-3">
            <div class="flex justify-between items-center text-[7px] font-mono text-[#52b788]/70">
              <span>LEDGER</span>
              <span class="animate-pulse">● STABLE</span>
            </div>
            <div class="font-mono text-[9px] text-[#52b788] bg-[#1b4332]/30 px-1.5 py-0.5 rounded text-center truncate">
              Index: ${(book.name.length * 11.2).toFixed(2)}
            </div>
            <span class="text-[8px] font-mono text-[#52b788]/60 truncate uppercase text-center">${book.author || "QUANT"}</span>
          </div>
        `;
        break;

      case 'technology':
        bgStyle = 'bg-[#181a1f] border border-cyan-950';
        overlayHtml = `
          <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(#00f5d4 1px, transparent 0px); background-size: 8px 8px;"></div>
          <div class="absolute inset-3 border border-[#00f5d4]/20 rounded flex flex-col justify-between p-3 font-mono">
            <span class="text-[7px] text-[#00f5d4] uppercase tracking-wider">// CORE STACK</span>
            <div class="text-[14px] text-white/30 text-center select-none font-semibold"> { &lt;/&gt; } </div>
            <span class="text-[8px] text-white/50 lowercase truncate font-light text-center"># ${book.author ? book.author.toLowerCase().replace(/\s/g, '') : "kernel"}</span>
          </div>
        `;
        break;

      case 'self_growth':
        bgStyle = 'bg-[#eee4da] border border-[#d5c3b2]';
        overlayHtml = `
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-[#c6ac8f] rounded-t-full opacity-60"></div>
          <div class="absolute inset-3 border border-[#5e503f]/20 rounded flex flex-col justify-between p-2.5 font-body-ui text-[#5e503f]">
            <span class="text-[7px] text-[#5e503f]/80 uppercase tracking-[0.25em] font-label-caps font-bold text-center">MINDFULNESS</span>
            <span class="text-[14px] text-center select-none">☀</span>
            <span class="text-[8px] font-label-caps lowercase italic text-center truncate">${book.author || "presence"}</span>
          </div>
        `;
        break;

      case 'history':
        bgStyle = 'bg-[#3a3530] border border-stone-800';
        overlayHtml = `
          <div class="absolute inset-2.5 border-4 border-[#ccc5b9]/15 rounded flex flex-col justify-between p-3 text-[#ccc5b9]">
            <span class="text-[7px] font-serif uppercase tracking-[0.2em] font-bold text-center">CHRONICLES</span>
            <div class="flex justify-center text-center">
              <span class="text-base select-none"><i class="lucide-icon text-lg mx-auto" data-lucide="landmark"></i></span>
            </div>
            <span class="text-[8px] font-serif uppercase tracking-widest text-[#ccc5b9]/70 text-center truncate">${book.author || "HISTORIAN"}</span>
          </div>
        `;
        break;

      case 'science':
        bgStyle = 'bg-[#000814] border border-sky-950';
        overlayHtml = `
          <div class="absolute inset-0 opacity-[0.12]">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="50%" cy="50%" rx="35" ry="12" stroke="#fff" stroke-width="0.5" fill="none" transform="rotate(30, 50, 50)" />
              <ellipse cx="50%" cy="50%" rx="35" ry="12" stroke="#fff" stroke-width="0.5" fill="none" transform="rotate(-30, 50, 50)" />
            </svg>
          </div>
          <div class="absolute inset-3 border border-sky-400/15 rounded flex flex-col justify-between p-3">
            <span class="text-[7px] text-[#00b4d8] tracking-[0.25em] font-label-caps font-bold uppercase text-center text-sky-400/80">EMPIRICAL</span>
            <span class="text-[11px] text-center text-sky-200/50 select-none">⚛</span>
            <span class="text-[8px] text-white/50 tracking-wider font-label-caps truncate uppercase text-center w-full">${book.author || "SCIENTIST"}</span>
          </div>
        `;
        break;

      case 'health':
        bgStyle = 'bg-[#21431e] border border-emerald-950';
        overlayHtml = `
          <div class="absolute inset-3 border border-emerald-200/10 rounded flex flex-col justify-between p-3 text-emerald-100">
            <span class="text-[7px] uppercase tracking-[0.25em] font-label-caps font-bold text-center">PHYSIOLOGY</span>
            <div class="text-center text-sm select-none opacity-80"><i class="lucide-icon text-lg mx-auto" data-lucide="leaf"></i></div>
            <span class="text-[8px] font-label-caps italic text-emerald-200/70 truncate w-full text-center uppercase">${book.author || "HEALER"}</span>
          </div>
        `;
        break;

      case 'creativity':
        bgStyle = 'bg-gradient-to-tr from-[#5f0f40] via-[#9a031e] to-[#f26419]';
        overlayHtml = `
          <div class="absolute inset-3 border border-white/10 rounded flex flex-col justify-between p-2.5 text-white">
            <span class="text-[7px] uppercase tracking-[0.25em] font-label-caps font-bold text-center text-white/95">EXPRESSION</span>
            <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] mx-auto"><i class="lucide-icon text-lg mx-auto" data-lucide="palette"></i></div>
            <span class="text-[8px] font-label-caps truncate uppercase font-medium text-center">${book.author || "ARTIST"}</span>
          </div>
        `;
        break;

      case 'career':
        bgStyle = 'bg-[#16273c] border border-sky-950';
        overlayHtml = `
          <div class="absolute left-6 top-0 bottom-0 w-[1px] bg-sky-200/5"></div>
          <div class="absolute inset-3 border border-sky-300/10 rounded flex flex-col justify-between p-2.5 text-sky-200">
            <span class="text-[7px] tracking-[0.2em] font-label-caps uppercase text-sky-300/80 text-center">VOCATIONAL</span>
            <span class="text-xs text-center select-none"><i class="lucide-icon text-lg mx-auto" data-lucide="briefcase"></i></span>
            <span class="text-[8px] font-label-caps tracking-wider truncate uppercase text-center w-full">${book.author || "DIRECTOR"}</span>
          </div>
        `;
        break;

      case 'literature':
        bgStyle = 'bg-[#4a0910] border border-[#a47e3b]/20';
        overlayHtml = `
          <div class="absolute inset-2.5 border border-[#e5c595]/30 rounded flex flex-col justify-between p-3 text-[#e5c595]">
            <div class="flex justify-between w-full h-1 select-none opacity-40">
              <span class="text-[6px]">✥</span>
              <span class="text-[6px]">✥</span>
            </div>
            <div class="text-center">
              <span class="text-[10px] font-serif italic text-white/80 leading-none">Classics</span>
            </div>
            <span class="text-[8px] font-serif tracking-widest text-[#e5c595]/80 text-center uppercase truncate block w-full">${book.author || "AUTHOR"}</span>
          </div>
        `;
        break;

      case 'biography':
        bgStyle = 'bg-[#222530] border border-stone-800';
        overlayHtml = `
          <div class="absolute right-1 bottom-1 select-none opacity-[0.05] text-[74px] leading-none font-bold uppercase font-sans">${initial}</div>
          <div class="absolute inset-3 border border-white/10 rounded flex flex-col justify-between p-2.5 text-[#edf2f4]">
            <span class="text-[7px] tracking-[0.2em] uppercase font-label-caps text-red-400 font-bold text-center">BIOGRAPHIC</span>
            <span class="text-[11px] text-center select-none font-serif opacity-40"><i class="lucide-icon text-lg mx-auto" data-lucide="users"></i></span>
            <span class="text-[8px] font-label-caps truncate uppercase text-center">${book.author || "MEMOIR"}</span>
          </div>
        `;
        break;

      case 'spirituality':
        bgStyle = 'bg-[#701004] border border-yellow-900/30';
        overlayHtml = `
          <div class="absolute inset-0 opacity-[0.05] flex items-center justify-center">
            <div class="w-24 h-24 rounded-full border border-dashed border-white animate-[spin_180s_linear_infinite]"></div>
          </div>
          <div class="absolute inset-2.5 border border-[#f4a261]/25 rounded-xl flex flex-col justify-between p-3 text-[#f4a261]">
            <div class="text-center select-none text-[10px] leading-none flex justify-center gap-1 opacity-80">
              <span><i class="lucide-icon text-sm" data-lucide="flame"></i></span><span><i class="lucide-icon text-sm" data-lucide="flower"></i></span><span><i class="lucide-icon text-sm" data-lucide="flame"></i></span>
            </div>
            <div class="text-center">
              <span class="text-[7px] tracking-[0.25em] font-serif uppercase block font-semibold text-[#f4a261]/70 mb-0.5">SACRED WORK</span>
              <span class="text-[9px] text-[#f4a261] font-serif block truncate w-full" style="font-family:'Tiro Devanagari Sanskrit', serif">${book.deva || 'ऋषिः'}</span>
            </div>
            <span class="text-[8px] tracking-wider text-white/50 italic text-center truncate uppercase block w-full font-serif">${book.author || 'Mantra'}</span>
          </div>
        `;
        break;

      case 'exam_prep':
        bgStyle = 'bg-[#0a416a] border border-sky-950';
        overlayHtml = `
          <div class="absolute left-0 right-0 top-10 h-[1px] bg-white/10"></div>
          <div class="absolute left-0 right-0 top-14 h-[1px] bg-white/10"></div>
          <div class="absolute inset-3 border border-white/15 rounded flex flex-col justify-between p-2.5 text-white">
            <span class="text-[7px] tracking-[0.25em] font-label-caps font-bold text-sky-200 text-center">CURRICULUM</span>
            <div class="w-6 h-6 rounded bg-sky-900/30 flex items-center justify-center font-bold text-[9px] border border-white/10 mx-auto"><i class="lucide-icon text-sm mx-auto" data-lucide="trophy"></i></div>
            <span class="text-[8px] font-label-caps w-full tracking-wider truncate uppercase text-center">${book.author || "ACADEMICS"}</span>
          </div>
        `;
        break;

      default:
        overlayHtml = `
          <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white/90">
            <span class="font-bold text-5xl leading-none mb-2">${initial}</span>
            <span class="text-xs truncate max-w-full block opacity-70">${book.author || 'Lumina'}</span>
          </div>
        `;
        break;
    }

    const coverUri = book.cover || book.coverUrl;
    const imgHtml = coverUri ? `
      <img src="${coverUri}" 
           alt="${book.name}" 
           class="absolute inset-0 w-full h-full object-cover z-5 transition-opacity duration-500 opacity-0"
           onload="this.classList.remove('opacity-0'); this.classList.add('opacity-100');"
           onerror="this.style.display='none'; if (window.handleCoverLoadError) window.handleCoverLoadError('${bookId(book).replace(/'/g, "\\'")}', this);"
           referrerpolicy="no-referrer" />
    ` : '';

    return `
      <div class="aspect-[2/3] relative rounded-xl overflow-hidden book-card-shadow mb-3 ${bgStyle}">
        ${overlayHtml}
        ${imgHtml}
        <!-- Language indicator -->
        <span class="absolute top-2.5 left-2.5 bg-black/50 text-white text-[8px] font-label-caps px-1.5 py-0.5 rounded-sm uppercase tracking-wider scale-90 z-10">${book.lang}</span>
        ${isCustom ? '<span class="absolute top-2.5 right-2.5 bg-green-700/85 text-white text-[8px] font-label-caps px-1.5 py-0.5 rounded-sm scale-90 z-10">CUSTOM</span>' : ''}
        ${book.pdfs && book.pdfs.length > 1 ? '<span class="absolute top-2.5 right-2.5 bg-black/45 text-white text-[8px] font-label-caps px-1.5 py-0.5 rounded scale-90 z-10">MULTI-PART</span>' : ''}
        <div class="absolute inset-x-0 top-0 h-full w-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <i class="lucide-icon text-white text-4xl" data-lucide="book-open"></i>
        </div>
      </div>
    `;
  }

  // Extracts the very first page of a PDF using PDF.js to use as an elegant cover
  async function extractFirstPageAsCover(book) {
    try {
      const pdf = book.pdfs && book.pdfs[0];
      if (!pdf) return null;

      let pdfDataVal = null;
      let objectUrl = null;

      if (pdf.fileId) {
        if (window.LuminaDB) {
          const blob = await window.LuminaDB.getFile(pdf.fileId);
          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            pdfDataVal = { url: objectUrl };
          }
        }
      } else if (pdf.url) {
        let u = pdf.url;
        if (u.startsWith('http://') || u.startsWith('https://')) {
          u = `/api/proxy-pdf?url=${encodeURIComponent(u)}`;
        }
        pdfDataVal = { url: u };
      }

      if (!pdfDataVal) return null;
      if (!window.pdfjsLib) return null;

      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      } catch (e) {
        // ignored
      }

      const loadingTask = window.pdfjsLib.getDocument(pdfDataVal);
      const pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Extract a quality but space-saving thumbnail size for fast mobile loads
      const viewport = page.getViewport({ scale: 0.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      await page.render(renderContext).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.55);

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      return dataUrl;
    } catch (err) {
      console.warn("Cover PDF extraction bypassed/failed for", book.name);
      return null;
    }
  }

  // Generates PDF cover and attaches it to the card UI container
  async function generatePdfCoverAndApply(book, coverContainer) {
    if (coverContainer.dataset.coverLoading === 'true') return;
    coverContainer.dataset.coverLoading = 'true';

    try {
      const bid = bookId(book);
      const cacheVal = localStorage.getItem(`lumina_cover_${bid}`);
      if (cacheVal) {
        book.coverUrl = cacheVal;
        applyCoverImage(book.name, cacheVal, coverContainer);
        return;
      }

      const dataUrl = await extractFirstPageAsCover(book);
      if (dataUrl) {
        try {
          localStorage.setItem(`lumina_cover_${bid}`, dataUrl);
        } catch (storageErr) {
          console.warn("Cover cache quota limit reached:", storageErr);
        }
        book.coverUrl = dataUrl;
        applyCoverImage(book.name, dataUrl, coverContainer);

        if (book.id && book.id.startsWith('custom_') && window.LuminaDB) {
          try {
            const storedBook = await window.LuminaDB.getBook(book.id);
            if (storedBook) {
              storedBook.coverUrl = dataUrl;
              await window.LuminaDB.saveBook(storedBook);
            }
          } catch (dbErr) {
            console.error("IndexedDB custom cover rewrite failure:", dbErr);
          }
        }
      } else {
        coverContainer.dataset.coverLoaded = 'failed';
      }
    } catch (err) {
      console.warn("Generating cover failed for", book.name, err);
      coverContainer.dataset.coverLoaded = 'failed';
    } finally {
      coverContainer.dataset.coverLoading = 'false';
    }
  }

  function applyCoverImage(name, dataUrl, coverContainer) {
    const existing = coverContainer.querySelector('img');
    if (existing) existing.remove();

    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = name;
    img.className = 'absolute inset-0 w-full h-full object-cover z-5 transition-opacity duration-500 opacity-0';
    img.onload = () => {
      img.classList.remove('opacity-0');
      img.classList.add('opacity-100');
      coverContainer.dataset.coverLoaded = 'true';
    };
    img.referrerPolicy = 'no-referrer';
    coverContainer.appendChild(img);
  }

  // Dynamic fallback error handler
  window.handleCoverLoadError = function(bid, imgEl) {
    const book = allBooks.find(b => bookId(b) === bid);
    if (!book) return;

    const coverContainer = imgEl.closest('.book-card-shadow');
    if (coverContainer) {
      generatePdfCoverAndApply(book, coverContainer);
    }
  };

  // Traverses all DOM elements in the viewport containing data-book-id attributes and loads their cover
  async function lazyLoadCoversForVisibleCards() {
    const cards = document.querySelectorAll('[data-book-id]');
    cards.forEach(async (card) => {
      const bid = card.dataset.bookId;
      if (!bid) return;

      const book = allBooks.find(b => bookId(b) === bid);
      if (!book) return;

      const coverContainer = card.querySelector('.book-card-shadow');
      if (!coverContainer) return;

      if (coverContainer.dataset.coverLoaded === 'true') return;

      const coverUri = book.cover || book.coverUrl;
      if (coverUri) {
        if (!coverContainer.querySelector('img')) {
          const img = document.createElement('img');
          img.src = coverUri;
          img.alt = book.name;
          img.className = 'absolute inset-0 w-full h-full object-cover z-5 transition-opacity duration-500 opacity-0';
          img.onload = () => {
            img.classList.remove('opacity-0');
            img.classList.add('opacity-100');
            coverContainer.dataset.coverLoaded = 'true';
          };
          img.onerror = () => {
            img.style.display = 'none';
            generatePdfCoverAndApply(book, coverContainer);
          };
          img.referrerPolicy = 'no-referrer';
          coverContainer.appendChild(img);
        }
      } else {
        generatePdfCoverAndApply(book, coverContainer);
      }
    });
  }

  // Load and segment books across categories
  async function initData() {
    allBooks = [];

    // 1. Map core static texts
    if (window.VEDPURAN_LIBRARY) {
      window.VEDPURAN_LIBRARY.forEach((cat) => {
        const title = decodeHtml(cat.title);
        const targetNicheId = CATEGORY_MAP[cat.id] || 'spirituality';
        const targetNiche = NICHE_CATEGORIES.find(c => c.id === targetNicheId) || NICHE_CATEGORIES[0];

        cat.books.forEach((b) => {
          allBooks.push({
            ...b,
            category: targetNicheId,
            categoryTitle: targetNiche.title
          });
        });
      });
    }

    // 2. Add high quality seeded ones
    SEEDED_BOOKS.forEach((b) => {
      if (!allBooks.some(eb => eb.name === b.name)) {
        allBooks.push(b);
      }
    });

    // 3. Load user-added custom books from LocalStorage / IndexedDB
    if (window.LuminaDB) {
      try {
        const dbBooks = await window.LuminaDB.getBooks();
        dbBooks.forEach((b) => {
          allBooks.push({
            ...b,
            categoryTitle: NICHE_CATEGORIES.find(c => c.id === b.category)?.title || b.category
          });
        });
      } catch (err) {
        console.error("Failed to load local books", err);
      }
    }

    // 4. Attach any cached covers from LocalStorage memory
    allBooks.forEach((book) => {
      const bid = bookId(book);
      const cached = localStorage.getItem(`lumina_cover_${bid}`);
      if (cached) {
        book.coverUrl = cached;
      }
    });

    // 5. Generate and attach luxury dynamic vector covers for any book that lacks an assigned cover
    allBooks.forEach((book) => {
      if (!book.cover && !book.coverUrl) {
        book.coverUrl = generateDefaultCoverSvg(book);
      }
    });
  }

  function filteredBooks() {
    const q = searchQuery.toLowerCase();
    return allBooks.filter((b) => {
      const matchCat = activeCategory === 'all' || b.category === activeCategory;
      const matchLang = activeLanguage === 'all' || b.lang === activeLanguage;

      const bName = b.name || b.title || '';
      const bDeva = b.deva || b.devaName || '';
      const bAuthor = b.author || b.by || '';
      const bLang = b.lang || '';
      const bCatTitle = b.categoryTitle || '';
      const text = `${bName} ${bDeva} ${bAuthor} ${bLang} ${bCatTitle}`.toLowerCase();
      const matchSearch = !q || text.includes(q);

      let matchSegment = true;
      const progress = getProgress(b);
      if (activeSegment === 'reading') {
        matchSegment = progress > 0 && progress < 100;
      } else if (activeSegment === 'completed') {
        matchSegment = progress === 100;
      } else if (activeSegment === 'want') {
        matchSegment = progress === 0;
      } else if (activeSegment === 'favorites') {
        matchSegment = progress > 50 || b.lang === 'Sanskrit';
      } else if (activeSegment === 'downloaded') {
        matchSegment = (b.id && b.id.startsWith('custom_')) || b.lang === 'Sanskrit';
      }

      return matchCat && matchLang && matchSearch && matchSegment;
    });
  }

  function renderBookCard(book) {
    const progress = getProgress(book);

    return `
      <div class="group cursor-pointer book-item transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01]" data-book-id="${bookId(book).replace(/"/g, '&quot;')}">
        <div class="relative shadow-md rounded-xl overflow-hidden transition-all duration-300">
          ${renderBookCoverMarkup(book)}
          ${progress > 0 ? `
          <div class="absolute bottom-3 left-3 right-3 z-10 bg-black/60 p-1 rounded-full backdrop-blur-md">
            <div class="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div class="bg-[#CFA15A] dark:bg-[#FBBF24] h-full rounded-full transition-all duration-500" style="width:${Math.min(progress, 100)}%"></div>
            </div>
          </div>` : ''}
        </div>
        <div class="mt-2 text-left px-0.5">
          <h3 class="font-sans font-bold text-xs leading-snug text-[#1E1E1E] dark:text-[#F8FAFC] line-clamp-1 group-hover:text-[#6B4226] dark:group-hover:text-[#FBBF24] transition-colors">${book.name}</h3>
          <p class="text-[9px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mt-0.5 truncate">${book.author ? book.author : decodeHtml(book.categoryTitle)}</p>
        </div>
      </div>`;
  }

  function renderRecommendations() {
    const container = document.getElementById('library-recommendations');
    if (!container) return;

    const recs = SEEDED_BOOKS.slice(0, 5); 

    container.innerHTML = recs.map((b) => {
      let recReason = "Reason: Classic literature with absolute strategic insight.";
      if (b.id === 'seeded_meditations') recReason = "Stoic masterpiece for emotional calm and focus.";
      if (b.id === 'seeded_artofwar') recReason = "Timeless rules for tactical and mindful action.";
      if (b.id === 'seeded_asamanthinketh') recReason = "A classic cognitive template linking mind and behavior.";
      if (b.id === 'seeded_richestman') recReason = "Simple Babylonian formula for persistent wealth preservation.";
      if (b.id === 'seeded_sicp') recReason = "MIT computational masterpiece for structural logic.";

      return `
        <div class="snap-start shrink-0 w-[280px] bg-white dark:bg-slate-900 rounded-2xl p-4 border border-neutral-150/60 dark:border-neutral-800 shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onclick="window.LuminaLibrary.openBook(${JSON.stringify(b).replace(/"/g, '&quot;')})">
          <div class="flex gap-4">
            <div class="w-16 aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-xs">
              ${renderBookCoverMarkup(b)}
            </div>
            <div class="text-left space-y-1 overflow-hidden">
              <span class="text-[8px] font-mono tracking-widest text-[#CFA15A] dark:text-[#FBBF24] uppercase font-bold">Librarian's Pick</span>
              <h4 class="font-sans font-bold text-xs leading-tight text-[#1E1E1E] dark:text-white line-clamp-2">${b.name}</h4>
              <p class="text-[9px] text-neutral-400 truncate">${b.author}</p>
            </div>
          </div>
          <p class="bg-neutral-50 dark:bg-slate-950/60 p-2.5 rounded-xl text-[10px] text-[#1E1E1E]/80 dark:text-neutral-300 font-light leading-relaxed border-l-2 border-[#CFA15A] text-left">
            ${recReason}
          </p>
        </div>
      `;
    }).join('');
  }

  function renderCollections() {
    const container = document.getElementById('library-collections-container');
    if (!container) return;

    const collections = [
      {
        title: "Advaita Vedanta & Sacred Codices",
        subtitle: "Traditional scriptures explaining Brahman, yoga, and inner-Self logic",
        icon: '<i class="lucide-icon text-sm" data-lucide="flower"></i>️',
        books: allBooks.filter(b => b.category === 'spirituality' || CATEGORY_MAP[b.category] === 'spirituality').slice(0, 6)
      },
      {
        title: "Ancient & Classical Philosophy",
        subtitle: "Socratic dialogs, Stoic codes, and core logic of the great thinkers",
        icon: '<i class="lucide-icon text-lg mx-auto" data-lucide="landmark"></i>️',
        books: allBooks.filter(b => b.category === 'philosophy' || b.id === 'seeded_meditations').slice(0, 6)
      },
      {
        title: "Cognitive Psychology & Inner Calm",
        subtitle: "The mechanics of human mind, behavior paradigms, and focus",
        icon: '<i class="lucide-icon text-lg mx-auto" data-lucide="brain"></i>',
        books: allBooks.filter(b => b.category === 'psychology' || b.category === 'self_growth').slice(0, 6)
      },
      {
        title: "Social Dynamics, Art & Strategy",
        subtitle: "Empirical success models, tactical codes, biography memoirs, and poetry",
        icon: '<i class="lucide-icon text-lg mx-auto" data-lucide="palette"></i>',
        books: allBooks.filter(b => ['business', 'finance', 'history', 'creativity', 'career', 'literature'].includes(b.category)).slice(0, 6)
      }
    ];

    container.innerHTML = collections.map((col, idx) => {
      if (col.books.length === 0) return '';
      const sliderId = `col-slider-${idx}`;

      const bookCards = col.books.map((b) => `
        <div class="snap-start shrink-0 w-28 md:w-32 home-featured-book hover:-translate-y-1.5 transition-all duration-300 cursor-pointer" data-book-id="${bookId(b).replace(/"/g, '&quot;')}">
          <div class="aspect-[2/3] rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            ${renderBookCoverMarkup(b)}
          </div>
          <div class="mt-2 text-left px-0.5">
            <h5 class="font-sans text-[11px] font-bold text-[#1E1E1E] dark:text-neutral-100 truncate">${b.name}</h5>
            <p class="text-[9px] text-neutral-400 truncate mt-0.5">${b.author || b.lang}</p>
          </div>
        </div>
      `).join('');

      return `
        <div class="space-y-3.5 pb-2">
          <div class="flex items-center justify-between pb-1 border-b border-neutral-150/60 dark:border-neutral-800/85">
            <div class="text-left space-y-0.5">
              <h4 class="font-sans font-bold text-sm tracking-tight text-[#1E1E1E] dark:text-white flex items-center gap-1.5">
                <span>${col.icon}</span> ${col.title}
              </h4>
              <p class="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium">${col.subtitle}</p>
            </div>
            <div class="flex gap-1.5">
              <button class="p-1 cursor-pointer rounded-full hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white inline-flex items-center justify-center" onclick="document.getElementById('${sliderId}').scrollBy({left: -200, behavior: 'smooth'})">
                <i class="lucide-icon text-[16px]" data-lucide="arrow-left"></i>
              </button>
              <button class="p-1 cursor-pointer rounded-full hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white inline-flex items-center justify-center" onclick="document.getElementById('${sliderId}').scrollBy({left: 200, behavior: 'smooth'})">
                <i class="lucide-icon text-[16px]" data-lucide="arrow-right"></i>
              </button>
            </div>
          </div>
          <div id="${sliderId}" class="flex gap-4.5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar">
            ${bookCards}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.home-featured-book').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.bookId;
        const book = allBooks.find((b) => bookId(b) === id);
        if (book) LuminaLibrary.openBook(book);
      });
    });
  }

  function renderRecentlyAdded() {
    const container = document.getElementById('library-recently-added');
    if (!container) return;

    const recents = allBooks.slice(-8).reverse();

    container.innerHTML = recents.map((b) => `
      <div class="snap-start shrink-0 w-28 md:w-32 home-featured-book hover:-translate-y-1.5 transition-all duration-300 cursor-pointer" data-book-id="${bookId(b).replace(/"/g, '&quot;')}">
        <div class="aspect-[2/3] rounded-lg overflow-hidden shadow-xs hover:shadow-md">
          ${renderBookCoverMarkup(b)}
        </div>
        <div class="mt-2 text-left px-0.5">
          <h5 class="font-sans font-bold text-[11px] text-[#1E1E1E] dark:text-white truncate">${b.name}</h5>
          <p class="text-[9px] text-neutral-400 truncate mt-0.5">${b.author || b.lang}</p>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.home-featured-book').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.bookId;
        const book = allBooks.find((b) => bookId(b) === id);
        if (book) LuminaLibrary.openBook(book);
      });
    });
  }

  function renderLibraryGrid() {
    const grid = document.getElementById('library-grid');
    const countEl = document.getElementById('library-count');
    const emptyEl = document.getElementById('library-empty');
    if (!grid) return;

    const books = filteredBooks();
    if (countEl) countEl.textContent = `${books.length} texts`;

    if (books.length === 0) {
      grid.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }
    if (emptyEl) emptyEl.classList.add('hidden');

    grid.innerHTML = books.map(renderBookCard).join('');

    grid.querySelectorAll('.book-item').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.bookId;
        const book = allBooks.find((b) => bookId(b) === id);
        if (book) LuminaLibrary.openBook(book);
      });
    });

    lazyLoadCoversForVisibleCards();
  }

  function renderCategoryFilters() {
    const container = document.getElementById('library-filters');
    if (!container) return;

    const INACTIVE_FILTER_CLASS = "px-3.5 py-1.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-200/60 dark:border-neutral-800 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all hover:bg-neutral-100 dark:hover:bg-slate-800 text-[#1E1E1E]/80 dark:text-slate-300";
    const ACTIVE_FILTER_CLASS = "px-3.5 py-1.5 bg-[#6B4226] text-white dark:bg-[#FBBF24] dark:text-neutral-950 border border-[#6B4226] dark:border-[#FBBF24] rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all shadow-xs";

    const allActive = (activeCategory === 'all');
    const allBtnClass = allActive ? ACTIVE_FILTER_CLASS : INACTIVE_FILTER_CLASS;

    const allBtn = `<button class="${allBtnClass} animate-item-reveal shrink-0" data-cat="all">All Niches</button>`;

    const catCounts = {};
    allBooks.forEach(b => {
      catCounts[b.category] = (catCounts[b.category] || 0) + 1;
    });

    const catBtns = NICHE_CATEGORIES.map((cat) => {
      const count = catCounts[cat.id] || 0;
      if (count === 0 && cat.id !== 'philosophy' && cat.id !== 'spirituality') return ''; 
      const isActive = (activeCategory === cat.id);
      const btnClass = isActive ? ACTIVE_FILTER_CLASS : INACTIVE_FILTER_CLASS;
      return `<button class="${btnClass} animate-item-reveal shrink-0" data-cat="${cat.id}">${cat.icon} ${cat.title}</button>`;
    }).join('');

    container.innerHTML = allBtn + catBtns;

    container.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        container.querySelectorAll('button').forEach((b) => {
          b.className = INACTIVE_FILTER_CLASS;
        });
        btn.className = ACTIVE_FILTER_CLASS;
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        renderLibraryGrid();
      });
    });
  }

  function renderCategorySidebar() {
    // Replaced in Apple Books Redesign Specs
  }

  function setupDatabaseFilters() {
    const segmentBtns = document.querySelectorAll('.lib-segment-btn');
    segmentBtns.forEach((btn) => {
      btn.onclick = () => {
        activeSegment = btn.dataset.filter;
        segmentBtns.forEach(b => {
          b.className = "lib-segment-btn px-4 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-all duration-200 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-slate-800";
        });
        btn.className = "lib-segment-btn px-4 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-all duration-200 bg-[#6B4226] text-white dark:bg-[#FBBF24] dark:text-neutral-950";
        renderLibraryGrid();
      };
    });

    const langBtns = document.querySelectorAll('.lib-lang-btn');
    langBtns.forEach((btn) => {
      btn.onclick = () => {
        activeLanguage = btn.dataset.lang;
        langBtns.forEach(b => {
          b.className = "lib-lang-btn px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-slate-800";
        });
        btn.className = "lib-lang-btn px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer bg-[#6B4226]/10 text-[#6B4226] dark:bg-[#FBBF24]/15 dark:text-[#FBBF24]";
        renderLibraryGrid();
      };
    });

    const thinkerCards = document.querySelectorAll('.thinker-card-clickable');
    thinkerCards.forEach((card) => {
      card.onclick = () => {
        const searchTerm = card.dataset.searchTerm;
        const searchInput = document.getElementById('library-search');
        if (searchInput) {
          searchInput.value = searchTerm;
          searchQuery = searchTerm;
        }
        
        activeCategory = 'all';
        renderCategoryFilters();
        renderLibraryGrid();

        const gridEl = document.getElementById('library-grid');
        if (gridEl) {
          gridEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (window.showTemporaryToast) window.showTemporaryToast(`Filtering records for ${searchTerm}...`);
      };
    });
  }

  function setupLibraryHeroPanel() {
    const profileName = localStorage.getItem('LuminaProfileName') || 'Julian Thorne';
    const hour = new Date().getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';

    const greetingEl = document.getElementById('lib-hero-greeting');
    if (greetingEl) greetingEl.textContent = `${greeting}, ${profileName.split(' ')[0]}`;

    const lastRead = getLastRead();
    const continueBook = lastRead
      ? allBooks.find(b => bookId(b) === lastRead.bookId) || allBooks[0]
      : allBooks[0];

    if (continueBook) {
      const progress = lastRead?.progress || getProgress(continueBook) || 15;
      const titleEl = document.getElementById('lib-hero-book-title');
      const progressPercEl = document.getElementById('lib-hero-percent');
      const textProgEl = document.getElementById('lib-hero-book-progress');
      const barEl = document.getElementById('lib-hero-bar');
      const contBtn = document.getElementById('lib-hero-continue-btn');

      if (titleEl) titleEl.textContent = continueBook.name;
      if (progressPercEl) progressPercEl.textContent = `${progress}%`;
      if (textProgEl) {
        const pagesLeft = Math.ceil((100 - progress) * 0.15 + 1);
        textProgEl.textContent = `${pagesLeft} Minutes Remaining`;
      }
      if (barEl) barEl.style.width = `${progress}%`;
      if (contBtn) {
        contBtn.onclick = () => window.LuminaLibrary.openBook(continueBook, lastRead?.pdfIndex || 0);
      }
    } else {
      const card = document.getElementById('lib-hero-progress-card');
      if (card) card.classList.add('hidden');
    }

    const timelineBtn = document.getElementById('resume-timeline-library-btn');
    if (timelineBtn) {
      timelineBtn.onclick = () => {
        window.LuminaApp?.showView('wisdom');
        if (window.showTemporaryToast) window.showTemporaryToast("Opening history journey timeline...");
      };
    }
  }

  function setupLibraryTodayQuote() {
    const quoteIndex = new Date().getDate() % VEDAS_QUOTES.length;
    const quote = VEDAS_QUOTES[quoteIndex];
    const quoteEl = document.getElementById('lib-today-quote');
    const authorEl = document.getElementById('lib-today-author');
    if (quoteEl && quote) quoteEl.textContent = quote.text;
    if (authorEl && quote) authorEl.textContent = `— ${quote.author}`;
  }

  function setupSearchDropdown() {
    const input = document.getElementById('library-search');
    const dropdown = document.getElementById('search-suggestions-dropdown');
    
    if (!input || !dropdown) return;

    input.addEventListener('focus', () => {
      dropdown.classList.remove('hidden');
      setTimeout(() => {
        dropdown.classList.remove('opacity-0', 'translate-y-2');
        dropdown.classList.add('opacity-100', 'translate-y-0');
      }, 50);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('opacity-100', 'translate-y-0');
        dropdown.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => dropdown.classList.add('hidden'), 300);
      }
    });

    dropdown.querySelectorAll('.suggested-tag-btn').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const term = btn.dataset.searchTerm;
        input.value = term;
        searchQuery = term;
        renderLibraryGrid();
        
        dropdown.classList.remove('opacity-100', 'translate-y-0');
        dropdown.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => dropdown.classList.add('hidden'), 300);

        const gridEl = document.getElementById('library-grid');
        if (gridEl) {
          gridEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    });
  }

  function setupRecommendedScroll() {
    const track = document.getElementById('library-recommendations');
    const btnLeft = document.getElementById('scroll-rec-left');
    const btnRight = document.getElementById('scroll-rec-right');
    if (!track) return;

    if (btnLeft) {
      btnLeft.onclick = () => {
        track.scrollBy({ left: -240, behavior: 'smooth' });
      };
    }
    if (btnRight) {
      btnRight.onclick = () => {
        track.scrollBy({ left: 240, behavior: 'smooth' });
      };
    }
  }

  function renderHome() {
    const lastRead = getLastRead();
    const featured = [
      allBooks.find((b) => b.name === 'Bhagavad Geeta'),
      allBooks.find((b) => b.name === 'Meditations'),
      allBooks.find((b) => b.name === 'The Art of War'),
      allBooks.find((b) => b.name === 'As a Man Thinketh'),
    ].filter(Boolean);

    const continueBook = lastRead
      ? allBooks.find((b) => bookId(b) === lastRead.bookId) || featured[0]
      : featured[0];

    if (continueBook) {
      const progress = lastRead?.progress || getProgress(continueBook) || 12;
      const coverEl = document.getElementById('home-continue-cover');
      const titleEl = document.getElementById('home-continue-title');
      const subEl = document.getElementById('home-continue-sub');
      const progEl = document.getElementById('home-continue-progress');
      const resumeBtn = document.getElementById('home-resume-btn');

      if (coverEl) {
        coverEl.className = `relative group w-32 md:w-36 flex-shrink-0 cursor-pointer rounded-xl shadow-md border border-neutral-500/10 aspect-[2/3] overflow-hidden`;
        coverEl.setAttribute('data-book-id', bookId(continueBook));
        coverEl.innerHTML = renderBookCoverMarkup(continueBook);
        coverEl.onclick = () => window.LuminaApp?.openBook(continueBook);
      }
      if (titleEl) titleEl.textContent = continueBook.name;
      if (subEl) subEl.textContent = `${continueBook.lang} · ${continueBook.categoryTitle || 'Niche'}`;
      if (progEl) {
        progEl.textContent = `${progress}%`;
        const circle = document.getElementById('home-progress-circle');
        if (circle) {
          const offset = 125.6 - (125.6 * progress / 100);
          circle.setAttribute('stroke-dashoffset', offset);
        }
      }
      if (resumeBtn) resumeBtn.onclick = () => window.LuminaApp?.openBook(continueBook);
    }

    const statsBooks = document.getElementById('home-stat-books');
    if (statsBooks) statsBooks.textContent = `${allBooks.length}+`;

    const featuredEl = document.getElementById('home-featured');
    if (featuredEl) {
      featuredEl.innerHTML = featured.map((book) => {
        return `
          <div class="w-32 flex-shrink-0 space-y-1.5 cursor-pointer home-featured-book hover:-translate-y-1 hover:shadow-xs transition-all duration-300" data-book-id="${bookId(book)}">
            <div class="w-full aspect-[2/3] rounded-xl overflow-hidden">
              ${renderBookCoverMarkup(book)}
            </div>
            <p class="font-body-ui text-xs font-semibold truncate leading-tight mt-1 px-0.5">${book.name}</p>
            <p class="font-label-caps text-[9px] text-on-surface-variant truncate px-0.5">${book.author || book.lang}</p>
          </div>`;
      }).join('');

      featuredEl.querySelectorAll('.home-featured-book').forEach((el) => {
        el.addEventListener('click', () => {
          const book = allBooks.find((b) => bookId(b) === el.dataset.bookId);
          if (book) window.LuminaApp?.openBook(book);
        });
      });
    }

    const seeAll = document.getElementById('home-see-all');
    if (seeAll) seeAll.onclick = (e) => { e.preventDefault(); window.LuminaApp?.showView('library'); };

    updateGitaQuoteUI();
    updateVedasQuoteUI();
    startQuoteTimers();

    const gitaRefreshBtn = document.getElementById('gita-quote-refresh');
    if (gitaRefreshBtn) {
      gitaRefreshBtn.onclick = (e) => {
        e.stopPropagation();
        currentGitaQuoteIndex = (currentGitaQuoteIndex + 1) % GITA_QUOTES.length;
        updateGitaQuoteUI();
        startQuoteTimers();
        if (window.showTemporaryToast) window.showTemporaryToast("Rotating Bhagavad Gita wisdom...");
      };
    }
    const gitaFavBtn = document.getElementById('gita-quote-fav');
    if (gitaFavBtn) {
      gitaFavBtn.onclick = (e) => {
        e.stopPropagation();
        const activeQuote = GITA_QUOTES[currentGitaQuoteIndex];
        if (window.showTemporaryToast) {
          window.showTemporaryToast(`Saved to favorite wisdom: ${activeQuote.author}!`);
        }
      };
    }
    const gitaShareBtn = document.getElementById('gita-quote-share');
    if (gitaShareBtn) {
      gitaShareBtn.onclick = (e) => {
        e.stopPropagation();
        const activeQuote = GITA_QUOTES[currentGitaQuoteIndex];
        const textToCopy = `${activeQuote.text} — ${activeQuote.author}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (window.showTemporaryToast) window.showTemporaryToast("Wisdom copied to clipboard!");
        }).catch(() => {
          if (window.showTemporaryToast) window.showTemporaryToast("Unable to copy wisdom card.");
        });
      };
    }

    const vedasRefreshBtn = document.getElementById('vedas-quote-refresh');
    if (vedasRefreshBtn) {
      vedasRefreshBtn.onclick = (e) => {
        e.stopPropagation();
        currentVedasQuoteIndex = (currentVedasQuoteIndex + 1) % VEDAS_QUOTES.length;
        updateVedasQuoteUI();
        startQuoteTimers();
        const nextVedaName = VEDAS_QUOTES[currentVedasQuoteIndex].veda;
        if (window.showTemporaryToast) window.showTemporaryToast(`Querying ${nextVedaName} verses...`);
      };
    }
    const vedasFavBtn = document.getElementById('vedas-quote-fav');
    if (vedasFavBtn) {
      vedasFavBtn.onclick = (e) => {
        e.stopPropagation();
        const activeQuote = VEDAS_QUOTES[currentVedasQuoteIndex];
        if (window.showTemporaryToast) {
          window.showTemporaryToast(`Saved to favorite wisdom: ${activeQuote.author}!`);
        }
      };
    }
    const vedasShareBtn = document.getElementById('vedas-quote-share');
    if (vedasShareBtn) {
      vedasShareBtn.onclick = (e) => {
        e.stopPropagation();
        const activeQuote = VEDAS_QUOTES[currentVedasQuoteIndex];
        const textToCopy = `${activeQuote.text} — ${activeQuote.author}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (window.showTemporaryToast) window.showTemporaryToast("Vedic quote copied to clipboard!");
        }).catch(() => {
          if (window.showTemporaryToast) window.showTemporaryToast("Unable to copy Vedic wisdom.");
        });
      };
    }

    lazyLoadCoversForVisibleCards();
  }

  function setupSearch() {
    const input = document.getElementById('library-search');
    const homeSearch = document.getElementById('home-search') || document.getElementById('home-global-search');
    const handler = (e) => {
      searchQuery = e.target.value;
      renderLibraryGrid();
    };
    if (input) input.addEventListener('input', handler);
    if (homeSearch) {
      const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
          searchQuery = e.target.value;
          window.LuminaApp?.showView('library');
          const libSearch = document.getElementById('library-search');
          if (libSearch) libSearch.value = searchQuery;
          renderLibraryGrid();
        }
      };
      homeSearch.addEventListener('keydown', handleKeyPress);
      homeSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        const libSearch = document.getElementById('library-search');
        if (libSearch) libSearch.value = searchQuery;
      });
    }

    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        if (input) input.value = '';
        if (homeSearch) homeSearch.value = '';
        renderLibraryGrid();
      });
    }
  }

  // Set up Add Book Trigger and Form Actions
  function setupAddBookModal() {
    const addBtn = document.getElementById('add-book-btn');
    const modal = document.getElementById('add-book-modal');
    const closeBtn = document.getElementById('add-book-close');
    const form = document.getElementById('add-book-form');
    
    // Stages & layout
    const stageLauncher = document.getElementById('import-stage-launcher');
    const stageProcessing = document.getElementById('import-stage-processing');
    const stagePreview = document.getElementById('import-stage-preview');
    
    const dragZone = document.getElementById('upload-drag-zone');
    const fileInput = document.getElementById('add-book-file-input');
    const statusCard = document.getElementById('upload-status-card');
    const fileNameEl = document.getElementById('upload-file-name');
    const fileSizeEl = document.getElementById('upload-file-size');
    const removeFileBtn = document.getElementById('upload-file-remove');
    const urlInput = document.getElementById('add-book-url');
    const importUrlBtn = document.getElementById('import-url-btn');
    
    // Interactive Cover Display Elements
    const previewCoverImg = document.getElementById('preview-book-cover-img');
    const previewReadingTimeIndicator = document.getElementById('preview-reading-time-indicator');
    const previewBookBg = document.getElementById('preview-book-bg');
    const previewBookLangBadge = document.getElementById('preview-book-lang-badge');
    const previewBookTitleOverlay = document.getElementById('preview-book-title-overlay');
    const previewBookAuthorOverlay = document.getElementById('preview-book-author-overlay');
    const previewCategoryBadge = document.getElementById('preview-category-badge');
    const previewBookDeva = document.getElementById('preview-book-deva');
    const errorBanner = document.getElementById('preview-error-banner');
    
    // Editable inputs
    const titleInput = document.getElementById('add-book-title');
    const authorInput = document.getElementById('add-book-author');
    const langInput = document.getElementById('add-book-lang');
    const categorySelect = document.getElementById('add-book-category');
    const devaInput = document.getElementById('add-book-deva');
    const readingTimeInput = document.getElementById('add-book-reading-time');
    const descInput = document.getElementById('add-book-description');
    
    // Action Buttons
    const previewBackBtn = document.getElementById('preview-back-btn');
    const regenerateArtBtn = document.getElementById('regenerate-art-btn');
    const submitBtn = document.getElementById('add-book-submit-btn');

    let importMode = 'file'; // 'file' or 'url'
    let currentExtractedMetadata = null;
    let generatedCoverBase64 = "";

    if (!modal) return;

    const catergoyColorMap = {
      philosophy: 'from-[#2d3a3a] to-[#1a2222]',
      psychology: 'from-[#3e2a47] to-[#25192b]',
      business: 'from-[#1b3d2f] to-[#0f241c]',
      finance: 'from-[#2c3d30] to-[#162119]',
      technology: 'from-[#141b29] to-[#0b0f17]',
      self_growth: 'from-[#523e2b] to-[#302419]',
      history: 'from-[#473b2a] to-[#292218]',
      science: 'from-[#1e2e47] to-[#0f1826]',
      health: 'from-[#263e2c] to-[#152419]',
      creativity: 'from-[#5c2a38] to-[#361820]',
      career: 'from-[#223947] to-[#121f26]',
      literature: 'from-[#422222] to-[#241313]',
      biography: 'from-[#3b3a3c] to-[#201f21]',
      spirituality: 'from-[#613c1c] to-[#38210e]',
      exam_prep: 'from-[#1b2c4c] to-[#0e172a]'
    };

    function updateCoverColorByCat(category) {
      if (!previewBookBg) return;
      const gradient = catergoyColorMap[category] || 'from-[#1e293b] to-[#0f172a]';
      previewBookBg.className = `absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col justify-between p-4 z-0 text-white`;
    }

    // Toggle Modal
    if (addBtn) {
      addBtn.onclick = () => {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
        showStage('launcher');
      };
    }

    function hideModal() {
      modal.classList.add('opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
        resetForm();
      }, 300);
    }

    if (closeBtn) closeBtn.onclick = hideModal;

    // Transition stages simply
    function showStage(stage) {
      if (stage === 'launcher') {
        stageLauncher.classList.remove('hidden');
        stageProcessing.classList.add('hidden');
        stagePreview.classList.add('hidden');
      } else if (stage === 'processing') {
        stageLauncher.classList.add('hidden');
        stageProcessing.classList.remove('hidden');
        stagePreview.classList.add('hidden');
      } else if (stage === 'preview') {
        stageLauncher.classList.add('hidden');
        stageProcessing.classList.add('hidden');
        stagePreview.classList.remove('hidden');
      }
    }

    function setTimelineStep(stepId, status) {
      const stepEl = document.getElementById(`pstep-${stepId}`);
      if (!stepEl) return;
      const iconDiv = stepEl.querySelector('.pstep-icon');
      const labelSpan = stepEl.querySelector('.pstep-label');
      
      if (status === 'pending') {
        stepEl.classList.add('opacity-50');
        iconDiv.className = 'pstep-icon w-6 h-6 rounded-full border border-outline-variant/35 flex items-center justify-center flex-shrink-0 text-on-surface-variant text-[11px] bg-transparent';
        iconDiv.innerHTML = '<i class="lucide-icon text-[14px]" data-lucide="circle"></i>';
      } else if (status === 'active') {
        stepEl.classList.remove('opacity-50');
        iconDiv.className = 'pstep-icon w-6 h-6 rounded-full border border-primary/50 flex items-center justify-center flex-shrink-0 text-[#6B4226] dark:text-amber-300 animate-pulse bg-primary/5 text-[11px]';
        iconDiv.innerHTML = '<i class="lucide-icon text-[14.5px] animate-spin" data-lucide="refresh-ccw"></i>';
      } else if (status === 'done') {
        stepEl.classList.remove('opacity-50');
        iconDiv.className = 'pstep-icon w-6 h-6 rounded-full bg-green-600 dark:bg-green-700 border border-transparent text-white flex items-center justify-center flex-shrink-0 scale-105 transition-all duration-300 text-[11px]';
        iconDiv.innerHTML = '<i class="lucide-icon text-[14px] font-bold" data-lucide="check"></i>';
        if (labelSpan) labelSpan.classList.add('text-green-700', 'dark:text-green-300', 'font-semibold');
      } else if (status === 'error') {
        stepEl.classList.remove('opacity-50');
        iconDiv.className = 'pstep-icon w-6 h-6 rounded-full bg-rose-600 border border-transparent text-white flex items-center justify-center flex-shrink-0 text-[11px]';
        iconDiv.innerHTML = '<i class="lucide-icon text-[14px]" data-lucide="circle-x"></i>';
        if (labelSpan) labelSpan.classList.add('text-rose-600', 'dark:text-rose-400');
      }
    }

    function resetForm() {
      form.reset();
      selectedFileBlob = null;
      generatedCoverBase64 = "";
      currentExtractedMetadata = null;
      if (errorBanner) errorBanner.classList.add('hidden');
      if (previewCoverImg) {
        previewCoverImg.src = "";
        previewCoverImg.classList.add('hidden');
      }
      if (fileInput) fileInput.value = '';
      if (urlInput) urlInput.value = '';
    }

    // Drag-and-Drop
    if (dragZone && fileInput) {
      dragZone.onclick = () => fileInput.click();

      dragZone.ondragover = (e) => {
        e.preventDefault();
        dragZone.classList.add('border-[#6B4226]', 'bg-[#6B4226]/5');
      };

      dragZone.ondragleave = (e) => {
        e.preventDefault();
        dragZone.classList.remove('border-[#6B4226]', 'bg-[#6B4226]/5');
      };

      dragZone.ondrop = (e) => {
        e.preventDefault();
        dragZone.classList.remove('border-[#6B4226]', 'bg-[#6B4226]/5');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const extension = files[0].name.split('.').pop().toLowerCase();
          if (['pdf', 'epub', 'txt'].includes(extension)) {
            selectedFileBlob = files[0];
            importMode = 'file';
            triggerAIExtractionFlow(files[0]);
          } else {
            alert('Lumina only supports premium PDF, EPUB, and Plain TXT documents.');
          }
        }
      };

      fileInput.onchange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
          selectedFileBlob = files[0];
          importMode = 'file';
          triggerAIExtractionFlow(files[0]);
        }
      };
    }

    // URL Import clicking
    if (importUrlBtn && urlInput) {
      importUrlBtn.onclick = () => {
        const url = urlInput.value.trim();
        if (!url) {
          alert('Please enter a valid remote book URL');
          return;
        }
        importMode = 'url';
        triggerAIExtractionFlow(url, true);
      };
    }

    // Main AI Engine Processing Timeline Orchestrator
    async function triggerAIExtractionFlow(source, isUrl = false) {
      showStage('processing');

      // Initialize timelines to pending/active state
      setTimelineStep('read', 'active');
      setTimelineStep('meta', 'pending');
      setTimelineStep('desc', 'pending');
      setTimelineStep('cover', 'pending');

      const filename = isUrl ? source.split('/').pop() : source.name;
      let textSegment = "";

      try {
        // --- STEP 1: PARSE AND DECODE TEXT ---
        if (isUrl) {
          // Bypassing CORS blocks via the sever-side API proxy
          const response = await fetch('/api/fetch-url', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ url: source })
          });

          if (!response.ok) {
            throw new Error(`Cloud proxy fetch failed (${response.status})`);
          }

          const serverData = await response.json();
          if (serverData.isPdf || source.toLowerCase().endsWith('.pdf')) {
            // PDF detected remotely. Load via our cors proxy through client-side pdfjsLib
            const proxiedPdfUrl = `/api/proxy-pdf?url=${encodeURIComponent(source)}`;
            const loadingTask = pdfjsLib.getDocument(proxiedPdfUrl);
            const pdf = await loadingTask.promise;
            textSegment = await extractFirstPagesOfPdfObj(pdf);
          } else {
            textSegment = serverData.text || "";
          }
        } else {
          // Local File processing
          const valLower = source.name.toLowerCase();
          if (valLower.endsWith('.pdf')) {
            const arrayBuffer = await source.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            textSegment = await extractFirstPagesOfPdfObj(pdf);
          } else if (valLower.endsWith('.txt')) {
            textSegment = await readLocalTxtFile(source);
          } else if (valLower.endsWith('.epub')) {
            // Read binary bytes chunks as plain text for quick signature detection
            textSegment = await readLocalTxtFile(source, 40000);
          }
        }

        // Complete reading step
        if (!textSegment) {
          textSegment = `Filename reference title: ${filename}`;
        }
        setTimelineStep('read', 'done');
        setTimelineStep('meta', 'active');

        // --- STEP 2: SECURELY EXTRACT METADATA ALONGSIDE GEMINI ---
        const metaRes = await fetch('/api/extract-metadata', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ text: textSegment, filename })
        });

        if (!metaRes.ok) {
          const errObj = await metaRes.json();
          throw new Error(errObj.error || 'Gemini metadata analysis service encountered an error.');
        }

        const metadata = await metaRes.json();
        currentExtractedMetadata = metadata;
        setTimelineStep('meta', 'done');
        setTimelineStep('desc', 'done');
        setTimelineStep('cover', 'active');

        // --- STEP 3: DESIGN COVER ART WITH IA IMAGERY ---
        let base64Cover = "";
        try {
          const coverRes = await fetch('/api/generate-cover', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              title: metadata.title,
              author: metadata.author,
              category: metadata.category,
              description: metadata.description
            })
          });

          if (coverRes.ok) {
            const coverData = await coverRes.json();
            base64Cover = coverData.imageUrl || "";
          }
        } catch (imgErr) {
          console.error("AI Cover generation failed: ", imgErr);
        }

        generatedCoverBase64 = base64Cover;
        setTimelineStep('cover', 'done');

        // Delay slightly for dramatic transition
        setTimeout(() => {
          showStage('preview');
          populatePreviewPage(metadata, base64Cover, filename, source);
        }, 500);

      } catch (err) {
        console.error("Lumina AI processing sequence interrupted: ", err);
        alert(`AI Import Interrupt: ${err.message}. Showing fields anyway so you can input details.`);
        // Fallback to manual entry modal
        showStage('preview');
        const fallbackMeta = {
          title: filename.replace(/\.[^/.]+$/, "").replace(/_|-/g, ' '),
          author: "Unknown",
          language: "English",
          category: "philosophy",
          description: "No description generated due to service interrupt.",
          readingTime: "5 hrs"
        };
        populatePreviewPage(fallbackMeta, "", filename, source);
        if (errorBanner) {
          errorBanner.textContent = `Offline Mode: AI server could not auto-resolve metadata (${err.message}). You can enter details manually.`;
          errorBanner.classList.remove('hidden');
        }
      }
    }

    async function extractFirstPagesOfPdfObj(pdf) {
      let fullText = "";
      const limit = Math.min(pdf.numPages, 4);
      for (let i = 1; i <= limit; i++) {
        try {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pText = content.items.map(item => item.str).join(" ");
          fullText += `\n ${pText}`;
        } catch (e) {
          console.warn("Could not extract page " + i, e);
        }
      }
      return fullText.trim();
    }

    async function readLocalTxtFile(file, byteLength = 30000) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result || "");
        reader.onerror = () => resolve("");
        reader.readAsText(file.slice(0, byteLength));
      });
    }

    // Populate elements of Stage 3
    function populatePreviewPage(meta, b64Image, filename, originalSource) {
      // 1. Text Inputs
      titleInput.value = meta.title || "";
      authorInput.value = meta.author || "";
      langInput.value = meta.language || "English";
      categorySelect.value = meta.category || "philosophy";
      devaInput.value = meta.nativeTitle || "";
      readingTimeInput.value = meta.readingTime || "6 hrs";
      descInput.value = meta.description || "";

      // 2. Book Cover Mockup
      previewBookTitleOverlay.textContent = meta.title || "Untitled Book";
      previewBookAuthorOverlay.textContent = meta.author || "Unknown Author";
      previewBookDeva.textContent = meta.nativeTitle || "";
      previewBookLangBadge.textContent = (meta.language || "EN").slice(0, 2).toUpperCase();
      previewCategoryBadge.textContent = (meta.category || "philosophy").toUpperCase();
      updateCoverColorByCat(meta.category || "philosophy");

      if (b64Image) {
        previewCoverImg.src = b64Image;
        previewCoverImg.classList.remove('hidden');
      } else {
        previewCoverImg.src = "";
        previewCoverImg.classList.add('hidden');
      }

      // Indicator badges
      previewReadingTimeIndicator.textContent = meta.readingTime || "5 hrs";

      // 3. File Card Info
      const nameEl = document.getElementById('upload-file-name');
      const sizeEl = document.getElementById('upload-file-size');
      const formatIndicator = document.getElementById('file-format-indicator');

      if (nameEl) nameEl.textContent = filename;
      if (sizeEl) {
        if (importMode === 'file' && originalSource) {
          sizeEl.textContent = `${(originalSource.size / (1024 * 1024)).toFixed(2)} MB`;
        } else {
          sizeEl.textContent = "Remote Stream";
        }
      }

      if (formatIndicator) {
        const ext = filename.split('.').pop().toLowerCase();
        if (ext === 'pdf') formatIndicator.textContent = 'picture_as_pdf';
        else if (ext === 'epub') formatIndicator.textContent = 'book';
        else formatIndicator.textContent = 'description';
      }
    }

    // Real-time double data binding for visual physical mockup
    titleInput.addEventListener('input', () => {
      previewBookTitleOverlay.textContent = titleInput.value || "Untitled Book";
    });
    authorInput.addEventListener('input', () => {
      previewBookAuthorOverlay.textContent = authorInput.value || "Unknown Author";
    });
    devaInput.addEventListener('input', () => {
      previewBookDeva.textContent = devaInput.value || "";
    });
    langInput.addEventListener('input', () => {
      previewBookLangBadge.textContent = (langInput.value || "EN").slice(0, 2).toUpperCase();
    });
    categorySelect.addEventListener('change', () => {
      previewCategoryBadge.textContent = categorySelect.value.toUpperCase();
      updateCoverColorByCat(categorySelect.value);
    });
    readingTimeInput.addEventListener('input', () => {
      previewReadingTimeIndicator.textContent = readingTimeInput.value || "5 hrs";
    });

    // Reset back
    if (previewBackBtn) {
      previewBackBtn.onclick = () => {
        resetForm();
        showStage('launcher');
      };
    }

    // Recreate AI cover artwork on the fly
    if (regenerateArtBtn) {
      regenerateArtBtn.onclick = async () => {
        regenerateArtBtn.disabled = true;
        regenerateArtBtn.innerHTML = '<i class="lucide-icon text-[14px] animate-spin" data-lucide="refresh-ccw"></i> Designing Cover...';
        try {
          const res = await fetch('/api/generate-cover', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              title: titleInput.value,
              author: authorInput.value,
              category: categorySelect.value,
              description: descInput.value
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.imageUrl) {
              generatedCoverBase64 = data.imageUrl;
              previewCoverImg.src = data.imageUrl;
              previewCoverImg.classList.remove('opacity-0', 'hidden');
              previewCoverImg.classList.add('opacity-100');
            }
          } else {
            alert('Images API returned error. Try changing category theme.');
          }
        } catch (e) {
          alert('Could not generate visual: ' + e.message);
        } finally {
          regenerateArtBtn.disabled = false;
          regenerateArtBtn.innerHTML = '<i class="lucide-icon text-[14px]" data-lucide="palette"></i> Recreate AI Artwork';
        }
      };
    }

    // Remove current uploaded file
    if (removeFileBtn) {
      removeFileBtn.onclick = (e) => {
        e.stopPropagation();
        resetForm();
        showStage('launcher');
      };
    }

    // Final Insertion into DB
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const lang = langInput.value.trim();
        const category = categorySelect.value;
        const deva = devaInput.value.trim();
        const readingTimeValue = readingTimeInput.value.trim();
        const descriptionValue = descInput.value.trim();

        if (!title || !author) {
          alert('Please enter Book Title and Author / Sage name.');
          return;
        }

        const bookIdGenerated = 'custom_' + Date.now();
        const pdfsList = [];

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'COMPILING SPECIFICATIONS...';
        }

        try {
          if (importMode === 'file') {
            if (!selectedFileBlob) {
              alert('Please select or drag a valid file compilation.');
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ADD TO WISDOM LIBRARY';
              }
              return;
            }
            const extension = selectedFileBlob.name.split('.').pop().toLowerCase();
            const fileIdGenerated = `file_${Date.now()}.${extension}`;
            
            if (window.LuminaDB) {
              await window.LuminaDB.saveFile(fileIdGenerated, selectedFileBlob);
            }
            pdfsList.push({
              url: '',
              label: '📄 Saved Reader Document',
              fileId: fileIdGenerated
            });
          } else {
            const urlValue = urlInput.value.trim();
            if (!urlValue) {
              alert('Please provide a remote url link.');
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ADD TO WISDOM LIBRARY';
              }
              return;
            }
            pdfsList.push({
              url: urlValue,
              label: '📄 Read URL Source'
            });
          }

          const bookObject = {
            id: bookIdGenerated,
            name: title,
            author: author,
            lang: lang,
            category: category,
            deva: deva,
            readingTime: readingTimeValue,
            synopsis: descriptionValue,
            description: descriptionValue,
            cover: generatedCoverBase64, // Real base64 cover generated by AI or empty
            pdfs: pdfsList,
            createdAt: Date.now()
          };

          if (window.LuminaDB) {
            await window.LuminaDB.saveBook(bookObject);
          }

          // Complete addition
          allBooks.push({
            ...bookObject,
            categoryTitle: NICHE_CATEGORIES.find(c => c.id === category)?.title || category
          });

          // Standard UI complete callouts
          setTimeout(() => {
            hideModal();
            renderCategoryFilters();
            renderCategorySidebar();
            renderLibraryGrid();
            renderHome();
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'ADD TO WISDOM LIBRARY';
            }
            
            // Automatically open newly imported book immediately in full screen reader
            try {
              const newlyAddedBook = allBooks[allBooks.length - 1];
              if (newlyAddedBook) {
                openBookInReader(newlyAddedBook, 0);
              }
            } catch (openErr) {
              console.error("Auto opening failed", openErr);
            }
          }, 300);

        } catch (err) {
          console.error("Local database compilation error:", err);
          alert('Local IndexedDB packs could not be stored: ' + err.message);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ADD TO WISDOM LIBRARY';
          }
        }
      };
    }
  }

  function openBookInReader(book, pdfIndex) {
    setLastRead(book, pdfIndex);
    const progress = getProgress(book);
    if (progress < 15) setProgress(book, 15);

    if (window.LuminaApp) window.LuminaApp.openBookReader(book, pdfIndex);
  }

  window.LuminaLibrary = {
    async init() {
      await initData();
      renderCategoryFilters();
      renderLibraryGrid();
      renderHome();
      renderRecommendations();
      renderCollections();
      renderRecentlyAdded();
      setupDatabaseFilters();
      setupLibraryHeroPanel();
      setupLibraryTodayQuote();
      setupSearchDropdown();
      setupRecommendedScroll();
      setupSearch();
      setupAddBookModal();
    },
    openBook(book, pdfIndex) {
      const bid = bookId(book);
      window.location.hash = `/reader/${bid}`;
    },
    getAllBooks: () => allBooks,
    getBookById: (id) => allBooks.find((b) => bookId(b) === id),
    bookId,
    decodeHtml,
    renderBookCoverMarkup,
  };
})();
