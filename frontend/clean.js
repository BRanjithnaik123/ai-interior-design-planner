const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '.next');

if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('Successfully cleared .next cache');
} else {
  console.log('No .next cache to clear');
}
