const fs = require('fs');

let js = fs.readFileSync('public/js/library.js', 'utf8');

const emojiMap = {
  '🌿': '<i class="lucide-icon text-lg mx-auto" data-lucide="leaf"></i>',
  '🎨': '<i class="lucide-icon text-lg mx-auto" data-lucide="palette"></i>',
  '💼': '<i class="lucide-icon text-lg mx-auto" data-lucide="briefcase"></i>',
  '👥': '<i class="lucide-icon text-lg mx-auto" data-lucide="users"></i>',
  '🪔': '<i class="lucide-icon text-sm" data-lucide="flame"></i>',
  '🕉': '<i class="lucide-icon text-sm" data-lucide="flower-2"></i>',
  '🏆': '<i class="lucide-icon text-sm mx-auto" data-lucide="trophy"></i>',
  '🧠': '<i class="lucide-icon text-lg mx-auto" data-lucide="brain"></i>',
  '🏛': '<i class="lucide-icon text-lg mx-auto" data-lucide="landmark"></i>',
  '👑': '<i class="lucide-icon text-lg mx-auto" data-lucide="crown"></i>',
  '☯️': '<i class="lucide-icon text-lg mx-auto" data-lucide="sun-moon"></i>',
  '🌟': '<i class="lucide-icon text-lg mx-auto" data-lucide="star"></i>',
  '🛡️': '<i class="lucide-icon text-lg mx-auto" data-lucide="shield"></i>',
  '⚛️': '<i class="lucide-icon text-lg mx-auto" data-lucide="atom"></i>',
  '⚕️': '<i class="lucide-icon text-lg mx-auto" data-lucide="heart-pulse"></i>',
  '💰': '<i class="lucide-icon text-lg mx-auto" data-lucide="coins"></i>',
  '💡': '<i class="lucide-icon text-lg mx-auto" data-lucide="lightbulb"></i>',
  '🚀': '<i class="lucide-icon text-lg mx-auto" data-lucide="rocket"></i>'
};

for (const [emoji, icon] of Object.entries(emojiMap)) {
  js = js.split(emoji).join(icon);
}

fs.writeFileSync('public/js/library.js', js);
console.log('Done replacing emojis in library.js.');
