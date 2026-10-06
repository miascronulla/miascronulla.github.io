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
1. Create the repo **`miascronulla/miascronulla.github.io`** (a *user site*, served at `https://miascronulla.github.io/`) and push this folder (`git remote add origin https://github.com/miascronulla/miascronulla.github.io.git && git push -u origin main`).
2. Repo → Settings → Pages → Source: **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` does the rest.
3. Custom domain: add a file called `CNAME` containing the domain (e.g. `www.miasbar.com.au`) in the project root, set the same domain in Settings → Pages, and update `url` in `content/site.json`.
   Until the custom domain is pointed at GitHub Pages, set `url` in `content/site.json` to `https://miascronulla.github.io` so canonical/Open Graph/sitemap URLs are correct. Other repo names are served at `https://<user>.github.io/<repo>/` and links are rebased automatically.

## Changing content
Edit the JSON in `content/` (or use the CMS below) – no code changes needed.
* **Prices / dishes:** `content/menu/*.json`. Each item: `name`, `description`, `price` (or `sizes` for e.g. Regular/Large), `tags` (`V`, `GF`, `GFO`), `featured` (adds the "Signature" highlight).
* **Opening hours:** `content/hours.json` (also drives the "Open now" indicator and Google structured data).
* **Weekly specials:** `content/events.json`. **Announcement banner:** `content/promotions.json` (`"active": true`).
* **Gallery:** add `{ "image": "/img/uploads/photo.jpg", "caption": "…", "alt": "…" }` to `content/gallery.json`. Upload JPG/WebP ≤ 1600px wide to `public/img/uploads/`.
* **Phone, email, address, social links:** `content/site.json`.
* Printable PDF menus in `public/menus/` are the originals from the old site – replace them when prices change (or remove the links in `src/components/layout.mjs` / `pages.mjs`).

## Turning on the CMS (Decap CMS at `/admin/`) – and how it is secured
The admin screen (`/admin/`) edits the JSON files in `content/` and saves them as commits to the GitHub repo; the site then rebuilds and redeploys in ~1 minute.

**Who can change the site:** only people who can log in with GitHub **and** have *write* access to the repo. Everyone else sees a login button and nothing else – the page itself holds no passwords, tokens or data that isn't already public.

Security measures already built in
* No third-party code on the admin page: Decap CMS 3.16.3 is vendored in `public/admin/vendor/decap-cms/` (no CDN), with a strict Content-Security-Policy (`public/admin/index.html`) that only allows this site, `api.github.com` and the login helper. `noindex`, `no-referrer`, and `/admin/` is excluded in `robots.txt`.
* Every deploy first runs `scripts/validate-content.mjs`: malformed prices, hours, links or photos fail the build, so a typo in the CMS can't take the site down.
* Content is HTML-escaped on output; JSON-LD is script-safe; CMS-entered links are limited to `https`/`mailto`/`tel`/relative (no `javascript:`).
* Public pages carry their own Content-Security-Policy (self-only scripts/styles/images; Google Maps frame only), and no secrets exist anywhere in the repo.
* Edits are ordinary git commits (“CMS: update …”), so every change is attributable and reversible from GitHub’s History.

One-time setup you must do on GitHub (cannot be done from code)
1. Turn on **two-factor authentication** for the `miascronulla` account and for anyone you invite (Settings → Password and authentication). Consider “Require two-factor authentication” if you use a GitHub Organization.
2. Repo → Settings → Collaborators: give **write** access only to the 1–2 people who edit content. Don’t share the owner login.
3. Repo → Settings → Branches → add a rule for `main`: *Restrict deletions* and *Block force pushes* (leave “require pull request” off, otherwise CMS “Publish” will be blocked).
4. **Login helper (OAuth proxy)** – GitHub Pages is static, so GitHub login needs a tiny helper that holds the OAuth *client secret* (never put it in the repo):
   * GitHub → Settings → Developer settings → OAuth Apps → *New OAuth App*. Homepage: your site URL. Callback URL: `https://<your-helper>.workers.dev/callback`.
   * Deploy the open-source [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) (or `decap-proxy`) to a free Cloudflare Worker; set secrets `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and `ALLOWED_DOMAINS` = your site’s domain **only**.
   * In `public/admin/config.yml` uncomment `base_url:` and set it to the Worker URL. Commit.
5. Open `https://<site>/admin/` → *Login with GitHub* → authorise → edit → **Publish**.

Local developer testing without login: temporarily add `local_backend: true` to `config.yml`, add `http://localhost:8081` to `connect-src` in `admin/index.html`, run `npx decap-server`, and revert before committing.

## Contact form
The enquiry form opens the visitor's email app addressed to the venue (works anywhere, no server). To receive submissions directly,
create a free Formspree/Basin/Getform endpoint and put its URL in `formEndpoint` in `content/site.json` – the form then posts to it instead.

## Performance / accessibility notes
* ~29 KB HTML per page, one 24 KB stylesheet, one 13 KB script, self-hosted variable fonts (Fraunces + Inter, Latin subset), WebP photos with `srcset`, lazy loading below the fold.
* Google Map loads only when tapped (privacy + speed). Animations respect `prefers-reduced-motion`. Semantic landmarks, skip link, visible focus, keyboard-operable drawer / tabs / lightbox.
* SEO: unique titles/descriptions, canonical + Open Graph, `BarOrPub`/`Restaurant` JSON-LD with hours, geo and a generated `Menu` schema, `sitemap.xml`, `robots.txt`.

## Fonts & licences
Fraunces and Inter are SIL Open Font Licence (see `public/fonts/`). Photos, logo and menu PDFs belong to Mia's Cronulla and were taken from the old website.
