// AXF — Axiom Wrestling Federation | app.js
// Season 3, Episode 9 — Timeline Locked

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ────────────────────────────────────────
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('ldr').classList.add('out'), 2300);
  });

  // ── NAV SCROLL ────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('sc', scrollY > 50));

  // ── MOBILE MENU ───────────────────────────────────
  const mob = document.getElementById('mob');
  document.getElementById('burger').addEventListener('click', () => mob.classList.toggle('open'));
  document.querySelectorAll('.mob a').forEach(a => a.addEventListener('click', () => mob.classList.remove('open')));

  // ── SPA ROUTING ───────────────────────────────────
  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a, .mob a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === id);
    });
    const page = document.getElementById('page-' + id);
    if (page) {
      page.classList.add('active');
      window.scrollTo(0, 0);
      renderPage(id);
      triggerFadeIns();
    }
  }

  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showPage(el.dataset.page);
      mob.classList.remove('open');
    });
  });

  // ── FADE-IN OBSERVER ──────────────────────────────
  function triggerFadeIns() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
    }, { threshold: 0.07 });
    document.querySelectorAll('.fi:not(.on)').forEach(el => obs.observe(el));
  }

  // ── TICKER ────────────────────────────────────────
  function buildTicker() {
    const items = [
      'DANNY BEGINS CEO POWER CONSOLIDATION — BOARD OF DIRECTORS ON FORMAL NOTICE',
      'JAYDEN IS THE REIGNING AXF CHAMPION — THE VETERAN DEFENDS WITH PRIDE',
      'LOGAN MATHEWS — INAUGURAL WORLD HEAVYWEIGHT CHAMPION',
      'TYSON CREED RETAINS IC TITLE — REFUSES SHORTCUTS FOR THE THIRD TIME',
      'DAMIAN COOPER HOLDS US CHAMPIONSHIP — JAYDEN PROTEGE PROVING HIS WORTH',
      'TKO AUTHORITY ALLIES WITH CAMRON CARTER — POWER SHIFT ACCELERATES',
      'DANNY vs DAMIAN COOPER CONFIRMED FOR BACKLASH — CAREER-DEFINING MATCH',
      'AUSTIN CRIMSON REMAINS THE CORPORATE WEAPON — COLLISION COURSE WITH LOGAN',
    ];
    const doubled = [...items, ...items];
    const tt = document.querySelector('.tt');
    if (tt) tt.innerHTML = doubled.map(t => `<span>${t}</span>`).join('');
  }

  // ── PAGE RENDERERS ────────────────────────────────
  function renderPage(id) {
    const fn = {
      home: renderHome,
      superstars: renderSuperstars,
      champions: renderChampions,
      events: renderEvents,
      news: renderNews,
      storylines: renderStorylines,
      legends: renderLegends,
      gallery: renderGallery,
      media: renderMedia,
      about: renderAbout,
      contact: renderContact,
    };
    if (fn[id]) fn[id]();
  }

  // ── HOME ──────────────────────────────────────────
  function renderHome() {
    // Hero stats
    const statsEl = document.getElementById('hero-stats');
    if (statsEl && !statsEl.dataset.built) {
      statsEl.dataset.built = '1';
      statsEl.innerHTML = [
        { n: 'S3', l: 'Season Three' },
        { n: '12×', l: "Danny's Titles" },
        { n: 'E9', l: 'Current Episode' },
        { n: '10', l: 'Active Superstars' },
      ].map(s => `<div><div class="hsn">${s.n}</div><div class="hsl">${s.l}</div></div>`).join('');
    }

    // Featured championships
    const champEl = document.getElementById('home-champs');
    if (champEl && !champEl.dataset.built) {
      champEl.dataset.built = '1';
      champEl.innerHTML = AXF.champions.slice(0,3).map(c => `
        <div class="cc${c.tier === 'world' ? ' ft' : ''}">
          <div class="cc-icon">${c.icon}</div>
          <div class="cc-type">${c.tier === 'world' ? 'World Title' : c.tier === 'mid' ? 'Mid-Card' : 'Tag Division'}</div>
          <div class="cc-name">${c.title}</div>
          <div class="cc-div"></div>
          <div class="cc-lbl">Current Champion</div>
          <div class="cc-champ">${c.holder}</div>
          <div class="cc-reign">${c.note}</div>
        </div>`).join('');
    }

    // Featured storylines (hot only)
    const strlEl = document.getElementById('home-storylines');
    if (strlEl && !strlEl.dataset.built) {
      strlEl.dataset.built = '1';
      const hot = AXF.storylines.filter(s => s.status === 'hot').slice(0,3);
      strlEl.innerHTML = hot.map(s => `
        <div class="slc hot">
          <div class="sl-st hot"><div class="sd"></div>${s.label}</div>
          <div class="sl-mu">${s.names.map((n,i) => `<div class="sl-n">${n}</div>${i < s.names.length-1 ? `<div class="sl-v">${s.connector}</div>` : ''}`).join('')}</div>
          <p class="sl-desc">${s.desc}</p>
          <div class="sl-sk">${s.stakes}</div>
        </div>`).join('');
    }

    // Top moments gallery (home preview — 3 images)
    const galEl = document.getElementById('home-gallery');
    if (galEl && !galEl.dataset.built) {
      galEl.dataset.built = '1';
      const preview = AXF.gallery.slice(0,3);
      galEl.innerHTML = preview.map(g => `
        <div class="gal-item">
          <img src="data:image/png;base64,${AXF.moments_b64[g.img]}" alt="${g.caption}" loading="lazy"/>
          <div class="gal-ov"></div>
          <div class="gal-info">
            <div class="gal-event">${g.event}</div>
            <div class="gal-cap">${g.caption}</div>
          </div>
        </div>`).join('');
    }

    // Match of the Night
    const motnEl = document.getElementById('home-motn');
    if (motnEl && !motnEl.dataset.built) {
      motnEl.dataset.built = '1';
      const matches = [
        { n: 'Match of the Season', match: 'Jayden vs Austin Crimson', event: 'AXF Bad Blood', result: 'Jayden Retains AXF Championship' },
        { n: 'Championship Moment', match: 'Logan Mathews — Crowned Champion', event: 'Season 3 Milestone', result: 'Three-Time World Champion' },
        { n: 'Rising Star Match', match: 'Damian Cooper vs Division', event: 'AXF SmackDown', result: 'US Championship Captured' },
      ];
      motnEl.innerHTML = matches.map(m => `
        <div class="motn-card">
          <div class="motn-n">${m.n}</div>
          <div class="motn-match">${m.match}</div>
          <div class="motn-event">${m.event}</div>
          <div class="motn-result">⚡ ${m.result}</div>
        </div>`).join('');
    }

    // News preview
    const newsEl = document.getElementById('home-news');
    if (newsEl && !newsEl.dataset.built) {
      newsEl.dataset.built = '1';
      newsEl.innerHTML = AXF.news.slice(0,4).map((n,i) => `
        <div class="ni${i===0?' nft-mini':''}">
          <div class="ni-cat ${n.catClass}">${n.cat}</div>
          <div class="ni-hl">${n.headline}</div>
          <div class="ni-date">${n.date}</div>
        </div>`).join('');
    }
  }

  // ── SUPERSTARS ────────────────────────────────────
  function renderSuperstars() {
    const grid = document.getElementById('ss-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';

    grid.innerHTML = AXF.roster.map(r => {
      const imgHtml = r.img
        ? `<img src="data:image/png;base64,${r.img}" alt="${r.name}" loading="lazy"/>`
        : `<div class="ph">🤼</div>`;
      const statsHtml = r.stats.map(s => `<div class="ss"><strong>${s.v}</strong>${s.l}</div>`).join('');
      const champTag = r.id === 'jayden' ? 'AXF CHAMP' : r.id === 'logan' ? 'WHC CHAMP' : r.id === 'damian' ? 'US CHAMP' : r.id === 'tyson' ? 'IC CHAMP' : (r.id === 'camron' || r.id === 'benjamin') ? 'TAG CHAMP' : '';
      return `
        <div class="sc" data-tier="${r.tier}" data-align="${r.align.toLowerCase()}" onclick="window.openModal('${r.id}')">
          <div class="sc-img">${imgHtml}<div class="sc-ov"></div></div>
          <div class="sc-top">
            <div class="ab ${r.align.toLowerCase()}">${r.align}</div>
            ${champTag ? `<div class="ctg">${champTag}</div>` : ''}
          </div>
          <div class="sc-info">
            <div class="sc-nick">${r.nick}</div>
            <div class="sc-name">${r.name}</div>
            <div class="sc-stats">${statsHtml}</div>
          </div>
        </div>`;
    }).join('');

    // Filter buttons
    document.querySelectorAll('.fb').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const f = btn.dataset.filter;
        document.querySelectorAll('.sc').forEach(c => {
          const show = f === 'all' || c.dataset.tier === f || c.dataset.align === f;
          c.style.display = show ? 'flex' : 'none';
        });
      });
    });
  }

  // ── MODAL ─────────────────────────────────────────
  window.openModal = function(id) {
    const r = AXF.roster.find(x => x.id === id);
    if (!r) return;
    const imgHtml = r.img
      ? `<img src="data:image/png;base64,${r.img}" alt="${r.name}"/><div class="mi-ov"></div>`
      : `<div class="pio">🤼</div>`;
    const statsHtml = r.stats.map(s => `<div class="mstat"><div class="mstat-v">${s.v}</div><div class="mstat-l">${s.l}</div></div>`).join('');
    document.getElementById('modal-content').innerHTML = `
      <div class="mh">
        <div class="mi">${imgHtml}</div>
        <div class="md">
          <div class="md-badge"><span class="ab ${r.align.toLowerCase()}">${r.align}</span></div>
          <div class="md-nick">${r.nick}</div>
          <div class="md-name">${r.name}</div>
          <div class="md-tag">${r.tagline}</div>
          <div class="md-stats">${statsHtml}</div>
          <div class="md-sec"><div class="md-sec-t">Moves &amp; Finisher</div><div class="md-sec-b">${r.moves}</div></div>
        </div>
      </div>
      <div class="md-lower">
        <div class="md-sec"><div class="md-sec-t">Championship History</div><div class="md-sec-b">${r.history}</div></div>
        <div class="md-sec"><div class="md-sec-t">Current Status</div><div class="md-sec-b">${r.status}</div></div>
        <div class="md-sec"><div class="md-sec-t">Motivation</div><div class="md-sec-b">${r.motivation}</div></div>
        <div class="md-sec"><div class="md-sec-t">Key Rivalries</div><div class="md-sec-b">${r.rivalries}</div></div>
      </div>`;
    document.getElementById('modal-bg').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    document.getElementById('modal-bg').classList.remove('open');
    document.body.style.overflow = '';
  };

  document.getElementById('modal-bg').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-bg')) window.closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeModal(); });

  // ── CHAMPIONS ─────────────────────────────────────
  function renderChampions() {
    const grid = document.getElementById('champ-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';
    const tierMap = { world: 'World Title', mid: 'Mid-Card', tag: 'Tag Division', women: "Women's Division" };
    grid.innerHTML = AXF.champions.map(c => `
      <div class="cc${c.tier === 'world' ? ' ft' : ''}">
        <div class="cc-icon">${c.icon}</div>
        <div class="cc-type">${tierMap[c.tier]}</div>
        <div class="cc-name">${c.title}</div>
        <div class="cc-div"></div>
        <div class="cc-lbl">Current Champion</div>
        <div class="cc-champ">${c.holder}</div>
        <div class="cc-reign">${c.note}</div>
      </div>`).join('');
  }

  // ── EVENTS ────────────────────────────────────────
  function renderEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';
    grid.innerHTML = AXF.events.map(ev => {
      const isFeat = ev.featured;
      const statusDot = ev.status === 'next' ? 'next' : ev.status === 'completed' ? 'comp' : 'fut';
      const statusText = ev.status === 'next' ? 'Up Next' : ev.status === 'completed' ? 'Completed' : 'Forthcoming';
      const matchCards = ev.matches.length
        ? `<div style="margin-top:10px">${ev.matches.map(m => `<div class="match-card"><div class="match-stip">${m.stipulation}</div><div class="match-names">${m.names}</div></div>`).join('')}</div>`
        : '';
      return `
        <div class="ppv-card${isFeat ? ' ppv-feat' : ''}${ev.status === 'current' ? ' current' : ''}${ev.status === 'next' ? ' current' : ''}">
          ${ev.status === 'next' ? '<div class="ppv-badge">▲ Next Event</div>' : ''}
          <div class="ppv-banner">
            <div class="ppv-banner-bg" style="background:linear-gradient(135deg,${ev.color},#000)"></div>
            <div class="ppv-banner-icon">${ev.icon}</div>
          </div>
          <div class="ppv-body">
            <div class="ppv-season">AXF Season 3</div>
            <div class="ppv-name">${ev.name.replace('AXF ', 'AXF <span class="accent">').replace(/(?<=<span class="accent">).*/, m => m + '</span>').replace('AXF <span class="accent">', ev.name.includes('AXF') ? 'AXF <span class="accent">' : '')}</div>
            <div class="ppv-divid"></div>
            <div class="ppv-status-row"><div class="ppv-dot ${statusDot}"></div><div class="ppv-status-text ${statusDot}">${statusText}</div></div>
            <div class="ppv-desc">${ev.slogan}</div>
            ${matchCards}
          </div>
        </div>`;
    }).join('');

    // Simpler, cleaner event name render
    grid.querySelectorAll('.ppv-name').forEach((el, i) => {
      el.innerHTML = AXF.events[i].name;
    });
  }

  // ── NEWS ──────────────────────────────────────────
  function renderNews() {
    const wrap = document.getElementById('news-wrap');
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built = '1';
    const feat = AXF.news.find(n => n.featured);
    const rest = AXF.news.filter(n => !n.featured);
    wrap.innerHTML = `
      <div class="news-grid">
        <div class="nft">
          <div class="nc">🏛️ ${feat.cat}</div>
          <h2 class="nhl">${feat.headline}</h2>
          <p class="nex">${feat.body}</p>
          <div class="nm">AXF Editorial · <span>${feat.date}</span> · Breaking</div>
        </div>
        <div class="news-sb">
          ${rest.map(n => `
            <div class="ni">
              <div class="ni-cat ${n.catClass}">${n.cat}</div>
              <div class="ni-hl">${n.headline}</div>
              <div class="ni-date">${n.date}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ── STORYLINES ────────────────────────────────────
  function renderStorylines() {
    const grid = document.getElementById('strl-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';
    grid.innerHTML = AXF.storylines.map(s => {
      const isFeat = s.featured;
      const namesHtml = s.names.map((n, i) =>
        `<div class="sl-n"${isFeat ? ' style="font-size:clamp(20px,3vw,32px)"' : ''}>${n}</div>${i < s.names.length-1 ? `<div class="sl-v"${isFeat ? ' style="font-size:16px"' : ''}>${s.connector}</div>` : ''}`
      ).join('');
      if (isFeat) return `
        <div class="slc feat hot">
          <div class="feat-l">
            <div class="sl-st hot"><div class="sd"></div>${s.label}</div>
            <div class="sl-mu">${namesHtml}</div>
            <p class="sl-desc">${s.desc}</p>
            <div class="sl-sk">${s.stakes}</div>
          </div>
          <div class="feat-r">
            <div class="pq">${s.quote}</div>
            <div class="pa">— ${s.attribution}</div>
          </div>
        </div>`;
      return `
        <div class="slc ${s.status}">
          <div class="sl-st ${s.status}"><div class="sd"></div>${s.label}</div>
          <div class="sl-mu">${namesHtml}</div>
          <p class="sl-desc">${s.desc}</p>
          <div class="sl-sk">${s.stakes}</div>
        </div>`;
    }).join('');
  }

  // ── LEGENDS ───────────────────────────────────────
  function renderLegends() {
    const grid = document.getElementById('leg-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';
    const legends = [
      { icon: '🦅', yr: 'Class of 2024', name: 'John Cena', nick: '"The Cenation Leader"', ach: 'Retired · Last Champion of the Previous Era' },
      { icon: '🎭', yr: 'Class of 2023', name: 'Triple H', nick: '"The King of Kings"', ach: 'The Authority Era · Defeated by Danny' },
      { icon: '⭐', yr: 'Active Legend', name: 'Jayden', nick: '"The Veteran"', ach: 'AXF Champion · Former World Champion · Mentor' },
      { icon: '🏛️', yr: 'Studio Partner', name: 'Valhalla Crown', nick: '"Where Legends Are Forged"', ach: "Danny's Production Empire · Official AXF Partner" },
    ];
    grid.innerHTML = legends.map(l => `
      <div class="lc">
        <div class="leg-bust">${l.icon}</div>
        <div class="leg-yr">${l.yr}</div>
        <div class="leg-name">${l.name}</div>
        <div class="leg-nick">${l.nick}</div>
        <div class="leg-ach">${l.ach}</div>
      </div>`).join('');
  }

  // ── GALLERY ───────────────────────────────────────
  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';
    grid.innerHTML = AXF.gallery.map(g => `
      <div class="gal-item" onclick="window.openLightbox('${g.img}','${g.caption}','${g.event}')">
        <img src="data:image/png;base64,${AXF.moments_b64[g.img]}" alt="${g.caption}" loading="lazy"/>
        <div class="gal-ov"></div>
        <div class="gal-info">
          <div class="gal-event">${g.event}</div>
          <div class="gal-cap">${g.caption}</div>
        </div>
        <div class="gal-zoom">⤢</div>
      </div>`).join('');
  }

  window.openLightbox = function(imgKey, cap, ev) {
    const lb = document.getElementById('lightbox');
    lb.querySelector('.lb-img').src = `data:image/png;base64,${AXF.moments_b64[imgKey]}`;
    lb.querySelector('.lb-cap-txt').textContent = cap;
    lb.querySelector('.lb-cap-ev').textContent = ev;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeLightbox = function() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  };
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) window.closeLightbox();
  });

  // ── MEDIA ─────────────────────────────────────────
  function renderMedia() {
    const pod = document.getElementById('pod-eps');
    if (pod && !pod.dataset.built) {
      pod.dataset.built = '1';
      pod.innerHTML = AXF.podcast.map(p => `
        <div class="pep">
          <div class="ep-n">${p.ep}</div>
          <div class="ep-i">
            <div class="ep-t">${p.title}</div>
            <div class="ep-m">${p.meta}</div>
          </div>
          <div class="ep-p">▶</div>
        </div>`).join('');
    }

    const vids = document.getElementById('vid-grid');
    if (vids && !vids.dataset.built) {
      vids.dataset.built = '1';
      const clips = [
        { icon: '👿', label: 'Danny — CEO Power Consolidation Promo' },
        { icon: '🗡️', label: 'Austin Crimson — Championship Address' },
        { icon: '⚡', label: 'Logan Mathews — World Heavyweight Championship Win' },
        { icon: '🔥', label: 'Jayden & Damian — The Mentor Moment' },
      ];
      vids.innerHTML = clips.map(c => `
        <div class="vt">
          <div class="vt-bg">${c.icon}</div>
          <div class="vt-play">▶</div>
          <div class="vt-lbl">${c.label}</div>
        </div>`).join('');
    }
  }

  // ── ABOUT ─────────────────────────────────────────
  function renderAbout() { /* static — HTML only */ }

  // ── CONTACT ───────────────────────────────────────
  function renderContact() {
    const btn = document.getElementById('cf-submit');
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        btn.textContent = 'Sending...';
        btn.style.opacity = '.6';
        setTimeout(() => {
          btn.textContent = '✓ Received — We Will Be In Touch';
          btn.style.background = 'linear-gradient(135deg,#1a5a1a,#0d3d0d)';
          btn.style.color = '#fff';
          btn.style.opacity = '1';
        }, 1400);
      });
    }
  }

  // ── INIT ──────────────────────────────────────────
  buildTicker();
  showPage('home');
});
