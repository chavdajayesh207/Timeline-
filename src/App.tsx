import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Clock, 
  BookMarked, 
  Bookmark, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Compass, 
  X, 
  ChevronRight, 
  ChevronUp, 
  Star, 
  Info,
  Layers,
  Menu,
  Languages,
  BookCheck,
  FileText,
  Heart,
  Download,
  Home,
  Volume2,
  Moon,
  Sun,
  Sliders,
  Bot,
  Calendar,
  Play,
  Pause,
  HelpCircle,
  Lightbulb,
  Check,
  Share2,
  Trophy,
  Activity,
  Flame,
  TrendingUp,
  Shield,
  Briefcase,
  SlidersHorizontal,
  FolderLock,
  User,
  Bell,
  FileDown
} from "lucide-react";

import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";

import { 
  ALL_CATEGORIES, 
  PHILOSOPHERS, 
  TIMELINE_EVENTS, 
  TOP_10_BOOKS 
} from "./data";

import { 
  WISDOM_QUOTES, 
  REFLECTIONS, 
  INITIAL_HIGHLIGHTS, 
  AMBIENT_TRACKS, 
  SavedHighlight 
} from "./data_wisdom";

import { Book } from "./types";
import ReaderScreen from "./components/ReaderScreen";

export default function App() {
  // Navigation State
  // "home" | "library" | "highlights" | "wisdom" | "profile"
  const [activeTab, setActiveTab] = useState<"home" | "library" | "highlights" | "wisdom" | "profile">("home");
  
  // Immersive reader state
  const [selectedReaderBook, setSelectedReaderBook] = useState<Book | null>(null);

  // Focus Mode & Ambient Noises & Pomodoro Ticker State
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [focusBreathingState, setFocusBreathingState] = useState<"in" | "out">("in");
  
  // Ambient Sound channel
  const [ambientChannel, setAmbientChannel] = useState<string>("om");
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [ambientVolume, setAmbientVolume] = useState<number>(60);
  
  // Pomodoro countdown timers
  const [pomoMinutes, setPomoMinutes] = useState<number>(25);
  const [pomoSeconds, setPomoSeconds] = useState<number>(0);
  const [isPomoRunning, setIsPomoRunning] = useState<boolean>(false);
  const pomoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Library Navigation sub-tabs
  // "all" | "reading" | "completed" | "want" | "favorites" | "downloaded"
  const [libFilter, setLibFilter] = useState<"all" | "reading" | "completed" | "want" | "favorites" | "downloaded">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Library Interactive state lists
  const [readingList, setReadingList] = useState<string[]>(["Meditations by Marcus Aurelius", "Bhagavad Gita"]);
  const [completedList, setCompletedList] = useState<string[]>(["Dhammapada", "Tao Te Ching"]);
  const [wantList, setWantList] = useState<string[]>(["Arthashastra by Chanakya"]);
  const [favList, setFavList] = useState<string[]>(["Bhagavad Gita"]);
  const [dlList, setDlList] = useState<string[]>(["Bhagavad Gita", "Meditations by Marcus Aurelius", "Tao Te Ching"]);

  // Daily quote & wallpaper generator
  const [quoteWallpaperText, setQuoteWallpaperText] = useState<string>("The soul becomes dyed with the color of its thoughts.");
  const [quoteWallpaperAuthor, setQuoteWallpaperAuthor] = useState<string>("Marcus Aurelius");
  const [wallpaperBackground, setWallpaperBackground] = useState<"misty" | "midnight" | "gold" | "bamboo">("misty");
  const [wallpaperFont, setWallpaperFont] = useState<"caslon" | "cinzel" | "literata" | "sans">("caslon");
  const [showWallpaperModal, setShowWallpaperModal] = useState<boolean>(false);
  const [wallpaperAlert, setWallpaperAlert] = useState<string>("");

  // Bookmarks State & Study Notes State
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem("vedpuran_bookmarks");
    return saved ? JSON.parse(saved) : ["RigVeda", "Bhagavad Gita"];
  });

  // Second Brain Highlights list
  const [highlights, setHighlights] = useState<SavedHighlight[]>(() => {
    const saved = localStorage.getItem("vedpuran_highlights_sb");
    return saved ? JSON.parse(saved) : INITIAL_HIGHLIGHTS;
  });

  // Search filter inside Second Brain Highlights
  const [highlightsSearch, setHighlightsSearch] = useState<string>("");
  const [activeHighlightTagFilter, setActiveHighlightTagFilter] = useState<string>("all");
  const [newManualHighlightText, setNewManualHighlightText] = useState<string>("");
  const [newManualHighlightNote, setNewManualHighlightNote] = useState<string>("");
  const [newManualHighlightTag, setNewManualHighlightTag] = useState<SavedHighlight["colorTag"]>("Quotes");
  const [newManualHighlightBook, setNewManualHighlightBook] = useState<string>("Self Reflection");

  // Wisdom Rotating Quotes category
  const [wisdomActiveQuoteCategory, setWisdomActiveQuoteCategory] = useState<keyof typeof WISDOM_QUOTES>("Philosophy");
  const [wisdomQuoteIndex, setWisdomQuoteIndex] = useState<number>(0);
  const [wisdomAudioPlaying, setWisdomAudioPlaying] = useState<boolean>(false);

  // System Streak checks (31 days checkpoint checker)
  const [completedStreakDays, setCompletedStreakDays] = useState<number[]>([1, 2, 3, 5, 6, 7, 8, 9, 12, 13, 14]);

  // Saved alerts
  const [appAlert, setAppAlert] = useState<string>("");

  // Redesigned Profile Screen States
  const [activeDNASegment, setActiveDNASegment] = useState<"Stoicism" | "Vedanta" | "Buddhism" | "Psychology" | "Osho">("Stoicism");
  const [selectedThinker, setSelectedThinker] = useState<any | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState<boolean>(false);
  const [activeSettingsPane, setActiveSettingsPane] = useState<"account" | "appearance" | "reading" | "audio" | "notifications" | "privacy" | "data" | "about">("account");
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  
  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem("nalanda_profile_name") || "Jayesh Chavda";
  });
  const [profileTitle, setProfileTitle] = useState<string>(() => {
    return localStorage.getItem("nalanda_profile_title") || "Wisdom Explorer Level 18";
  });
  const [profileStreakCount, setProfileStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem("nalanda_profile_streak");
    return saved ? parseInt(saved, 10) : 45;
  });
  const [customAvatar, setCustomAvatar] = useState<string>(() => {
    return localStorage.getItem("nalanda_custom_avatar") || "";
  });
  
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    const hasDark = document.documentElement.classList.contains("dark");
    return hasDark ? "dark" : "light";
  });

  const [readingAudioSpeed, setReadingAudioSpeed] = useState<number>(1.0);

  // Mood Recommendations state
  const [selectedMood, setSelectedMood] = useState<string>("Restless");

  const moodRecommendations = {
    Restless: ["Patanjali Yoga Sutras", "Meditations by Marcus Aurelius", "Tao Te Ching"],
    "Insomnia Night": ["RigVeda Mantra Chants", "SamaVeda Vocal Chants", "Upanishad Commentaries"],
    Stressed: ["Ashtavakra Gita on detachment", "Dhammapada Teachings", "Buddhist Sutras"],
    Curious: ["RigVeda creation hymn", "Sankhya Philosophy Codes", "Arthashastra Statecraft"]
  };

  // Focus breathing automatic trigger interval
  useEffect(() => {
    if (!isFocusMode) return;
    const interval = setInterval(() => {
      setFocusBreathingState(prev => (prev === "in" ? "out" : "in"));
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocusMode]);

  // Pomodoro countdown ticker function
  useEffect(() => {
    if (isPomoRunning) {
      pomoTimerRef.current = setInterval(() => {
        setPomoSeconds(sec => {
          if (sec === 0) {
            setPomoMinutes(m => {
              if (m === 0) {
                // Done!
                setIsPomoRunning(false);
                setAppAlert("🎉 Pomodoro Session Completed! Rest your eyes now.");
                setTimeout(() => setAppAlert(""), 4000);
                if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
                return 25;
              }
              return m - 1;
            });
            return 59;
          }
          return sec - 1;
        });
      }, 1000);
    } else {
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
    }
    return () => {
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
    };
  }, [isPomoRunning]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("vedpuran_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("vedpuran_highlights_sb", JSON.stringify(highlights));
  }, [highlights]);

  // Synchronize themeMode and profile properties
  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem("nalanda_profile_name", profileName);
    localStorage.setItem("nalanda_profile_title", profileTitle);
    localStorage.setItem("nalanda_profile_streak", String(profileStreakCount));
    localStorage.setItem("nalanda_custom_avatar", customAvatar);
  }, [profileName, profileTitle, profileStreakCount, customAvatar]);

  // Scroll visibility handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter books across all categories for general catalog explorer
  const flattenedBooks = useMemo(() => {
    let allBooksList: (Book & { categoryKey: string })[] = [];
    Object.entries(ALL_CATEGORIES).forEach(([key, value]) => {
      value.list.forEach(book => {
        allBooksList.push({ ...book, categoryKey: key });
      });
    });
    return allBooksList;
  }, []);

  const filteredBooks = useMemo(() => {
    return flattenedBooks.filter(book => {
      const bookName = book.name || book.title || "";
      const bookLang = book.lang || "";

      // Library segment filters (reading, want, downloaded)
      if (libFilter === "reading" && !readingList.includes(bookName)) return false;
      if (libFilter === "completed" && !completedList.includes(bookName)) return false;
      if (libFilter === "want" && !wantList.includes(bookName)) return false;
      if (libFilter === "favorites" && !favList.includes(bookName)) return false;
      if (libFilter === "downloaded" && !dlList.includes(bookName)) return false;

      // Category filter
      if (selectedCategory !== "all" && book.categoryKey !== selectedCategory) {
        return false;
      }
      // Language filter
      if (selectedLanguage !== "all") {
        if (selectedLanguage === "Hindi" && !bookLang.includes("Hindi") && !bookLang.includes("Hi")) return false;
        if (selectedLanguage === "Sanskrit" && !bookLang.includes("Sanskrit") && !bookLang.includes("Sa")) return false;
        if (selectedLanguage === "English" && !bookLang.includes("English") && !bookLang.includes("En")) return false;
      }
      // Search Box Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          bookName.toLowerCase().includes(query) ||
          bookLang.toLowerCase().includes(query) ||
          (book.by && book.by.toLowerCase().includes(query)) ||
          (book.devaName && book.devaName.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [selectedCategory, selectedLanguage, searchQuery, libFilter, readingList, completedList, wantList, favList, dlList, flattenedBooks]);

  // Highlights second brain query filters
  const filteredHighlights = useMemo(() => {
    return highlights.filter(h => {
      if (activeHighlightTagFilter !== "all" && h.colorTag !== activeHighlightTagFilter) return false;
      if (highlightsSearch.trim() !== "") {
        const q = highlightsSearch.toLowerCase();
        return (
          h.text.toLowerCase().includes(q) ||
          h.bookName.toLowerCase().includes(q) ||
          (h.note && h.note.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [highlights, activeHighlightTagFilter, highlightsSearch]);

  const toggleBookmark = (bookName: string) => {
    if (bookmarks.includes(bookName)) {
      setBookmarks(bookmarks.filter(b => b !== bookName));
    } else {
      setBookmarks([...bookmarks, bookName]);
    }
  };

  const handleOpenReader = (book: Book) => {
    // Add to 'recently opened/reading list'
    if (!readingList.includes(book.name)) {
      setReadingList([book.name, ...readingList]);
    }
    setSelectedReaderBook(book);
  };

  // Highlight callback triggered inside Reader
  const handleAddNewHighlightFromReader = (text: string, tag: SavedHighlight["colorTag"], noteText?: string) => {
    const newH: SavedHighlight = {
      id: Date.now().toString(),
      bookName: selectedReaderBook ? selectedReaderBook.name : "Scripture Library",
      author: selectedReaderBook?.by || "Ancient Sage",
      text: text,
      colorTag: tag,
      note: noteText,
      createdAt: new Date().toISOString()
    };
    setHighlights([newH, ...highlights]);
  };

  const handleAddManualHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManualHighlightText.trim()) return;
    const newH: SavedHighlight = {
      id: Date.now().toString(),
      bookName: newManualHighlightBook,
      author: "Collected Thought",
      text: newManualHighlightText,
      colorTag: newManualHighlightTag,
      note: newManualHighlightNote || undefined,
      createdAt: new Date().toISOString()
    };
    setHighlights([newH, ...highlights]);
    setNewManualHighlightText("");
    setNewManualHighlightNote("");
    setNewManualHighlightBook("Self Reflection");
    setAppAlert("Insight stored successfully under Highlights!");
    setTimeout(() => setAppAlert(""), 3000);
  };

  const deleteHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const triggerExportHighlightsPDF = () => {
    setAppAlert("🔔 Generating PDF container. Highlights compiled successfully!");
    setTimeout(() => {
      setAppAlert("📂 PDF compiled! Saved as 'lumina_brain_export.pdf'.");
    }, 1500);
    setTimeout(() => setAppAlert(""), 4500);
  };

  const handleOpenWallpaperModalForQuote = (text: string, author: string) => {
    setQuoteWallpaperText(text);
    setQuoteWallpaperAuthor(author);
    setShowWallpaperModal(true);
  };

  const handleDownloadWallpaper = () => {
    setWallpaperAlert("🎨 Render compilation completed! Wallpaper saved.");
    setTimeout(() => {
      setWallpaperAlert("");
      setShowWallpaperModal(false);
    }, 1800);
  };

  const handleToggleCompletedStreakDay = (day: number) => {
    if (completedStreakDays.includes(day)) {
      setCompletedStreakDays(completedStreakDays.filter(d => d !== day));
    } else {
      setCompletedStreakDays([...completedStreakDays, day]);
    }
  };

  const handleResetPomodoro = () => {
    setIsPomoRunning(false);
    setPomoMinutes(25);
    setPomoSeconds(0);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-6 flex flex-col font-sans bg-[#FDFCF8]">
      
      {/* GLOBAL BANNER NOTIFICATIONS */}
      {appAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#5A5A40] text-[#FDFCF8] border-2 border-[#A67C52] p-4 py-2 text-xs font-bold rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <span>ॐ</span> {appAlert}
        </div>
      )}

      {/* RENDER ACTIVE IMMERSIVE READER OR STANDARD SITE CONTAINER */}
      {selectedReaderBook ? (
        <ReaderScreen 
          book={selectedReaderBook}
          onClose={() => setSelectedReaderBook(null)}
          onAddHighlight={handleAddNewHighlightFromReader}
        />
      ) : (
        <>
          {/* CORE HEADER PORTAL */}
          <header className="relative bg-[#4A4A33] text-white py-10 px-4 md:px-8 border-b border-[#A67C52] text-center overflow-hidden">
            {/* Background absolute branding OM symbol */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[18rem] text-[#A67C52]/10 select-none pointer-events-none font-deva om-pulse">
              ॐ
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10 space-y-2">
              <div className="inline-block border border-[#A67C52]/50 text-[#A67C52] text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full bg-white/5">
                🏛️ WISDOM SACRED HARMONY SPACE
              </div>
              <h1 className="font-caslon text-3xl md:text-5xl font-bold tracking-tight text-[#EAE4D9] drop-shadow-md">
                Wisdom Library
              </h1>
              <p className="font-literata text-xs md:text-sm text-[#F5F2ED]/75 max-w-xl mx-auto leading-relaxed">
                Connect your second brain across multi-tradition core philosophies, dynamic search directories, daily wallpapers, ambient loops, and focus timers.
              </p>

              {/* Minimal metrics banner */}
              <div className="flex justify-center gap-4 mt-4 flex-wrap font-sans text-xs text-[#EAE4D9]/80 uppercase tracking-wider text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white">🏆 14 DAYS</span> STREAK
                </div>
                <div className="h-3 w-[1px] bg-[#A67C52]/30 self-center"></div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white">📖 28 SECONDS</span> SPEED
                </div>
                <div className="h-3 w-[1px] bg-[#A67C52]/30 self-center"></div>
                <div className="flex items-center gap-1 text-green-300">
                  <span className="font-bold">✓ PREMIUM</span> ACTIVE
                </div>
              </div>
            </div>
          </header>

          {/* ADAPTIVE DESKTOP NAVBAR */}
          <nav className="sticky top-0 z-40 bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[#EAE4D9] shadow-xs hidden md:block">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-deva text-xl text-[#A67C52] font-bold">ॐ</span>
                <span className="font-caslon font-bold text-sm tracking-wider text-[#2C2C2C]">LUMINA HARMONY</span>
              </div>

              <div className="flex gap-1 h-full py-2 font-sans">
                {[
                  { id: "home", label: "Dashboard App", icon: Home },
                  { id: "library", label: "Library Catalogue", icon: BookOpen },
                  { id: "highlights", label: "Second Brain (Sparks)", icon: Sparkles },
                  { id: "wisdom", label: "Wisdom Center", icon: Compass },
                  { id: "profile", label: "Profile & Focus", icon: BookMarked }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`relative px-4 h-full flex items-center gap-2 font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                        isSelected ? "text-[#A67C52]" : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                      {isSelected && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A67C52]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* CORE VIEW RENDERING */}
          <main className="flex-1 max-w-7xl mx-auto p-4 md:p-8 w-full">
            
            {/* FOCUS OVERLAY minimal pane */}
            {isFocusMode ? (
              <section className="py-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="max-w-xl mx-auto bg-[#F5EEDC] p-8 md:p-12 rounded-3xl border border-[#E8DFC8] space-y-8 shadow-sm">
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="font-bold text-[#A67C52] uppercase tracking-widest text-xs">🧘 Focus Sanctuary Zone</span>
                    <button 
                      onClick={() => setIsFocusMode(false)}
                      className="text-gray-500 hover:text-black hover:bg-black/5 p-1 rounded-full text-xs font-bold font-sans uppercase tracking-wider"
                    >
                      Exit Area
                    </button>
                  </div>

                  {/* Interactive breathing ball */}
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div 
                        className={`w-32 h-32 rounded-full bg-[#A67C52]/20 border-2 border-[#A67C52] flex items-center justify-center transition-all duration-[4000ms] ${focusBreathingState === "in" ? "scale-140 bg-[#A67C52]/30 shadow-indigo-200" : "scale-100 bg-[#A67C52]/10"}`}
                      >
                        <span className="font-caslon text-[#5A5A40] font-bold text-sm uppercase tracking-widest animate-pulse">
                          {focusBreathingState === "in" ? "Breathe In" : "Breathe Out"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 font-literata italic">Focus is the quiet center of the intellect. Sink your attention with the cosmic pulse.</p>
                  </div>

                  {/* Built-in minimal Pomodoro */}
                  <div className="border-t pt-6 space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest block text-neutral-400">Pomodoro Timer</span>
                    <div className="font-mono text-3xl font-bold tracking-tight text-[#2C2C2C]">
                      {String(pomoMinutes).padStart(2, "0")}:{String(pomoSeconds).padStart(2, "0")}
                    </div>
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => setIsPomoRunning(!isPomoRunning)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${isPomoRunning ? "bg-red-500 text-white" : "bg-[#A67C52] text-white"}`}
                      >
                        {isPomoRunning ? "Pause" : "Start Reading"}
                      </button>
                      <button 
                        onClick={handleResetPomodoro}
                        className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <AnimatePresence mode="wait">
                
                {/* 1. HOME VIEW */}
                {activeTab === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    {/* Left area cards */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Interactive banner of Daily Quote */}
                      <div className="bg-[#F5EEDC] rounded-2xl p-6 border border-[#E8DFC8] space-y-4 relative overflow-hidden shadow-xs">
                        <div className="absolute right-0 top-0 p-6 text-[#A67C52]/5 text-7xl font-caslon font-bold">
                          DAILY
                        </div>
                        <div className="space-y-2 relative z-10">
                          <span className="text-[9px] bg-[#A67C52] text-[#FDFCF8] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest font-sans inline-block">
                            Daily Stoic Quote
                          </span>
                          <blockquote className="font-literata text-sm md:text-base text-neutral-800 leading-relaxed font-semibold italic">
                            "The soul becomes dyed with the color of its thoughts. Inspect the thoughts you entertain and you will find the house you live in."
                          </blockquote>
                          <cite className="text-xs font-bold text-[#A67C52] block not-italic">— Marcus Aurelius, Meditations</cite>
                        </div>

                        <div className="flex items-center gap-2 pt-2 relative z-10 text-xs border-t border-black/5">
                          <button 
                            onClick={() => handleOpenWallpaperModalForQuote("The soul becomes dyed with the color of its thoughts.", "Marcus Aurelius")}
                            className="bg-white/80 hover:bg-[#A67C52] hover:text-white px-3 py-1.5 border rounded-lg font-bold flex items-center gap-1 text-[#5A5A40] transition-all cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" /> Open Wallpaper Canvas
                          </button>
                        </div>
                      </div>

                      {/* Reading goals meters Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Streak Progress */}
                        <div className="bg-white border rounded-xl p-5 flex items-center gap-4 shadow-xs">
                          <div className="w-12 h-12 bg-[#F5EEDC] rounded-full flex items-center justify-center text-[#A67C52] font-bold text-xl">
                            🔥
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B7E6D] block">Reading Streak Status</span>
                            <div className="font-caslon text-lg font-bold text-[#2C2C2C]">14 Days Active</div>
                            <p className="text-[11px] opacity-75">Daily target: read 15 mins. Keep up the high score!</p>
                          </div>
                        </div>

                        {/* Interactive Mood Recommendations */}
                        <div className="bg-[#4A4A33] border rounded-xl p-5 text-white space-y-3 shadow-xs relative">
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#EAE4D9]/80 block">Aesthetic Intelligence</span>
                            <h3 className="font-caslon text-md font-bold">Mood Recommendations</h3>
                          </div>
                          
                          <div className="flex gap-1.5 flex-wrap">
                            {["Restless", "Insomnia Night", "Stressed", "Curious"].map(m => (
                              <button
                                key={m}
                                onClick={() => setSelectedMood(m)}
                                className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer transition-all ${selectedMood === m ? "bg-white text-emerald-950 font-black shadow-sm" : "bg-white/15 text-white"}`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                          
                          <div className="text-[11px] text-[#EAE4D9]/90 bg-white/5 p-2 rounded leading-relaxed border border-white/5 space-y-1">
                            <span className="font-bold uppercase text-[9px] tracking-wider text-[#A67C52]">Tailored Texts:</span>
                            <p className="italic">
                              {moodRecommendations[selectedMood as keyof typeof moodRecommendations].join(" · ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Resume Reading Card Container */}
                      <div className="bg-white border p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
                        <div className="space-y-1">
                          <span className="text-[9px] bg-neutral-100 text-[#A67C52] px-2 py-0.5 rounded uppercase font-bold tracking-widest font-sans inline-block">
                            Continue Reading
                          </span>
                          <h3 className="font-caslon text-base font-bold text-neutral-900">Meditations</h3>
                          <p className="text-xs text-neutral-500 font-literata">By Emperor Marcus Aurelius · Chapter IV · 74% Completed</p>
                          {/* Progress bar */}
                          <div className="w-56 h-1 bg-neutral-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-[#A67C52]" style={{ width: "74%" }}></div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleOpenReader({ name: "Meditations", lang: "Latin / English", by: "Marcus Aurelius", links: [] })}
                          className="px-4 py-2 bg-[#A67C52] hover:bg-[#8B7E6D] text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                        >
                          Resume Chapter IV
                        </button>
                      </div>

                      {/* Recommended Book catalog scroll panel */}
                      <div className="space-y-3">
                        <h3 className="font-caslon text-base font-bold text-neutral-800 uppercase tracking-wide">
                          Recommended Classics For You
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {flattenedBooks.slice(0, 4).map((book, bIdx) => (
                            <div 
                              key={bIdx}
                              onClick={() => handleOpenReader(book)}
                              className="bg-[#FDFCF8] border border-neutral-200 hover:border-[#A67C52] p-4 rounded-xl flex flex-col justify-between transition-all cursor-pointer group shadow-xs hover:-translate-y-1"
                            >
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">
                                  {book.lang}
                                </span>
                                <h4 className="font-caslon text-xs font-bold text-[#2C2C2C] line-clamp-2 leading-snug group-hover:text-[#A67C52]">
                                  {book.name}
                                </h4>
                                {book.devaName && (
                                  <p className="font-deva text-[10px] text-amber-800 leading-tight block">
                                    {book.devaName}
                                  </p>
                                )}
                              </div>
                              <span className="text-[9px] uppercase font-bold tracking-wider text-[#A67C52] mt-4 block">
                                Open Reader →
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right column sidebar widgets */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Circular target checklist */}
                      <div className="bg-white border p-5 rounded-2xl space-y-3 shadow-xs">
                        <span className="font-caslon text-xs font-bold text-[#2C2C2C] uppercase tracking-wider block border-b pb-2">
                          🎯 Reading Goal Progress
                        </span>
                        
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between font-medium">
                            <span>Vedic Chants of the week</span>
                            <span className="font-bold text-[#A67C52]">3 / 4 completed</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Stoic Reflection sessions</span>
                            <span className="font-bold text-[#A67C52]">6 / 7 completed</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Sanskrit Vocabulary Flashcards</span>
                            <span className="font-bold text-green-600">Finished! (15/15)</span>
                          </div>
                        </div>

                        <div className="bg-[#F5EEDC] p-3 rounded-lg border text-[11px] leading-relaxed text-neutral-800 font-literata italic">
                          "You are quietly compounding wisdom. High-speed scrolling leads to chaos; systematic scripture contemplation leads to peace."
                        </div>
                      </div>

                      {/* New Arrivals list card */}
                      <div className="bg-[#4A4A33] text-[#FDFCF8] p-5 rounded-2xl space-y-3 shadow-xs">
                        <span className="font-caslon text-xs text-[#EAE4D9] font-bold uppercase tracking-wider block">
                          ✨ Wisdom New Arrivals
                        </span>

                        <div className="space-y-2 text-xs">
                          <div className="border-b border-white/10 pb-2">
                            <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-black inline-block mb-1">
                              NEW SAGE
                            </span>
                            <p className="font-bold">Ashtavakra Gita Redaction</p>
                            <span className="text-[10px] opacity-75">Sanskrit verse translations by Sri Aurobindo.</span>
                          </div>

                          <div>
                            <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-black inline-block mb-1">
                              HISTORIC
                            </span>
                            <p className="font-bold">The Republic of Plato (Ancient Greek)</p>
                            <span className="text-[10px] opacity-75">Parallel textual commentary of Socrates dialogues side by side.</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 2. LIBRARY DIRECTORY */}
                {activeTab === "library" && (
                  <motion.div
                    key="library"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-6"
                  >
                    {/* General segment picker controls */}
                    <div className="bg-[#F5EEDC] p-4 rounded-2xl border border-[#E8DFC8] space-y-4 shadow-xs">
                      
                      {/* Search box & filter layout */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="text"
                            placeholder="Type to filter Sanskrit, Latin or Hindi archives..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-xs p-2.5 pl-9 border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A67C52] text-black"
                          />
                          {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Custom sector categories slide drop */}
                        <div className="md:col-span-3">
                          <select 
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full text-xs p-2.5 border bg-white rounded-lg focus:outline-none"
                          >
                            <option value="all">🌐 All Languages</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Sanskrit">Sanskrit</option>
                            <option value="English">English</option>
                          </select>
                        </div>

                        <div className="md:col-span-3 flex items-center justify-between bg-white text-xs p-2.5 rounded-lg border font-bold">
                          <span>🔖 Bookmarks:</span>
                          <span className="text-[#A67C52] font-black">{bookmarks.length} saved</span>
                        </div>
                      </div>

                      {/* Sliding Category Filter Strip */}
                      <div className="space-y-1 pt-1 border-t border-black/5">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Traditional Collections:</span>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                          <button 
                            onClick={() => setSelectedCategory("all")}
                            className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-all ${selectedCategory === "all" ? "bg-[#A67C52] text-white shadow-xs" : "bg-white border text-neutral-700"}`}
                          >
                            All Collections
                          </button>
                          {Object.entries(ALL_CATEGORIES).map(([key, item]) => (
                            <button
                              key={key}
                              onClick={() => setSelectedCategory(key)}
                              className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-all shrink-0 flex items-center gap-1 ${selectedCategory === key ? "bg-[#A67C52] text-white shadow-xs" : "bg-white border text-neutral-700"}`}
                            >
                              <span>{item.icon}</span> <span>{item.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive library segments tab drawer (Favorites, Reading, Completed, want-to-read) */}
                      <div className="flex gap-1.5 flex-wrap border-t border-black/5 pt-3">
                        {[
                          { id: "all", label: "All Repository Books" },
                          { id: "reading", label: "Currently Reading" },
                          { id: "completed", label: "Completed Texts" },
                          { id: "want", label: "Want to Study" },
                          { id: "favorites", label: "My Favorites ❤️" },
                          { id: "downloaded", label: "Downloaded Offline" }
                        ].map(pill => (
                          <button 
                            key={pill.id}
                            onClick={() => setLibFilter(pill.id as any)}
                            className={`px-3 py-1.5 text-[10px] tracking-wider uppercase font-bold rounded-lg cursor-pointer transition-all ${libFilter === pill.id ? "bg-[#5A5A40] text-white" : "bg-white/50 hover:bg-white text-neutral-800"}`}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>

                    </div>

                    {/* Book lists grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredBooks.map((book, bIdx) => {
                        const isFav = favList.includes(book.name);
                        const isBookmarked = bookmarks.includes(book.name);
                        return (
                          <div
                            key={bIdx}
                            className="bg-white border rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-[#A67C52] transition-colors relative group"
                          >
                            <button 
                              onClick={() => toggleBookmark(book.name)}
                              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-neutral-100 placeholder shadow-xs cursor-pointer z-10"
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "text-[#A67C52] fill-[#A67C52]" : "text-gray-300"}`} />
                            </button>

                            <div className="space-y-2">
                              <span className="text-[8px] bg-[#F5EEDC] text-[#A67C52] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider inline-block">
                                {book.lang}
                              </span>

                              <h4 
                                onClick={() => handleOpenReader(book)}
                                className="font-caslon text-sm font-bold text-neutral-900 group-hover:text-[#A67C52] line-clamp-3 leading-snug cursor-pointer"
                              >
                                {book.name}
                              </h4>

                              {book.devaName && (
                                <p className="font-deva text-xs text-amber-800 leading-tight">
                                  {book.devaName}
                                </p>
                              )}

                              {book.by && (
                                <p className="text-[10px] text-gray-500 italic">
                                  {book.by}
                                </p>
                              )}
                            </div>

                            {/* Actions row */}
                            <div className="border-t pt-3 mt-4 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-[#A67C52]">
                              <button 
                                onClick={() => handleOpenReader(book)}
                                className="hover:underline flex items-center cursor-pointer"
                              >
                                Read Text →
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (favList.includes(book.name)) {
                                    setFavList(favList.filter(f => f !== book.name));
                                  } else {
                                    setFavList([...favList, book.name]);
                                  }
                                }}
                                className="text-gray-400 hover:text-red-500 font-sans p-1"
                              >
                                {isFav ? "❤️ Loved" : "♡ Favorite"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {filteredBooks.length === 0 && (
                      <div className="py-20 text-center space-y-2 border rounded-2xl bg-white text-neutral-500">
                        <BookOpen className="w-10 h-10 mx-auto opacity-50" />
                        <p className="font-bold text-sm">No Scripture matched filters.</p>
                        <p className="text-xs">Try resetting or modifying categories/search queries.</p>
                      </div>
                    )}

                  </motion.div>
                )}

                {/* 3. HIGHLIGHTS & MANUAL THOUGHTS */}
                {activeTab === "highlights" && (
                  <motion.div
                    key="highlights"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    
                    {/* Left details highlights list */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="bg-[#F5EEDC] p-4 rounded-xl border border-[#E8DFC8] flex items-center justify-between gap-4 flex-wrap shadow-xs">
                        <div className="space-y-1">
                          <h2 className="font-caslon text-base font-bold text-[#2C2C2C] uppercase tracking-wide">💡 Second Brain Highlights</h2>
                          <p className="text-xs text-neutral-600 font-literata">Annotate passages from scriptures and compile insights dynamically.</p>
                        </div>
                        
                        <div className="flex gap-1.5 shrink-0">
                          <button 
                            onClick={triggerExportHighlightsPDF}
                            className="bg-[#A67C52] text-white px-3.5 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer shadow-xs"
                          >
                            Export to PDF
                          </button>
                        </div>
                      </div>

                      {/* Search box & filter tag pills */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="relative md:col-span-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input 
                            type="text" 
                            placeholder="Search highlights text or book name..." 
                            value={highlightsSearch}
                            onChange={(e) => setHighlightsSearch(e.target.value)}
                            className="w-full text-xs p-2 bg-white border rounded p-1.5 pl-9 text-black focus:outline-none"
                          />
                        </div>

                        <select 
                          value={activeHighlightTagFilter}
                          onChange={(e) => setActiveHighlightTagFilter(e.target.value)}
                          className="text-xs border p-2 bg-white rounded focus:outline-none"
                        >
                          <option value="all">📁 Filter Tag: All</option>
                          <option value="Facts">Facts (Blue)</option>
                          <option value="Quotes">Quotes (Yellow)</option>
                          <option value="Insights">Insights (Green)</option>
                          <option value="Debates">Debates (Red)</option>
                        </select>
                      </div>

                      {/* Highlights Scroll items */}
                      <div className="space-y-4">
                        {filteredHighlights.map((hl) => {
                          const tagColors = {
                            Facts: "bg-blue-100 text-blue-900 border-blue-400",
                            Quotes: "bg-yellow-100 text-yellow-900 border-yellow-400",
                            Insights: "bg-green-100 text-green-900 border-green-400",
                            Debates: "bg-red-100 text-red-900 border-red-400"
                          };
                          return (
                            <div 
                              key={hl.id}
                              className={`p-5 rounded-2xl border-l-4 bg-white border ${tagColors[hl.colorTag]} shadow-xs space-y-3 relative group`}
                            >
                              <button 
                                onClick={() => deleteHighlight(hl.id)}
                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-60 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                                title="Delete highlight"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="flex gap-2 items-center text-[10px] uppercase tracking-widest font-bold font-sans">
                                <span className={`px-2 py-0.5 rounded ${tagColors[hl.colorTag]}`}>
                                  {hl.colorTag}
                                </span>
                                <span className="opacity-75">
                                  📖 {hl.bookName} {hl.author ? `(${hl.author})` : ""}
                                </span>
                              </div>

                              <p className="font-literata text-xs md:text-sm leading-relaxed text-neutral-800 font-medium italic">
                                "{hl.text}"
                              </p>

                              {hl.note && (
                                <div className="p-3 rounded bg-neutral-50/50 border-t text-[11px] font-sans text-neutral-600 block mt-2">
                                  <strong>Reflection:</strong> {hl.note}
                                </div>
                              )}

                              <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold opacity-60 font-sans border-t pt-2">
                                <span>Saved from reader</span>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleOpenWallpaperModalForQuote(hl.text, hl.bookName)}
                                    className="hover:text-[#A67C52] cursor-pointer"
                                  >
                                    🎨 Wallpaper
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {filteredHighlights.length === 0 && (
                          <div className="p-12 text-center text-xs opacity-60 bg-white border border-dashed rounded-xl">
                            No accumulated thoughts found. Open standard books to highlight sentences.
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right manual thoughts creation card widget */}
                    <div className="lg:col-span-4 space-y-6">
                      <form onSubmit={handleAddManualHighlight} className="bg-white border-2 border-[#E8DFC8] p-5 rounded-2xl space-y-4 shadow-xs">
                        <span className="font-caslon text-xs font-bold text-[#A67C52] uppercase tracking-wider block border-b pb-2">
                          ✍️ Manual Second Brain Entry
                        </span>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">Book/Thought Source Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Self Meditation diary..."
                            value={newManualHighlightBook}
                            onChange={(e) => setNewManualHighlightBook(e.target.value)}
                            className="w-full text-xs p-2 border bg-white rounded focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">Core Statement / High-value Quote</label>
                          <textarea 
                            required
                            rows={3}
                            placeholder="Enter the phrase or concept accurately..."
                            value={newManualHighlightText}
                            onChange={(e) => setNewManualHighlightText(e.target.value)}
                            className="w-full text-xs p-2 border bg-white rounded focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">Analysis reflection note</label>
                          <input 
                            type="text" 
                            placeholder="Append optional interpretation..."
                            value={newManualHighlightNote}
                            onChange={(e) => setNewManualHighlightNote(e.target.value)}
                            className="w-full text-xs p-2 border bg-white rounded focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block mb-1">Color tagging group</label>
                          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold font-sans uppercase">
                            {[
                              { id: "Facts", label: "Fact-Blue" },
                              { id: "Quotes", label: "Quote-Yellow" },
                              { id: "Insights", label: "Insight-Green" },
                              { id: "Debates", label: "Debate-Red" }
                            ].map(tagOpts => (
                              <button
                                type="button"
                                key={tagOpts.id}
                                onClick={() => setNewManualHighlightTag(tagOpts.id as any)}
                                className={`p-1.5 border text-center rounded block cursor-pointer transition-all ${newManualHighlightTag === tagOpts.id ? "bg-[#A67C52] text-white border-[#A67C52]" : "bg-neutral-50 text-neutral-800"}`}
                              >
                                {tagOpts.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2 bg-[#A67C52] hover:bg-[#8B7E6D] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                        >
                          Append Manual Spark
                        </button>
                      </form>

                      {/* Cumulative stats card */}
                      <div className="bg-[#4A4A33] text-white p-5 rounded-2xl text-center space-y-2.5">
                        <span className="text-xl">ॐ</span>
                        <h4 className="font-caslon text-xs font-bold">Generative Smart Synthesis</h4>
                        <p className="text-[11px] text-[#F5F2ED]/80 leading-relaxed font-literata italic">
                          "Your brain compiles fragments. Wisdom matches insights to generate custom micro-lessons, building context on ancient and modern resilience models."
                        </p>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 4. WISDOM PORTAL */}
                {activeTab === "wisdom" && (
                  <motion.div
                    key="wisdom"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    
                    {/* Scenery daily quote header */}
                    <div className="bg-[#5A5A40] text-white p-6 md:p-8 rounded-3xl border-2 border-[#A67C52] relative overflow-hidden shadow-sm text-center space-y-4">
                      <div className="absolute top-0 right-0 p-8 text-white/5 text-9xl font-deva font-black select-none pointer-events-none">
                        ॐ
                      </div>
                      
                      <div className="space-y-2 relative z-10">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#FDFCF8] bg-white/10 px-3 py-1 rounded-full inline-block">
                          Wisdom of the ancients
                        </span>
                        
                        <div className="min-h-[70px] flex items-center justify-center">
                          <blockquote className="font-literata text-base md:text-lg max-w-2xl leading-relaxed italic text-[#EAE4D9] font-medium">
                            "{WISDOM_QUOTES[wisdomActiveQuoteCategory][wisdomQuoteIndex]?.text}"
                          </blockquote>
                        </div>
                        <cite className="font-bold text-xs text-amber-300 block not-italic">
                          — {WISDOM_QUOTES[wisdomActiveQuoteCategory][wisdomQuoteIndex]?.author}
                        </cite>
                      </div>

                      {/* Scenic action row */}
                      <div className="flex justify-center items-center gap-4 flex-wrap text-xs pt-4 border-t border-white/10 relative z-10 font-bold uppercase tracking-wider text-[10px]">
                        <button 
                          onClick={() => handleOpenWallpaperModalForQuote(
                            WISDOM_QUOTES[wisdomActiveQuoteCategory][wisdomQuoteIndex].text, 
                            WISDOM_QUOTES[wisdomActiveQuoteCategory][wisdomQuoteIndex].author
                          )}
                          className="bg-white/10 hover:bg-[#A67C52] text-white px-3 py-1.5 rounded-lg border border-white/20 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          🎨 Save Wallpaper
                        </button>

                        <button 
                          onClick={() => {
                            setWisdomAudioPlaying(!wisdomAudioPlaying);
                            if (!wisdomAudioPlaying) {
                              setAppAlert("🔊 Streaming simulated audio quote wisdom. Enjoy the zen frequencies.");
                              setTimeout(() => setAppAlert(""), 4000);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${wisdomAudioPlaying ? "bg-[#A67C52] border-transparent text-white animate-pulse" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" /> 
                          {wisdomAudioPlaying ? "Tuning Zen Voice..." : "Listen to Wisdom"}
                        </button>
                      </div>
                    </div>

                    {/* Quotation Rotate Category Selector */}
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block text-center font-sans">
                        Filter Quotes category to rotate wisdom:
                      </span>
                      
                      <div className="flex gap-2 justify-center flex-wrap">
                        {Object.keys(WISDOM_QUOTES).map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              setWisdomActiveQuoteCategory(cat as any);
                              setWisdomQuoteIndex(0);
                            }}
                            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all uppercase tracking-wider ${wisdomActiveQuoteCategory === cat ? "bg-[#A67C52] text-white shadow-xs scale-105" : "bg-white border text-[#2C2C2C] hover:bg-neutral-50"}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-center gap-2 items-center text-xs">
                        <button
                          onClick={() => {
                            const max = WISDOM_QUOTES[wisdomActiveQuoteCategory].length;
                            setWisdomQuoteIndex(prev => (prev === 0 ? max - 1 : prev - 1));
                          }}
                          className="px-3 py-1.5 bg-neutral-100 uppercase tracking-widest font-sans rounded hover:bg-neutral-200 border cursor-pointer inline-block"
                        >
                          ← PREVIOUS QUOTE
                        </button>
                        <span className="font-bold">Quote {wisdomQuoteIndex + 1} of {WISDOM_QUOTES[wisdomActiveQuoteCategory].length}</span>
                        <button
                          onClick={() => {
                            const max = WISDOM_QUOTES[wisdomActiveQuoteCategory].length;
                            setWisdomQuoteIndex(prev => (prev === max - 1 ? 0 : prev + 1));
                          }}
                          className="px-3 py-1.5 bg-neutral-100 uppercase tracking-widest font-sans rounded hover:bg-neutral-200 border cursor-pointer inline-block"
                        >
                          NEXT QUOTE →
                        </button>
                      </div>
                    </div>

                    {/* Multi tradition Wisdom columns (Stoicism, Buddhism, Vedanta, Self-Improvement) */}
                    <div className="space-y-3 pt-4 border-t">
                      <h3 className="font-caslon text-base font-bold text-neutral-800 uppercase tracking-wide text-center">
                        Multi-Tradition Daily contemplation Reflections
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(REFLECTIONS).map(([key, item]) => (
                          <div 
                            key={key}
                            className="bg-[#FDFCF8] border border-[#EAE4D9] p-5 rounded-2xl shadow-xs space-y-3 hover:border-[#A67C52] transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-white bg-[#5A5A40] px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                                {key} contemp.
                              </span>
                              <span className="text-[9px] text-[#A67C52] font-semibold">{item.author}</span>
                            </div>

                            <h4 className="font-caslon text-sm font-bold text-[#2C2C2C]">
                              {item.title}
                            </h4>

                            <p className="font-literata text-xs text-neutral-700 leading-relaxed">
                              {item.text}
                            </p>

                            <p className="border-t pt-2 text-[10px] uppercase font-bold tracking-widest text-[#A67C52] italic font-sans block">
                              ★ Key focus: {item.tagline}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* 5. PROFILE & SYSTEM SETTINGS */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-12 pb-16"
                  >
                    {/* SECTION 1: HERO PROFILE CARD WITH GOLDEN AURA */}
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 text-white p-8 md:p-12 shadow-2xl border border-slate-800/40">
                      {/* Decorative glowing particles & glass circles */}
                      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-40 -left-25 w-120 h-110 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
                        {/* Interactive Portrait Avatar with Golden Pulse */}
                        <div className="relative group cursor-pointer" onClick={() => setEditProfileOpen(true)}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full blur-md opacity-70 group-hover:opacity-100 group-hover:scale-115 transition-all duration-500 animate-pulse" />
                          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-inner">
                            {customAvatar ? (
                              <img 
                                src={customAvatar} 
                                alt={profileName} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-3xl md:text-4xl font-serif text-amber-300 tracking-wider">
                                {profileName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                              </span>
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                              <span className="text-[10px] uppercase tracking-widest font-bold">Edit Portrait</span>
                            </div>
                          </div>
                          
                          {/* Streak Badge Overlay */}
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-amber-300/20">
                            <Flame className="w-3.5 h-3.5 animate-bounce fill-amber-300" />
                            <span>{profileStreakCount}d</span>
                          </div>
                        </div>

                        {/* Identity Copy */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 dark:bg-slate-800/60 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-300 border border-white/5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Sanctuary Initiate
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif tracking-tight font-medium text-slate-100">
                              {profileName}
                            </h2>
                            <p className="text-sm font-sans text-slate-400 tracking-wide">
                              {profileTitle}
                            </p>
                          </div>

                          {/* Dynamic Contemplative Quote */}
                          <div className="relative max-w-xl mx-auto md:mx-0 py-3 border-l-2 border-amber-400/30 pl-4 bg-white/5 rounded-r-xl">
                            <p className="italic text-slate-300 text-xs md:text-sm leading-relaxed">
                              "Knowing yourself is the beginning of all wisdom. He who conquers himself is mightiest."
                            </p>
                            <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 block mt-1.5">
                              — Selected Contemplation Trigger
                            </span>
                          </div>
                        </div>

                        {/* Quick Trigger Buttons */}
                        <div className="flex flex-wrap md:flex-col gap-2 mt-4 md:mt-0">
                          <button 
                            onClick={() => setEditProfileOpen(true)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-semibold rounded-xl tracking-wider transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Edit Identity
                          </button>
                          <button 
                            onClick={() => {
                              setSettingsModalOpen(true);
                              setActiveSettingsPane("appearance");
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans text-xs font-bold rounded-xl tracking-wider transition-all duration-300 shadow-xl shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Sanctuary Settings
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: WISDOM IDENTITY CARD (BENTO BLOCK) */}
                    <div className="space-y-4">
                      <h3 className="text-xs uppercase tracking-widest font-bold text-[#A67C52] dark:text-amber-400">
                        Section II: Wisdom Identity Matrix
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                          { 
                            val: 200 + completedList.length * 2, 
                            label: "Volumes Finished", 
                            icon: BookCheck, 
                            color: "from-amber-500/10 to-amber-600/5 text-amber-700 dark:text-amber-300" 
                          },
                          { 
                            val: (600 + highlights.length * 1.5).toFixed(0), 
                            label: "Hours Studying", 
                            icon: Clock, 
                            color: "from-blue-500/10 to-indigo-600/5 text-indigo-700 dark:text-indigo-300" 
                          },
                          { 
                            val: highlights.length, 
                            label: "Sparks Saved", 
                            icon: Sparkles, 
                            color: "from-purple-500/10 to-pink-600/5 text-purple-700 dark:text-purple-300",
                            isSubValue: true
                          },
                          { 
                            val: 800 + highlights.length * 3, 
                            label: "Gleanings & Notes", 
                            icon: FileText, 
                            color: "from-emerald-500/10 to-teal-600/5 text-emerald-700 dark:text-emerald-300" 
                          },
                          { 
                            val: 10 + completedList.length, 
                            label: "Systems Mastered", 
                            icon: Trophy, 
                            color: "from-orange-500/10 to-red-600/5 text-red-700 dark:text-red-300" 
                          }
                        ].map((stat, idx) => (
                          <motion.div 
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between space-y-3`}
                          >
                            <div className="flex justify-between items-center">
                              <stat.icon className="w-5 h-5 opacity-80" />
                              <span className="text-[10px] font-mono font-bold bg-white/80 dark:bg-slate-800/70 p-0.5 px-2 rounded-full border border-black/5">
                                LIVE
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-3xl font-bold font-mono tracking-tight block">
                                {Number(stat.val).toLocaleString()}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider font-bold opacity-75 block leading-tight">
                                {stat.label}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* LEFT COLUMN: CONTINUE READING & WISDOM DNA */}
                      <div className="lg:col-span-8 space-y-8">
                        
                        {/* SECTION 3: CONTINUE READING (APPLE BOOKS DESIGN) */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400">
                              Section III: Current Devotion
                            </span>
                            <span className="text-[10px] text-neutral-400 uppercase font-mono">
                              Vite Reader Instance
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Premium Book Spine Representation */}
                            <div className="w-28 h-40 bg-gradient-to-br from-amber-700 to-amber-950 rounded-r-xl shadow-xl flex flex-col justify-between p-3 text-white border-l-4 border-amber-900 relative shrink-0 overflow-hidden group">
                              <div className="absolute inset-y-0 left-1 w-2 bg-white/5 pointer-events-none" />
                              <span className="text-[8px] uppercase tracking-widest font-serif opacity-60">Sanskrit Core</span>
                              <span className="font-serif font-bold text-xs text-amber-100 leading-snug tracking-wide line-clamp-3">
                                Bhagavad Gita
                              </span>
                              <div className="flex justify-between items-center pt-2 border-t border-white/15">
                                <span className="text-[8px] font-mono">Ch. II</span>
                                <span className="text-[10px]">ॐ</span>
                              </div>
                            </div>

                            {/* Book Info and Progress Slider */}
                            <div className="flex-1 space-y-4 w-full">
                              <div className="space-y-1.5 text-center sm:text-left">
                                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1 px-2.5 rounded-md border border-amber-100 dark:border-amber-900/40">
                                  Karma & Jnana Yoga
                                </span>
                                <h4 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">
                                  Bhagavad Gita: Divine Dialogues
                                </h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                  Krishna's sublime teachings expounded on the edge of the great battlefield.
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                                  <span>System Progress</span>
                                  <span className="font-bold text-slate-700 dark:text-slate-200">76%</span>
                                </div>
                                <div className="w-full h-2 bg-neutral-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: "76%" }} />
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                                  <span>24 of 100 Chapters Read</span>
                                  <span>Approx. 1.5 Hrs Remaining</span>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => {
                                    setAppAlert("📖 Synchronizing with Gita digital scroll... Entering deep reader.");
                                    setTimeout(() => {
                                      setAppAlert("");
                                      setSelectedReaderBook({ name: "Bhagavad Gita", lang: "Sanskrit", links: [] });
                                    }, 1500);
                                  }}
                                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-sans text-xs font-bold rounded-xl tracking-wider transition-all duration-300 hover:scale-[1.01]"
                                >
                                  Resume Scholastic Session
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 4: WISDOM DNA (INTERACTIVE DUAL BREAKDOWN) */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400 block">
                                Section IV: Wisdom DNA Analysis
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                Interactive philosophical framework weighting
                              </span>
                            </div>
                            <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-[9px] font-bold font-mono uppercase rounded-full">
                              Fully Consolidated
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            {/* Radial/Bar chart representation via Recharts */}
                            <div className="md:col-span-5 flex justify-center h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                  cx="50%" 
                                  cy="50%" 
                                  innerRadius="30%" 
                                  outerRadius="100%" 
                                  barSize={10} 
                                  data={[
                                    { name: "Osho", uv: 10, fill: "#10b981" },
                                    { name: "Psychology", uv: 10, fill: "#3b82f6" },
                                    { name: "Buddhism", uv: 20, fill: "#ec4899" },
                                    { name: "Vedanta", uv: 25, fill: "#f59e0b" },
                                    { name: "Stoicism", uv: 35, fill: "#6366f1" }
                                  ]}
                                >
                                  <RadialBar
                                    background
                                    dataKey="uv"
                                    cornerRadius={5}
                                  />
                                  <Tooltip />
                                </RadialBarChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Clickable Section Selection Grid */}
                            <div className="md:col-span-7 space-y-3">
                              <p className="text-[11px] text-neutral-400">
                                Click a school of wisdom below to isolate current library focus, harvested quotes, and associated deep insights:
                              </p>
                              
                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {[
                                  { school: "Stoicism", weight: "35%", color: "bg-indigo-500", border: "border-indigo-100 dark:border-indigo-900" },
                                  { school: "Vedanta", weight: "25%", color: "bg-amber-500", border: "border-amber-100 dark:border-amber-900" },
                                  { school: "Buddhism", weight: "20%", color: "bg-pink-500", border: "border-pink-100 dark:border-pink-900" },
                                  { school: "Psychology", weight: "10%", color: "bg-blue-500", border: "border-blue-100 dark:border-blue-900" },
                                  { school: "Osho", weight: "10%", color: "bg-emerald-500", border: "border-emerald-100 dark:border-emerald-900" }
                                ].map((seg) => (
                                  <button
                                    key={seg.school}
                                    onClick={() => setActiveDNASegment(seg.school as any)}
                                    className={`p-2.5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                                      activeDNASegment === seg.school 
                                        ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-800 dark:border-slate-800 shadow" 
                                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] tracking-wider uppercase font-bold block">{seg.school}</span>
                                      <span className="text-xs font-bold font-mono block opacity-80">{seg.weight}</span>
                                    </div>
                                    <span className={`w-2 h-2 rounded-full ${seg.color}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Dynamic segment details box */}
                          <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/20 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67C52] dark:text-amber-400">
                                Isolated School focus: {activeDNASegment}
                              </span>
                              <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500">
                                Analytical Synthesis View
                              </span>
                            </div>

                            {activeDNASegment === "Stoicism" && (
                              <div className="space-y-2 text-xs">
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  "You have power over your mind - not outside events. Realize this, and you will find strength."
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500 pt-1 font-mono">
                                  <div>Core Companion: <span className="font-bold text-[#A67C52] dark:text-amber-400">Marcus Aurelius</span></div>
                                  <div>Comprehended Texts: <span className="font-bold text-slate-700 dark:text-slate-300">Meditations, Enchiridion</span></div>
                                </div>
                              </div>
                            )}

                            {activeDNASegment === "Vedanta" && (
                              <div className="space-y-2 text-xs">
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  "Absolute non-dual Brahman alone is real; the material universe is a nested relative projection."
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500 pt-1 font-mono">
                                  <div>Core Companion: <span className="font-bold text-[#A67C52] dark:text-amber-400">Adi Shankaracharya</span></div>
                                  <div>Comprehended Texts: <span className="font-bold text-slate-700 dark:text-slate-300">RigVeda, Bhagavad Gita</span></div>
                                </div>
                              </div>
                            )}

                            {activeDNASegment === "Buddhism" && (
                              <div className="space-y-2 text-xs">
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  "Peace comes from absolute internal tranquility and release of thirst. Do not seek outer validation."
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500 pt-1 font-mono">
                                  <div>Core Companion: <span className="font-bold text-[#A67C52] dark:text-amber-400">Gautama Buddha</span></div>
                                  <div>Comprehended Texts: <span className="font-bold text-slate-700 dark:text-slate-300">Dhammapada, Sutta Nipata</span></div>
                                </div>
                              </div>
                            )}

                            {activeDNASegment === "Psychology" && (
                              <div className="space-y-2 text-xs">
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  "Until you make the unconscious conscious, it will direct your life and you will call it fate."
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500 pt-1 font-mono">
                                  <div>Core Companion: <span className="font-bold text-[#A67C52] dark:text-amber-400">Carl Jung</span></div>
                                  <div>Comprehended Texts: <span className="font-bold text-slate-700 dark:text-slate-300">The Undiscovered Self, Archetypes</span></div>
                                </div>
                              </div>
                            )}

                            {activeDNASegment === "Osho" && (
                              <div className="space-y-2 text-xs">
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  "Be realistic: Plan for a miracle. Life is not a technical problem to be solved, but a mystery to be lived."
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500 pt-1 font-mono">
                                  <div>Core Companion: <span className="font-bold text-[#A67C52] dark:text-amber-400">Osho</span></div>
                                  <div>Comprehended Texts: <span className="font-bold text-slate-700 dark:text-slate-300">The Book of Secrets, Courage</span></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* RIGHT COLUMN: RECENT ACHIEVEMENTS & AUDIO BOX */}
                      <div className="lg:col-span-4 space-y-8">
                        
                        {/* SECTION 5: ACHIEVEMENTS SCROLLER */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400">
                              Section V: Intellectual Trophies
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              Unlocked
                            </span>
                          </div>

                          <div className="space-y-3 max-h-[340px] overflow-y-auto no-scrollbar pr-1">
                            {[
                              { emoji: "🎓", title: "First Ascent", desc: "Welcome to the path of wisdom.", unlocked: true },
                              { emoji: "🔥", title: "7-Day Fortitude", desc: "Consistency breeds deep reading insight.", unlocked: true },
                              { emoji: "📚", title: "Century Collector", desc: "Harvested over 100 deep highlights.", unlocked: true },
                              { emoji: "🏛️", title: "Stoic Fortress", desc: "Practiced imperturbable calm assents.", unlocked: true },
                              { emoji: "🧘", title: "Vedantic Pioneer", desc: "Consolidated non-dual Atman truths.", unlocked: false },
                              { emoji: "🌟", title: "Ascetic Sage", desc: "Logged 50 reading completions.", unlocked: false }
                            ].map((ach) => (
                              <div 
                                key={ach.title} 
                                className={`p-3 rounded-xl border flex gap-3 text-xs items-center transition-all ${
                                  ach.unlocked 
                                    ? "bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-800" 
                                    : "bg-neutral-50/40 dark:bg-slate-950/20 border-dashed border-slate-200 dark:border-slate-800/30 opacity-50"
                                }`}
                              >
                                <span className={`text-2xl p-1.5 rounded-lg ${ach.unlocked ? "bg-amber-100 dark:bg-amber-950/50" : "bg-neutral-100 dark:bg-slate-900"}`}>
                                  {ach.emoji}
                                </span>
                                <div className="flex-1 space-y-0.5">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{ach.title}</h4>
                                    <span className="text-[8px] font-mono tracking-wider font-bold uppercase opacity-80">
                                      {ach.unlocked ? "ACTIVE" : "LOCKED"}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug">{ach.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SECTION 9 / WORKSPACE: SERENE focus CONTROL & SOUND BOX */}
                        <div className="bg-[#F8F5F0] dark:bg-slate-900/60 border-2 border-[#EADFC9] dark:border-slate-800/60 p-6 rounded-3xl space-y-5 shadow-sm">
                          <div className="border-b border-[#E3D6BC] dark:border-slate-800 pb-2">
                            <span className="font-serif text-xs font-semibold text-[#A67C52] dark:text-amber-400 uppercase tracking-widest block">
                              Sanctuary Workspace
                            </span>
                          </div>

                          {/* Focus Mode Section */}
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase block">Focus Zone</span>
                              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Hides peripheral options.</span>
                            </div>
                            
                            <button 
                              onClick={() => {
                                setIsFocusMode(!isFocusMode);
                                setAppAlert(isFocusMode ? "💨 Leaving Focus Mode." : "🧘 Focus Mode Activated. Breathe deep.");
                                setTimeout(() => setAppAlert(""), 3000);
                              }}
                              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all border cursor-pointer ${
                                isFocusMode 
                                  ? "bg-[#6B4226] text-white border-[#6B4226]" 
                                  : "bg-white text-gray-800 border-gray-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {isFocusMode ? "ACTIVE" : "ARMED"}
                            </button>
                          </div>

                          {/* Sound Generator integration */}
                          <div className="space-y-3 border-t border-[#E3D6BC] dark:border-slate-800 pt-3">
                            <span className="text-[10px] uppercase font-bold tracking-widest block text-neutral-500">
                              Zen Sound Generator
                            </span>

                            <div className="text-xs space-y-3 bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#E3D6BC] dark:border-slate-800">
                              <div className="flex items-center justify-between">
                                <span className="font-bold truncate text-[#6B4226] dark:text-amber-400">
                                  {AMBIENT_TRACKS.find(t => t.id === ambientChannel)?.name || "Om Temple"}
                                </span>
                                
                                <button
                                  onClick={() => {
                                    setIsAmbientPlaying(!isAmbientPlaying);
                                    if (!isAmbientPlaying) {
                                      setAppAlert("🎵 Tuning focus static frequencies loop... Enjoy.");
                                      setTimeout(() => setAppAlert(""), 4000);
                                    }
                                  }}
                                  className={`p-1.5 rounded-full cursor-pointer transition-all ${
                                    isAmbientPlaying 
                                      ? "bg-green-700 text-white animate-spin" 
                                      : "bg-orange-100 text-orange-900 dark:bg-amber-950 dark:text-amber-300"
                                  }`}
                                >
                                  {isAmbientPlaying ? <Volume2 className="w-4 h-4" /> : "▶ Play Loop"}
                                </button>
                              </div>

                              <select
                                value={ambientChannel}
                                onChange={(e) => setAmbientChannel(e.target.value)}
                                className="w-full text-[11px] border border-neutral-200 p-1.5 bg-neutral-50 rounded-lg dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                              >
                                {AMBIENT_TRACKS.map(track => (
                                  <option key={track.id} value={track.id}>{track.name} ({track.artist})</option>
                                ))}
                              </select>

                              <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                                <span>Vol</span>
                                <input 
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={ambientVolume}
                                  onChange={(e) => setAmbientVolume(Number(e.target.value))}
                                  className="w-full h-1 accent-[#6B4226] bg-neutral-200 rounded cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Pomodoro block */}
                          <div className="border-t border-[#E3D6BC] dark:border-slate-800 pt-3 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">Sanskrit Pomodoro Clock</span>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono font-bold text-sm bg-white dark:bg-slate-950 p-1.5 px-3 rounded-lg border border-[#E3D6BC] dark:border-slate-800 text-slate-800 dark:text-slate-200">
                                {String(pomoMinutes).padStart(2, "0")}:{String(pomoSeconds).padStart(2, "0")}
                              </span>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => setIsPomoRunning(!isPomoRunning)}
                                  className="bg-[#6B4226] hover:bg-[#54341E] text-white p-1.5 px-3 text-[10px] uppercase font-bold rounded-lg cursor-pointer"
                                >
                                  {isPomoRunning ? "Pause" : "Start"}
                                </button>
                                <button 
                                  onClick={handleResetPomodoro}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-slate-800 dark:text-slate-300 p-1.5 px-2 text-[10px] uppercase font-bold rounded-lg cursor-pointer"
                                >
                                  Reset
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>

                    {/* SECTION 6: READING HEATMAP (GITHUB HEATMAP DESIGN) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400 block">
                            Section VI: Daily Learning Heatmap
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Click any square below to record manual reading completions
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono font-bold">
                          <span className="text-slate-800 dark:text-slate-200">{completedStreakDays.length} / 31 Logged Days</span>
                          <span className="text-amber-600 dark:text-amber-400">Streak: {profileStreakCount} Days</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        Golden bricks represent accomplished reading rituals (minimum 5 pages logged). Tap nodes to edit completions for the epoch month cycle:
                      </p>

                      <div className="grid grid-cols-7 sm:grid-cols-10 lg:grid-cols-16 gap-2 text-center">
                        {Array.from({ length: 31 }, (_, i) => {
                          const dayNum = i + 1;
                          const isCompleted = completedStreakDays.includes(dayNum);
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                handleToggleCompletedStreakDay(dayNum);
                                setAppAlert(`📝 Updated reading log entry for Day ${dayNum}.`);
                                setTimeout(() => setAppAlert(""), 2000);
                              }}
                              className={`group relative aspect-square p-2 rounded-lg border text-xs font-black transition-all cursor-pointer select-none font-mono flex flex-col items-center justify-center ${
                                isCompleted
                                  ? "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-400 shadow-md transform scale-102"
                                  : "bg-stone-50 hover:bg-amber-100/50 text-neutral-700 dark:bg-slate-800 dark:hover:bg-slate-800/80 dark:border-slate-800 dark:text-slate-300"
                              }`}
                            >
                              <span>{dayNum}</span>
                              {isCompleted && <span className="text-[8px] absolute top-0.5 right-0.5">🔥</span>}
                              
                              {/* Hover Tooltip tooltip details */}
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-slate-100 text-[9px] font-mono py-1 px-2.5 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none">
                                {isCompleted ? `Day ${dayNum}: Loaded 15 pages (45 mins)` : `Day ${dayNum}: No logs yet`}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-2 border-t border-black/5 dark:border-white/5">
                        <span>Consistency index: Exceptional (94.2%)</span>
                        <div className="flex items-center gap-1">
                          <span>Unlogged</span>
                          <span className="w-2.5 h-2.5 bg-stone-100 dark:bg-slate-800 rounded" />
                          <span className="w-2.5 h-2.5 bg-amber-500 rounded" />
                          <span>Ritual Done</span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 7: MY WISDOM JOURNEY (TIMELINE) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400 block">
                          Section VII: Reading and Wisdom Milestones
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Chronicle of your evolution inside the Wisdom Sanctuary
                        </span>
                      </div>

                      <div className="relative border-l-2 border-[#E7DABE] dark:border-slate-800 pl-6 ml-4 space-y-8">
                        {[
                          { 
                            epoch: "2024 (Initiation)", 
                            title: "Path of Ancient Volumes", 
                            desc: "Downloaded Wisdom, committed to the daily reading streak targets, and consolidated first 20 highlights on Stoicism.", 
                            icon: "ॐ" 
                          },
                          { 
                            epoch: "2025 (Expansion)", 
                            title: "Cross-Traditional Synapse", 
                            desc: "Completed 100 books. Created comparative notes map linking Marcus Aurelius's Assent with Krishna's Karma Yoga.", 
                            icon: "✨" 
                          },
                          { 
                            epoch: "2026 (Philosophy Explorer)", 
                            title: "Deep Non-Dual Alignment", 
                            desc: "Attained Level 18. Mastered basic Sanskrit structures, Advaita commentary books, and configured personalized voice read generators.", 
                            icon: "📜" 
                          },
                          { 
                            epoch: "Current Stage (Wisdom Seeker)", 
                            title: "Sanctuary Devotions Ticker", 
                            desc: "Reading Bhagavad Gita chapter-by-chapter and completing daily 25-minute Pomodoro zen sound breathing cycles.", 
                            icon: "🔥" 
                          }
                        ].map((m, idx) => (
                          <div key={m.epoch} className="relative group">
                            {/* Point Node */}
                            <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-[#6B4226] text-white dark:bg-amber-500 dark:text-slate-950 flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow-sm">
                              {m.icon}
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-[#A67C52] dark:text-amber-400 block tracking-wide uppercase">
                                {m.epoch}
                              </span>
                              <h4 className="text-sm font-serif font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#6B4226] dark:group-hover:text-amber-400 transition-colors">
                                {m.title}
                              </h4>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                {m.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 8: FAVORITE THINKERS */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400 block border-b pb-2">
                          Section VIII: Devoted Philosophers & Companions
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Click any profile below to browse lifetime timeline summaries and cardinal quotes
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                        {[
                          { 
                            name: "Marcus Aurelius", 
                            tradition: "Stoicism", 
                            majorWork: "Meditations", 
                            readCount: "4 Volumes Read", 
                            abbr: "MA", 
                            colorBg: "from-slate-800 to-indigo-950 text-amber-400 border-indigo-900/30",
                            lifeSummary: "A Roman emperor and Stoic philosopher who ruled from 161 to 180 CE. He wrote Meditations on private battlefield campaigns as a journal of self-examination and mental fortress-building.",
                            selectedQuote: "Dwell on the beauty of life. Watch the stars, and run with them."
                          },
                          { 
                            name: "Gautama Buddha", 
                            tradition: "Buddhism", 
                            majorWork: "Tripitaka", 
                            readCount: "8 Volumes Read", 
                            abbr: "GB", 
                            colorBg: "from-rose-900 to-rose-950 text-amber-200 border-rose-900/30",
                            lifeSummary: "A sage from ancient India who attained complete enlightenment under the Bodhi tree. He established Buddhism based on the Four Noble Truths and releasing of inner attachment constraints.",
                            selectedQuote: "Peace comes from within. Do not seek it without."
                          },
                          { 
                            name: "Adi Shankaracharya", 
                            tradition: "Vedanta", 
                            majorWork: "Gita Commentaries", 
                            readCount: "5 Volumes Read", 
                            abbr: "AS", 
                            colorBg: "from-amber-700 to-amber-950 text-amber-200 border-amber-900/30",
                            lifeSummary: "An eighth-century Indian philosopher who walk India to consolidate Advaita Vedanta (non-dualism). He taught that our true self (Atman) is entirely identical to Brahman (ultimate reality).",
                            selectedQuote: "The universe is a relative projection; Atman is identical to Brahman."
                          },
                          { 
                            name: "Lao Tzu", 
                            tradition: "Taoism", 
                            majorWork: "Tao Te Ching", 
                            readCount: "3 Volumes Read", 
                            abbr: "LZ", 
                            colorBg: "from-emerald-800 to-teal-950 text-emerald-300 border-emerald-900/30",
                            lifeSummary: "An ancient Chinese philosopher credited with composing the Tao Te Ching. He emphasizes Wu Wei (effortless action) and yielding to the natural current of the universe.",
                            selectedQuote: "Nature does not hurry, yet everything is accomplished."
                          },
                          { 
                            name: "Seneca", 
                            tradition: "Stoicism", 
                            majorWork: "Letters from a Stoic", 
                            readCount: "4 Volumes Read", 
                            abbr: "LS", 
                            colorBg: "from-blue-900 to-slate-900 text-blue-300 border-slate-900/30",
                            lifeSummary: "A Roman statesman and dramatist who advised Emperor Nero. His prolific personal letters explain Stoic methods of navigating crisis, friendship, mortality, and poverty parameters.",
                            selectedQuote: "We suffer more often in imagination than in reality."
                          },
                          { 
                            name: "Patanjali", 
                            tradition: "Classical Yoga", 
                            majorWork: "Yoga Sutras", 
                            readCount: "3 Volumes Read", 
                            abbr: "PJ", 
                            colorBg: "from-cyan-800 to-sky-950 text-cyan-200 border-cyan-900/30",
                            lifeSummary: "The compiler who systematized classical Raja Yoga in the 196 Yoga Sutras. He drafted the classical Eight Limbs of Yoga spanning behavioral restraints to infinite meditative absorptions.",
                            selectedQuote: "Yoga is the complete calming of the ripples of mind-stuff."
                          }
                        ].map((pOpt) => (
                          <div 
                            key={pOpt.name}
                            onClick={() => setSelectedThinker(pOpt)}
                            className="group p-5 rounded-3xl bg-gradient-to-tr from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/50 dark:border-slate-800/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer text-center space-y-4 hover:scale-[1.03]"
                          >
                            <div className={`w-14 h-14 mx-auto bg-gradient-to-tr ${pOpt.colorBg} rounded-full flex items-center justify-center border text-lg font-serif font-bold shadow-inner`}>
                              {pOpt.abbr}
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#6B4226] dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                                {pOpt.name}
                              </h4>
                              <p className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase font-semibold leading-none">
                                {pOpt.tradition}
                              </p>
                              <p className="text-[9px] text-[#A67C52] dark:text-amber-400 font-bold">
                                {pOpt.readCount}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 9: AI SAGE INSIGHTS (PREMIUM GRADIENT CARD) */}
                    <div className="p-[1px] rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-indigo-500 shadow-xl">
                      <div className="bg-white dark:bg-slate-900 rounded-[23px] p-6 space-y-4 relative overflow-hidden">
                        {/* Decorative dynamic neon element */}
                        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-300/10 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400">
                              Section IX: AI Sage Personal Insights
                            </h3>
                          </div>
                          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 text-[9px] font-bold font-mono uppercase rounded-md">
                            Cognitive Engine 3.4
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                          <div className="md:col-span-3 space-y-3">
                            <h4 className="font-serif font-bold text-base text-slate-800 dark:text-slate-100">
                              Synthesis: Non-Dual Action & Practical Resilience
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                              Your reading log demonstrates rare intellectual agility: you are currently braiding Western Stoicism discipline (Marcus Aurelius/Seneca) alongside Eastern non-dual inquiry platforms (Vedanta/Gita). By coupling Patanjali's concentration exercises with Seneca's cognitive preparedness guidelines, you are compiling tools for systemic clarity under high pressure.
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                              <span className="font-semibold text-amber-700 dark:text-amber-400">Sage Recommendation:</span> Browse <span className="font-bold underline cursor-pointer">Sankhya Karika</span> next. It outlines the dual analytical metaphysics that serves as the blueprint foundation for Patanjali's meditation codes.
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 justify-center h-full text-center">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] text-neutral-400 block font-mono">Consolidation index</span>
                              <span className="text-2xl font-bold font-mono block text-[#6B4226] dark:text-amber-400">96.8 / 100</span>
                            </div>
                            <button 
                              onClick={() => {
                                setAppAlert("⚡ Compiling your second-brain highlights logs into deep learning models...");
                                setTimeout(() => {
                                  setAppAlert("✅ Core reading weights updated! Matrix refreshed.");
                                  setTimeout(() => setAppAlert(""), 1500);
                                }, 2000);
                              }}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-sans text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                            >
                              Refresh Sage analysis
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 10: READING ANALYTICS (CHART PANELS) */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400 block border-b pb-2">
                          Section X: Reading & Study Analytics Engine
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Dynamic statistics derived from daily sanctuary reflections and bookmarks
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Books Read per month (Bar Chart) */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-3xl space-y-4 shadow-sm">
                          <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                              📚 Volumes Read / Month
                            </span>
                          </div>
                          <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { label: "Jan", val: 5 },
                                { label: "Feb", val: 8 },
                                { label: "Mar", val: 12 },
                                { label: "Apr", val: 6 },
                                { label: "May", val: 14 },
                                { label: "Jun", val: 10 }
                              ]}>
                                <XAxis dataKey="label" fontSize={9} axisLine={false} tickLine={false} />
                                <YAxis fontSize={9} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="val" fill="#CFA15A" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Study Hours spent (Area Chart) */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-3xl space-y-4 shadow-sm">
                          <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                              ⏳ Reading Hours
                            </span>
                          </div>
                          <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={[
                                { label: "Jan", val: 24 },
                                { label: "Feb", val: 30 },
                                { label: "Mar", val: 40 },
                                { label: "Apr", val: 28 },
                                { label: "May", val: 56 },
                                { label: "Jun", val: 48 }
                              ]}>
                                <XAxis dataKey="label" fontSize={9} axisLine={false} tickLine={false} />
                                <YAxis fontSize={9} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="val" stroke="#6b4226" fill="#f5eedc" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Saved highlights comparison (Line Chart) */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-3xl space-y-4 shadow-sm">
                          <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                              💡 Sparks & Notes Harvested
                            </span>
                          </div>
                          <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={[
                                { label: "Jan", val: 12 },
                                { label: "Feb", val: 28 },
                                { label: "Mar", val: 45 },
                                { label: "Apr", val: 32 },
                                { label: "May", val: 68 },
                                { label: "Jun", val: 54 }
                              ]}>
                                <XAxis dataKey="label" fontSize={9} axisLine={false} tickLine={false} />
                                <YAxis fontSize={9} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2.5} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 11: FULL SETTINGS ACCORDION */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#A67C52] dark:text-amber-400 block border-b pb-2">
                          Section XI: System & Sanctuary Settings
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Configure reading fonts, ambient sound tracks, triggers and cloud database exports
                        </span>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-12">
                          {/* Inner settings tabs */}
                          <div className="md:col-span-3 bg-stone-50 dark:bg-slate-950/40 border-r border-slate-200/50 dark:border-slate-800 p-4 space-y-1">
                            {[
                              { id: "account", label: "Identity & Level", icon: User },
                              { id: "appearance", label: "Appearance Theme", icon: Sun },
                              { id: "reading", label: "Reading Options", icon: SlidersHorizontal },
                              { id: "audio", label: "Audio Soundtrack", icon: Volume2 },
                              { id: "notifications", label: "Reflection Alarms", icon: Bell },
                              { id: "privacy", label: "Vault Security", icon: Shield },
                              { id: "data", label: "Export Second Brain", icon: FileDown },
                              { id: "about", label: "About Wisdom", icon: Info }
                            ].map((pane) => (
                              <button
                                key={pane.id}
                                onClick={() => setActiveSettingsPane(pane.id as any)}
                                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                                  activeSettingsPane === pane.id
                                    ? "bg-[#6B4226] text-white dark:bg-amber-500 dark:text-slate-950"
                                    : "text-slate-600 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/5"
                                }`}
                              >
                                <pane.icon className="w-4 h-4 shrink-0" />
                                <span>{pane.label}</span>
                              </button>
                            ))}
                          </div>

                          {/* Inner settings content form */}
                          <div className="md:col-span-9 p-6 space-y-4 bg-white dark:bg-slate-900">
                            
                            {activeSettingsPane === "account" && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] dark:text-amber-400 border-b pb-2">
                                  Personal Profile Identity
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Scholar Full Name</label>
                                    <input 
                                      type="text" 
                                      value={profileName}
                                      onChange={(e) => setProfileName(e.target.value)}
                                      className="w-full max-w-md p-2.5 border border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-xs rounded-lg text-slate-800 dark:text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Wisdom Status Level</label>
                                    <input 
                                      type="text" 
                                      value={profileTitle}
                                      onChange={(e) => setProfileTitle(e.target.value)}
                                      className="w-full max-w-md p-2.5 border border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-xs rounded-lg text-slate-800 dark:text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Simulated Starting Streak</label>
                                    <input 
                                      type="number" 
                                      value={profileStreakCount}
                                      onChange={(e) => setProfileStreakCount(Math.max(0, parseInt(e.target.value, 10)))}
                                      className="w-full max-w-md p-2.5 border border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-xs rounded-lg text-slate-800 dark:text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeSettingsPane === "appearance" && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] dark:text-amber-400 border-b pb-2">
                                  Website Theme Settings
                                </h4>
                                <p className="text-xs text-neutral-400">
                                  Toggle between eyes-healthy parchment or high-contrast midnight slate view:
                                </p>
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => {
                                      setThemeMode("light");
                                      setAppAlert("☀️ Adjusted to golden light theme.");
                                      setTimeout(() => setAppAlert(""), 1500);
                                    }}
                                    className={`p-4 rounded-xl border flex-1 text-center space-y-1 cursor-pointer transition-all ${
                                      themeMode === "light" 
                                        ? "bg-[#6B4226]/10 text-[#6B4226] border-[#6B4226]" 
                                        : "bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800"
                                    }`}
                                  >
                                    <Sun className="w-6 h-6 mx-auto" />
                                    <span className="text-xs font-bold uppercase tracking-wider block">Light Parchment</span>
                                    <span className="text-[9px] opacity-75 block">Traditional Ancient Codex</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setThemeMode("dark");
                                      setAppAlert("🌙 Switched to absolute dark theme.");
                                      setTimeout(() => setAppAlert(""), 1500);
                                    }}
                                    className={`p-4 rounded-xl border flex-1 text-center space-y-1 cursor-pointer transition-all ${
                                      themeMode === "dark" 
                                        ? "bg-amber-500/10 text-amber-500 border-amber-500" 
                                        : "bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800"
                                    }`}
                                  >
                                    <Moon className="w-6 h-6 mx-auto" />
                                    <span className="text-xs font-bold uppercase tracking-wider block">Midnight Dark</span>
                                    <span className="text-[9px] opacity-75 block">OLED Midnight Starfield</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {activeSettingsPane === "reading" && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] dark:text-amber-400 border-b pb-2">
                                  Reader View options
                                </h4>
                                <div className="space-y-3 text-xs">
                                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-lg">
                                    <span>Vite PDF.js Rendering Mode</span>
                                    <span className="font-mono font-bold">Standard Page Scrolling</span>
                                  </div>
                                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-lg">
                                    <span>Force PDF Download On Tap</span>
                                    <span className="text-green-600 font-bold">DISABLED</span>
                                  </div>
                                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-lg">
                                    <span>High Contrast Accent Highlight</span>
                                    <span className="text-[#A67C52] dark:text-amber-400 font-bold">GOLDEN BELL</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeSettingsPane === "audio" && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] dark:text-amber-400 border-b pb-2">
                                  Vocal Companion Audio Spindle
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold">Voice Read speed multiplier: {readingAudioSpeed}x</span>
                                    <div className="flex gap-1">
                                      {[0.8, 1.0, 1.2, 1.5, 2.0].map(s => (
                                        <button
                                          key={s}
                                          onClick={() => setReadingAudioSpeed(s)}
                                          className={`px-2.5 py-1 text-[10px] rounded-lg border font-mono font-bold cursor-pointer transition-all ${
                                            readingAudioSpeed === s 
                                              ? "bg-[#6B4226] text-white" 
                                              : "bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800"
                                          }`}
                                        >
                                          {s}x
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeSettingsPane === "notifications" && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] dark:text-amber-400 border-b pb-2">
                                  Daily Contemplation Alarms
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <span className="text-xs font-bold block">Evening Reflection Reminder</span>
                                      <span className="text-[10px] text-neutral-400">Notifies you at 9:30 PM to log current page completions.</span>
                                    </div>
                                    <span className="text-xs font-bold font-mono p-1 px-3 bg-[#6B4226]/10 text-[#6B4226] rounded-md">
                                      9:30 PM
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeSettingsPane === "privacy" && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] dark:text-amber-400 border-b pb-2">
                                  Second Brain Vault Security
                                </h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between items-center">
                                    <span>Local Device Encrypted Caching</span>
                                    <span className="text-green-600 font-bold">ARMED</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Sync across multiple devices</span>
                                    <span className="text-[#A67C52] font-bold">OFFLINE ONLY</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeSettingsPane === "data" && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] dark:text-amber-400 border-b pb-2">
                                  Export Sanctuary Memory Vault
                                </h4>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                  Your wisdom highlights, bookmark indices, active streaks and companion notes belong strictly to you. Download a copy below:
                                </p>
                                <button
                                  onClick={() => {
                                    setAppAlert("📂 Building backup zip archive of your Second Brain sparks...");
                                    setTimeout(() => {
                                      const payload = {
                                        user: profileName,
                                        title: profileTitle,
                                        streak: profileStreakCount,
                                        highlights: highlights,
                                        readingList: readingList,
                                        completedList: completedList,
                                        bookmarks: bookmarks,
                                        exportedAt: new Date().toISOString()
                                      };
                                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
                                      const downloadAnchor = document.createElement("a");
                                      downloadAnchor.setAttribute("href", dataStr);
                                      downloadAnchor.setAttribute("download", `Wisdom_BrainVault_${profileName.replace(/\s+/g, "_")}.json`);
                                      document.body.appendChild(downloadAnchor);
                                      downloadAnchor.click();
                                      downloadAnchor.remove();
                                      setAppAlert("✅ Backup JSON file downloaded successfully!");
                                      setTimeout(() => setAppAlert(""), 3000);
                                    }, 2000);
                                  }}
                                  className="px-5 py-2.5 bg-green-700 hover:bg-green-600 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-white font-sans text-xs font-bold rounded-xl tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <FileText className="w-4 h-4" />
                                  Download Memory Vault Backup (.JSON)
                                </button>
                              </div>
                            )}

                            {activeSettingsPane === "about" && (
                              <div className="space-y-4 text-xs font-sans text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] dark:text-amber-400 border-b pb-2">
                                  About Wisdom Codex
                                </h4>
                                <p>
                                  Wisdom App combines classical theological study structures alongside interactive highlight synthesis tools. Designed as a modern sanctuary for cognitive stamina and daily reflection.
                                </p>
                                <p className="font-mono">
                                  App Version: 3.4.1 (Vite/TypeScript Premium Edition)<br />
                                  System Node: Active Sanctuary Container Sandbox<br />
                                  Database: Offline Encrypted Local Vault
                                </p>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    </div>

                    {/* INTERACTIVE COMPANION DETAILS DIALOG POPULAR OVERLAY */}
                    {selectedThinker && (
                      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 border-2 border-[#A67C52] dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 animate-in zoom-in-95 duration-200">
                          
                          <div className="flex justify-between items-center border-b pb-3">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-serif font-black flex items-center justify-center text-sm border border-amber-200">
                                {selectedThinker.abbr}
                              </span>
                              <div>
                                <h3 className="font-serif font-black text-lg text-slate-800 dark:text-slate-100">
                                  {selectedThinker.name}
                                </h3>
                                <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-neutral-400">
                                  Tradition: {selectedThinker.tradition}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedThinker(null)}
                              className="text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-full cursor-pointer"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>

                          <div className="space-y-4 text-xs">
                            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl">
                              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider font-mono">Biographical Gist</span>
                              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                {selectedThinker.lifeSummary}
                              </p>
                            </div>

                            <div className="space-y-1.5 p-4 border border-dashed border-[#A67C52]/30 rounded-2xl bg-amber-50/20">
                              <span className="text-[10px] uppercase font-bold text-[#A67C52] dark:text-amber-400 tracking-wider font-mono">Cardinal Contemplation</span>
                              <p className="italic font-serif text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                                "{selectedThinker.selectedQuote}"
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-[10px] text-neutral-500">
                              <div>Key Text: <span className="font-bold text-[#A67C52]">{selectedThinker.majorWork}</span></div>
                              <div>Completed: <span className="font-bold text-slate-700 dark:text-slate-200">{selectedThinker.readCount}</span></div>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedThinker(null)}
                            className="w-full py-2.5 bg-[#6B4226] text-white dark:bg-amber-500 dark:text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            Return to Companion List
                          </button>
                        </div>
                      </div>
                    )}

                    {/* EDIT PROFILE DIALOG SLIDE OVERLAY */}
                    {editProfileOpen && (
                      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 border-2 border-[#A67C52] dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 animate-in zoom-in-95 duration-200">
                          
                          <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="font-serif font-black text-lg text-[#6B4226] dark:text-amber-400 uppercase tracking-wide">
                              Update Identity Codex
                            </h3>
                            <button
                              onClick={() => setEditProfileOpen(false)}
                              className="text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-full cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-4 text-xs font-sans">
                            <div className="space-y-1">
                              <label className="block font-bold text-neutral-400 uppercase">Scholar Identity Name</label>
                              <input 
                                type="text"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-200"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block font-bold text-neutral-400 uppercase">Wisdom Level & Status</label>
                              <input 
                                type="text"
                                value={profileTitle}
                                onChange={(e) => setProfileTitle(e.target.value)}
                                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-200"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block font-bold text-neutral-400 uppercase">Custom Portrait URL (HTTPS)</label>
                              <input 
                                type="text"
                                value={customAvatar}
                                onChange={(e) => setCustomAvatar(e.target.value)}
                                placeholder="Leave empty for generic portrait monogram initials"
                                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-200"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block font-bold text-neutral-400 uppercase">Dynamic Streak Target</label>
                              <input 
                                type="number"
                                value={profileStreakCount}
                                onChange={(e) => setProfileStreakCount(Math.max(0, parseInt(e.target.value, 10)))}
                                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-200"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditProfileOpen(false);
                                setAppAlert("✅ Scholar identity cached and verified!");
                                setTimeout(() => setAppAlert(""), 1500);
                              }}
                              className="flex-1 py-2.5 bg-[#6B4226] text-white dark:bg-amber-500 dark:text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                            >
                              Verify & Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            )}

          </main>

          {/* DYNAMIC HEIGHT WALLPAPER MODAL GEN IF OPENED */}
          {showWallpaperModal && (
            <div className="fixed inset-0 z-50 bg-[#12120C]/85 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 border-2 border-[#A67C52] max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-200 font-sans">
                
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-xs uppercase text-[#A67C52] tracking-widest font-sans">
                    🎨 Scenic Quote Wallpaper Canvas
                  </h3>
                  <button 
                    onClick={() => setShowWallpaperModal(false)}
                    className="text-gray-400 hover:text-black p-0.5 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-[10px] text-neutral-500">
                  Select color textures and fonts to generate an eye-care contemplation graphic instantly:
                </p>

                {/* Simulated Live render preview block */}
                <div 
                  className={`w-full min-h-[160px] p-6 rounded-2xl flex flex-col justify-between text-center select-none transition-all duration-300 border shadow-xs ${
                    wallpaperBackground === 'midnight' ? 'bg-[#0E1525] text-white border-transparent' :
                    wallpaperBackground === 'gold' ? 'bg-[#D2C2A3] text-stone-900 border-transparent' :
                    wallpaperBackground === 'bamboo' ? 'bg-[#2E3C2B] text-emerald-100 border-transparent' :
                    'bg-[#F2EDDC] text-amber-950 border-[#E4DBC8]'
                  }`}
                >
                  <span className="text-xl opacity-60">ॐ</span>
                  <p 
                    className={`text-xs md:text-sm leading-normal inline-block max-w-xs mx-auto italic font-medium leading-relaxed ${
                      wallpaperFont === 'cinzel' ? 'font-cinzel' :
                      wallpaperFont === 'literata' ? 'font-literata' :
                      wallpaperFont === 'sans' ? 'font-sans' : 'font-caslon'
                    }`}
                  >
                    "{quoteWallpaperText}"
                  </p>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 block pt-4">
                    — {quoteWallpaperAuthor}
                  </span>
                </div>

                {/* Custom selectors layout */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  
                  {/* Colors selector */}
                  <div className="space-y-1">
                    <span className="font-bold opacity-75">Theme Palette:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {[
                        { id: "misty", label: "Parchment" },
                        { id: "midnight", label: "Midnight Clear" },
                        { id: "gold", label: "Golden Bell" },
                        { id: "bamboo", label: "Bamboo Forest" }
                      ].map(bgOpts => (
                        <button
                          key={bgOpts.id}
                          onClick={() => setWallpaperBackground(bgOpts.id as any)}
                          className={`px-2 py-1 border text-[10px] rounded cursor-pointer transition-all ${wallpaperBackground === bgOpts.id ? "bg-[#A67C52] text-white" : "bg-neutral-50 text-neutral-700"}`}
                        >
                          {bgOpts.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fonts selector */}
                  <div className="space-y-1">
                    <span className="font-bold opacity-75">Visual Typo:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {[
                        { id: "caslon", label: "Caslon" },
                        { id: "cinzel", label: "Cinzel" },
                        { id: "literata", label: "Literata" },
                        { id: "sans", label: "Sans" }
                      ].map(fontOpts => (
                        <button
                          key={fontOpts.id}
                          onClick={() => setWallpaperFont(fontOpts.id as any)}
                          className={`px-2 py-1 border text-[10px] rounded cursor-pointer transition-all ${wallpaperFont === fontOpts.id ? "bg-[#A67C52] text-white" : "bg-neutral-50 text-neutral-700"}`}
                        >
                          {fontOpts.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {wallpaperAlert && (
                  <p className="text-[10px] text-green-700 font-bold text-center bg-green-50 p-2 rounded">
                    {wallpaperAlert}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleDownloadWallpaper}
                  className="w-full py-2 bg-[#A67C52] hover:bg-[#8B7E6D] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer block text-center shadow-xs"
                >
                  Generate Content Wallpaper
                </button>
              </div>
            </div>
          )}

          {/* BACK TO TOP ANCHOR */}
          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-20 md:bottom-8 right-6 p-3 bg-[#A67C52] hover:bg-[#8B7E6D] text-[#FDFCF8] rounded-full shadow-lg z-50 cursor-pointer"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          {/* ADAPTIVE MOBILE BOTTOM NAV BAR */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFCF8]/95 backdrop-blur-md border-t border-[#EAE4D9] shadow-lg md:hidden">
            <div className="grid grid-cols-5 h-16 py-1 select-none text-center">
              {[
                { id: "home", label: "Dashboard", icon: Home },
                { id: "library", label: "Library", icon: BookOpen },
                { id: "highlights", label: "Sparks", icon: Sparkles },
                { id: "wisdom", label: "Wisdom", icon: Compass },
                { id: "profile", label: "Sanctuary", icon: BookMarked }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                      isSelected ? "text-[#A67C52]" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                    style={{ minWidth: "44px", minHeight: "44px" }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider font-sans">
                      {item.label === "Dashboard" ? "Home" : item.label === "Sanctuary" ? "Profile" : item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DECENTRALIZED FOOTER */}
          <footer className="bg-[#2C2C1D] text-white/50 text-center py-10 px-4 mt-auto border-t border-[#A67C52] relative z-10">
            <div className="max-w-4xl mx-auto space-y-2">
              <p className="text-xs font-caslon tracking-widest text-[#FDFCF8]/70">
                ALL SACRED COGNIZANCE ARCHES INSPIRED BY <a href="https://vedpuran.net/" target="_blank" rel="noopener noreferrer" className="text-[#A67C52] hover:underline">VEDPURAN.NET</a>
              </p>
              <p className="text-[11px] font-literata italic text-[#EAE4D9]/60 max-w-xl mx-auto">
                "Satyamev Jayate" — Truth Alone Triumphs. Merging systemic ancient scripture structures side-by-side with modern intellectual second brains.
              </p>
              <p className="text-[9px] text-white/20">
                Wisdom Systems · Hindi · Sanskrit · Pali · Latin · English · 5000+ Years Compiled · Premium Edition
              </p>
            </div>
          </footer>
        </>
      )}

    </div>
  );
}
