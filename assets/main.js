(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var menuBtn = $('#menu-btn'), mobile = $('#mobile-menu');
  if (menuBtn && mobile) {
    menuBtn.addEventListener('click', function () {
      var open = mobile.hidden;
      mobile.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) $$('video[autoplay]').forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });

  /* ---- Motion layer ---- */
  var nav = $('nav.top');
  var onScroll = function () { if (nav) nav.classList.toggle('scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!reduce && 'IntersectionObserver' in window) {
    // Staggered scroll reveal for content blocks on every page
    var groups = ['.head', '.services > .svc', '.steps > .step', '.grid-work > .tile', '.stats > .stat', '.notes4 > p', '.plans > .plan',
                  '.values > div', '.founders > .founder', '.facts > .fact', '.svc-detail', '.anatomy', '.close .wrap > *', '.faq details', '.terms-list li'];
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    groups.forEach(function (sel) {
      $$(sel).forEach(function (el, i) {
        if (el.closest('.hero')) return;
        el.classList.add('rv'); el.style.setProperty('--rd', (i % 4) * 0.08 + 's'); io.observe(el);
      });
    });

    // Count-up for numeric stats
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, m = el.textContent.match(/^(\D*)(\d+)(.*)$/); if (!m) return;
        var end = +m[2], t0 = performance.now(), dur = 1200;
        (function tick(now) {
          var k = Math.min(1, (now - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
          el.textContent = m[1] + v + m[3]; if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: .6 });
    $$('.stat b').forEach(function (b) { cio.observe(b); });
  }

  // Hero frames: soft parallax that follows the pointer
  var hero = $('.hero'), pf = $$('.hero [data-depth]');
  if (hero && pf.length && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var raf = 0, mx = 0, my = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        pf.forEach(function (f) { var d = +f.dataset.depth; f.style.setProperty('--px', (-mx * d).toFixed(1) + 'px'); f.style.setProperty('--py', (-my * d).toFixed(1) + 'px'); });
      });
    });
    hero.addEventListener('pointerleave', function () { pf.forEach(function (f) { f.style.setProperty('--px', '0px'); f.style.setProperty('--py', '0px'); }); });
  }

  var WORKS = [{"id": 1, "cat": "talk", "tag": "Reel · 9:16", "title": "High-retention talking-head reel", "niche": "B2B consultant / podcaster", "problem": "A 47-minute podcast with a strong insight buried inside a four-minute answer, flat lighting, no visual movement.", "edit": "Pulled the sharpest 38 seconds, rewrote the open as a two-second pattern interrupt, cut every breath and filler word.", "tech": "Word-by-word kinetic captions · punch-in zoom every 3–4s · keyword colour pops · riser into the payoff line.", "video": "media/w1.mp4?v=3", "poster": "media/w1.jpg?v=3"}, {"id": 2, "cat": "motion", "tag": "Motion · 9:16", "title": "Visual framework animation", "niche": "Business coach", "problem": "A three-step framework explained only in speech. Viewers lose the thread by step two and drop.", "edit": "Built an After Effects framework graphic that draws itself step by step, locked to the voiceover beats.", "tech": "Kinetic typography · synced build-on animation · brand-colour highlight system · whoosh transitions.", "video": "media/w2.mp4?v=3", "poster": "media/w2.jpg?v=3"}, {"id": 3, "cat": "design", "tag": "Carousel · 8 slides", "title": "Authority carousel", "niche": "Founder · LinkedIn & Instagram", "problem": "Long text posts with good thinking and no visual hierarchy. People scroll past before the second line.", "edit": "Turned one podcast insight into an eight-slide swipe-through: curiosity hook on slide one, save trigger on slide eight.", "tech": "Open-loop cover headline · one idea per slide · progress markers · high-contrast brand typography.", "video": "media/w3.mp4?v=3", "poster": "media/w3.jpg?v=3"}, {"id": 4, "cat": "before", "tag": "Before / after", "title": "Hook makeover", "niche": "Real estate agent", "problem": "The tour opens with “hi guys, so today…” and most viewers leave before the house is on screen.", "edit": "Reordered the footage to cold-open on the best frame with a price hook on screen, then cut into the walkthrough.", "tech": "Cold-open reorder · first-frame text hook · speed-ramped B-roll · music drop synced to the reveal.", "video": "media/w4.mp4?v=3", "poster": "media/w4.jpg?v=3"}, {"id": 5, "cat": "talk", "tag": "Split screen · 9:16", "title": "Educational split-screen breakdown", "niche": "Fitness / hybrid coach", "problem": "The coach describes form cues to camera, but the viewer never sees what is being described.", "edit": "Split layout: coach on top, demonstration B-roll below with tracked callouts and arrows on the exact joint.", "tech": "Split-screen layout · J-cuts and L-cuts · tracked callout arrows · check/cross SFX on each rep.", "video": "media/w5.mp4?v=3", "poster": "media/w5.jpg?v=3"}, {"id": 6, "cat": "design", "tag": "Thumbnails · 16:9", "title": "High-CTR thumbnail system", "niche": "YouTube podcaster", "problem": "Auto-generated frame grabs: busy backgrounds, low contrast, unreadable at phone size.", "edit": "Designed a repeatable system: expressive face cut-out, three-to-four word headline, single focal point.", "tech": "Emotion-first face crops · three-word curiosity text · rim-light contrast · A/B variant pairs.", "video": "media/w6.mp4?v=3", "poster": "media/w6.jpg?v=3"}];

  var filters = $('#filters'), grid = $('#grid');
  if (filters && grid) {
    filters.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      $$('.chip', filters).forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      var f = c.dataset.f, shown = 0;
      $$('.tile', grid).forEach(function (t) { var on = f === 'all' || t.dataset.cat === f; t.hidden = !on; if (on) shown++; });
      $('#empty').hidden = shown > 0;
    });
  }

  var dlg = $('#dlg');
  if (dlg) {
    var vid = $('#dlg-video');
    var set = function (id, t) { document.getElementById(id).textContent = t; };
    document.addEventListener('click', function (e) {
      var t = e.target.closest('.tile'); if (!t) return;
      var w = WORKS[+t.dataset.n];
      set('dlg-tag', w.tag); set('dlg-title', w.title); set('dlg-niche', w.niche);
      set('dlg-problem', w.problem); set('dlg-edit', w.edit); set('dlg-tech', w.tech);
      vid.poster = w.poster; vid.src = w.video;
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      if (!reduce) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
    });
    var shut = function () { vid.pause(); if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); };
    $('#dlg-close').addEventListener('click', shut);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) shut(); });
    dlg.addEventListener('close', function () { vid.pause(); });
  }

  var form = $('#lead');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, el = form.elements;
      function mark(input, key, msg) {
        input.closest('.field').classList.toggle('bad', !!msg);
        $('[data-err="' + key + '"]', form).textContent = msg || '';
        if (msg) ok = false;
      }
      mark(el.name, 'name', el.name.value.trim() ? '' : 'Add your name so we know who to reply to.');
      mark(el.email, 'email', /^\S+@\S+\.\S+$/.test(el.email.value.trim()) ? '' : 'Enter an email like you@company.com.');
      mark(el.link, 'link', /^https?:\/\/\S+/.test(el.link.value.trim()) ? '' : 'Paste a link that starts with https://');
      if (!ok) { $('.bad input', form).focus(); return; }
      var needs = $$('input[name="need"]:checked', form).map(function (i) { return i.value; }).join(', ') || 'Not specified';
      var body = [
        'Name: ' + el.name.value.trim(),
        'Email: ' + el.email.value.trim(),
        'Video link: ' + el.link.value.trim(),
        'Interested in: ' + needs,
        'Videos per month: ' + el.volume.value,
        'Time zone: ' + el.tz.value,
        '',
        el.msg.value.trim()
      ].join('\n');
      var href = 'mailto:hello@praxak.com?subject=' + encodeURIComponent('Free trial edit request from ' + el.name.value.trim()) + '&body=' + encodeURIComponent(body);
      window.location.href = href;
      var note = document.createElement('div');
      note.className = 'mail-note';
      note.innerHTML = '<b>Your email app should open with the request filled in.</b><span class="muted">If it didn’t, email hello@praxak.com with your video link and we’ll take it from there.</span>';
      var old = $('.mail-note', form); if (old) old.remove();
      form.appendChild(note);
    });
    var copyBtn = $('#copy-mail');
    copyBtn.addEventListener('click', function () {
      var m = $('#mail');
      function sel() { var r = document.createRange(); r.selectNodeContents(m); var s = getSelection(); s.removeAllRanges(); s.addRange(r); copyBtn.textContent = 'Selected'; }
      try { navigator.clipboard.writeText(m.textContent).then(function () { copyBtn.textContent = 'Copied'; }, sel); } catch (err) { sel(); }
      setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1800);
    });
  }
})();

/* Offline support: cache the site on the device after the first visit (see sw.js). */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
