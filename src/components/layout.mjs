import { createHash } from 'node:crypto';
import { esc, url, absUrl, content, fmtAddress, fmtTime, LOCAL, safeJson } from '../lib.mjs';
import { icons } from './icons.mjs';

const { site, hours, promotions } = content;
const BOOT = "document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('anim')";
const bootHash = createHash('sha256').update(BOOT).digest('base64');
let endpointOrigin = '';
try { endpointOrigin = site.formEndpoint ? new URL(site.formEndpoint).origin : ''; } catch {}
// Content-Security-Policy (GitHub Pages can't send headers, so it is delivered via <meta>). Skipped for the file:// build.
const CSP = [
  "default-src 'self'", `script-src 'self' 'sha256-${bootHash}'`, "style-src 'self'", "img-src 'self' data:", "font-src 'self'",
  `connect-src 'self'${endpointOrigin ? ' ' + endpointOrigin : ''}`, "frame-src https://www.google.com https://maps.google.com", "object-src 'none'", "base-uri 'none'", "form-action 'self' mailto:",
].join('; ');

const NAV = [
  { href: '', label: 'Home', key: 'home' },
  { href: 'menu/', label: 'Menu', key: 'menu' },
  { href: 'gallery/', label: 'Gallery', key: 'gallery' },
  { href: 'visit/', label: 'Find Us', key: 'visit' },
];

export const mapsDir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${site.name}, ${fmtAddress(site.address)}`)}`;

