import { esc, url } from '../lib.mjs';

/** Responsive <img> using pre-generated WebP widths in /img. */
export function img({ slug, widths, w, h, alt, sizes = '100vw', eager = false, cls = '', fetchpriority = '' }) {
  const largest = widths[widths.length - 1];
  const mid = widths[Math.min(1, widths.length - 1)];
  const srcset = widths.map((x) => `${url(`img/${slug}-${x}.webp`)} ${x}w`).join(', ');
  return `<img${cls ? ` class="${cls}"` : ''} src="${url(`img/${slug}-${mid}.webp`)}" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? `loading="eager" decoding="async"${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ''}` : 'loading="lazy" decoding="async"'}>`;
}

export const largestSrc = (slug, widths) => url(`img/${slug}-${widths[widths.length - 1]}.webp`);
