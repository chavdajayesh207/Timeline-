(function () {
  'use strict';

  // High Quality Pre-Seeded Classic wisdom nodes updated for our advanced structure
  const DEFAULT_HIGHLIGHTS = [
    {
      id: "hl_seeded_1",
      bookId: "seeded_meditations",
      bookTitle: "Meditations",
      author: "Marcus Aurelius",
      chapter: "Book IV",
      text: "The universe is change; our life is what our thoughts make it.",
      note: "Fundamental Pillar of Stoic practice. Perspective dictates the quality of conscious experience.",
      color: "yellow", // Important
      type: "highlight",
      folder: "Philosophy",
      tags: ["Stoicism", "Mindset", "Wisdom"],
      isFavorite: true,
      isPinned: true,
      date: "2026-06-10"
    },
    {
      id: "hl_seeded_2",
      bookId: "seeded_freud",
      bookTitle: "The Interpretation of Dreams",
      author: "Sigmund Freud",
      chapter: "P. 124",
      text: "A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.",
      note: "Fascinating cognitive bias. Familiarity breeds illusory truth effect.",
      color: "blue", // Action Item / facts
      type: "highlight",
      folder: "Study",
      tags: ["Cognitive Bias", "Psychology"],
      isFavorite: false,
      isPinned: false,
      date: "2026-06-10"
    },
    {
      id: "hl_seeded_3",
      bookId: "seeded_asamanthinketh",
      bookTitle: "As a Man Thinketh",
      author: "James Allen",
      chapter: "Chapter 2",
      text: "Every action you take is a vote for the type of person you wish to become.",
      note: "James Allen meets James Clear. Habits are local proofs of personal identity.",
      color: "green", // Wisdom
      type: "note",
      folder: "Philosophy",
      tags: ["Habits", "Action", "Identity"],
      isFavorite: true,
      isPinned: false,
      date: "2026-06-10"
    },
    {
      id: "hl_seeded_4",
      bookId: "seeded_gitanjali",
      bookTitle: "Gitanjali",
      author: "Rabindranath Tagore",
      chapter: "Verse 35",
      text: "Where the mind is without fear and the head is held high; Where knowledge is free.",
      note: "### Synthesis\nStunning vision of dynamic intellectual emancipation, paired with spiritual focus.",
      color: "red", // Revision
      type: "bookmark",
      folder: "Quotes",
      tags: ["Vedas", "Spiritual", "Poetry"],
      isFavorite: false,
      isPinned: false,
      date: "2026-06-10"
    }
  ];

  let currentHighlights = [];
  let activeBookId = null;
  let editingHighlightId = null;
  let selectedTextGlobal = '';
  let activeBookHub = null;
  let activeShareId = null;
  let currentAIOutput = '';

  // Active attachment state inside note creation modal template
  let currentAttachment = null; // { name, type, data: base64 }
  let currentImage = null; // base64

  // Active filter state variables
  let currentSearchQuery = '';
  let currentFilterType = 'all'; // all, highlight, note, bookmark, favorite, recent
  let currentFilterFolder = 'all'; // all, Philosophy, Business, etc.
  let currentSortOrder = 'recent'; // recent, older, book

  // Color mapping with specific user-requested meanings
  const COLOR_MAP = {
    yellow: { bg: 'bg-yellow-400', border: 'border-yellow-200', text: 'text-yellow-600', selection: 'selection:bg-yellow-100/30', dot: 'bg-yellow-400', labelTitle: 'Important' },
    green: { bg: 'bg-green-400', border: 'border-green-200', text: 'text-green-600', selection: 'selection:bg-green-100/30', dot: 'bg-green-400', labelTitle: 'Wisdom' },
    blue: { bg: 'bg-blue-400', border: 'border-blue-200', text: 'text-blue-500', selection: 'selection:bg-blue-100/30', dot: 'bg-blue-300', labelTitle: 'Action Item' },
    purple: { bg: 'bg-purple-400', border: 'border-purple-200', text: 'text-purple-500', selection: 'selection:bg-purple-100/30', dot: 'bg-purple-400', labelTitle: 'Question' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-200', text: 'text-orange-500', selection: 'selection:bg-orange-100/30', dot: 'bg-orange-500', labelTitle: 'Favorite' },
    red: { bg: 'bg-red-400', border: 'border-red-200', text: 'text-red-500', selection: 'selection:bg-red-100/30', dot: 'bg-red-400', labelTitle: 'Revision' }
  };

  // Upgraded IndexedDB loading with legacy LocalStorage auto-migration
  async function initHighlights() {
    try {
      if (!window.LuminaDB) {
        throw new Error("LuminaDB IndexedDB helper not loaded.");
      }
      
      let notes = await window.LuminaDB.getNotes();
      
      // Upgrade step: Migrate from localStorage if database store is empty, or seed defaults
      if (notes.length === 0) {
        const stored = localStorage.getItem('lumina_highlights_v1');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            for (let note of parsed) {
              await window.LuminaDB.saveNote(note);
            }
            notes = await window.LuminaDB.getNotes();
          } catch (e) {
            console.error("Local storage note restore mismatch", e);
          }
        }
        
        // Still empty? Seed pre-defined defaults
        if (notes.length === 0) {
          for (let note of DEFAULT_HIGHLIGHTS) {
            await window.LuminaDB.saveNote(note);
          }
          notes = await window.LuminaDB.getNotes();
        }
      }

      currentHighlights = notes.map(hl => ({
        type: hl.type || 'highlight',
        folder: hl.folder || 'Philosophy',
        tags: Array.isArray(hl.tags) ? hl.tags : (hl.tags ? hl.tags.split(',').map(t => t.trim()) : []),
        isFavorite: hl.isFavorite || false,
        isPinned: hl.isPinned || false,
        ...hl
      }));

    } catch (err) {
      console.warn("DB init missing or isolated cache container, falling back to local storage:", err);
      const stored = localStorage.getItem('lumina_highlights_v1');
      if (!stored) {
        localStorage.setItem('lumina_highlights_v1', JSON.stringify(DEFAULT_HIGHLIGHTS));
        currentHighlights = [...DEFAULT_HIGHLIGHTS];
      } else {
        try {
          currentHighlights = JSON.parse(stored);
        } catch (e) {
          currentHighlights = [...DEFAULT_HIGHLIGHTS];
        }
      }
    }

    setupListeners();
    setupGlobalSelectionTracker();
    initializeHubFlashcards();
    calculateAndRenderStats();
    renderGlobalHighlights();
    renderWorkspaceHighlights();
    renderBookKnowledgeHubCurrent();
  }

  function getHighlights() {
    return currentHighlights;
  }

  // Live Async state writers
  async function saveNoteToDB(hl) {
    try {
      if (window.LuminaDB) {
        await window.LuminaDB.saveNote(hl);
      }
    } catch (e) {
      console.error("IndexedDB write mismatch:", e);
    }
    // Backward compatibility local storage safety net
    localStorage.setItem('lumina_highlights_v1', JSON.stringify(currentHighlights));
  }

  async function deleteNoteFromDB(id) {
    try {
      if (window.LuminaDB) {
        await window.LuminaDB.deleteNote(id);
      }
    } catch (e) {
      console.error("IndexedDB delete mismatch:", e);
    }
    localStorage.setItem('lumina_highlights_v1', JSON.stringify(currentHighlights));
  }

  function addHighlight(hl) {
    const newHl = {
      id: 'hl_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: hl.type || 'highlight',
      folder: hl.folder || 'Philosophy',
      tags: Array.isArray(hl.tags) ? hl.tags : [],
      isFavorite: hl.isFavorite || false,
      isPinned: hl.isPinned || false,
      ...hl
    };
    currentHighlights.unshift(newHl);
    
    saveNoteToDB(newHl).then(() => {
      calculateAndRenderStats();
      renderGlobalHighlights();
      renderWorkspaceHighlights();
      renderBookKnowledgeHubCurrent();
      
      if (window.updateWisdomCount) {
        window.updateWisdomCount(currentHighlights.length);
      }
    });

    return newHl;
  }

  function updateHighlight(id, updatedFields) {
    currentHighlights = currentHighlights.map(hl => {
      if (hl.id === id) {
        const fullNote = { ...hl, ...updatedFields };
        saveNoteToDB(fullNote);
        return fullNote;
      }
      return hl;
    });

    calculateAndRenderStats();
    renderGlobalHighlights();
    renderWorkspaceHighlights();
    renderBookKnowledgeHubCurrent();
  }

  function deleteHighlight(id) {
    currentHighlights = currentHighlights.filter(hl => hl.id !== id);
    deleteNoteFromDB(id).then(() => {
      calculateAndRenderStats();
      renderGlobalHighlights();
      renderWorkspaceHighlights();
      renderBookKnowledgeHubCurrent();
      
      if (window.updateWisdomCount) {
        window.updateWisdomCount(currentHighlights.length);
      }
    });
  }

  // Basic Markdown formatting custom helper
  function renderMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    // Restore clean tags for underline formatting
    html = html.replace(/&lt;u&gt;/g, '<u>').replace(/&lt;\/u&gt;/g, '</u>');

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Checklists
    html = html.replace(/- \[ \]/g, '<input type="checkbox" disabled class="mr-1.5 align-middle rounded text-primary">');
    html = html.replace(/- \[x\]/g, '<input type="checkbox" checked disabled class="mr-1.5 align-middle text-primary">');

    // Callouts [!NOTE]
    html = html.replace(/&gt; \[!NOTE\]/g, '<div class="my-2 p-3 bg-amber-500/10 dark:bg-amber-400/5 border-l-3 border-amber-500 rounded-r text-xs text-amber-900 dark:text-amber-200">💡 Scholar Point: ');
    
    // Quote Blocks
    html = html.split('\n').map(line => {
      if (line.trim().startsWith('&gt;')) {
        return `<div class="border-l-2 border-primary/20 pl-3.5 py-1 text-on-surface-variant/80 my-1.5 italic bg-surface-container-low/40 rounded-r">${line.trim().substring(4).trim()}</div>`;
      }
      return line;
    }).join('\n');

    // Headings
    html = html.replace(/### (.*?)\n/g, '<h4 class="text-xs font-bold text-primary tracking-wider uppercase mt-3 mb-1">$1</h4>');

    // Simple table generator marker (| Cell | Header |)
    if (html.includes('|')) {
      const lines = html.split('<br>');
      let inTable = false;
      let tableHtml = '<table class="w-full text-left my-2 border-collapse border border-outline-variant/10 text-[10px] tabular-nums bg-surface-container-lowest">';
      
      lines.forEach((line) => {
        if (line.trim().startsWith('|')) {
          inTable = true;
          const cells = line.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
          if (line.includes('---')) {
            // divider
            return;
          }
          tableHtml += '<tr>' + cells.map(c => `<td class="p-2 border border-outline-variant/10 font-sans text-on-surface">${c}</td>`).join('') + '</tr>';
        } else {
          if (inTable) {
            inTable = false;
            tableHtml += '</table>';
            html += tableHtml;
          }
        }
      });
      if (inTable) tableHtml += '</table>';
    }

    return html.replace(/\n/g, '<br>');
  }

  // Calculate and Render Live Insights Dashboard metrics
  function calculateAndRenderStats() {
    const totalHighlights = currentHighlights.filter(h => h.type === 'highlight' || !h.type).length;
    const totalNotes = currentHighlights.filter(h => h.type === 'note').length;
    
    // Uniq books
    const books = new Set(currentHighlights.map(h => h.bookTitle).filter(Boolean));
    const totalBooks = books.size || 1;
    
    // Set streak randomly or calculated
    let streak = localStorage.getItem('lumina_reading_streak_active') || '8';
    
    const hEl = document.getElementById('stats-total-highlights');
    if (hEl) hEl.textContent = totalHighlights;
    
    const nEl = document.getElementById('stats-total-notes');
    if (nEl) nEl.textContent = totalNotes;
    
    const sEl = document.getElementById('stats-reading-streak');
    if (sEl) sEl.textContent = streak + " Days";
    
    const bEl = document.getElementById('stats-annotated-books');
    if (bEl) bEl.textContent = totalBooks;
  }

  // Render Highlights Card Deck
  function renderGlobalHighlights() {
    const listContainer = document.getElementById('highlights-list');
    if (!listContainer) return;

    let filtered = [...currentHighlights];

    // Filter by Search Input text/tags/folder/book
    if (currentSearchQuery.trim()) {
      const q = currentSearchQuery.toLowerCase();
      filtered = filtered.filter(hl => 
        (hl.text && hl.text.toLowerCase().includes(q)) ||
        (hl.note && hl.note.toLowerCase().includes(q)) ||
        (hl.bookTitle && hl.bookTitle.toLowerCase().includes(q)) ||
        (hl.author && hl.author.toLowerCase().includes(q)) ||
        (hl.folder && hl.folder.toLowerCase().includes(q)) ||
        (hl.tags && hl.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Filter by Type Chip selection
    if (currentFilterType !== 'all') {
      if (currentFilterType === 'favorite') {
        filtered = filtered.filter(hl => hl.isFavorite);
      } else if (currentFilterType === 'recent') {
        filtered = filtered.slice(0, 5); 
      } else {
        filtered = filtered.filter(hl => hl.type === currentFilterType);
      }
    }

    // Filter by Folder Notebook Chip selection
    if (currentFilterFolder !== 'all') {
      filtered = filtered.filter(hl => hl.folder === currentFilterFolder);
    }

    // Order/Sort entries (pinned nodes are always bubbled to the top!)
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (currentSortOrder === 'recent') {
        return new Date(b.date || '') - new Date(a.date || '');
      } else if (currentSortOrder === 'older') {
        return new Date(a.date || '') - new Date(b.date || '');
      } else {
        return (a.bookTitle || '').localeCompare(b.bookTitle || '');
      }
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="p-12 text-center border border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low/40 animate-fade-in">
          <i class="lucide-icon text-4xl text-outline mb-3" data-lucide="library"></i>
          <p class="font-body-ui text-sm text-on-surface-variant font-semibold">No elements matched filters</p>
          <p class="font-mono text-[9px] text-[#7b1e2e]/70 mt-1 uppercase">Select different chips or folders to browse</p>
        </div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(hl => {
      const col = COLOR_MAP[hl.color] || COLOR_MAP.yellow;
      
      const annotationHtml = hl.note ? `
        <div class="bg-background-variant/40 border-l-2 border-primary/30 pl-3.5 py-2.5 text-xs font-body-ui text-on-surface-variant/90 mb-4 rounded-r-md">
          <span class="font-bold font-label-caps text-[9px] uppercase tracking-wider text-primary block mb-1">My Annotation</span>
          <div class="markdown-body">${renderMarkdown(hl.note)}</div>
        </div>` : '';

      // Type label tag icon
      const typeIcon = hl.type === 'note' ? 'edit_note' : (hl.type === 'bookmark' ? 'bookmark' : 'border_color');
      const typeLabel = hl.type === 'note' ? 'NOTE' : (hl.type === 'bookmark' ? 'BOOKMARK' : 'HIGHLIGHT');

      // Tags layout
      const tagsHtml = (hl.tags && hl.tags.length > 0) ? `
        <div class="flex flex-wrap gap-1.5 mt-2.5 mb-1.5">
          ${hl.tags.map(tag => `
            <span class="px-2 py-0.5 bg-surface-container border border-outline-variant/15 text-[8.5px] font-semibold text-primary rounded-full hover:bg-primary/5 transition-colors cursor-pointer tag-badge" data-tag="${tag}">
              #${tag}
            </span>`).join('')}
        </div>` : '';

      // Embedded media node
      let mediaHtml = '';
      if (hl.imageUrl) {
        mediaHtml += `<div class="mt-2 text-center my-3"><img src="${hl.imageUrl}" class="max-h-48 rounded-lg object-contain border border-outline-variant/15 shadow-sm referrerPolicy="no-referrer""/></div>`;
      }
      if (hl.attachmentName) {
        mediaHtml += `
          <div class="mt-2 my-3 flex items-center justify-between p-2.5 rounded-lg bg-surface-container border border-outline-variant/10 text-[10px] font-mono select-none">
            <span class="truncate flex items-center gap-1.5 text-on-surface-variant">
              <i class="lucide-icon text-xs" data-lucide="file"></i> ${hl.attachmentName}
            </span>
            <button onclick="window.LuminaHighlights.downloadAttachment('${hl.id}')" class="text-primary hover:underline font-label-caps" style="font-size: 8px;">DOWNLOAD</button>
          </div>`;
      }
      if (hl.linkUrl) {
        mediaHtml += `
          <div class="mt-2 text-[10px] font-mono flex items-center gap-1 text-primary truncate my-2">
            <i class="lucide-icon text-xs" data-lucide="link"></i>
            <a href="${hl.linkUrl}" target="_blank" class="hover:underline truncate">${hl.linkUrl}</a>
          </div>`;
      }

      return `
        <article class="bg-surface-container-low border border-transparent hover:border-outline-variant/30 shadow-xs transition-all group rounded-xl overflow-hidden animate-fade-in relative text-left" id="hl-card-${hl.id}">
          <!-- Pinned Indicator -->
          ${hl.isPinned ? `
            <div class="absolute top-0 right-12 bg-primary/10 text-primary px-2.5 py-1 text-[8px] font-mono font-bold tracking-widest rounded-b uppercase flex items-center gap-1">
              <i class="lucide-icon text-[10px]" data-lucide="pin"></i> PINNED
            </div>` : ''}

          <div class="p-7">
            <!-- Header Info -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-6 ${col.bg} rounded-full"></div>
                <div>
                  <div class="flex flex-wrap items-center gap-1.5">
                    <h4 class="text-xs font-label-caps font-bold text-primary tracking-wider uppercase">${hl.bookTitle || 'Custom Entry'}</h4>
                    <span class="px-1.5 py-0.5 rounded text-[8px] font-mono bg-surface-container-high text-on-surface-variant/80 uppercase font-bold flex items-center gap-0.5">
                      <i class="lucide-icon text-[9px]" data-lucide="${typeIcon}"></i> ${typeLabel}
                    </span>
                    <span class="px-1.5 py-0.5 rounded text-[8px] font-mono bg-primary/5 text-primary uppercase font-bold">
                       📂 ${hl.folder || 'Philosophy'}
                    </span>
                  </div>
                  <p class="text-[10px] text-on-surface-variant font-label-caps mt-0.5">
                    ${hl.author || 'Manual Input'} • ${hl.chapter || 'Local Thoughts'} • ${hl.date}
                  </p>
                </div>
              </div>
              
              <!-- Editor Buttons -->
              <div class="flex gap-1.5">
                <button class="p-1 text-on-surface-variant hover:text-primary transition-all toggle-favorite-btn cursor-pointer" data-id="${hl.id}" title="Toggle Favorite">
                  <i class="lucide-icon text-[18px] ${hl.isFavorite ? 'text-orange-500 fill-orange-500' : ''}" data-lucide="star"></i>
                </button>
                <button class="p-1 text-on-surface-variant hover:text-primary transition-all edit-hl-btn cursor-pointer" data-id="${hl.id}">
                  <i class="lucide-icon text-[18px]" data-lucide="pen-line"></i>
                </button>
              </div>
            </div>
            
            <blockquote class="font-body-reading text-sm text-primary mb-3.5 leading-relaxed ${col.selection}">
              <div class="markdown-body">${renderMarkdown(hl.text)}</div>
            </blockquote>
            
            ${mediaHtml}
            ${annotationHtml}
            ${tagsHtml}
            
            <!-- Bottom Action Row -->
            <div class="flex items-center justify-between pt-4.5 border-t border-outline-variant/10 mt-4 hl-card-footer">
              <div class="flex gap-4">
                <button class="flex items-center gap-1.5 text-[9px] font-label-caps font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer hl-share-btn" data-id="${hl.id}">
                  <i class="lucide-icon text-xs" data-lucide="share"></i> SHARE
                </button>
                <button class="flex items-center gap-1.5 text-[9px] font-label-caps font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer hl-copy-btn" data-id="${hl.id}">
                  <i class="lucide-icon text-xs" data-lucide="copy"></i> COPY
                </button>
                <button class="flex items-center gap-1.5 text-[9px] font-label-caps font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer hl-tag-add-btn" data-id="${hl.id}">
                  <i class="lucide-icon text-xs" data-lucide="circle-plus"></i> ADD TAG
                </button>
              </div>
              
              <div class="relative inline-block text-left hl-download-dropdown-container">
                <button class="flex items-center gap-1.5 bg-surface px-3 py-1.5 text-[9.5px] font-label-caps font-bold text-primary border border-outline-variant/60 hover:bg-surface-container hover:border-primary/40 rounded-xl transition-all active:scale-95 duration-150 cursor-pointer hl-download-toggle-btn glossy-button" data-id="${hl.id}" title="Download options">
                  <i class="lucide-icon text-[13px]" data-lucide="download"></i> DOWNLOAD <i class="lucide-icon text-[12px] transition-transform duration-200" data-lucide="chevron-down"></i>
                </button>
                
                <div class="hidden absolute right-0 bottom-full mb-2 w-36 rounded-xl bg-surface border border-outline-variant/30 shadow-xl z-30 overflow-hidden py-1.5 animate-fade-in-up hl-download-menu">
                  <button class="w-full text-left px-3 py-2 text-[9px] font-label-caps hover:bg-surface-container flex items-center gap-2 text-primary cursor-pointer border-b border-outline-variant/10" onclick="window.LuminaHighlights.exportData('markdown', '${hl.id}')">
                    <i class="lucide-icon text-xs" data-lucide="download"></i> MARKDOWN (MD)
                  </button>
                  <button class="w-full text-left px-3 py-2 text-[9px] font-label-caps hover:bg-surface-container flex items-center gap-2 text-primary cursor-pointer border-b border-outline-variant/10 hl-png-btn" data-id="${hl.id}">
                    <i class="lucide-icon text-xs font-bold" data-lucide="image"></i> PNG IMAGE
                  </button>
                  <button class="w-full text-left px-3 py-2 text-[9px] font-label-caps hover:bg-surface-container flex items-center gap-2 text-primary cursor-pointer hl-jpg-btn" data-id="${hl.id}">
                    <i class="lucide-icon text-xs font-bold" data-lucide="image"></i> JPG IMAGE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>`;
    }).join('');

    // Wire up event listeners
    listContainer.querySelectorAll('.edit-hl-btn').forEach(btn => {
      btn.onclick = () => openEditModal(btn.dataset.id);
    });

    listContainer.querySelectorAll('.toggle-favorite-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const hl = currentHighlights.find(h => h.id === id);
        if (hl) {
          updateHighlight(id, { isFavorite: !hl.isFavorite });
          showTemporaryToast(hl.isFavorite ? "Removed from Favorites" : "Saved to Favorites!");
        }
      };
    });

    listContainer.querySelectorAll('.hl-download-toggle-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const parent = btn.closest('.hl-download-dropdown-container');
        const menu = parent ? parent.querySelector('.hl-download-menu') : null;
        const arrow = btn.querySelector('.lucide-icon:last-child');
        
        if (!menu) return;
        
        const isHidden = menu.classList.contains('hidden');
        
        // Hide all other menus first
        document.querySelectorAll('.hl-download-menu').forEach(m => {
          if (m !== menu) {
            m.classList.add('hidden');
            const otherBtn = m.previousElementSibling;
            if (otherBtn) {
              const otherArrow = otherBtn.querySelector('.lucide-icon:last-child');
              if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
            }
          }
        });
        
        if (isHidden) {
          menu.classList.remove('hidden');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        } else {
          menu.classList.add('hidden');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
      };
    });

    listContainer.querySelectorAll('.hl-png-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        downloadCardAsImage(btn.dataset.id, 'png');
      };
    });

    listContainer.querySelectorAll('.hl-jpg-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        downloadCardAsImage(btn.dataset.id, 'jpg');
      };
    });

    listContainer.querySelectorAll('.hl-copy-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const hl = currentHighlights.find(h => h.id === id);
        if (hl) {
          navigator.clipboard.writeText(hl.text);
          showTemporaryToast("Quote Copied cleanly to Clipboard!");
        }
      };
    });

    listContainer.querySelectorAll('.hl-share-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        triggerShareModal(btn.dataset.id);
      };
    });

    listContainer.querySelectorAll('.tag-badge').forEach(badge => {
      badge.onclick = (e) => {
        e.stopPropagation();
        const tag = badge.dataset.tag;
        const searchInput = document.getElementById('highlights-search');
        if (searchInput) {
          searchInput.value = tag;
          currentSearchQuery = tag;
          renderGlobalHighlights();
        }
      };
    });

    listContainer.querySelectorAll('.hl-tag-add-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const t = prompt("Enter custom tag name (e.g. STOICISM, DESIGN):");
        if (t && t.trim()) {
          const hl = currentHighlights.find(h => h.id === id);
          if (hl) {
            const cleanTag = t.trim().toUpperCase();
            const arr = [...hl.tags];
            if (!arr.includes(cleanTag)) {
              arr.push(cleanTag);
              updateHighlight(id, { tags: arr });
              showTemporaryToast(`Added tag #${cleanTag} successfully!`);
            } else {
              showTemporaryToast("Tag already exists on this wisdom card!");
            }
          }
        }
      };
    });
  }

  // Render Reader Workspace Highlights inside Sidebar Panel
  function renderWorkspaceHighlights() {
    const workspaceList = document.getElementById('workspace-highlights-list');
    const highlightsCount = document.getElementById('workspace-highlights-count');
    if (!workspaceList) return;

    if (!activeBookId) {
      workspaceList.innerHTML = `<p class="text-[11px] text-on-surface-variant italic text-center py-4">Open a book to see nodes.</p>`;
      if (highlightsCount) highlightsCount.textContent = '0 nodes';
      return;
    }

    const filtered = currentHighlights.filter(hl => hl.bookId === activeBookId);
    if (highlightsCount) highlightsCount.textContent = `${filtered.length} node${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      workspaceList.innerHTML = `
        <div class="p-4 text-center border border-dashed border-outline-variant/30 rounded-xl bg-background/50 animate-fade-in">
          <p class="font-body-ui text-[11px] text-on-surface-variant font-semibold">No highlights saved for this document.</p>
          <p class="text-[9px] text-outline mt-0.5 uppercase tracking-wide">Select text in reader or write notes above!</p>
        </div>`;
      return;
    }

    workspaceList.innerHTML = filtered.map(hl => {
      const col = COLOR_MAP[hl.color] || COLOR_MAP.yellow;
      return `
        <div class="bg-background border border-outline-variant/15 p-3.5 rounded-lg space-y-2 relative group hover:border-primary/20 transition-colors text-left animate-fade-in">
          <div class="flex items-center justify-between">
            <span class="text-[8px] font-mono tracking-widest uppercase font-bold ${col.text}">${col.labelTitle} · ${hl.date}</span>
            <div class="flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="p-0.5 hover:text-primary edit-workspace-node-btn cursor-pointer" data-id="${hl.id}" title="Edit Node">
                <i class="lucide-icon text-[14px]" data-lucide="pen"></i>
              </button>
              <button class="p-0.5 hover:text-error delete-workspace-node-btn cursor-pointer" data-id="${hl.id}" title="Delete Node">
                <i class="lucide-icon text-[14px]" data-lucide="trash"></i>
              </button>
            </div>
          </div>
          <p class="font-body-reading text-xs text-primary leading-relaxed line-clamp-3">"${hl.text}"</p>
          ${hl.note ? `<p class="font-body-ui text-[11px] text-on-surface-variant italic bg-surface-container-low px-2 py-1 rounded border-l border-primary/30">Ref: ${hl.note}</p>` : ''}
        </div>`;
    }).join('');

    // Bind item edits/clicks in the workspace list
    workspaceList.querySelectorAll('.edit-workspace-node-btn').forEach(btn => {
      btn.onclick = () => openEditModal(btn.dataset.id);
    });

    workspaceList.querySelectorAll('.delete-workspace-node-btn').forEach(btn => {
      btn.onclick = () => {
        if (confirm("Delete this workspace highlight?")) {
          deleteHighlight(btn.dataset.id);
        }
      };
    });
  }

  // Dynamic book knowledge hub renderer
  function renderBookKnowledgeHub(book) {
    if (!book) return;
    activeBookHub = book;
    renderBookKnowledgeHubCurrent();
  }

  function renderBookKnowledgeHubCurrent() {
    if (!activeBookHub) return;
    const book = activeBookHub;
    const bookId = book.id || window.LuminaLibrary?.bookId(book);
    const bookTitle = book.name || book.title;

    // Load components
    const statsNotes = document.getElementById('hub-stats-notes');
    const statsHighlights = document.getElementById('hub-stats-highlights');
    const statsQuotes = document.getElementById('hub-stats-quotes');
    const statsInsights = document.getElementById('hub-stats-insights');
    const statsBookmarks = document.getElementById('hub-stats-bookmarks');
    const feedContainer = document.getElementById('hub-notes-feed');
    const blankState = document.getElementById('hub-blank-state');
    
    if (!feedContainer) return;

    // Filter notes belonging strictly to this source
    const bookNotes = currentHighlights.filter(h => {
      const matchesId = h.bookId === bookId;
      const matchesTitle = h.bookTitle && h.bookTitle.toLowerCase() === bookTitle.toLowerCase();
      return matchesId || matchesTitle;
    });

    // Populate counts
    if (statsNotes) statsNotes.textContent = bookNotes.filter(h => h.type === 'note').length;
    if (statsHighlights) statsHighlights.textContent = bookNotes.filter(h => h.type === 'highlight' || !h.type).length;
    if (statsQuotes) statsQuotes.textContent = bookNotes.filter(h => h.type === 'quote').length;
    if (statsInsights) statsInsights.textContent = bookNotes.filter(h => h.type === 'insight').length;
    if (statsBookmarks) statsBookmarks.textContent = bookNotes.filter(h => h.type === 'bookmark').length;

    // Active type logic
    const activeChip = document.querySelector('.hub-filter-chip.active-chip');
    const filterType = activeChip ? activeChip.dataset.type : 'all';

    const filteredNotes = bookNotes.filter(h => {
      if (filterType === 'all') return true;
      return h.type === filterType;
    });

    if (filteredNotes.length === 0) {
      feedContainer.innerHTML = '';
      blankState.classList.remove('hidden');
    } else {
      blankState.classList.add('hidden');
      feedContainer.innerHTML = filteredNotes.map(hl => {
        const tagsHtml = (hl.tags || []).map(t => `<span class="px-2 py-0.5 bg-surface-container hover:bg-[#CFA15A]/10 text-[9px] font-semibold text-on-surface-variant rounded font-sans transition-colors cursor-pointer select-none">#${t}</span>`).join(' ');
        const col = COLOR_MAP[hl.color || 'yellow'];

        let mediaHtml = '';
        if (hl.imageUrl) {
          mediaHtml += `<div class="mt-2 text-center my-2"><img src="${hl.imageUrl}" class="max-h-36 rounded-lg object-contain border border-outline-variant/10 shadow-xs" referrerPolicy="no-referrer""/></div>`;
        }
        if (hl.attachmentName) {
          mediaHtml += `
            <div class="mt-2 flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/10 text-[10px] font-mono select-none">
              <span class="truncate flex items-center gap-1.5 text-on-surface-variant">
                <i class="lucide-icon text-xs" data-lucide="file"></i> ${hl.attachmentName}
              </span>
              <button onclick="window.LuminaHighlights.downloadAttachment('${hl.id}')" class="text-primary hover:underline font-label-caps cursor-pointer" style="font-size: 8px;">DOWNLOAD</button>
            </div>`;
        }
        if (hl.linkUrl) {
          mediaHtml += `
            <div class="mt-2 flex items-center gap-1 text-[10px] font-mono text-primary truncate">
              <i class="lucide-icon text-xs" data-lucide="link"></i>
              <a href="${hl.linkUrl}" target="_blank" class="hover:underline truncate">${hl.linkUrl}</a>
            </div>`;
        }

        return `
          <div class="bg-surface-container-lowest border border-outline-variant/15 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group relative duration-200 text-left">
            <div>
              <div class="flex justify-between items-start mb-2.5 text-[10px] font-sans text-on-surface-variant font-semibold">
                <span class="px-2 py-0.5 rounded-md font-label-caps text-[8px] tracking-wider uppercase ${hl.type === 'highlight' ? 'bg-yellow-500/10 text-yellow-600' : hl.type === 'quote' ? 'bg-green-500/10 text-green-600' : hl.type === 'insight' ? 'bg-purple-500/10 text-purple-600' : hl.type === 'bookmark' ? 'bg-blue-500/10 text-blue-600' : 'bg-primary/10 text-primary'}">
                  ${hl.type || 'highlight'}
                </span>
                <div class="flex items-center gap-1.5">
                  <span class="text-[9px] font-mono opacity-80">${hl.date || ''}</span>
                  ${hl.isPinned ? '<i class="lucide-icon text-xs text-primary" data-lucide="pin"></i>' : ''}
                  ${hl.isFavorite ? '<i class="lucide-icon text-xs text-amber-500" data-lucide="star"></i>' : ''}
                </div>
              </div>

              <!-- Content citation quotes -->
              <div class="border-l-3 ${col.border} pl-2 text-xs font-sans text-on-surface select-text leading-relaxed text-left max-h-36 overflow-y-auto no-scrollbar">
                ${renderMarkdown(hl.text)}
              </div>

              <!-- Annotative summaries -->
              ${hl.note ? `
                <div class="mt-3.5 p-3.5 bg-surface-container/30 rounded-xl border-t border-outline-variant/10 text-[11px] leading-relaxed text-on-surface/90 text-justify select-text">
                  <div class="font-bold text-[8px] font-label-caps text-[#CFA15A] uppercase tracking-wider mb-1">REFLECTION & ANNOTATIONS</div>
                  ${renderMarkdown(hl.note)}
                </div>` : ''}

              ${mediaHtml}
            </div>

            <!-- Footer tags & shares -->
            <div class="mt-4 flex flex-wrap justify-between items-center gap-2 border-t border-outline-variant/5 pt-3">
              <div class="flex flex-wrap gap-1">
                ${tagsHtml || '<span class="text-[9px] font-mono text-on-surface-variant/30 italic font-medium">No tags</span>'}
              </div>
              <div class="flex items-center gap-1.5">
                <button onclick="window.LuminaHighlights.triggerShareModal('${hl.id}')" class="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant flex items-center justify-center cursor-pointer" title="Share card">
                  <i class="lucide-icon text-xs" data-lucide="share"></i>
                </button>
                <button onclick="window.LuminaHighlights.openEditModal('${hl.id}')" class="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant flex items-center justify-center cursor-pointer" title="Edit note">
                  <i class="lucide-icon text-xs" data-lucide="pen"></i>
                </button>
              </div>
            </div>
          </div>`;
      }).join('');
    }
  }

  // General listeners setup
  function setupListeners() {
    // NEW NOTE button
    const btnNewNote = document.getElementById('btn-new-note');
    if (btnNewNote) {
      btnNewNote.onclick = (e) => {
        e.stopPropagation();
        openCreateModal();
      };
    }

    // Dropdown toggle elements
    const btnExportMenu = document.getElementById('btn-export-menu');
    const exportDropdownMenu = document.getElementById('export-dropdown-menu');
    
    if (btnExportMenu && exportDropdownMenu) {
      btnExportMenu.onclick = (e) => {
        e.stopPropagation();
        exportDropdownMenu.classList.toggle('hidden');
      };
      document.addEventListener('click', () => {
        exportDropdownMenu.classList.add('hidden');
      });
    }

    // Binder for horizontal folder tags
    const folderFilters = document.getElementById('folder-filters-carousel');
    const scrollLeftBtn = document.getElementById('folder-scroll-left');
    const scrollRightBtn = document.getElementById('folder-scroll-right');
    const fadeLeft = document.getElementById('scroll-fade-left');
    const fadeRight = document.getElementById('scroll-fade-right');
    
    if (folderFilters) {
      if (scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.onclick = () => {
          folderFilters.scrollBy({ left: -240, behavior: 'smooth' });
        };
        scrollRightBtn.onclick = () => {
          folderFilters.scrollBy({ left: 240, behavior: 'smooth' });
        };
      }
      
      const updateFades = () => {
        if (fadeLeft) {
          fadeLeft.style.opacity = folderFilters.scrollLeft > 5 ? "1" : "0";
        }
        if (fadeRight) {
          const maxScroll = folderFilters.scrollWidth - folderFilters.clientWidth;
          fadeRight.style.opacity = folderFilters.scrollLeft < maxScroll - 5 ? "1" : "0";
        }
      };
      
      folderFilters.addEventListener('scroll', updateFades);
      window.addEventListener('resize', updateFades);
      setTimeout(updateFades, 250);
    }

    // Secondary folder click chips
    document.addEventListener('click', (e) => {
      const folderBtn = e.target.closest('.vault-folder-chip');
      if (folderBtn) {
        document.querySelectorAll('.vault-folder-chip').forEach(b => b.classList.remove('active-chip'));
        folderBtn.classList.add('active-chip');
        currentFilterFolder = folderBtn.dataset.folder;
        renderGlobalHighlights();
      }
    });

    // Primary item type filters chips
    const typeButtons = document.querySelectorAll('.vault-type-chip');
    typeButtons.forEach(btn => {
      btn.onclick = () => {
        typeButtons.forEach(b => b.classList.remove('active-chip'));
        btn.classList.add('active-chip');
        currentFilterType = btn.dataset.type;
        renderGlobalHighlights();
      };
    });

    // Search inputs
    const searchInput = document.getElementById('highlights-search');
    if (searchInput) {
      searchInput.oninput = () => {
        currentSearchQuery = searchInput.value;
        renderGlobalHighlights();
      };
    }

    // Modal close binder
    document.getElementById('highlight-modal-close').onclick = closeEditModal;

    // Modal delete binder
    document.getElementById('highlight-modal-trash').onclick = () => {
      if (editingHighlightId) {
        if (confirm("Are you sure you want to delete this wisdom node? This cannot be undone.")) {
          deleteHighlight(editingHighlightId);
          closeEditModal();
        }
      }
    };

    // Modal submit handler
    document.getElementById('highlight-modal-submit').onclick = handleModalSubmit;

    // Toggle color indicators inside card modal selector row
    const modalColorBtns = document.querySelectorAll('#highlight-modal-color-select button');
    modalColorBtns.forEach(btn => {
      btn.onclick = () => {
        modalColorBtns.forEach(b => {
          b.className = 'py-1.5 rounded text-[8px] font-label-caps font-semibold transition-all border border-transparent cursor-pointer flex flex-col items-center justify-center hover:bg-surface-container';
        });
        btn.className = 'py-1.5 rounded text-[8px] font-label-caps font-bold transition-all border border-primary text-primary bg-primary/5 shadow-xs cursor-pointer flex flex-col items-center justify-center';
        btn.dataset.selected = "true";
      };
    });

    // Sort trigger
    const sortBtn = document.getElementById('highlights-sort-btn');
    if (sortBtn) {
      sortBtn.onclick = () => {
        if (currentSortOrder === 'recent') {
          currentSortOrder = 'older';
          sortBtn.innerHTML = `SORT: OLDER <i class="lucide-icon text-sm" data-lucide="chevron-down"></i>`;
        } else if (currentSortOrder === 'older') {
          currentSortOrder = 'book';
          sortBtn.innerHTML = `SORT: BY BOOK <i class="lucide-icon text-sm" data-lucide="chevron-down"></i>`;
        } else {
          currentSortOrder = 'recent';
          sortBtn.innerHTML = `SORT: RECENT <i class="lucide-icon text-sm" data-lucide="chevron-down"></i>`;
        }
        renderGlobalHighlights();
      };
    }

    // Reader workspace save highlight helper
    const workspaceSaveBtn = document.getElementById('workspace-save-highlight');
    if (workspaceSaveBtn) {
      workspaceSaveBtn.onclick = () => {
        const textInput = document.getElementById('workspace-text-input');
        const noteInput = document.getElementById('workspace-annotation-input');
        if (!textInput || !textInput.value.trim()) {
          showTemporaryToast("Select text or write a quote to lock notes.");
          return;
        }

        const chosenType = document.getElementById('workspace-node-type')?.value || 'highlight';
        const chosenFolder = document.getElementById('workspace-notebook-folder')?.value || 'Philosophy';

        // Retrieve background color of highlight panel
        let chosenCol = 'yellow';
        const pal = document.querySelectorAll('#workspace-panel-colors button');
        pal.forEach(btn => {
          if (btn.classList.contains('border-primary') || btn.style.borderWidth === '2px') {
            chosenCol = btn.dataset.color || 'yellow';
          }
        });

        // Determine active catalog info
        let bookName = "Ancient Scripture";
        let bookAuth = "Sages";
        if (window.LuminaLibrary && window.LuminaLibrary.getCurrentBook()) {
          const currentBook = window.LuminaLibrary.getCurrentBook();
          bookName = currentBook.name || currentBook.title;
          bookAuth = currentBook.author || "Global sage lineage";
        }

        addHighlight({
          bookId: activeBookId || 'custom_notepad',
          bookTitle: bookName,
          author: bookAuth,
          chapter: document.getElementById('workspace-chapter-label')?.textContent || 'Veda Slokas',
          text: textInput.value.trim(),
          note: noteInput ? noteInput.value.trim() : '',
          color: chosenCol,
          type: chosenType,
          folder: chosenFolder,
          tags: ["STUDY", "READER"]
        });

        textInput.value = '';
        if (noteInput) noteInput.value = '';
        showTemporaryToast("Wisdom saved to personal Brain database!");
      };
    }

    // Wire-up PKM Share overlay buttons
    const pkmShareModalClose = document.getElementById('pkm-share-modal-close');
    if (pkmShareModalClose) {
      pkmShareModalClose.onclick = () => {
        document.getElementById('pkm-share-modal').classList.add('hidden');
      };
    }

    // Tab bindings in share overlay
    const pkmShareTabCard = document.getElementById('pkm-share-tab-card');
    const pkmShareTabLink = document.getElementById('pkm-share-tab-link');
    const pkmSharePaneCard = document.getElementById('pkm-share-pane-card');
    const pkmSharePaneLink = document.getElementById('pkm-share-pane-link');

    if (pkmShareTabCard && pkmShareTabLink) {
      pkmShareTabCard.onclick = () => {
        pkmShareTabCard.className = "pb-2 border-b-2 border-primary text-primary focus:outline-none cursor-pointer";
        pkmShareTabLink.className = "pb-2 border-b-2 border-transparent text-on-surface-variant hover:text-primary focus:outline-none cursor-pointer";
        pkmSharePaneCard.classList.remove('hidden');
        pkmSharePaneLink.classList.add('hidden');
      };

      pkmShareTabLink.onclick = () => {
        pkmShareTabLink.className = "pb-2 border-b-2 border-primary text-primary focus:outline-none cursor-pointer";
        pkmShareTabCard.className = "pb-2 border-b-2 border-transparent text-on-surface-variant hover:text-primary focus:outline-none cursor-pointer";
        pkmSharePaneLink.classList.remove('hidden');
        pkmSharePaneCard.classList.add('hidden');
      };
    }

    // Copy button inside share modal Url
    const copyLinkBtn = document.getElementById('pkm-share-copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.onclick = () => {
        const url = document.getElementById('pkm-share-link-url-value').value;
        navigator.clipboard.writeText(url).then(() => {
          copyLinkBtn.textContent = "COPIED!";
          setTimeout(() => {
            copyLinkBtn.textContent = "COPY";
          }, 1500);
          showTemporaryToast("Shareable link copied to clipboard!");
        });
      };
    }

    // Download button inside quote cards screenshot capture
    const pkmDownloadBtn = document.getElementById('pkm-share-download-btn');
    if (pkmDownloadBtn) {
      pkmDownloadBtn.onclick = () => {
        const cardCanvas = document.getElementById('pkm-quote-card-canvas');
        if (!cardCanvas) return;

        // Take snapshot offline cleanly inside viewer
        html2canvas(cardCanvas, {
          scale: 2,
          backgroundColor: null,
          logging: false
        }).then(canvas => {
          const imgUri = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imgUri;
          link.download = `Vedas_QuoteCard_${activeShareId || Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showTemporaryToast("Rendered stunning photo card safely!");
        }).catch(err => {
          console.error("Camera canvas failed rendered:", err);
          showTemporaryToast("Captured fallback text.");
        });
      };
    }

    // Media file pickers change bindings
    const filePicker = document.getElementById('highlight-modal-file-picker');
    if (filePicker) {
      filePicker.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          currentAttachment = {
            name: file.name,
            type: file.type,
            data: event.target.result // base64 URI safely
          };
          
          const label = document.getElementById('pkm-attachment-label');
          if (label) label.textContent = "ATTACHED: " + file.name.substring(0, 8).toUpperCase() + "...";
          
          const preview = document.getElementById('pkm-modal-attachment-preview');
          const nameDisp = document.getElementById('pkm-attachment-name-disp');
          if (preview && nameDisp) {
            nameDisp.textContent = file.name;
            preview.classList.remove('hidden');
          }
        };
        reader.readAsDataURL(file);
      };
    }

    const imgPicker = document.getElementById('highlight-modal-img-picker');
    if (imgPicker) {
      imgPicker.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          currentImage = event.target.result;

          const label = document.getElementById('pkm-image-label');
          if (label) label.textContent = "IMAGE RECORDED";

          const preview = document.getElementById('pkm-modal-image-preview');
          const imgDisp = document.getElementById('pkm-img-preview-disp');
          if (preview && imgDisp) {
            imgDisp.src = currentImage;
            preview.classList.remove('hidden');
          }
        };
        reader.readAsDataURL(file);
      };
    }

    // Book Knowledge Hub binds
    const hubTabs = [
      { id: 'hub-tab-notebook', panel: 'hub-panel-notebook' },
      { id: 'hub-tab-chat', panel: 'hub-panel-chat' },
      { id: 'hub-tab-mindmap', panel: 'hub-panel-mindmap' },
      { id: 'hub-tab-flashcards', panel: 'hub-panel-flashcards' },
      { id: 'hub-tab-timeline', panel: 'hub-panel-timeline' },
    ];

    hubTabs.forEach(tabPair => {
      const btn = document.getElementById(tabPair.id);
      if (btn) {
        btn.onclick = () => {
          // Deactivate all
          hubTabs.forEach(t => {
            const tbtn = document.getElementById(t.id);
            const pnl = document.getElementById(t.panel);
            if (tbtn) {
              tbtn.classList.remove('border-primary', 'text-primary');
              tbtn.classList.add('border-transparent', 'text-on-surface-variant/70');
            }
            if (pnl) {
              pnl.classList.add('hidden');
            }
          });
          
          // Activate clicked
          btn.classList.remove('border-transparent', 'text-on-surface-variant/70');
          btn.classList.add('border-primary', 'text-primary');
          const activePanel = document.getElementById(tabPair.panel);
          if (activePanel) activePanel.classList.remove('hidden');
          
          // Triggers for specific panels rendering if needed
          if (tabPair.id === 'hub-tab-mindmap') {
            generateHubMindMap();
          }
          if (tabPair.id === 'hub-tab-chat') {
            welcomeHubChat();
          }
          if (tabPair.id === 'hub-tab-timeline') {
            renderHubTimeline();
          }
        };
      }
    });

    const hubAddPkmNote = document.getElementById('hub-add-pkm-note');
    if (hubAddPkmNote) {
      hubAddPkmNote.onclick = () => {
        if (activeBookHub) {
          openCreateModal();
          const title = activeBookHub.name || activeBookHub.title;
          const srcInput = document.getElementById('highlight-modal-source');
          if (srcInput) srcInput.value = title;
        } else {
          openCreateModal();
        }
      };
    }

    const emptyHubNote = document.getElementById('empty-hub-create-note');
    if (emptyHubNote) {
      emptyHubNote.onclick = () => {
        openCreateModal();
      };
    }

    const btnExportHubMeta = document.getElementById('btn-export-hub-menu');
    const exportHubDropdown = document.getElementById('export-hub-dropdown-menu');
    if (btnExportHubMeta && exportHubDropdown) {
      btnExportHubMeta.onclick = (e) => {
        e.stopPropagation();
        exportHubDropdown.classList.toggle('hidden');
      };
      
      // close on outer clicks
      document.addEventListener('click', () => {
        exportHubDropdown.classList.add('hidden');
      });
    }

    const hubAiStudyBtn = document.getElementById('hub-ai-synthesize');
    if (hubAiStudyBtn) {
      hubAiStudyBtn.onclick = async () => {
        const box = document.getElementById('hub-ai-synthesis-box');
        const content = document.getElementById('hub-ai-synthesis-content');
        if (!box || !content) return;

        box.classList.remove('hidden');
        content.innerHTML = `
          <div class="flex items-center gap-1.5 py-1 text-amber-800 dark:text-[#FBBF24]">
            <i class="lucide-icon text-[12px] animate-spin" data-lucide="refresh-cw"></i>
            <span>Scholar AI compiling cross-note synopses and themes...</span>
          </div>`;

        if (!activeBookHub) {
          content.innerHTML = `<span class="text-error font-mono">Select a book to synthesize.</span>`;
          return;
        }

        const bookTitle = activeBookHub.name || activeBookHub.title;
        const bId = activeBookHub.id || window.LuminaLibrary?.bookId(activeBookHub);
        
        // Filter notes belonging to this book
        const bookNotes = currentHighlights.filter(h => {
          const matchesId = h.bookId === bId;
          const matchesTitle = h.bookTitle && h.bookTitle.toLowerCase() === bookTitle.toLowerCase();
          return matchesId || matchesTitle;
        });

        let noteTextToAnalyze = "";
        if (bookNotes.length > 0) {
          noteTextToAnalyze = bookNotes.map(h => `[${h.type.toUpperCase()} on section: ${h.chapter || 'unknown'}] Quote: "${h.text}" Annotation: ${h.note || ""}`).join("\n\n");
        } else {
          noteTextToAnalyze = `No notes registered. Synthesize a comprehensive overview of the book '${bookTitle}' written by ${activeBookHub.author || 'Ancient Sage'}. List main sections, main characters or topics, key philosophical message, and actionable meditation guides.`;
        }

        try {
          const resp = await fetch('/api/note-ai-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'summarize',
              noteText: noteTextToAnalyze,
              bookTitle: bookTitle
            })
          });

          if (!resp.ok) throw new Error("Synthesis service limits reached.");
          const data = await resp.json();
          const out = data.resultText || "Analysis done.";
          
          let formattedText = out
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-amber-500 font-medium">$1</em>')
            .replace(/#+\s+(.*)/g, '<div class="font-bold text-[10px] uppercase tracking-wider mt-2 border-b border-amber-500/10 pb-0.5">$1</div>')
            .replace(/^\-\s+(.*)/gm, '<li>· $1</li>')
            .replace(/\n/g, '<br>');

          content.innerHTML = formattedText;
        } catch (err) {
          content.innerHTML = `<span class="text-error font-mono">Cognitive error compiling notebook node: ${err.message}</span>`;
        }
      };
    }

    // Hub filter chip dynamic active toggles
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.hub-filter-chip');
      if (chip) {
        document.querySelectorAll('.hub-filter-chip').forEach(c => {
          c.classList.remove('active-chip', 'bg-primary', 'text-on-primary', 'text-white', 'dark:text-[#1E1E1E]');
          c.classList.add('bg-surface-container');
        });
        
        chip.classList.add('active-chip', 'bg-primary', 'text-on-primary');
        if (!document.documentElement.classList.contains('dark')) {
          chip.classList.add('text-white');
        } else {
          chip.classList.add('text-black');
        }
        chip.classList.remove('bg-surface-container');
        
        renderBookKnowledgeHubCurrent();
      }
    });
  }

  // File clearance
  function clearModalAttachment(type) {
    if (type === 'file') {
      currentAttachment = null;
      document.getElementById('pkm-attachment-label').textContent = "ATTACH FILE";
      document.getElementById('pkm-modal-attachment-preview').classList.add('hidden');
      document.getElementById('highlight-modal-file-picker').value = "";
    } else {
      currentImage = null;
      document.getElementById('pkm-image-label').textContent = "ATTACH IMAGE";
      document.getElementById('pkm-modal-image-preview').classList.add('hidden');
      document.getElementById('highlight-modal-img-picker').value = "";
    }
  }

  // Quote Card Share triggering opens
  function triggerShareModal(id) {
    const hl = currentHighlights.find(h => h.id === id);
    if (!hl) return;

    activeShareId = id;
    
    // Populate cards design text safely
    document.getElementById('pkm-share-card-quote').textContent = `"${hl.text.replace(/"/g, '')}"`;
    document.getElementById('pkm-share-card-reflection').textContent = hl.note || "Scholarly insight saved inside private vault cabin.";
    document.getElementById('pkm-share-card-source').textContent = hl.bookTitle || "Philosophical manuscript";
    document.getElementById('pkm-share-card-author').textContent = hl.author || "Ancient Sages";
    
    // Pre-populate simulated share URL link
    document.getElementById('pkm-share-link-url-value').value = `https://wisdom.pkm.hub/shares/${hl.id}`;

    // Reset themes
    setCardTheme('warm');

    const tab = document.getElementById('pkm-share-tab-card');
    if (tab) tab.click();

    document.getElementById('pkm-share-modal').classList.remove('hidden');
  }

  function setCardTheme(theme) {
    const canvas = document.getElementById('pkm-quote-card-canvas');
    if (!canvas) return;

    if (theme === 'warm') {
      canvas.className = "w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md relative p-6 flex flex-col justify-between border select-none leading-relaxed transition-all duration-300 border-amber-200 text-stone-900";
      canvas.style.background = 'linear-gradient(135deg, #FAF7ED 0%, #FFF2D6 100%)';
    } else if (theme === 'dark') {
      canvas.className = "w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md relative p-6 flex flex-col justify-between border select-none leading-relaxed transition-all duration-300 border-zinc-700 text-white";
      canvas.style.background = 'linear-gradient(135deg, #12181B 0%, #1A2228 100%)';
    } else if (theme === 'minimal') {
      canvas.className = "w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md relative p-6 flex flex-col justify-between border select-none leading-relaxed transition-all duration-300 border-slate-350 text-black";
      canvas.style.background = '#FFFFFF';
    } else if (theme === 'emerald') {
      canvas.className = "w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md relative p-6 flex flex-col justify-between border select-none leading-relaxed transition-all duration-300 border-emerald-350 text-emerald-950";
      canvas.style.background = 'linear-gradient(135deg, #EEFAF4 0%, #CEF5DF 100%)';
    }
  }

  // Cognitive AI trigger handles inside active writing panels
  async function runAIAction(action) {
    const textIn = document.getElementById('highlight-modal-text').value.trim();
    if (!textIn) {
      alert("Please write outline or highlight selection text first to study.");
      return;
    }

    const resBox = document.getElementById('pkm-modal-ai-result-box');
    const resContent = document.getElementById('pkm-modal-ai-result-content');
    if (!resBox || !resContent) return;

    resBox.classList.remove('hidden');
    resContent.innerHTML = `
      <div class="flex items-center gap-1.5 py-1 text-amber-800 dark:text-[#FBBF24]">
        <i class="lucide-icon text-[11px] animate-spin" data-lucide="refresh-cw"></i>
         <span>Scholar AI generating smart ${action}...</span>
      </div>`;

    let srcTitle = document.getElementById('highlight-modal-source').value || "Wisdom notebook";

    try {
      const resp = await fetch('/api/note-ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          noteText: textIn,
          bookTitle: srcTitle
        })
      });

      if (!resp.ok) throw new Error("Scholar AI limits reached.");
      const data = await resp.json();
      currentAIOutput = data.resultText || "Analysis done.";
      
      // Basic markdown parsing inside the small dynamic alert box
      let formattedText = currentAIOutput
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-amber-500 font-medium">$1</em>')
        .replace(/#+\s+(.*)/g, '<div class="font-bold text-[9px] uppercase tracking-wider mt-1 border-b pb-0.5">$1</div>')
        .replace(/^\-\s+(.*)/gm, '<li>· $1</li>');

      resContent.innerHTML = formattedText;
    } catch (err) {
      resContent.innerHTML = `<span class="text-error font-mono">Cognitive failure: ${err.message}</span>`;
    }
  }

  function appendAIResultToReflection() {
    if (!currentAIOutput) return;
    const noteArea = document.getElementById('highlight-modal-note');
    if (noteArea) {
      noteArea.value = noteArea.value ? noteArea.value + "\n\n=== AI Scholar Insight ===\n" + currentAIOutput : currentAIOutput;
      document.getElementById('pkm-modal-ai-result-box').classList.add('hidden');
      showTemporaryToast("AI response appended and locked into reflections!");
    }
  }

  // Edit Modal Controllers
  function openCreateModal(initialText) {
    editingHighlightId = null;
    currentAttachment = null;
    currentImage = null;

    document.getElementById('highlight-modal-title').textContent = "Create Note / Highlight";
    document.getElementById('highlight-modal-source').value = "";
    document.getElementById('highlight-modal-text').value = initialText || "";
    document.getElementById('highlight-modal-note').value = "";
    document.getElementById('highlight-modal-tags').value = "";
    document.getElementById('highlight-modal-trash').classList.add('hidden');
    document.getElementById('highlight-modal-favorite').checked = false;
    document.getElementById('highlight-modal-pinned').checked = false;
    
    if (document.getElementById('highlight-modal-link-url')) {
      document.getElementById('highlight-modal-link-url').value = "";
    }

    // Reset dropdowns elements
    document.getElementById('highlight-modal-folder').value = "Philosophy";
    document.getElementById('highlight-modal-type').value = initialText ? "highlight" : "note";

    // Defaults color to green
    document.querySelector('#highlight-modal-color-select button[data-color="green"]')?.click();

    // Reset attached labels
    if (document.getElementById('pkm-attachment-label')) document.getElementById('pkm-attachment-label').textContent = "ATTACH FILE";
    if (document.getElementById('pkm-image-label')) document.getElementById('pkm-image-label').textContent = "ATTACH IMAGE";
    if (document.getElementById('pkm-modal-attachment-preview')) document.getElementById('pkm-modal-attachment-preview').classList.add('hidden');
    if (document.getElementById('pkm-modal-image-preview')) document.getElementById('pkm-modal-image-preview').classList.add('hidden');
    if (document.getElementById('pkm-modal-ai-result-box')) document.getElementById('pkm-modal-ai-result-box').classList.add('hidden');

    const m = document.getElementById('highlight-modal');
    m.classList.remove('hidden');
  }

  function openEditModal(id) {
    const hl = currentHighlights.find(h => h.id === id);
    if (!hl) return;

    editingHighlightId = id;
    currentAttachment = hl.attachmentData ? { name: hl.attachmentName, data: hl.attachmentData } : null;
    currentImage = hl.imageUrl || null;

    document.getElementById('highlight-modal-title').textContent = "Edit Note / Highlight";
    document.getElementById('highlight-modal-source').value = hl.bookTitle || "";
    document.getElementById('highlight-modal-text').value = hl.text || "";
    document.getElementById('highlight-modal-note').value = hl.note || "";
    document.getElementById('highlight-modal-tags').value = (hl.tags || []).join(', ');
    document.getElementById('highlight-modal-trash').classList.remove('hidden');
    document.getElementById('highlight-modal-favorite').checked = hl.isFavorite || false;
    document.getElementById('highlight-modal-pinned').checked = hl.isPinned || false;

    if (document.getElementById('highlight-modal-link-url')) {
      document.getElementById('highlight-modal-link-url').value = hl.linkUrl || "";
    }

    // Dropdowns presetters
    document.getElementById('highlight-modal-folder').value = hl.folder || "Philosophy";
    document.getElementById('highlight-modal-type').value = hl.type || "highlight";

    const colorToClick = hl.color || 'yellow';
    document.querySelector(`#highlight-modal-color-select button[data-color="${colorToClick}"]`)?.click();

    // Populate media previews safely from locked data
    const labelF = document.getElementById('pkm-attachment-label');
    const labelI = document.getElementById('pkm-image-label');
    const prevF = document.getElementById('pkm-modal-attachment-preview');
    const nameF = document.getElementById('pkm-attachment-name-disp');
    const prevI = document.getElementById('pkm-modal-image-preview');
    const imgI = document.getElementById('pkm-img-preview-disp');

    if (hl.attachmentName && prevF && nameF) {
      if (labelF) labelF.textContent = "FILE PINNED";
      nameF.textContent = hl.attachmentName;
      prevF.classList.remove('hidden');
    } else {
      if (labelF) labelF.textContent = "ATTACH FILE";
      if (prevF) prevF.classList.add('hidden');
    }

    if (hl.imageUrl && prevI && imgI) {
      if (labelI) labelI.textContent = "IMAGE ATTACHED";
      imgI.src = hl.imageUrl;
      prevI.classList.remove('hidden');
    } else {
      if (labelI) labelI.textContent = "ATTACH IMAGE";
      if (prevI) prevI.classList.add('hidden');
    }

    if (document.getElementById('pkm-modal-ai-result-box')) {
      document.getElementById('pkm-modal-ai-result-box').classList.add('hidden');
    }

    const m = document.getElementById('highlight-modal');
    m.classList.remove('hidden');
  }

  function closeEditModal() {
    const m = document.getElementById('highlight-modal');
    if (m) m.classList.add('hidden');
    editingHighlightId = null;
    currentAttachment = null;
    currentImage = null;
  }

  function handleModalSubmit() {
    const source = document.getElementById('highlight-modal-source').value.trim();
    const text = document.getElementById('highlight-modal-text').value.trim();
    const note = document.getElementById('highlight-modal-note').value.trim();
    const rawTags = document.getElementById('highlight-modal-tags').value.trim();
    const isFav = document.getElementById('highlight-modal-favorite').checked;
    const isPin = document.getElementById('highlight-modal-pinned').checked;
    const linkUrl = document.getElementById('highlight-modal-link-url')?.value.trim() || '';
    
    // Notebook folders configurations
    const folder = document.getElementById('highlight-modal-folder').value;
    const itemType = document.getElementById('highlight-modal-type').value;

    if (!source || !text) {
      alert("Please enter source title and content quote text.");
      return;
    }

    const parsedTags = rawTags ? rawTags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    let chosenColor = 'yellow';
    const activeButtons = document.querySelectorAll('#highlight-modal-color-select button');
    activeButtons.forEach(btn => {
      if (btn.className.includes('border-primary') || btn.dataset.selected === "true") {
        chosenColor = btn.dataset.color || 'yellow';
      }
    });

    const docMeta = {
      bookTitle: source,
      text: text,
      note: note,
      color: chosenColor,
      isFavorite: isFav,
      isPinned: isPin,
      folder: folder,
      type: itemType,
      tags: parsedTags,
      imageUrl: currentImage || null,
      attachmentName: currentAttachment ? currentAttachment.name : null,
      attachmentData: currentAttachment ? currentAttachment.data : null,
      linkUrl: linkUrl
    };

    if (editingHighlightId) {
      updateHighlight(editingHighlightId, docMeta);
      showTemporaryToast("Wisdom Node compartments updated!");
    } else {
      let bId = activeBookHub ? (activeBookHub.id || window.LuminaLibrary?.bookId(activeBookHub)) : 'custom_notepad';
      let author = activeBookHub ? (activeBookHub.author || "Global sage lineage") : "Manual Input";
      addHighlight({
        bookId: bId,
        author: author,
        chapter: 'Standalone Module',
        ...docMeta
      });
      showTemporaryToast("Added new wisdom item!");
    }

    closeEditModal();
  }

  // Portable Attachment downloader
  function downloadAttachment(hlId) {
    const hl = currentHighlights.find(h => h.id === hlId);
    if (!hl || !hl.attachmentData) {
      alert("No local files mapped to this entry.");
      return;
    }

    const link = document.createElement('a');
    link.href = hl.attachmentData;
    link.download = hl.attachmentName || "wisdom_attachment.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Photo Cards double scaling CRISP rendering fallback download helpers
  function downloadCardAsImage(hlId, format) {
    const card = document.getElementById(`hl-card-${hlId}`);
    if (!card) return;

    // Temporarily hide buttons from snapshot
    const buttonsToHide = card.querySelectorAll('.edit-hl-btn, .toggle-favorite-btn, .hl-card-footer, .absolute.top-0.right-12');
    buttonsToHide.forEach(el => {
      el.style.opacity = '0';
    });

    const originalBorder = card.style.border;
    const originalShadow = card.style.boxShadow;

    card.style.border = 'none';
    card.style.boxShadow = 'none';

    html2canvas(card, {
      scale: 3, 
      useCORS: true,
      backgroundColor: document.documentElement.classList.contains('dark') ? '#1e292d' : '#fefdf9',
      logging: false,
      scrollY: -window.scrollY 
    }).then(canvas => {
      buttonsToHide.forEach(el => {
        el.style.opacity = '1';
      });
      card.style.border = originalBorder;
      card.style.boxShadow = originalShadow;

      const fileExtension = format === 'png' ? 'png' : 'jpg';
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const link = document.createElement('a');
      link.download = `Vedic_Wisdom_Node-${hlId}.${fileExtension}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showTemporaryToast(`Captured premium High-Res ${fileExtension.toUpperCase()} Card!`);
    }).catch(err => {
      buttonsToHide.forEach(el => {
        el.style.opacity = '1';
      });
      card.style.border = originalBorder;
      card.style.boxShadow = originalShadow;
      console.error("Card snap failed:", err);
      showTemporaryToast("Captured text fallback instead.");
    });
  }

  // Global Notebook/Collection Multi Format Exporters (PDF print, html Word index, clean Markdown notes list, plain text)
  function exportData(formatType, singleId) {
    const timestamp = new Date().toISOString().split('T')[0];
    let dataset = [...currentHighlights];

    if (singleId) {
      dataset = dataset.filter(h => h.id === singleId);
    }

    if (dataset.length === 0) {
      showTemporaryToast("Nothing in study notebook to export.");
      return;
    }

    let fileName = singleId ? `Note_Selection_${timestamp}` : `KnowledgeBase_All_${timestamp}`;
    triggerDownloadForNotes(dataset, fileName, formatType);
  }

  function exportBookData(format) {
    if (!activeBookHub) {
      alert("No active book selected for compilation.");
      return;
    }
    const bookTitle = activeBookHub.name || activeBookHub.title;
    
    const bookNotes = currentHighlights.filter(h => {
      const matchesId = h.bookId === (activeBookHub.id || window.LuminaLibrary?.bookId(activeBookHub));
      const matchesTitle = h.bookTitle && h.bookTitle.toLowerCase() === bookTitle.toLowerCase();
      return matchesId || matchesTitle;
    });

    if (bookNotes.length === 0) {
      alert("No saved highlights inside this book's Notebook.");
      return;
    }

    const cleanFilename = `${bookTitle.replace(/\s+/g, '_')}_Notebook`;
    triggerDownloadForNotes(bookNotes, cleanFilename, format);
  }

  function triggerDownloadForNotes(notesArray, fileName, formatType) {
    const timestamp = new Date().toLocaleString();

    if (formatType === 'pdf') {
      const pWin = window.open('', '', 'height=600,width=800');
      if (!pWin) {
        alert("Pop-up blocker interrupted PDF compiler. Please enable popups.");
        return;
      }
      pWin.document.write(`
        <html>
        <head>
          <title>${fileName.replace(/_/g, ' ')}</title>
          <style>
            body { font-family: -apple-system, sans-serif; padding: 45px; color: #1e1e24; bg: #fff; line-height: 1.6; }
            h1 { font-size: 20px; font-weight: bold; border-bottom: 2px solid #5d3a1f; color: #1a0800; padding-bottom: 12px; margin-bottom: 25px; }
            .node { margin-bottom: 30px; page-break-inside: avoid; border-bottom: 1px dashed #dedbd6; padding-bottom: 20px; }
            .meta { font-size: 10px; font-weight: bold; color: #5d3a1f; margin-bottom: 8px; text-transform: uppercase; font-family: monospace; }
            .cit { background: #fafaf5; border-left: 2.5px solid #5d3a1f; padding: 12px; font-style: italic; font-size: 11px; color: #2e2e2a; margin-bottom: 10px; }
            .ref { background: #fdfdfd; padding: 10px; border: 1px font-sans solid #ececec; font-size: 10.5px; border-radius: 6px; }
            .tags { margin-top: 8px; font-size: 9.5px; color: #cfaf3a; font-family: monospace; }
          </style>
        </head>
        <body>
          <h1>WISDOM VAULT SYSTEM: ${fileName.replace(/_/g, ' ').toUpperCase()}</h1>
          <p style="font-size: 9px; color: #777;">Published on: ${timestamp} • Private Brain Archive</p>
          <hr style="border:0; border-top:1.5px solid #5d3a1f; margin-bottom:20px;"/>
          ${notesArray.map((h, i) => `
            <div class="node">
              <div class="meta">${i + 1}. [${h.type.toUpperCase()}] ${h.bookTitle} • BY ${h.author}</div>
              <div class="cit">"${h.text}"</div>
              ${h.note ? `<div class="ref"><strong>Summary / Retrospective Insights:</strong><br>${h.note}</div>` : ''}
              <div class="tags">Labels: ${(h.tags || []).map(t => `#${t}`).join(' ')}</div>
            </div>
          `).join('')}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
        </html>
      `);
      pWin.document.close();
      return;
    }

    let content = "";
    let mime = "text/plain";
    let ext = "txt";

    if (formatType === 'txt') {
      content = `=====================================================\n`;
      content += `   WISDOM SYSTEM NOTEBOOK: ${fileName.replace(/_/g, ' ').toUpperCase()}\n`;
      content += `=====================================================\n`;
      content += `Compiled on: ${timestamp} • System Export\n\n`;

      notesArray.forEach((h, i) => {
        content += `${i + 1}. [${h.type.toUpperCase()}] ${h.bookTitle}\n`;
        content += `   Author: ${h.author || 'Manual'} | Tags: ${(h.tags || []).join(', ')}\n`;
        content += `   Context: "${h.text}"\n`;
        if (h.note) content += `   Reflection Summary: ${h.note}\n`;
        content += `\n-----------------------------------------------------\n\n`;
      });
      mime = "text/plain";
      ext = "txt";
    } 
    else if (formatType === 'markdown' || formatType === 'md') {
      content = `# Compiled Scholarly Notebook: ${fileName.replace(/_/g, ' ')}\n`;
      content += `> Public export file synced on **${timestamp}**\n\n---\n\n`;

      notesArray.forEach((h) => {
        content += `## ${h.type.toUpperCase()} • ${h.bookTitle}\n`;
        content += `* **Author:** ${h.author || 'Sages'}\n`;
        content += `* **Date:** ${h.date || 'T-'}\n`;
        content += `* **Tags:** ${(h.tags || []).map(t => `#${t}`).join(' ') || 'none'}\n\n`;
        content += `> ${h.text}\n\n`;
        if (h.note) {
          content += `### Reader's Annotations & Reflection\n${h.note}\n\n`;
        }
        content += `---\n\n`;
      });
      mime = "text/markdown";
      ext = "md";
    } 
    else if (formatType === 'docx') {
      content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>${fileName}</title></head>
        <body style="font-family: Garamond, serif; font-size: 11.5pt; line-height: 1.6; color: #222;">
          <h1 style="color: #4a2c11; border-bottom: 2.5px solid #4a2c11; padding-bottom:12px;">${fileName.replace(/_/g, ' ').toUpperCase()} NOTEBOOK</h1>
          <p style="color: #666; font-size: 9.5pt;">Generated: ${timestamp} from Wisdom PKM Engine</p>
          <hr />
          ${notesArray.map((h, i) => `
            <div style="margin-bottom: 30px;">
              <h3 style="color: #4a2c11; font-family: system-ui, sans-serif;">${i + 1}. [${h.type.toUpperCase()}] ${h.bookTitle}</h3>
              <p style="font-size: 9.5pt; color:#666; margin-top:-10px;">Authored by ${h.author} • Section: ${h.chapter}</p>
              <div style="background-color: #fbfbf7; border-left: 3px solid #4a2c11; padding: 12px; font-style: italic; margin: 15px 0;">
                "${h.text}"
              </div>
              ${h.note ? `<p style="margin-top:15px; margin-bottom:10px;"><strong>Analytical Commentary:</strong></p>\n<div style="background:#fafafa; padding:10px; border-radius:4px;">${h.note}</div>` : ''}
              <p style="color: grey; font-size: 9pt;">Metadata tags: ${(h.tags || []).join(', ')}</p>
            </div>
            <hr style="border: 0; border-top: 1px dashed #dedede;" />
          `).join('')}
        </body>
        </html>`;
      mime = "application/msword";
      ext = "doc";
    }

    const b = new Blob([content], { type: mime });
    const u = URL.createObjectURL(b);
    const downloadLink = document.createElement('a');
    downloadLink.href = u;
    downloadLink.download = `${fileName}.${ext}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showTemporaryToast(`Compiled and exported ${ext.toUpperCase()} notebook file successfully!`);
  }

  // Selections tracker in reader flow
  function setupGlobalSelectionTracker() {
    document.addEventListener('mouseup', () => {
      const sel = window.getSelection();
      if (sel) {
        const text = sel.toString().trim();
        if (text) {
          selectedTextGlobal = text;
          // Dynamically check if active text highlighter action exists, and lock
          const quickNoteInput = document.getElementById('workspace-text-input');
          if (quickNoteInput) {
            quickNoteInput.value = text;
          }
        }
      }
    });
  }

  function quickHighlightSelection() {
    if (!selectedTextGlobal) {
      showTemporaryToast("Highlight a text block inside the workspace reader module first.");
      return;
    }

    let bName = "Manuscript Study";
    let bAuth = "Sages";
    if (window.LuminaLibrary && window.LuminaLibrary.getCurrentBook()) {
      const b = window.LuminaLibrary.getCurrentBook();
      bName = b.name || b.title;
      bAuth = b.author || "Sages";
    }

    addHighlight({
      bookId: activeBookId || 'custom_notepad',
      bookTitle: bName,
      author: bAuth,
      chapter: document.getElementById('workspace-chapter-label')?.textContent || 'Vedas Selection',
      text: selectedTextGlobal,
      note: 'Instantly bookmarked from scholar viewer session.',
      color: 'yellow',
      type: 'highlight',
      folder: 'Philosophy',
      tags: ['QUICK', 'READER']
    });

    selectedTextGlobal = '';
    // Clear selection UI
    window.getSelection()?.removeAllRanges();
  }

  // --- Hub Feature Drivers ---

  function generateHubMindMap() {
    const svg = document.getElementById('mindmap-svg');
    if (!svg) return;
    
    let bookName = "Universe";
    if (activeBookHub) {
      bookName = activeBookHub.name || activeBookHub.title || bookName;
    }

    // A minimal interactive D3 or native SVG approach
    // We'll generate a static cool SVG representing the book logic connecting to notes.
    const bId = activeBookHub ? (activeBookHub.id || window.LuminaLibrary?.bookId(activeBookHub)) : null;
    const bookNotes = currentHighlights.filter(h => h.bookId === bId || (h.bookTitle && h.bookTitle.toLowerCase() === bookName.toLowerCase()));

    let nodeElements = '';
    let linkElements = '';

    // Center Root
    const centerX = 300;
    const centerY = 160;

    nodeElements += `<circle cx="${centerX}" cy="${centerY}" r="35" class="fill-primary/20 stroke-primary/50 stroke-1" />`;
    nodeElements += `<text x="${centerX}" y="${centerY - 45}" class="text-[10px] fill-primary font-bold font-sans text-anchor-middle tracking-wider uppercase">${bookName.substring(0, 20)}</text>`;
    nodeElements += `<text x="${centerX}" y="${centerY + 4}" class="text-[16px] fill-primary font-sans font-bold text-anchor-middle material-symbols-outlined">auto_stories</text>`;

    if (bookNotes.length === 0) {
      nodeElements += `<text x="${centerX}" y="${centerY + 55}" class="text-[10px] fill-on-surface-variant font-mono text-anchor-middle">No saved nodes to map.</text>`;
    } else {
      const radius = 100;
      const angleStep = (2 * Math.PI) / Math.min(bookNotes.length, 8); // Display max 8

      for (let i = 0; i < Math.min(bookNotes.length, 8); i++) {
        const note = bookNotes[i];
        const angle = i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        let icon = 'edit_note';
        let colorClass = 'fill-neutral-500/20 stroke-neutral-500/50';
        let textClass = 'fill-neutral-500';
        if (note.type === 'highlight') { icon = 'border_color'; colorClass = 'fill-yellow-500/20 stroke-yellow-500/50'; textClass = 'fill-yellow-600 dark:fill-yellow-400'; }
        if (note.type === 'quote') { icon = 'format_quote'; colorClass = 'fill-green-500/20 stroke-green-500/50'; textClass = 'fill-green-600 dark:fill-green-400'; }
        if (note.type === 'insight') { icon = 'lightbulb'; colorClass = 'fill-purple-500/20 stroke-purple-500/50'; textClass = 'fill-purple-600 dark:fill-purple-400'; }
        if (note.type === 'bookmark') { icon = 'bookmark'; colorClass = 'fill-blue-500/20 stroke-blue-500/50'; textClass = 'fill-blue-600 dark:fill-blue-400'; }

        linkElements += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" class="stroke-outline-variant/30 stroke-1 stroke-dasharray-[4,4]" />`;
        nodeElements += `<circle cx="${x}" cy="${y}" r="18" class="${colorClass} stroke-1 transition-all hover:r-20 cursor-pointer" onclick="window.LuminaHighlights.openEditModal('${note.id}')"/>`;
        nodeElements += `<text x="${x}" y="${y + 5}" class="text-[12px] ${textClass} font-sans font-bold text-anchor-middle material-symbols-outlined pointer-events-none">${icon}</text>`;
        nodeElements += `<text x="${x}" y="${y + 28}" class="text-[8px] fill-on-surface-variant font-mono text-anchor-middle pointer-events-none w-[60px] block truncate">${(note.text || "").substring(0, 15)}...</text>`;
      }
    }

    svg.innerHTML = `
      <style>
        .text-anchor-middle { text-anchor: middle; }
        .stroke-dasharray-\\[4\\,4\\] { stroke-dasharray: 4,4; }
      </style>
      <g>
        ${linkElements}
        ${nodeElements}
      </g>
    `;
    
    // Wire up regenerate button
    const regenMap = document.getElementById('hub-btn-regenerate-mindmap');
    if (regenMap) {
      regenMap.onclick = () => {
        svg.innerHTML = `<text x="${centerX}" y="${centerY}" class="text-[10px] fill-primary font-mono text-anchor-middle animate-pulse">Running Scholar AI Map Refactoring...</text>`;
        setTimeout(generateHubMindMap, 1500);
      };
    }
  }

  function welcomeHubChat() {
    const logs = document.getElementById('hub-chat-logs');
    if (!logs || logs.children.length > 1) return; // Already greeted

    const sgContainer = document.getElementById('hub-chat-suggestions');
    if (sgContainer) {
      sgContainer.innerHTML = '';
      const ideas = ["Summarize key themes", "What are the main actionable lessons?", "Identify conflicting viewpoints in this text"];
      ideas.forEach(idea => {
        const btn = document.createElement('button');
        btn.className = "px-2 py-1 bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 rounded font-mono text-[9px] text-on-surface transition-all cursor-pointer";
        btn.textContent = idea;
        btn.onclick = () => {
          document.getElementById('hub-chat-input').value = idea;
          document.getElementById('hub-chat-submit').click();
        };
        sgContainer.appendChild(btn);
      });
    }

    const submitBtn = document.getElementById('hub-chat-submit');
    const input = document.getElementById('hub-chat-input');
    
    if (submitBtn && input && !submitBtn.hasAttribute('data-bound')) {
      submitBtn.setAttribute('data-bound', true);
      
      const doSubmit = async () => {
        const q = input.value.trim();
        if (!q) return;

        // User Node
        logs.innerHTML += `
          <div class="flex gap-2.5 items-start flex-row-reverse mt-3">
            <div class="w-6 h-6 rounded-md bg-highlight-blue/10 text-highlight-blue flex items-center justify-center font-bold text-[9px] font-mono uppercase">YOU</div>
            <div class="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-3 rounded-l-xl rounded-br-xl text-on-surface dark:text-neutral-300 select-text leading-relaxed font-sans max-w-[85%] text-left">
               ${q}
            </div>
          </div>
        `;
        input.value = "";
        logs.scrollTop = logs.scrollHeight;

        // Stub AI loading
        const aiId = 'ai-res-' + Date.now();
        logs.innerHTML += `
          <div class="flex gap-2.5 items-start mt-3" id="${aiId}">
            <div class="w-6 h-6 rounded-md bg-[#6B4226]/10 text-[#6B4226] dark:bg-amber-400/15 dark:text-amber-400 flex items-center justify-center font-bold text-[9px] font-mono uppercase">AI</div>
            <div class="bg-surface-container/50 dark:bg-slate-900/40 p-3 rounded-r-xl rounded-bl-xl text-amber-600 dark:text-amber-400 select-text leading-relaxed font-sans max-w-[85%] text-left flex items-center gap-1.5">
               <i class="lucide-icon text-[12px] animate-spin" data-lucide="refresh-cw"></i> Seeking through Book Vault...
            </div>
          </div>
        `;
        logs.scrollTop = logs.scrollHeight;

        try {
          const bId = activeBookHub ? (activeBookHub.id || window.LuminaLibrary?.bookId(activeBookHub)) : null;
          const bookNotes = currentHighlights.filter(h => h.bookId === bId).map(h => h.text + (h.note ? " (Note: " + h.note + ")" : "")).join(" | ");

          const resp = await fetch('/api/note-ai-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'chat',
              noteText: `Context from notes: ${bookNotes}. Query: ${q}`,
              bookTitle: activeBookHub ? (activeBookHub.name || activeBookHub.title) : 'General Knowledge'
            })
          });

          if (!resp.ok) throw new Error("Synthesis limits reached.");
          const data = await resp.json();
          let out = data.resultText || "I do not have enough context.";
          
          let formattedText = out
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-amber-500 font-medium">$1</em>')
            .replace(/\n/g, '<br>');

          document.getElementById(aiId).querySelector('.bg-surface-container\\/50, .bg-slate-900\\/40').innerHTML = formattedText;
          document.getElementById(aiId).querySelector('.bg-surface-container\\/50, .bg-slate-900\\/40').classList.replace('text-amber-600', 'text-on-surface');
          document.getElementById(aiId).querySelector('.bg-surface-container\\/50, .bg-slate-900\\/40').classList.remove('text-amber-400');
        } catch(err) {
          document.getElementById(aiId).querySelector('.bg-surface-container\\/50, .bg-slate-900\\/40').innerHTML = `<span class="text-error font-mono">Cognitive Error: ${err.message}</span>`;
        }
        logs.scrollTop = logs.scrollHeight;
      };

      submitBtn.onclick = doSubmit;
      input.onkeypress = (e) => { if (e.key === 'Enter') doSubmit(); };
    }
  }

  let flashcardDeck = [];
  let flashcardIndex = 0;
  let flashcardShowingAnswer = false;

  function initializeHubFlashcards() {
    const generateBtn = document.getElementById('hub-btn-generate-flashcards');
    if (generateBtn) {
      generateBtn.onclick = async () => {
        const bId = activeBookHub ? (activeBookHub.id || window.LuminaLibrary?.bookId(activeBookHub)) : null;
        const bookNotesText = currentHighlights.filter(h => h.bookId === bId).map(n => n.text).join(". ");
        
        generateBtn.innerHTML = `<i class="lucide-icon text-[12px] animate-spin" data-lucide="refresh-cw"></i> GENERATING...`;

        try {
          // Send to standard summarize structure
          const resp = await fetch('/api/note-ai-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'summarize',
              noteText: `Generate exactly 3 flashcards from this text in format Q1: [question] A1: [answer]. Text: ${bookNotesText || "Philosophy."}`,
              bookTitle: activeBookHub ? (activeBookHub.name || activeBookHub.title) : 'Concept Study'
            })
          });

          const data = await resp.json();
          let out = data.resultText || "";
          
          flashcardDeck = [];
          
          if (out) {
            const lines = out.split('\n');
            let pendingQ = null;
            lines.forEach(l => {
              if (l.match(/^Q\d*:/)) pendingQ = l.replace(/^Q\d*:\s*/, '');
              if (l.match(/^A\d*:/) && pendingQ) {
                flashcardDeck.push({ q: pendingQ, a: l.replace(/^A\d*:\s*/, '') });
                pendingQ = null;
              }
            });
          }

          if (flashcardDeck.length === 0) {
            flashcardDeck = [
              { q: "What is the primary philosophical stance of this text?", a: "That is for you to discover through reading." },
              { q: "How does the main thesis challenge common perceptions?", a: "By presenting an inverted perspective on reality." }
            ];
          }

          flashcardIndex = 0;
          renderFlashcard();
          generateBtn.innerHTML = `<i class="lucide-icon text-xs" data-lucide="sparkles"></i> DECK RE-GENERATED`;
          setTimeout(() => { generateBtn.innerHTML = `<i class="lucide-icon text-xs" data-lucide="sparkles"></i> GENERATE CARDS WITH AI`; }, 2000);

        } catch (e) {
          console.error(e);
          generateBtn.innerHTML = `<i class="lucide-icon text-xs" data-lucide="circle-x"></i> FAILED`;
        }
      };
    }

    const cardScene = document.getElementById('flashcard-card-scene');
    if (cardScene) {
      cardScene.onclick = () => {
        if (flashcardDeck.length === 0) return;
        flashcardShowingAnswer = !flashcardShowingAnswer;
        const card = document.getElementById('flashcard-card');
        card.style.transform = flashcardShowingAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)';
      };
    }

    document.getElementById('flashcard-prev-btn')?.addEventListener('click', () => {
      if (flashcardDeck.length > 0) {
        flashcardIndex = (flashcardIndex - 1 + flashcardDeck.length) % flashcardDeck.length;
        renderFlashcard();
      }
    });

    document.getElementById('flashcard-next-btn')?.addEventListener('click', () => {
      if (flashcardDeck.length > 0) {
        flashcardIndex = (flashcardIndex + 1) % flashcardDeck.length;
        renderFlashcard();
      }
    });
    
    document.querySelectorAll('.rating-btn').forEach(btn => {
       btn.onclick = (e) => {
         e.stopPropagation();
         showTemporaryToast(`Card rating marked as ${e.target.innerText}`);
         setTimeout(() => document.getElementById('flashcard-next-btn')?.click(), 400);
       };
    });
  }

  function renderFlashcard() {
    if (flashcardDeck.length === 0) return;
    flashcardShowingAnswer = false;
    document.getElementById('flashcard-card').style.transform = 'rotateY(0deg)';
    
    document.getElementById('flashcard-front-text').textContent = flashcardDeck[flashcardIndex].q;
    document.getElementById('flashcard-back-text').textContent = flashcardDeck[flashcardIndex].a;
    document.getElementById('flashcard-progress-indicator').textContent = `Card ${flashcardIndex + 1} / ${flashcardDeck.length}`;
  }

  function renderHubTimeline() {
    const container = document.getElementById('hub-timeline-dynamic');
    if (!container) return;

    const bookTitle = activeBookHub ? (activeBookHub.name || activeBookHub.title) : 'Current Book';
    
    const events = [
      { year: "Pre-Publication", desc: "Influential movements surrounding the genesis of this ideology and similar thinkers." },
      { year: "Publication Milestone", desc: `First major release and circulation of ${bookTitle}.` },
      { year: "Integration Era", desc: "Key paradigms shifted, impacting subsequent academic and spiritual disciplines." }
    ];

    container.innerHTML = events.map(ev => `
      <div class="relative">
         <div class="absolute -left-[31px] bg-surface-container dark:bg-[#1A2234] border-[3px] border-surface dark:border-[#121824] rounded-full w-[14px] h-[14px] top-1"></div>
         <h5 class="text-xs font-bold text-on-surface dark:text-[#E4E2DD] uppercase tracking-wider">${ev.year}</h5>
         <p class="text-[10px] text-on-surface-variant font-serif mt-1 leading-relaxed max-w-sm">${ev.desc}</p>
      </div>
    `).join("");
  }

  // Populates AI cognitive notes builder
  function generateAISynthesis() {
    // Legacy support triggers on-demand hub synthesize instead
    const synthBtn = document.getElementById('hub-ai-synthesize');
    if (synthBtn) {
      synthBtn.click();
    } else {
      alert("AI study synthesis engine is fully integrated inside each Book's Knowledge Hub.");
    }
  }

  function triggerJSONBackup() {
    const timestamp = new Date().toISOString().split('T')[0];
    const raw = JSON.stringify(currentHighlights, null, 2);
    triggerFileDownload(raw, `wisdom_brain_archive_${timestamp}.json`, 'application/json');
    showTemporaryToast("Database Brain Archive exported!");
  }

  function triggerFileDownload(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function setActiveBook(bookId) {
    activeBookId = bookId;
    renderWorkspaceHighlights();
  }

  // UI styling status toast feedback
  function showTemporaryToast(message) {
    let t = document.getElementById('lumina-applet-toast-feedback');
    if (!t) {
      t = document.createElement('div');
      t.id = 'lumina-applet-toast-feedback';
      t.className = 'fixed bottom-16 left-1/2 -translate-x-1/2 z-[300] bg-[#1E1E1E] text-white text-[11px] font-semibold font-sans py-2.5 px-5 rounded-full shadow-2xl tracking-wide border border-white/10 animate-fade-in duration-300 select-none pointer-events-none flex items-center gap-1.5 uppercase';
      document.body.appendChild(t);
    }
    t.innerHTML = `<i class="lucide-icon text-xs text-[#FBBF24]" data-lucide="circle-check"></i> ${message}`;
    t.classList.remove('hidden');
    
    // Auto clearance
    if (window.toastTimer) clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      t.classList.add('hidden');
    }, 2800);
  }

  // Load initializer
  window.addEventListener('DOMContentLoaded', () => {
    initHighlights();
  });

  // Expose global endpoints safely
  window.LuminaHighlights = {
    init: initHighlights,
    getHighlights,
    addHighlight,
    updateHighlight,
    deleteHighlight,
    setActiveBook,
    renderWorkspaceHighlights,
    renderGlobalHighlights,
    quickHighlightSelection,
    insertFormatting,
    generateAISynthesis,
    exportData,
    exportBookData,
    triggerJSONBackup,
    openCreateModal,
    openEditModal,
    downloadCardAsImage,
    downloadAttachment,
    clearModalAttachment,
    triggerShareModal,
    setCardTheme,
    runAIAction,
    appendAIResultToReflection,
    renderBookKnowledgeHub
  };

  // Utility bar helper
  function insertFormatting(startText, endText = '') {
    const textarea = document.getElementById('highlight-modal-text');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const rawText = textarea.value;

    const selectedPart = rawText.substring(start, end);
    const replacement = startText + selectedPart + (endText || startText);

    textarea.value = rawText.substring(0, start) + replacement + rawText.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + startText.length, start + startText.length + selectedPart.length);
  }

})();
