const fs = require('fs');

const mapping = {
  'light_mode': 'sun',
  'dark_mode': 'moon',
  'menu_book': 'book-open',
  'search': 'search',
  'local_fire_department': 'flame',
  'auto_stories': 'library',
  'format_quote': 'quote',
  'autorenew': 'refresh-cw',
  'bookmark': 'bookmark',
  'share': 'share-2',
  'add': 'plus',
  'play_arrow': 'play',
  'auto_awesome': 'sparkles',
  'spa': 'leaf',
  'history_edu': 'feather',
  'explore': 'compass',
  'arrow_back': 'arrow-left',
  'arrow_forward': 'arrow-right',
  'search_off': 'search-x',
  'settings': 'settings',
  'sync': 'refresh-ccw',
  'picture_as_pdf': 'file-text',
  'expand_more': 'chevron-down',
  'markdown': 'file-code',
  'article': 'file-text',
  'cloud_download': 'cloud-download',
  'cloud_upload': 'cloud-upload',
  'star': 'star',
  'refresh': 'refresh-cw',
  'edit_note': 'edit-3',
  'content_copy': 'copy',
  'close': 'x',
  'add_circle': 'plus-circle',
  'self_improvement': 'user',
  'timeline': 'activity',
  'chat': 'message-circle',
  'diversity_1': 'users',
  'send': 'send',
  'edit': 'edit-2',
  'verified': 'badge-check',
  'card_membership': 'credit-card',
  'chevron_right': 'chevron-right',
  'potted_plant': 'flower-2',
  'notifications_active': 'bell-ring',
  'manage_accounts': 'user-cog',
  'verified_user': 'shield-check',
  'emoji_events': 'trophy',
  'account_balance': 'landmark',
  'chevron_left': 'chevron-left',
  'volume_up': 'volume-2',
  'palette': 'palette',
  'link': 'link',
  'download_for_offline': 'download',
  'cloud': 'cloud',
  'info': 'info',
  'download': 'download',
  'sparkles': 'sparkles',
  'hub': 'network',
  'add_box': 'plus-square',
  'description': 'file-text',
  'library_books': 'library',
  'psychology': 'brain',
  'schema': 'workflow',
  'quiz': 'help-circle',
  'schedule': 'clock',
  'border_color': 'pen-tool',
  'lightbulb': 'lightbulb',
  'folder_open': 'folder-open',
  'touch_app': 'pointer',
  'check': 'check',
  'help': 'help-circle',
  'summarize': 'file-text',
  'translate': 'languages',
  'emoji_objects': 'lightbulb',
  'open_in_new': 'external-link',
  'home_app_logo': 'home',
  'account_tree': 'list-tree',
  'person': 'user',
  'hour_glass': 'hourglass',
  'radio_button_unchecked': 'circle',
  'check_box': 'check-square',
  'title': 'type',
  'grid_on': 'grid',
  'campaign': 'megaphone',
  'attach_file': 'paperclip',
  'image': 'image',
  'notifications': 'bell',
  'menu': 'menu'
};

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/<span class=\\?\"([^\"]*?)material-symbols-outlined([^\"]*?)\\?\"[^>]*>(.*?)<\/span>/g, (match, before, after, iconText) => {
    const t = iconText.trim();
    if (!t) {
        // sometimes icon is in data-icon or just empty, let's extract data-icon if present
        const dataIconMatch = match.match(/data-icon=\\?\"([^\"]+)\\?\"/);
        if (dataIconMatch) {
            const iconName = dataIconMatch[1];
            const lucideIcon = mapping[iconName] || iconName.replace(/_/g, '-');
            return `<i class="${before}lucide-icon${after}" data-lucide="${lucideIcon}"></i>`;
        }
        return match;
    }
    const lucideIcon = mapping[t] || t.replace(/_/g, '-');
    return `<i class="${before}lucide-icon${after}" data-lucide="${lucideIcon}"></i>`;
  });

  if (filePath === 'index.html') {
    // Remove Material Symbols stylesheet
    html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined[^>]*>/, '');

    // Add Lucide script if not present
    if (!html.includes('unpkg.com/lucide')) {
      html = html.replace('</head>', '  <script src="https://unpkg.com/lucide@latest"></script>\n</head>');
    }

    // Add lucide.createIcons() call at the end of body
    if (!html.includes('lucide.createIcons()')) {
      html = html.replace('</body>', '  <script>\n    if (typeof lucide !== "undefined") { lucide.createIcons(); }\n    const observer = new MutationObserver((mutations) => {\n      lucide.createIcons();\n    });\n    observer.observe(document.body, { childList: true, subtree: true });\n  </script>\n</body>');
    }
  }

  fs.writeFileSync(filePath, html);
  console.log('Done with ' + filePath);
}

processFile('index.html');
['app.js', 'db.js', 'highlights.js', 'library.js', 'timeline-journey.js', 'vault.js', 'vedpuran-data.js', 'wisdom.js'].forEach(f => {
  processFile('public/js/' + f);
});
