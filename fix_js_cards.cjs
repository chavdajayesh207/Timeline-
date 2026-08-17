const fs = require('fs');

// 1. Update public/js/vault.js
let vaultJs = fs.readFileSync('public/js/vault.js', 'utf8');
vaultJs = vaultJs.replace(
  /className = `vault-note-card.*?\`;/,
  'className = `vault-note-card premium-card cursor-pointer p-4 text-xs flex flex-col justify-between ${VaultState.activeNote && VaultState.activeNote.id === note.id ? \'ring-1 ring-[#D4AF37] border-[#D4AF37]\' : \'\'}`;'
);
fs.writeFileSync('public/js/vault.js', vaultJs);

// 2. Update public/js/library.js (Book Card)
let libraryJs = fs.readFileSync('public/js/library.js', 'utf8');
libraryJs = libraryJs.replace(
  /<div class="group relative flex flex-col cursor-pointer/g,
  '<div class="group relative flex flex-col cursor-pointer book-card-item premium-card p-4'
);
fs.writeFileSync('public/js/library.js', libraryJs);

console.log('Fixed cards in js files');
