import { icons } from 'lucide-react';
import fs from 'fs';
const files = ['index.html', 'public/js/app.js', 'public/js/highlights.js', 'public/js/library.js', 'public/js/timeline-journey.js', 'public/js/wisdom.js', 'public/js/vault.js'];
let matches = new Set<string>();
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/data-lucide=[\"']([^\"']+)[\"']/g)) {
    matches.add(match[1]);
  }
}
const missing: string[] = [];
for (const icon of matches) {
  // convert dash-case to PascalCase
  const pascalName = icon.replace(/(^\w|-\w)/g, (clearAndUpper) => clearAndUpper.replace(/-/, "").toUpperCase());
  if (!(icons as any)[pascalName] && !['${iconName}', '${lucideIcon}', '${typeIcon}'].includes(icon)) {
    missing.push(icon);
  }
}
console.log('Missing:', missing.join(', '));
