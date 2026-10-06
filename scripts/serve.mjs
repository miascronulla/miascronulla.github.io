// Tiny static file server for local preview: npm run dev  (http://localhost:4173)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
const root = new URL('../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
createServer(async (req, res) => {
  let p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try { if ((await stat(p)).isDirectory()) p = join(p, 'index.html'); } catch {}
  try { const d = await readFile(p); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(d); }
  catch { res.writeHead(404, { 'content-type': 'text/html' }); res.end(await readFile(join(root, '404.html')).catch(() => 'Not found')); }
}).listen(+(process.env.PORT || 4173), () => console.log('http://localhost:' + (process.env.PORT || 4173)));
