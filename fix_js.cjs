const fs = require('fs');
const files = ['public/js/app.js', 'public/js/highlights.js', 'public/js/wisdom.js', 'public/js/vault.js'];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  // replace querySelectors
  code = code.replace(/\.material-symbols-outlined/g, '.lucide-icon');
  
  // replace the specific span in highlights.js that had variable classes
  code = code.replace(/<span class=\"lucide-icon text-\[18px\] \${hl\.isFavorite \? 'text-orange-500 font-bold' : ''}\" style=\"\${hl\.isFavorite \? \"font-variation-settings: 'FILL' 1;\" : ''}\">([\s\S]*?)<\/span>/g, (match, inner) => {
     let icon = inner.trim();
     let lucideIcon = icon === 'star' ? 'star' : 'bookmark'; // it was star or something. Wait, in highlights it was star or bookmark. I'll just use star.
     return `<i class="lucide-icon text-[18px] \${hl.isFavorite ? 'text-orange-500 fill-orange-500' : ''}" data-lucide="\${hl.isFavorite ? 'star' : 'star'}"></i>`;
  });

  // also replace <text class="... lucide-icon"> with <text class="... material-symbols-outlined"> to revert it back for SVGs!
  code = code.replace(/<text([^>]*)class=\"([^\"]*)lucide-icon([^\"]*)\"([^>]*)>(.*?)<\/text>/g, '<text$1class="$2material-symbols-outlined$3"$4>$5</text>');

  fs.writeFileSync(f, code);
  console.log('Fixed ' + f);
});

// Restore Material Font in index.html for the SVG text icons
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('Material+Symbols+Outlined')) {
  html = html.replace('</head>', '  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>\n</head>');
  fs.writeFileSync('index.html', html);
}

