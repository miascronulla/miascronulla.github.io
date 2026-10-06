// Shared helpers: escaping, URLs, content loading.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = new URL('..', import.meta.url).pathname;
export const LOCAL = process.argv.includes('--local');   // double-clickable build (file://)
export const ROOT_TOKEN = '@@ROOT@@/';
export const BASE = LOCAL ? ROOT_TOKEN : (process.env.BASE_PATH || '/').replace(/\/?$/, '/');

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Site-relative URL honouring BASE_PATH (for GitHub Pages project sites). */
export const url = (p = '') => BASE + p.replace(/^\//, '');

const read = (f) => JSON.parse(readFileSync(join(ROOT, 'content', f), 'utf8'));
export const content = {
  site: read('site.json'),
  hours: read('hours.json'),
  events: read('events.json'),
  promotions: read('promotions.json'),
  gallery: read('gallery.json'),
  food: read('menu/food.json'),
  drinks: read('menu/drinks.json'),
};

export const absUrl = (p = '') => {
  const u = (LOCAL ? '/' : BASE) + p.replace(/^\//, '');
  return content.site.url.replace(/\/$/, '') + (p ? u : u.replace(/\/$/, ''));
};
export const fmtAddress = (a) => `${a.line1}, ${a.suburb} ${a.state} ${a.postcode}`;
export const priceNum = (s) => (String(s).match(/[\d.]+/) || [''])[0];

/** "17:00" -> "5pm", "09:30" -> "9:30am" */
export const fmtTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, '0')}${ap}` : `${h12}${ap}`;
};
