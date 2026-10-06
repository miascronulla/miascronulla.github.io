# Content audit – old Wix site → new site

Source audited: `https://miascronulla.wixsite.com/website` (the bare `/` URL returns a Wix 404; the live site is at `/website`), plus its 2 menu PDFs, 17 gallery photos and 5 home-page photos. Audit date: 6 Oct 2026.

## Old site map → new site
| Old page | New location |
|---|---|
| Home (`/website`) | `/` Home – hero, intro text, beer + food blurbs, weekly events, opening hours, contact, map |
| Menus (`/website/menus`) | `/menu/` – full Food + Drinks menu built from the PDFs |
| Gallery (`/website/gallery`) | `/gallery/` (17 photos, lightbox) + 6-photo teaser on Home |
| Contact form + map (bottom of Home) | `/visit/` (Find Us, hours, map, enquiry form) and Home “Find us” section |

No About, Events, Functions/Groups or Food & Beer pages existed and there is no source content for them, so none were created. “About” text is the intro on Home; “What’s On” is the weekly-events block on Home.

## Checklist – migrated ✅
- [x] Business name, tagline “Hidden gem in Cronulla”, all Home copy (intro, German Beer, Traditional German Food, meta description) – wording preserved
- [x] Weekly events: Tue Chicken Schnitzel Burger & Chips $15 · Wed Large Chicken Schnitzel Meal (2pcs with Chips) $25 · Thu All you can eat BBQ Chicken Wings $20 · Fri All Fruit Tingles 40% Off $12
- [x] Opening hours: Mon Closed · Tue–Fri 5pm–11pm · Weekends 11am–11pm
- [x] Phone 0400 004 073 (tap-to-call) · email johnpeters@miasbar.com.au · “less than 24 hours notice, please call” note
- [x] Address 2/45 Gerrale St, Cronulla NSW 2230 + map (coordinates taken from the old Wix map) + Google Maps listing link (`cid=6049923584808118084`)
- [x] Facebook (`/miascronulla/`) and Instagram (`/miascronulla/`) links
- [x] Logo (cleaned to transparent, used in header/footer) and all 17 gallery photos + 5 home photos considered; 17 used (see below)
- [x] **Food menu PDF** – all 48 items in 5 categories (Starters 15, Mains 14, Burgers 8, Burger Add Ons 7, Kid’s Menu 4) with descriptions, GF/GFO/V flags, sizes (Regular/Large), serves-info, “Ask for spicy options” notes
- [x] **Drinks menu PDF** – German draft beer (300ml/500ml/1L, Tasting Paddle, Weissbier/Lager/Helles/Pilsner/Dunkel descriptions, rotation note), Fruit Beer, Bottled Beer & Cider, Low/No Alcohol, Schnapps (+ Paddle), Cocktails, Spirits (+ brand list, Premium), Softdrinks
- [x] Price check: every `$` value in each PDF compared programmatically with the new menu data – **food 50/50 and drinks 45/45 prices identical**; visually re-checked against rendered PDFs
- [x] German names retained (Leberkäse, Kassler, Weisswurst, Curry Wurst, Deutsches Bier vom Fass, Kleiner Feigling, Bärenjäger…)
- [x] Original PDFs kept as printable downloads in `/menus/`
- [x] Internal links (178) checked – none broken; all images have alt text; one `<h1>` per page

## Not migrated / needs your decision ⚠️
1. **Wix “Dinner Menu” section on the old Menus page was NOT migrated.** It is Wix template filler (Bread & dips, Tuna sashimi, Hand-made ravioli, Tofu skewers, Peanut crusted steak, Sticky date, “Cocktails $1.50” …) – not German, not in the PDFs, prices implausible. Treated as placeholder text; recommend it was never meant to be public.
2. **“Wine Selection” download** on the old Menus page points to the *same* PDF as the Drinks Menu, which contains no wine list. Wines are only mentioned in text (“a selection of wines”). No wine items or prices exist anywhere, so none were invented – supply a wine list if you want one added.
3. **Old contact form** posted to Wix. Replaced by an email-link form (or a form endpoint you configure – see README).
4. **Facebook / Instagram / Google Maps links** were copied from the old site but not opened (social sites block automated access) – please click-test. The map embed and “Open in Google Maps” link use the listing/coordinates from the old site.
5. **Could not verify currency:** old footer says ©2020, menu PDFs are undated. Please confirm prices, weekly specials, hours and phone are still current. Draft beer taps rotate (menu says so); named beers in the Home copy were kept verbatim.
6. **Website address:** menu PDFs print `www.miasbar.com.au` – used as the canonical/Open Graph/sitemap domain (`content/site.json`). Change it if the final domain differs. The email is on that same domain.
7. **Chalkboard photo caption** (“hold 1 litre … 5 minutes … eternal fame, 1L free beer”) is transcribed from the venue’s own photo and shown only as a gallery caption – confirm it’s still a live promotion before featuring it elsewhere.
8. **Wording kept as-is even where it looks like a typo:** “traditional Schnitzel’s” (Home), “Jim Bean”, “Mix of green leaved…”, “top fermented” in the Helles note, “Sauer Apple Schnapps”, “Mim’s Mojito”. Fix in the CMS/JSON if wanted.
9. **Photos not used:** `ef4553_c1c012…` is a near-duplicate of the tap-tower photo (kept the other crop). The Wix menu-template food photos (stock images) were not reused. No photo of the Pork Knuckle exists on the old site, so that dish has no picture.
10. **Not run:** Lighthouse / real-device (iPhone, Android) testing – layout was tested in headless Chromium at 390px (phone) and 1366px (desktop) with no horizontal scroll or console errors; please spot-check on real devices.
11. Booking is by phone/email as on the old site – no online booking system was invented.
