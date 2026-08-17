const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Home Collections
html = html.replace(
  /<div id="home-collections-list" class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2 select-none">/g,
  '<div id="home-collections-list" class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar select-none cursor-grab">'
);

// Home Featured
html = html.replace(
  /<div id="home-featured" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 select-none"><\/div>/g,
  '<div id="home-featured" class="flex gap-6 overflow-x-auto pb-4 custom-scrollbar select-none cursor-grab"></div>'
);

// Mood Filters
html = html.replace(
  /<div id="mood-filters" class="flex flex-wrap gap-3 pb-2 select-none">/g,
  '<div id="mood-filters" class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar select-none cursor-grab">'
);

// Thinkers track
html = html.replace(
  /<div id="thinkers-track" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 py-2 max-w-7xl">/g,
  '<div id="thinkers-track" class="flex gap-6 overflow-x-auto no-scrollbar py-2 max-w-7xl">'
);

// Library recommendations
html = html.replace(
  /<div id="library-recommendations" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-2">/g,
  '<div id="library-recommendations" class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-2">'
);

// Library recently added
html = html.replace(
  /<div id="library-recently-added" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-2">/g,
  '<div id="library-recently-added" class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-2">'
);

fs.writeFileSync('index.html', html);
console.log('Restored scroll layout.');
