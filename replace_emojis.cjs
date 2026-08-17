const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const emojiMap = {
  '🏛️': '<i class="lucide-icon text-2xl" data-lucide="landmark"></i>',
  '🧘': '<i class="lucide-icon text-xl" data-lucide="flower-2"></i>',
  '🌸': '<i class="lucide-icon text-xl" data-lucide="sun"></i>',
  '📿': '<i class="lucide-icon text-xl" data-lucide="activity"></i>',
  '✨': '<i class="lucide-icon text-xl" data-lucide="sparkles"></i>',
  '🧠': '<i class="lucide-icon text-xl" data-lucide="brain"></i>',
  '👑': '<i class="lucide-icon text-xl" data-lucide="crown"></i>',
  '🕉️': '<i class="lucide-icon text-2xl" data-lucide="flower-2"></i>',
  '🛡️': '<i class="lucide-icon text-2xl" data-lucide="shield"></i>',
  '☯️': '<i class="lucide-icon text-2xl" data-lucide="sun-moon"></i>',
  '🐚': '<i class="lucide-icon text-2xl" data-lucide="shell"></i>',
  '📜': '<i class="lucide-icon text-2xl" data-lucide="scroll-text"></i>',
  '📁': '<i class="lucide-icon text-[14px]" data-lucide="folder"></i>',
  '📂': '<i class="lucide-icon text-[14px]" data-lucide="folder-open"></i>',
  '📔': '<i class="lucide-icon text-[14px]" data-lucide="book"></i>',
  '💼': '<i class="lucide-icon text-[14px]" data-lucide="briefcase"></i>',
  '📈': '<i class="lucide-icon text-[14px]" data-lucide="line-chart"></i>',
  '💻': '<i class="lucide-icon text-[14px]" data-lucide="laptop"></i>',
  '📖': '<i class="lucide-icon text-[14px]" data-lucide="book-open"></i>',
  '💡': '<i class="lucide-icon text-[14px]" data-lucide="lightbulb"></i>',
  '🌿': '<i class="lucide-icon text-[14px]" data-lucide="leaf"></i>',
  '👤': '<i class="lucide-icon text-[14px]" data-lucide="user"></i>',
  '🏛': '<i class="lucide-icon text-[15px]" data-lucide="landmark"></i>'
};

for (const [emoji, icon] of Object.entries(emojiMap)) {
  html = html.split(emoji).join(icon);
}

fs.writeFileSync('index.html', html);
console.log('Done replacing emojis.');
