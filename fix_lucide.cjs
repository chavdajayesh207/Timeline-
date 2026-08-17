const fs = require('fs');

const replacements = [
  { f: 'public/js/library.js', from: 'data-lucide="stars"', to: 'data-lucide="sparkles"' },
  { f: 'public/js/library.js', from: 'data-lucide="done"', to: 'data-lucide="check"' },
  { f: 'public/js/library.js', from: 'data-lucide="error"', to: 'data-lucide="x-circle"' },
  { f: 'public/js/highlights.js', from: 'data-lucide="error"', to: 'data-lucide="x-circle"' },
  { f: 'public/js/highlights.js', from: 'data-lucide="ios-share"', to: 'data-lucide="share"' },
  { f: 'public/js/highlights.js', from: 'data-lucide="push-pin"', to: 'data-lucide="pin"' },
  { f: 'public/js/highlights.js', from: 'data-lucide="offline-pin"', to: 'data-lucide="check-circle"' },
  { f: 'public/js/wisdom.js', from: 'data-lucide="cyclone"', to: 'data-lucide="loader"' },
  { f: 'public/js/timeline-journey.js', from: 'data-lucide="volume-off"', to: 'data-lucide="volume-x"' },
];

replacements.forEach(r => {
  let content = fs.readFileSync(r.f, 'utf8');
  content = content.split(r.from).join(r.to);
  fs.writeFileSync(r.f, content);
});

console.log('Replacements done');
