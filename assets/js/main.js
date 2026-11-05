// ════════════════════════════════════════════════════════
//  DoubleCup Studios — main.js
//  3D viewer · i18n · Devlog · Lightbox · Nav · UI
//  Depends on (loaded before, all `defer`):
//    three.min.js r128 · cup-geometry.js · i18n.js · devlog-data.js
// ════════════════════════════════════════════════════════

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Safe localStorage (private mode / blocked storage)
const store = {
  get(k)    { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
};

function escapeHTML(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ════════════════════════════════════════════════════════
//  3D VIEWER
//  Materials, lights, textures and geometry are kept exactly as in
//  LandingPage10 — the "glitched" crystal liquid is a feature.
// ════════════════════════════════════════════════════════
function initViewer() {
  const container = document.getElementById('logo-viewer');
  if (!container || typeof THREE === 'undefined' || typeof CUP_POS === 'undefined') return false;

  const W = container.clientWidth, H = container.clientHeight;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return false; // WebGL not available → caller shows fallback image
  }
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.physicallyCorrectLights = false;
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 100);
  camera.position.set(0, 1.8, 3.4);
  camera.lookAt(0, 0.1, 0);

  // ── Lighting ──
  scene.add(new THREE.AmbientLight(0xffffff, 0.20));
  const key = new THREE.DirectionalLight(0xfff4f8, 0.90);
  key.position.set(-2, 4, 3);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xddc8ff, 0.30);
  fill.position.set(3, 1, 1);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x9B30FF, 0.35);
  rim.position.set(0, -1, -3);
  scene.add(rim);
  const innerGlow = new THREE.PointLight(0xAA44FF, 1.4, 2.5);
  innerGlow.position.set(0, 0.85, 0);
  scene.add(innerGlow);

  // ── Textures ──
  const cupTex = makeStyrofoamTexture();
  const liqTex = makeLiquidTexture();

  const cupMat = new THREE.MeshPhongMaterial({
    map:       cupTex,
    color:     0xf2f0f8,
    shininess: 8,
    specular:  new THREE.Color(0x444455),
  });

  const liqMat = new THREE.MeshPhongMaterial({
    map:               liqTex,
    color:             0xaa33ff,
    shininess:         140,
    specular:          new THREE.Color(0xee88ff),
    emissive:          new THREE.Color(0x2a0055),
    emissiveIntensity: 0.5,
  });

  function makeGeo(pos, uv, norm) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv',       new THREE.BufferAttribute(uv,  2));
    g.setAttribute('normal',   new THREE.BufferAttribute(norm, 3));
    return g;
  }

  const cupGeo = makeGeo(CUP_POS, CUP_UV, CUP_NORM);
  const liqGeo = makeGeo(LIQ_POS, LIQ_UV, LIQ_NORM);

  cupGeo.computeBoundingBox();
  const box = cupGeo.boundingBox;
  const cx  = (box.max.x + box.min.x) / 2;
  const cy  = (box.max.y + box.min.y) / 2;
  const cz  = (box.max.z + box.min.z) / 2;
  const sc  = 1.7 / Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);

  const group = new THREE.Group();
  const cupMesh = new THREE.Mesh(cupGeo, cupMat);
  cupMesh.scale.set(sc, sc, sc);
  cupMesh.position.set(-cx * sc, -cy * sc, -cz * sc);
  const liqMesh = new THREE.Mesh(liqGeo, liqMat);
  liqMesh.scale.set(sc, sc, sc);
  liqMesh.position.set(-cx * sc, -cy * sc, -cz * sc);
  group.add(cupMesh);
  group.add(liqMesh);
  group.rotation.x = -0.30;
  scene.add(group);

  const loading = document.getElementById('viewer-loading');
  if (loading) loading.style.display = 'none';

  const hint = document.getElementById('viewer-hint');
  if (hint) {
    setTimeout(() => {
      hint.style.opacity = '1';
      setTimeout(() => hint.style.opacity = '0', 2800);
    }, 700);
  }

  // ── Drag interaction ──
  // Fix vs. LandingPage10: grabbing the cup now starts from its current angle
  // (it used to snap back to the last dragged angle after auto-rotate resumed).
  let dragging = false, prevX = 0, prevY = 0;
  let autoRotate = true, userY = 0, userX = 0, resumeTimer = null;

  function startDrag(x, y) {
    dragging = true; autoRotate = false;
    clearTimeout(resumeTimer);
    userY = group.rotation.y;
    userX = group.rotation.x + 0.30;
    prevX = x; prevY = y;
  }
  function moveDrag(x, y) {
    if (!dragging) return;
    userY += (x - prevX) * 0.009;
    userX += (y - prevY) * 0.007;
    userX = Math.max(-0.5, Math.min(0.5, userX));
    prevX = x; prevY = y;
  }
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    resumeTimer = setTimeout(() => autoRotate = true, 2200);
  }

  const canvas = renderer.domElement;
  canvas.addEventListener('mousedown',  e => startDrag(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', e => startDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  window.addEventListener('mousemove',  e => moveDrag(e.clientX, e.clientY));
  window.addEventListener('touchmove',  e => { if (dragging) moveDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  window.addEventListener('mouseup',  endDrag);
  window.addEventListener('touchend', endDrag);

  // ── Render loop (paused while the hero is off-screen / tab hidden) ──
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(container);
  }

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (!visible || document.hidden) return;
    t += 0.008;

    if (!REDUCED_MOTION) group.position.y = Math.sin(t * 0.9) * 0.07;

    if (autoRotate) {
      group.rotation.y += REDUCED_MOTION ? 0.0015 : 0.0042;
    } else {
      group.rotation.y = userY;
      group.rotation.x = userX - 0.30;
    }

    innerGlow.intensity = 1.2 + Math.sin(t * 2.1) * 0.3;
    liqMat.emissiveIntensity = 0.4 + Math.sin(t * 1.6) * 0.15;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const W2 = container.clientWidth, H2 = container.clientHeight;
    if (!W2 || !H2) return;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
  });

  return true;
}

