const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add .collection-card class to those elements
html = html.replace(/class="flex-shrink-0 w-36 aspect-\[4\/5\] bg-gradient/g, 'class="collection-card flex-shrink-0 w-36 aspect-[4/5] bg-gradient');

// Fix the icon size in the collections list
html = html.replace(/<div class="w-9 h-9 rounded-full bg-white\/10 flex items-center justify-center text-white text-lg relative z-10 transition-transform duration-300 group-hover:scale-110"><i class="lucide-icon text-2xl"/g, '<div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-lg relative z-10 transition-transform duration-300 group-hover:scale-110"><i class="lucide-icon text-lg"');

html = html.replace(/<div class="w-9 h-9 rounded-full bg-white\/10 flex items-center justify-center text-white text-lg relative z-10 transition-transform duration-300 group-hover:scale-110"><i class="lucide-icon text-xl"/g, '<div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-lg relative z-10 transition-transform duration-300 group-hover:scale-110"><i class="lucide-icon text-lg"');

fs.writeFileSync('index.html', html);
console.log('Fixed collections classes and icon sizes');
