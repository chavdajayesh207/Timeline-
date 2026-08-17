const fs = require('fs');

let js = fs.readFileSync('public/js/timeline-journey.js', 'utf8');

js = js.replace('iconSpan.textContent = event.icon;', 'iconSpan.innerHTML = event.icon;');

const emojiMap = {
  '🌍': '<i class="lucide-icon text-sm" data-lucide="globe"></i>',
  '🔥': '<i class="lucide-icon text-sm" data-lucide="flame"></i>',
  '🌸': '<i class="lucide-icon text-sm" data-lucide="flower-2"></i>',
  '🏛️': '<i class="lucide-icon text-sm" data-lucide="landmark"></i>',
  '🏛': '<i class="lucide-icon text-sm" data-lucide="landmark"></i>',
  '⚖️': '<i class="lucide-icon text-sm" data-lucide="scale"></i>',
  '⚔️': '<i class="lucide-icon text-sm" data-lucide="swords"></i>',
  '👑': '<i class="lucide-icon text-sm" data-lucide="crown"></i>',
  '📜': '<i class="lucide-icon text-sm" data-lucide="scroll-text"></i>',
  '🧬': '<i class="lucide-icon text-sm" data-lucide="dna"></i>',
  '🔭': '<i class="lucide-icon text-sm" data-lucide="telescope"></i>',
  '🍎': '<i class="lucide-icon text-sm" data-lucide="apple"></i>',
  '⚙️': '<i class="lucide-icon text-sm" data-lucide="settings"></i>',
  '💡': '<i class="lucide-icon text-sm" data-lucide="lightbulb"></i>',
  '💻': '<i class="lucide-icon text-sm" data-lucide="laptop"></i>',
  '🌐': '<i class="lucide-icon text-sm" data-lucide="globe-2"></i>',
  '🧠': '<i class="lucide-icon text-sm" data-lucide="brain"></i>',
  '⚡️': '<i class="lucide-icon text-sm" data-lucide="zap"></i>',
  '🌱': '<i class="lucide-icon text-sm" data-lucide="leaf"></i>',
  '🌌': '<i class="lucide-icon text-sm" data-lucide="stars"></i>',
  '🛡️': '<i class="lucide-icon text-sm" data-lucide="shield"></i>',
  '📿': '<i class="lucide-icon text-sm" data-lucide="activity"></i>',
  '✨': '<i class="lucide-icon text-sm" data-lucide="sparkles"></i>'
};

for (const [emoji, icon] of Object.entries(emojiMap)) {
  js = js.split(`"${emoji}"`).join(`\`${icon}\``);
}

fs.writeFileSync('public/js/timeline-journey.js', js);
console.log('Done fixing timeline-journey.js.');
