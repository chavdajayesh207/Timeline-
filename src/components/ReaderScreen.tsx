import React, { useState, useEffect } from "react";
import { 
  BookMarked,
  X,
  Volume2,
  BookmarkCheck,
  Check,
  Send,
  RotateCcw,
  ArrowLeft,
  Bookmark,
  Settings,
  BookOpen,
  CheckCircle,
  HelpCircle
} from "lucide-react";

import { Book as BookType } from "../types";

interface ReaderScreenProps {
  book: BookType;
  onClose: () => void;
  onAddHighlight: (text: string, colorTag: "Facts" | "Quotes" | "Insights" | "Debates", note?: string) => void;
}

export default function ReaderScreen({ book, onClose, onAddHighlight }: ReaderScreenProps) {
  // Reading Customizations
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<"caslon" | "literata" | "sans" | "mono">("literata");
  const [lineHeight, setLineHeight] = useState<number>(1.7);
  const [readerTheme, setReaderTheme] = useState<"light" | "sepia" | "dark">("sepia");
  const [brightness, setBrightness] = useState<number>(90);
  
  // Interactive Overlays
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  
  // Sentence/Paragraph Actions
  const [selectedText, setSelectedText] = useState<string>("");
  const [actionType, setActionType] = useState<"none" | "highlight" | "translate" | "explain" | "dict" | "tts">("none");
  const [noteInput, setNoteInput] = useState<string>("");
  const [colorTag, setColorTag] = useState<"Facts" | "Quotes" | "Insights" | "Debates">("Quotes");
  const [hasSavedHighlight, setHasSavedHighlight] = useState<boolean>(false);
  
  // AI Panel State
  const [aiActiveTab, setAiActiveTab] = useState<"none" | "summary" | "chat" | "flashcards" | "quiz">("none");
  const [aiLoading, setAiActiveLoading] = useState<boolean>(false);

  // Chatbot State
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: `Pranam. I am Wisdom AI, ready to assist your exploration of "${book.name}". Ask me anything about its philosophical context, core ideas, or definitions.` }
  ]);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Array<{ q: string; a: string; flipped: boolean }>>([]);

  // Quiz state
  const [quizQuestions, setQuizQuizQuestions] = useState<Array<{ q: string; opts: string[]; ans: number; selected: number | null }>>([]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Simulated paragraph structures
  const contentParagraphs = [
    `In the deep, silent recesses of library archives, where the dust motes dance in the slanted afternoon light, one finds a specific kind of stillness. It is not the mere absence of sound, but rather the presence of a structured, intentional quiet—an architecture designed to house the echoes of centuries of human thought. To read is to step into this threshold, leaving worldly speed behind.`,
    `The "second brain" is not merely a static repository of facts, but a living garden of associations that requires constant tending and deliberate contemplation. When you highlight a sentence, or append a note, you are compiling cognitive waypoints of your self-exploration. True growth occurs when seemingly separate concepts from Stoicism, Vedanta, or science merge.`,
    `Marcus Aurelius beautifully observed that the unexamined mind builds its own distress. "The soul becomes dyed with the color of its thoughts. Inspect the thoughts you entertain and you will find the house you live in." By managing the discipline of assent—refusing to let irrational immediate impressions color your wisdom—deep composure is unlocked.`,
    `Therefore, ancient virtue codes do not contradict modern psychological resilience. Whether studying the RigVeda's acoustic frequencies, the Buddha's analysis of craving, or Socrates' fierce cross-examinations, the core axis remains perfectly aligned: self-mastery is the only immortal path to peace. As we scroll, we are tethered to the same lineage of thinkers who once unrolled papyrus.`
  ];

  // Map theme variables
  const themeClasses = {
    light: "bg-[#FDFCF8] text-[#1B1C19] border-gray-200",
    sepia: "bg-[#F5EEDC] text-[#4A3B2C] border-[#E8DFC8]",
    dark: "bg-[#181F21] text-[#E4E2DD] border-[#2D3335]"
  };

  const fontClasses = {
    caslon: "font-caslon",
    literata: "font-literata",
    sans: "font-sans",
    mono: "font-mono"
  };

  const handleSelectText = (phrase: string) => {
    setSelectedText(phrase);
    setActionType("highlight");
    setHasSavedHighlight(false);
    setNoteInput("");
  };

  // Action widgets handler
  const executeTranslate = () => {
    setActionType("translate");
  };

  const executeExplain = () => {
    setActionType("explain");
  };

  const executeDict = () => {
    setActionType("dict");
  };

  const executeTTS = () => {
    setActionType("tts");
  };

  const handleSaveHighlightAndNote = () => {
    onAddHighlight(selectedText, colorTag, noteInput || undefined);
    setHasSavedHighlight(true);
    setTimeout(() => {
      setActionType("none");
      setSelectedText("");
    }, 1200);
  };

  // AI Operations Toggles
  const handleAiAction = (tab: "summary" | "chat" | "flashcards" | "quiz") => {
    setAiActiveTab(tab);
    setAiActiveLoading(true);
    
    // Simulate smart AI response building
    setTimeout(() => {
      setAiActiveLoading(false);
      
      if (tab === "flashcards") {
        setFlashcards([
          { q: "Atman (आत्मन्)", a: "The inner, immortal Self, identical to the absolute background reality of Brahman.", flipped: false },
          { q: "Wu Wei (无为)", a: "The Taoist concept of alignment with nature, acting effortlessly through spontaneous non-force.", flipped: false },
          { q: "The Discipline of Assent", a: "The Stoic defense of pausing to analyze raw mental impressions before assigning distress to them.", flipped: false }
        ]);
      } else if (tab === "quiz") {
        setQuizQuizQuestions([
          { 
            q: "According to the philosophy of Assent, what are we fully sovereign over?", 
            opts: ["Outer situations and politics", "Our internal judgments and opinions", "Other human reactions", "Universal solar orbits"], 
            ans: 1, 
            selected: null 
          },
          { 
            q: "How does the passage represent the 'Second Brain' system?", 
            opts: ["A folder of disconnected data", "A biological computer chip", "An untended field of code", "A living garden of associations"], 
            ans: 3, 
            selected: null 
          },
          { 
            q: "Who stated: 'The soul is dyed with the color of its thoughts'?", 
            opts: ["Lord Krishna", "Marcus Aurelius", "Gautama Buddha", "Arthur Schopenhauer"], 
            ans: 1, 
            selected: null 
          }
        ]);
        setQuizSubmitted(false);
      }
    }, 1200);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    
    // AI simulated chat response
    setTimeout(() => {
      let reply = "";
      const q = userMsg.toLowerCase();
      if (q.includes("soul") || q.includes("atman") || q.includes("self")) {
        reply = `In "${book.name}", the true core of being is treated not as a physical product, but as Atman (or the eternal observer) which remains unharmed by external forces, mirroring Marcus Aurelius's 'Inner Citadel'.`;
      } else if (q.includes("stoic") || q.includes("marcus") || q.includes("aurelius")) {
        reply = `Marcus Aurelius used his meditations to practice self-honesty, demonstrating that outer turmoil can never touch the inner core unless we actively give consent.`;
      } else {
        reply = `That is an insightful query, pilgrim of thought! Sages teach us that true freedom is the space between the raw stimulus of outer objects and our conscious response. Truly understanding "${book.name}" involves applying this mindfulness to your daily habits.`;
      }
      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 1000);
  };

  const handleSelectQuizOpt = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizQuizQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].selected = optIdx;
      return copy;
    });
  };

  const calculateScore = () => {
    return quizQuestions.filter(q => q.selected === q.ans).length;
  };

  return (
    <div 
      className={`min-h-screen relative flex flex-col font-sans select-text pb-20 ${themeClasses[readerTheme]} transition-colors duration-300`}
      style={{ filter: `brightness(${brightness}%)` }}
    >
      {/* Top action header */}
      <header className={`sticky top-0 z-40 px-4 md:px-6 py-2.5 md:py-4 flex items-center justify-between border-b backdrop-blur-md bg-opacity-90 ${readerTheme === 'dark' ? 'bg-[#181F21]/90' : readerTheme === 'sepia' ? 'bg-[#F5EEDC]/90' : 'bg-[#FDFCF8]/90'}`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            className="p-2 cursor-pointer hover:bg-black/5 rounded-full transition-colors active:scale-95 flex items-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest block opacity-75 font-sans">
              Currently Reading
            </span>
            <h1 className="font-caslon text-md md:text-lg font-bold leading-tight">
              {book.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)} 
            className={`p-2.5 rounded-full cursor-pointer hover:bg-black/5 transition-all duration-200 ${isBookmarked ? "text-[#A67C52]" : "opacity-80"}`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
          </button>

          {/* Settings button */}
          <button 
            onClick={() => setShowConfig(!showConfig)} 
            className={`p-2.5 rounded-full cursor-pointer hover:bg-black/5 transition-colors ${showConfig ? "text-[#A67C52] bg-black/5" : "opacity-80"}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Embedded config panel drawer */}
      {showConfig && (
        <div className="px-4 md:px-6 py-4 md:py-5 border-b flex flex-col gap-4 animate-in slide-in-from-top duration-300 bg-black/5 font-sans">
          <div className="max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Font Size Selector */}
            <div className="space-y-1.5">
              <span className="font-bold uppercase tracking-wider block opacity-75">Font Size: {fontSize}px</span>
              <div className="flex items-center gap-2">
                <span className="text-xs">A-</span>
                <input 
                  type="range" 
                  min="14" 
                  max="28" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[#A67C52] h-1 bg-black/10 rounded"
                />
                <span className="text-base font-bold">A+</span>
              </div>
            </div>

            {/* Line Height Selector */}
            <div className="space-y-1.5">
              <span className="font-bold uppercase tracking-wider block opacity-75">Line Spacing: {lineHeight}x</span>
              <div className="flex gap-2">
                {[1.4, 1.7, 2.0].map((h) => (
                  <button 
                    key={h}
                    onClick={() => setLineHeight(h)}
                    className={`px-3 py-1 border rounded-md font-bold transition-all cursor-pointer ${lineHeight === h ? 'border-[#A67C52] bg-white text-[#A67C52] shadow-sm' : 'border-black/10 text-inherit hover:bg-black/5'}`}
                  >
                    {h === 1.4 ? 'Compact' : h === 1.7 ? 'Comfort' : 'Spacious'}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Selector */}
            <div className="space-y-1.5">
              <span className="font-bold uppercase tracking-wider block opacity-75">Font Family</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "caslon", label: "Caslon Serif" },
                  { id: "literata", label: "Literata Reading" },
                  { id: "sans", label: "Hanken Sans" },
                  { id: "mono", label: "Academic Mono" }
                ].map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setFontFamily(f.id as any)}
                    className={`p-1 px-2 text-[10px] text-center uppercase tracking-wide border rounded transition-all cursor-pointer ${fontFamily === f.id ? 'border-[#A67C52] bg-white text-[#A67C52]' : 'border-black/10 text-inherit hover:bg-black/5'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme & Brightness Selector */}
            <div className="space-y-1.5">
              <span className="font-bold uppercase tracking-wider block opacity-75">Paper Theme</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setReaderTheme("light")}
                  className={`w-7 h-7 rounded-full bg-[#FDFCF8] border flex items-center justify-center cursor-pointer ${readerTheme === 'light' ? 'ring-2 ring-[#A67C52]' : 'border-gray-300'}`}
                  title="Cream Paper"
                />
                <button 
                  onClick={() => setReaderTheme("sepia")}
                  className={`w-7 h-7 rounded-full bg-[#F5EEDC] border flex items-center justify-center cursor-pointer ${readerTheme === 'sepia' ? 'ring-2 ring-[#A67C52]' : 'border-[#e8dfc8]'}`}
                  title="Aesthetic Sepia"
                />
                <button 
                  onClick={() => setReaderTheme("dark")}
                  className={`w-7 h-7 rounded-full bg-[#181F21] border flex items-center justify-center cursor-pointer ${readerTheme === 'dark' ? 'ring-2 ring-[#A67C52]' : 'border-gray-800'}`}
                  title="Eye Care Charcoal"
                />
                {/* Brightness progress */}
                <div className="flex-grow flex items-center gap-1.5">
                  <span>☼</span>
                  <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    value={brightness} 
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-1 accent-[#A67C52] bg-black/10 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content viewport split */}
      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Left Column: Interactive reading paragraphs */}
        <section className={`lg:col-span-8 p-4 md:p-10 space-y-8 select-text overflow-y-auto max-h-[85vh] scrollbar-none`}>
          <div className="text-center font-sans tracking-widest text-xs uppercase opacity-75 py-2">
            ॐ CHAPTER IV · THE CITADEL OF WISDOM ॐ
          </div>

          <div 
            className={`space-y-6  reading-surface ${fontClasses[fontFamily]} text-justify tracking-wide leading-relaxed`}
            style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          >
            {contentParagraphs.map((paraText, pIdx) => {
              // Convert text to clickable hover sentences
              const sentences = paraText.split(". ").filter(s => s.trim().length > 0);
              return (
                <p key={pIdx} className="relative first-letter:text-4xl first-letter:font-caslon first-letter:text-[#A67C52] first-letter:mr-2">
                  {sentences.map((sentence, sIdx) => {
                    const fullSentence = sentence.endsWith('.') ? sentence : `${sentence}.`;
                    const isSelected = selectedText === fullSentence;
                    return (
                      <span 
                        key={sIdx}
                        onClick={() => handleSelectText(fullSentence)}
                        className={`hover:bg-[#A67C52]/20 cursor-pointer rounded-sm px-0.5 transition-all decoration-[#8B7E6D] hover:underline underline-offset-4 ${isSelected ? 'bg-[#A67C52]/30 ring-2 ring-[#A67C52]/50 font-medium' : ''}`}
                        title="Click to highlight, translate, or explain"
                      >
                        {fullSentence}{" "}
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </div>

          {/* Interactive sentence popover */}
          {selectedText && (
            <div className={`p-4 rounded-xl border-2 font-sans text-xs bg-white text-[#2C2C2C] shadow-lg animate-in fade-in slide-in-from-bottom duration-300 space-y-3`}>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-[#A67C52] tracking-wider uppercase font-sans">
                  💡 Selection Action Pad
                </span>
                <button 
                  onClick={() => setSelectedText("")} 
                  className="text-gray-400 hover:text-black p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="italic text-gray-700 bg-gray-50 p-2.5 rounded-lg border-l-4 border-gray-400 font-literata text-xs">
                "{selectedText}"
              </p>

              {/* Control triggers */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button 
                  onClick={() => setActionType("highlight")}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${actionType === 'highlight' ? 'bg-[#A67C52] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  📝 Save Highlight
                </button>
                <button 
                  onClick={executeTranslate}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${actionType === 'translate' ? 'bg-[#A67C52] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  🌐 Translate
                </button>
                <button 
                  onClick={executeExplain}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${actionType === 'explain' ? 'bg-[#A67C52] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  🤖 Explain Clause
                </button>
                <button 
                  onClick={executeDict}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${actionType === 'dict' ? 'bg-[#A67C52] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  📖 Dictionary
                </button>
                <button 
                  onClick={executeTTS}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${actionType === 'tts' ? 'bg-[#A67C52] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  🔊 Speak Text
                </button>
              </div>

              {/* Dynamic Action Sub-Areas */}
              {actionType === "highlight" && (
                <div className="space-y-3 bg-[#FDFCF8] p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold opacity-75">Category Color Tag:</span>
                    <div className="flex gap-2">
                      {(["Facts", "Quotes", "Insights", "Debates"] as const).map(tag => {
                        const colors = {
                          Facts: "bg-blue-500",
                          Quotes: "bg-yellow-400",
                          Insights: "bg-green-500",
                          Debates: "bg-red-500"
                        };
                        return (
                          <button 
                            key={tag}
                            onClick={() => setColorTag(tag)}
                            className={`px-2 py-0.5 rounded text-[10px] text-white font-bold flex items-center gap-1 cursor-pointer transition-all ${colors[tag]} ${colorTag === tag ? 'ring-2 ring-neutral-900 ring-offset-1 scale-105' : 'opacity-70'}`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <input 
                    type="text"
                    placeholder="Append a reflection/note to your second brain... (optional)"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full border rounded p-2 text-xs text-neutral-800 placeholder-neutral-400 bg-white"
                  />

                  <button 
                    onClick={handleSaveHighlightAndNote}
                    disabled={hasSavedHighlight}
                    className="w-full py-2 bg-[#A67C52] hover:bg-[#8B7E6D] text-white rounded font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    {hasSavedHighlight ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added to Sparks & Highlights!
                      </>
                    ) : (
                      "Save to Wisdom Brain"
                    )}
                  </button>
                </div>
              )}

              {actionType === "translate" && (
                <div className="bg-amber-50/50 p-3 rounded-lg text-xs leading-relaxed space-y-1.5 border border-amber-200">
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>Sanskrit Translation (संस्कृतम्):</span>
                    <span className="text-[10px] text-amber-800">Hindi Devata Included</span>
                  </div>
                  <p className="font-deva text-sm font-semibold text-center text-amber-900">
                    "अन्तःकरणस्य संयमः एव परमं ज्ञानम्, तेनैव च परमं शान्तिः प्राप्यते।"
                  </p>
                  <p className="text-[11px] font-sans text-gray-600 block mt-1">
                    <strong>Hindi equivalent:</strong> "भीतरी मन का नियमन ही वास्तविक ज्ञान है, और इसके द्वारा ही शाश्वत शांति की प्राप्ति होती है।"
                  </p>
                </div>
              )}

              {actionType === "explain" && (
                <div className="bg-blue-50/50 p-3 rounded-lg text-xs leading-relaxed space-y-1 border border-blue-200 text-blue-950 font-sans">
                  <div className="font-bold text-blue-800 flex items-center gap-1">
                    <span>⚡ Wisdom AI Core Insight:</span>
                  </div>
                  <p>
                    This statement emphasizes cognitive self-responsibility. It aligns perfectly with modern **Cognitive Behavioral Therapy (CBT)**, showing that our emotional dysregulation stems not from external facts, but from internal definitions we give immediately to those events. By pausing the automatic reaction cycle, we preserve absolute agency.
                  </p>
                </div>
              )}

              {actionType === "dict" && (
                <div className="bg-purple-50/50 p-3 rounded-lg text-xs leading-relaxed space-y-1.5 border border-purple-200 text-purple-950 font-sans">
                  <div className="font-bold text-purple-800 flex justify-between">
                    <span>🔤 Ancient & Modern Glossary Definition:</span>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Witness Consciousness (Atman / Sakshi):</strong> The space of passive observation that remains separate from active thoughts.</p>
                    <p><strong>Discipline of Assent:</strong> The active filter (in Epictetus and Stoic codes) that evaluates automatic anxiety responses before confirming them as valid reality.</p>
                  </div>
                </div>
              )}

              {actionType === "tts" && (
                <div className="bg-green-50/50 p-3 rounded-lg text-xs leading-relaxed border border-green-200 flex items-center justify-between">
                  <div className="space-y-1 text-green-950">
                    <span className="font-bold text-green-800">🔊 Interactive Speech Synth</span>
                    <p className="text-[10px] text-green-700">English Voice Coach (Female - Serene Voice Pitch)</p>
                  </div>
                  <button className="px-4 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded font-bold animate-pulse flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> Speak
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right Column: AI Helpers Sidebar Desk Panel */}
        <section className={`lg:col-span-4 p-5 lg:border-l flex flex-col justify-start max-h-[85vh] overflow-y-auto`}>
          <div className="border-b pb-3 mb-4 space-y-1 font-sans">
            <h2 className="font-bold text-sm text-[#A67C52] uppercase tracking-wider flex items-center gap-1.5 font-sans">
              ✨ Wisdom AI Reading Companion
            </h2>
            <p className="text-[11px] opacity-75">Connect highlights, explore summaries, or test your comprehension.</p>
          </div>

          {/* AI Tab Selector Pills */}
          <div className="grid grid-cols-4 gap-1 mb-4 text-[10px] font-bold font-sans">
            {[
              { id: "summary", label: "Chapter Summary" },
              { id: "chat", label: "Ask Sage AI" },
              { id: "flashcards", label: "Key Cards" },
              { id: "quiz", label: "Comprehension Quiz" }
            ].map((col) => (
              <button 
                key={col.id}
                onClick={() => handleAiAction(col.id as any)}
                className={`p-1.5 tracking-tighter uppercase rounded transition-all cursor-pointer text-center ${aiActiveTab === col.id ? 'bg-[#A67C52] text-white shadow-sm' : 'bg-black/5 hover:bg-black/10'}`}
              >
                {col.label === "Chapter Summary" ? "Summary" : col.label === "Ask Sage AI" ? "Chat AI" : col.label === "Key Cards" ? "Cards" : "Quiz"}
              </button>
            ))}
          </div>

          {/* Dynamic AI Tab Display content */}
          <div className="flex-1 bg-black/5 rounded-xl p-4 overflow-y-auto max-h-[60vh] space-y-4">
            
            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-center text-xs opacity-75">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#A67C52] animate-spin"></div>
                <p className="font-deva mt-2">ॐ Chanting mantras to load truth panels...</p>
              </div>
            ) : aiActiveTab === "none" ? (
              <div className="py-12 text-center text-xs space-y-3 opacity-60">
                <BookOpen className="w-8 h-8 text-[#A67C52] mx-auto opacity-70" />
                <p>Click any pill selector above to engage the generative AI reading copilot.</p>
              </div>
            ) : aiActiveTab === "summary" ? (
              <div className="text-xs space-y-3 font-sans leading-relaxed text-inherit">
                <h3 className="font-bold text-[#A67C52] text-xs">📝 Core Summarization Checklist</h3>
                <ul className="list-disc pl-4 space-y-2 opacity-90">
                  <li><strong>The Architecture of Quiet:</strong> Establishes that reading is a sacred mental threshold, demanding high-contrast spacing and silence to filter noisy modern communications.</li>
                  <li><strong>Active Concept Connectors:</strong> Highlights that a reading list becomes a 'Second Brain' only when Vedanta, Stoicism, and behavioral self-control form a unified personal blueprint.</li>
                  <li><strong>Assent Regulation:</strong> Outlines the core Stoic and psychological tools required to analyze rapid negative mental impressions before giving consent into Atman's citadel.</li>
                </ul>
                <div className="bg-[#A67C52]/10 p-2.5 rounded-lg italic text-[11px]">
                  "Wisdom composite: Silence is the outer canvas; inner mindfulness is the ink."
                </div>
              </div>
            ) : aiActiveTab === "chat" ? (
              <div className="flex flex-col h-full gap-3 font-sans">
                <div className="space-y-2 text-[11px] overflow-y-auto max-h-[35vh]">
                  {chatMessages.map((msg, mIdx) => (
                    <div 
                      key={mIdx} 
                      className={`p-2 rounded-lg leading-normal ${msg.sender === 'user' ? 'bg-[#A67C52] text-white self-end ml-6' : 'bg-white text-gray-800 border self-start mr-6'}`}
                    >
                      <p><strong>{msg.sender === 'user' ? 'You' : 'Companion'}:</strong> {msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1.5 mt-auto pt-2">
                  <input 
                    type="text"
                    placeholder="Ask about Atman, Stoics, or quotes..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1 text-xs border rounded p-1.5 focus:outline-none bg-white text-black"
                  />
                  <button 
                    onClick={sendChatMessage}
                    className="bg-[#A67C52] text-white px-3 max-h-8 rounded flex items-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : aiActiveTab === "flashcards" ? (
              <div className="space-y-4 font-sans text-xs">
                <h3 className="font-bold text-[#A67C52] mb-1">🧠 Second Brain Key Terminology</h3>
                <p className="text-[10px] opacity-75">Click a card below to flip and inspect the absolute definition.</p>
                <div className="space-y-3">
                  {flashcards.map((card, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setFlashcards(prev => {
                        const copy = [...prev];
                        copy[idx].flipped = !copy[idx].flipped;
                        return copy;
                      })}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 min-h-[90px] flex flex-col justify-center text-center ${card.flipped ? 'bg-[#A67C52] text-white border-[#A67C52]' : 'bg-white text-neutral-800 hover:border-[#A67C52] border-gray-200 shadow-sm'}`}
                    >
                      {card.flipped ? (
                        <p className="italic leading-normal font-sans text-[11px]">{card.a}</p>
                      ) : (
                        <p className="font-bold text-xs uppercase tracking-wide">{card.q}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Quiz Active
              <div className="space-y-4 font-sans text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[#A67C52]">🎯 Comprehension Assessment</h3>
                  {quizSubmitted && (
                    <span className="font-bold bg-[#A67C52]/20 text-[#A67C52] px-2 py-0.5 rounded">
                      Score: {calculateScore()}/3
                    </span>
                  )}
                </div>

                <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                  {quizQuestions.map((qItem, qIdx) => (
                    <div key={qIdx} className="space-y-2 border-b pb-3 last:border-0 border-black/5">
                      <p className="font-bold leading-tight">{qIdx + 1}. {qItem.q}</p>
                      <div className="flex flex-col gap-1.5">
                        {qItem.opts.map((opt, optIdx) => {
                          const isSelected = qItem.selected === optIdx;
                          const showCorrect = quizSubmitted && qItem.ans === optIdx;
                          const showWrong = quizSubmitted && isSelected && qItem.ans !== optIdx;

                          let bgClass = "bg-white text-gray-800 hover:bg-neutral-100 border border-neutral-200";
                          if (isSelected) bgClass = "bg-[#A67C52]/20 text-[#A67C52] border-[#A67C52]";
                          if (showCorrect) bgClass = "bg-green-100 text-green-900 border-green-400 font-semibold";
                          if (showWrong) bgClass = "bg-red-100 text-red-900 border-red-300 line-through";

                          return (
                            <button 
                              key={optIdx}
                              onClick={() => handleSelectQuizOpt(qIdx, optIdx)}
                              className={`p-2 rounded text-left transition-all cursor-pointer text-[11px] leading-snug ${bgClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {quizSubmitted ? (
                  <button 
                    onClick={() => handleAiAction("quiz")}
                    className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Re-take Assessment
                  </button>
                ) : (
                  <button 
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizQuestions.some(q => q.selected === null)}
                    className="w-full py-2 bg-[#A67C52] disabled:opacity-50 hover:bg-[#8B7E6D] text-white rounded font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Submit Answers
                  </button>
                )}
              </div>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}
