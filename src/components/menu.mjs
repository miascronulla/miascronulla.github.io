import { esc, content, priceNum, absUrl } from '../lib.mjs';
import { img } from './image.mjs';

const TAG_TITLES = { V: 'Vegetarian', GF: 'Gluten free', GFO: 'Gluten free option available' };
const tags = (t = []) => t.map((c) => `<abbr class="tag tag-${c.toLowerCase()}" title="${TAG_TITLES[c] || c}">${c}</abbr>`).join('');
const imgFor = (slug, alt) => {
  const map = {
    'bavarian-platter': { w: 1200, h: 800, widths: [480, 800, 1200] },
    'seafood-burger': { w: 1200, h: 1200, widths: [480, 800, 1200] },
    'tap-tower': { w: 800, h: 818, widths: [480, 800] },
  };
  return map[slug] ? img({ slug, ...map[slug], alt, sizes: '(min-width: 900px) 360px, 100vw', cls: 'cat-img' }) : '';
};
const ALT = {
  'bavarian-platter': 'A heaped platter of German specialties with roast chicken, sausages, sauerkraut and salad',
  'seafood-burger': 'Tall burger stacked with crumbed seafood, rocket and sauce',
  'tap-tower': 'Ornate blue ceramic beer tap tower with a row of German beer badges',
};

function priceBlock(it) {
  if (it.sizes) return `<span class="sizes">${it.sizes.map((s) => `<span class="size"><span class="size-l">${esc(s.label)}</span> <span class="price">${esc(s.price)}</span></span>`).join('')}</span>`;
  return it.price ? `<span class="price">${esc(it.price)}</span>` : '';
}

function item(it) {
  const star = it.featured ? '<span class="signature" title="Signature dish">★ Signature</span>' : '';
  return `<li class="item${it.featured ? ' is-featured' : ''}${it.description || it.note ? '' : ' item-plain'}">
    <div class="item-row">
      <h3 class="item-name">${esc(it.name)}${it.serves ? ` <span class="serves">(${esc(it.serves)})</span>` : ''} ${tags(it.tags)}${star}</h3>
      ${it.sizes || !it.price ? '' : '<span class="leader" aria-hidden="true"></span>'}
      ${priceBlock(it)}
    </div>
    ${it.description ? `<p class="item-desc">${esc(it.description)}</p>` : ''}
    ${it.note ? `<p class="item-note">* ${esc(it.note)}</p>` : ''}
  </li>`;
}

function category(c) {
  const sizes = c.sizes ? `<p class="cat-sizes">${c.sizes.map((s) => `<span><span class="size-l">${esc(s.label)}</span> <strong>${esc(s.price)}</strong></span>`).join('')}</p>` : '';
  return `<section class="cat reveal" id="${c.id}" aria-labelledby="${c.id}-h">
    <header class="cat-head">
      <h2 id="${c.id}-h">${esc(c.title)}${c.titleTags ? ` ${tags(c.titleTags)}` : ''}</h2>
      ${c.subtitle ? `<p class="cat-sub">${esc(c.subtitle)}</p>` : ''}
      ${sizes}
      ${c.intro ? `<p class="cat-intro">${esc(c.intro)}</p>` : ''}
    </header>
    <div class="cat-body">
      ${c.image ? `<figure class="cat-fig">${imgFor(c.image, ALT[c.image] || '')}</figure>` : ''}
      <ul class="items">${c.items.map(item).join('')}${c.list ? `<li class="item item-plain brand-list"><p class="item-desc">${c.list.map(esc).join(' · ')}</p></li>` : ''}${(c.afterItems || []).map(item).join('')}</ul>
    </div>
  </section>`;
}

export function menuSection(menu, hidden) {
  const chips = menu.categories.map((c) => `<a href="#${c.id}" data-spy="${c.id}">${esc(c.title)}</a>`).join('');
  const legend = menu.legend.length ? `<ul class="legend" aria-label="Dietary key">${menu.legend.map((l) => `<li><abbr class="tag tag-${l.code.toLowerCase()}" title="${esc(l.label)}">${l.code}</abbr> ${esc(l.label)}</li>`).join('')}</ul>` : '';
  return `<div class="menu-pane" id="pane-${menu.id}" data-pane="${menu.id}"${hidden ? ' hidden' : ''}>
    <nav class="chips" aria-label="${esc(menu.title)} categories"><div class="chips-in wrap">${chips}</div></nav>
    <div class="wrap menu-body">
      ${legend}
      ${menu.categories.map(category).join('')}
    </div>
  </div>`;
}

/** schema.org Menu generated from the content files. */
export function menuSchema() {
  const mk = (menu) => ({
    '@type': 'Menu',
    name: `${menu.title} menu`,
    hasMenuSection: menu.categories.map((c) => ({
      '@type': 'MenuSection',
      name: c.title,
      hasMenuItem: c.items.map((it) => ({
        '@type': 'MenuItem',
        name: it.name,
        ...(it.description ? { description: it.description } : {}),
        ...(it.price || it.sizes ? { offers: (it.sizes || [{ price: it.price }]).map((s) => ({ '@type': 'Offer', price: priceNum(s.price), priceCurrency: 'AUD' })) } : {}),
      })),
    })),
  });
  return { '@context': 'https://schema.org', '@type': 'Restaurant', '@id': absUrl('') + '#business', hasMenu: [mk(content.food), mk(content.drinks)] };
}
