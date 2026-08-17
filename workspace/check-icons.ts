import fs from 'fs';
const files = ['index.html', 'public/js/app.js', 'public/js/highlights.js', 'public/js/library.js', 'public/js/timeline-journey.js', 'public/js/wisdom.js', 'public/js/vault.js'];
let matches = new Set();
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/data-lucide=[\"']([^\"']+)[\"']/g)) {
    matches.add(match[1]);
  }
}
console.log(Array.from(matches).join(', '));
