// Jest setup file to ensure database directory exists
const fs = require('fs');
const path = require('path');

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
