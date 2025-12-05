const fs = require('fs');
const content = `DATABASE_URL="file:./dev.db"
PORT=4000`;
fs.writeFileSync('.env', content);
console.log('.env updated for SQLite');
