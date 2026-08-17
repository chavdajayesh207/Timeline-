/**
 * WISDOM APPS - KNOWLEDGE VAULT ENGINE (PKM)
 * Fully local-first, offline-enabled second brain
 * Readwise + Obsidian + Notion + Apple Notes + Kindle hybrid
 */
(function() {
  'use strict';

  // Global PKM State
  const VaultState = {
    notes: [],
    books: [],
    notebooks: new Set(),
    activeNote: null,
    filters: {
      search: "",
      type: "all",
      book: "all",
      notebook: "all"
    },
    quotePresetColor: "cosmic"
  };

  // Selectors
  const DOM = {
    viewVault: () => document.getElementById('view-vault'),
    btnNewNote: () => document.getElementById('vault-btn-new-note'),
    btnNewNotebook: () => document.getElementById('vault-btn-new-notebook'),
    searchInput: () => document.getElementById('vault-search-input'),
    filterBook: () => document.getElementById('vault-filter-book'),
    filterNotebook: () => document.getElementById('vault-filter-notebook'),
    notebooksCount: () => document.getElementById('vault-notebook-count'),
    notebooksList: () => document.getElementById('vault-notebooks-list'),
    notesCount: () => document.getElementById('vault-notes-count'),
    notesFeed: () => document.getElementById('vault-notes-feed'),
    
    // Editor elements
    editorContainer: () => document.getElementById('vault-main-editor-container'),
    editorCard: () => document.getElementById('vault-active-editor-card'),
    emptyHubCard: () => document.getElementById('vault-empty-hub-card'),
    editorTypeBadge: () => document.getElementById('editor-current-type-badge'),
    editorTitle: () => document.getElementById('editor-note-title'),
    editorBook: () => document.getElementById('editor-note-book'),
    editorNotebook: () => document.getElementById('editor-note-notebook'),
    editorTags: () => document.getElementById('editor-note-tags'),
    editorBody: () => document.getElementById('editor-note-body'),
    editorTray: () => document.getElementById('editor-attachments-tray'),
    
    // Action Buttons
    btnSave: () => document.getElementById('editor-btn-save'),
    btnDelete: () => document.getElementById('editor-btn-delete'),
    btnShare: () => document.getElementById('editor-btn-share-modal'),
    btnExport: () => document.getElementById('editor-btn-export-dropdown'),
    btnCloseMobile: () => document.getElementById('editor-btn-close-mobile'),
    
    // Formatting Buttons
    fmtBold: () => document.getElementById('editor-fmt-bold'),
    fmtItalic: () => document.getElementById('editor-fmt-italic'),
    fmtCode: () => document.getElementById('editor-fmt-code'),
    fmtBullet: () => document.getElementById('editor-fmt-bullet'),
    fmtTodo: () => document.getElementById('editor-fmt-todo'),
    fmtQuote: () => document.getElementById('editor-fmt-quote'),
    fmtCallout: () => document.getElementById('editor-fmt-callout'),
    fmtImage: () => document.getElementById('editor-fmt-image'),
    fmtLink: () => document.getElementById('editor-fmt-link'),
    fmtTable: () => document.getElementById('editor-fmt-table'),
    
    // AI Elements
    aiHeader: () => document.getElementById('editor-ai-toggle-header'),
    aiChevron: () => document.getElementById('editor-ai-chevron'),
    aiToolsContent: () => document.getElementById('editor-ai-tools-content'),
    aiResultBox: () => document.getElementById('editor-ai-result-box'),
    aiResultText: () => document.getElementById('editor-ai-result-text'),
    aiResultLabel: () => document.getElementById('editor-ai-result-label'),
    aiResultClose: () => document.getElementById('editor-ai-result-close'),
    aiInsertBtn: () => document.getElementById('editor-ai-insert-btn'),
    
    aiSummarize: () => document.getElementById('intel-ai-summarize'),
    aiFlashcards: () => document.getElementById('intel-ai-flashcards'),
    aiMindmap: () => document.getElementById('intel-ai-mindmap'),
    aiIdeas: () => document.getElementById('intel-ai-ideas'),
    aiActions: () => document.getElementById('intel-ai-actions'),
    
    // Share elements
    shareModal: () => document.getElementById('vault-share-modal'),
    shareModalClose: () => document.getElementById('vault-share-modal-close'),
    cardFrame: () => document.getElementById('quote-card-studio-frame'),
    cardQuoteContent: () => document.getElementById('card-quote-content'),
    cardBookCitation: () => document.getElementById('card-book-citation'),
    cardAuthorCitation: () => document.getElementById('card-author-citation'),
    cardDateBadge: () => document.getElementById('card-date-badge'),
    btnShareDownload: () => document.getElementById('vault-share-download-image'),
    btnShareCopyLink: () => document.getElementById('vault-share-link-copy'),
    
    // Empty stats hub shortcuts
    hubBtnNote: () => document.getElementById('empty-hub-create-note'),
    hubBtnGroup: () => document.getElementById('empty-hub-add-notebook'),
  };

  // Start initialization on DOM Ready
  window?.addEventListener('DOMContentLoaded', () => {
    initVault();
  });

  // Main init routine
  async function initVault() {
    console.log("Wisdom AI initializing...");
    if (!DOM.btnNewNote()) {
        console.log("Wisdom UI not found, skipping init.");
        return;
    }
    
    // 1. Initial State Sync
    await syncState();

    // 1.5 Setup Context (NotebookLM Engine)
    setupNotebookLMContext();

    // 2. Setup Navigation Watcher
    setupTabNavigation();

    // 3. Register General Listeners
    setupGeneralListeners();

    // 4. Register Formatting Listeners
    setupFormattingListeners();

    // 5. Register AI Listeners
    setupAIListeners();

    // 6. Register Share Modal Listeners
    setupShareListeners();
  }

  // Reload notes and lists from LuminaDB
  async function syncState() {
    if (!window.LuminaDB) {
      console.warn("LuminaDB module missing. Local state temporary.");
      return;
    }

    try {
      // Fetch books
      VaultState.books = await window.LuminaDB.getBooks();
      
      // Fetch user notes
      const notesData = await window.LuminaDB.getNotes();
      
      // Filter out any default placeholder templates if needed, or parse them
      VaultState.notes = notesData;
      
      // Collect notebook groups
      VaultState.notebooks.clear();
      VaultState.notes.forEach(n => {
        if (n.notebookName) {
          VaultState.notebooks.add(n.notebookName);
        }
      });

      // Render dropdown options
      populateDropdownFilters();

      // Render Notes List Feed
      renderFeedList();
      renderNotebooksList();
    } catch (e) {
      console.error("Failed to synchronize state with LuminaDB:", e);
    }
  }

  // Populate drop-down book filters
  function populateDropdownFilters() {
    const filterBookSelect = DOM.filterBook();
    const filterNotebookSelect = DOM.filterNotebook();
    const editorBookSelect = DOM.editorBook();

    if (!filterBookSelect || !editorBookSelect) return;

    // Preserve first item
    filterBookSelect.innerHTML = `<option value="all">All volume contexts</option>`;
    editorBookSelect.innerHTML = `<option value="general">📔 General Sanctuary Note</option>`;

    // Populate books
    VaultState.books.forEach(b => {
      const bookTitle = b.name || b.title || "Untitled volume";
      const bookIdStr = b.id || b.name;
      
      const filterOpt = document.createElement("option");
      filterOpt.value = bookIdStr;
      filterOpt.textContent = bookTitle;
      filterBookSelect.appendChild(filterOpt);

      const editorOpt = document.createElement("option");
      editorOpt.value = bookIdStr;
      editorOpt.textContent = `📖 Context: ${bookTitle}`;
      editorBookSelect.appendChild(editorOpt);
    });

    // Populate notebooks
    if (filterNotebookSelect) {
      filterNotebookSelect.innerHTML = `<option value="all">All Logbooks</option>`;
      VaultState.notebooks.forEach(nbName => {
        const opt = document.createElement("option");
        opt.value = nbName;
        opt.textContent = nbName;
        filterNotebookSelect.appendChild(opt);
      });
    }
  }

  // ==========================================
  // NOTEBOOKLM CONTEXT ENGINE
  // ==========================================
  function setupNotebookLMContext() {
    const tabs = document.querySelectorAll('.nl-tab');
    const panels = document.querySelectorAll('.nl-panel');
    const currentBookLabel = document.getElementById('notebooklm-current-book');
    const btnRefresh = document.getElementById('notebooklm-btn-refresh');

    function getNotebookLMSourceText() {
        // Collect notes for currently filtered book or all notes if 'all'
        let sourceItems = [...VaultState.notes];
        const currentBookFilter = VaultState.filters.book;
        if (currentBookFilter !== 'all') {
            sourceItems = sourceItems.filter(n => n.bookId === currentBookFilter);
        }
        
        let bookName = "All Books Context";
        if (currentBookFilter !== 'all') {
            const b = VaultState.books.find(x => x.id === currentBookFilter || x.name === currentBookFilter);
            if (b) bookName = b.name || b.title;
        }

        if (currentBookLabel) {
            currentBookLabel.textContent = bookName;
        }

        return sourceItems.map(n => n.content || n.text || n.title).join(". ").substring(0, 5000);
    }

    if (btnRefresh) {
        btnRefresh?.addEventListener('click', () => {
            getNotebookLMSourceText();
            // Pulse effect to show it updated
            currentBookLabel.classList.add('animate-pulse', 'text-primary');
            setTimeout(() => currentBookLabel.classList.remove('animate-pulse', 'text-primary'), 500);
        });
    }

    // Switch Tabs
    tabs.forEach(tab => {
        tab?.addEventListener('click', () => {
             tabs.forEach(t => {
                 t.classList.remove('border-primary', 'text-primary');
                 t.classList.add('border-transparent', 'text-on-surface-variant/70');
             });
             // Legacy panels were hidden, now we just scroll to them
             const target = tab.getAttribute('data-tab');
             const panel = document.getElementById(`nl-panel-${target}`);
             if (panel) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
             }

             tab.classList.remove('border-transparent', 'text-on-surface-variant/70');
             tab.classList.add('border-primary', 'text-primary');
        });
    });

    // Default activate first tab (Summary)
    if (tabs.length > 0) {
        // No longer click the first tab because we don't selectively hide anymore
    }

    // Initial context population
    setTimeout(() => {
        if (btnRefresh) btnRefresh.click();
    }, 500);

    // Chat functionality
    const chatSubmitBtn = document.getElementById('nl-chat-submit');
    const chatInput = document.getElementById('nl-chat-input');
    const chatLogs = document.getElementById('nl-chat-logs');
    
    if (chatSubmitBtn && chatInput && chatLogs) {
        const doChat = async () => {
           const q = chatInput.value.trim();
           if (!q) return;

           const sourceContext = getNotebookLMSourceText();
           let bookName = currentBookLabel ? currentBookLabel.textContent : "Knowledge Vault Context";

           // Optimistic UI updates
           chatLogs.innerHTML += `
             <div class="flex gap-2.5 items-start flex-row-reverse mt-3">
               <div class="w-6 h-6 rounded-md bg-highlight-blue/10 text-highlight-blue flex items-center justify-center font-bold text-[9px] font-mono uppercase">YOU</div>
               <div class="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-3 rounded-l-xl rounded-br-xl text-on-surface dark:text-neutral-300 select-text leading-relaxed font-sans max-w-[85%] text-left text-sm">
                  ${q}
               </div>
             </div>
           `;
           chatInput.value = "";
           chatLogs.scrollTop = chatLogs.scrollHeight;

           const aiId = 'ai-nl-' + Date.now();
           chatLogs.innerHTML += `
             <div class="flex gap-2.5 items-start mt-3" id="${aiId}">
               <div class="w-6 h-6 rounded-md bg-[#6B4226]/10 text-[#6B4226] dark:bg-amber-400/15 dark:text-amber-400 flex items-center justify-center font-bold text-[9px] font-mono uppercase">AI</div>
               <div class="bg-surface-container/50 dark:bg-slate-900/40 p-3 rounded-r-xl rounded-bl-xl text-amber-600 dark:text-amber-400 select-text leading-relaxed font-sans max-w-[85%] text-left flex items-center gap-1.5 text-sm border border-outline-variant/10">
                  <i class="lucide-icon text-[14px] animate-spin" data-lucide="refresh-cw"></i> Processing context...
               </div>
             </div>
           `;
           chatLogs.scrollTop = chatLogs.scrollHeight;

           try {
             const resp = await fetch('/api/note-ai-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                   action: 'chat',
                   noteText: `[CONTEXT FROM BOOK: ${bookName}]: ${sourceContext}\n\nUser Question: ${q}`,
                   bookTitle: bookName
                })
             });
             if (!resp.ok) throw new Error("Synthesis limits reached.");
             const data = await resp.json();
             
             let formattedText = (data.resultText || "")
               .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\*(.*?)\*/g, '<em class="text-amber-600 dark:text-amber-400 font-medium">$1</em>')
               .replace(/\n/g, '<br>');

             const targetBubble = document.getElementById(aiId)?.querySelector('.bg-surface-container\\/50, .bg-slate-900\\/40');
             if (targetBubble) {
                 targetBubble.innerHTML = formattedText;
                 targetBubble.classList.replace('text-amber-600', 'text-on-surface');
                 targetBubble.classList.remove('dark:text-amber-400', 'flex', 'items-center', 'gap-1.5');
             }
           } catch(err) {
             const targetBubble = document.getElementById(aiId)?.querySelector('.bg-surface-container\\/50, .bg-slate-900\\/40');
             if (targetBubble) {
                 targetBubble.innerHTML = `<span class="text-error font-mono text-xs">Error: ${err.message}</span>`;
             }
           }
           chatLogs.scrollTop = chatLogs.scrollHeight;
        };

        chatSubmitBtn?.addEventListener('click', doChat);
        chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') doChat(); });
    }

    // Wiring up Generators
    async function createNotebookLMAction(buttonId, resultId, actionType, instruction) {
       const btn = document.getElementById(buttonId);
       const resContainer = document.getElementById(resultId);
       if (!btn || !resContainer) return;

       btn?.addEventListener('click', async () => {
           const sourceContext = getNotebookLMSourceText();
           let bookName = currentBookLabel ? currentBookLabel.textContent : "Knowledge Vault Context";

           if (!sourceContext || sourceContext.trim() === "") {
               resContainer.innerHTML = `<span class="text-error font-mono text-xs">No notes found for this context. Read a book or take notes first.</span>`;
               return;
           }

           btn.innerHTML = `<i class="lucide-icon text-[14px] animate-spin" data-lucide="refresh-cw"></i> Working...`;
           btn.classList.add('opacity-70', 'pointer-events-none');
           resContainer.innerHTML = `<div class="flex items-center gap-2 justify-center py-10 font-mono text-primary text-xs"><i class="lucide-icon animate-spin" data-lucide="refresh-ccw"></i> Synthesizing from ${VaultState.notes.length} fragments...</div>`;

           try {
             const resp = await fetch('/api/note-ai-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                   action: actionType,
                   noteText: `[CONTEXT FROM BOOK: ${bookName}]: ${sourceContext}\n\nTask: ${instruction}`,
                   bookTitle: bookName
                })
             });
             if (!resp.ok) throw new Error("API limits or server error.");
             const data = await resp.json();
             
             // Format specifically for action plan, summary, connections
             if (actionType === 'summarize') {
                 let out = (data.resultText || "").replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                 resContainer.innerHTML = `<div class="p-3 bg-surface-container rounded-xl shadow-inner border border-outline-variant/10 leading-relaxed">${out}</div>`;
             } else if (buttonId === 'nl-gen-flashcard') {
                 // Render dynamic flashcard
                 let out = data.resultText || "";
                 let deck = [];
                 const lines = out.split('\n');
                 let pendingQ = null;
                 lines.forEach(l => {
                    if (l.match(/^Q\d*:/)) pendingQ = l.replace(/^Q\d*:\s*/, '');
                    if (l.match(/^A\d*:/) && pendingQ) {
                      deck.push({ q: pendingQ, a: l.replace(/^A\d*:\s*/, '') });
                      pendingQ = null;
                    }
                 });
                 if (deck.length === 0) deck = [{q: "What is the key idea of this context?", a: data.resultText}];
                 
                 resContainer.innerHTML = `
                   <div class="relative w-full max-w-sm h-48 [perspective:1000px] cursor-pointer group" onclick="this.querySelector('.flip-card-inner').classList.toggle('[transform:rotateY(180deg)]')">
                     <div class="flip-card-inner w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d]">
                       <div class="absolute inset-0 bg-primary text-on-primary rounded-xl flex items-center justify-center p-6 text-center font-serif text-lg font-bold shadow-lg [backface-visibility:hidden]">
                         ${deck[0].q}
                       </div>
                       <div class="absolute inset-0 bg-surface-container-high text-on-surface rounded-xl flex flex-col items-center justify-center p-6 text-center font-sans text-sm shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] border border-outline-variant/20 relative">
                         ${deck[0].a}
                         <div class="absolute bottom-2 text-[8px] font-mono text-on-surface-variant uppercase tracking-widest">TAP TO FLIP</div>
                       </div>
                     </div>
                     <p class="text-center text-[10px] text-on-surface-variant font-mono mt-4 tracking-wider">CARD 1 OF ${deck.length} · TAP TO FLIP</p>
                   </div>
                 `;
             } else if (buttonId === 'nl-gen-connections') {
                 let out = (data.resultText || "").replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>');
                 resContainer.innerHTML = `<div class="p-4 border-l-2 border-primary bg-primary/5 rounded-r-xl">${out}</div>`;
             } else if (buttonId === 'nl-gen-actionplan') {
                 // Try to render as checklist
                 let items = (data.resultText || "").split('\n').filter(i=>i.trim().length > 3);
                 resContainer.innerHTML = `
                   <ul class="space-y-2">
                     ${items.map(i => `
                       <li class="flex gap-3 items-start p-2 bg-surface-container border border-outline-variant/10 rounded-lg">
                          <input type="checkbox" class="mt-1 flex-shrink-0 w-4 h-4 text-primary bg-surface-container-low border-outline-variant/30 rounded focus:ring-primary focus:ring-1">
                          <span class="text-xs text-on-surface">${i.replace(/^- /, '').replace(/\*(.*?)\*/g, '<em>$1</em>')}</span>
                       </li>
                     `).join("")}
                   </ul>
                 `;
             } else if (buttonId === 'nl-gen-roadmap') {
                 let out = (data.resultText || "").replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>');
                 resContainer.innerHTML = `<div class="p-3 bg-surface-container rounded-xl shadow-inner border border-outline-variant/10 leading-relaxed font-sans text-sm">${out}</div>`;
             } else if (buttonId === 'nl-gen-quiz') {
                 let out = (data.resultText || "").replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                 resContainer.innerHTML = `<div class="p-3 bg-surface-container rounded-xl shadow-inner border border-outline-variant/10 leading-relaxed font-sans text-sm">${out}</div>`;
             }

           } catch(e) {
               resContainer.innerHTML = `<span class="text-error font-mono text-xs">Error: ${e.message}</span>`;
           } finally {
               btn.innerHTML = `<i class="lucide-icon text-[14px]" data-lucide="wand"></i> Re-Generate`;
               btn.classList.remove('opacity-70', 'pointer-events-none');
           }
       });
    }

    createNotebookLMAction('nl-gen-summary', 'nl-res-summary', 'summarize', 'Write a deep, multi-paragraph synthesis of these concepts.');
    createNotebookLMAction('nl-gen-flashcard', 'nl-res-flashcard', 'flashcard', 'Generate flashcards for active recall from this text in the format Q1: [question] \n A1: [answer]. Provide up to 5 cards.');
    createNotebookLMAction('nl-gen-connections', 'nl-res-connections', 'connections', 'Find overlapping concepts, surprising connections, and common threads between the provided notes. Focus on cross-disciplinary insights.');
    createNotebookLMAction('nl-gen-actionplan', 'nl-res-actionplan', 'actionplan', 'Convert the key insights of this context into an actionable checklist of steps, max 7 items. Format each as a bullet point starting with "- ".');
    createNotebookLMAction('nl-gen-roadmap', 'nl-res-roadmap', 'roadmap', 'Generate a 4-week roadmap based on this context.');
    createNotebookLMAction('nl-gen-quiz', 'nl-res-quiz', 'quiz', 'Generate a 5-question multi-choice quiz based on this context.');

    // Mindmap has custom visual logic
    const mindmapBtn = document.getElementById('nl-gen-mindmap');
    const mindmapSvg = document.getElementById('nl-svg-mindmap');
    const mindmapRes = document.getElementById('nl-res-mindmap');
    
    if (mindmapBtn && mindmapSvg && mindmapRes) {
        mindmapBtn?.addEventListener('click', () => {
            mindmapRes.querySelector('div')?.classList.add('hidden');
            mindmapSvg.classList.remove('hidden');
            
            const currentBookFilter = VaultState.filters.book;
            const bookName = currentBookLabel ? currentBookLabel.textContent : "Concepts";
            let notesToMap = VaultState.notes.slice(0, 10);
            if (currentBookFilter !== 'all') {
                notesToMap = VaultState.notes.filter(n => n.bookId === currentBookFilter).slice(0, 10);
            }

            const centerX = 300, centerY = 100;
            let nodeElements = `<circle cx="${centerX}" cy="${centerY}" r="30" class="fill-primary/20 stroke-primary/50 stroke-1" /><text x="${centerX}" y="${centerY - 40}" class="text-[10px] fill-primary font-bold font-sans text-anchor-middle tracking-wider uppercase" style="text-anchor: middle;">${bookName.substring(0,25)}</text><text x="${centerX}" y="${centerY + 5}" class="text-[16px] fill-primary font-sans font-bold text-anchor-middle material-symbols-outlined" style="text-anchor: middle;">auto_stories</text>`;
            let linkElements = '';
            
            if (notesToMap.length > 0) {
               const radius = 80;
               const angleStep = (2 * Math.PI) / notesToMap.length;
               
               notesToMap.forEach((n, i) => {
                  const angle = i * angleStep;
                  const x = centerX + radius * Math.cos(angle);
                  const y = centerY + radius * Math.sin(angle);
                  
                  linkElements += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" class="stroke-outline-variant/30 stroke-1" style="stroke-dasharray: 4,4;" />`;
                  // Use inline script or class for simple animation
                  nodeElements += `<circle cx="${x}" cy="${y}" r="20" class="fill-amber-500/10 stroke-amber-500/40 stroke-1 cursor-pointer transition-all hover:fill-amber-500/30 hover:r-24" />
                  <text x="${x}" y="${y + 35}" class="text-[8px] fill-on-surface-variant font-mono" style="text-anchor: middle;">${(n.title||n.type||"Fragment").substring(0,12)}</text>
                  <g class="cursor-pointer">
                    <circle cx="${x}" cy="${y}" r="12" class="fill-transparent" />
                    <text x="${x}" y="${y + 4}" class="text-[12px] fill-amber-600 dark:fill-amber-400 font-sans material-symbols-outlined pointer-events-none" style="text-anchor: middle;">lightbulb</text>
                  </g>`;
               });
            } else {
               nodeElements += `<text x="${centerX}" y="${centerY + 50}" class="text-[10px] fill-on-surface-variant font-mono" style="text-anchor: middle;">No nodes in this context.</text>`;
            }
            
            mindmapSvg.innerHTML = `<g>${linkElements}${nodeElements}</g>`;
        });
    }
  }

  // Dynamic router to listen for bottom menu switching to 'vault'.
  function setupTabNavigation() {
    const tabs = document.querySelectorAll('#bottom-nav .nav-tab');
    tabs.forEach(tab => {
      tab?.addEventListener('click', (e) => {
        const targetView = tab.getAttribute('data-view');
        if (targetView === 'vault') {
          syncState(); // reload fresh state
        }
      });
    });
  }

  // Render left panel feed listing filtered items
  function renderFeedList() {
    const feed = DOM.notesFeed();
    const countLabel = DOM.notesCount();
    if (!feed) return;

    let items = [...VaultState.notes];

    // Search query constraint
    if (VaultState.filters.search) {
      const q = VaultState.filters.search.toLowerCase();
      items = items.filter(n => 
        (n.title && n.title.toLowerCase().includes(q)) || 
        (n.content && n.content.toLowerCase().includes(q)) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q))) ||
        (n.notebookName && n.notebookName.toLowerCase().includes(q))
      );
    }

    // Type tab constraint
    if (VaultState.filters.type !== 'all') {
      items = items.filter(n => n.type === VaultState.filters.type);
    }

    // Book constraint
    if (VaultState.filters.book !== 'all') {
      items = items.filter(n => n.bookId === VaultState.filters.book);
    }

    // Notebook constraint
    if (VaultState.filters.notebook !== 'all') {
      items = items.filter(n => n.notebookName === VaultState.filters.notebook);
    }

    // Sort descending by date
    items.sort((a,b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));

    // Update count labels
    if (countLabel) {
      countLabel.textContent = `${items.length} logged fragments`;
    }

    if (items.length === 0) {
      feed.innerHTML = `
        <div class="py-8 text-center bg-surface-container-low/10 dark:bg-slate-900/10 rounded-xl border border-dashed border-outline-variant/10">
          <i class="lucide-icon text-3xl opacity-35 text-on-surface-variant block mb-1.5" data-lucide="pen-tool"></i>
          <p class="text-[11px] text-on-surface-variant font-mono uppercase tracking-wider">No wisdom matching filter</p>
        </div>`;
      return;
    }

    feed.innerHTML = "";
    items.forEach(note => {
      const card = document.createElement("div");
      card.className = `vault-note-card p-3 rounded-xl border border-outline-variant/10 dark:border-outline-variant/5 bg-[#FDFCF9]/60 dark:bg-[#111622]/60 hover:bg-white dark:hover:bg-[#151C2C] hover:shadow-md hover:border-primary/25 transition-all cursor-pointer duration-200 text-xs flex flex-col justify-between ${VaultState.activeNote && VaultState.activeNote.id === note.id ? 'ring-1 ring-primary border-primary bg-white dark:bg-[#151C2C]' : ''}`;
      
      const displayTitle = note.title || "Untitled Fragment";
      const snippet = cleanHtmlSnippet(note.content, 90);
      const categoryLabel = note.type ? note.type.toUpperCase() : "NOTE";
      const bookContext = note.bookTitle || "General Sanctum";
      const formattedDate = new Date(note.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

      // Build badge style
      let badgeStyle = "bg-[#6B4226]/10 text-[#6B4226] dark:bg-amber-400/10 dark:text-amber-400";
      if (note.type === 'highlight') badgeStyle = "bg-teal-500/10 text-teal-700 dark:text-teal-400";
      if (note.type === 'quote') badgeStyle = "bg-amber-500/10 text-amber-700 dark:text-amber-300";
      if (note.type === 'insight') badgeStyle = "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400";
      if (note.type === 'bookmark') badgeStyle = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

      card.innerHTML = `
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded ${badgeStyle} font-bold">${categoryLabel}</span>
            <span class="text-[8px] font-mono text-on-surface-variant/55">${formattedDate}</span>
          </div>
          <h4 class="font-serif font-bold text-[#1E1E1E] dark:text-[#E4E2DD] leading-snug group-hover:text-primary transition-colors text-sm">${displayTitle}</h4>
          <p class="text-[11px] text-on-surface-variant/80 font-normal leading-relaxed line-clamp-2">${snippet}</p>
        </div>
        <div class="flex items-center gap-1.5 pt-2 mt-2 border-t border-outline-variant/10 text-[9px] font-mono text-on-surface-variant/65">
          <i class="lucide-icon text-[10px]" data-lucide="library"></i>
          <span class="truncate block max-w-[190px]">${bookContext}</span>
        </div>`;

      card.onclick = () => {
        loadNoteToEditor(note);
      };
      feed.appendChild(card);
    });
  }

  // Render Left panel notebooks listings
  function renderNotebooksList() {
    const list = DOM.notebooksList();
    const countLabel = DOM.notebooksCount();
    if (!list) return;

    if (countLabel) {
      countLabel.textContent = `${VaultState.notebooks.size} categories`;
    }

    if (VaultState.notebooks.size === 0) {
      list.innerHTML = `
        <div class="text-[10px] text-on-surface-variant/65 text-center font-mono py-2 opacity-55">
          No categories defined yet. Create notes with notebooks to compile logbooks.
        </div>`;
      return;
    }

    list.innerHTML = "";
    VaultState.notebooks.forEach(nbName => {
      const activeFilter = VaultState.filters.notebook === nbName;
      const count = VaultState.notes.filter(n => n.notebookName === nbName).length;

      const item = document.createElement("div");
      item.className = `flex justify-between items-center py-1.5 px-2.5 rounded-lg text-[11px] font-semibold cursor-pointer hover:bg-surface-container transition-all text-on-surface-variant hover:text-primary select-none ${activeFilter ? 'bg-primary/10 text-primary font-bold' : ''}`;
      
      item.innerHTML = `
        <div class="flex items-center gap-2">
          <i class="lucide-icon text-xs" data-lucide="folder"></i>
          <span class="truncate block max-w-[130px]">${nbName}</span>
        </div>
        <span class="font-mono text-[9px] px-1.5 py-0.5 bg-surface-container rounded-md font-bold text-on-surface-variant">${count}</span>`;

      item.onclick = () => {
        if (VaultState.filters.notebook === nbName) {
          VaultState.filters.notebook = "all"; // Toggle off
        } else {
          VaultState.filters.notebook = nbName;
        }
        syncState();
      };
      list.appendChild(item);
    });
  }

  // Help strip HTML tags and crop text
  function cleanHtmlSnippet(html, maxLen) {
    if (!html) return "Draft notes body...";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || doc.body.innerText || "";
    if (text.length <= maxLen) return text.trim();
    return text.trim().slice(0, maxLen) + "...";
  }

  // Open note inside pristine Apple Editor
  function loadNoteToEditor(note) {
    VaultState.activeNote = note;

    // Toggle Hub vs editor
    DOM.emptyHubCard().classList.add('hidden');
    DOM.editorCard().classList.remove('hidden');

    DOM.editorTitle().value = note.title || "";
    DOM.editorBody().innerHTML = note.content || "";
    DOM.editorNotebook().value = note.notebookName || "";
    DOM.editorTags().value = note.tags ? note.tags.join(', ') : "";
    DOM.editorBook().value = note.bookId || "general";

    // Set type Badge
    const badge = DOM.editorTypeBadge();
    if (badge) {
      badge.textContent = note.type ? note.type.toUpperCase() : "NOTE";
    }

    // Refresh layout cards to highlight currently selected active item list
    renderFeedList();
  }

  // Setup Event Listeners for Filters and Navigation click events
  function setupGeneralListeners() {
    // Search filter input
    const search = DOM.searchInput();
    if (search) {
      search?.addEventListener('input', (e) => {
        VaultState.filters.search = e.target.value;
        renderFeedList();
      });
    }

    // Book Filter Dropdown
    const filterBook = DOM.filterBook();
    if (filterBook) {
      filterBook?.addEventListener('change', (e) => {
        VaultState.filters.book = e.target.value;
        renderFeedList();
        const refreshBtn = document.getElementById('notebooklm-btn-refresh');
        if (refreshBtn) refreshBtn.click();
      });
    }

    // Notebook Filter Dropdown
    const filterNotebook = DOM.filterNotebook();
    if (filterNotebook) {
      filterNotebook?.addEventListener('change', (e) => {
        VaultState.filters.notebook = e.target.value;
        renderFeedList();
      });
    }

    // Type Category Tabs
    const typeTabs = document.querySelectorAll('.vault-type-tab');
    typeTabs.forEach(tab => {
      tab?.addEventListener('click', (e) => {
        typeTabs.forEach(t => {
          t.classList.remove('bg-primary', 'text-on-primary');
          t.classList.add('border', 'border-outline-variant/20', 'text-on-surface-variant');
        });
        tab.classList.add('bg-primary', 'text-on-primary');
        tab.classList.remove('border', 'border-outline-variant/20', 'text-on-surface-variant');

        VaultState.filters.type = tab.getAttribute('data-type');
        renderFeedList();
      });
    });

    // Create New Note Toolbar launcher
    const createNewNoteFn = () => {
      const defaultNote = {
        id: "note_" + Date.now(),
        title: "The Silent Lotus",
        content: `<div>Write your insights here... Select words to format. Format Quotes or checklists:</div>
          <blockquote class="border-l-4 border-primary bg-primary/5 pl-3 py-1 my-2">"True silence is not the absence of sound, but the presence of clear awareness."</blockquote>
          <div>Use formatting buttons above to add tables, links, images or launch AI scholar companion tools below.</div>`,
        type: "note",
        bookId: "general",
        bookTitle: "General Sanctuary Note",
        notebookName: "Uncategorized",
        tags: ["awareness", "meditation"],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      loadNoteToEditor(defaultNote);
    };

    DOM.btnNewNote().onclick = createNewNoteFn;
    DOM.hubBtnNote().onclick = createNewNoteFn;

    // Create New Notebook Launcher
    DOM.btnNewNotebook().onclick = () => {
      const name = prompt("Enter new logbook directory name:");
      if (name && name.trim()) {
        VaultState.notebooks.add(name.trim());
        syncState();
      }
    };
    if (DOM.hubBtnGroup()) {
      DOM.hubBtnGroup().onclick = DOM.btnNewNotebook().onclick;
    }

    // Save active note click
    DOM.btnSave().onclick = async () => {
      if (!VaultState.activeNote) return;

      const title = DOM.editorTitle().value.trim() || "Untitled Fragment";
      const content = DOM.editorBody().innerHTML;
      const notebookName = DOM.editorNotebook().value.trim() || "Uncategorized";
      const tagsString = DOM.editorTags().value.trim();
      const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];
      const bookId = DOM.editorBook().value;
      
      // Look up book title
      let bookTitle = "General Sanctuary Note";
      if (bookId !== "general") {
        const matchingBook = VaultState.books.find(b => b.id === bookId);
        if (matchingBook) {
          bookTitle = matchingBook.name || matchingBook.title;
        }
      }

      const updatedNote = {
        ...VaultState.activeNote,
        title,
        content,
        notebookName,
        tags,
        bookId,
        bookTitle,
        updatedAt: Date.now()
      };

      if (!updatedNote.createdAt) {
        updatedNote.createdAt = Date.now();
      }

      try {
        if (window.LuminaDB) {
          await window.LuminaDB.saveNote(updatedNote);
          // Show quick popup
          showToast("Cosmic wisdom saved into Vault.");
          await syncState();
          // Keep editor active
          const freshNote = VaultState.notes.find(n => n.id === updatedNote.id) || updatedNote;
          loadNoteToEditor(freshNote);
        }
      } catch (err) {
        console.error("Failed to save note:", err);
        showToast("Error updating Local DB.", true);
      }
    };

    // Close on mobile
    DOM.btnCloseMobile().onclick = () => {
      DOM.editorCard().classList.add('hidden');
      DOM.emptyHubCard().classList.remove('hidden');
      VaultState.activeNote = null;
      renderFeedList();
    };

    // Delete active Note click
    DOM.btnDelete().onclick = async () => {
      if (!VaultState.activeNote) return;
      if (!confirm("Are you sure you want to delete this wisdom fragment? It cannot be reverted.")) return;

      try {
        if (window.LuminaDB) {
          await window.LuminaDB.deleteNote(VaultState.activeNote.id);
          showToast("Wisdom fragment discarded from database.");
          VaultState.activeNote = null;
          DOM.editorCard().classList.add('hidden');
          DOM.emptyHubCard().classList.remove('hidden');
          await syncState();
        }
      } catch (err) {
        console.error(err);
      }
    };
  }

  // Setup formatting toolbar buttons
  function setupFormattingListeners() {
    DOM.fmtBold().onclick = (e) => {
      e.preventDefault();
      document.execCommand('bold', false);
    };

    DOM.fmtItalic().onclick = (e) => {
      e.preventDefault();
      document.execCommand('italic', false);
    };

    DOM.fmtCode().onclick = (e) => {
      e.preventDefault();
      document.execCommand('fontName', false, 'Courier');
    };

    DOM.fmtBullet().onclick = (e) => {
      e.preventDefault();
      document.execCommand('insertUnorderedList', false);
    };

    DOM.fmtTodo().onclick = (e) => {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const val = selection.toString() || "Task item Checklist";
      
      const todoDiv = document.createElement("div");
      todoDiv.className = "flex items-start gap-2 py-1 select-none font-sans";
      todoDiv.innerHTML = `
        <input type="checkbox" class="mt-1 accent-primary" style="cursor:pointer;" />
        <span contenteditable="true" style="outline:none; width:100%">${val}</span>`;
      
      range.deleteContents();
      range.insertNode(todoDiv);
    };

    DOM.fmtQuote().onclick = (e) => {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const val = selection.toString() || "In silence, the soul speaks.";
      
      const bq = document.createElement("blockquote");
      bq.className = "border-l-4 border-primary/60 bg-primary/5 dark:bg-[#6b4226]/5 pl-4 py-2 italic font-serif my-3.5 text-on-surface";
      bq.innerHTML = `"${val}"`;
      
      range.deleteContents();
      range.insertNode(bq);
    };

    DOM.fmtCallout().onclick = (e) => {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const val = selection.toString() || "Important ancient tenets context.";
      
      const callout = document.createElement("div");
      callout.className = "p-3 bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 rounded-xl my-3 flex gap-2.5 items-start text-xs font-sans text-on-surface";
      callout.innerHTML = `
        <i class="lucide-icon text-amber-500 font-bold select-none text-sm" data-lucide="sparkles"></i>
        <div class="flex-1" contenteditable="true" style="outline:none;">${val}</div>`;
      
      range.deleteContents();
      range.insertNode(callout);
    };

    DOM.fmtLink().onclick = (e) => {
      e.preventDefault();
      const url = prompt("Enter Link URL (e.g. https://example.com):");
      if (url) {
        document.execCommand('createLink', false, url);
      }
    };

    DOM.fmtImage().onclick = (e) => {
      e.preventDefault();
      const url = prompt("Enter Image URL or file address:");
      if (url) {
        const img = document.createElement("img");
        img.src = url;
        img.className = "max-w-xs rounded-xl border border-outline-variant/10 my-3.5 shadow-md block h-auto";
        img.setAttribute("referrerpolicy", "no-referrer");

        const selection = window.getSelection();
        if (selection.rangeCount) {
          const range = selection.getRangeAt(0);
          range.insertNode(img);
        }
      }
    };

    DOM.fmtTable().onclick = (e) => {
      e.preventDefault();
      const table = document.createElement("table");
      table.className = "w-full border-collapse border border-outline-variant/15 font-sans text-xs my-4 rounded-xl overflow-hidden";
      table.innerHTML = `
        <thead>
          <tr class="bg-surface-container-low">
            <th class="border border-outline-variant/15 p-2 text-left">Tenet Keyword</th>
            <th class="border border-outline-variant/15 p-2 text-left">Theological Definition</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-outline-variant/15 p-2" contenteditable="true">Pristine Calm</td>
            <td class="border border-outline-variant/15 p-2" contenteditable="true">Absolute cessation of digital notifications and sensory overload.</td>
          </tr>
          <tr>
            <td class="border border-outline-variant/15 p-2" contenteditable="true">Inner Breath</td>
            <td class="border border-outline-variant/15 p-2" contenteditable="true">Centering focus through rhythmic diaphragmatic intervals.</td>
          </tr>
        </tbody>`;

      const selection = window.getSelection();
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.insertNode(table);
      }
    };
  }

  // Setup AI Scholar companion event triggers
  function setupAIListeners() {
    // Show/hide AI tools accordion panels
    DOM.aiHeader().onclick = () => {
      const content = DOM.aiToolsContent();
      const chevron = DOM.aiChevron();
      const isHidden = content.classList.contains('hidden');
      if (isHidden) {
        content.classList.remove('hidden');
        chevron.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('hidden');
        chevron.style.transform = 'rotate(0deg)';
      }
    };

    DOM.aiResultClose().onclick = () => {
      DOM.aiResultBox().classList.add('hidden');
    };

    // Insert output at current editor carret selection point
    DOM.aiInsertBtn().onclick = () => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const textToInsert = DOM.aiResultText().innerHTML;
      
      const container = document.createElement("div");
      container.className = "bg-primary/5 dark:bg-amber-400/5 p-4 border-l-2 border-primary rounded-r-xl my-4 text-xs font-serif leading-relaxed";
      container.innerHTML = textToInsert;

      range.insertNode(container);
      showToast("AI compiled wisdom inserted successfully!");
      DOM.aiResultBox().classList.add('hidden');
    };

    // AI actions executors
    DOM.aiSummarize().onclick = () => executeAIAction("summarize", "SUMMARIZE AND CONDENSE NOTE");
    DOM.aiFlashcards().onclick = () => executeAIAction("flashcards", "GENERATE FLASHCARDS EXERCISES");
    DOM.aiMindmap().onclick = () => executeAIAction("mindmap", "CREATE DIRECT INSIGHT MIND MAP");
    DOM.aiIdeas().onclick = () => executeAIAction("ideas", "LOCATE THEOLOGICAL CONNECTIONS");
    DOM.aiActions().onclick = () => executeAIAction("actions", "CONSTRUCT CRITICAL ACTION PLAN");
  }

  // Common wrapper to fire actual Gemini prompts
  async function executeAIAction(actionCode, labelName) {
    if (!VaultState.activeNote) {
      showToast("Select or create note fragment first.", true);
      return;
    }

    const noteBodyText = DOM.editorBody().innerText.trim() || "No notes body compiled yet.";
    const bookTitle = VaultState.activeNote.bookTitle || "Immortal Wisdom Archive";
    
    // Open loading outcome box
    DOM.aiResultBox().classList.remove('hidden');
    DOM.aiResultLabel().textContent = `${labelName} (Consulting Scholar API...)`;
    DOM.aiInsertBtn().classList.add('hidden');
    DOM.aiResultText().innerHTML = `
      <div class="flex items-center gap-2 text-primary">
        <i class="lucide-icon text-sm animate-spin" data-lucide="refresh-ccw"></i>
        <span class="font-mono text-[9px] uppercase tracking-wider">Cosmic model parsing notes volume fragments...</span>
      </div>`;

    // Formulate custom query
    let promptText = "";
    switch(actionCode) {
      case "summarize":
        promptText = "Summarize the following notes text into a gorgeous single-paragraph zen synthesis with key literary takeaways: \n\n" + noteBodyText;
        break;
      case "flashcards":
        promptText = "Formulate 3 interactive flashcards with explicit questions and detailed answers based strictly on content: \n\n" + noteBodyText;
        break;
      case "mindmap":
        promptText = "Create a clear structured mind map represented by indentations representing hierarchical branches (e.g. Core Topic -> Primary Insight -> Practical Tenet) based strictly on note content: \n\n" + noteBodyText;
        break;
      case "ideas":
        promptText = "Find connected philosophical cross-references and other cosmic ideas relevant to the main concepts: \n\n" + noteBodyText;
        break;
      case "actions":
        promptText = "Extract 3 highly actionable, stoic lesson items that a student can directly execute in their modern daily focus workflow based on this text: \n\n" + noteBodyText;
        break;
    }

    try {
      const res = await fetch('/api/ai-chat-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageText: noteBodyText,
          bookTitle: bookTitle,
          queryType: 'chat',
          customQuestion: promptText
        })
      });

      if (!res.ok) {
        throw new Error(`Scholar Server returned status ${res.status}`);
      }

      const data = await res.json();
      const aiReply = data.response || data.resultText || "No compiled wisdom got.";

      // format output nicely in result div
      const renderedHtml = aiReply
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-primary font-serif font-semibold">$1</em>')
        .replace(/^\-\s+(.*)/gm, '<li class="ml-3 list-disc text-xs mt-1">$1</li>')
        .replace(/\n\n/g, '<p class="mt-2 text-xs"></p>');

      DOM.aiResultLabel().textContent = labelName;
      DOM.aiResultText().innerHTML = renderedHtml;
      
      // Unlock insert action button
      DOM.aiInsertBtn().classList.remove('hidden');
    } catch (e) {
      console.error(e);
      DOM.aiResultText().innerHTML = `
        <div class="text-error font-mono text-[10px] uppercase tracking-wide">
          ⚠️ Scholar AI client compilation aborted: ${e.message || "server busy"}
        </div>`;
    }
  }

  // Quote card presets color palettes mapper
  function setupShareListeners() {
    const presets = document.querySelectorAll('.theme-preset-btn');
    presets.forEach(p => {
      p?.addEventListener('click', (e) => {
        presets.forEach(btn => btn.classList.replace('border-primary', 'border-transparent'));
        p.classList.replace('border-transparent', 'border-primary');
        
        const presetCode = p.getAttribute('data-color');
        applyPresetGradient(presetCode);
      });
    });

    DOM.shareModalClose().onclick = () => {
      DOM.shareModal().classList.add('hidden');
    };

    DOM.btnShare().onclick = () => {
      if (!VaultState.activeNote) {
        showToast("Select or create note fragment first.", true);
        return;
      }

      // Populate content card
      const cleanQuote = cleanHtmlSnippet(DOM.editorBody().innerHTML, 180);
      DOM.cardQuoteContent().textContent = `"${cleanQuote}"`;
      DOM.cardBookCitation().textContent = DOM.editorTitle().value || "Untitled Insight";
      
      const bookId = DOM.editorBook().value;
      let author = "Mysterious Sage";
      if (bookId !== "general") {
        const matchingBook = VaultState.books.find(b => b.id === bookId);
        if (matchingBook) {
          author = matchingBook.author || "Immortal lineage";
        }
      }
      DOM.cardAuthorCitation().textContent = author;
      
      const formattedDate = new Date(VaultState.activeNote.updatedAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      DOM.cardDateBadge().textContent = formattedDate;

      // Reset style to cosmic default
      applyPresetGradient("cosmic");
      presets.forEach(btn => {
        if (btn.getAttribute('data-color') === 'cosmic') {
          btn.classList.replace('border-transparent', 'border-primary');
        } else {
          btn.classList.replace('border-primary', 'border-transparent');
        }
      });

      DOM.shareModal().classList.remove('hidden');
    };

    // Download Quote Card image using html2canvas
    DOM.btnShareDownload().onclick = async () => {
      const frame = DOM.cardFrame();
      if (!frame) return;

      DOM.btnShareDownload().textContent = "Compiling Vector Frame...";
      DOM.btnShareDownload().disabled = true;

      try {
        if (typeof html2canvas === 'undefined') {
          throw new Error("html2canvas library not compiled in window");
        }

        const canvas = await html2canvas(frame, {
          backgroundColor: null,
          scale: 2, // 2x vector upgrade quality
          useCORS: true,
          logging: false
        });

        const imageBase64 = canvas.toDataURL("image/png");
        
        // Browser download trigger
        const dlLink = document.createElement("a");
        dlLink.download = `Wisdom_Fragment_Card_${Date.now()}.png`;
        dlLink.href = imageBase64;
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);

        showToast("Elite quote frame successfully saved to photo roll!");
      } catch (err) {
        console.error(err);
        showToast("Error drawing card visual canvas.", true);
      } finally {
        DOM.btnShareDownload().textContent = "Download Card";
        DOM.btnShareDownload().disabled = false;
      }
    };

    // Copy public card note URL link to clipboard
    DOM.btnShareCopyLink().onclick = () => {
      const noteTitle = DOM.editorTitle().value || "Wisdom Note";
      const fauxLink = `https://wisdom-sanctuary.org/vault/sh/${VaultState.activeNote.id || "note_" + Date.now()}`;
      
      navigator.clipboard.writeText(fauxLink).then(() => {
        showToast("Public scholar link generated and loaded into clipboard!");
      }).catch(err => {
        console.error(err);
        showToast("Could not copy clipboard.", true);
      });
    };

    // Register Rich EXPORT format triggers
    DOM.btnExport().onclick = () => {
      if (!VaultState.activeNote) return;

      const title = DOM.editorTitle().value || "Wisdom Explainer Note";
      const contents = DOM.editorBody().innerText;
      const formattedDate = new Date().toLocaleDateString();

      // Simple Markdown compiled text
      const fullMarkdown = `
# ${title.toUpperCase()}
*Wisdom Fragment • Archive logged ${formattedDate}*
---

${contents}

---
*Created inside Wisdom Sanctuary PKM second brain app.*`;

      // Trigger standard text file downloader fallback
      const blob = new Blob([fullMarkdown], { type: "text/markdown;charset=utf-8" });
      const dlLink = document.createElement("a");
      dlLink.download = `${title.toLowerCase().replace(/\s+/g, '_')}_wisdom_vault.md`;
      dlLink.href = URL.createObjectURL(blob);
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

      showToast("Markdown files (.md) exported successfully!");
    };
  }

  // Update card studio frame backing colors
  function applyPresetGradient(preset) {
    const frame = DOM.cardFrame();
    if (!frame) return;

    frame.className = "w-full h-72 rounded-2xl p-6 text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden shadow-xl border border-white/5 select-none";
    
    let gradStyle = "";
    switch(preset) {
      case "cosmic":
        gradStyle = "linear-gradient(135deg, #1E293B, #0F172A, #1E293B)";
        break;
      case "saffron":
        gradStyle = "linear-gradient(135deg, #7C2D12, #431407, #7C2D12)";
        break;
      case "emerald":
        gradStyle = "linear-gradient(135deg, #064E3B, #022C22, #064E3B)";
        break;
      case "royal":
        gradStyle = "linear-gradient(135deg, #1E3A8A, #172554, #1E3A8A)";
        break;
      case "monochrome":
        gradStyle = "linear-gradient(135deg, #262626, #0A0A0A, #262626)";
        break;
    }

    frame.style.background = gradStyle;
    VaultState.quotePresetColor = preset;
  }

  // Helper Toast visual alerts
  function showToast(message, isError = false) {
    let toastDiv = document.getElementById('vault-toast-popup');
    if (!toastDiv) {
      toastDiv = document.createElement("div");
      toastDiv.id = "vault-toast-popup";
      toastDiv.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[150] px-5 py-3 rounded-xl shadow-xl text-xs font-mono font-bold tracking-wider select-none pointer-events-none transition-all duration-300 opacity-0 scale-95 uppercase";
      document.body.appendChild(toastDiv);
    }

    if (isError) {
      toastDiv.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[150] px-5 py-3 rounded-xl shadow-xl text-xs font-mono font-bold tracking-wider select-none pointer-events-none transition-all duration-300 opacity-100 scale-100 bg-error text-on-error uppercase";
    } else {
      toastDiv.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[150] px-5 py-3 rounded-xl shadow-xl text-xs font-mono font-bold tracking-wider select-none pointer-events-none transition-all duration-300 opacity-100 scale-100 bg-[#1E293B] text-amber-300 border border-amber-300/10 uppercase";
    }

    toastDiv.textContent = message;

    setTimeout(() => {
      toastDiv.classList.replace('opacity-100', 'opacity-0');
      toastDiv.classList.replace('scale-100', 'scale-95');
    }, 2800);
  }

  // Assign global handle to integrate from app.js when needed
  window.WisdomVault = {
    loadNoteToEditor,
    syncState,
    setFilterBook(bookIdStr) {
      const filterBookSelect = DOM.filterBook();
      VaultState.filters.book = bookIdStr;
      if (filterBookSelect) {
         filterBookSelect.value = bookIdStr;
      }
      renderFeedList();
      const refreshBtn = document.getElementById('notebooklm-btn-refresh');
      if (refreshBtn) refreshBtn.click();
    },
    async quickCreateHighlightNote(book, text, pageNo) {
      const isBookObj = (typeof book === 'object');
      const bookId = isBookObj ? book.id : "general";
      const bookTitle = isBookObj ? (book.name || book.title) : "Immortal Wisdom";
      
      const highlightNote = {
        id: "note_" + Date.now(),
        title: `Snippet Page ${pageNo || 1} from ${bookTitle}`,
        content: `<div>Annotated selection highlight from literary companion:</div>
          <blockquote class="border-l-4 border-primary bg-primary/5 pl-3 py-1.5 my-2.5">"${text}"</blockquote>
          <div>Page ${pageNo || 1} • Saved in Sanctuary.</div>`,
        type: "highlight",
        bookId: bookId,
        bookTitle: bookTitle,
        notebookName: "Annotations",
        tags: ["highlight", "annotation"],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      try {
        if (window.LuminaDB) {
          await window.LuminaDB.saveNote(highlightNote);
          showToast("Highlight added into Wisdom AI!");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

})();