// ── Styrofoam texture (white cup body) — unchanged ──
function makeStyrofoamTexture() {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#eeecf2';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 3) {
    const alpha = 0.03 + Math.random() * 0.05;
    ctx.strokeStyle = `rgba(140,135,160,${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + Math.random());
    ctx.lineTo(size, y + Math.random());
    ctx.stroke();
  }

  const id = ctx.getImageData(0, 0, size, size);
  const px = id.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    px[i]   = Math.min(255, Math.max(0, px[i]   + n));
    px[i+1] = Math.min(255, Math.max(0, px[i+1] + n));
    px[i+2] = Math.min(255, Math.max(0, px[i+2] + n * 1.05));
  }
  ctx.putImageData(id, 0, 0);

  for (let x = 0; x < size; x += 50 + Math.random() * 70) {
    ctx.strokeStyle = 'rgba(180,175,195,0.10)';
    ctx.lineWidth = 1 + Math.random() * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 6, size);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  return tex;
}

// ── Purple crystal liquid texture — unchanged ──
function makeLiquidTexture() {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#440088';
  ctx.fillRect(0, 0, size, size);

  const shades = ['#9B30FF','#7722CC','#C077FF','#3300AA',
                  '#BB55FF','#5500BB','#DD99FF','#220066',
                  '#AA44EE','#6611BB'];

  for (let i = 0; i < 90; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = 18 + Math.random() * 55;
    const sides = 3 + Math.floor(Math.random() * 3);
    const a0 = Math.random() * Math.PI * 2;
    ctx.beginPath();
    for (let s = 0; s < sides; s++) {
      const a = a0 + (s / sides) * Math.PI * 2;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
    ctx.globalAlpha = 0.55 + Math.random() * 0.45;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (let i = 0; i < 10; i++) {
    const gx = Math.random() * size, gy = Math.random() * size;
    const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 25 + Math.random() * 40);
    gr.addColorStop(0, 'rgba(255,200,255,0.75)');
    gr.addColorStop(1, 'rgba(150,60,255,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, size, size);
  }

  for (let i = 0; i < 22; i++) {
    ctx.strokeStyle = 'rgba(10,0,35,0.55)';
    ctx.lineWidth = 0.7 + Math.random() * 1.2;
    ctx.beginPath();
    let x = Math.random() * size, y = Math.random() * size;
    ctx.moveTo(x, y);
    const steps = 3 + Math.floor(Math.random() * 4);
    for (let s = 0; s < steps; s++) {
      x += (Math.random() - 0.5) * 70;
      y += (Math.random() - 0.5) * 70;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  return new THREE.CanvasTexture(c);
}

// If Three.js can't load (CDN blocked / no WebGL) show a static cup instead
function showViewerFallback() {
  const container = document.getElementById('logo-viewer');
  if (!container || container.querySelector('canvas, .viewer-fallback')) return;
  const loading = document.getElementById('viewer-loading');
  if (loading) loading.style.display = 'none';
  const img = document.createElement('img');
  img.className = 'viewer-fallback';
  img.src = 'assets/images/favicon.png';
  img.alt = '';
  container.appendChild(img);
}

function bootViewer() {
  const started = Date.now();
  (function tryViewer() {
    if (typeof THREE !== 'undefined') {
      if (!initViewer()) showViewerFallback();
    } else if (Date.now() - started > 8000) {
      showViewerFallback();
    } else {
      setTimeout(tryViewer, 100);
    }
  })();
}

// ════════════════════════════════════════════════════════
//  I18N
// ════════════════════════════════════════════════════════
const I18N = window.DC_I18N || { en: {}, pt: {} };
let lang = (function detectLang() {
  const saved = store.get('dc-lang');
  if (saved === 'en' || saved === 'pt') return saved;
  return (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
})();
const langListeners = [];

function t(key) {
  const v = (I18N[lang] || {})[key];
  return v != null ? v : (I18N.en[key] != null ? I18N.en[key] : key);
}
// Pick a localized field from { en, pt } (or return a plain string)
function loc(field) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[lang] != null ? field[lang] : (field.en != null ? field.en : '');
}

function applyLang() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.textContent = lang === 'en' ? 'PT-BR' : 'EN';
    btn.setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
  }
  langListeners.forEach(fn => fn());
}

function initLang() {
  const btn = document.getElementById('langToggle');
  if (btn) btn.addEventListener('click', () => {
    lang = lang === 'en' ? 'pt' : 'en';
    store.set('dc-lang', lang);
    applyLang();
  });
  applyLang();
}

// ════════════════════════════════════════════════════════
//  LIGHTBOX (shared by gallery + devlog posts)
// ════════════════════════════════════════════════════════
const Lightbox = (function () {
  let lb, img, title, tag, counter, prevBtn, nextBtn, items = [], current = 0, lastFocus = null;

  function render() {
    const it = items[current];
    img.src = it.src;
    img.alt = it.alt || it.title || '';
    title.textContent = it.title || '';
    tag.textContent = it.tag || '';
    title.hidden = !it.title;
    const many = items.length > 1;
    counter.textContent = many ? `${current + 1} / ${items.length}` : '';
    prevBtn.hidden = nextBtn.hidden = !many;
    img.style.animation = 'none';
    requestAnimationFrame(() => { img.style.animation = ''; });
  }
  function open(list, idx) {
    items = list; current = idx || 0;
    lastFocus = document.activeElement;
    render();
    lb.hidden = false;
    lockScroll(true);
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.hidden = true;
    img.src = 'data:,';
    lockScroll(false);
    if (lastFocus) lastFocus.focus();
  }
  function step(d) { current = (current + d + items.length) % items.length; render(); }
  function isOpen() { return lb && !lb.hidden; }

  function init() {
    lb = document.getElementById('lightbox');
    if (!lb) return;
    img = document.getElementById('lbImg');
    title = document.getElementById('lbTitle');
    tag = document.getElementById('lbTag');
    counter = document.getElementById('lbCounter');
    prevBtn = document.getElementById('lbPrev');
    nextBtn = document.getElementById('lbNext');

    document.getElementById('lbClose').addEventListener('click', close);
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-figure')) close(); });

    document.addEventListener('keydown', e => {
      if (!isOpen()) return;
      if (e.key === 'Escape')     { e.stopImmediatePropagation(); close(); }
      if (e.key === 'ArrowLeft')  step(-1);
      if (e.key === 'ArrowRight') step(1);
    }, true);

    let sx = 0;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50 && items.length > 1) step(dx < 0 ? 1 : -1);
    });
  }
  return { init, open, isOpen };
})();

// Scroll lock that tolerates nested overlays (modal + lightbox)
let scrollLocks = 0;
function lockScroll(on) {
  scrollLocks = Math.max(0, scrollLocks + (on ? 1 : -1));
  document.documentElement.style.overflow = scrollLocks ? 'hidden' : '';
}

function initGallery() {
  const cards = Array.from(document.querySelectorAll('.work-card'));
  const collect = () => cards.map(c => ({
    src:   c.getAttribute('href'),
    alt:   c.querySelector('img') ? c.querySelector('img').alt : '',
    title: (c.querySelector('.work-title') || {}).textContent || '',
    tag:   (c.querySelector('.work-tag')   || {}).textContent || ''
  }));
  cards.forEach((card, i) => card.addEventListener('click', e => {
    e.preventDefault();
    Lightbox.open(collect(), i);
  }));
}

// ════════════════════════════════════════════════════════
//  DEVLOG
// ════════════════════════════════════════════════════════
const Devlog = (function () {
  const PAGE_SIZE = 5;
  const posts = (window.DEVLOG_POSTS || [])
    .filter(p => p && p.id && p.date)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  let showAll = false;
  let currentIdx = -1;
  let pushedByUs = false;
  let lastFocus = null;
  let el = {};

  function fmtDate(iso) {
    const [y, m, d] = String(iso).split('-');
    if (!d) return escapeHTML(iso);
    return lang === 'pt' ? `${d}.${m}.${y}` : `${m}.${d}.${y}`;
  }
  function imagesOf(p) { return Array.isArray(p.images) ? p.images.filter(i => i && i.src) : []; }
  function coverOf(p)  { return p.cover || (imagesOf(p)[0] || {}).src || ''; }

  function renderList() {
    const list = el.list;
    list.innerHTML = '';
    el.empty.hidden = posts.length > 0;
    const shown = showAll ? posts : posts.slice(0, PAGE_SIZE);

    shown.forEach(p => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'devlog-item';
      const cover = coverOf(p);
      btn.innerHTML =
        `<div class="devlog-main">
           <div class="devlog-meta">
             <time datetime="${escapeHTML(p.date)}">${fmtDate(p.date)}</time>
             <span class="chip chip-${escapeHTML(p.category || 'news')}">${t('cat.' + (p.category || 'news'))}</span>
             ${p.version ? `<span class="chip chip-ghost">${escapeHTML(p.version)}</span>` : ''}
           </div>
           <h3 class="devlog-title">${escapeHTML(loc(p.title))}</h3>
           ${p.summary ? `<p class="devlog-summary">${escapeHTML(loc(p.summary))}</p>` : ''}
         </div>
         ${cover ? `<img class="devlog-thumb" src="${escapeHTML(cover)}" alt="" loading="lazy">` : '<span></span>'}
         <span class="devlog-arrow" aria-hidden="true">&rarr;</span>`;
      btn.addEventListener('click', () => open(p.id, true));
      li.appendChild(btn);
      list.appendChild(li);
    });

    el.more.hidden = posts.length <= PAGE_SIZE;
    el.more.innerHTML = t(showAll ? 'devlog.less' : 'devlog.more');
  }

  function renderPost() {
    const p = posts[currentIdx];
    if (!p) return;
    el.date.textContent = fmtDate(p.date);
    el.date.setAttribute('datetime', p.date);
    el.cat.className = 'chip chip-' + (p.category || 'news');
    el.cat.innerHTML = t('cat.' + (p.category || 'news'));
    el.version.hidden = !p.version;
    el.version.textContent = p.version || '';
    el.title.textContent = loc(p.title);
    el.body.innerHTML = loc(p.body);   // trusted HTML authored in devlog-data.js

    // Inline <img> inside the body open in the lightbox too
    el.body.querySelectorAll('img').forEach((im, i, all) => {
      im.loading = 'lazy';
      im.addEventListener('click', () => Lightbox.open(Array.from(all).map(x => ({ src: x.src, alt: x.alt, title: x.alt })), i));
    });

    const imgs = imagesOf(p);
    el.gallery.innerHTML = '';
    imgs.forEach((im, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'post-shot';
      const cap = loc(im.caption);
      b.innerHTML = `<img src="${escapeHTML(im.src)}" alt="${escapeHTML(cap)}" loading="lazy">${cap ? `<span>${escapeHTML(cap)}</span>` : ''}`;
      b.addEventListener('click', () => Lightbox.open(imgs.map(x => ({ src: x.src, alt: loc(x.caption), title: loc(x.caption), tag: loc(p.title) })), i));
      el.gallery.appendChild(b);
    });

    // posts[] is newest-first: "older" = higher index
    el.older.disabled = currentIdx >= posts.length - 1;
    el.newer.disabled = currentIdx <= 0;
    el.scroll.scrollTop = 0;
  }

  function open(id, push) {
    const idx = posts.findIndex(p => p.id === id);
    if (idx < 0) return;
    const wasOpen = !el.modal.hidden;
    currentIdx = idx;
    renderPost();
    if (!wasOpen) {
      lastFocus = document.activeElement;
      el.modal.hidden = false;
      lockScroll(true);
      el.modal.querySelector('.icon-btn').focus();
    }
    const hash = '#devlog/' + encodeURIComponent(id);
    if (push && !wasOpen) { history.pushState({ devlog: id }, '', hash); pushedByUs = true; }
    else if (location.hash !== hash) { history.replaceState(history.state, '', hash); }
  }

  function hide() {
    if (el.modal.hidden) return;
    el.modal.hidden = true;
    currentIdx = -1;
    lockScroll(false);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  // UI close: go back if we pushed the entry, otherwise clean the hash
  function close() {
    if (pushedByUs) { pushedByUs = false; history.back(); return; }
    hide();
    history.replaceState(null, '', location.pathname + location.search + '#devlog');
  }

  function syncFromHash() {
    const m = location.hash.match(/^#devlog\/(.+)$/);
    if (m) open(decodeURIComponent(m[1]), false);
    else { pushedByUs = false; hide(); }
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' || el.modal.hidden || Lightbox.isOpen()) return;
    const f = Array.from(el.modal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'))
      .filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function init() {
    el = {
      list:    document.getElementById('devlogList'),
      empty:   document.getElementById('devlogEmpty'),
      more:    document.getElementById('devlogMore'),
      modal:   document.getElementById('postModal'),
      date:    document.getElementById('postDate'),
      cat:     document.getElementById('postCat'),
      version: document.getElementById('postVersion'),
      title:   document.getElementById('postTitle'),
      body:    document.getElementById('postBody'),
      gallery: document.getElementById('postGallery'),
      scroll:  document.getElementById('postScroll'),
      older:   document.getElementById('postOlder'),
      newer:   document.getElementById('postNewer')
    };
    if (!el.list || !el.modal) return;

    el.more.addEventListener('click', () => {
      showAll = !showAll;
      renderList();
      if (!showAll) document.getElementById('devlog').scrollIntoView({ block: 'start' });
    });
    el.modal.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
    el.older.addEventListener('click', () => { if (currentIdx < posts.length - 1) open(posts[currentIdx + 1].id, false); });
    el.newer.addEventListener('click', () => { if (currentIdx > 0) open(posts[currentIdx - 1].id, false); });

    document.addEventListener('keydown', e => {
      if (el.modal.hidden || Lightbox.isOpen()) return;
      if (e.key === 'Escape') close();
      trapFocus(e);
    });
    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);

    langListeners.push(() => { renderList(); if (!el.modal.hidden) renderPost(); });
    renderList();
    syncFromHash(); // open a shared link like  /#devlog/v0-0-1
  }

  return { init };
})();

// ════════════════════════════════════════════════════════
//  NAVIGATION (scrolled state, mobile menu, active link)
// ════════════════════════════════════════════════════════
function initNav() {
  const nav = document.getElementById('siteNav');
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('navMenu');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
  }
  if (burger && menu) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', e => { if (!nav.contains(e.target)) setMenu(false); });
  }

  // Highlight the link of the section in view
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(l => l.classList.remove('active'));
        const a = map.get(en.target.id);
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main > section[id]').forEach(s => io.observe(s));
  }
}

// ════════════════════════════════════════════════════════
//  SCROLL REVEAL
// ════════════════════════════════════════════════════════
function initScrollReveal() {
  const els = document.querySelectorAll('.fade-in');
  if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(e => io.observe(e));
}

// ════════════════════════════════════════════════════════
//  COPY EMAIL + TOAST
// ════════════════════════════════════════════════════════
function showToast(html) {
  const el = document.getElementById('copyToast');
  if (!el) return;
  el.innerHTML = html;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 2000);
}

function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  if (!btn) return;
  const email = btn.dataset.email;
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  };
  btn.addEventListener('click', () => {
    const done = () => showToast(t('toast.copied'));
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(done).catch(() => { fallback(); done(); });
    } else {
      fallback(); done();
    }
  });
}

// ════════════════════════════════════════════════════════
//  BOOT
// ════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initNav();
  initScrollReveal();
  Lightbox.init();
  initGallery();
  Devlog.init();
  initCopyEmail();
  bootViewer();
});
