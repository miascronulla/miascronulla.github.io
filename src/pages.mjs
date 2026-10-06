import { esc, url, content, fmtAddress, absUrl } from './lib.mjs';
import { page, businessSchema, mapsDir } from './components/layout.mjs';
import { img } from './components/image.mjs';
import { icons } from './components/icons.mjs';
import { menuSection, menuSchema } from './components/menu.mjs';
import { specials, galleryGrid, visitBlock, lozenge, statusChip } from './components/sections.mjs';

const { site, gallery, food } = content;
const findItem = (name) => food.categories.flatMap((c) => c.items).find((i) => i.name === name);
const fromPrice = (it) => (it.sizes ? `from ${it.sizes[0].price}` : it.price);

export function home() {
  const sig = [
    { name: 'Mia’s Bavarian Platter', item: 'Mia’s Bavarian Platter', slug: 'bavarian-platter', w: 1200, h: 800, widths: [480, 800, 1200], alt: 'A heaped platter of German specialties with roast chicken, sausages, sauerkraut and salad', blurb: 'If you’re really hungry, go for our famous Bavarian Platter to share.' },
    { name: 'Chicken Schnitzel', item: 'Chicken Schnitzel', slug: 'schnitzel-plate', w: 1200, h: 800, widths: [480, 800, 1200], alt: 'Golden crumbed schnitzel with lemon, chips and garden salad', blurb: 'Freshly crumbed chicken breast served with chips and garden salad.' },
    { name: 'Mia’s Sausage Platter', item: "Mia's Sausage Platter", slug: 'sausage-platter', w: 1200, h: 800, widths: [480, 800, 1200], alt: 'Plate of traditional German sausages with mash, gravy and sauerkraut', blurb: 'A selection of traditional German sausages with creamy mash, gravy and sauerkraut.' },
    { name: 'Mia’s Barbecue Platter', item: 'Mia’s Barbecue Platter', slug: 'bbq-platter', w: 1200, h: 800, widths: [480, 800, 1200], alt: 'Barbecue platter of smoked pork ribs, chicken wings, pulled pork, sausages and chips', blurb: 'Smoked BBQ pork ribs, BBQ chicken wings, pulled pork and sausages.' },
  ];
  const body = `
<section class="hero" aria-labelledby="hero-h">
  <div class="hero-media">${img({ slug: 'hero-hall', widths: [640, 1024, 1600, 2400], w: 2730, h: 1559, alt: 'Inside Mia’s Cronulla German Beerhall: the bar with a Bavarian flag hanging above, timber walls and beer signs', sizes: '100vw', eager: true, fetchpriority: 'high' })}</div>
  <div class="hero-shade" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <p class="eyebrow eyebrow-light">German Beerhall · Cronulla, Sydney</p>
    <h1 id="hero-h">Mia’s Cronulla <span>German Beerhall</span></h1>
    <p class="hero-lede">Traditional German food &amp; specialty German beer, served in generous portions along Gerrale Street.</p>
    <div class="btn-row">
      <a class="btn btn-primary btn-lg" href="${url('menu/')}">View Menu</a>
      <a class="btn btn-cream btn-lg" href="${url('visit/#book')}">Book a Table</a>
      <a class="btn btn-ghost-light btn-lg" href="${url('visit/#find-us')}">${icons.pin}Find Us</a>
    </div>
  </div>
</section>
<section class="quick" aria-label="At a glance">
  <div class="wrap quick-in">
    <div class="quick-item">${statusChip()}</div>
    <div class="quick-item"><span class="q-l">Address</span><a href="${mapsDir}" target="_blank" rel="noopener">${esc(fmtAddress(site.address))}</a></div>
    <div class="quick-item"><span class="q-l">Phone</span><a href="tel:${site.phoneIntl}">${esc(site.phone)}</a></div>
  </div>
</section>

<section class="section intro" id="about" aria-labelledby="about-h">
  <div class="wrap intro-grid">
    <div class="intro-text reveal">
      <p class="eyebrow">Visit Mia’s Cronulla German Beerhall</p>
      <h2 id="about-h">${esc(site.tagline)}</h2>
      <p class="lead">When a ravenous hunger takes hold, that only a German sized meal can satisfy, make your way along Gerrale Street to find Mia’s Cronulla German Beer Hall.</p>
      <p>Our traditional German-style beer hall resembles an atmosphere straight from Oktoberfest itself, with long communal timber tables set in a dining hall with an open-air bar, a high roof, and exposed brick walls for a truly rustic feel.</p>
      <p>Delicious German-sized Pork Knuckle, traditional Schnitzel’s, or if you’re really hungry go for our famous Bavarian Platter to share. We also serve burgers, salads, a variety of vegetarian dishes, as well as numerous Gluten Free options.</p>
    </div>
    <figure class="intro-fig reveal">
      ${img({ slug: 'crowd-bavarian-flag', widths: [480, 800, 1200], w: 1200, h: 900, alt: 'A big group of friends posing together inside the beerhall beneath a Bavarian flag', sizes: '(min-width: 900px) 520px, 100vw' })}
      <figcaption>Long communal tables, exposed brick, and plenty of good company.</figcaption>
    </figure>
  </div>
</section>

<section class="section pillars" aria-labelledby="pillars-h">
  <div class="wrap">
    <div class="section-head center reveal"><p class="eyebrow">Beer &amp; food</p><h2 id="pillars-h">Traditional German food &amp; specialty German beer</h2><p class="section-sub">We serve only the finest German beers, along with local and imported favourites. Our amazing traditional German food is served in generous portions. Gluten Free &amp; Vegetarian Options Available. We also serve a selection of wines, schnapps, cocktails, spirits, and non-alcoholic options.</p></div>
    <div class="pillar-grid">
      <article class="pillar reveal">
        ${img({ slug: 'tap-tower', widths: [480, 800], w: 800, h: 818, alt: 'Ornate blue ceramic beer tap tower with a row of German beer badges above the bar', sizes: '(min-width: 900px) 40vw, 100vw' })}
        <div class="pillar-text">
          <h3>German Beer <span class="de">(Deutsches Bier)</span></h3>
          <p>Our beer taps are always changing, but always stocked with the best imported German &amp; Austrian beers such as Weihenstephaner Hefeweissbier, Maisel’s Weisse, Landbier Lager 1857 &amp; our special Oktoberfest Tucher Lager &amp; Weissbier. Delicious cocktails such as our signature Espresso Martini, and a variety of original Schnapps are served to bring in a true Bavarian feeling.</p>
          <a class="text-link" href="${url('menu/#drinks')}">See the drinks menu ${icons.arrow}</a>
        </div>
      </article>
      <article class="pillar reveal">
        ${img({ slug: 'bavarian-platter', widths: [480, 800, 1200], w: 1200, h: 800, alt: 'A heaped platter of German specialties with roast chicken, sausages, sauerkraut and salad', sizes: '(min-width: 900px) 40vw, 100vw' })}
        <div class="pillar-text">
          <h3>Traditional German Food</h3>
          <p>Local favourites including Bavarian Platter, Burgers, Salads, Entrees and more. Check out our full menu for more options.</p>
          <a class="text-link" href="${url('menu/')}">View the full menu ${icons.arrow}</a>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section signatures" aria-labelledby="sig-h">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">From the kitchen</p><h2 id="sig-h">German-sized meals</h2></div>
    <ul class="sig-grid">
      ${sig.map((s) => { const it = findItem(s.item) || {}; return `<li class="sig reveal">${img({ slug: s.slug, widths: s.widths, w: s.w, h: s.h, alt: s.alt, sizes: '(min-width: 900px) 25vw, (min-width: 600px) 50vw, 100vw' })}<div class="sig-text"><h3>${esc(s.name)}</h3><p>${esc(s.blurb)}</p><p class="sig-price">${esc(fromPrice(it) || '')}</p></div></li>`; }).join('')}
    </ul>
    <p class="center reveal"><a class="btn btn-primary" href="${url('menu/')}">See everything on the menu</a></p>
  </div>
</section>

${specials()}

<section class="section gallery-teaser" aria-labelledby="gal-h">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">Gallery</p><h2 id="gal-h">Inside the hall</h2></div>
    ${galleryGrid(gallery.images.slice(0, 6))}
    <p class="center reveal"><a class="btn btn-outline" href="${url('gallery/')}">See all photos</a></p>
  </div>
</section>

${visitBlock()}`;
  return page({
    key: 'home', path: '', bodyClass: 'home',
    title: 'Mia’s Cronulla German Beerhall | German Beer Hall & Restaurant, Cronulla Sydney',
    description: 'German beerhall, bar & restaurant on Gerrale Street, Cronulla. Imported German & Austrian beer, pork knuckle, schnitzels and the famous Bavarian Platter to share. Book on 0400 004 073.',
    jsonld: [businessSchema()], body,
  });
}

