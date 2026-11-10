const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX_FILE = path.join(__dirname, 'public', 'index.html');

const server = http.createServer((req, res) => {
  fs.readFile(INDEX_FILE, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading splash page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Displays 3.5s Gaming Splash Screen then transitions to target URL.`);
});
