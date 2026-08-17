import fs from 'fs';

const files = ['index.html', 'public/js/app.js', 'public/js/highlights.js', 'public/js/library.js', 'public/js/timeline-journey.js', 'public/js/wisdom.js', 'public/js/vault.js'];

const replacements = [
  { from: /data-lucide="circle-help"/g, to: 'data-lucide="info"' },
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
