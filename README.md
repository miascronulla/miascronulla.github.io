# Mia's Cronulla German Beerhall – website

Static, dependency-free website (HTML + CSS + a little vanilla JS) rebuilt from the old Wix site.
Content lives in JSON files so a CMS (Decap) can edit it; a small Node script turns it into plain HTML.

```
content/            ← everything that changes: menu, hours, specials, gallery, contact details
  menu/food.json  menu/drinks.json  hours.json  events.json  promotions.json  gallery.json  site.json
public/             ← copied as-is: img/ (optimised photos), fonts/, menus/ (PDFs), admin/ (CMS)
src/
  components/       ← reusable pieces: layout (header/footer/SEO), menu, sections, image, icons
  pages.mjs         ← the 5 pages (home, menu, gallery, visit, 404)
  styles/main.css   ← all styling (mobile-first, design tokens at top)
  scripts/main.js   ← drawer nav, menu tabs + sticky chips, lightbox, map, open-now, form
build.mjs           ← `node build.mjs` → dist/   (needs Node 18+, no npm install required)
scripts/            ← serve.mjs (local preview), optimise-images.py (regenerates WebP from originals)
.github/workflows/  ← builds and publishes to GitHub Pages on every push to main
```

## Run locally
```
node build.mjs && node scripts/serve.mjs     # then open http://localhost:4173
```
`dist/` is the finished site – you can also upload it to any static host (Netlify, Cloudflare Pages, S3, cPanel).

## Deploy on GitHub Pages
1. Create a GitHub repo and push this folder (`git remote add origin … && git push -u origin main`).
2. Repo → Settings → Pages → Source: **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` does the rest.
3. Custom domain: add a file called `CNAME` containing the domain (e.g. `www.miasbar.com.au`) in the project root, set the same domain in Settings → Pages, and update `url` in `content/site.json`.
   Without a CNAME, the site is served at `https://<user>.github.io/<repo>/` and links are rebased automatically.

## Changing content
Edit the JSON in `content/` (or use the CMS below) – no code changes needed.
* **Prices / dishes:** `content/menu/*.json`. Each item: `name`, `description`, `price` (or `sizes` for e.g. Regular/Large), `tags` (`V`, `GF`, `GFO`), `featured` (adds the "Signature" highlight).
* **Opening hours:** `content/hours.json` (also drives the "Open now" indicator and Google structured data).
* **Weekly specials:** `content/events.json`. **Announcement banner:** `content/promotions.json` (`"active": true`).
* **Gallery:** add `{ "image": "/img/uploads/photo.jpg", "caption": "…", "alt": "…" }` to `content/gallery.json`. Upload JPG/WebP ≤ 1600px wide to `public/img/uploads/`.
* **Phone, email, address, social links:** `content/site.json`.
* Printable PDF menus in `public/menus/` are the originals from the old site – replace them when prices change (or remove the links in `src/components/layout.mjs` / `pages.mjs`).

## Turning on the CMS (Decap CMS at `/admin/`)
The admin screen is already configured in `public/admin/config.yml` (menu, hours, specials, banner, gallery, contact details).
To let non-technical staff log in:
1. Edit `repo:` in `public/admin/config.yml` to your `user/repo`.
2. GitHub Pages has no server, so GitHub login needs a small OAuth helper. Easiest options: (a) host the free open-source
   [decap-proxy / sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) on Cloudflare Workers and set `base_url`; or
   (b) host the site on Netlify (free) and enable *Identity + Git Gateway* – then change `backend` to `git-gateway`.
3. Give the owner/manager a GitHub account with write access (or Netlify Identity invite). They open `/admin/`, edit, press **Publish** –
   the site rebuilds in about a minute.
For a developer preview without any login: `npx decap-server` then open `/admin/` locally (`local_backend: true`).

## Contact form
The enquiry form opens the visitor's email app addressed to the venue (works anywhere, no server). To receive submissions directly,
create a free Formspree/Basin/Getform endpoint and put its URL in `formEndpoint` in `content/site.json` – the form then posts to it instead.

## Performance / accessibility notes
* ~29 KB HTML per page, one 24 KB stylesheet, one 13 KB script, self-hosted variable fonts (Fraunces + Inter, Latin subset), WebP photos with `srcset`, lazy loading below the fold.
* Google Map loads only when tapped (privacy + speed). Animations respect `prefers-reduced-motion`. Semantic landmarks, skip link, visible focus, keyboard-operable drawer / tabs / lightbox.
* SEO: unique titles/descriptions, canonical + Open Graph, `BarOrPub`/`Restaurant` JSON-LD with hours, geo and a generated `Menu` schema, `sitemap.xml`, `robots.txt`.

## Fonts & licences
Fraunces and Inter are SIL Open Font Licence (see `public/fonts/`). Photos, logo and menu PDFs belong to Mia's Cronulla and were taken from the old website.
