const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/group-hover:scale-110/g, 'group-hover:scale-110 hover:rotate-2');
fs.writeFileSync('index.html', html);
