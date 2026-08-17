const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Thinkers track
html = html.replace(
  /<div id="thinkers-track" class="flex gap-6 overflow-x-auto no-scrollbar py-2 max-w-7xl">/g,
  '<div id="thinkers-track" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 py-2 max-w-7xl">'
);

// Library recommendations
html = html.replace(
  /<div id="library-recommendations" class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-2">/g,
  '<div id="library-recommendations" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-2">'
);

// Library recently added
html = html.replace(
  /<div id="library-recently-added" class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-2">/g,
  '<div id="library-recently-added" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-2">'
);

fs.writeFileSync('index.html', html);
console.log('Fixed library view to scroll vertically.');