export function menuPage() {
  const body = `
<section class="page-hero timber on-dark" aria-labelledby="menu-h">
  <div class="wrap">
    <p class="eyebrow eyebrow-light">Speisekarte &amp; Getränke</p>
    <h1 id="menu-h">The Menu</h1>
    <p class="hero-lede">Traditional German food, served in generous portions, plus German draft beer, schnapps and cocktails. Gluten Free &amp; Vegetarian options available.</p>
    <div class="seg" role="group" aria-label="Choose menu">
      <button type="button" class="seg-btn" data-tab="food" aria-pressed="true">Food</button>
      <button type="button" class="seg-btn" data-tab="drinks" aria-pressed="false">Drinks</button>
    </div>
  </div>
</section>
<div class="menu-wrap">
${menuSection(content.food, false)}
${menuSection(content.drinks, false)}
</div>
<section class="section menu-foot">
  <div class="wrap center">
    <p class="small">Prices are in Australian dollars. Please let our staff know about any allergies or dietary requirements. Draft beers rotate &ndash; check the blackboard for what’s on tap.</p>
    <p class="btn-row center-row"><a class="btn btn-primary" href="tel:${site.phoneIntl}">${icons.phone}Call to reserve: ${esc(site.phone)}</a><a class="btn btn-outline" href="${url('menus/mias-food-menu.pdf')}">Food menu (PDF)</a><a class="btn btn-outline" href="${url('menus/mias-drinks-menu.pdf')}">Drinks menu (PDF)</a></p>
  </div>
</section>`;
  return page({
    key: 'menu', path: 'menu/', bodyClass: 'menu-page',
    title: 'Menu | Mia’s Cronulla German Beerhall – German Food, Beer & Cocktails',
    description: 'Full menu: pork knuckle, schnitzels, sausage platters, burgers and sides, plus German draft beer, schnapps, cocktails and spirits at Mia’s Cronulla German Beerhall.',
    jsonld: [menuSchema()], body,
  });
}

