import { esc, url, content, fmtAddress, safeJson } from '../lib.mjs';
import { icons } from './icons.mjs';
import { img } from './image.mjs';
import { hoursList, mapsDir } from './layout.mjs';
import { imageSize } from '../imgsize.mjs';
import { join } from 'node:path';
import { ROOT } from '../lib.mjs';

const { site, hours, events, gallery } = content;

export const lozenge = '<div class="lozenge-band" aria-hidden="true"></div>';

export function statusChip() {
  return `<p class="status" data-open-status><span class="dot" aria-hidden="true"></span><span data-open-text>See opening hours below</span></p>
<script type="application/json" id="hours-data">${safeJson(hours)}</script>`;
}

export function specials({ dark = true } = {}) {
  return `<section class="section specials ${dark ? 'on-dark timber' : ''}" id="whats-on" aria-labelledby="whats-on-h">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">Every week</p><h2 id="whats-on-h">${esc(events.heading)}</h2></div>
    <ul class="special-grid">
      ${events.items.map((e) => `<li class="special reveal" data-day="${e.dayIndex}"><span class="special-day">${esc(e.day)}<span class="today-tag" hidden>Today</span></span><span class="special-title">${esc(e.title)}</span><span class="special-price">${esc(e.price)}</span></li>`).join('')}
    </ul>
  </div>
</section>`;
}

/** Gallery entries are either optimised built-ins ({slug,widths,w,h}) or CMS uploads ({image}). */
function resolve(g) {
  if (g.slug) return { href: url(`img/${g.slug}-${g.widths[g.widths.length - 1]}.webp`), html: (sizes) => img({ slug: g.slug, widths: g.widths, w: g.w, h: g.h, alt: g.alt, sizes }) };
  const rel = String(g.image || '').replace(/^\//, '');
  const dim = imageSize(join(ROOT, 'public', rel)) || { w: 1200, h: 800 };
  return { href: url(rel), html: () => `<img src="${url(rel)}" width="${dim.w}" height="${dim.h}" alt="${esc(g.alt)}" loading="lazy" decoding="async">` };
}

export function galleryGrid(list, { sizes = '(min-width: 900px) 33vw, 50vw' } = {}) {
  return `<ul class="gallery-grid" data-gallery>
  ${list.filter((g) => g.slug || g.image).map((g) => { const r = resolve(g); return `<li class="g-item reveal"><a href="${r.href}" data-lightbox data-caption="${esc(g.caption || '')}" data-alt="${esc(g.alt)}" aria-label="Open photo: ${esc(g.caption || g.alt)}">${r.html(sizes)}</a></li>`; }).join('\n')}
</ul>`;
}

export function visitBlock({ withMap = true } = {}) {
  const q = encodeURIComponent(`${site.name} ${fmtAddress(site.address)}`);
  return `<section class="section visit" id="find-us" aria-labelledby="find-h">
  <div class="wrap visit-grid">
    <div class="visit-info reveal">
      <p class="eyebrow">Find us</p>
      <h2 id="find-h">Come along Gerrale Street</h2>
      <address class="big-addr">${esc(site.address.line1)}<br>${esc(site.address.suburb)} ${esc(site.address.state)} ${esc(site.address.postcode)}</address>
      <h3 class="mini-h">${icons.clock}Opening hours</h3>
      ${hoursList()}
      ${statusChip()}
      <p class="visit-cta-text">${esc(site.visitCta)}</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="tel:${site.phoneIntl}">${icons.phone}Call ${esc(site.phone)}</a>
        <a class="btn btn-outline" href="${mapsDir}" target="_blank" rel="noopener">${icons.pin}Get directions</a>
      </div>
      <p class="small">${esc(site.bookingNote)}</p>
    </div>
    ${withMap ? `<div class="map-card reveal">
      <div class="map-frame" data-map data-src="https://www.google.com/maps?q=${q}&amp;ll=${site.geo.lat},${site.geo.lng}&amp;z=16&amp;output=embed">
        <div class="map-poster">
          <span class="map-pin">${icons.pin}</span>
          <p><strong>${esc(site.address.line1)}</strong><br>${esc(site.address.suburb)} ${esc(site.address.state)} ${esc(site.address.postcode)}</p>
          <button type="button" class="btn btn-primary btn-small" data-map-load>Load interactive map</button>
          <a class="map-fallback" href="${site.social.googleMaps}" target="_blank" rel="noopener">Open in Google Maps</a>
        </div>
      </div>
    </div>` : ''}
  </div>
</section>`;
}
