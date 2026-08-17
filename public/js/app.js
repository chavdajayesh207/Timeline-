(function () {
  'use strict';

  window.setTheme = function (theme) {
    document.body.classList.remove('sepia', 'dark');
    document.documentElement.classList.remove('dark');
    if (theme === 'sepia') document.body.classList.add('sepia');
    else if (theme === 'dark') document.documentElement.classList.add('dark');
  };

  let currentView = 'home';
  let previousView = 'home';
  let readerInitialized = false;
  let currentBook = null;
  let currentPdfIndex = 0;

  // Live session statistics tracking
  let readerSessionPagesRead = new Set();
  let readerSessionTimer = null;
  let readerActivityLoggedSeconds = 0;

  // PDF.js rendering state
  let pdfDoc = null;
  let pdfCurrentPage = 1;
  let pdfNumPages = 0;
  let pdfScale = 0.95;
  let isRenderingPage = false;
  let pageRenderingPending = null;

  // Book Mode settings and continuous states
  let bookModeActive = true;
  let isBookFlipping = false;

  function playPageFlipSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = audioCtx.sampleRate * 0.45;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const x = Math.random() * 2 - 1;
        const progress = i / bufferSize;
        const envelope = Math.sin(progress * Math.PI) * (1 - progress);
        data[i] = x * envelope * 0.08;
      }
      const noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.45);
      filter.Q.setValueAtTime(1.0, audioCtx.currentTime);
      noiseNode.connect(filter);
      filter.connect(audioCtx.destination);
      noiseNode.start();
    } catch (e) {
      console.warn("Audio Context blocked", e);
    }
  }

  function clearCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function renderSinglePageToCanvas(pageNum, canvas) {
    if (!pdfDoc || !canvas) return Promise.resolve();
    return pdfDoc.getPage(pageNum).then((page) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return Promise.resolve();
      
      const viewport = page.getViewport({ scale: pdfScale * 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.opacity = '0';
      
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      return page.render(renderContext).promise.then(() => {
        canvas.style.opacity = '1';
      });
    }).catch(err => {
      console.warn("Failed internal page render", err);
    });
  }

  function renderPdfBookPages(pageNum) {
    if (!pdfDoc) return;
    
    const pageInput = document.getElementById('canvas-page-input');
    if (pageInput) pageInput.value = pageNum;

    const singleCanvas = document.getElementById('pdf-reader-canvas-single');
    const singleNumNode = document.getElementById('book-page-num-single');
    
    if (singleNumNode) singleNumNode.textContent = `Page ${pageNum}`;

    renderSinglePageToCanvas(pageNum, singleCanvas);

    // Track page as read live in current session
    if (typeof pageNum === 'number') {
      trackLivePageRead(pageNum);
    }
  }

  function animateBookPageTurn(direction) {
    if (isBookFlipping || !pdfDoc) return;
    
    const increment = direction;
    const targetPage = pdfCurrentPage + increment;
    
    if (targetPage < 1 || targetPage > pdfNumPages) return;
    
    isBookFlipping = true;
    playPageFlipSound();

    const leafNode = document.getElementById('book-flipping-leaf');
    const leafFrontCanvas = document.getElementById('pdf-reader-canvas-flip-front');
    const leafBackCanvas = document.getElementById('pdf-reader-canvas-flip-back');
    const singleCanvas = document.getElementById('pdf-reader-canvas-single');

    if (!leafNode || !leafFrontCanvas || !leafBackCanvas || !singleCanvas) {
      pdfCurrentPage = targetPage;
      renderPdfBookPages(targetPage);
      isBookFlipping = false;
      return;
    }

    if (direction === 1) {
      // Forward flip: Leaf fronts is current page, back is blank/cleared
      leafNode.style.left = '0';
      leafNode.style.right = '0';
      leafNode.style.transformOrigin = 'left center';

      clearCanvas(leafBackCanvas);

      Promise.all([
        renderSinglePageToCanvas(pdfCurrentPage, leafFrontCanvas),
        renderSinglePageToCanvas(targetPage, singleCanvas)
      ]).then(() => {
        leafNode.classList.remove('hidden');
        leafNode.style.transform = 'rotateY(0deg)';
        singleCanvas.style.opacity = '1';

        setTimeout(() => {
          leafNode.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
          leafNode.style.transform = 'rotateY(-180deg)';
        }, 30);

        setTimeout(() => {
          pdfCurrentPage = targetPage;
          renderPdfBookPages(pdfCurrentPage);
          
          leafNode.classList.add('hidden');
          leafNode.style.transition = 'none';
          leafNode.style.transform = 'rotateY(0deg)';
          isBookFlipping = false;
        }, 620);
      }).catch(err => {
        console.warn("Flip forward renders failed, immediate page load fallback", err);
        pdfCurrentPage = targetPage;
        renderPdfBookPages(targetPage);
        isBookFlipping = false;
      });

    } else {
      // Backward flip: Leaf fronts is target page, back is blank/cleared
      leafNode.style.left = '0';
      leafNode.style.right = '0';
      leafNode.style.transformOrigin = 'left center';

      clearCanvas(leafBackCanvas);

      Promise.all([
        renderSinglePageToCanvas(targetPage, leafFrontCanvas),
        renderSinglePageToCanvas(pdfCurrentPage, singleCanvas)
      ]).then(() => {
        leafNode.classList.remove('hidden');
        leafNode.style.transform = 'rotateY(-180deg)';

        setTimeout(() => {
          leafNode.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
          leafNode.style.transform = 'rotateY(0deg)';
        }, 30);

        setTimeout(() => {
          pdfCurrentPage = targetPage;
          renderPdfBookPages(pdfCurrentPage);

          leafNode.classList.add('hidden');
          leafNode.style.transition = 'none';
          leafNode.style.transform = 'rotateY(0deg)';
          isBookFlipping = false;
        }, 620);
      }).catch(err => {
        console.warn("Flip backward renders failed, immediate page load fallback", err);
        pdfCurrentPage = targetPage;
        renderPdfBookPages(targetPage);
        isBookFlipping = false;
      });
    }
  }

  function refreshReaderViews() {
    const scrollContainer = document.getElementById('pdf-canvas-container');
    const bookContainer = document.getElementById('lumina-3d-book-container');
    const toggleBtn = document.getElementById('reader-toggle-book-mode');

    if (bookModeActive) {
      if (scrollContainer) scrollContainer.classList.add('hidden');
      if (bookContainer) bookContainer.classList.remove('hidden');
      if (toggleBtn) {
        toggleBtn.classList.add('text-primary');
        toggleBtn.classList.remove('text-on-surface-variant');
      }
      renderPdfBookPages(pdfCurrentPage);
    } else {
      if (bookContainer) bookContainer.classList.add('hidden');
      if (scrollContainer) scrollContainer.classList.remove('hidden');
      if (toggleBtn) {
        toggleBtn.classList.remove('text-primary');
        toggleBtn.classList.add('text-on-surface-variant');
      }
      renderPdfCanvasPage(pdfCurrentPage);
    }
  }

  function renderPdfCanvasPage(pageNum) {
    if (!pdfDoc) return;
    isRenderingPage = true;

    const pageInput = document.getElementById('canvas-page-input');
    if (pageInput) pageInput.value = pageNum;

    pdfDoc.getPage(pageNum).then((page) => {
      const canvas = document.getElementById('pdf-reader-canvas');
      if (!canvas) {
        isRenderingPage = false;
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        isRenderingPage = false;
        return;
      }

      // Calculate crisp rendering viewport based on high-DPI
      const viewport = page.getViewport({ scale: pdfScale * 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);
      renderTask.promise.then(() => {
        isRenderingPage = false;
        if (pageRenderingPending !== null) {
          renderPdfCanvasPage(pageRenderingPending);
          pageRenderingPending = null;
        }
      }).catch((err) => {
        console.error("Canvas rendering failed", err);
        isRenderingPage = false;
      });
    }).catch((err) => {
      console.error("Failed to fetch PDF page data", err);
      isRenderingPage = false;
    });
  }

  function queueRenderPage(pageNum) {
    if (pageNum < 1 || pageNum > pdfNumPages) return;
    pdfCurrentPage = pageNum;
    if (bookModeActive) {
      renderPdfBookPages(pageNum);
    } else {
      if (isRenderingPage) {
        pageRenderingPending = pageNum;
      } else {
        renderPdfCanvasPage(pageNum);
      }
    }
  }

  function physicalTurnPage(direction) {
    if (!pdfDoc) return;
    if (bookModeActive) {
      // In book mode, turn 2 pages at a time (previous/next slide spread)
      animateBookPageTurn(direction);
    } else {
      if (isRenderingPage) return;
      const targetPage = pdfCurrentPage + direction;
      if (targetPage < 1 || targetPage > pdfNumPages) return;

      const wrapper = document.getElementById('canvas-page-wrapper');
      if (!wrapper) {
        queueRenderPage(targetPage);
        return;
      }

      // Prepare styles for page flip animation
      wrapper.classList.remove('page-turn-left-active', 'page-turn-right-active', 'page-enter-left', 'page-enter-right');
      // Trigger CSS repaint
      void wrapper.offsetWidth;

      // Apply turning animation class
      if (direction === 1) {
        wrapper.classList.add('page-turn-left-active');
      } else {
        wrapper.classList.add('page-turn-right-active');
      }

      // Swap the page content at the turn midpoint when page is perpendicular/invisible
      setTimeout(() => {
        pdfCurrentPage = targetPage;
        renderPdfCanvasPage(targetPage);

        wrapper.classList.remove('page-turn-left-active', 'page-turn-right-active');
        void wrapper.offsetWidth;

        // Apply swoop-in page enter animation classes
        if (direction === 1) {
          wrapper.classList.add('page-enter-right');
        } else {
          wrapper.classList.add('page-enter-left');
        }

        // Cleanup enter class after completing transition
        setTimeout(() => {
          wrapper.classList.remove('page-enter-right', 'page-enter-left');
        }, 650);
      }, 325);
    }
  }

  function initPdfCanvasViewer(url) {
    const iframe = document.getElementById('pdf-frame');
    const canvasContainer = document.getElementById('pdf-canvas-container');
    const prevBtn = document.getElementById('canvas-prev-btn');
    const nextBtn = document.getElementById('canvas-next-btn');
    const pageBar = document.getElementById('canvas-page-bar');
    const pageTotal = document.getElementById('canvas-page-total');
    const fallback = document.getElementById('pdf-fallback');

    if (fallback) fallback.classList.add('hidden');
    if (iframe) iframe.src = 'about:blank';

    let resolvedUrl = url;
    if (url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes(window.location.host) && !url.includes('blob:')) {
      resolvedUrl = `/api/proxy-pdf?url=${encodeURIComponent(url)}`;
    }

    if (!window.pdfjsLib) {
      console.warn("PDF.js library script not present. Using default iframe reader.");
      fallbackToIframe(resolvedUrl);
      return;
    }

    try {
      // Configure PDF.js worker Src
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    } catch (workerErr) {
      console.error("Failed setting PDF.js worker", workerErr);
    }

    // Try starting canvas doc load
    window.pdfjsLib.getDocument(resolvedUrl).promise.then((pdfDoc_) => {
      pdfDoc = pdfDoc_;
      pdfNumPages = pdfDoc.numPages;
      pdfCurrentPage = 1;

      if (pageTotal) pageTotal.textContent = pdfNumPages;

      const pageInput = document.getElementById('canvas-page-input');
      if (pageInput) {
        pageInput.setAttribute('max', pdfNumPages);
        pageInput.value = 1;
      }

      // Hide standard iframe and show inline canvas view elements
      if (iframe) iframe.classList.add('hidden');
      if (pageBar) pageBar.classList.remove('hidden');
      if (prevBtn) prevBtn.classList.remove('hidden');
      if (nextBtn) nextBtn.classList.remove('hidden');

      refreshReaderViews();

    }).catch((err) => {
      console.warn("PDF.js failed to parsed document asynchronously; attempting fallback iframe direct load", err);
      fallbackToIframe(resolvedUrl);
    });
  }

  function fallbackToIframe(url) {
    const iframe = document.getElementById('pdf-frame');
    const canvasContainer = document.getElementById('pdf-canvas-container');
    const prevBtn = document.getElementById('canvas-prev-btn');
    const nextBtn = document.getElementById('canvas-next-btn');
    const pageBar = document.getElementById('canvas-page-bar');
    const fallback = document.getElementById('pdf-fallback');

    if (canvasContainer) canvasContainer.classList.add('hidden');
    if (prevBtn) prevBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');
    if (pageBar) pageBar.classList.add('hidden');

    if (iframe) {
      iframe.classList.remove('hidden');
      iframe.src = url;
      iframe.onload = () => { if (fallback) fallback.classList.add('hidden'); };
      iframe.onerror = () => { if (fallback) fallback.classList.remove('hidden'); };
    }
  }

  const views = {
    home: document.getElementById('view-home'),
    library: document.getElementById('view-library'),
    highlights: document.getElementById('view-highlights'),
    wisdom: document.getElementById('view-wisdom'),
    profile: document.getElementById('view-profile'),
    reader: document.getElementById('view-reader'),
    book_details: document.getElementById('view-book-details'),
    vault: document.getElementById('view-vault'),
  };

  const bottomNav = document.getElementById('bottom-nav');
  const navTabs = document.querySelectorAll('.nav-tab');

  function showView(name) {
    if (!views[name]) return;

    Object.keys(views).forEach((key) => {
      if (views[key]) views[key].classList.remove('active');
    });
    views[name].classList.add('active');
    currentView = name;

    if (name === 'reader' || name === 'book_details') {
      bottomNav.classList.add('hidden');
      document.body.classList.remove('md:pl-[96px]');
      if (name === 'reader') {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    } else {
      bottomNav.classList.remove('hidden');
      document.body.classList.remove('overflow-hidden');
      document.body.classList.add('md:pl-[96px]');
      updateNavTabs(name);
      window.scrollTo(0, 0);
    }

    if (name === 'profile') initProfileCalendar();
    if (name === 'reader' && !readerInitialized) initReader();
    if (name === 'vault' && window.WisdomVault) {
      window.WisdomVault.syncState();
    }
    if (name === 'highlights' && window.LuminaHighlights) {
      window.LuminaHighlights.renderGlobalHighlights();
    }
    if (name === 'wisdom' && window.LuminaWisdom) {
      window.LuminaWisdom.render();
    }
    closePartPicker();
  }

  function updateNavTabs(active) {
    navTabs.forEach((tab) => {
      const view = tab.dataset.view;
      // Legacy classes
      tab.classList.remove('active-tab', 'text-on-secondary-container', 'bg-secondary-container', 'rounded-lg', 'px-3', 'py-1', 'text-on-surface-variant', 'p-2');
      
      // Remove active premium classes
      tab.classList.remove('bg-[#162233]', 'text-[#D4AF37]', 'shadow-[0_0_15px_rgba(212,175,55,0.15)]', 'dark:bg-[#162233]');
      
      // Add inactive premium classes
      tab.classList.add('text-[#94A3B8]', 'hover:text-[#F8FAFC]', 'hover:bg-white/5');
      
      const span = tab.querySelector('span');
      if (span) {
         span.classList.remove('w-auto', 'opacity-100', 'ml-2');
         span.classList.add('w-0', 'opacity-0', 'ml-0');
      }

      if (view === active) {
        tab.classList.add('active-tab');
        
        // Remove inactive premium classes
        tab.classList.remove('text-[#94A3B8]', 'hover:text-[#F8FAFC]', 'hover:bg-white/5');
        
        // Add active premium classes
        tab.classList.add('bg-[#162233]', 'text-[#D4AF37]', 'shadow-[0_0_15px_rgba(212,175,55,0.15)]');
        
        if (span) {
           span.classList.remove('w-0', 'opacity-0', 'ml-0');
           span.classList.add('w-auto', 'opacity-100', 'ml-2');
        }
      }
    });
  }

  function openBookReader(book, pdfIndex) {
    currentBook = book;
    currentPdfIndex = pdfIndex || 0;
    previousView = currentView === 'reader' ? previousView : currentView;

    // Sync vault logic
    if (window.WisdomVault && window.WisdomVault.setFilterBook) {
        window.WisdomVault.setFilterBook(book.id || book.name);
    }

    // Reset tracking for this clean live reading session
    readerSessionPagesRead.clear();
    readerSessionPagesRead.add(pdfCurrentPage || 1);
    readerActivityLoggedSeconds = 0;
    if (readerSessionTimer) {
      clearInterval(readerSessionTimer);
    }
    readerSessionTimer = setInterval(() => {
      if (currentView === 'reader') {
        readerActivityLoggedSeconds++;
        // Continually save live progress every 10 seconds to local storage and refresh stats count
        if (readerActivityLoggedSeconds % 10 === 0) {
          saveLiveProgressToLogs();
        }
      }
    }, 1000);

    if (window.LuminaHighlights) {
      window.LuminaHighlights.setActiveBook(book.id);
    }

    const pdf = book.pdfs[currentPdfIndex];
    const titleEl = document.getElementById('reader-title');
    const chapterEl = document.getElementById('reader-chapter');
    const iframe = document.getElementById('pdf-frame');
    const fallback = document.getElementById('pdf-fallback');
    const openExternal = document.getElementById('reader-open-external');
    const partsBar = document.getElementById('reader-parts');

    if (titleEl) titleEl.textContent = book.name;
    if (chapterEl) {
      const cat = window.LuminaLibrary?.decodeHtml(book.categoryTitle) || book.category;
      chapterEl.textContent = `${book.lang} · ${cat}`;
    }

    if (pdf && pdf.fileId && window.LuminaDB) {
      // Async load from database
      window.LuminaDB.getFile(pdf.fileId).then((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          pdf.url = blobUrl; // Cache in session
          
          initPdfCanvasViewer(blobUrl);

          [openExternal, document.getElementById('reader-open-external-btn')].forEach((el) => {
            if (el) { el.href = blobUrl; el.classList.remove('hidden'); }
          });
        } else {
          if (fallback) {
            fallback.classList.remove('hidden');
            fallback.querySelector('p').textContent = 'Could not find local saved file in storage.';
          }
        }
      }).catch((err) => {
        console.error("Failed to load local file", err);
        if (fallback) fallback.classList.remove('hidden');
      });
    } else if (pdf) {
      initPdfCanvasViewer(pdf.url);
      [openExternal, document.getElementById('reader-open-external-btn')].forEach((el) => {
        if (el) { el.href = pdf.url; el.classList.remove('hidden'); }
      });
    }

    const canvas = document.getElementById('reader-canvas');
    if (partsBar) {
      if (book.pdfs.length > 1) {
        partsBar.classList.remove('hidden');
        if (canvas) canvas.style.paddingTop = '110px';
        partsBar.innerHTML = book.pdfs.map((p, i) => `
          <button class="reader-part-btn px-4 py-1.5 rounded-full font-label-caps text-[11px] transition-all ${i === currentPdfIndex ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}" data-part="${i}">
            ${p.label.replace('📄 ', '').replace('Open PDF', 'Full')}
          </button>`).join('');
        partsBar.querySelectorAll('.reader-part-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            openBookReader(book, parseInt(btn.dataset.part, 10));
          });
        });
      } else {
        partsBar.classList.add('hidden');
        partsBar.innerHTML = '';
        if (canvas) canvas.style.paddingTop = '72px';
      }
    }

    showView('reader');
  }

  function showPartPicker(book) {
    let modal = document.getElementById('part-picker-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'part-picker-modal';
      modal.className = 'fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-xl w-full max-w-md p-6 shadow-2xl animate-in">
        <h3 class="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-1">${book.name}</h3>
        <p class="font-label-caps text-label-caps text-on-surface-variant mb-6">SELECT A PART TO READ</p>
        <div class="flex flex-col gap-3">
          ${book.pdfs.map((p, i) => `
            <button class="part-pick-btn w-full text-left px-5 py-4 bg-surface-container-low rounded-xl border border-outline-variant/30 hover:border-primary hover:bg-surface-container transition-all font-body-ui font-semibold" data-part="${i}">
              ${p.label.replace('📄 ', '')}
            </button>`).join('')}
        </div>
        <button id="part-picker-cancel" class="w-full mt-4 py-3 font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">CANCEL</button>
      </div>`;

    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    modal.querySelectorAll('.part-pick-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        closePartPicker();
        openBookReader(book, parseInt(btn.dataset.part, 10));
      });
    });
    modal.querySelector('#part-picker-cancel')?.addEventListener('click', closePartPicker);
    modal.addEventListener('click', (e) => { if (e.target === modal) closePartPicker(); });
  }

  function closePartPicker() {
    const modal = document.getElementById('part-picker-modal');
    if (modal) { modal.style.display = 'none'; modal.classList.add('hidden'); }
  }

  function closeReader() {
    if (readerSessionTimer) {
      clearInterval(readerSessionTimer);
      readerSessionTimer = null;
    }
    saveLiveProgressToLogs();

    const iframe = document.getElementById('pdf-frame');
    if (iframe) iframe.src = 'about:blank';
    showView(previousView);
  }

  function trackLivePageRead(pageNum) {
    if (!currentBook || !pageNum) return;
    readerSessionPagesRead.add(pageNum);
    saveLiveProgressToLogs();
  }

  function saveLiveProgressToLogs() {
    if (!currentBook) return;
    const todayStr = formatDateISO(new Date());
    const bookTitle = currentBook.name || "Default Title";
    const currentLogs = getReadingLogs();
    
    const pagesCount = readerSessionPagesRead.size;
    const existingIdx = currentLogs.findIndex(l => l.date === todayStr && l.book === bookTitle);
    
    // Calculate tracked reading time in minutes (minimum 1 minute if spent any seconds, or mapped relative to pages read)
    const activeMinutes = Math.max(1, Math.floor(readerActivityLoggedSeconds / 60));
    
    if (existingIdx > -1) {
      // Retain the max of either existing pages/minutes or current session metrics
      currentLogs[existingIdx].pages = Math.max(currentLogs[existingIdx].pages || 0, pagesCount);
      currentLogs[existingIdx].minutes = Math.max(currentLogs[existingIdx].minutes || 0, activeMinutes);
    } else {
      currentLogs.push({
        date: todayStr,
        book: bookTitle,
        pages: pagesCount,
        minutes: activeMinutes
      });
    }
    
    saveReadingLogs(currentLogs);
    
    // Keep Bento stats elements updated in realtime
    renderProfileStats(getProfileState(), currentLogs);
  }

  // Navigation
  navTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      showView(tab.dataset.view);
    });
  });

  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showView(el.dataset.nav);
    });
  });

  document.getElementById('reader-back')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeReader();
  });

  // Home: bookmark toggle
  document.querySelectorAll('#view-home button .lucide-icon').forEach((icon) => {
    if (icon.textContent.trim() === 'bookmark') {
      icon.parentElement.addEventListener('click', function () {
        const span = this.querySelector('span');
        const isFilled = span.style.fontVariationSettings?.includes("'FILL' 1");
        span.style.fontVariationSettings = isFilled ? "'FILL' 0" : "'FILL' 1";
      });
    }
  });

  // Home: mood filter
  document.querySelectorAll('#view-home .custom-scrollbar button').forEach((btn) => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#view-home .custom-scrollbar button').forEach((b) => {
        b.className = 'bg-surface-container-high text-on-surface-variant px-4 py-2 rounded whitespace-nowrap font-label-caps text-label-caps hover:bg-surface-container-highest transition-all';
      });
      this.className = 'bg-secondary-container text-on-secondary-container px-4 py-2 rounded whitespace-nowrap font-label-caps text-label-caps hover:brightness-95 transition-all';

      const moodMap = {
        'Deep Thinking': 'philosophy',
        'Quiet Morning': 'spirituality',
        'Inspired': 'philosophy',
        'Restless': 'spirituality',
        'Curious': 'science',
      };
      const cat = moodMap[this.textContent.trim()];
      if (cat && window.LuminaLibrary) {
        const filters = document.getElementById('library-filters');
        const filterBtn = filters?.querySelector(`[data-cat="${cat}"]`);
        if (filterBtn) filterBtn.click();
        showView('library');
      }
    });
  });

  // Wisdom: audio button
  const wisdomPlayBtn = document.querySelector('#view-wisdom button .lucide-icon[data-icon="play_arrow"]')?.closest('button');
  if (wisdomPlayBtn) {
    wisdomPlayBtn.addEventListener('click', function () {
      const icon = this.querySelector('.lucide-icon');
      const text = this.querySelector('span:not(.lucide-icon)');
      if (icon.textContent === 'play_arrow') {
        icon.textContent = 'pause';
        text.textContent = 'PLAYING WISDOM...';
        this.classList.add('bg-primary', 'text-white');
      } else {
        icon.textContent = 'play_arrow';
        text.textContent = 'LISTEN TO WISDOM';
        this.classList.remove('bg-primary', 'text-white');
      }
    });
  }

  // Highlights interactions
  document.querySelectorAll('#view-highlights button').forEach((button) => {
    button.addEventListener('mousedown', () => button.classList.add('scale-95'));
    button.addEventListener('mouseup', () => button.classList.remove('scale-95'));
    button.addEventListener('mouseleave', () => button.classList.remove('scale-95'));
  });

  document.querySelectorAll('#view-highlights .custom-scrollbar button').forEach((btn) => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#view-highlights .custom-scrollbar button').forEach((b) => {
        b.className = b.textContent.trim() === 'ALL'
          ? 'flex-shrink-0 px-4 py-1.5 bg-surface-container border border-outline-variant text-label-caps font-label-caps hover:bg-surface-container-high transition-colors'
          : 'flex-shrink-0 flex items-center gap-2 px-4 py-1.5 bg-surface-container border border-outline-variant text-label-caps font-label-caps hover:bg-surface-container-high transition-colors';
      });
      this.className = this.textContent.trim() === 'ALL'
        ? 'flex-shrink-0 px-4 py-1.5 bg-secondary-container text-on-secondary-container text-label-caps font-label-caps border border-transparent'
        : 'flex-shrink-0 flex items-center gap-2 px-4 py-1.5 bg-secondary-container text-on-secondary-container text-label-caps font-label-caps border border-transparent';
    });
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('#view-highlights header');
    if (!header || currentView !== 'highlights') return;
    header.classList.toggle('shadow-sm', window.scrollY > 20);
  });

  // ==========================================
  // PROFILE, STATISTICS, AND PLANNER CALENDAR ENGINE
  // ==========================================
  let calendarBuilt = false;
  let calendarYear = new Date().getFullYear();
  let calendarMonth = new Date().getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
  let tempAvatarSelected = null;

  const MONTH_NAMES = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  // Initialize Default or Loaded Reading Logs
  function getReadingLogs() {
    const raw = localStorage.getItem('LuminaReadingLogs');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { return seedDefaultReadingLogs(); }
    }
    return seedDefaultReadingLogs();
  }

  function seedDefaultReadingLogs() {
    // Seed consecutive logs for the past 14 days up to today to establish an authentic starting streak
    const logs = [];
    const today = new Date();
    const books = ["Bhagwat Puran", "The Nicomachean Ethics", "Atomic Habits", "Critique of Pure Reason", "Upanishad Wisdom"];
    
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = formatDateISO(d);
      logs.push({
        date: dateStr,
        book: books[i % books.length],
        pages: Math.floor(Math.random() * 12) + 6, // 6 to 17 pages daily
        minutes: Math.floor(Math.random() * 20) + 15 // 15 to 34 minutes
      });
    }
    localStorage.setItem('LuminaReadingLogs', JSON.stringify(logs));
    return logs;
  }

  function saveReadingLogs(logs) {
    localStorage.setItem('LuminaReadingLogs', JSON.stringify(logs));
  }

  // Load and Save Profile Identity Properties
  function getProfileState() {
    return {
      name: localStorage.getItem('LuminaProfileName') || 'Julian Thorne',
      title: localStorage.getItem('LuminaProfileTitle') || 'Philosopher King',
      wpm: parseInt(localStorage.getItem('LuminaProfileWpm') || '280', 10),
      avatar: localStorage.getItem('LuminaProfileAvatar') || '', 
      verified: localStorage.getItem('LuminaProfileVerified') || 'verified',
      subtype: localStorage.getItem('LuminaProfileSub') || 'Premium Scholar',
      focusMinutes: parseInt(localStorage.getItem('LuminaProfileFocusTime') || '25', 10),
      soundtrack: localStorage.getItem('LuminaProfileSound') || 'binaural',
      autodim: localStorage.getItem('LuminaProfileAutodim') !== 'false',
      notifGoal: localStorage.getItem('LuminaProfileNotifGoal') !== 'false',
      notifPageTarget: parseInt(localStorage.getItem('LuminaProfileNotifPageTarget') || '15', 10),
      notifTime: localStorage.getItem('LuminaProfileNotifTime') || '21:30',
      mute: localStorage.getItem('LuminaProfileMute') === 'true'
    };
  }

  function saveProfileState(state) {
    localStorage.setItem('LuminaProfileName', state.name);
    localStorage.setItem('LuminaProfileTitle', state.title);
    localStorage.setItem('LuminaProfileWpm', String(state.wpm));
    localStorage.setItem('LuminaProfileAvatar', state.avatar || '');
    localStorage.setItem('LuminaProfileVerified', state.verified);
    localStorage.setItem('LuminaProfileSub', state.subtype);
    localStorage.setItem('LuminaProfileFocusTime', String(state.focusMinutes));
    localStorage.setItem('LuminaProfileSound', state.soundtrack);
    localStorage.setItem('LuminaProfileAutodim', String(state.autodim));
    localStorage.setItem('LuminaProfileNotifGoal', String(state.notifGoal));
    localStorage.setItem('LuminaProfileNotifPageTarget', String(state.notifPageTarget));
    localStorage.setItem('LuminaProfileNotifTime', state.notifTime);
    localStorage.setItem('LuminaProfileMute', String(state.mute));
  }

  function formatDateISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Helper toaster alert
  function showTemporaryToast(msg) {
    if (window.LuminaHighlights && typeof window.LuminaHighlights.showTemporaryToast === 'function') {
      window.LuminaHighlights.showTemporaryToast(msg);
      return;
    }
    // Fallback UI toast
    let toast = document.getElementById('lumina-app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'lumina-app-toast';
      toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#181f21] text-[#f4ecd8] border border-primary/30 py-3 px-6 rounded-xl shadow-xl text-xs font-semibold z-[200] transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none font-mono';
      toast.style.zIndex = '200';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2500);
  }
  window.showTemporaryToast = showTemporaryToast;

  // Compute Streak Consecutive Days backwards
  function calculateCurrentStreak(readingLogs) {
    let streakCount = 0;
    const checkDate = new Date(); // Start checking from today
    const todayStr = formatDateISO(checkDate);
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = formatDateISO(yesterdayDate);
    
    const hasLog = (dStr) => readingLogs.some(log => log.date === dStr && log.pages >= 5);
    
    let currentCheck = checkDate;
    if (hasLog(todayStr)) {
      while (hasLog(formatDateISO(currentCheck))) {
        streakCount++;
        currentCheck.setDate(currentCheck.getDate() - 1);
      }
    } else if (hasLog(yesterdayStr)) {
      currentCheck = yesterdayDate;
      while (hasLog(formatDateISO(currentCheck))) {
        streakCount++;
        currentCheck.setDate(currentCheck.getDate() - 1);
      }
    }
    return streakCount;
  }

  // Render Profile Page Sections
  function initProfileCalendar() {
    const profile = getProfileState();
    const logs = getReadingLogs();
    
    // 1. Render Header / Identity Badge
    renderProfileHeader(profile, logs);
    
    // 2. Render Bento Statistics
    renderProfileStats(profile, logs);
    
    // 3. Render Calendar Day Grid
    renderCalendarGrid(calendarYear, calendarMonth, logs);
    
    // 4. Render 14-day Streak Progress Panel
    renderStreakProgressTimeline(logs);
    
    // 5. Render Achievements Scroller
    renderAchievements(logs);

    // 6. Setup Profile Page Event Listeners (Once Only)
    if (!calendarBuilt) {
      setupProfileControls();
      calendarBuilt = true;
    }
  }

  function renderProfileHeader(profile, logs) {
    const nameDisplay = document.getElementById('profile-name-display');
    const titleDisplay = document.getElementById('profile-title-display');
    const badgeCount = document.getElementById('streak-badge-count');
    const imgElement = document.getElementById('profile-avatar-img');
    const initialsElement = document.getElementById('profile-avatar-initials');

    if (nameDisplay) nameDisplay.textContent = profile.name;
    if (titleDisplay) titleDisplay.textContent = profile.title;
    
    const count = calculateCurrentStreak(logs);
    if (badgeCount) badgeCount.textContent = count;

    if (imgElement && initialsElement) {
      if (profile.avatar) {
        imgElement.src = profile.avatar;
        imgElement.classList.remove('hidden');
        initialsElement.classList.add('hidden');
      } else {
        imgElement.classList.add('hidden');
        initialsElement.classList.remove('hidden');
        
        // Derive clean initials
        const parts = profile.name.split(' ');
        const initials = parts.map(p => p[0] || '').join('').substring(0, 2).toUpperCase();
        initialsElement.textContent = initials || 'ST';
      }
    }
  }

  function renderProfileStats(profile, logs) {
    const statPages = document.getElementById('stat-pages-read');
    const statHours = document.getElementById('stat-hours-read');
    const statFinished = document.getElementById('stat-finished-books');
    const statSpeed = document.getElementById('stat-avg-speed');

    // Calculate live dynamic values purely from active user data
    let totalPagesLogs = 0;
    let totalMinutesLogs = 0;
    const uniqueBooks = new Set();

    logs.forEach(log => {
      const p = parseInt(log.pages || 0, 10);
      totalPagesLogs += p;
      totalMinutesLogs += parseInt(log.minutes || 0, 10);
      if (log.book && p > 0) {
        uniqueBooks.add(log.book.trim());
      }
    });

    if (statPages) {
      statPages.textContent = totalPagesLogs.toLocaleString();
    }
    if (statHours) {
      const hStr = (totalMinutesLogs / 60).toFixed(1).replace('.0', '');
      statHours.textContent = hStr + 'h';
    }
    if (statFinished) {
      // Finished books equals number of unique books logged in the history logs
      statFinished.textContent = uniqueBooks.size;
    }
    if (statSpeed) {
      statSpeed.innerHTML = `${profile.wpm} <small class="text-xs font-label-caps font-semibold font-bold">WPM</small>`;
    }
  }

  function renderCalendarGrid(year, month, logs) {
    const grid = document.getElementById('profile-calendar');
    const monthTitle = document.getElementById('cal-month-title');
    if (!grid || !monthTitle) return;

    monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;
    grid.innerHTML = '';

    // Calculate day offset
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1. Empty starting cells
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'aspect-square bg-transparent';
      grid.appendChild(empty);
    }

    // 2. Build active calendar day items
    const todayStr = formatDateISO(new Date());
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      const curDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayLogs = logs.filter(l => l.date === curDateStr);
      const isLogged = dayLogs.length > 0;
      const totalPages = dayLogs.reduce((sum, l) => sum + parseInt(l.pages || 0, 10), 0);

      let cellClass = 'aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold relative cursor-pointer group transition-all active:scale-90 duration-150 ';
      let iconMarkup = '';

      if (curDateStr === todayStr) {
        cellClass += 'border-2 border-primary ';
      }

      if (isLogged) {
        if (totalPages >= 5) {
          // Flame Log
          cellClass += 'bg-primary text-white shadow-sm font-bold ';
          iconMarkup = '<span class="text-[8px] absolute top-1 right-1">⚡</span>';
        } else {
          // Standard lighter log
          cellClass += 'bg-primary/25 text-primary border border-primary/30 ';
        }
      } else {
        // Unlogged day
        cellClass += 'bg-surface-container-high dark:bg-surface-container hover:bg-surface-container-highest text-on-surface-variant ';
      }

      dayCell.className = cellClass;
      dayCell.innerHTML = `
        <span>${day}</span>
        ${iconMarkup}
        <!-- Custom Tooltip -->
        <span class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-background dark:bg-surface border border-outline-variant/30 text-[9px] text-on-surface font-mono py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-30 glossy-finish">
          ${isLogged ? `Logged: ${totalPages} pages in ${dayLogs.reduce((sum, l) => sum + l.minutes, 0)}m` : 'No reading logged'}
        </span>
      `;

      // Cell click logs reading
      dayCell.addEventListener('click', () => {
        openReadingLogModal(curDateStr);
      });

      grid.appendChild(dayCell);
    }
  }

  function renderStreakProgressTimeline(logs) {
    const container = document.getElementById('streak-timeline-grid');
    const streakCountElem = document.getElementById('streak-days-count');
    const streakHealthDesc = document.getElementById('streak-health-desc');
    const count = calculateCurrentStreak(logs);

    if (streakCountElem) {
      streakCountElem.textContent = count;
    }

    if (container) {
      container.innerHTML = '';
      const today = new Date();
      // Generate recent 14 calendar days
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = formatDateISO(d);
        
        const isLogged = logs.some(l => l.date === dateStr && l.pages >= 5);
        const daysOfWeekShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        
        const dayLabel = `${daysOfWeekShort[d.getDay()]} ${d.getDate()}`;
        
        const item = document.createElement('div');
        if (isLogged) {
          item.className = 'flex items-center justify-between bg-primary/10 border border-primary/20 p-2.5 rounded-lg text-primary text-[10px] font-bold font-mono';
          item.innerHTML = `<span>🔥 ${dayLabel}</span> <i class="lucide-icon text-xs" data-lucide="circle-check"></i>`;
        } else {
          item.className = 'flex items-center justify-between bg-surface-container border border-outline-variant/5 p-2.5 rounded-lg text-on-surface-variant/40 text-[10px] font-medium font-mono';
          item.innerHTML = `<span>○ ${dayLabel}</span>`;
        }
        container.appendChild(item);
      }
    }

    if (streakHealthDesc) {
      if (count >= 14) {
        streakHealthDesc.textContent = '"Noble Sovereign Scholastic! Max 14-day consecutive streak achieved. Timeless wisdom flows in your veins!"';
      } else if (count >= 7) {
        streakHealthDesc.textContent = '"Incredible stamina! You are half-way to maximum scholastic completion. Read 5 pages daily."';
      } else if (count > 0) {
        streakHealthDesc.textContent = '"A solid flame is burning of ' + count + '-days! Log daily reading sessions to keep up your momentum!"';
      } else {
        streakHealthDesc.textContent = '"The library lies quiet. Tap any date on the calendar above to log a reading session!"';
      }
    }
  }

  // Trophies criteria setup
  const ACHIEVEMENT_TEMPLATES = [
    {
      id: 'first_log',
      title: 'Wisdom Initiate',
      criteria: 'Log your first reading session',
      icon: 'book',
      color: 'bg-secondary-container text-on-secondary-container',
      check: (logs) => logs.length > 0
    },
    {
      id: 'streak_5',
      title: 'Ascetic Scholar',
      criteria: 'Log a 5-day reading streak',
      icon: 'flame',
      color: 'bg-error/10 text-error',
      check: (logs) => calculateCurrentStreak(logs) >= 5
    },
    {
      id: 'deep_mind',
      title: 'Highlands Explorer',
      criteria: 'Attain at least 5 highlights',
      icon: 'pen-line',
      color: 'bg-primary-fixed text-primary',
      check: () => {
        try {
          const arr = JSON.parse(localStorage.getItem('lumina_highlights_v1') || '[]');
          return arr.length >= 5;
        } catch (e) { return false; }
      }
    },
    {
      id: 'nocturnal',
      title: 'Nocturnal Owl',
      criteria: 'Accumulate over 60 reading minutes',
      icon: 'moon',
      color: 'bg-tertiary-fixed text-on-tertiary-fixed',
      check: (logs) => logs.reduce((sum, l) => sum + parseInt(l.minutes || 0, 10), 0) >= 60
    },
    {
      id: 'mass_pages',
      title: 'Tome Devourer',
      criteria: 'Read 100 pages of wisdom',
      icon: 'book-open',
      color: 'bg-primary-fixed-dim text-primary',
      check: (logs) => logs.reduce((sum, l) => sum + parseInt(l.pages || 0, 10), 0) >= 100
    },
    {
      id: 'rigorous',
      title: 'Citadel Sage',
      criteria: 'Log Bhagwat Puran or Upanishad',
      icon: 'star',
      color: 'bg-amber-400/25 text-amber-500',
      check: (logs) => logs.some(l => l.book && (l.book.includes('Puran') || l.book.includes('Upanishad') || l.book.includes('Rigveda')))
    }
  ];

  function renderAchievements(logs) {
    const scroller = document.getElementById('profile-achievements-scroller');
    if (!scroller) return;

    scroller.innerHTML = '';
    
    // Check template locks
    ACHIEVEMENT_TEMPLATES.forEach(tmpl => {
      const unlocked = tmpl.check(logs);
      
      const card = document.createElement('div');
      card.className = `flex items-center gap-3 bg-surface-container-lowest dark:bg-surface-container-low p-2.5 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer shadow-sm relative w-full ${unlocked ? 'border-primary/25 opacity-100' : 'border-outline-variant/5 opacity-60'}`;
      
      const iconBg = unlocked ? tmpl.color : 'bg-surface-container text-on-surface-variant/40';
      const iconName = unlocked ? tmpl.icon : 'lock';

      card.innerHTML = `
        <div class="w-8 h-8 ${iconBg} rounded-full flex items-center justify-center shadow-inner flex-shrink-0">
          <i class="lucide-icon text-[15px] font-bold" data-lucide="${iconName}"></i>
        </div>
        <div class="min-w-0 flex-grow pr-12">
          <p class="font-bold text-on-surface text-xs leading-normal truncate">${tmpl.title}</p>
          <p class="text-[9px] font-mono text-on-surface-variant/70 uppercase leading-normal truncate">${tmpl.criteria}</p>
        </div>
        ${unlocked ? '<span class="absolute right-2 text-[8px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">Awarded</span>' : '<span class="absolute right-2 text-[8px] font-semibold text-on-surface-variant/40 bg-surface-container px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">Locked</span>'}
      `;

      // Click launches achievement toast or detailed description
      card.addEventListener('click', () => {
        if (unlocked) {
          showTemporaryToast(`👑 Awarded Trophy: ${tmpl.title}! - ${tmpl.criteria}`);
        } else {
          showTemporaryToast(`🔒 Locked: ${tmpl.title} - ${tmpl.criteria}. Keep reading!`);
        }
      });

      scroller.appendChild(card);
    });
  }

  // Set Profile Event Listeners and Modal Bindings
  function setupProfileControls() {
    // A. Month Swapping
    const btnPrev = document.getElementById('cal-prev-month');
    const btnNext = document.getElementById('cal-next-month');
    
    if (btnPrev) {
      btnPrev.onclick = (e) => {
        e.stopPropagation();
        calendarMonth--;
        if (calendarMonth < 0) {
          calendarMonth = 11;
          calendarYear--;
        }
        renderCalendarGrid(calendarYear, calendarMonth, getReadingLogs());
      };
    }
    
    if (btnNext) {
      btnNext.onclick = (e) => {
        e.stopPropagation();
        calendarMonth++;
        if (calendarMonth > 11) {
          calendarMonth = 0;
          calendarYear++;
        }
        renderCalendarGrid(calendarYear, calendarMonth, getReadingLogs());
      };
    }

    // B. Trigger Log Reading Session Modal
    const logBtn = document.getElementById('profile-log-session-btn');
    if (logBtn) {
      logBtn.onclick = () => {
        openReadingLogModal(formatDateISO(new Date()));
      };
    }

    const closeLogModalBtn = document.getElementById('close-log-session-modal');
    if (closeLogModalBtn) {
      closeLogModalBtn.onclick = () => {
        document.getElementById('modal-log-session').classList.add('hidden');
      };
    }

    const logForm = document.getElementById('log-session-form');
    if (logForm) {
      logForm.onsubmit = (e) => {
        e.preventDefault();
        const bookSel = document.getElementById('log-session-book').value;
        const pagesVal = parseInt(document.getElementById('log-session-pages').value, 10);
        const minutesVal = parseInt(document.getElementById('log-session-minutes').value, 10);
        const dateVal = document.getElementById('log-session-date').value;

        if (!bookSel || !pagesVal || !minutesVal || !dateVal) return;

        const currentLogs = getReadingLogs();
        
        // Overwrite or append log entry
        const existingIdx = currentLogs.findIndex(l => l.date === dateVal && l.book === bookSel);
        if (existingIdx > -1) {
          currentLogs[existingIdx].pages = pagesVal;
          currentLogs[existingIdx].minutes = minutesVal;
        } else {
          currentLogs.push({ date: dateVal, book: bookSel, pages: pagesVal, minutes: minutesVal });
        }

        saveReadingLogs(currentLogs);
        
        // Hide modal
        document.getElementById('modal-log-session').classList.add('hidden');
        
        // Refresh profile stats & plan
        initProfileCalendar();
        showTemporaryToast(`Logged ${pagesVal} pages read for ${bookSel}!`);
      };
    }

    // C. Edit Profile Modal Setup
    const editTrigger = document.getElementById('profile-edit-trigger');
    const closeEditModalBtn = document.getElementById('close-edit-profile-modal');
    
    if (editTrigger) {
      editTrigger.onclick = () => {
        const state = getProfileState();
        document.getElementById('modal-edit-name').value = state.name;
        document.getElementById('modal-edit-title').value = state.title;
        document.getElementById('modal-edit-wpm').value = state.wpm;
        document.getElementById('modal-edit-verify').value = state.verified;

        tempAvatarSelected = state.avatar;
        updateEditAvatarPreview(state.name, state.avatar);

        document.getElementById('modal-edit-profile').classList.remove('hidden');
      };
    }

    if (closeEditModalBtn) {
      closeEditModalBtn.onclick = () => {
        document.getElementById('modal-edit-profile').classList.add('hidden');
      };
    }

    // Handle Custom Avatar Picture Selection & File Upload
    const avatarUploadInput = document.getElementById('modal-edit-avatar-upload');
    if (avatarUploadInput) {
      avatarUploadInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const base64 = evt.target.result;
            tempAvatarSelected = base64;
            updateEditAvatarPreview('', base64);
          };
          reader.readAsDataURL(file);
        }
      };
    }

    const resetAvatarBtn = document.getElementById('modal-edit-avatar-reset');
    if (resetAvatarBtn) {
      resetAvatarBtn.onclick = () => {
        tempAvatarSelected = '';
        const nameVal = document.getElementById('modal-edit-name').value || 'Julian Thorne';
        updateEditAvatarPreview(nameVal, '');
      };
    }

    // Preset Avatar Buttons Listener
    const presetBtns = document.querySelectorAll('.preset-avatar-btn');
    presetBtns.forEach(btn => {
      btn.onclick = () => {
        const init = btn.dataset.initials || 'MA';
        // Mock a cool avatar using styled emojis or base initials
        tempAvatarSelected = '';
        updateEditAvatarPreview(init, '');
        document.getElementById('modal-edit-name').value = btn.title;
        document.getElementById('modal-edit-title').value = "Timeless Philosopher";
        showTemporaryToast(`Identity preset set: ${btn.title}`);
      };
    });

    const editProfileSubmitBtn = document.getElementById('modal-edit-submit-btn');
    if (editProfileSubmitBtn) {
      editProfileSubmitBtn.onclick = () => {
        const original = getProfileState();
        const updated = {
          ...original,
          name: document.getElementById('modal-edit-name').value.trim() || 'Julian Thorne',
          title: document.getElementById('modal-edit-title').value.trim() || 'Philosopher King',
          wpm: parseInt(document.getElementById('modal-edit-wpm').value, 10) || 280,
          verified: document.getElementById('modal-edit-verify').value,
          avatar: tempAvatarSelected || ''
        };

        saveProfileState(updated);
        document.getElementById('modal-edit-profile').classList.add('hidden');
        initProfileCalendar();
        showTemporaryToast("Academic status revised!");
      };
    }

    // D. Settings & Preferences sheets
    const subBtn = document.getElementById('setting-subscription');
    const focusBtn = document.getElementById('setting-focus');
    const notifBtn = document.getElementById('setting-notifications');
    const accountBtn = document.getElementById('setting-account');

    function openSettingsSheet(tab) {
      // Hide all panes
      document.getElementById('pane-subscription').classList.add('hidden');
      document.getElementById('pane-focus').classList.add('hidden');
      document.getElementById('pane-notifications').classList.add('hidden');
      
      const modal = document.getElementById('modal-profile-settings');
      const icon = document.getElementById('settings-sheet-icon');
      const title = document.getElementById('settings-sheet-title');

      if (tab === 'subscription') {
        document.getElementById('pane-subscription').classList.remove('hidden');
        icon.textContent = 'card_membership';
        title.textContent = 'LICENSING & TIERS';
      } else if (tab === 'focus') {
        document.getElementById('pane-focus').classList.remove('hidden');
        icon.textContent = 'potted_plant';
        title.textContent = 'FOCUS CONSTRAINTS';
      } else if (tab === 'notifications') {
        document.getElementById('pane-notifications').classList.remove('hidden');
        icon.textContent = 'notifications_active';
        title.textContent = 'HABITS ALARMS';
      }
      modal.classList.remove('hidden');
    }

    if (subBtn) subBtn.onclick = () => openSettingsSheet('subscription');
    if (focusBtn) focusBtn.onclick = () => openSettingsSheet('focus');
    if (notifBtn) notifBtn.onclick = () => openSettingsSheet('notifications');
    if (accountBtn) {
      accountBtn.onclick = () => {
        if (editTrigger) editTrigger.click();
      };
    }

    const closeSettingsSheetBtn = document.getElementById('close-settings-sheet');
    if (closeSettingsSheetBtn) {
      closeSettingsSheetBtn.onclick = () => {
        document.getElementById('modal-profile-settings').classList.add('hidden');
      };
    }

    // Save Preference Buttons Settings
    const saveSubBtn = document.getElementById('save-subscription-setting');
    if (saveSubBtn) {
      saveSubBtn.onclick = () => {
        const current = getProfileState();
        current.subtype = localStorage.getItem('LuminaProfileSub_temp') || current.subtype;
        saveProfileState(current);
        document.getElementById('modal-profile-settings').classList.add('hidden');
        showTemporaryToast(`Licensing confirmed in: ${current.subtype}`);
        const badge = document.getElementById('setting-sub-badge');
        if (badge) badge.textContent = current.subtype;
      };
    }

    const tierPrem = document.getElementById('lic-tier-premium');
    const tierBasic = document.getElementById('lic-tier-basic');
    if (tierPrem && tierBasic) {
      tierPrem.onclick = () => {
        localStorage.setItem('LuminaProfileSub_temp', 'Premium Scholar');
        tierPrem.className = "py-3 px-2 border-2 border-primary rounded-xl text-center cursor-pointer flex flex-col items-center justify-center bg-primary/5";
        tierBasic.className = "py-3 px-2 border border-outline-variant/30 rounded-xl text-center hover:bg-surface-container-low cursor-pointer flex flex-col items-center justify-center";
      };
      tierBasic.onclick = () => {
        localStorage.setItem('LuminaProfileSub_temp', 'Standard Ascetic');
        tierPrem.className = "py-3 px-2 border border-outline-variant/30 rounded-xl text-center hover:bg-surface-container-low cursor-pointer flex flex-col items-center justify-center";
        tierBasic.className = "py-3 px-2 border-2 border-primary rounded-xl text-center cursor-pointer flex flex-col items-center justify-center bg-primary/5";
      };
    }

    const saveFocusBtn = document.getElementById('save-focus-setting');
    if (saveFocusBtn) {
      saveFocusBtn.onclick = () => {
        const minutes = parseInt(document.getElementById('setting-focus-minutes').value, 10);
        const autodim = document.getElementById('setting-focus-autodim').checked;
        const profile = getProfileState();
        profile.focusMinutes = minutes;
        profile.autodim = autodim;
        saveProfileState(profile);
        
        document.getElementById('modal-profile-settings').classList.add('hidden');
        showTemporaryToast("Ambiance variables preserved!");
        const focusStateText = document.getElementById('setting-focus-status');
        if (focusStateText) focusStateText.textContent = `${minutes}min • Enabled`;
      };
    }

    const saveNotifBtn = document.getElementById('save-notif-setting');
    if (saveNotifBtn) {
      saveNotifBtn.onclick = () => {
        const pageGoal = parseInt(document.getElementById('setting-notif-page-target').value, 10);
        const alarmTime = document.getElementById('setting-notif-alarm-time').value;
        const goalEnabled = document.getElementById('setting-notif-goal').checked;
        const mute = document.getElementById('setting-notif-mute').checked;

        const profile = getProfileState();
        profile.notifGoal = goalEnabled;
        profile.notifPageTarget = pageGoal;
        profile.notifTime = alarmTime;
        profile.mute = mute;
        saveProfileState(profile);

        document.getElementById('modal-profile-settings').classList.add('hidden');
        showTemporaryToast("Habit alerts armed and locked!");
        const textNotif = document.getElementById('setting-notif-status');
        if (textNotif) textNotif.textContent = goalEnabled ? `Daily Target: ${pageGoal}p` : 'Goal alarms OFF';
      };
    }

    // Achievements View All Modal
    const viewAllAch = document.getElementById('view-all-achievements');
    const closeAllAch = document.getElementById('close-achievements-all-modal');
    if (viewAllAch) {
      viewAllAch.onclick = () => {
        renderAchievementsFullList(getReadingLogs());
        document.getElementById('modal-achievements-all').classList.remove('hidden');
      };
    }
    if (closeAllAch) {
      closeAllAch.onclick = () => {
        document.getElementById('modal-achievements-all').classList.add('hidden');
      };
    }

    // Logout system simulation
    const logoutBtn = document.getElementById('profile-logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        const confirm = window.confirm("Do you wish to log out and synchronize files to the master library clone?");
        if (confirm) {
          showTemporaryToast("Signing out securely...");
          setTimeout(() => {
            showTemporaryToast("Logged out successfully! Re-routing to entry greeting...");
            location.reload();
          }, 1500);
        }
      };
    }
  }

  function updateEditAvatarPreview(name, base64) {
    const prevImg = document.getElementById('modal-edit-avatar-img');
    const prevInitials = document.getElementById('modal-edit-avatar-initials');
    
    if (prevImg && prevInitials) {
      if (base64) {
        prevImg.src = base64;
        prevImg.classList.remove('hidden');
        prevInitials.classList.add('hidden');
      } else {
        prevImg.classList.add('hidden');
        prevInitials.classList.remove('hidden');
        
        const initials = name.split(' ').map(p => p[0] || '').join('').substring(0, 2).toUpperCase();
        prevInitials.textContent = initials || 'JT';
      }
    }
  }

  function renderAchievementsFullList(logs) {
    const list = document.getElementById('achievements-full-list');
    if (!list) return;

    list.innerHTML = '';
    ACHIEVEMENT_TEMPLATES.forEach(tmpl => {
      const unlocked = tmpl.check(logs);
      
      const row = document.createElement('div');
      row.className = `flex items-center justify-between p-4 rounded-xl border font-semibold ${unlocked ? 'border-primary/25 bg-primary/5' : 'border-outline-variant/10 bg-surface-container opacity-40'}`;
      
      const iconClass = unlocked ? tmpl.color : 'bg-surface-container-high text-on-surface-variant/40';
      const iconName = unlocked ? tmpl.icon : 'lock';

      row.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 ${iconClass} rounded-full flex items-center justify-center shadow">
            <i class="lucide-icon font-bold" data-lucide="${iconName}"></i>
          </div>
          <div>
            <p class="text-xs font-bold text-on-surface">${tmpl.title}</p>
            <p class="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">${tmpl.criteria}</p>
          </div>
        </div>
        <div>
          <span class="text-[9px] font-mono font-bold uppercase ${unlocked ? 'bg-primary/10 text-primary px-2.5 py-1 rounded-full' : 'bg-outline-variant/25 text-on-surface-variant/40 px-2 py-0.5 rounded'}">
            ${unlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>
      `;
      list.appendChild(row);
    });
  }

  // Populate book dropdown list and invoke read log prompt
  async function openReadingLogModal(presetDate) {
    const select = document.getElementById('log-session-book');
    const dateInput = document.getElementById('log-session-date');
    if (!select || !dateInput) return;

    dateInput.value = presetDate;
    select.innerHTML = '';

    // Load available books
    let libraryBooks = [];
    if (window.LuminaDB && typeof window.LuminaDB.getBooks === 'function') {
      try {
        libraryBooks = await window.LuminaDB.getBooks();
      } catch (e) {
        console.warn("Could not query books from DB; fallback to default list", e);
      }
    }

    const defaultBooks = [
      { id: 'bhagwat', title: 'Bhagwat Puran' },
      { id: 'ethics', title: 'The Nicomachean Ethics' },
      { id: 'rules', title: 'Atomic Habits' },
      { id: 'rigveda', title: 'Rigveda' },
      { id: 'critique', title: 'Critique of Pure Reason' }
    ];

    const finalBooks = [...libraryBooks];
    defaultBooks.forEach(db => {
      const dbTitle = (db.title || db.name || '').toLowerCase();
      if (!finalBooks.some(fb => (fb.title || fb.name || '').toLowerCase() === dbTitle)) {
        finalBooks.push(db);
      }
    });

    finalBooks.forEach(b => {
      const bookTitle = b.title || b.name || '';
      const opt = document.createElement('option');
      opt.value = bookTitle;
      opt.textContent = bookTitle;
      select.appendChild(opt);
    });

    // Reset log input pages & minutes
    document.getElementById('log-session-pages').value = '';
    document.getElementById('log-session-minutes').value = '';

    // If pre-existing logs match, select that book and pre-populate pages / minutes
    const savedLogs = getReadingLogs();
    const matches = savedLogs.filter(l => l.date === presetDate);
    if (matches.length > 0) {
      const firstMatch = matches[0];
      select.value = firstMatch.book;
      document.getElementById('log-session-pages').value = firstMatch.pages;
      document.getElementById('log-session-minutes').value = firstMatch.minutes;
    }

    document.getElementById('modal-log-session').classList.remove('hidden');
  }


  // Reader controls
  function initReader() {
    const controls = document.getElementById('reading-controls');
    const topBar = document.getElementById('top-bar');
    const readerCanvas = document.getElementById('reader-canvas');
    const zoomSlider = document.getElementById('pdf-zoom');
    const iframe = document.getElementById('pdf-frame');
    let isControlsVisible = true;

    if (!controls) return;
    readerInitialized = true;

    function toggleReaderControls() {
      isControlsVisible = !isControlsVisible;
      
      // Sync bottom controls
      controls.classList.toggle('translate-y-full', !isControlsVisible);
      controls.classList.toggle('translate-y-0', isControlsVisible);
      
      // Sync top bar
      topBar.classList.toggle('-translate-y-full', !isControlsVisible);
      topBar.classList.toggle('translate-y-0', isControlsVisible);
    }

    document.getElementById('reader-tap-zone')?.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, iframe')) return;
      toggleReaderControls();
    });

    if (zoomSlider) {
      let zoom = 100;
      zoomSlider.addEventListener('input', () => {
        zoom = parseInt(zoomSlider.value, 10);
        if (iframe) {
          iframe.style.transform = `scale(${zoom / 100})`;
          iframe.style.transformOrigin = 'top center';
        }
        const wrapper = document.getElementById('canvas-page-wrapper');
        if (wrapper) {
          wrapper.style.transform = `scale(${zoom / 100})`;
          wrapper.style.transformOrigin = 'top center';
        }
      });
    }

    // Configure floating controllers for custom PDF Canvas Reader
    const prevBtn = document.getElementById('canvas-prev-btn');
    const nextBtn = document.getElementById('canvas-next-btn');
    const prevBarBtn = document.getElementById('canvas-prev-bar-btn');
    const nextBarBtn = document.getElementById('canvas-next-bar-btn');
    const pageInput = document.getElementById('canvas-page-input');

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.stopPropagation();
        if (pdfCurrentPage > 1) {
          physicalTurnPage(-1);
        }
      };
    }
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.stopPropagation();
        if (pdfCurrentPage < pdfNumPages) {
          physicalTurnPage(1);
        }
      };
    }
    if (prevBarBtn) {
      prevBarBtn.onclick = (e) => {
        e.stopPropagation();
        if (pdfCurrentPage > 1) {
          physicalTurnPage(-1);
        }
      };
    }
    if (nextBarBtn) {
      nextBarBtn.onclick = (e) => {
        e.stopPropagation();
        if (pdfCurrentPage < pdfNumPages) {
          physicalTurnPage(1);
        }
      };
    }
    if (pageInput) {
      pageInput.onchange = () => {
        let val = parseInt(pageInput.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > pdfNumPages) val = pdfNumPages;
        queueRenderPage(val);
      };
    }

    // Floating Reader Back Button top-left corner
    const floatBack = document.getElementById('floating-reader-back');
    if (floatBack) {
      floatBack.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeReader();
      };
    }

    // Grab-to-turn or swipe-to-turn gesture controls on the page card
    const canvasContainer = document.getElementById('pdf-canvas-container');
    const pageWrapper = document.getElementById('canvas-page-wrapper');
    if (canvasContainer && pageWrapper) {
      let isDraggingPage = false;
      let pageDragStartX = 0;
      let pageDragStartY = 0;
      let totalPageDragX = 0;

      pageWrapper.classList.add('grab-to-turn');

      const handlePageDragStart = (e) => {
        if (!pdfDoc || isRenderingPage) return;
        if (e.target.closest('button, input, textarea, a')) return;

        isDraggingPage = true;
        const pt = e.touches ? e.touches[0] : e;
        pageDragStartX = pt.clientX;
        pageDragStartY = pt.clientY;
        totalPageDragX = 0;

        // Temporarily disable transition during dragging
        pageWrapper.style.transition = 'none';
      };

      const handlePageDragMove = (e) => {
        if (!isDraggingPage) return;

        const pt = e.touches ? e.touches[0] : e;
        const diffX = pt.clientX - pageDragStartX;
        const diffY = pt.clientY - pageDragStartY;

        // Ensure vertical drag isn't dominating
        if (Math.abs(diffX) > Math.abs(diffY)) {
          e.preventDefault(); // Stop standard window scrolling
          totalPageDragX = diffX;

          // Lift page with perspective skew
          const rotation = (diffX / window.innerWidth) * 40; // max 40deg flip
          const scale = Math.max(0.88, 1 - Math.abs(diffX) / (window.innerWidth * 3));
          const translation = diffX * 0.75;
          const skew = (diffX / window.innerWidth) * 5;

          pageWrapper.style.transform = `translateX(${translation}px) rotateY(${rotation}deg) scale(${scale}) skewY(${skew}deg)`;
        }
      };

      const handlePageDragEnd = (e) => {
        if (!isDraggingPage) return;
        isDraggingPage = false;

        // Restore transitions
        pageWrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease';

        if (Math.abs(totalPageDragX) > 100) {
          if (totalPageDragX < -100) {
            if (pdfCurrentPage < pdfNumPages) {
              physicalTurnPage(1);
            } else {
              pageWrapper.style.transform = 'none';
            }
          } else {
            if (pdfCurrentPage > 1) {
              physicalTurnPage(-1);
            } else {
              pageWrapper.style.transform = 'none';
            }
          }
        } else {
          pageWrapper.style.transform = 'none';
        }
      };

      pageWrapper.addEventListener('mousedown', handlePageDragStart);
      window.addEventListener('mousemove', handlePageDragMove);
      window.addEventListener('mouseup', handlePageDragEnd);

      pageWrapper.addEventListener('touchstart', handlePageDragStart, { passive: false });
      pageWrapper.addEventListener('touchmove', handlePageDragMove, { passive: false });
      pageWrapper.addEventListener('touchend', handlePageDragEnd);
    }

    // Interactive 3D Book Corner triggers & mouse drags
    const cornerRight = document.getElementById('corner-curl-hint-right');
    const cornerLeft = document.getElementById('corner-curl-hint-left');
    
    if (cornerRight) {
      cornerRight.onclick = (e) => {
        e.stopPropagation();
        if (pdfCurrentPage < pdfNumPages) {
          physicalTurnPage(1);
        }
      };
    }
    
    if (cornerLeft) {
      cornerLeft.onclick = (e) => {
        e.stopPropagation();
        if (pdfCurrentPage > 1) {
          physicalTurnPage(-1);
        }
      };
    }

    // Toggle 3D Book Mode button
    const toggleBookModeBtn = document.getElementById('reader-toggle-book-mode');
    if (toggleBookModeBtn) {
      toggleBookModeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        bookModeActive = !bookModeActive;
        refreshReaderViews();
      };
    }

    // Native mouse-drag sliding on 3D book pages
    const bookContainer = document.getElementById('lumina-3d-book-container');
    if (bookContainer) {
      let isDraggingBook = false;
      let bookDragStartX = 0;
      let totalBookDragX = 0;
      let dragActivePageState = null; // null, 1 (forward), -1 (backward)

      const handleBookDragStart = (e) => {
        if (!pdfDoc || isBookFlipping) return;
        if (e.target.closest('button, input, textarea, a')) return;
        isDraggingBook = true;
        const pt = e.touches ? e.touches[0] : e;
        bookDragStartX = pt.clientX;
        totalBookDragX = 0;
        dragActivePageState = null;
      };

      const handleBookDragMove = (e) => {
        if (!isDraggingBook) return;
        const pt = e.touches ? e.touches[0] : e;
        totalBookDragX = pt.clientX - bookDragStartX;

        const leafNode = document.getElementById('book-flipping-leaf');
        const leafFrontCanvas = document.getElementById('pdf-reader-canvas-flip-front');
        const leafBackCanvas = document.getElementById('pdf-reader-canvas-flip-back');
        const singleCanvas = document.getElementById('pdf-reader-canvas-single');
        const bookEl = document.getElementById('lumina-3d-book');

        if (!leafNode || !leafFrontCanvas || !leafBackCanvas || !singleCanvas || !bookEl) return;

        const pageWidth = bookEl.offsetWidth || 480;

        // If drag state is not yet decided, check threshold
        if (dragActivePageState === null) {
          if (totalBookDragX < -15) {
            // Turning forward -> next page
            if (pdfCurrentPage < pdfNumPages) {
              dragActivePageState = 1;
              isBookFlipping = true; // lock transitions
              
              leafNode.style.left = '0';
              leafNode.style.right = '0';
              leafNode.style.transformOrigin = 'left center';
              clearCanvas(leafBackCanvas);

              // Pre-render leaf front (current page) and single layout underneath (target page)
              renderSinglePageToCanvas(pdfCurrentPage, leafFrontCanvas);
              renderSinglePageToCanvas(pdfCurrentPage + 1, singleCanvas);
              
              leafNode.classList.remove('hidden');
              leafNode.style.transition = 'none';
              leafNode.style.transform = 'rotateY(0deg)';
            }
          } else if (totalBookDragX > 15) {
            // Turning backward -> previous page
            if (pdfCurrentPage > 1) {
              dragActivePageState = -1;
              isBookFlipping = true; // lock transitions
              
              leafNode.style.left = '0';
              leafNode.style.right = '0';
              leafNode.style.transformOrigin = 'left center';
              clearCanvas(leafBackCanvas);

              // Pre-render leaf front (target page) and single layout underneath (current page)
              renderSinglePageToCanvas(pdfCurrentPage - 1, leafFrontCanvas);
              renderSinglePageToCanvas(pdfCurrentPage, singleCanvas);
              
              leafNode.classList.remove('hidden');
              leafNode.style.transition = 'none';
              leafNode.style.transform = 'rotateY(-180deg)';
            }
          }
        } else {
          // Dynamic angle steering
          if (dragActivePageState === 1) {
            let ratio = -totalBookDragX / pageWidth;
            ratio = Math.max(0, Math.min(1, ratio));
            let angle = -ratio * 180;
            leafNode.style.transform = `rotateY(${angle}deg)`;
          } else if (dragActivePageState === -1) {
            let ratio = totalBookDragX / pageWidth;
            ratio = Math.max(0, Math.min(1, ratio));
            let angle = -180 + (ratio * 180);
            leafNode.style.transform = `rotateY(${angle}deg)`;
          }
        }
      };

      const handleBookDragEnd = () => {
        if (!isDraggingBook) return;
        isDraggingBook = false;

        const leafNode = document.getElementById('book-flipping-leaf');
        const bookEl = document.getElementById('lumina-3d-book');
        if (!leafNode || !bookEl) {
          isBookFlipping = false;
          dragActivePageState = null;
          return;
        }

        const pageWidth = bookEl.offsetWidth || 480;

        if (dragActivePageState !== null) {
          const dragRatio = Math.abs(totalBookDragX) / pageWidth;
          const isSuccessTurn = dragRatio > 0.25 || Math.abs(totalBookDragX) > 100;

          playPageFlipSound();
          leafNode.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';

          if (isSuccessTurn) {
            if (dragActivePageState === 1) {
              // Complete forward turn smoothly
              leafNode.style.transform = 'rotateY(-180deg)';
              const nextPg = pdfCurrentPage + 1;
              setTimeout(() => {
                pdfCurrentPage = nextPg;
                renderPdfBookPages(pdfCurrentPage);
                leafNode.classList.add('hidden');
                leafNode.style.transition = 'none';
                leafNode.style.transform = 'rotateY(0deg)';
                isBookFlipping = false;
                dragActivePageState = null;
              }, 410);
            } else {
              // Complete backward turn smoothly
              leafNode.style.transform = 'rotateY(0deg)';
              const prevPg = pdfCurrentPage - 1;
              setTimeout(() => {
                pdfCurrentPage = prevPg;
                renderPdfBookPages(pdfCurrentPage);
                leafNode.classList.add('hidden');
                leafNode.style.transition = 'none';
                leafNode.style.transform = 'rotateY(0deg)';
                isBookFlipping = false;
                dragActivePageState = null;
              }, 410);
            }
          } else {
            // Cancel turn -> snap page back smoothly
            if (dragActivePageState === 1) {
              leafNode.style.transform = 'rotateY(0deg)';
            } else {
              leafNode.style.transform = 'rotateY(-180deg)';
            }
            setTimeout(() => {
              renderPdfBookPages(pdfCurrentPage);
              leafNode.classList.add('hidden');
              leafNode.style.transition = 'none';
              leafNode.style.transform = 'rotateY(0deg)';
              isBookFlipping = false;
              dragActivePageState = null;
            }, 410);
          }
        }
      };

      bookContainer.addEventListener('mousedown', handleBookDragStart);
      window.addEventListener('mousemove', handleBookDragMove);
      window.addEventListener('mouseup', handleBookDragEnd);

      bookContainer.addEventListener('touchstart', handleBookDragStart, { passive: true });
      bookContainer.addEventListener('touchmove', handleBookDragMove, { passive: true });
      bookContainer.addEventListener('touchend', handleBookDragEnd);
    }

    document.getElementById('reader-bookmark')?.addEventListener('click', function () {
      const icon = this.querySelector('.lucide-icon');
      const filled = icon.style.fontVariationSettings?.includes("'FILL' 1");
      icon.style.fontVariationSettings = filled ? "'FILL' 0" : "'FILL' 1";
    });

    // Toggle Workspace Panel
    const toggleWorkspaceBtn = document.getElementById('reader-toggle-workspace');
    const workspaceCloseBtn = document.getElementById('reader-close-workspace');
    const workspacePanel = document.getElementById('reader-workspace');

    if (toggleWorkspaceBtn && workspacePanel) {
      toggleWorkspaceBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = workspacePanel.classList.contains('hidden');
        if (isHidden) {
          workspacePanel.classList.remove('hidden');
          workspacePanel.style.display = 'flex';
          // Force hide AI sidebar to avoid clutter
          const aiPanel = document.getElementById('reader-ai-sidebar');
          if (aiPanel) {
            aiPanel.classList.add('hidden');
            aiPanel.style.display = 'none';
          }
        } else {
          workspacePanel.classList.add('hidden');
          workspacePanel.style.display = 'none';
        }
      };
    }

    if (workspaceCloseBtn && workspacePanel) {
      workspaceCloseBtn.onclick = (e) => {
        e.preventDefault();
        workspacePanel.classList.add('hidden');
        workspacePanel.style.display = 'none';
      };
    }

    // Toggle Scholar AI sidebar
    const toggleAIBtn = document.getElementById('reader-toggle-ai');
    const aiCloseBtn = document.getElementById('reader-close-ai');
    const aiPanel = document.getElementById('reader-ai-sidebar');

    if (toggleAIBtn && aiPanel) {
      toggleAIBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = aiPanel.classList.contains('hidden');
        if (isHidden) {
          aiPanel.classList.remove('hidden');
          aiPanel.style.display = 'flex';
          // Force hide regular workspace to avoid clutter
          if (workspacePanel) {
            workspacePanel.classList.add('hidden');
            workspacePanel.style.display = 'none';
          }
        } else {
          aiPanel.classList.add('hidden');
          aiPanel.style.display = 'none';
        }
      };
    }

    if (aiCloseBtn && aiPanel) {
      aiCloseBtn.onclick = (e) => {
        e.preventDefault();
        aiPanel.classList.add('hidden');
        aiPanel.style.display = 'none';
      };
    }

    // AI Analytical actions click
    const aiActionButtons = document.querySelectorAll('.reader-ai-act-btn');
    const responseBox = document.getElementById('reader-ai-response-box');

    async function getCurrentPageText() {
      if (!pdfDoc) return "No text extracted. Please ensure PDF document is active.";
      try {
        const page = await pdfDoc.getPage(pdfCurrentPage || 1);
        const textContent = await page.getTextContent();
        const textItems = textContent.items || [];
        const extracted = textItems.map(item => item.str).join(" ");
        return extracted.trim() || "(This page has empty text or consists of purely non-OCR visual image scans)";
      } catch (err) {
        console.warn("Failed to extract page text:", err);
        return "Failed to extract text from page canvas.";
      }
    }

    aiActionButtons.forEach(btn => {
      btn.onclick = async (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        
        if (responseBox) {
          responseBox.innerHTML = `
            <div class="flex items-center gap-2 py-4 text-amber-800 dark:text-[#FBBF24]">
              <i class="lucide-icon text-sm animate-spin" data-lucide="refresh-ccw"></i>
              <span class="font-mono text-[9px] tracking-wider uppercase">SAGE AI CONSULTING TEXT SOURCE...</span>
            </div>`;
        }

        try {
          const pageStr = await getCurrentPageText();
          
          const res = await fetch('/api/ai-chat-explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pageText: pageStr,
              bookTitle: currentBook ? currentBook.name : 'Immortal Wisdom',
              queryType: action
            })
          });

          if (!res.ok) {
            throw new Error(`AI companion handshakes failed: ${res.status}`);
          }

          const responseData = await res.json();
          const markdownAns = responseData.response || "No reply produced.";

          if (responseBox) {
            const parsedHtml = markdownAns
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="text-[#A67C52] font-semibold">$1</em>')
              .replace(/#+\s+(.*)/g, '<h4 class="font-bold text-xs text-primary dark:text-[#E4E2DD] mt-3 uppercase tracking-widest">$1</h4>')
              .replace(/^\-\s+(.*)/gm, '<li class="ml-4 list-disc mt-1 text-[11px]">$1</li>')
              .replace(/\n\n/g, '<p class="mt-2.5"></p>');

            responseBox.innerHTML = `<div class="font-sans leading-relaxed space-y-2 text-[#2b2b2b] dark:text-[#D1CFC9] text-[11.5px]">${parsedHtml}</div>`;
          }
        } catch (err) {
          console.error("AI Reader Companion failed:", err);
          if (responseBox) {
            responseBox.innerHTML = `<span class="text-red-500 font-bold font-mono text-[10px]">PHILOSOPHICAL NETWORK ERROR: ${err.message}</span>`;
          }
        }
      };
    });

    // Custom text questioning Submit
    const customSubmitBtn = document.getElementById('reader-ai-custom-submit');
    const customInput = document.getElementById('reader-ai-custom-input');

    if (customSubmitBtn && customInput) {
      customSubmitBtn.onclick = async (e) => {
        e.preventDefault();
        const queryVal = customInput.value.trim();
        if (!queryVal) {
          if (window.showTemporaryToast) window.showTemporaryToast("Please type a custom inquiry.");
          return;
        }

        if (responseBox) {
          responseBox.innerHTML = `
            <div class="flex items-center gap-2 py-4 text-amber-800 dark:text-[#FBBF24]">
              <i class="lucide-icon text-sm animate-spin" data-lucide="refresh-ccw"></i>
              <span class="font-mono text-[9px] tracking-wider uppercase">Evaluating page context for custom query...</span>
            </div>`;
        }

        try {
          const pageStr = await getCurrentPageText();
          
          const res = await fetch('/api/ai-chat-explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pageText: pageStr,
              bookTitle: currentBook ? currentBook.name : 'Immortal Wisdom',
              queryType: 'chat',
              userQuery: queryVal
            })
          });

          if (!res.ok) {
            throw new Error(`AI custom inquiry failed. Status: ${res.status}`);
          }

          const responseData = await res.json();
          const markdownAns = responseData.response || "No reply produced.";

          if (responseBox) {
            const parsedHtml = markdownAns
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="text-[#A67C52] font-semibold">$1</em>')
              .replace(/#+\s+(.*)/g, '<h4 class="font-bold text-xs text-primary dark:text-[#E4E2DD] mt-3 uppercase tracking-widest">$1</h4>')
              .replace(/^\-\s+(.*)/gm, '<li class="ml-4 list-disc mt-1 text-[11px]">$1</li>')
              .replace(/\n\n/g, '<p class="mt-2.5"></p>');

            responseBox.innerHTML = `<div class="font-sans leading-relaxed space-y-2 text-[#2b2b2b] dark:text-[#D1CFC9] text-[11.5px]">${parsedHtml}</div>`;
          }
          customInput.value = '';
        } catch (err) {
          console.error("AI custom query exception:", err);
          if (responseBox) {
            responseBox.innerHTML = `<span class="text-red-500 font-bold font-mono text-[10px]">Error: ${err.message}</span>`;
          }
        }
      };
    }
  }

  // Grab-to-scroll desktop mouse slide functionality
  function setupGrabScroll(element) {
    if (!element) return;
    let isDown = false;
    let startX;
    let scrollLeft;
    let totalDrag = 0;

    element.style.cursor = 'grab';
    element.classList.add('select-none');

    element.addEventListener('mousedown', (e) => {
      // Left click only
      if (e.button !== 0) return;
      isDown = true;
      element.style.cursor = 'grabbing';
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
      totalDrag = 0;
    });

    element.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        element.style.cursor = 'grab';
      }
    });

    element.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        element.style.cursor = 'grab';
      }
    });

    element.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 1.5;
      totalDrag = Math.abs(x - startX);
      if (totalDrag > 5) {
        e.preventDefault();
        element.scrollLeft = scrollLeft - walk;
      }
    });

    // Capture child clicks during drag
    element.addEventListener('click', (e) => {
      if (totalDrag > 10) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  function bindAllScrolls() {
    const scrollers = [
      'library-filters',
      'home-collections-list',
      'home-featured',
      'mood-filters',
      'wisdom-chips-wrapper',
      'highlights-color-filters',
      'profile-achievements-scroller',
      'reader-parts',
      'vault-type-filters',
      'vault-folder-filters'
    ];
    scrollers.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        setupGrabScroll(el);
      }
    });
  }

  // ----------------------------------------------------
  // BOOK DETAILS PAGE CONTROL WORKFLOWS
  // ----------------------------------------------------
  let currentSpeechUtterance = null;
  
  async function openBookDetailsPage(book) {
    if (!book) return;
    
    // Sync vault logic
    if (window.WisdomVault && window.WisdomVault.setFilterBook) {
        window.WisdomVault.setFilterBook(book.id || book.name);
    }
    
    // Stop any active TTS narration
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    currentSpeechUtterance = null;
    const listenBtn = document.getElementById('details-listen-btn');
    if (listenBtn) {
      listenBtn.innerHTML = `<i class="lucide-icon text-sm" data-lucide="volume-2"></i> LISTEN ALOUD`;
      listenBtn.classList.remove('bg-amber-600', 'text-white');
    }

    // Populate metadata fields
    document.getElementById('details-title').textContent = book.name || book.title || "Sacred Text";
    
    const nativeEl = document.getElementById('details-native-title');
    if (nativeEl) {
      nativeEl.textContent = book.deva || book.nativeTitle || "";
    }
    
    document.getElementById('details-author').textContent = book.author || "ANCIENT VEDIC RISHI";
    document.getElementById('details-lang').textContent = book.lang || book.language || "English";
    
    const cat = window.LuminaLibrary?.decodeHtml(book.categoryTitle) || book.category || "Wisdom";
    document.getElementById('details-category').textContent = cat;
    
    // Pages / Reading time estimations
    const readingTime = book.readingTime || "3h 45m";
    const pagesCount = book.pagesCount || (book.pdfs && book.pdfs[0] ? "120 - 300 pages" : "150 pages");
    document.getElementById('details-reading-time').textContent = readingTime;
    document.getElementById('details-pages-count').textContent = pagesCount;
    
    // Description text
    const descEl = document.getElementById('details-description');
    if (descEl) {
      descEl.textContent = book.description || `An immortal literary masterwork on ${cat.toLowerCase()} philosophy. Open within the dynamic virtual reader to highlight passages, save bookmarks, and interact with the companion AI scholar.`;
    }

    // Render original vector SVG book cover or image
    const coverContainer = document.getElementById('details-cover-container');
    if (coverContainer) {
      coverContainer.innerHTML = window.LuminaLibrary?.renderBookCoverMarkup(book) || "";
      // Trigger lazy loads for the details cover inside metadata container
      const coverUri = book.cover || book.coverUrl;
      const cardShadow = coverContainer.querySelector('.book-card-shadow');
      if (cardShadow) {
        if (coverUri) {
          const img = document.createElement('img');
          img.src = coverUri;
          img.alt = book.name;
          img.className = 'absolute inset-0 w-full h-full object-cover z-5 transition-opacity duration-300 opacity-0';
          img.onload = () => {
            img.classList.remove('opacity-0');
            img.classList.add('opacity-100');
          };
          img.referrerPolicy = 'no-referrer';
          cardShadow.appendChild(img);
        } else {
          // Fallback to stylized vector
          cardShadow.style.background = 'linear-gradient(135deg, #1f2326, #090b0c)';
        }
      }
    }

    // Real-time evaluation of offline caching in IndexedDB
    const fileId = book.pdfs?.[0]?.fileId || book.localBlobKey || `cached_file_${window.LuminaLibrary.bookId(book)}`;
    let isDownloaded = false;
    if (window.LuminaDB) {
      try {
        const localBlob = await window.LuminaDB.getFile(fileId);
        if (localBlob) {
          isDownloaded = true;
        }
      } catch (err) {
        console.warn("Error accessing IndexedDB file status:", err);
      }
    }

    updateDetailsDownloadBadge(isDownloaded);

    // Bind Back navigation
    const backBtn = document.getElementById('details-back');
    if (backBtn) {
      backBtn.onclick = (e) => {
        e.preventDefault();
        if (window.location.hash.includes('/reader/')) {
          window.location.hash = '';
        }
        showView('library');
      };
    }

    // Bind Action: READ NOW
    const readBtn = document.getElementById('details-read-btn');
    if (readBtn) {
      readBtn.onclick = () => {
        if (book.pdfs && book.pdfs.length > 1) {
          showPartPicker(book);
        } else {
          openBookReader(book, 0);
        }
      };
    }

    // Bind Action: LISTEN ALOUD (Sleek TTS Engine with interactive playing toggle)
    if (listenBtn) {
      listenBtn.onclick = () => {
        if (window.speechSynthesis) {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            listenBtn.innerHTML = `<i class="lucide-icon text-sm" data-lucide="volume-2"></i> LISTEN ALOUD`;
            listenBtn.classList.remove('bg-amber-605', 'text-white');
            if (window.showTemporaryToast) window.showTemporaryToast("Narration paused.");
          } else {
            const textToSpeak = `${book.name}. By ${book.author || 'Ancient author'}. ${descEl ? descEl.textContent : ''}`;
            currentSpeechUtterance = new SpeechSynthesisUtterance(textToSpeak);
            currentSpeechUtterance.rate = 0.95;
            currentSpeechUtterance.onend = () => {
              listenBtn.innerHTML = `<i class="lucide-icon text-sm" data-lucide="volume-2"></i> LISTEN ALOUD`;
              listenBtn.classList.remove('bg-amber-605', 'text-white');
            };
            window.speechSynthesis.speak(currentSpeechUtterance);
            listenBtn.innerHTML = `<i class="lucide-icon text-sm animate-pulse" data-lucide="pause"></i> STOP NARRATION`;
            listenBtn.classList.add('bg-amber-605', 'text-white');
            if (window.showTemporaryToast) window.showTemporaryToast("Starting live text-to-speech synopsis...");
          }
        } else {
          if (window.showTemporaryToast) window.showTemporaryToast("Text-to-speech not supported on this device.");
        }
      };
    }

    // Bind Action: DOWNLOAD OFFLINE Cache System
    const downloadBtn = document.getElementById('details-download-btn');
    const updateDownloadButtonText = (downloaded) => {
      if (downloadBtn) {
        if (downloaded) {
          downloadBtn.innerHTML = `<i class="lucide-icon text-sm text-green-500" data-lucide="circle-check"></i> REMOVE OFFLINE CACHE`;
          downloadBtn.classList.add('border-green-500/30', 'bg-green-500/5', 'text-green-600', 'dark:text-green-400');
        } else {
          downloadBtn.innerHTML = `<i class="lucide-icon text-sm" data-lucide="download"></i> DOWNLOAD OFFLINE`;
          downloadBtn.classList.remove('border-green-500/30', 'bg-green-500/5', 'text-green-600', 'dark:text-green-400');
        }
      }
    };
    
    updateDownloadButtonText(isDownloaded);

    if (downloadBtn) {
      downloadBtn.onclick = async () => {
        if (isDownloaded) {
          // Delete cache from IndexedDB
          if (window.LuminaDB) {
            try {
              await window.LuminaDB.deleteFile(fileId);
              book.isDownloaded = false;
              book.localBlobKey = "";
              if (book.pdfs && book.pdfs[0]) book.pdfs[0].fileId = "";
              await window.LuminaDB.saveBook(book);
              
              isDownloaded = false;
              updateDownloadButtonText(false);
              updateDetailsDownloadBadge(false);
              if (window.showTemporaryToast) window.showTemporaryToast("Offline cached PDF removed successfully.");
            } catch (err) {
              console.error("Cache removing index error:", err);
            }
          }
        } else {
          // Download / cache process
          const progressContainer = document.getElementById('details-download-progress-container');
          const progressFill = document.getElementById('details-download-progress-fill');
          const pctText = document.getElementById('details-download-pct-txt');
          const statusText = document.getElementById('details-download-status-txt');
          
          if (progressContainer) progressContainer.classList.remove('hidden');
          if (progressFill) progressFill.style.width = '0%';
          if (pctText) pctText.textContent = '0%';
          if (statusText) statusText.textContent = 'Connecting to proxy network...';

          try {
            await downloadPDFToCache(book, (percent) => {
              if (progressFill) progressFill.style.width = `${percent}%`;
              if (pctText) pctText.textContent = `${percent}%`;
              if (statusText) {
                if (percent < 30) statusText.textContent = 'Authorizing PDF handshakes...';
                else if (percent < 75) statusText.textContent = 'Retrieving metadata parts...';
                else if (percent < 95) statusText.textContent = 'Compiling cache records...';
                else statusText.textContent = 'Saving locally to browser IndexedDB!';
              }
            });

            isDownloaded = true;
            updateDownloadButtonText(true);
            updateDetailsDownloadBadge(true);
            if (window.showTemporaryToast) window.showTemporaryToast("Book compiled and saved 100% offline!");
            
            // Hide progress container after short timeout
            setTimeout(() => {
              if (progressContainer) progressContainer.classList.add('hidden');
            }, 1500);
          } catch (err) {
            console.error("Offline download failed:", err);
            if (statusText) statusText.textContent = `Error: ${err.message || 'Verification failed'}`;
            if (window.showTemporaryToast) window.showTemporaryToast("Proxy handshakes failed. Please check network.");
          }
        }
      };
    }

    // Bind Action: AI SCHOLAR SUMMARY (Real-time Gemini compilation)
    const summaryBtn = document.getElementById('details-ai-summary-btn');
    const summaryBox = document.getElementById('details-ai-summary-box');
    const summaryContent = document.getElementById('details-ai-summary-content');
    const summaryClose = document.getElementById('details-ai-summary-close');

    if (summaryClose) {
      summaryClose.onclick = () => {
        if (summaryBox) summaryBox.classList.add('hidden');
      };
    }

    if (summaryBtn) {
      summaryBtn.onclick = async () => {
        if (summaryBox) summaryBox.classList.remove('hidden');
        if (summaryContent) {
          summaryContent.innerHTML = `
            <div class="flex items-center gap-2 py-3 text-amber-800 dark:text-[#FBBF24]">
              <i class="lucide-icon text-sm animate-spin" data-lucide="refresh-ccw"></i>
              <span class="font-mono text-[10px] tracking-wider uppercase">Vedas Scholar companion compiles cosmic summary...</span>
            </div>`;
        }

        try {
          const res = await fetch('/api/book-ai-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: book.name || book.title,
              author: book.author,
              category: book.category,
              description: book.description || ''
            })
          });

          if (!res.ok) {
            throw new Error(`Failed to consult AI. Status ${res.status}`);
          }

          const data = await res.json();
          const summaryMarkdown = data.summaryText || "No response got from deep research companion.";
          
          // Render summary nicely
          if (summaryContent) {
            const htmlText = summaryMarkdown
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="text-[#A67C52] font-semibold">$1</em>')
              .replace(/#+\s+(.*)/g, '<h4 class="font-bold text-xs text-primary dark:text-[#E4E2DD] mt-3 uppercase tracking-wider">$1</h4>')
              .replace(/^\-\s+(.*)/gm, '<li class="ml-4 list-disc mt-1">$1</li>')
              .replace(/\n\n/g, '<p class="mt-2.5"></p>');
            
            summaryContent.innerHTML = `<div class="font-body-reading leading-relaxed space-y-2 text-[#1E1E1E]/80 dark:text-neutral-200">${htmlText}</div>`;
          }
        } catch (err) {
          console.error("AI summarization client failed:", err);
          if (summaryContent) {
            summaryContent.innerHTML = `<div class="text-xs text-red-500 font-bold p-2 bg-red-500/5 rounded-xl">Philosophical network error: ${err.message || 'Gemini system rate limits hit.'}</div>`;
          }
        }
      };
    }

    // Hide summary box on initial screen load of a different book
    if (summaryBox) summaryBox.classList.add('hidden');

    // Render Book-specific PKM Knowledge Hub dynamically
    if (window.LuminaHighlights && window.LuminaHighlights.renderBookKnowledgeHub) {
      window.LuminaHighlights.renderBookKnowledgeHub(book);
    }

    showView('book_details');
  }

  function updateDetailsDownloadBadge(downloaded) {
    const badge = document.getElementById('details-offline-badge');
    if (badge) {
      if (downloaded) {
        badge.className = "px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400 text-xs font-semibold select-none flex items-center gap-2";
        badge.innerHTML = `<i class="lucide-icon text-[14px]" data-lucide="circle-check"></i><span>✓ Cached Offline</span>`;
      } else {
        badge.className = "px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-800 text-neutral-400 text-xs font-semibold select-none flex items-center gap-2";
        badge.innerHTML = `<i class="lucide-icon text-[14px]" data-lucide="cloud"></i><span>☁ Available Online</span>`;
      }
    }
  }

  async function downloadPDFToCache(book, onProgress) {
    const url = book.pdfs?.[0]?.url || book.sourceUrl;
    if (!url) throw new Error("No source URL for PDF download");

    const fileId = book.pdfs?.[0]?.fileId || book.localBlobKey || `cached_file_${window.LuminaLibrary.bookId(book)}`;
    
    onProgress(10);

    const targetUrl = `/api/proxy-pdf?url=${encodeURIComponent(url)}`;
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF. Status: ${response.status}`);
    }

    onProgress(25);

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    let loaded = 0;
    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (total > 0) {
        const pct = Math.floor((loaded / total) * 65) + 25;
        onProgress(pct);
      }
    }

    const blob = new Blob(chunks, { type: 'application/pdf' });
    
    if (window.LuminaDB) {
      await window.LuminaDB.saveFile(fileId, blob);
    }

    book.isDownloaded = true;
    book.localBlobKey = fileId;
    if (book.pdfs && book.pdfs[0]) {
      book.pdfs[0].fileId = fileId;
    }

    if (window.LuminaDB) {
      await window.LuminaDB.saveBook(book);
    }
    
    const matchingBook = window.LuminaLibrary?.getAllBooks()?.find(b => {
      return window.LuminaLibrary.bookId(b) === window.LuminaLibrary.bookId(book);
    });
    if (matchingBook) {
      matchingBook.isDownloaded = true;
      matchingBook.localBlobKey = fileId;
      if (matchingBook.pdfs && matchingBook.pdfs[0]) matchingBook.pdfs[0].fileId = fileId;
    }

    onProgress(100);
    return blob;
  }

  function handleUrlRoute() {
    let slug = '';
    
    // Check hash first e.g. #/reader/susruta-samhita
    if (window.location.hash.startsWith('#/reader/')) {
      slug = window.location.hash.substring(9);
    } else if (window.location.hash.startsWith('#reader/')) {
      slug = window.location.hash.substring(8);
    }

    if (slug) {
      const book = window.LuminaLibrary?.getAllBooks()?.find(b => {
        const bid = window.LuminaLibrary.bookId(b);
        return bid === slug || b.id === slug;
      });
      if (book) {
        openBookDetailsPage(book);
        return true;
      }
    }
    return false;
  }

  // Public API
  window.LuminaApp = {
    showView,
    openBook: (book, pdfIndex) => window.LuminaLibrary?.openBook(book, pdfIndex),
    openBookReader,
    showPartPicker,
    openBookDetailsPage,
  };

  // Init
  function init() {
    if (window.LuminaLibrary) {
      window.LuminaLibrary.init().then(() => {
        // Run routing check immediately after database & library files are fully populated
        handleUrlRoute();
      });
    } else {
      bindAllScrolls();
      showView('home');
    }

    bindAllScrolls();

    // Register global event routing handshakes
    window.addEventListener('popstate', () => {
      if (!handleUrlRoute()) {
        if (currentView === 'book_details' || currentView === 'reader') {
          showView('library');
        }
      }
    });
    window.addEventListener('hashchange', () => {
      if (!handleUrlRoute()) {
        if (currentView === 'book_details' || currentView === 'reader') {
          showView('library');
        }
      }
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