export function galleryPage() {
  const body = `
<section class="page-hero timber on-dark" aria-labelledby="gal-h">
  <div class="wrap"><p class="eyebrow eyebrow-light">Gallery</p><h1 id="gal-h">Life at Mia’s</h1><p class="hero-lede">Steins, schnitzels and long communal tables &ndash; a look inside the hall.</p></div>
</section>
<section class="section">
  <div class="wrap">${galleryGrid(gallery.images, { sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw' })}
  <p class="center small">Follow <a href="${site.social.instagram}" target="_blank" rel="noopener">@miascronulla on Instagram</a> and <a href="${site.social.facebook}" target="_blank" rel="noopener">Facebook</a> for more.</p></div>
</section>`;
  return page({
    key: 'gallery', path: 'gallery/', bodyClass: 'gallery-page',
    title: 'Gallery | Mia’s Cronulla German Beerhall',
    description: 'Photos of the beerhall, German food, drinks and good times at Mia’s Cronulla German Beerhall on Gerrale Street, Cronulla.',
    jsonld: [], body,
  });
}

export function visitPage() {
  const body = `
<section class="page-hero timber on-dark" aria-labelledby="visit-h">
  <div class="wrap"><p class="eyebrow eyebrow-light">Contact us</p><h1 id="visit-h">Find Us &amp; Book a Table</h1><p class="hero-lede">${esc(site.visitCta)}</p></div>
</section>
${visitBlock()}
<section class="section book" id="book" aria-labelledby="book-h">
  <div class="wrap book-grid">
    <div class="reveal">
      <p class="eyebrow">Contact us</p>
      <h2 id="book-h">Bookings &amp; enquiries</h2>
      <p class="lead">${esc(site.bookingNote)}</p>
      <ul class="contact-list">
        <li>${icons.phone}<a href="tel:${site.phoneIntl}">${esc(site.phone)}</a></li>
        <li>${icons.mail}<a href="mailto:${site.email}">${esc(site.email)}</a></li>
        <li>${icons.pin}<a href="${mapsDir}" target="_blank" rel="noopener">${esc(fmtAddress(site.address))}</a></li>
        <li>${icons.instagram}<a href="${site.social.instagram}" target="_blank" rel="noopener">@miascronulla on Instagram</a></li>
        <li>${icons.facebook}<a href="${site.social.facebook}" target="_blank" rel="noopener">Mia’s on Facebook</a></li>
      </ul>
    </div>
    <form class="form reveal" data-contact-form data-email="${site.email}" data-endpoint="${esc(site.formEndpoint || '')}" novalidate>
      <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-phone">Phone number</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
      <div class="field"><label for="f-subject">Subject</label><input id="f-subject" name="subject" placeholder="e.g. Table for 8 on Saturday"></div>
      <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="5" required></textarea></div>
      <button class="btn btn-primary btn-lg" type="submit">Send message</button>
      <p class="form-status" role="status" aria-live="polite"></p>
      <p class="small form-note">This opens your email app with the message ready to send to ${esc(site.email)}. For urgent bookings please call.</p>
    </form>
  </div>
</section>`;
  return page({
    key: 'visit', path: 'visit/', bodyClass: 'visit-page',
    title: 'Find Us, Opening Hours & Bookings | Mia’s Cronulla German Beerhall',
    description: 'Mia’s Cronulla German Beerhall, 2/45 Gerrale St, Cronulla NSW 2230. Open Tue–Fri 5pm–11pm, weekends 11am–11pm. Call 0400 004 073 to book a table.',
    jsonld: [businessSchema()], body,
  });
}

export function notFound() {
  const body = `<section class="section"><div class="wrap center"><p class="eyebrow">Fehler 404</p><h1>Page not found</h1><p class="lead">Looks like this one’s gone for a beer.</p><p class="btn-row center-row"><a class="btn btn-primary" href="${url('')}">Back home</a><a class="btn btn-outline" href="${url('menu/')}">View menu</a></p></div></section>`;
  return page({ key: '', path: '404.html', title: 'Page not found | Mia’s Cronulla German Beerhall', description: 'Page not found.', body, noindex: true });
}
