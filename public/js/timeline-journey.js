/**
 * "The Journey of Human Consciousness" - Premium Interactive Documental Timeline
 * Chronology of 300,000 BCE to Future AI Epoch (2030+) for Nalanda Wisdom App
 */

(function () {
  'use strict';

  // 1. Raw Timeline Database containing all 70+ requested historical milestones
  const TIMELINE_EVENTS = [
    // --- ERA 1: Before Writing (~300,000 BCE to ~12,000 BCE) ---
    { id: 1, era: "Before Writing", year: "~300,000 BCE", title: "Homo Sapiens Appear", icon: "🧍", summary: "Anatomically modern humans emerge in Africa, sparking the first glimmer of reflective consciousness on the planet.", tags: ["civilization", "science"] },
    { id: 2, era: "Before Writing", year: "~100,000 BCE", title: "Controlled Fire Expands", icon: `<i class="lucide-icon text-sm" data-lucide="flame"></i>`, summary: "The taming of fire provides warmth, nocturnal safety, cooked nutrients, and a center point for tribal social gather.", tags: ["civilization", "technology"] },
    { id: 3, era: "Before Writing", year: "~70,000 BCE", title: "Cognitive Revolution", icon: `<i class="lucide-icon text-sm" data-lucide="brain"></i>`, summary: "Emergence of abstract language, symbolic imagining, and mythology. Humans begin sharing stories and fictional entities.", tags: ["civilization", "religion", "spirituality"] },
    { id: 4, era: "Before Writing", year: "~12,000 BCE", title: "Agricultural Revolution", icon: "🌾", summary: "Transition from hunter-gatherers to settled farming. Domestication of wheat and animals structures permanent settlements.", tags: ["civilization", "technology"] },

    // --- ERA 2: First Civilizations (~3500 BCE to ~2000 BCE) ---
    { id: 5, era: "First Civilizations", year: "~3500 BCE", title: "First Recorded Writing", icon: "✍", summary: "Cuneiform script develops in Sumer (Mesopotamia). Human memory becomes externalized, permanent, and transmissible.", tags: ["civilization", "technology"] },
    { id: 6, era: "First Civilizations", year: "~3100 BCE", title: "Ancient Egyptian Kingdom", icon: "🏺", summary: "Pharaoh Narmer unites Upper and Lower Egypt. A monumental solar bureaucracy starts linking cosmology to state stewardship.", tags: ["civilization", "religion"] },
    { id: 7, era: "First Civilizations", year: "~2600 BCE", title: "Indus Valley Civilization", icon: "🌊", summary: "Harappa and Mohenjo-Daro flourish in northwest India, demonstrating urban planning, sanitation, and early yogic postures.", tags: ["civilization", "india", "technology"] },
    { id: 8, era: "First Civilizations", year: "~2000 BCE", title: "Early Chinese Dynasties", icon: "🏯", summary: "Yellow River agrarian groups group under absolute rule, laying early foundation lines of ancestral rites and astronomy.", tags: ["civilization", "china"] },

    // --- ERA 3: Ancient Wisdom Age (~1500 BCE to ~300 BCE) ---
    { id: 9, era: "Ancient Wisdom Age", year: "~1500 BCE", title: "The Sacred Vedas", icon: `<i class="lucide-icon text-sm" data-lucide="activity"></i>`, summary: "Sanskrit oral liturgies (Rigveda) composed by cosmic seers (Rishis). Sound vibrations are treated as the code of reality.", tags: ["spirituality", "religion", "india"] },
    { id: 10, era: "Ancient Wisdom Age", year: "~1200 BCE", title: "Mahabharata Traditions", icon: "⚔", summary: "Epic royal friction triggers massive ethical, social, and martial dharmic guidelines, concluding in Gita's core yoga formulas.", tags: ["spirituality", "philosophy", "india"] },
    { id: 11, era: "Ancient Wisdom Age", year: "~1000 BCE", title: "The Ancient Upanishads", icon: `<i class="lucide-icon text-sm" data-lucide="sparkles"></i>`, summary: "Mystic dialogues exploring identity of standard individual soul (Atman) with absolute cosmic canvas (Brahman).", tags: ["spirituality", "philosophy", "india"] },
    { id: 12, era: "Ancient Wisdom Age", year: "~800 BCE", title: "Homer's Epics", icon: "📖", summary: "Composition of the Iliad & Odyssey. Outlines the tragic, heroic structure of Greek martial fate and individual pride.", tags: ["philosophy", "greece"] },
    { id: 13, era: "Ancient Wisdom Age", year: "~700 BCE", title: "The Path of Zoroaster", icon: "⚡", summary: "In ancient Persia, Zoroaster introduces cosmic dualism—painting reality as an active active struggle of Light versus Darkness.", tags: ["religion", "spirituality"] },
    { id: 14, era: "Ancient Wisdom Age", year: "~600 BCE", title: "Laozi Writes the Tao", icon: "☯", summary: "The legendary keeper of archives authors Tao Te Ching, urging humanity to return to direct, effortless flow (Wu Wei).", tags: ["philosophy", "spirituality", "china"] },
    { id: 15, era: "Ancient Wisdom Age", year: "~551 BCE", title: "Confucian Social Reform", icon: `<i class="lucide-icon text-sm" data-lucide="scroll-text"></i>`, summary: "Confucius designs structured models for social harmony, filial piety, rituals, and clean government in warring states.", tags: ["philosophy", "china"] },
    { id: 16, era: "Ancient Wisdom Age", year: "~599 BCE", title: "Tirthankara Mahavira", icon: "🕉", summary: "Re-establishes Jain philosophy, teaching extreme nonviolence (Ahimsa), absolute ascetic peace, and multiple truths.", tags: ["spirituality", "religion", "india"] },
    { id: 17, era: "Ancient Wisdom Age", year: "~563 BCE", title: "Gautama Buddha Shakyamuni", icon: `<i class="lucide-icon text-sm" data-lucide="flower"></i>`, summary: "Siddhartha Gautama achieves ultimate awakening under the Bodhi tree. Formulates the Middle Way and root of suffering.", tags: ["spirituality", "philosophy", "religion", "india"] },
    { id: 18, era: "Ancient Wisdom Age", year: "~500 BCE", title: "Sun Tzu's Art of War", icon: "⚔", summary: "Formulates a system of tactical thinking on conflict resolution, advocating victories through psychological mastery.", tags: ["philosophy", "china"] },
    { id: 19, era: "Ancient Wisdom Age", year: "~470 BCE", title: "Socrates' Market Dialogues", icon: `<i class="lucide-icon text-sm" data-lucide="landmark"></i>`, summary: "Launches Western dialectic logic in Athens. Demands logical self-examination: 'The unexamined life is not worth living.'", tags: ["philosophy", "greece"] },
    { id: 20, era: "Ancient Wisdom Age", year: "~428 BCE", title: "Plato Establishes Academy", icon: `<i class="lucide-icon text-sm" data-lucide="landmark"></i>`, summary: "Plato organizes the Western world's first formal institute, charting the world of absolute, perfect immaterial Forms.", tags: ["philosophy", "greece"] },
    { id: 21, era: "Ancient Wisdom Age", year: "~384 BCE", title: "Aristotle's Empirical Science", icon: `<i class="lucide-icon text-sm" data-lucide="landmark"></i>`, summary: "Launches categorical physics, formal logic, biology, and politics based on analytical observation of natural changes.", tags: ["philosophy", "science", "greece"] },
    { id: 22, era: "Ancient Wisdom Age", year: "~300 BCE", title: "Zeno & Stoicism Birth", icon: `<i class="lucide-icon text-sm" data-lucide="landmark"></i>`, summary: "Zeno of Citium starts lecturing on the Stoa Poikile, laying practical mental rules based on Dichotomy of Control.", tags: ["philosophy", "greece"] },
    { id: 23, era: "Ancient Wisdom Age", year: "~300 BCE", title: "Library of Alexandria", icon: "🎓", summary: "Establishment of human history's premier intellectual vault, cataloging global scrolls for universal study.", tags: ["civilization", "greece", "science"] },

    // --- ERA 4: Classical Age (~250 BCE to ~300 CE) ---
    { id: 24, era: "Classical Age", year: "~250 BCE", title: "Reign of Emperor Ashoka", icon: `<i class="lucide-icon text-sm" data-lucide="crown"></i>`, summary: "Emperor Ashoka renounces state violence after Kalinga War, carving pacifistic, Buddhist codes on massive stone pillars.", tags: ["civilization", "spirituality", "india"] },
    { id: 25, era: "Classical Age", year: "~200 BCE", title: "Taoism Expands", icon: "☯", summary: "Acupuncture, natural medicine, and mystical alchemy expand in China under institutionalized Taoist systems.", tags: ["spirituality", "china"] },
    { id: 26, era: "Classical Age", year: "~100 BCE", title: "Patanjali's Yoga Sutras", icon: "🧘", summary: "Structures the eightfold psychological ladder (Ashtanga Yoga) to dissolve mental friction and achieve quietude.", tags: ["spirituality", "india"] },
    { id: 27, era: "Classical Age", year: "~4 BCE", title: "Ministry of Jesus", icon: "✝", summary: "In Judea, Jesus preaches radical love, moral restoration, and personal communion with the divine father.", tags: ["spirituality", "religion"] },
    { id: 28, era: "Classical Age", year: "~100 CE", title: "Buddhist Silk Road Expansion", icon: "📚", summary: "Buddhism crosses high central Asian ranges to arrive in Han China, initiating massive translating networks.", tags: ["spirituality", "religion", "china", "india"] },
    { id: 29, era: "Classical Age", year: "~170 CE", title: "Marcus Aurelius Meditations", icon: `<i class="lucide-icon text-sm" data-lucide="crown"></i>`, summary: "Roman Emperor pens daily Stoic notes in wartime camps, strengthening his 'Inner Citadel' against grief and duty.", tags: ["philosophy", "greece", "modern"] },
    { id: 30, era: "Classical Age", year: "~200 CE", title: "Nagarjuna's Middle Way", icon: "📖", summary: "Formulates Madhyamaka school of emptiness (Sunyata), proving all things lack separate individual solid essence.", tags: ["philosophy", "spirituality", "india"] },
    { id: 31, era: "Classical Age", year: "~300 CE", title: "Christianity Spreads", icon: "⛪", summary: "Edict of Milan and Nicaea Councils institutionalize Christian faiths across the Roman Empire, unifying theological doctrine.", tags: ["religion", "civilization"] },

    // --- ERA 5: Medieval Wisdom (~400 CE to ~1225 CE) ---
    { id: 32, era: "Medieval Wisdom", year: "~400 CE", title: "Gupta India Golden Age", icon: "📚", summary: "Peak era of Sanskrit mathematics, metallurgy, and literature under state sponsorship. Aryabhata proposes rotating earth.", tags: ["civilization", "science", "india"] },
    { id: 33, era: "Medieval Wisdom", year: "~570 CE", title: "Prophet Muhammad's Ministry", icon: "☪", summary: "The rise of Islam. Promotes radical monotheism, social codes, and ecstatic alignment with Allah in Arabia.", tags: ["spirituality", "religion"] },
    { id: 34, era: "Medieval Wisdom", year: "~700 CE", title: "Islamic Golden Age Starts", icon: "🌙", summary: "Baghdad's House of Wisdom starts translating Greek and Vedic science, designing modern algebra and optics.", tags: ["civilization", "science", "technology"] },
    { id: 35, era: "Medieval Wisdom", year: "~788 CE", title: "Adi Shankaracharya", icon: "🌅", summary: "Renovates absolute non-dualistic (Advaita) Vedanta across India, dissolving ritual division with pure logical non-duality.", tags: ["spirituality", "philosophy", "india"] },
    { id: 36, era: "Medieval Wisdom", year: "~800 CE", title: "Nalanda University peaks", icon: "🎓", summary: "Nalanda becomes the global lighthouse for logic, medicine, cosmology, and Buddhist philosophies with 10,000 scholars.", tags: ["civilization", "spirituality", "india"] },
    { id: 37, era: "Medieval Wisdom", year: "~1000 CE", title: "Ibn Sina's Canon of Medicine", icon: `<i class="lucide-icon text-sm" data-lucide="telescope"></i>`, summary: "Persian polymath 'Avicenna' writes absolute medical codes and rationalistic philosophy blending Islam with Aristotle.", tags: ["science", "philosophy"] },
    { id: 38, era: "Medieval Wisdom", year: "~1100 CE", title: "Ramanuja's Devotionalism", icon: "📖", summary: "Formulates Vishishtadvaita (qualified non-duality), integrating intellectual Brahman with dynamic divine love.", tags: ["spirituality", "india"] },
    { id: 39, era: "Medieval Wisdom", year: "~1200 CE", title: "Madhvacharya's Duality", icon: "📖", summary: "Presents pure Dvaita (dual Vedanta), defining infinite, eternal distinctions between the soul, god, and nature.", tags: ["spirituality", "india"] },
    { id: 40, era: "Medieval Wisdom", year: "~1225 CE", title: "Thomas Aquinas Theology", icon: "⛪", summary: "Catholic monk writes Summa Theologiae, logically harmonizing rational Aristotelian logic with Christian scriptural dogma.", tags: ["philosophy", "religion"] },

    // --- ERA 6: Renaissance & Science (~1450 CE to ~1642 CE) ---
    { id: 41, era: "Renaissance & Science", year: "~1450 CE", title: "Printing Press Invented", icon: "🖨", summary: "Johannes Gutenberg deploys movable metal type. Books become mass-producible, ending clerical monopoly on knowledge.", tags: ["technology", "civilization"] },
    { id: 42, era: "Renaissance & Science", year: "1492 CE", title: "Columbus Crosses Atlantic", icon: `<i class="lucide-icon text-sm" data-lucide="globe"></i>`, summary: "European contact with the Americas links global hemispheres, accelerating trade, empires, and tragic colonization.", tags: ["civilization"] },
    { id: 43, era: "Renaissance & Science", year: "1517 CE", title: "Martin Luther's Reformation", icon: "✝", summary: "Luther nails 95 Theses in Wittenberg, breaking the monolithic power of the Catholic Church for personal faith.", tags: ["religion", "civilization"] },
    { id: 44, era: "Renaissance & Science", year: "1543 CE", title: "Copernicus' Heliocentrism", icon: `<i class="lucide-icon text-sm" data-lucide="telescope"></i>`, summary: "Overturns geocentric paradigms by placing the Sun at the center of the solar system, decentering human terrain.", tags: ["science"] },
    { id: 45, era: "Renaissance & Science", year: "1564 CE", title: "Galileo's Telescope Trials", icon: `<i class="lucide-icon text-sm" data-lucide="telescope"></i>`, summary: "Launches the experimental method. Observes Jupiter's moons and faces Roman Inquisition trials for heliocentrism.", tags: ["science", "greece", "modern"] },
    { id: 46, era: "Renaissance & Science", year: "1571 CE", title: "Johannes Kepler's Laws", icon: `<i class="lucide-icon text-sm" data-lucide="brain"></i>`, summary: "Discovers elliptical planetary orbits, detailing planetary motion with exquisite geometric and harmonic mathematics.", tags: ["science"] },
    { id: 47, era: "Renaissance & Science", year: "1596 CE", title: "René Descartes Method", icon: `<i class="lucide-icon text-sm" data-lucide="brain"></i>`, summary: "Dismantles inherited assumptions to find certitude. Declares thinking as proof of human existence: Cogito, Ergo Sum.", tags: ["philosophy", "science", "modern"] },
    { id: 48, era: "Renaissance & Science", year: "1642 CE", title: "Isaac Newton's Principia", icon: `<i class="lucide-icon text-sm" data-lucide="apple"></i>`, summary: "Formulates universal gravitational forces and motion laws, uniting heaven and earth in single mathematical mechanics.", tags: ["science", "technology", "modern"] },

    // --- ERA 7: Enlightenment (~1632 CE to ~1789 CE) ---
    { id: 49, era: "Enlightenment", year: "1632 CE", title: "John Locke's State Theory", icon: `<i class="lucide-icon text-sm" data-lucide="scroll-text"></i>`, summary: "Details natural rights: life, liberty, and estate. Defines the human mind as a blank slate (Tabula Rasa).", tags: ["philosophy", "modern"] },
    { id: 50, era: "Enlightenment", year: "1689 CE", title: "Declaration of Liberty Codes", icon: "⚖", summary: "English Bill of Rights and constitutional lines start replacing divine monarchy with early parliamentary laws.", tags: ["civilization", "modern"] },
    { id: 51, era: "Enlightenment", year: "1724 CE", title: "Immanuel Kant's System", icon: `<i class="lucide-icon text-sm" data-lucide="lightbulb"></i>`, summary: "Author of critiques of pure reason. Bridges rationalism and empiricism. Demands: Sapere Aude (Dare to know).", tags: ["philosophy", "modern"] },
    { id: 52, era: "Enlightenment", year: "1748 CE", title: "Montesquieu & Division of Powers", icon: "📚", summary: "Designs separation of state power into executive, legislative, and judicial units to avoid dictatorial traps.", tags: ["philosophy", "civilization", "modern"] },
    { id: 53, era: "Enlightenment", year: "1776 CE", title: "American Revolution", icon: `<i class="lucide-icon text-sm" data-lucide="landmark"></i>`, summary: "Enlightenment ideals spark armed independence, drafting a constitutional republic declaring human equality.", tags: ["civilization", "modern"] },
    { id: 54, era: "Enlightenment", year: "1789 CE", title: "French Declaration of Rights", icon: "⚔", summary: "Demolishes feudal orders under banner of Liberty, Equality, and Fraternity, establishing secular human rights.", tags: ["civilization", "modern"] },

    // --- ERA 8: Modern Human Mind (~1818 CE to ~1920 CE) ---
    { id: 55, era: "Modern Human Mind", year: "1818 CE", title: "Karl Marx's Dialectic", icon: `<i class="lucide-icon text-sm" data-lucide="brain"></i>`, summary: "Applies dialectic principles to material struggle, tracing historical evolution as class friction over capital.", tags: ["philosophy", "modern"] },
    { id: 56, era: "Modern Human Mind", year: "1859 CE", title: "Charles Darwin's Selection", icon: `<i class="lucide-icon text-sm" data-lucide="dna"></i>`, summary: "Proposes evolution through natural selection in 'Origin of Species', shifting models of human lineage origins.", tags: ["science", "modern"] },
    { id: 57, era: "Modern Human Mind", year: "1863 CE", title: "Swami Vivekananda Speeches", icon: "🦁", summary: "Carries universal Advaita Vedanta and meditative yoga systems to America, declaring all religions as paths to the ocean.", tags: ["spirituality", "philosophy", "india", "modern"] },
    { id: 58, era: "Modern Human Mind", year: "1869 CE", title: "Mahatma Gandhi's Satyagraha", icon: "🕉", summary: "Translates Ahimsa into an active political force (soul-force), leading nation-wide struggles of nonviolent resistance.", tags: ["spirituality", "civilization", "india", "modern"] },
    { id: 59, era: "Modern Human Mind", year: "1879 CE", title: "Albert Einstein's Relativity", icon: "⚡", summary: "Overturns absolute time and space, proving matter represents frozen energy ($E=mc^2$) inside unified space-time fabric.", tags: ["science", "technology", "modern"] },
    { id: 60, era: "Modern Human Mind", year: "1888 CE", title: "Radhakrishnan's Philosophy", icon: "📖", summary: "Bridges intellectual Western logic with Eastern intuition, writing massive works on comparative Indian philosophies.", tags: ["philosophy", "india", "modern"] },
    { id: 61, era: "Modern Human Mind", year: "1892 CE", title: "Jiddu Krishnamurti Vision", icon: "🧘", summary: "Urges direct, masterless tracking of mental structures: 'Truth is a pathless land' untangled from institutional authority.", tags: ["spirituality", "philosophy", "india", "modern"] },
    { id: 62, era: "Modern Human Mind", year: "1893 CE", title: "Nikola Tesla's AC Dynamos", icon: "📡", summary: "Invents polyphase alternating current power networks, electrifying human cities with radiant electromagnetic forces.", tags: ["technology", "science", "modern"] },
    { id: 63, era: "Modern Human Mind", year: "1900 CE", title: "Sigmund Freud's Unconscious", icon: `<i class="lucide-icon text-sm" data-lucide="brain"></i>`, summary: "Exposes hidden dynamic drives under rational control. Develops psychoanalysis centered on dream-tracking.", tags: ["science", "philosophy", "modern"] },
    { id: 64, era: "Modern Human Mind", year: "1920 CE", title: "Carl Jung's Collective Typology", icon: `<i class="lucide-icon text-sm" data-lucide="brain"></i>`, summary: "Discovers the structural collective unconscious comprising deep symbols, archetypes, shadows, and paths to individuation.", tags: ["science", "philosophy", "modern"] },

    // --- ERA 9: Contemporary Wisdom (~1945 CE to ~2030+ CE) ---
    { id: 65, era: "Contemporary Wisdom", year: "1945 CE", title: "The Nuclear Firepower", icon: "☢", summary: "First atomic detonation at Trinity. Humans hold absolute power for self-destruction, altering global security.", tags: ["technology", "science", "modern"] },
    { id: 66, era: "Contemporary Wisdom", year: "1947 CE", title: "Indian Secular Independence", icon: "🇮🇳", summary: "Unlocks democratic self-rule for one-fifth of humanity, merging ancient spiritual lineage with modern constitutional law.", tags: ["civilization", "india", "modern"] },
    { id: 67, era: "Contemporary Wisdom", year: "1950 CE", title: "The Turing Computer Rise", icon: `<i class="lucide-icon text-sm" data-lucide="laptop"></i>`, summary: "Alan Turing defines formal computing machines, starting human externalization of abstract logical processing.", tags: ["technology", "science"] },
    { id: 68, era: "Contemporary Wisdom", year: "1960 CE", title: "Global Human Rights Wave", icon: `<i class="lucide-icon text-sm" data-lucide="globe"></i>`, summary: "Universal movements for racial equality, women rights, and decolonization, establishing universal codal empathy.", tags: ["civilization", "modern"] },
    { id: 69, era: "Contemporary Wisdom", year: "1970 CE", title: "Osho Zen Awakening Waves", icon: "🧘", summary: "Merges deep Zen mindfulness with analytic therapy. Teaches ecstatic dynamic movements and direct witnessing.", tags: ["spirituality", "india", "modern"] },
    { id: 70, era: "Contemporary Wisdom", year: "1970 CE", title: "Environmental Awakening", icon: `<i class="lucide-icon text-sm" data-lucide="leaf"></i>`, summary: "Coalescence of ecological movements tracking planetary unity, seeing Earth as a single homeostasis (Gaia).", tags: ["civilization", "science"] },
    { id: 71, era: "Contemporary Wisdom", year: "1989 CE", title: "World Wide Web Birth", icon: `<i class="lucide-icon text-sm" data-lucide="globe"></i>`, summary: "Tim Berners-Lee designs hypertext protocols, linking global computers into a single nervous system.", tags: ["technology", "modern"] },
    { id: 72, era: "Contemporary Wisdom", year: "1998 CE", title: "Google Search Core", icon: "🔍", summary: "Indexes decentralized human networks, placing global information at instant mental query command.", tags: ["technology"] },
    { id: 73, era: "Contemporary Wisdom", year: "2004 CE", title: "Social Media Swarms", icon: "👥", summary: "Connects human moods and attention spans in real-time feedback loops, shaping culture and neurochemistry.", tags: ["technology", "modern"] },
    { id: 74, era: "Contemporary Wisdom", year: "2007 CE", title: "The Smartphone Shift", icon: "📱", summary: "Steve Jobs showcases modern iPhones. Computing becomes a continuous visceral extension of standard sensory bodies.", tags: ["technology", "modern"] },
    { id: 75, era: "Contemporary Wisdom", year: "2010 CE", title: "Cloud Computing Networks", icon: "☁", summary: "Aggregates planetary data files to secure remote centers, backing up the human memory into centralized layers.", tags: ["technology"] },
    { id: 76, era: "Contemporary Wisdom", year: "2020 CE", title: "Transformer AI Rise", icon: "🤖", summary: "Emergence of deep neural nets encoding linguistic representations, initializing machine-authored intelligence.", tags: ["technology", "science"] },
    { id: 77, era: "Contemporary Wisdom", year: "2022 CE", title: "Generative AI Launch", icon: `<i class="lucide-icon text-sm" data-lucide="brain"></i>`, summary: "Engines create text, software, and images on demand, triggering existential analysis of human uniqueness.", tags: ["technology", "science", "modern"] },
    { id: 78, era: "Contemporary Wisdom", year: "2026 CE", title: "Personal Second Brain", icon: "📚", summary: "Wisdom integrates user notes and historical scriptures with advanced local AI, augmenting personal understanding.", tags: ["technology", "spirituality", "india", "modern"] },
    { id: 79, era: "Contemporary Wisdom", year: "2030+ ?", title: "Human & AI Intelligence Merge", icon: `<i class="lucide-icon text-sm" data-lucide="sparkles"></i>`, summary: "Strategic co-evolution of biological consciousness with generative synth-minds, aiming for cosmic exploration.", tags: ["technology", "philosophy", "spirituality", "modern"] }
  ];

  // 2. Active filter states
  let activeFilter = "all";

  // 3. Simple Dynamic details dictionary to yield incredible, context-rich expanded content without code bloating!
  function synthesizeDetails(event) {
    const title = event.title;
    const year = event.year;
    const summary = event.summary;
    const isIndia = event.tags.includes("india");
    const isGreece = event.tags.includes("greece");
    const isChina = event.tags.includes("china");
    const isSpirituality = event.tags.includes("spirituality");
    const isPhilosophy = event.tags.includes("philosophy");
    const isScience = event.tags.includes("science");
    const isTechnology = event.tags.includes("technology");

    // Influence Score Formula (Stable, calculated organically or customized)
    let score = 8.5;
    if (isSpirituality) score = 9.8;
    else if (isScience) score = 9.4;
    else if (isPhilosophy) score = 9.2;
    else score = 8.9;

    // Specific books suggestions
    let books = ["Universal Chronicle Texts", "Historical Chronicles Archive"];
    if (title.includes("Vedas")) books = ["Rigveda Samhita", "Yajurveda Hymns"];
    else if (title.includes("Upanishads")) books = ["Brihadaranyaka Upanishad", "Chandogya Upanishad"];
    else if (title.includes("Buddha")) books = ["The Dhammapada", "Majjhima Nikaya"];
    else if (title.includes("Socrates")) books = ["Plato's Apology of Socrates", "Plato's Republic"];
    else if (title.includes("Marcus Aurelius")) books = ["Meditations (Private Journal)", "Letters of Seneca"];
    else if (title.includes("Laozi")) books = ["Tao Te Ching (The Way)", "The Book of Chuang Tzu"];
    else if (title.includes("Confucius")) books = ["The Analects of Confucius", "The Book of Mencius"];
    else if (title.includes("Shankaracharya")) books = ["Brahmasutra Bhashya", "Vivekachudamani (Crest-Jewel of Discrimination)"];
    else if (title.includes("Vivekananda")) books = ["Raja Yoga Manual", "Jnana Yoga Lectures"];
    else if (title.includes("Gandhi")) books = ["My Experiments with Truth", "Hind Swaraj"];
    else if (title.includes("Sutras")) books = ["Yoga Sutras of Patanjali", "Vyasabhashya Commentaries"];
    else if (title.includes("Newton")) books = ["Philosophiae Naturalis Principia Mathematica", "Opticks Book"];
    else if (title.includes("Einstein")) books = ["The Meaning of Relativity", "Relativity: The Special and General Theory"];
    else if (title.includes("Darwin")) books = ["On the Origin of Species", "The Descent of Man"];
    else if (title.includes("Turing") || title.includes("Computer")) books = ["On Computable Numbers", "Computing Machinery and Intelligence"];
    else if (title.includes("AI") || title.includes("Second Brain")) books = ["Superintelligence by Nick Bostrom", "Life 3.0 by Max Tegmark"];

    // Related thinkers
    let thinkers = ["Ancient Wisdom Seers", "Global Pathfinders"];
    if (isIndia) thinkers = ["Siddhartha Gautama", "Adi Shankaracharya", "Swami Vivekananda"];
    else if (isGreece) thinkers = ["Socrates", "Plato", "Aristotle", "Zeno of Citium"];
    else if (isChina) thinkers = ["Laozi", "Confucius", "Mencius"];
    else if (isScience || isTechnology) thinkers = ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Alan Turing"];
    else if (isSpirituality) thinkers = ["Gautama Buddha", "Jesus of Nazareth", "Patanjali", "Osho"];

    // Dynamic Biography & Context Synthesis Engine
    const bioText = `With ${title} (${year}), humanity entered a transformative alignment. This epochal milestone represents a fundamental re-centering of standard cognitive awareness. Rather than reacting blindly to immediate sensory feedback, humanity began charting stable systems of symbolic meaning, meditative stillness, and scientific clarity. It stands as a timeless reference point in our collective transition from survival to self-knowledge.`;
    
    const contextText = `During the epoch of ${year}, the world was undergoing significant physical and planetary shifts. Old continental trade streams, tribal conflicts, and climatic patterns pushed human groups to find structural answers to suffering and order. ${title} emerged not as isolated flashes, but as dynamic answers to civilizational bottlenecks, forging a shared lineage for global consciousness.`;

    const aiBreakthrough = `This was a colossal breakthrough because it directly externalized or elevated the operational capacity of human consciousness. By ${isSpirituality ? 'dissolving the dualistic feedback loop of ego and identifying with the vast cosmic witness' : isScience ? 'applying rigorous geometric mechanical formulas to separate personal opinion from external mathematical realities' : 'providing permanent, symbolic containers to pass down wisdom across generations'}, it permanently upgraded the human operating system.`;

    return {
      biography: bioText,
      context: contextText,
      books: books,
      score: score.toFixed(1),
      thinkers: thinkers,
      audio: `"${summary}" Formulated at ${year}. This breakthrough marked a leap in human awareness.`,
      ai_explanation: aiBreakthrough
    };
  }

  // 4. Initialize and build the interactive timeline overlay container in HTML
  function loadImmersiveTimelineUI() {
    // Only compile once
    if (document.getElementById('immersive-timeline-view')) return;

    const overlay = document.createElement('div');
    overlay.id = 'immersive-timeline-view';
    overlay.className = 'hidden fixed inset-0 z-[9990] overflow-y-auto bg-slate-950 text-slate-100 font-sans select-none scroll-smooth pb-16 transition-colors duration-500';
    overlay.style.zIndex = '9990';
    
    overlay.innerHTML = `
      <!-- Parallax Space background elements loaded inside -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-slate-900 via-slate-950 to-slate-950">
        <div id="timeline-stars-layer" class="absolute inset-0 opacity-40 transition-transform duration-1000 ease-out"></div>
        <div id="timeline-particles-canvas" class="absolute inset-0 pointer-events-none opacity-20"></div>
        <!-- Rotating Cosmic Mandala symbol deep layout inside space bg -->
        <div class="absolute -right-32 top-10 w-[700px] h-[700px] opacity-[0.02] border border-white rounded-full animate-[spin_320s_linear_infinite] flex items-center justify-center">
          <div class="w-2/3 h-2/3 border border-dashed border-white rounded-full"></div>
          <div class="w-1/3 h-1/3 border border-double border-white rounded-full"></div>
        </div>
      </div>

      <!-- Main Sticky Top Control Bar -->
      <header class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 transition-all py-4 px-6 md:px-12 flex flex-col gap-4 select-none">
        <div class="flex items-center justify-between w-full max-w-7xl mx-auto">
          <!-- Back trigger button -->
          <button id="close-timeline-btn" class="flex items-center gap-2 group px-4 py-2 bg-white/5 rounded-full border border-white/10 text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-xs font-bold uppercase tracking-widest">
            <i class="lucide-icon text-[16px] group-hover:-translate-x-1 transition-transform" data-lucide="arrow-left"></i>
            Back to Sanctuary
          </button>

          <!-- Core Title and Status badge -->
          <div class="text-center">
            <h1 class="font-sans font-extrabold text-lg sm:text-2xl tracking-tight text-white mb-0.5">The Journey of Human Consciousness</h1>
            <p class="text-[9px] font-mono tracking-widest text-[#FBBF24] uppercase font-bold">~300,000 BCE &mdash; Future AI Age</p>
          </div>

          <!-- Mini Audio Global Player summary controls -->
          <button id="timeline-global-stop-audio" class="hidden w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 active:scale-95 transition-all" title="Mute Active Audio">
            <i class="lucide-icon text-lg" data-lucide="volume-x"></i>
          </button>
          <div class="w-10"></div> <!-- balancing spacer -->
        </div>

        <!-- Filter bar -->
        <div class="w-full max-w-7xl mx-auto border-t border-white/5 pt-3.5">
          <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 custom-scrollbar select-none" id="timeline-tags-scroller">
            <button data-tag="all" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md transition-all whitespace-nowrap cursor-pointer">🌌 All Path</button>
            <button data-tag="spirituality" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">📿 Spirituality</button>
            <button data-tag="philosophy" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">🏛 Philosophy</button>
            <button data-tag="science" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">🔭 Science</button>
            <button data-tag="religion" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">⛪ Religion</button>
            <button data-tag="civilization" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">🌾 Civilization</button>
            <button data-tag="technology" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">💻 Technology</button>
            <button data-tag="india" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">🇮🇳 India</button>
            <button data-tag="china" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">🏯 China</button>
            <button data-tag="greece" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">🏛 Greece</button>
            <button data-tag="modern" class="timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">🌍 Modern World</button>
          </div>
        </div>
      </header>

      <!-- Scroll Storytelling Layout Container -->
      <main class="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 relative z-10 select-none">
        <!-- Center vertical line -->
        <div class="absolute left-6 md:left-1/2 top-0 bottom-0 w-[3px] bg-white/10 md:-translate-x-1/2 z-0">
          <!-- Animated glowing scroll filled indicator path -->
          <div id="timeline-scroll-glow-indicator" class="absolute top-0 left-0 w-full h-0 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-100" style="filter: drop-shadow(0px 0px 4px #f59e0b);"></div>
        </div>

        <!-- Space for actual cards stream rendering -->
        <div id="timeline-stream-container" class="space-y-24 md:space-y-40 relative z-10">
          <!-- Loaded Dynamically -->
        </div>
      </main>

      <!-- Glass Description Expansion Side Drawer / Panel overlay drawer -->
      <div id="timeline-details-drawer" class="fixed inset-y-0 right-0 w-full md:max-w-xl bg-slate-900/95 backdrop-blur-lg border-l border-white/10 shadow-2xl z-[9995] transform translate-x-full transition-transform duration-350 ease-out flex flex-col text-left" style="z-index: 9995;">
        <!-- Close button & header title bar -->
        <div class="p-5 border-b border-white/5 flex items-center justify-between bg-white/1 bg-gradient-to-br from-white/2 to-transparent">
          <div class="flex items-center gap-3">
            <div id="drawer-card-icon" class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">🧘</div>
            <div>
              <span id="drawer-card-year" class="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">~563 BCE</span>
              <h3 id="drawer-card-title" class="text-base font-extrabold text-white leading-tight">Awakening of Buddha</h3>
            </div>
          </div>
          <button id="close-drawer-btn" class="w-8 h-8 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
            <i class="lucide-icon text-[20px]" data-lucide="x"></i>
          </button>
        </div>

        <!-- Scrollable Detailing Body -->
        <div class="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 space-y-6">
          <!-- Dynamic Vocal audio play section -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <i class="lucide-icon text-amber-400 text-2xl" data-lucide="volume-2"></i>
              <div>
                <h4 class="text-xs font-bold text-white block">Listen to Sage Vocal Summary</h4>
                <p id="drawer-audio-status-text" class="text-[9px] font-mono text-white/50 uppercase tracking-widest">Premium Speech synthesis synthesis</p>
              </div>
            </div>
            <button id="drawer-audio-play-btn" class="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer">
              <i class="lucide-icon text-[22px] font-bold" data-lucide="play"></i>
            </button>
          </div>

          <!-- Evolutionary Biography -->
          <section class="space-y-2">
            <span class="text-[10px] font-mono tracking-widest text-[#9ca3af] uppercase font-bold block">Consciousness Profile &amp; Legacy</span>
            <p id="drawer-bio-text" class="text-sm text-slate-300 leading-relaxed font-normal">Loading complete biography...</p>
          </section>

          <!-- Historical Context -->
          <section class="space-y-2">
            <span class="text-[10px] font-mono tracking-widest text-[#9ca3af] uppercase font-bold block">Era Environment &amp; Historical Context</span>
            <p id="drawer-context-text" class="text-sm text-slate-300 leading-relaxed font-normal">Loading context...</p>
          </section>

          <!-- Suggested Readings -->
          <section class="space-y-3">
            <span class="text-[10px] font-mono tracking-widest text-[#9ca3af] uppercase font-bold block">Essential Primary Books &amp; Scripts</span>
            <div id="drawer-books-list" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Filled dynamically -->
            </div>
          </section>

          <!-- Related Thinkers & Sages -->
          <section class="space-y-2">
            <span class="text-[10px] font-mono tracking-widest text-[#9ca3af] uppercase font-bold block">Resonant Thinkers &amp; Lineages</span>
            <div id="drawer-thinkers-tags" class="flex flex-wrap gap-2">
              <!-- Filled dynamically -->
            </div>
          </section>

          <!-- Dynamic score metric & AI explanation -->
          <div class="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-4">
            <!-- Score layout -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-white uppercase tracking-wider block">Influence on evolution of consciousness</span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#FBBF24]"></span>
              </div>
              <span id="drawer-influence-score" class="font-mono text-xl font-extrabold text-[#FBBF24]">9.8 / 10</span>
            </div>
            
            <!-- AI explanation box -->
            <div class="space-y-1 bg-black/30 p-4 rounded-xl border border-white/5">
              <span class="text-[9px] font-mono tracking-widest text-[#FBBF24] uppercase font-bold flex items-center gap-1"><i class="lucide-icon text-xs" data-lucide="sparkles"></i> Wisdom AI Explanation</span>
              <p id="drawer-ai-explanation" class="text-xs text-slate-300 leading-relaxed font-light mt-1">Generating explanation...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Bind event listeners
    document.getElementById('close-timeline-btn').addEventListener('click', hideTimelineImmersive);
    document.getElementById('close-drawer-btn').addEventListener('click', closeDetailsDrawer);
    document.getElementById('timeline-global-stop-audio').addEventListener('click', stopAudioSynthesis);

    // Filter Buttons
    const filterBtns = overlay.querySelectorAll('.timeline-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => {
          b.className = "timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white/70 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer";
        });
        this.className = "timeline-filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md transition-all whitespace-nowrap cursor-pointer";
        
        activeFilter = this.dataset.tag;
        renderTimelineStream();
      });
    });

    // Handle background stars parallax generation
    generateParallaxStars();
  }

  // 5. Generate stars parallax nodes inside backdrop
  function generateParallaxStars() {
    const starLayer = document.getElementById('timeline-stars-layer');
    if (!starLayer) return;

    let starsHTML = "";
    for (let i = 0; i < 90; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      starsHTML += `<div class="absolute rounded-full bg-white transition-opacity duration-1000" style="top: ${top}%; left: ${left}%; width: ${size}px; height: ${size}px; opacity: ${opacity};"></div>`;
    }
    starLayer.innerHTML = starsHTML;
  }

  // 6. Draw vertical timeline items on screen list
  function renderTimelineStream() {
    const stream = document.getElementById('timeline-stream-container');
    if (!stream) return;

    // Filter events
    const filtered = TIMELINE_EVENTS.filter(evt => {
      if (activeFilter === "all") return true;
      return evt.tags.includes(activeFilter);
    });

    if (filtered.length === 0) {
      stream.innerHTML = `
        <div class="text-center py-20">
          <i class="lucide-icon text-4xl text-white/20" data-lucide="search-x"></i>
          <p class="text-sm font-sans tracking-wide text-white/50 mt-2">No timeline points matched the selected category line.</p>
        </div>
      `;
      return;
    }

    let streamHTML = "";
    let currentEraSectionName = "";

    filtered.forEach((evt, idx) => {
      // Era grouping indicator
      let eraIndicatorHTML = "";
      if (evt.era !== currentEraSectionName) {
        currentEraSectionName = evt.era;
        eraIndicatorHTML = `
          <div class="w-full flex justify-center py-6 select-none relative z-10">
            <div class="px-6 py-2 bg-gradient-to-r from-amber-500/10 via-orange-500/20 to-amber-500/10 border border-amber-500/25 rounded-full backdrop-blur-md shadow-lg">
              <span class="text-xs font-mono font-extrabold tracking-[0.2em] text-[#FBBF24] uppercase">${currentEraSectionName}</span>
            </div>
          </div>
        `;
      }

      // Check left or right alignment on wide desktop models
      const alignLeft = idx % 2 === 0;
      const alignClass = alignLeft ? "md:mr-auto md:text-right" : "md:ml-auto md:text-left";
      const outerOrientationClass = alignLeft ? 'md:flex-row' : 'md:flex-row-reverse';
      const spacingPushClass = alignLeft ? 'md:pr-14 md:text-right md:justify-end' : 'md:pl-14 md:text-left md:justify-start';

      streamHTML += `
        ${eraIndicatorHTML}

        <!-- Single event outer layout row -->
        <div class="timeline-event-card-wrapper flex flex-col md:flex-row relative items-center gap-6 md:gap-0 select-none opacity-30 transform translate-y-12 scale-95 transition-all duration-700 ease-out z-10" data-id="${evt.id}">
          <!-- Center connecting node bullet button -->
          <div class="absolute left-6 md:left-1/2 w-5 h-5 rounded-full bg-slate-900 border-[3.5px] border-white/25 md:-translate-x-1/2 z-25 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-all timeline-track-bullet-node" style="box-shadow: 0 0 10px rgba(255,255,255,0.1);" data-id="${evt.id}">
            <div class="w-1 h-1 rounded-full bg-white"></div>
          </div>

          <!-- Content Card block inside -->
          <div class="flex items-center w-full md:w-1/2 ${spacingPushClass}">
            <div class="w-full max-w-md glass-panel bg-slate-900/60 dark:bg-slate-950/60 border border-white/10 rounded-2xl p-5 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] active:scale-[0.99] cursor-pointer group transition-all duration-300 relative text-left">
              <!-- Glow aura inside hovered active cards -->
              <div class="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-amber-500/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>

              <div class="flex gap-4 items-start relative z-10">
                <!-- Large round launcher category icon with custom ambient color -->
                <div class="w-12 h-12 flex-shrink-0 rounded-xl bg-white/5 border border-white/10 text-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  ${evt.icon}
                </div>

                <!-- Descriptive metadata text fields -->
                <div class="space-y-1.5 flex-1">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-mono font-bold text-[#FBBF24] tracking-wider block">${evt.year}</span>
                    <!-- Expand Action indicator helper -->
                    <i class="lucide-icon text-[13px] text-white/30 group-hover:text-[#FBBF24] transition-colors leading-none" data-lucide="arrow-right"></i>
                  </div>
                  <h3 class="font-sans font-bold text-sm sm:text-base text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors">${evt.title}</h3>
                  <p class="font-sans text-xs text-slate-300/80 leading-relaxed font-normal">${evt.summary}</p>
                </div>
              </div>

              <!-- Spark actions button overlay cap bottom right -->
              <div class="mt-4 pt-3 border-t border-white/5 flex justify-between items-center relative z-10">
                <!-- Primary tag labels -->
                <div class="flex gap-1.5 overflow-x-auto no-scrollbar">
                  ${evt.tags.slice(0, 2).map(g => `<span class="text-[8px] font-mono tracking-widest text-[#9ca3af] font-bold uppercase bg-white/5 px-2 py-0.5 rounded-md border border-white/5">${g}</span>`).join('')}
                </div>
                <button class="text-[9px] font-mono tracking-wider font-extrabold text-[#FBBF24] uppercase flex items-center gap-1 group-hover:underline cursor-pointer">
                  Unveil Codex <i class="lucide-icon text-[10px]" data-lucide="sparkles"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    stream.innerHTML = streamHTML;

    // Bind Expand clicks
    const cards = stream.querySelectorAll('.glass-panel');
    cards.forEach(card => {
      card.addEventListener('click', function () {
        const wrapper = this.closest('.timeline-event-card-wrapper');
        if (wrapper) {
          const id = parseInt(wrapper.dataset.id, 10);
          showEventDetails(id);
        }
      });
    });

    // Reset scroll observers & tracking functions
    setupScrollSpy();
  }

  // 7. Setup Intersection Observer tracking to highlight active nodes & fill vertical progress bar
  function setupScrollSpy() {
    const outerWrapper = document.getElementById('immersive-timeline-view');
    const cards = document.querySelectorAll('.timeline-event-card-wrapper');
    const scrollTrackerLine = document.getElementById('timeline-scroll-glow-indicator');

    if (!outerWrapper || cards.length === 0) return;

    // Intersection observer config to illuminate cards in viewport on-the-fly
    const observerOptions = {
      root: outerWrapper,
      rootMargin: "0px 0px -15% 0px",
      threshold: 0.1
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target;
        const bulletNode = target.querySelector('.timeline-track-bullet-node');
        
        if (entry.isIntersecting) {
          target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
          target.classList.remove('opacity-30', 'translate-y-12', 'scale-95');
          
          if (bulletNode) {
            bulletNode.className = "absolute left-6 md:left-1/2 w-5 h-5 rounded-full bg-slate-950 border-[3.8px] md:-translate-x-1/2 z-25 flex items-center justify-center scale-125 transition-all timeline-track-bullet-node";
            bulletNode.style.borderColor = "#FBBF24";
            bulletNode.style.boxShadow = "0 0 15px rgba(245,158,11,0.6)";
          }
        } else {
          // If scroll up, fade slightly out
          const rect = entry.boundingClientRect;
          if (rect.top > 0) {
            target.classList.add('opacity-30', 'translate-y-12', 'scale-95');
            target.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
            
            if (bulletNode) {
              bulletNode.className = "absolute left-6 md:left-1/2 w-5 h-5 rounded-full bg-slate-100/5 border-[3.5px] border-white/20 md:-translate-x-1/2 z-25 flex items-center justify-center transition-all timeline-track-bullet-node";
              bulletNode.style.borderColor = "rgba(255,255,255,0.25)";
              bulletNode.style.boxShadow = "none";
            }
          }
        }
      });
    }, observerOptions);

    cards.forEach(card => spyObserver.observe(card));

    // Handle smooth filling of the scroll track progress line
    outerWrapper.addEventListener('scroll', () => {
      const scrollTop = outerWrapper.scrollTop;
      const scrollHeight = outerWrapper.scrollHeight - outerWrapper.clientHeight;
      if (scrollHeight <= 0) return;

      const progressPct = (scrollTop / scrollHeight) * 100;
      if (scrollTrackerLine) {
        scrollTrackerLine.style.height = `${progressPct}%`;
      }

      // Parallax starry background translation offset
      const stars = document.getElementById('timeline-stars-layer');
      if (stars) {
        stars.style.transform = `translateY(-${scrollTop * 0.15}px)`;
      }
    });
  }

  // 8. Open Expanded Slider Drawer for selected event ID
  let activeUtterance = null;
  function showEventDetails(id) {
    const event = TIMELINE_EVENTS.find(e => e.id === id);
    if (!event) return;

    // Synthesize rich biographical and contextual data dynamically
    const details = synthesizeDetails(event);

    const drawer = document.getElementById('timeline-details-drawer');
    const iconSpan = document.getElementById('drawer-card-icon');
    const yearSpan = document.getElementById('drawer-card-year');
    const titleSpan = document.getElementById('drawer-card-title');
    const bioText = document.getElementById('drawer-bio-text');
    const contextText = document.getElementById('drawer-context-text');
    const influenceSpan = document.getElementById('drawer-influence-score');
    const aiExplanation = document.getElementById('drawer-ai-explanation');

    if (!drawer) return;

    // Update Text Content
    iconSpan.innerHTML = event.icon;
    yearSpan.textContent = event.year;
    titleSpan.textContent = event.title;
    bioText.textContent = details.biography;
    contextText.textContent = details.context;
    influenceSpan.textContent = `${details.score} / 10`;
    aiExplanation.textContent = details.ai_explanation;

    // Update Suggested Books
    const booksList = document.getElementById('drawer-books-list');
    if (booksList) {
      booksList.innerHTML = details.books.map(b => `
        <div class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
          <i class="lucide-icon text-amber-500/70 text-base" data-lucide="book"></i>
          <span class="text-xs font-sans font-bold text-white leading-tight">${b}</span>
        </div>
      `).join('');
    }

    // Update Related Sages/Thinkers Slices
    const thinkersList = document.getElementById('drawer-thinkers-tags');
    if (thinkersList) {
      thinkersList.innerHTML = details.thinkers.map(t => `
        <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-sans font-bold text-slate-300 uppercase tracking-wider block">${t}</span>
      `).join('');
    }

    // Set Up Voice synthesis synthesis button bind
    const playBtn = document.getElementById('drawer-audio-play-btn');
    const playIconIcon = document.getElementById('drawer-audio-play-icon');
    const statusTextText = document.getElementById('drawer-audio-status-text');

    stopAudioSynthesis(); // cancel legacy speaking

    // Reset TTS state UI
    if (playIconIcon) playIconIcon.textContent = "play_arrow";
    if (statusTextText) statusTextText.textContent = "Premium Speech Synthesis";

    playBtn.onclick = function () {
      if (window.speechSynthesis.speaking) {
        stopAudioSynthesis();
        playIconIcon.textContent = "play_arrow";
        statusTextText.textContent = "Audio Muted";
      } else {
        playIconIcon.textContent = "pause";
        statusTextText.textContent = "Speaking Voice summary...";
        
        // Hide global stop button trigger in overlay top header
        document.getElementById('timeline-global-stop-audio').classList.remove('hidden');

        activeUtterance = new SpeechSynthesisUtterance(details.audio);
        activeUtterance.rate = 1.0;
        activeUtterance.pitch = 0.95;

        // Fetch custom english voice matching if supported
        try {
          const voices = window.speechSynthesis.getVoices();
          const premiumVoice = voices.find(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Arthur'))
          );
          if (premiumVoice) activeUtterance.voice = premiumVoice;
        } catch (e) {}

        activeUtterance.onend = () => {
          playIconIcon.textContent = "play_arrow";
          statusTextText.textContent = "Listening Finished";
          document.getElementById('timeline-global-stop-audio').classList.add('hidden');
        };

        activeUtterance.onerror = () => {
          playIconIcon.textContent = "play_arrow";
          statusTextText.textContent = "Audio Stopped";
          document.getElementById('timeline-global-stop-audio').classList.add('hidden');
        };

        window.speechSynthesis.speak(activeUtterance);
      }
    };

    // Open Slider Drawer
    drawer.classList.remove('translate-x-full');
  }

  // 9. Close expanded details drawer panel
  function closeDetailsDrawer() {
    const drawer = document.getElementById('timeline-details-drawer');
    if (drawer) drawer.classList.add('translate-x-full');
    stopAudioSynthesis();
  }

  // 10. Speech synthesis cancel helper
  function stopAudioSynthesis() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    const playIconIcon = document.getElementById('drawer-audio-play-icon');
    const statusTextText = document.getElementById('drawer-audio-status-text');
    if (playIconIcon) playIconIcon.textContent = "play_arrow";
    if (statusTextText) statusTextText.textContent = "Premium Speech Synthesis";

    const globalStop = document.getElementById('timeline-global-stop-audio');
    if (globalStop) globalStop.classList.add('hidden');
  }

  // 11. Reveal global overlay view
  function showTimelineImmersive() {
    loadImmersiveTimelineUI();

    const overlay = document.getElementById('immersive-timeline-view');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    document.body.style.overflow = "hidden"; // block main page scroll

    // Render entries
    renderTimelineStream();
  }

  // 12. Hide global overlay view
  function hideTimelineImmersive() {
    const overlay = document.getElementById('immersive-timeline-view');
    if (overlay) overlay.classList.add('hidden');
    document.body.style.overflow = ""; // restore app scroll
    stopAudioSynthesis();
  }

  // 13. Expose to global window object so it can be queried inside main App.js easily
  window.unveilImmersiveTimeline = showTimelineImmersive;

  // 14. Auto-bind entry button to open the timeline
  function initTimelineLauncher() {
    const btn = document.getElementById('trigger-immersive-timeline');
    if (btn) {
      btn.addEventListener('click', showTimelineImmersive);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        const delayedBtn = document.getElementById('trigger-immersive-timeline');
        if (delayedBtn) delayedBtn.addEventListener('click', showTimelineImmersive);
      });
    }
  }
  initTimelineLauncher();

})();
