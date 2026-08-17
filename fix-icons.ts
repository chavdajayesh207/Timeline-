import fs from 'fs';

const files = ['index.html', 'public/js/app.js', 'public/js/highlights.js', 'public/js/library.js', 'public/js/timeline-journey.js', 'public/js/wisdom.js', 'public/js/vault.js'];

const replacements = [
  { from: /data-lucide="line-chart"/g, to: 'data-lucide="chart-line"' },
  { from: /data-lucide="plus-circle"/g, to: 'data-lucide="circle-plus"' },
  { from: /data-lucide="plus-square"/g, to: 'data-lucide="square-plus"' },
  { from: /data-lucide="help-circle"/g, to: 'data-lucide="circle-help"' },
  { from: /data-lucide="edit-3"/g, to: 'data-lucide="pen-line"' },
  { from: /data-lucide="home"/g, to: 'data-lucide="house"' },
  { from: /data-lucide="check-square"/g, to: 'data-lucide="square-check"' },
  { from: /data-lucide="grid"/g, to: 'data-lucide="layout-grid"' },
  { from: /data-lucide="check-circle"/g, to: 'data-lucide="circle-check"' },
  { from: /data-lucide="file-present"/g, to: 'data-lucide="file"' },
  { from: /data-lucide="x-circle"/g, to: 'data-lucide="circle-x"' },
  { from: /data-lucide="stars"/g, to: 'data-lucide="sparkles"' },
  { from: /data-lucide="edit-2"/g, to: 'data-lucide="pen"' },
  { from: /data-lucide="edit"/g, to: 'data-lucide="pen"' },
  { from: /data-lucide="trash-2"/g, to: 'data-lucide="trash-2"' },
  { from: /data-lucide="globe-2"/g, to: 'data-lucide="globe"' }
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
