// AXF — Axiom Wrestling Federation | app.js
// Season 3 — Timeline Locked

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ────────────────────────────────────────
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('ldr').classList.add('out'), 2300);
  });

  // ── NAV SCROLL ────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('sc', scrollY > 60));

  // ── MOBILE MENU ───────────────────────────────────
  const mob = document.getElementById('mob');
  document.getElementById('burger').addEventListener('click', () => mob.classList.toggle('open'));
  document.querySelectorAll('.mob a').forEach(a => a.addEventListener('click', () => mob.classList.remove('open')));

  // ── SPA ROUTING ───────────────────────────────────
  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('[data-page]').forEach(a => a.classList.toggle('active', a.dataset.page === id));
    const page = document.getElementById('page-' + id);
    if (page) { page.classList.add('active'); window.scrollTo(0,0); renderPage(id); triggerFI(); }
  }
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showPage(el.dataset.page); mob.classList.remove('open'); });
  });

  // ── FADE-IN OBSERVER ──────────────────────────────
  function triggerFI() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }});
    }, { threshold: 0.06 });
    document.querySelectorAll('.fi:not(.on)').forEach(el => obs.observe(el));
  }

  // ── TICKER ────────────────────────────────────────
  function buildTicker() {
    const items = [
      'DANNY OFFICIALLY NAMED CEO — STEPHANIE McMAHON ANNOUNCES AT MONEY IN THE BANK',
      'JAYDEN REIGNING AXF CHAMPION — 181 DAYS ON SMACKDOWN',
      'LOGAN MATHEWS — THREE-TIME WORLD HEAVYWEIGHT CHAMPION ON RAW',
      'TYSON CREED RETAINS IC TITLE — FORMER MMA FIGHTER 101-09-02',
      'MATT CROSS — UNITED STATES CHAMPION — KONA HAWAII',
      'DAMIAN COOPER TURNS ON JAYDEN — THE BETRAYAL IS COMPLETE',
      'SUMMERSLAM IS NEXT — WHERE LEGENDS IGNITE — TWO NIGHTS',
      'AXF WAR ROOM PODCAST — NOW ON SPOTIFY',
      'VIKTOR DRAGUNOV HAS ARRIVED — THE SIBERIAN VERDICT IS OPEN FOR BUSINESS — EVERYONE BREAKS',
    ];
    const doubled = [...items,...items];
    const tt = document.querySelector('.tt');
    if (tt) tt.innerHTML = doubled.map(t => `<span>${t}</span>`).join('');
  }

  // ── PAGE ROUTER ───────────────────────────────────
  function renderPage(id) {
    const fn = {
      home:       renderHome,
      superstars: renderSuperstars,
      champions:  () => { renderChampions(); renderRecords(); },
      events:     renderEvents,
      news:       renderNews,
      storylines: renderStorylines,
      legends:    renderLegends,
      gallery:    renderGallery,
      media:      renderMedia,
      patreon:    renderPatreonArt,
      about:      () => {},
      contact:    renderContact,
    };
    if (fn[id]) fn[id]();
  }

  // ── IMAGE DATA ────────────────────────────────────
  const IMGS = AXF._imgs;

  // Map roster IDs to images
  function rosterImg(id) {
    const map = {danny:'danny',jayden:'jayden',austin:'austin',logan:'logan',
                 damian:'damian',tyson:'tyson',camron:'camron',benjamin:'benjamin',titan:'titan'};
    if (map[id] && IMGS[map[id]]) return IMGS[map[id]];
    // Fallback: check roster entry directly (e.g. Viktor has img embedded in roster)
    const r = AXF.roster.find(x => x.id === id);
    return (r && r.img) ? r.img : null;
  }
  function champImg(id) {
    const map = {jayden:'jayden_c',logan:'logan_c',tyson:'tyson_c',mathew:'mathew_c',titan:'mathew_c'};
    return IMGS[map[id]] || null;
  }

  // ── HOME ──────────────────────────────────────────
  function renderHome() {
    // Hero stats
    const st = document.getElementById('hero-stats');
    if (st && !st.dataset.built) {
      st.dataset.built='1';
      st.innerHTML = [
        {n:'S3',l:'Season Three'},{n:'12×',l:"Danny's Titles"},
        {n:'E9',l:'Current Episode'},{n:'10',l:'Active Superstars'},
      ].map(s=>`<div><div class="hstat-n">${s.n}</div><div class="hstat-l">${s.l}</div></div>`).join('');
    }

    // News grid (AEW style: big left + stack right)
    const ng = document.getElementById('home-news-grid');
    if (ng && !ng.dataset.built) {
      ng.dataset.built='1';
      const feat = AXF.news.find(n=>n.featured);
      const rest = AXF.news.filter(n=>!n.featured).slice(0,4);
      ng.innerHTML = `
        <div class="news-main-card">
          <img src="data:image/jpeg;base64,${IMGS.danny_board}" alt="${feat.headline}"/>
          <div class="news-main-ov"></div>
          <div class="news-main-info">
            <div class="news-tag">${feat.cat}</div>
            <div class="news-main-h">${feat.headline}</div>
            <div class="news-main-body">${feat.body}</div>
            <div class="news-main-meta">AXF Editorial · <span>${feat.date}</span> · Breaking</div>
          </div>
        </div>
        <div class="news-stack">
          ${rest.map(n=>`
            <div class="news-card-sm">
              <div class="news-sm-tag ${n.catClass}">${n.cat}</div>
              <div class="news-sm-h">${n.headline}</div>
              <div class="news-sm-date">${n.date}</div>
            </div>`).join('')}
        </div>`;
    }

    // Champs preview
    const chEl = document.getElementById('home-champs');
    if (chEl && !chEl.dataset.built) {
      chEl.dataset.built='1';
      chEl.innerHTML = AXF.champions.slice(0,3).map(c => {
        const ci = champImg(c.id==='axf'?'jayden':c.id==='whc'?'logan':c.id==='ic'?'tyson':'mathew');
        if (ci) return `
          <div class="cc${c.tier==='world'?' ft':''}">
            <div class="cc-render${c.tier==='world'?'':' cc-render-sm'}">
              <img src="data:image/jpeg;base64,${ci}" alt="${c.holder}" loading="lazy"/>
              <div class="cc-render-ov"></div>
              <div class="cc-info-over">
                <div class="cc-type">${c.tier==='world'?'World Title':'Mid-Card'}</div>
                <div class="cc-name">${c.title}</div>
                <div class="cc-div"></div>
                <div class="cc-lbl">Current Champion</div>
                <div class="cc-champ">${c.holder}</div>
                <div class="cc-reign">${c.reign}</div>
              </div>
            </div>
          </div>`;
        return `<div class="cc"><div class="cc-plain"><div class="cc-icon">${c.icon}</div><div class="cc-type">${c.tier}</div><div class="cc-name">${c.title}</div><div class="cc-div"></div><div class="cc-lbl">Current Champion</div><div class="cc-champ">${c.holder}</div></div></div>`;
      }).join('');
    }

    // Storylines preview (hot only, first 2)
    const slEl = document.getElementById('home-storylines');
    if (slEl && !slEl.dataset.built) {
      slEl.dataset.built='1';
      AXF.storylines.filter(s=>s.status==='hot').slice(0,2).forEach(s => {
        const div = document.createElement('div');
        div.className = 'slc hot';
        div.innerHTML = `<div class="sl-st hot"><div class="sd"></div>${s.label}</div>
          <div class="sl-mu">${s.names.map((n,i)=>`<div class="sl-n">${n}</div>${i<s.names.length-1?`<div class="sl-v">${s.connector}</div>`:''}`).join('')}</div>
          <p class="sl-desc">${s.desc}</p><div class="sl-sk">${s.stakes}</div>`;
        slEl.appendChild(div);
      });
    }

    // Gallery preview
    const galEl = document.getElementById('home-gallery');
    if (galEl && !galEl.dataset.built) {
      galEl.dataset.built='1';
      const galKeys = ['gal1','gal2','gal3','gal4','gal5','gal6'];
      const galData = AXF.gallery || [];
      galEl.innerHTML = galKeys.slice(0,6).map((k,i) => {
        const g = galData[i] || {caption:'AXF Moment',event:'Season 3'};
        return `<div class="gal-item" onclick="window.openLightbox('${k}','${g.caption}','${g.event}')">
          <img src="data:image/jpeg;base64,${IMGS[k]}" alt="${g.caption}" loading="lazy"/>
          <div class="gal-ov"></div>
          <div class="gal-info"><div class="gal-event">${g.event}</div><div class="gal-cap">${g.caption}</div></div>
          <div class="gal-zoom">⤢</div>
        </div>`;
      }).join('');
    }

    // Match spotlight
    const motnEl = document.getElementById('home-motn');
    if (motnEl && !motnEl.dataset.built) {
      motnEl.dataset.built='1';
      const matches = [
        {n:'Match of the Season', match:'Logan Mathews vs Austin Crimson', event:'AXF Bad Blood — Hell in a Cell', result:'Logan Mathews Retains World Heavyweight Championship'},
        {n:'Championship Moment', match:'Logan Mathews — Three-Time World Champion', event:'Season 3 Milestone', result:'Three-Time World Heavyweight Champion'},
        {n:'Rising Star Match', match:'Mathew Cross vs Damian Cooper', event:'Money in the Bank', result:'Matt Cross Wins United States Championship'},
      ];
      motnEl.innerHTML = matches.map(m=>`
        <div class="motn-card">
          <div class="motn-n">${m.n}</div>
          <div class="motn-match">${m.match}</div>
          <div class="motn-event">${m.event}</div>
          <div class="motn-result">⚡ ${m.result}</div>
        </div>`).join('');
    }
  }

  // ── SUPERSTARS ────────────────────────────────────
  function renderSuperstars() {
    const grid = document.getElementById('ss-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built='1';
    grid.innerHTML = AXF.roster.map(r => {
      const ri = rosterImg(r.id);
      const imgH = ri
        ? `<img src="data:image/jpeg;base64,${ri}" alt="${r.name}" loading="lazy"/>`
        : `<div class="ph">🤼</div>`;
      const statH = r.stats.map(s=>`<div class="ss"><strong>${s.v}</strong>${s.l}</div>`).join('');
      const champTag = r.id==='jayden'?'AXF CHAMP':r.id==='logan'?'WHC CHAMP':
        r.id==='tyson'?'IC CHAMP':r.id==='titan'?'US CHAMP':
        (r.id==='camron'||r.id==='benjamin')?'TAG CHAMP':r.id==='danny'?'CEO · AXF':'';
      return `
        <div class="sc" data-tier="${r.tier}" data-align="${r.align.toLowerCase()}" onclick="window.openModal('${r.id}')">
          <div class="sc-img">${imgH}<div class="sc-ov"></div></div>
          <div class="sc-top">
            <div class="ab ${r.align.toLowerCase()}">${r.align}</div>
            ${champTag?`<div class="ctg">${champTag}</div>`:''}
          </div>
          <div class="sc-info">
            <div class="sc-nick">${r.nick}</div>
            <div class="sc-name">${r.name}</div>
            <div class="sc-stats">${statH}</div>
          </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.fb').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fb').forEach(b=>b.classList.remove('on'));
        btn.classList.add('on');
        const f = btn.dataset.filter;
        document.querySelectorAll('.sc').forEach(c => {
          c.style.display = (f==='all'||c.dataset.tier===f||c.dataset.align===f)?'flex':'none';
        });
      });
    });
  }

  // ── MODAL ─────────────────────────────────────────
  window.openModal = function(id) {
    const r = AXF.roster.find(x=>x.id===id);
    if (!r) return;
    const ri = rosterImg(id);
    const imgH = ri
      ? `<img src="data:image/jpeg;base64,${ri}" alt="${r.name}"/><div class="mi-ov"></div>`
      : `<div class="pio">🤼</div>`;
    const statH = r.stats.map(s=>`<div class="mstat"><div class="mstat-v">${s.v}</div><div class="mstat-l">${s.l}</div></div>`).join('');
    document.getElementById('modal-content').innerHTML = `
      <div class="mh">
        <div class="mi">${imgH}</div>
        <div class="md">
          <div class="md-badge"><span class="ab ${r.align.toLowerCase()}">${r.align}</span></div>
          <div class="md-nick">${r.nick}</div>
          <div class="md-name">${r.name}</div>
          <div class="md-tag">${r.tagline}</div>
          <div class="md-stats">${statH}</div>
          <div><div class="md-sec-t">Moves &amp; Finisher</div><div class="md-sec-b">${r.moves}</div></div>
        </div>
      </div>
      <div class="md-lower">
        <div><div class="md-sec-t">Championship History</div><div class="md-sec-b">${r.history}</div></div>
        <div><div class="md-sec-t">Current Status</div><div class="md-sec-b">${r.status}</div></div>
        <div><div class="md-sec-t">Motivation</div><div class="md-sec-b">${r.motivation}</div></div>
        <div><div class="md-sec-t">Key Rivalries</div><div class="md-sec-b">${r.rivalries}</div></div>
      </div>`;
    document.getElementById('modal-bg').classList.add('open');
    document.body.style.overflow='hidden';
  };
  window.closeModal = function() {
    document.getElementById('modal-bg').classList.remove('open');
    document.body.style.overflow='';
  };
  document.getElementById('modal-bg').addEventListener('click',e=>{if(e.target===document.getElementById('modal-bg'))window.closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){window.closeModal();window.closeLightbox();}});

  // ── CHAMPIONS ─────────────────────────────────────
  function renderChampions() {
    const tabs = document.getElementById('champ-tabs');
    if (tabs && !tabs.dataset.built) {
      tabs.dataset.built='1';
      const tabDefs = [
        {k:'all',l:'All Titles'},{k:'world',l:'World Titles'},
        {k:'mid',l:'Midcard Titles'},{k:'tag',l:'Tag Titles'},{k:'women',l:"Women's Title"},
      ];
      tabs.innerHTML = tabDefs.map(t=>`<button class="title-tab${t.k==='all'?' on':''}" data-div="${t.k}">${t.l}</button>`).join('');
      tabs.querySelectorAll('.title-tab').forEach(btn=>{
        btn.addEventListener('click',()=>{
          tabs.querySelectorAll('.title-tab').forEach(b=>b.classList.remove('on'));
          btn.classList.add('on');
          const div=btn.dataset.div;
          document.querySelectorAll('.champ-block').forEach(s=>{
            s.style.display=(div==='all'||s.dataset.div===div)?'':'none';
          });
        });
      });
    }
    const wrap = document.getElementById('champ-archive');
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built='1';
    if (!AXF.championships) return;

    wrap.innerHTML = AXF.championships.map(t => {
      const ci = champImg(t.id==='axf-championship'?'jayden':t.id==='world-heavyweight-championship'?'logan':t.id==='intercontinental-championship'?'tyson':'mathew');
      const hasDays = t.daysHeld!==null;
      const isActive = t.status==='Active Reign';

      const heroHtml = `
        <div class="cb-hero">
          <div class="cb-hero-bg"></div>
          <div class="cb-hero-glow"></div>
          <div class="cb-hero-left">
            <div class="cb-division-badge">${t.divisionLabel}</div>
            <div class="cb-title-name">${t.name}</div>
            <div><div class="cb-current-label">Current Champion</div><div class="cb-champ-name">${t.champion}</div>${t.championAlso?`<div class="cb-also">${t.championAlso}</div>`:''}</div>
            ${hasDays?`<div class="cb-days-row"><div class="cb-days-num">${t.daysHeld}</div><div class="cb-days-label">Days as Champion</div></div>`:''}
            <div class="cb-status-pill${!isActive?' inactive':''}"><div class="cb-status-dot"></div><div class="cb-status-text">${t.status}</div></div>
          </div>
          <div class="cb-hero-right">
            ${ci?`<img src="data:image/jpeg;base64,${ci}" alt="${t.champion}" loading="lazy"/><div class="cb-hero-right-fade"></div>`:`<div class="cb-hero-right-icon">${t.division==='tag'?'🤝':t.division==='women'?'⭐':'🏆'}</div>`}
          </div>
        </div>`;

      const statsHtml = `
        <div class="cb-stats-bar">
          <div class="cb-stat"><div class="cb-stat-val">${hasDays?t.daysHeld+'':' —'}</div><div class="cb-stat-key">Days Held</div></div>
          <div class="cb-stat"><div class="cb-stat-val">${t.stats.defenses}</div><div class="cb-stat-key">Defenses</div></div>
          <div class="cb-stat"><div class="cb-stat-val" style="font-size:13px;line-height:1.3">${t.stats.longest}</div><div class="cb-stat-key">Longest Reign</div></div>
          <div class="cb-stat"><div class="cb-stat-val">${t.stats.brand}</div><div class="cb-stat-key">Brand</div></div>
        </div>`;

      const descHtml = `
        <div class="cb-reign-spot">
          <div class="cb-reign-ey">Current Reign Spotlight</div>
          <div class="cb-reign-desc">${t.description}</div>
        </div>`;

      let histHtml = '';
      if (t.history && t.history.length) {
        const rows = t.history.map(h=>`
          <div class="cb-history-row${h.status==='current'?' current-row':''}">
            <div class="cb-row-num">${h.reign>0?h.reign:'—'}</div>
            <div class="cb-row-name${h.status==='current'?' current':''}">${h.champion}${h.status==='current'?` <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:800;letter-spacing:.2em;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.3);color:var(--gold);padding:2px 8px;margin-left:8px;vertical-align:middle">ACTIVE</span>`:''}</div>
            <div class="cb-row-days${h.status==='current'?' active':''}">${h.days}</div>
            <div class="cb-row-note">${h.note}</div>
          </div>`).join('');
        histHtml = `<div class="cb-history">
          <div class="cb-history-header">
            <div class="cb-th">#</div><div class="cb-th">Champion</div>
            <div class="cb-th">Days</div><div class="cb-th">Notes</div>
          </div>${rows}</div>`;
      } else {
        histHtml = `<div class="cb-coming-soon" style="text-align:center;padding:44px;background:var(--bcard)">
          <div style="font-size:32px;opacity:.3;margin-bottom:14px">📋</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:var(--sv);letter-spacing:.06em">Title History Archive Pending</div>
          <div style="font-family:'Barlow',sans-serif;font-size:13px;color:var(--mu);margin-top:6px">Championship records being compiled.</div>
        </div>`;
      }

      return `<div class="champ-block" data-div="${t.division}">${heroHtml}${statsHtml}${descHtml}${histHtml}</div>`;
    }).join('');
  }

  // ── RECORDS ───────────────────────────────────────
  function renderRecords() {
    const wrap = document.getElementById('records-wrap');
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built='1';

    const worldReigns = [
      {rank:1, name:'John Cena',    reigns:18,note:'The most decorated World Champion — 18 World Title reigns, the all-time record.',         era:'Legend', axf:true},
      {rank:2, name:'Ric Flair',    reigns:16,note:'The Nature Boy. 16 World Championship reigns — the original standard of excellence.',     era:'Legend', axf:false},
      {rank:3, name:'Triple H',     reigns:14,note:'The King of Kings. 14 World Title reigns built on evolution, politics and dominance.',    era:'Legend', axf:true},
      {rank:4, name:'Randy Orton',  reigns:14,note:'The Viper. 14 reigns of cold-blooded, calculated championship history.',                  era:'Legend', axf:true},
      {rank:5, name:'Edge',         reigns:11,note:'The Rated-R Superstar. 11 World Title reigns across an iconic career.',                  era:'Legend', axf:false},
      {rank:6, name:'Danny',        reigns:12,note:'The God of Reckoning. 12-time World Champion. CEO of AXF. Most decorated active star.',   era:'Current',axf:true},
      {rank:7, name:'Jayden',       reigns:8, note:'The Veteran. 8-time World Champion. Current AXF Champion on SmackDown.',                 era:'Current',axf:true},
      {rank:8, name:'Brock Lesnar', reigns:5, note:'The Beast Incarnate. 5 World Title reigns built on pure physical destruction.',          era:'Legend', axf:true},
      {rank:9, name:'Logan Mathews',reigns:3, note:'The Chosen One. 3-time World Champion. Current WHC on RAW. The next era.',               era:'Current',axf:true},
    ];

    const longestReigns = [
      {name:'Bruno Sammartino',title:'WWE Championship',           days:'2,803',note:'The longest single World Title reign in WWE history.',      highlight:false},
      {name:'Hulk Hogan',      title:'WWE Championship (1st)',     days:'1,474',note:'Four years of Hulkamania defining the golden era.',          highlight:false},
      {name:'Roman Reigns',    title:'Universal/WWE Championship', days:'1,316',note:'The Tribal Chief — longest reign in modern WWE history.',    highlight:false},
      {name:'Pedro Morales',   title:'WWE Championship',           days:'1,027',note:'Over 1,000 days in the foundational WWE era.',              highlight:false},
      {name:'Danny',           title:'AXF Championship (5th Reign)',days:'525', note:'Longest World Title reign of the AXF modern era — 525 days that defined The God of Reckoning as the most dominant champion of his generation.',highlight:true},
      {name:'CM Punk',         title:'WWE Championship',           days:'434',  note:'The second-longest modern era WWE Championship reign.',      highlight:false},
      {name:'John Cena',       title:'WWE Championship (7th)',     days:'380',  note:'380-day seventh reign — one of Cena most dominant runs.',    highlight:false},
      {name:'Seth Rollins',    title:'World Heavyweight Champ.',   days:'316',  note:'The Visionary holds the all-time WHC record.',              highlight:false},
      {name:'Jon Moxley',      title:'United States Championship', days:'351',  note:'Jon Moxley holds the all-time US Championship reign record.',highlight:false},
      {name:'Gunther',         title:'Intercontinental Champ.',    days:'663',  note:'The Ring General — all-time IC Championship reign record.',  highlight:false},
      {name:'Jayden',          title:'AXF Championship (2nd Reign)',days:'318', note:'Jayden longest single AXF Championship reign — 318 days during his dominant 2nd reign.',highlight:true},
    ];

    const axfRecords = [
      {val:'12×', name:'Danny',         label:'AXF World Title Reigns',         note:'The all-time AXF record for most World Championship reigns.'},
      {val:'525', name:'Danny',         label:'Longest Modern Era Reign (Days)', note:"Danny 5th reign — 525 days — the defining championship run of the modern era."},
      {val:'318', name:'Jayden',        label:'Longest Single AXF Reign (Days)',note:'Jayden 2nd reign — 318 days — one of the defining reigns in AXF history.'},
      {val:'181+',name:'Jayden',        label:'Current AXF Reign (SmackDown)',  note:'The Veteran continues his AXF Championship reign on SmackDown.'},
      {val:'209', name:'Logan Mathews', label:'Longest AXF WHC Reign (RAW)',    note:'Logan Mathews longest World Heavyweight Championship reign — 209 days.'},
      {val:'133+',name:'Tyson Creed',   label:'Current IC Reign (RAW)',         note:'Former MMA fighter. 101-09-02. No shortcuts on RAW.'},
    ];

    wrap.innerHTML = `
      <div class="records-section-full fi">
        <div class="rec-sec-header">
          <div class="records-eyebrow">WWE &amp; AXF History — Combined Rankings</div>
          <div class="records-heading">Most <span class="g">World Championships</span></div>
          <div class="records-divider"></div>
          <div class="records-subtitle">AXF Championship + World Heavyweight Championship + WWE Championship — All-Time</div>
        </div>
        <div class="reign-table">
          <div class="reign-table-head">
            <div class="rth-cell">#</div><div class="rth-cell">Superstar</div>
            <div class="rth-cell">Visual</div><div class="rth-cell">Total</div>
            <div class="rth-cell">Era</div><div class="rth-cell">Note</div>
          </div>
          ${worldReigns.map(r=>`
            <div class="reign-row${r.era==='Current'?' reign-row-active':''}${r.name==='Danny'?' reign-row-danny':''}">
              <div class="reign-cell rank-cell"><div class="rank-num${r.rank<=4?' rank-gold':''}">${r.rank}</div></div>
              <div class="reign-cell name-cell"><div class="reign-name">${r.name}</div>${r.axf?'<div class="axf-badge">AXF</div>':''}</div>
              <div class="reign-cell bar-cell"><div class="reigns-bar-wrap"><div class="reigns-bar" style="width:${Math.round((r.reigns/18)*100)}%"></div></div></div>
              <div class="reign-cell reigns-num-cell"><span class="reigns-big">${r.reigns}</span></div>
              <div class="reign-cell era-cell"><div class="era-pill ${r.era==='Current'?'era-current':'era-legend'}">${r.era==='Current'?'⚡ Active':'🏛️ Legend'}</div></div>
              <div class="reign-cell note-cell">${r.note}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="records-grid">
        <div class="records-section fi">
          <div class="records-eyebrow">All-Time Longest Single Reigns</div>
          <div class="records-heading">Longest <span class="g">Title Reigns</span></div>
          <div class="records-divider"></div>
          <div class="records-subtitle">WWE history and AXF modern era combined</div>
          <div class="longest-list">
            ${longestReigns.map(r=>`
              <div class="longest-row${r.highlight?' longest-highlight':''}">
                <div class="longest-days">
                  <div class="longest-days-num${r.highlight?' days-gold':''}">${r.days}</div>
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
          <div class="records-heading">AXF <span class="g">Records</span></div>
          <div class="records-divider"></div>
          <div class="records-subtitle">Current season and all-time records</div>
          <div class="axf-rec-list">
            ${axfRecords.map(r=>`
              <div class="axf-rec-row">
                <div class="axf-rec-left"><div class="axf-rec-val">${r.val}</div><div class="axf-rec-label">${r.label}</div></div>
                <div class="axf-rec-right"><div class="axf-rec-name">${r.name}</div><div class="axf-rec-note">${r.note}</div></div>
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

    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.querySelectorAll('.reigns-bar').forEach((bar,i)=>{
            const w=bar.style.width;bar.style.width='0';
            bar.style.transition='width .8s ease '+(i*.06)+'s';
            setTimeout(()=>{bar.style.width=w;},80);
          });
          e.target.querySelectorAll('.reign-row').forEach((row,i)=>{
            row.style.opacity='0';row.style.transform='translateX(-12px)';
            row.style.transition='all .4s ease '+(i*.05)+'s';
            setTimeout(()=>{row.style.opacity='1';row.style.transform='none';},60);
          });
          obs.unobserve(e.target);
        }
      });
    },{threshold:.08});
    wrap.querySelectorAll('.reign-table,.longest-list').forEach(el=>obs.observe(el));
  }

  // ── EVENTS ────────────────────────────────────────
  function renderEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built='1';
    grid.innerHTML = AXF.events.map(ev=>{
      const isFeat=ev.featured, hasPoster=!!ev.poster;
      const isNext=ev.status==='next', isComp=ev.status==='completed';
      const sDot=isNext?'next':isComp?'comp':'fut';
      const sTxt=isNext?'Up Next':isComp?'Completed':'Forthcoming';
      const hasResults=ev.results&&ev.results.length>0;

      const resultsHtml=hasResults?`<div class="ppv-results">
        <div class="ppv-results-label">Event Highlights</div>
        ${ev.results.map(r=>`<div class="ppv-result-row">
          <span class="ppv-result-icon">${r.icon}</span>
          <div><div class="ppv-result-label">${r.label}</div><div class="ppv-result-text">${r.text}</div></div>
        </div>`).join('')}</div>`:'';

      if (hasPoster) return `
        <div class="ppv-card has-poster${isFeat?' ppv-feat':''}${isNext?' current':''}${isComp?' ppv-completed':''}">
          ${isNext?'<div class="ppv-badge">▲ Next Event</div>':''}
          ${isComp?'<div class="ppv-badge ppv-badge-done">✓ Completed</div>':''}
          <div class="ppv-poster-wrap">
            <img src="data:image/jpeg;base64,${ev.poster}" alt="${ev.name}" loading="lazy"/>
            <div class="ppv-poster-ov"></div>
            <div class="ppv-poster-info"><div class="ppv-poster-status">
              <div class="ppv-dot ${sDot}"></div><div class="ppv-status-text ${sDot}">${sTxt}</div>
            </div></div>
          </div>
          ${hasResults?`<div class="ppv-body">${resultsHtml}</div>`:isNext?`<div class="ppv-body">${ev.matches.map(m=>`<div class="match-card"><div class="match-stip">${m.stipulation}</div><div class="match-names">${m.names}</div></div>`).join('')}</div>`:''}
        </div>`;

      return `
        <div class="ppv-card${isFeat?' ppv-feat':''}${isNext?' current':''}">
          ${isNext?'<div class="ppv-badge">▲ Next Event</div>':''}
          <div class="ppv-banner"><div class="ppv-banner-bg" style="background:linear-gradient(135deg,${ev.color},#000)"></div><div class="ppv-banner-icon">${ev.icon}</div></div>
          <div class="ppv-body">
            <div class="ppv-season">AXF Season 3</div>
            <div class="ppv-name">${ev.name}</div>
            <div class="ppv-divid"></div>
            <div class="ppv-status-row" style="display:flex;align-items:center;gap:6px"><div class="ppv-dot ${sDot}"></div><div class="ppv-status-text ${sDot}">${sTxt}</div></div>
            <div class="ppv-desc">${ev.slogan}</div>
          </div>
        </div>`;
    }).join('');
  }

  // ── NEWS ──────────────────────────────────────────
  function renderNews() {
    const wrap = document.getElementById('news-wrap');
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built='1';
    const feat = AXF.news.find(n=>n.featured);
    const rest = AXF.news.filter(n=>!n.featured);
    const ceoDesk  = IMGS.danny_desk;
    const ceoBoard = IMGS.danny_board;

    wrap.innerHTML = `
      <div class="news-hero-grid">
        <div class="news-main-card">
          <img src="data:image/jpeg;base64,${ceoBoard}" alt="${feat.headline}"/>
          <div class="news-main-ov"></div>
          <div class="news-main-info">
            <div class="news-tag">${feat.cat}</div>
            <div class="news-main-h">${feat.headline}</div>
            <div class="news-main-body">${feat.body}</div>
            <div class="news-main-meta">AXF Editorial · <span>${feat.date}</span> · Breaking</div>
          </div>
        </div>
        <div class="news-stack">
          ${rest.map(n=>`<div class="news-card-sm">
            <div class="news-sm-tag ${n.catClass}">${n.cat}</div>
            <div class="news-sm-h">${n.headline}</div>
            <div class="news-sm-date">${n.date}</div>
          </div>`).join('')}
        </div>
      </div>
      ${ceoBoard&&ceoDesk?`
      <div class="ceo-announce-wrap" style="margin-top:2px">
        <div class="ceo-announce-inner">
          <div class="ceo-img-pair">
            <div class="ceo-img-card ceo-img-main"><img src="data:image/jpeg;base64,${ceoBoard}" alt="Danny CEO Board Room" loading="lazy"/><div class="ceo-img-caption">Danny at the AXF Board — Money in the Bank</div></div>
            <div class="ceo-img-card"><img src="data:image/jpeg;base64,${ceoDesk}" alt="Danny CEO" loading="lazy"/><div class="ceo-img-caption">The God of Reckoning. The CEO of AXF.</div></div>
          </div>
          <div class="ceo-announce-text">
            <div class="ceo-announce-ey">Official AXF Executive Announcement</div>
            <h3 class="ceo-announce-h">The Reckoning Is Complete</h3>
            <div class="ceo-announce-divid"></div>
            <p class="ceo-announce-body">Stephanie McMahon took to the stage at Money in the Bank and made it official. After months of shareholder consolidation, board negotiations and systematic restructuring — Danny has been unanimously ratified as Chief Executive Officer of Axiom Wrestling Federation.</p>
            <p class="ceo-announce-body">The old regime is finished. The TKO Authority no longer controls this company. Danny — the man who started wrestling at 16, who won 12 World Championships — now owns the building that made him.</p>
            <div class="ceo-quote">"This was never about the title. It was always about the throne."</div>
            <div class="ceo-quote-attr">— Danny, Money in the Bank</div>
          </div>
        </div>
      </div>`:''} `;
  }

  // ── STORYLINES ────────────────────────────────────
  function renderStorylines() {
    const grid = document.getElementById('strl-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built='1';
    grid.innerHTML = AXF.storylines.map(s=>{
      const isFeat=s.featured;
      const namesH=s.names.map((n,i)=>`<div class="sl-n"${isFeat?' style="font-size:clamp(22px,3vw,34px)"':''}>${n}</div>${i<s.names.length-1?`<div class="sl-v"${isFeat?' style="font-size:16px"':''}>${s.connector}</div>`:''}`).join('');
      if(isFeat) return `
        <div class="slc feat hot">
          <div class="feat-l">
            <div class="sl-st hot"><div class="sd"></div>${s.label}</div>
            <div class="sl-mu">${namesH}</div>
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
          <div class="sl-mu">${namesH}</div>
          <p class="sl-desc">${s.desc}</p>
          <div class="sl-sk">${s.stakes}</div>
        </div>`;
    }).join('');
  }

  // ── LEGENDS ───────────────────────────────────────
  function renderLegends() {
    const grid = document.getElementById('leg-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built='1';
    const legends = [
      {icon:'🦅',yr:'Class of 2024',name:'John Cena',nick:'"The Cenation Leader"',ach:'Retired · 16x World Champion · Last Legend of the Previous Era'},
      {icon:'🎭',yr:'Class of 2023',name:'Triple H',nick:'"The King of Kings"',ach:'14x World Champion · The Authority Era · Defeated by Danny'},
      {icon:'⭐',yr:'Active Legend',name:'Jayden',nick:'"The Veteran"',ach:'AXF Champion · 8x World Champion · Mentor'},
      {icon:'🏛️',yr:'Studio Partner',name:'Valhalla Crown',nick:'"Where Legends Are Forged"',ach:"Danny Production Empire · Official AXF Partner"},
    ];
    grid.innerHTML = legends.map(l=>`
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
    grid.dataset.built='1';
    const galKeys=['gal1','gal2','gal3','gal4','gal5','gal6'];
    const galData = AXF.gallery || [];
    grid.innerHTML = galKeys.map((k,i)=>{
      const g=galData[i]||{caption:'AXF Moment',event:'Season 3'};
      return `<div class="gal-item" onclick="window.openLightbox('${k}','${g.caption}','${g.event}')">
        <img src="data:image/jpeg;base64,${IMGS[k]}" alt="${g.caption}" loading="lazy"/>
        <div class="gal-ov"></div>
        <div class="gal-info"><div class="gal-event">${g.event}</div><div class="gal-cap">${g.caption}</div></div>
        <div class="gal-zoom">⤢</div>
      </div>`;
    }).join('');
  }

  window.openLightbox=function(k,cap,ev){
    const lb=document.getElementById('lightbox');
    lb.querySelector('.lb-img').src=`data:image/jpeg;base64,${IMGS[k]}`;
    lb.querySelector('.lb-cap-txt').textContent=cap;
    lb.querySelector('.lb-cap-ev').textContent=ev;
    lb.classList.add('open');document.body.style.overflow='hidden';
  };
  window.closeLightbox=function(){
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow='';
  };
  document.getElementById('lightbox').addEventListener('click',e=>{if(e.target===document.getElementById('lightbox'))window.closeLightbox();});

  // ── MEDIA ─────────────────────────────────────────
  function renderMedia() {
    const pod=document.getElementById('pod-eps');
    if(pod&&!pod.dataset.built){
      pod.dataset.built='1';
      pod.innerHTML=AXF.podcast.map(p=>`
        <div class="pep"><div class="ep-n">${p.ep}</div>
        <div><div class="ep-t">${p.title}</div><div class="ep-m">${p.meta}</div></div>
        <div class="ep-p">▶</div></div>`).join('');
    }
    const vids=document.getElementById('vid-grid');
    if(vids&&!vids.dataset.built){
      vids.dataset.built='1';
      const clips=[
        {icon:'👿',label:'Danny — CEO Power Consolidation Promo'},
        {icon:'🗡️',label:'Austin Crimson — Championship Address'},
        {icon:'⚡',label:'Logan Mathews — World Heavyweight Championship'},
        {icon:'🔥',label:'Jayden & Damian — The Betrayal Begins'},
      ];
      vids.innerHTML=clips.map(c=>`
        <div class="vt"><div class="vt-bg">${c.icon}</div>
        <div class="vt-play">▶</div>
        <div class="vt-lbl">${c.label}</div></div>`).join('');
    }
  }

  // ── PATREON ART ───────────────────────────────────
  function renderPatreonArt() {
    const grid = document.getElementById('patreon-art-grid');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = '1';

    const art = AXF.patreon_art || [];
    const imgs = AXF._imgs || {};

    grid.innerHTML = art.map((item, i) => {
      const imgSrc = imgs[item.key] ? `data:image/jpeg;base64,${imgs[item.key]}` : null;
      const isWide = i === 0 || i === 1; // first two span full width
      return `
        <div class="pat-art-card${isWide ? ' pat-art-wide' : ''}" onclick="window.openPatreonLightbox('${item.key}','${item.title}','${item.caption}','${item.event}','${item.type}')">
          <div class="pat-art-img">
            ${imgSrc
              ? `<img src="${imgSrc}" alt="${item.title}" loading="lazy"/>`
              : `<div class="pat-art-ph">🏆</div>`}
            <div class="pat-art-ov"></div>
            <div class="pat-art-type">${item.type}</div>
            <div class="pat-art-info">
              <div class="pat-art-event">${item.event}</div>
              <div class="pat-art-title">${item.title}</div>
            </div>
            <div class="pat-art-zoom">⤢</div>
          </div>
        </div>`;
    }).join('');

    // Append unlock card at the end
    grid.innerHTML += `
      <div class="pat-art-unlock">
        <div class="pat-unlock-inner">
          <div class="pat-unlock-icon">&#127919;</div>
          <div class="pat-unlock-title">More Exclusive Art</div>
          <div class="pat-unlock-sub">New posters, character renders, and cinematic artwork released regularly for AXF Insiders.</div>
          <a href="https://www.patreon.com/cw/AXF_Insider" target="_blank" rel="noopener" class="btn-gold" style="margin-top:20px">Join AXF Insider &rarr;</a>
        </div>
      </div>`;
  }

  window.openPatreonLightbox = function(key, title, caption, event, type) {
    const imgs = AXF._imgs || {};
    const src = imgs[key] ? `data:image/jpeg;base64,${imgs[key]}` : '';
    const lb = document.getElementById('lightbox');
    lb.querySelector('.lb-img').src = src;
    lb.querySelector('.lb-cap-txt').textContent = title;
    lb.querySelector('.lb-cap-ev').textContent = `${event} · ${type}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // ── CONTACT ───────────────────────────────────────
  function renderContact(){
    const btn=document.getElementById('cf-submit');
    if(btn&&!btn.dataset.bound){
      btn.dataset.bound='1';
      btn.addEventListener('click',()=>{
        btn.textContent='Sending...';btn.style.opacity='.6';
        setTimeout(()=>{btn.textContent='✓ Received — We Will Be In Touch';btn.style.background='#1a5a1a';btn.style.color='#fff';btn.style.opacity='1';},1400);
      });
    }
  }

  // ── INIT ──────────────────────────────────────────
  buildTicker();
  showPage('home');
});
