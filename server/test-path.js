const path = require('path');
const from = 'src/products/livenotes/server.ts';
const to = 'src/middleware/requestLogger.js';
const relative = path.relative(path.dirname(from), path.dirname(to));
console.log('Relative path:', relative);
console.log('Full import:', path.join(relative, path.basename(to)).replace(/\\/g, '/'));
