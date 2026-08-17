const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Home Collections
html = html.replace(
  /<div id="home-collections-list" class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar select-none cursor-grab">/g,
  '<div id="home-collections-list" class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2 select-none">'
);

// Home Featured (Recent Notes / Wisdom)
html = html.replace(
  /<div id="home-featured" class="flex gap-6 overflow-x-auto pb-4 custom-scrollbar select-none cursor-grab"><\/div>/g,
  '<div id="home-featured" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 select-none"></div>'
);

// Mood Filters
html = html.replace(
  /<div id="mood-filters" class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar select-none cursor-grab">/g,
  '<div id="mood-filters" class="flex flex-wrap gap-3 pb-2 select-none">'
);

fs.writeFileSync('index.html', html);
console.log('Fixed home view to scroll vertically.');
