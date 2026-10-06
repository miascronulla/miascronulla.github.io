// Validates everything editable in /content so a bad CMS edit can never break (or poison) the live site.
// Runs automatically before every build and in CI:  node scripts/validate-content.mjs
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const errors = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const load = (f) => { try { return JSON.parse(readFileSync(join(root, 'content', f), 'utf8')); } catch (e) { err(f, `invalid JSON – ${e.message}`); return null; } };
const PRICE = /^\$\d{1,4}(\.\d{2})?$/;
const httpsOnly = (f, k, v) => { if (v && !/^https:\/\//.test(v)) err(f, `${k} must start with https:// (got "${v}")`); };
const str = (f, k, v) => { if (typeof v !== 'string' || !v.trim()) err(f, `${k} is required`); };

const site = load('site.json');
if (site) {
  ['name', 'url', 'phone', 'phoneIntl', 'email'].forEach((k) => str('site.json', k, site[k]));
  if (!/^\+\d{8,15}$/.test(site.phoneIntl || '')) err('site.json', 'phoneIntl must look like +61400004073');
  if (!/^\S+@\S+\.\S+$/.test(site.email || '')) err('site.json', 'email is not valid');
  httpsOnly('site.json', 'url', site.url);
  Object.entries(site.social || {}).forEach(([k, v]) => httpsOnly('site.json', `social.${k}`, v));
  httpsOnly('site.json', 'formEndpoint', site.formEndpoint);
  if (typeof site.geo?.lat !== 'number' || typeof site.geo?.lng !== 'number') err('site.json', 'geo.lat / geo.lng must be numbers');
}

const hours = load('hours.json');
if (hours) {
  if (!Array.isArray(hours.groups) || !hours.groups.length) err('hours.json', 'groups is required');
  (hours.groups || []).forEach((g, i) => {
    const w = `hours.json groups[${i}]`;
    str(w, 'label', g.label);
    if (!Array.isArray(g.days) || g.days.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) err(w, 'days must be numbers 0 (Sunday) to 6 (Saturday)');
    if (!g.closed) ['open', 'close'].forEach((k) => { if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(g[k] || '')) err(w, `${k} must be 24-hour HH:MM (e.g. 17:00)`); });
    if (!g.closed && g.open && g.close && g.open >= g.close) err(w, 'close must be later than open (overnight hours are not supported)');
  });
}

const events = load('events.json');
if (events) (events.items || []).forEach((e, i) => {
  const w = `events.json items[${i}]`;
  str(w, 'day', e.day); str(w, 'title', e.title); str(w, 'price', e.price);
  if (!Number.isInteger(e.dayIndex) || e.dayIndex < 0 || e.dayIndex > 6) err(w, 'dayIndex must be 0–6');
});

const promo = load('promotions.json');
if (promo?.banner?.active && !promo.banner.text) err('promotions.json', 'banner is switched on but has no text');

const gallery = load('gallery.json');
if (gallery) (gallery.images || []).forEach((g, i) => {
  const w = `gallery.json images[${i}]`;
  if (!g.slug && !g.image) err(w, 'needs a built-in photo name or an uploaded photo');
  str(w, 'alt', g.alt);
  if (g.image && !existsSync(join(root, 'public', String(g.image).replace(/^\//, '')))) err(w, `uploaded file not found: ${g.image}`);
  if (g.image && !/^\/?img\/uploads\/[\w.\-]+\.(jpe?g|png|webp)$/i.test(g.image)) err(w, 'uploads must be JPG, PNG or WebP inside img/uploads');
  if (g.slug && !existsSync(join(root, 'public', 'img', `${g.slug}-${(g.widths || [])[0]}.webp`))) err(w, `built-in photo "${g.slug}" not found`);
});

for (const f of ['menu/food.json', 'menu/drinks.json']) {
  const m = load(f); if (!m) continue;
  const ids = new Set();
  (m.categories || []).forEach((c, ci) => {
    const w = `${f} category "${c.title || ci}"`;
    str(w, 'title', c.title);
    if (!/^[a-z0-9-]+$/.test(c.id || '')) err(w, 'id must be lowercase letters, numbers and hyphens');
    if (ids.has(c.id)) err(w, `duplicate id "${c.id}"`); ids.add(c.id);
    (c.sizes || []).forEach((s) => { if (!PRICE.test(s.price || '')) err(w, `size price "${s.price}" must look like $12 or $12.50`); });
    [...(c.items || []), ...(c.afterItems || [])].forEach((it) => {
      const iw = `${w} › "${it.name || '?'}"`;
      str(iw, 'name', it.name);
      if (it.price && !PRICE.test(it.price)) err(iw, `price "${it.price}" must look like $24.90 (dollar sign, digits, optional .00)`);
      (it.sizes || []).forEach((s) => { if (!PRICE.test(s.price || '')) err(iw, `size price "${s.price}" must look like $24.90`); });
      (it.tags || []).forEach((t) => { if (!['V', 'GF', 'GFO'].includes(t)) err(iw, `unknown dietary tag "${t}" (use V, GF or GFO)`); });
    });
  });
}

if (errors.length) { console.error('\n✖ Content problems found – fix these and publish again:\n  • ' + errors.join('\n  • ') + '\n'); process.exit(1); }
console.log('✔ Content validated');
