#!/usr/bin/env node
// Zero-dependency static site builder.
//   node build.mjs            -> ./dist
//   BASE_PATH=/repo/ node build.mjs   (GitHub Pages project site)
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, BASE, LOCAL, ROOT_TOKEN, absUrl, content, url } from './src/lib.mjs';
import { home, menuPage, galleryPage, visitPage, notFound } from './src/pages.mjs';

const OUT = join(ROOT, LOCAL ? 'dist-local' : 'dist');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// In --local mode every link is made relative ("../" per folder level) and folder links point at index.html,
// so the site works when opened straight from disk (file://).
const localise = (p, data) => {
  const up = '../'.repeat(p.split('/').length - 1);
  return data.replace(/@@ROOT@@\/([^"'#\s)]*)/g, (_, path) => up + ((path === '' || path.endsWith('/')) ? path + 'index.html' : path));
};
const write = (p, data) => { if (LOCAL && /\.(html|webmanifest)$/.test(p)) data = localise(p, data); const f = join(OUT, p); mkdirSync(join(f, '..'), { recursive: true }); writeFileSync(f, data); };

// Pages
write('index.html', home());
write('menu/index.html', menuPage());
write('gallery/index.html', galleryPage());
write('visit/index.html', visitPage());
write('404.html', notFound());

// Static assets
cpSync(join(ROOT, 'public'), OUT, { recursive: true });
mkdirSync(join(OUT, 'assets'), { recursive: true });
const css = readFileSync(join(ROOT, 'src/styles/main.css'), 'utf8').replace(/url\(\/fonts\//g, `url(${LOCAL ? '../' : BASE}fonts/`);
write('assets/main.css', css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '\n'));
cpSync(join(ROOT, 'src/scripts/main.js'), join(OUT, 'assets/main.js'));

// SEO files
const pages = ['', 'menu/', 'gallery/', 'visit/'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${absUrl(p)}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${absUrl('sitemap.xml')}\n`);
write('manifest.webmanifest', JSON.stringify({ name: content.site.name, short_name: content.site.shortName, start_url: BASE, display: 'standalone', background_color: '#1d3a2f', theme_color: '#1d3a2f', icons: [{ src: url('img/icon-192.png'), sizes: '192x192', type: 'image/png' }, { src: url('img/icon-512.png'), sizes: '512x512', type: 'image/png' }] }));
if (existsSync(join(ROOT, 'CNAME'))) cpSync(join(ROOT, 'CNAME'), join(OUT, 'CNAME'));
console.log(`Built to ${OUT} (base ${BASE})`);
