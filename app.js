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
      'DANNY OFFICIALLY NAMED CEO OF AXF — STEPHANIE MCMAHON ANNOUNCES AT MONEY IN THE BANK',
      'JAYDEN IS THE REIGNING AXF CHAMPION — THE VETERAN STILL STANDING',
      'LOGAN MATHEWS — THREE-TIME WORLD HEAVYWEIGHT CHAMPION',
      'TYSON CREED RETAINS IC TITLE — FORMER MMA FIGHTER DOMINATES THE DIVISION',
      'MATT CROSS CAPTURES UNITED STATES CHAMPIONSHIP — KONA HAWAII CELEBRATES',
      'DAMIAN COOPER TURNS ON JAYDEN — THE BETRAYAL IS NOW COMPLETE',
      'TKO AUTHORITY ALLIES WITH CAMRON CARTER — POWER SHIFT ACCELERATES',
      'SUMMERSLAM IS NEXT — WHERE LEGENDS IGNITE — TWO NIGHTS OF DESTRUCTION',
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
      champions: () => { renderChampions(); renderRecords(); },
      records: renderRecords,
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
      const tierMap = { world: 'World Title', mid: 'Mid-Card', tag: 'Tag Division', women: "Women's Division" };
      champEl.innerHTML = AXF.champions.slice(0,3).map(c => {
        const isFeat = c.tier === 'world';
        if (c.img) {
          return `
            <div class="cc${isFeat ? ' ft' : ''}">
              <div class="cc-render${isFeat ? '' : ' cc-render-sm'}">
                <img src="data:image/png;base64,${c.img}" alt="${c.holder}" loading="lazy"/>
                <div class="cc-render-ov"></div>
                <div class="cc-info-over">
                  <div class="cc-type">${tierMap[c.tier]}</div>
                  <div class="cc-name">${c.title}</div>
                  <div class="cc-div"></div>
                  <div class="cc-lbl">Current Champion</div>
                  <div class="cc-champ">${c.holder}</div>
                  <div class="cc-reign">${c.reign}</div>
                </div>
              </div>
            </div>`;
        }
        return `
          <div class="cc${isFeat ? ' ft' : ''}">
            <div class="cc-plain">
              <div class="cc-icon">${c.icon}</div>
              <div class="cc-type">${tierMap[c.tier]}</div>
              <div class="cc-name">${c.title}</div>
              <div class="cc-div"></div>
              <div class="cc-lbl">Current Champion</div>
              <div class="cc-champ">${c.holder}</div>
              <div class="cc-reign">${c.note}</div>
            </div>
          </div>`;
      }).join('');
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
        { n: 'Match of the Season', match: 'Logan Mathews vs Austin Crimson', event: 'AXF Bad Blood — Hell in a Cell', result: 'Logan Mathews Retains World Heavyweight Championship' },
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
      // Danny gets his CEO desk render as card image
      const cardImg = (r.id === 'danny' && AXF.danny_ceo) ? AXF.danny_ceo.desk : r.img;
      const imgHtml = cardImg
        ? `<img src="data:image/png;base64,${cardImg}" alt="${r.name}" loading="lazy"/>`
        : `<div class="ph">🤼</div>`;
      const statsHtml = r.stats.map(s => `<div class="ss"><strong>${s.v}</strong>${s.l}</div>`).join('');
      const champTag = r.id === 'jayden' ? 'AXF CHAMP' : r.id === 'logan' ? 'WHC CHAMP' : r.id === 'damian' ? '' : r.id === 'tyson' ? 'IC CHAMP' : (r.id === 'camron' || r.id === 'benjamin') ? 'TAG CHAMP' : r.id === 'danny' ? 'CEO · AXF' : '';
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

  // ── CHAMPIONSHIPS ─────────────────────────────────────
  function renderChampions() {
    const archive = document.getElementById('champ-archive');
    if (!archive || archive.dataset.built) return;
    archive.dataset.built = '1';

    // Full championship data with history
    const titles = [
      {
        id: 'axf', division: 'world', divLabel: 'World Title',
        name: 'AXF Championship',
        champion: 'Jayden', daysHeld: 181,
        img: AXF.champions.find(c=>c.id==='axf')?.img || null,
        icon: '👑',
        desc: '<strong>Jayden\'s 181-day AXF Championship reign</strong> represents his place as the standard-bearer of AXF. After years of operating in Danny\'s shadow, the veteran finally stands alone at the top of the company he helped build — and shows no signs of letting go.',
        stats: { defenses: '6+', longest: 'Danny — 525 Days (5th Reign)', brand: 'AXF SmackDown' },
        history: [
          { n:1, name:'[Inaugural]', event:'AXF Inaugural Event', days:'—', note:'First AXF Champion', status:'former' },
          { n:'—', name:'[Various Champions]', event:'Archive Pending', days:'—', note:'Historical reigns on record', status:'former' },

          { n:'—', name:'Jayden', event:'AXF Bad Blood', days:'181+', note:'Current Reign · Active', status:'active' },
        ],
      },
      {
        id: 'whc', division: 'world', divLabel: 'World Title',
        name: 'World Heavyweight Championship',
        champion: 'Logan Mathews', daysHeld: 133,
        img: AXF.champions.find(c=>c.id==='whc')?.img || null,
        icon: '🏆',
        desc: '<strong>Logan Mathews has held the World Heavyweight Championship for 133 days</strong> and counting. As the top babyface of this generation, his reign has been a referendum on the future of AXF — proof that the next era is not coming. It is here.',
        stats: { defenses: '4+', longest: 'Logan Mathews — 133 Days (Active)', brand: 'AXF RAW' },
        history: [

          { n:'—', name:'Logan Mathews', event:'AXF Premium Live Event', days:'133+', note:'Current Reign · Active — 3x World Champion', status:'active' },
        ],
      },
      {
        id: 'ic', division: 'mid', divLabel: 'Midcard Title',
        name: 'Intercontinental Championship',
        champion: 'Tyson Creed', daysHeld: 133,
        img: AXF.champions.find(c=>c.id==='ic')?.img || null,
        icon: '⚔️',
        desc: '<strong>Tyson Creed\'s 133-day Intercontinental Championship reign</strong> is defined by one word: integrity. A former MMA fighter with a professional record of 101-09-02, Creed entered AXF and immediately elevated the IC title by refusing every shortcut offered to him.',
        stats: { defenses: '5+', longest: 'Tyson Creed — 133 Days (Active)', brand: 'AXF RAW' },
        history: [
          { n:'—', name:'Tyson Creed', event:'AXF Debut Season', days:'133+', note:'Current Reign · Active — MMA Credibility Era', status:'active' },
        ],
      },
      {
        id: 'us', division: 'mid', divLabel: 'Midcard Title',
        name: 'United States Championship',
        champion: 'Mathew Matt', daysHeld: 30,
        img: AXF.champions.find(c=>c.id==='us')?.img || null,
        icon: '🇺🇸',
        desc: '<strong>Mathew Matt — also known as Titan Cross and Matt Cross — has held the United States Championship for 30 days.</strong> The Hawaiian Destroyer from Kona, Hawaii made his debut at WrestleMania and has been a force ever since. The US Title now carries the weight of a Special Forces soldier\'s discipline.',
        stats: { defenses: '1+', longest: 'Mathew Matt — 30 Days (Active)', brand: 'AXF SmackDown' },
        history: [
          { n:'—', name:'Damian Cooper', event:'AXF Premium Live Event', days:'—', note:'Former US Champion — now turned heel', status:'former' },
          { n:'—', name:'Mathew Matt', event:'AXF RAW', days:'30+', note:'Current Reign · Active — Also known as Titan Cross / Matt Cross', status:'active' },
        ],
      },
      {
        id: 'tag', division: 'tag', divLabel: 'Tag Division',
        name: 'AXF Tag Team Championships',
        champion: 'Camron & Benjamin Carter', daysHeld: null,
        img: null, icon: '🤝',
        desc: '<strong>The AXF Tag Team Championships are held by Camron Carter and Benjamin Carter</strong> — the most dominant tag team currently operating in AXF. TKO Authority aligned, physically imposing, and politically connected. A title reign built on power and ruthlessness.',
        stats: { defenses: '—', longest: 'Archive Pending', brand: 'Both Shows' },
        history: null,
      },
      {
        id: 'wom', division: 'women', divLabel: "Women's Division",
        name: "Women's World Championship",
        champion: 'Expanding', daysHeld: null,
        img: null, icon: '⭐',
        desc: 'The AXF Women\'s World Championship division is currently in development. A full division launch is planned for Season 4 with multiple competitors being scouted across the global wrestling landscape.',
        stats: { defenses: '—', longest: '—', brand: '—' },
        history: null,
      },
    ];

    archive.innerHTML = titles.map(t => buildChampBlock(t)).join('');

    // Filter logic
    document.querySelectorAll('.tfb').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tfb').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const f = btn.dataset.filter;
        document.querySelectorAll('.champ-block').forEach(el => {
          el.classList.toggle('hidden', f !== 'all' && el.dataset.div !== f);
        });
      });
    });

    // Scroll reveal
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';obs.unobserve(e.target);} });
    }, {threshold:0.06});
    document.querySelectorAll('.champ-block').forEach(el => {
      el.style.opacity='0'; el.style.transform='translateY(24px)'; el.style.transition='opacity .6s ease, transform .6s ease';
      obs.observe(el);
    });
  }

  function buildChampBlock(t) {
    const imgHtml = t.img
      ? `<img src="data:image/png;base64,${t.img}" alt="${t.champion}" loading="lazy"/><div class="cb-hero-right-fade"></div>`
      : `<div class="cb-hero-right-icon">${t.icon}</div>`;

    const daysDisplay = t.daysHeld ? t.daysHeld + '+' : '—';

    const statsBar = `
      <div class="cb-stats-bar">
        <div class="cb-stat"><div class="cb-stat-val">${t.champion === 'Expanding' ? '—' : daysDisplay}</div><div class="cb-stat-key">Days Held</div></div>
        <div class="cb-stat"><div class="cb-stat-val">${t.stats.defenses}</div><div class="cb-stat-key">Title Defenses</div></div>
        <div class="cb-stat"><div class="cb-stat-val" style="font-size:14px;padding-top:4px">${t.stats.longest}</div><div class="cb-stat-key">Longest Reign</div></div>
        <div class="cb-stat"><div class="cb-stat-val" style="font-size:14px;padding-top:4px">${t.stats.brand}</div><div class="cb-stat-key">Brand</div></div>
      </div>`;

    const historyRows = t.history
      ? `<div class="cb-history">
          <div class="cb-history-header">
            <div class="cb-th">#</div>
            <div class="cb-th">Champion</div>
            <div class="cb-th">Event</div>
            <div class="cb-th" style="text-align:center">Days</div>
            <div class="cb-th">Status</div>
          </div>
          ${t.history.map(h => `
            <div class="cb-history-row${h.status==='active'?' current-row':''}">
              <div class="cb-row-num">${h.n}</div>
              <div>
                <div class="cb-row-name${h.status==='active'?' current':''}">${h.name}</div>
                ${h.note ? `<div class="cb-row-note">${h.note}</div>` : ''}
              </div>
              <div class="cb-row-event">${h.event}</div>
              <div class="cb-row-days${h.status==='active'?' active':''}">${h.days}</div>
              <div class="cb-row-status ${h.status}">
                <div class="cb-row-status-dot"></div>
                ${h.status === 'active' ? 'Active Reign' : 'Former Champion'}
              </div>
            </div>`).join('')}
        </div>`
      : `<div class="cb-coming-soon">
          <div class="cb-cs-icon">${t.icon}</div>
          <div class="cb-cs-title">Championship Archive Pending</div>
          <div class="cb-cs-sub">Full title history records are being compiled and will be published shortly.</div>
        </div>`;

    const heroRight = t.champion !== 'Expanding'
      ? `<div class="cb-hero-right">${imgHtml}</div>`
      : `<div class="cb-hero-right"><div class="cb-hero-right-icon">${t.icon}</div></div>`;

    return `
      <div class="champ-block" data-div="${t.division}">
        <div class="cb-hero">
          <div class="cb-hero-bg"></div>
          <div class="cb-hero-glow"></div>
          <div class="cb-hero-left">
            <div class="cb-division-badge">${t.icon} &nbsp; ${t.divLabel}</div>
            <div class="cb-title-name">${t.name}</div>
            <div>
              <div class="cb-current-label">Current Champion</div>
              <div class="cb-champ-name">${t.champion}</div>
            </div>
            ${t.daysHeld ? `
            <div class="cb-days-row">
              <div class="cb-days-num">${t.daysHeld}</div>
              <div class="cb-days-label">Days &nbsp;·&nbsp; Active Reign</div>
            </div>
            <div class="cb-status-pill"><div class="cb-status-dot"></div><div class="cb-status-text">Active Reign</div></div>` : ''}
          </div>
          ${heroRight}
        </div>
        ${statsBar}
        <div class="cb-reign-spot">
          <div class="cb-reign-ey">Reign Spotlight</div>
          <div class="cb-reign-desc">${t.desc}</div>
        </div>
        ${historyRows}
      </div>`;
  }

  // ── WORLD TITLE RECORDS ──────────────────────────
  function renderRecords() {
    const wrap = document.getElementById('records-wrap');
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built = '1';

    const worldReigns = [
      { rank:1,  name:'John Cena',     reigns:18, note:'The most decorated World Champion in WWE history. 18 World Championship reigns — the all-time record.',            era:'Legend',  axf:true  },
      { rank:2,  name:'Ric Flair',     reigns:16, note:'The Nature Boy. 16 World Championship reigns — the original standard of excellence.',        era:'Legend',  axf:false },
      { rank:3,  name:'Triple H',      reigns:14, note:'The King of Kings. 14 World Title reigns built on evolution, politics and dominance.',        era:'Legend',  axf:true  },
      { rank:4,  name:'Randy Orton',   reigns:14, note:'The Viper. 14 reigns of cold-blooded, calculated championship history.',                     era:'Legend',  axf:true  },
      { rank:5,  name:'Edge',          reigns:11, note:'The Rated-R Superstar. 11 World Title reigns including one of the most celebrated careers.', era:'Legend',  axf:false },
      { rank:6,  name:'Danny',         reigns:12, note:'The God of Reckoning. 12-time World Champion. CEO of AXF. Most decorated active star.',      era:'Current', axf:true  },
      { rank:7,  name:'Mick Foley',    reigns:3,  note:'The Hardcore Legend. 3 WWE Championship reigns earned through pure heart and sacrifice.',    era:'Legend',  axf:false },
      { rank:8,  name:'Jayden',        reigns:8,  note:'The Veteran. 8-time World Champion. Current AXF Champion on SmackDown.',                     era:'Current', axf:true  },
      { rank:9,  name:'Brock Lesnar',  reigns:5,  note:'The Beast Incarnate. 5 World Title reigns built on pure physical destruction.',              era:'Legend',  axf:true  },
      { rank:10, name:'Logan Mathews', reigns:3,  note:'The Chosen One. 3-time World Champion. Current World Heavyweight Champion on RAW.',          era:'Current', axf:true  },
    ];

    const longestReigns = [
      { name:'Bruno Sammartino', title:'WWE Championship',              days:'2,803', note:'The longest single World Title reign in WWE history — nearly 8 years.',     highlight:false },
      { name:'Hulk Hogan',       title:'WWE Championship (1st Reign)', days:'1,474', note:'Four years of Hulkamania defining the golden era of professional wrestling.', highlight:false },
      { name:'Roman Reigns',     title:'Universal/WWE Championship',   days:'1,316', note:'The Tribal Chief. The longest reign in the modern WWE era.',                 highlight:false },
      { name:'Seth Rollins',     title:'World Heavyweight Championship', days:'316',   note:'The Visionary. Seth Rollins holds the record for the longest World Heavyweight Championship reign in history.', highlight:false },
      { name:'Logan Mathews',    title:'AXF World Heavyweight Champ.',   days:'209',   note:'Logan Mathews longest AXF World Heavyweight Championship reign — the AXF record for the title.',              highlight:true  },
      { name:'Pedro Morales',    title:'WWE Championship',             days:'1,027', note:'Over 1,000 days as champion in the foundational WWE era.',                   highlight:false },
      { name:'Danny',            title:'AXF Championship (5th Reign)', days:'525',   note:'The longest World Title reign of the AXF modern era. 525 days that defined The God of Reckoning as the most dominant champion of his generation.', highlight:true },
      { name:'CM Punk',          title:'WWE Championship',             days:'434',   note:'The second-longest modern era WWE Championship reign — 434 days of defiance.', highlight:false },
      { name:'Gunther',           title:'Intercontinental Championship',  days:'663',   note:'The Ring General. Gunther holds the all-time record for the longest Intercontinental Championship reign.',  highlight:false },
      { name:'Jon Moxley',        title:'United States Championship',     days:'351',   note:'Jon Moxley longest single United States Championship reign — the all-time record for the title.',          highlight:false },
      { name:'John Cena',        title:'WWE Championship (7th Reign)', days:'380',   note:'380-day seventh reign — one of Cena most dominant title defenses.',           highlight:false },
      { name:'Jayden',           title:'AXF Championship (2nd Reign)', days:'318',   note:'Jayden longest single AXF Championship reign — 318 days. One of the defining reigns of the modern era.', highlight:true  },
    ];

    const axfRecords = [
      { val:'12×',  name:'Danny',         label:'AXF World Title Reigns',        note:'The all-time AXF record for most World Championship reigns.' },
      { val:'525',  name:'Danny',         label:'Longest Modern Era Reign (Days)',note:"Danny's 5th reign — 525 days — the defining championship run of the AXF modern era." },
      { val:'318',  name:'Jayden',        label:'Longest AXF Reign (2nd Reign)', note:'Jayden longest single AXF Championship reign — 318 days during his dominant 2nd reign.' },
      { val:'209',  name:'Logan Mathews', label:'Longest AXF WHC Reign (RAW)',   note:'Logan Mathews longest World Heavyweight Championship reign — 209 days on RAW.' },
      { val:'133+', name:'Tyson Creed',   label:'Current IC Reign (RAW)',        note:'Former MMA fighter 101-09-02. No shortcuts on RAW.' },
      { val:'30+',  name:'Mathew Matt',   label:'Current US Reign (SmackDown)',  note:'The Hawaiian Destroyer holds US gold on SmackDown.' },
    ];

    wrap.innerHTML = `
      <div class="records-section-full fi">
        <div class="rec-sec-header">
          <div class="records-eyebrow">WWE &amp; AXF History — Combined Rankings</div>
          <h3 class="records-heading">Most <span class="g">World Championships</span></h3>
          <div class="records-divider"></div>
          <div class="records-subtitle">AXF Championship + World Heavyweight Championship + WWE Championship — All-Time</div>
        </div>
        <div class="reign-table">
          <div class="reign-table-head">
            <div class="rth-cell">#</div>
            <div class="rth-cell">Superstar</div>
            <div class="rth-cell">Visual</div>
            <div class="rth-cell rth-center">Reigns</div>
            <div class="rth-cell">Era</div>
            <div class="rth-cell rth-note">Note</div>
          </div>
          ${worldReigns.map(r => `
            <div class="reign-row${r.era === 'Current' ? ' reign-row-active' : ''}${r.name === 'Danny' ? ' reign-row-danny' : ''}">
              <div class="reign-cell rank-cell"><div class="rank-num${r.rank <= 4 ? ' rank-gold' : ''}">${r.rank}</div></div>
              <div class="reign-cell name-cell">
                <div class="reign-name">${r.name}</div>
                ${r.axf ? '<div class="axf-badge">AXF</div>' : ''}
              </div>
              <div class="reign-cell bar-cell">
                <div class="reigns-bar-wrap">
                  <div class="reigns-bar" style="width:${Math.round((r.reigns/16)*100)}%"></div>
                </div>
              </div>
              <div class="reign-cell reigns-num-cell"><span class="reigns-big">${r.reigns}</span></div>
              <div class="reign-cell era-cell"><div class="era-pill${r.era === 'Current' ? ' era-current' : ' era-legend'}">${r.era === 'Current' ? '⚡ Active' : '🏛️ Legend'}</div></div>
              <div class="reign-cell note-cell">${r.note}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="records-grid">
        <div class="records-section fi">
          <div class="records-eyebrow">All-Time Longest Single Reigns</div>
          <h3 class="records-heading">Longest <span class="g">Title Reigns</span></h3>
          <div class="records-divider"></div>
          <div class="records-subtitle">WWE history and AXF modern era combined</div>
          <div class="longest-list">
            ${longestReigns.map(r => `
              <div class="longest-row${r.highlight ? ' longest-highlight' : ''}">
                <div class="longest-days">
                  <div class="longest-days-num${r.highlight ? ' days-gold' : ''}">${r.days}</div>
                  <div class="longest-days-label">days</div>
                </div>
                <div class="longest-info">
                  <div class="longest-name">${r.name}</div>
                  <div class="longest-title-name">${r.title}</div>
                  <div class="longest-note">${r.note}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <div class="records-section fi">
          <div class="records-eyebrow">AXF Championship Statistics</div>
          <h3 class="records-heading">AXF <span class="g">Records</span></h3>
          <div class="records-divider"></div>
          <div class="records-subtitle">Current season and all-time records across all AXF championships</div>
          <div class="axf-rec-list">
            ${axfRecords.map(r => `
              <div class="axf-rec-row">
                <div class="axf-rec-left">
                  <div class="axf-rec-val">${r.val}</div>
                  <div class="axf-rec-label">${r.label}</div>
                </div>
                <div class="axf-rec-right">
                  <div class="axf-rec-name">${r.name}</div>
                  <div class="axf-rec-note">${r.note}</div>
                </div>
              </div>`).join('')}
          </div>
          <div class="danny-record-card">
            <div class="danny-rec-ey">Historic Achievement — The God of Reckoning</div>
            <div class="danny-rec-title">525 Days</div>
            <div class="danny-rec-sub">AXF Championship — 5th Reign</div>
            <div class="danny-rec-divider"></div>
            <div class="danny-rec-body">The longest World Title reign of the modern era and one of the defining achievements of The God of Reckoning legendary career. 525 days of dominance that redefined what it means to be champion in AXF.</div>
          </div>
        </div>
      </div>`;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.reigns-bar').forEach((bar, i) => {
            const w = bar.style.width; bar.style.width = '0';
            bar.style.transition = 'width .8s ease ' + (i * 0.06) + 's';
            setTimeout(() => { bar.style.width = w; }, 80);
          });
          e.target.querySelectorAll('.reign-row').forEach((row, i) => {
            row.style.opacity = '0'; row.style.transform = 'translateX(-14px)';
            row.style.transition = 'all .4s ease ' + (i * 0.05) + 's';
            setTimeout(() => { row.style.opacity = '1'; row.style.transform = 'none'; }, 60);
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    wrap.querySelectorAll('.reign-table, .longest-list').forEach(el => obs.observe(el));
  }

  // ── EVENTS ────────────────────────────────────────
  function renderEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';
    grid.innerHTML = AXF.events.map(ev => {
      const isFeat      = ev.featured;
      const hasPoster   = !!ev.poster;
      const isNext      = ev.status === 'next';
      const isCompleted = ev.status === 'completed';
      const statusDot   = isNext ? 'next' : isCompleted ? 'comp' : 'fut';
      const statusTxt   = isNext ? 'Up Next' : isCompleted ? 'Completed' : 'Forthcoming';
      const hasResults  = ev.results && ev.results.length > 0;

      const resultsHtml = hasResults
        ? `<div class="ppv-results">
            <div class="ppv-results-label">Event Highlights</div>
            ${ev.results.map(r => `
              <div class="ppv-result-row">
                <span class="ppv-result-icon">${r.icon}</span>
                <div class="ppv-result-body">
                  <div class="ppv-result-label">${r.label}</div>
                  <div class="ppv-result-text">${r.text}</div>
                </div>
              </div>`).join('')}
          </div>`
        : '';

      if (hasPoster) {
        return `
          <div class="ppv-card has-poster${isFeat ? ' ppv-feat' : ''}${isNext ? ' current' : ''}${isCompleted ? ' ppv-completed' : ''}">
            ${isNext ? '<div class="ppv-badge">▲ Next Event</div>' : ''}
            ${isCompleted ? '<div class="ppv-badge ppv-badge-done">✓ Completed</div>' : ''}
            <div class="ppv-poster-wrap">
              <img src="data:image/jpeg;base64,${ev.poster}" alt="${ev.name}" loading="lazy"/>
              <div class="ppv-poster-ov"></div>
              <div class="ppv-poster-info">
                <div class="ppv-poster-status">
                  <div class="ppv-dot ${statusDot}"></div>
                  <div class="ppv-status-text ${statusDot}">${statusTxt}</div>
                </div>
              </div>
            </div>
            ${hasResults ? `<div class="ppv-body ppv-body-results">${resultsHtml}</div>` : (isNext ? `<div class="ppv-body">${ev.matches.map(m=>`<div class="match-card"><div class="match-stip">${m.stipulation}</div><div class="match-names">${m.names}</div></div>`).join('')}</div>` : '')}
          </div>`;
      }

      return `
        <div class="ppv-card${isFeat ? ' ppv-feat' : ''}${isNext ? ' current' : ''}">
          ${isNext ? '<div class="ppv-badge">▲ Next Event</div>' : ''}
          <div class="ppv-banner">
            <div class="ppv-banner-bg" style="background:linear-gradient(135deg,${ev.color},#000)"></div>
            <div class="ppv-banner-icon">${ev.icon}</div>
          </div>
          <div class="ppv-body">
            <div class="ppv-season">AXF Season 3</div>
            <div class="ppv-name">${ev.name}</div>
            <div class="ppv-divid"></div>
            <div class="ppv-status-row"><div class="ppv-dot ${statusDot}"></div><div class="ppv-status-text ${statusDot}">${statusTxt}</div></div>
            <div class="ppv-desc">${ev.slogan}</div>
          </div>
        </div>`;
    }).join('');
  }

  // ── NEWS ──────────────────────────────────────────
  function renderNews() {
    const wrap = document.getElementById('news-wrap');
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built = '1';
    const feat = AXF.news.find(n => n.featured);
    const rest = AXF.news.filter(n => !n.featured);
    const ceoDesk  = AXF.danny_ceo ? AXF.danny_ceo.desk  : null;
    const ceoBoard = AXF.danny_ceo ? AXF.danny_ceo.board : null;

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
      </div>
      ${ceoBoard && ceoDesk ? `
      <div class="ceo-announce-wrap fi">
        <div class="ceo-announce-inner">
          <div class="ceo-img-pair">
            <div class="ceo-img-card ceo-img-main">
              <img src="data:image/png;base64,${ceoBoard}" alt="Danny CEO Board Room" loading="lazy"/>
              <div class="ceo-img-caption">Danny at the AXF Board — Money in the Bank</div>
            </div>
            <div class="ceo-img-card">
              <img src="data:image/png;base64,${ceoDesk}" alt="Danny CEO" loading="lazy"/>
              <div class="ceo-img-caption">The God of Reckoning. The CEO of AXF.</div>
            </div>
          </div>
          <div class="ceo-announce-text">
            <div class="ceo-announce-ey">Official AXF Executive Announcement</div>
            <h3 class="ceo-announce-h">The Reckoning Is Complete</h3>
            <div class="ceo-announce-divid"></div>
            <p class="ceo-announce-body">Stephanie McMahon took to the stage at Money in the Bank and made it official before the entire AXF Universe. After months of shareholder consolidation, board negotiations, and systematic restructuring — Danny has been unanimously ratified as Chief Executive Officer of Axiom Wrestling Federation.</p>
            <p class="ceo-announce-body">The old regime is finished. The TKO Authority no longer controls this company. The board voted. The contracts were signed. And Danny — the man who started wrestling at 16, who won 12 World Championships, who carried this company on his back for a decade — now owns the building that made him.</p>
            <div class="ceo-quote">"This was never about the title. It was always about the throne."</div>
            <div class="ceo-quote-attr">— Danny, Money in the Bank</div>
          </div>
        </div>
      </div>` : ''}`;
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
