/* Mia's Cronulla – progressive enhancement. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header shadow ---------- */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile drawer ---------- */
  var toggle = $('.nav-toggle'), nav = $('#primary-nav'), scrim = $('.nav-scrim');
  if (toggle && nav) {
    var mq = matchMedia('(min-width: 900px)');
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      document.documentElement.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.innerHTML = open ? toggle.dataset.close : toggle.dataset.open;
      if (scrim) { scrim.hidden = !open; if (open) requestAnimationFrame(function () { document.documentElement.classList.add('nav-open'); }); }
      if (open) { var f = $('a', nav); f && f.focus(); } else if (document.activeElement && nav.contains(document.activeElement)) toggle.focus();
    };
    toggle.dataset.open = toggle.innerHTML;
    toggle.dataset.close = '<svg class="ico" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    scrim && scrim.addEventListener('click', function () { setOpen(false); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('open')) return;
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab') { // keep focus inside drawer + toggle
        var f = $$('a,button', nav).concat([toggle]);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    mq.addEventListener && mq.addEventListener('change', function (e) { if (e.matches) setOpen(false); });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && document.documentElement.classList.contains('anim')) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('in'); });

  /* ---------- Sydney time: open now + today highlights ---------- */
  var hd = $('#hours-data');
  var hours = hd ? JSON.parse(hd.textContent) : null;
  var DAYN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function sydneyNow() {
    var tz = (hours && hours.timezone) || 'Australia/Sydney';
    var p = new Intl.DateTimeFormat('en-AU', { timeZone: tz, weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    return { day: DAYN.indexOf(o.weekday), min: (+o.hour % 24) * 60 + (+o.minute) };
  }
  function toMin(t) { var a = t.split(':'); return +a[0] * 60 + +a[1]; }
  function fmt(t) { var a = t.split(':').map(Number), h = a[0] % 12 || 12; return h + (a[1] ? ':' + String(a[1]).padStart(2, '0') : '') + (a[0] >= 12 ? 'pm' : 'am'); }
  function slotFor(day) {
    for (var i = 0; i < hours.groups.length; i++) { var g = hours.groups[i]; if (!g.closed && g.days.indexOf(day) > -1) return g; }
    return null;
  }
  var now = null;
  try { now = sydneyNow(); } catch (e) { now = null; }
  if (hours && now) {
    var today = slotFor(now.day), text, state;
    if (today && now.min >= toMin(today.open) && now.min < toMin(today.close)) { text = 'Open now · until ' + fmt(today.close); state = 'is-open'; }
    else if (today && now.min < toMin(today.open)) { text = 'Closed · opens today at ' + fmt(today.open); state = 'is-closed'; }
    else {
      for (var i = 1; i <= 7; i++) { var d = (now.day + i) % 7, s = slotFor(d); if (s) { text = 'Closed · opens ' + (i === 1 ? 'tomorrow' : DAYN[d]) + ' at ' + fmt(s.open); break; } }
      state = 'is-closed';
    }
    $$('[data-open-status]').forEach(function (el) { el.classList.add(state); $('[data-open-text]', el).textContent = text; });
    $$('.special').forEach(function (el) { if (+el.dataset.day === now.day) { el.classList.add('is-today'); var t = $('.today-tag', el); t && (t.hidden = false); } });
    $$('.hours > div').forEach(function (row, idx) {
      var g = hours.groups[idx]; if (g && g.days.indexOf(now.day) > -1) row.classList.add('is-today-row');
    });
  }

  /* ---------- menu tabs + category chips ---------- */
  var panes = $$('.menu-pane');
  if (panes.length) {
    var tabs = $$('.seg-btn');
    var spy = null;
    var show = function (id, push) {
      panes.forEach(function (p) { p.hidden = p.dataset.pane !== id; });
      tabs.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.tab === id); });
      if (push) history.replaceState(null, '', '#' + id);
      startSpy(id);
    };
    var startSpy = function (id) {
      if (spy) spy.disconnect();
      var pane = $('#pane-' + id); if (!pane) return;
      var links = $$('.chips a', pane), cats = $$('.cat', pane);
      var setActive = function (cid) {
        links.forEach(function (a) {
          var on = a.dataset.spy === cid; a.classList.toggle('active', on);
          if (on) { var sc = a.parentElement; var left = a.offsetLeft - sc.clientWidth / 2 + a.clientWidth / 2; sc.scrollTo({ left: left, behavior: reduce ? 'auto' : 'smooth' }); }
        });
      };
      var ticking = false, cur = null;
      var update = function () {
        ticking = false;
        var line = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 64) + 90, pick = cats[0];
        cats.forEach(function (c) { if (c.getBoundingClientRect().top <= line) pick = c; });
        if (pick.id !== cur) { cur = pick.id; setActive(cur); }
      };
      var onS = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      if (spy) spy.disconnect();
      spy = { disconnect: function () { removeEventListener('scroll', onS); } };
      addEventListener('scroll', onS, { passive: true });
      update();

    };
    tabs.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.tab, true); window.scrollTo({ top: Math.max(0, $('.menu-wrap').offsetTop - 80), behavior: reduce ? 'auto' : 'smooth' }); }); });
    var fromHash = function () {
      var h = location.hash.slice(1); if (!h) return false;
      var target = document.getElementById(h);
      if (h === 'food' || h === 'drinks') { show(h, false); return true; }
      if (target) { var pane = target.closest('.menu-pane'); if (pane) { show(pane.dataset.pane, false); target.scrollIntoView(); return true; } }
      return false;
    };
    if (!fromHash()) show('food', false);
    addEventListener('hashchange', fromHash);
  }

  /* ---------- lightbox ---------- */
  var links = $$('[data-lightbox]');
  if (links.length && 'HTMLDialogElement' in window) {
    var dlg = document.createElement('dialog');
    dlg.className = 'lb'; dlg.setAttribute('aria-label', 'Photo viewer');
    dlg.innerHTML = '<button class="lb-btn lb-close" type="button" aria-label="Close photo viewer"><svg class="ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><button class="lb-btn lb-prev" type="button" aria-label="Previous photo"><svg class="ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><button class="lb-btn lb-next" type="button" aria-label="Next photo"><svg class="ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button><p class="lb-count" aria-live="polite"></p><img class="lb-img" alt=""><p class="lb-cap"></p>';
    document.body.appendChild(dlg);
    var im = $('.lb-img', dlg), cap = $('.lb-cap', dlg), cnt = $('.lb-count', dlg), idx = 0, set = [], opener = null;
    var render = function () {
      var a = set[idx]; im.src = a.href; im.alt = a.dataset.alt || ''; cap.textContent = a.dataset.caption || ''; cnt.textContent = (idx + 1) + ' / ' + set.length;
      var n = set[(idx + 1) % set.length]; if (n) { var pre = new Image(); pre.src = n.href; }
    };
    var go = function (d) { idx = (idx + d + set.length) % set.length; render(); };
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); opener = a;
        set = $$('[data-lightbox]', a.closest('[data-gallery]') || document); idx = set.indexOf(a);
        render(); dlg.showModal(); document.documentElement.style.overflow = 'hidden';
      });
    });
    $('.lb-close', dlg).addEventListener('click', function () { dlg.close(); });
    $('.lb-prev', dlg).addEventListener('click', function () { go(-1); });
    $('.lb-next', dlg).addEventListener('click', function () { go(1); });
    dlg.addEventListener('close', function () { document.documentElement.style.overflow = ''; opener && opener.focus(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
    var sx = null;
    dlg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); sx = null; }, { passive: true });
  }

  /* ---------- map facade (loads Google Maps only on request) ---------- */
  $$('[data-map]').forEach(function (m) {
    var btn = $('[data-map-load]', m);
    btn && btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = m.dataset.src; f.title = "Map showing Mia's Cronulla German Beerhall, 2/45 Gerrale St, Cronulla";
      f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
      m.innerHTML = ''; m.appendChild(f);
    });
  });

  /* ---------- contact form: POST to endpoint if configured, else open email app ---------- */
  $$('[data-contact-form]').forEach(function (form) {
    var status = $('.form-status', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      $$('[required]', form).forEach(function (f) {
        var ok = f.value.trim() && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value));
        f.classList.toggle('err', !ok); f.setAttribute('aria-invalid', !ok); if (!ok) bad = true;
      });
      if (bad) { status.textContent = 'Please fill in your name, a valid email and a message.'; var f = $('.err', form); f && f.focus(); return; }
      var d = {}; new FormData(form).forEach(function (v, k) { d[k] = v; });
      if (form.dataset.endpoint) {
        status.textContent = 'Sending…';
        fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d) })
          .then(function (r) { if (!r.ok) throw 0; form.reset(); status.textContent = 'Thanks! We’ll be in touch soon.'; })
          .catch(function () { status.textContent = 'Sorry, that didn’t send. Please call or email us directly.'; });
        return;
      }
      var body = 'Name: ' + d.name + '\nEmail: ' + d.email + '\nPhone: ' + (d.phone || '') + '\n\n' + d.message;
      location.href = 'mailto:' + form.dataset.email + '?subject=' + encodeURIComponent(d.subject || 'Enquiry from website') + '&body=' + encodeURIComponent(body);
      status.textContent = 'Opening your email app… if nothing happens, please email ' + form.dataset.email + ' or call us.';
    });
  });
})();
