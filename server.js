const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.mp4':  'video/mp4',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  let filePath = '.' + decodeURIComponent(req.url.split('?')[0]);
  if (filePath === './') filePath = './index.html';

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('404 - ' + filePath);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });

}).listen(PORT, () => {
  console.log('Serveur sur http://localhost:' + PORT);
});