function head({ title, description, path, key, image = 'img/og-image.jpg', jsonld = [], noindex = false }) {
  const canonical = absUrl(path);
  const ogImage = absUrl(image);
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${LOCAL ? '' : `<meta http-equiv="Content-Security-Policy" content="${CSP}">`}
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta name="theme-color" content="#1d3a2f">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${url('img/favicon-32.png')}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${url('img/apple-touch-icon.png')}">
<link rel="manifest" href="${url('manifest.webmanifest')}">
${LOCAL ? '' : `<link rel="preload" href="${url('fonts/fraunces-latin-wght-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url('fonts/inter-latin-wght-normal.woff2')}" as="font" type="font/woff2" crossorigin>`}
<link rel="stylesheet" href="${url('assets/main.css')}">
<script>${BOOT}</script>
${jsonld.map((j) => `<script type="application/ld+json">${safeJson(j)}</script>`).join('\n')}
</head>`;
}

function banner() {
  const b = promotions.banner;
  if (!b || !b.active || !b.text) return '';
  return `<div class="promo-banner" role="region" aria-label="Announcement"><p>${esc(b.text)}${b.linkUrl ? ` <a href="${esc(b.linkUrl)}">${esc(b.linkText || 'Find out more')}</a>` : ''}</p></div>`;
}

function header(active) {
  const links = NAV.map((n) => `<li><a href="${url(n.href)}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  return `${banner()}<header class="site-header" id="top">
  <div class="wrap header-in">
    <a class="brand" href="${url('')}" aria-label="${esc(site.name)} – home"><img src="${url('img/logo-dark-240.webp')}" srcset="${url('img/logo-dark-240.webp')} 240w, ${url('img/logo-dark-480.webp')} 480w" sizes="120px" width="120" height="${71}" alt="Mia's Cronulla" decoding="async"></a>
    <nav class="primary-nav" id="primary-nav" aria-label="Main">
      <ul>${links}</ul>
      <div class="drawer-extra">
        <a class="btn btn-primary" href="tel:${site.phoneIntl}">${icons.phone}Call ${esc(site.phone)}</a>
        <a class="btn btn-ghost-light" href="${mapsDir}" target="_blank" rel="noopener">${icons.pin}Get directions</a>
        <p class="drawer-addr">${esc(fmtAddress(site.address))}</p>
        <p class="drawer-social"><a href="${site.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icons.instagram}</a><a href="${site.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icons.facebook}</a></p>
      </div>
    </nav>
    <div class="header-actions">
      <a class="btn btn-small btn-primary hide-sm" href="${url('visit/#book')}">Book a table</a>
      <a class="icon-btn only-sm" href="tel:${site.phoneIntl}" aria-label="Call ${esc(site.phone)}">${icons.phone}</a>
      <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">${icons.menu}</button>
    </div>
  </div>
</header>
<div class="nav-scrim" hidden></div>`;
}

function hoursList() {
  return `<dl class="hours">${hours.groups.map((g) => `<div><dt>${esc(g.label)}</dt><dd>${g.closed ? 'Closed' : esc(g.display || `${fmtTime(g.open)} – ${fmtTime(g.close)}`)}</dd></div>`).join('')}</dl>`;
}
export { hoursList };

function footer() {
  return `<footer class="site-footer">
  <div class="lozenge-band" aria-hidden="true"></div>
  <div class="wrap footer-grid">
    <div>
      <img class="footer-logo" src="${url('img/logo-cream-240.webp')}" width="140" height="82" alt="Mia's Cronulla" loading="lazy" decoding="async">
      <p class="footer-tag">German Beerhall · Cronulla, Sydney</p>
      <p class="footer-social"><a href="${site.social.instagram}" target="_blank" rel="noopener" aria-label="Mia's on Instagram">${icons.instagram}</a><a href="${site.social.facebook}" target="_blank" rel="noopener" aria-label="Mia's on Facebook">${icons.facebook}</a><a href="${site.social.googleMaps}" target="_blank" rel="noopener" aria-label="Mia's on Google Maps">${icons.pin}</a></p>
    </div>
    <div>
      <h2 class="footer-h">Opening hours</h2>
      ${hoursList()}
    </div>
    <div>
      <h2 class="footer-h">Find us</h2>
      <address>${esc(site.address.line1)}<br>${esc(site.address.suburb)} ${esc(site.address.state)} ${esc(site.address.postcode)}</address>
      <p><a href="tel:${site.phoneIntl}">${esc(site.phone)}</a><br><a href="mailto:${site.email}">${esc(site.email)}</a></p>
      <p class="small">${esc(site.bookingNote)}</p>
    </div>
    <div>
      <h2 class="footer-h">Explore</h2>
      <ul class="footer-links">${NAV.map((n) => `<li><a href="${url(n.href)}">${n.label}</a></li>`).join('')}<li><a href="${url('menus/mias-food-menu.pdf')}">Food menu (PDF)</a></li><li><a href="${url('menus/mias-drinks-menu.pdf')}">Drinks menu (PDF)</a></li></ul>
    </div>
  </div>
  <div class="wrap footer-base"><p>© ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</p></div>
</footer>
<div class="cta-bar" role="navigation" aria-label="Quick actions">
  <a href="tel:${site.phoneIntl}">${icons.phone}<span>Call</span></a>
  <a href="${url('menu/')}">${icons.menu}<span>Menu</span></a>
  <a href="${mapsDir}" target="_blank" rel="noopener">${icons.pin}<span>Directions</span></a>
</div>`;
}

export function page({ title, description, path, key, body, jsonld = [], image, bodyClass = '', noindex = false }) {
  return `<!doctype html>
<html lang="en-AU">
${head({ title, description, path, key, jsonld, image, noindex })}
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${header(key)}
<main id="main">
${body}
</main>
${footer()}
<script src="${url('assets/main.js')}" defer></script>
</body>
</html>`;
}

export function businessSchema() {
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const spec = hours.groups.filter((g) => !g.closed).map((g) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: g.days.map((d) => day[d]), opens: g.open, closes: g.close }));
  return {
    '@context': 'https://schema.org',
    '@type': ['BarOrPub', 'Restaurant'],
    '@id': absUrl('') + '#business',
    name: site.name,
    description: site.description,
    url: absUrl(''),
    image: absUrl('img/og-image.jpg'),
    logo: absUrl('img/icon-512.png'),
    telephone: site.phoneIntl,
    email: site.email,
    servesCuisine: ['German'],
    acceptsReservations: true,
    hasMenu: absUrl('menu/'),
    address: { '@type': 'PostalAddress', streetAddress: site.address.line1, addressLocality: site.address.suburb, addressRegion: site.address.state, postalCode: site.address.postcode, addressCountry: site.address.country },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: spec,
    sameAs: [site.social.facebook, site.social.instagram, site.social.googleMaps],
  };
}
