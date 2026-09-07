/* ================= CHOOSE YOUR MOOD — kiosk =================
   Dokunmatik ekran için mod çarkı. Bağımlılık yok, tek klasör.
============================================================ */
(() => {
'use strict';

/* ---------- geometri ---------- */
const R_OUT   = 256;   // dış çember
const R_CHIP  = 232;   // emoji rozetlerinin merkezi
const R_BAND  = 209;   // rozet bandının iç çemberi
const R_LBL   = 96;    // yazının başladığı yarıçap
const R_HUB   = 84;    // göbeğin dış sınırı
const NS      = 'http://www.w3.org/2000/svg';

/* ---------- durum ---------- */
const LS_MOODS = 'mood-wheel:moods';
const LS_SOUND = 'mood-wheel:sound';
const LS_AYAR  = 'mood-wheel:ayarlar';

/* Renk ayarları — CSS değişkenlerine bire bir karşılık gelir.
   Buradaki 'v' değerleri style.css'teki varsayılanlarla aynı olmalı. */
const RENKLER = [
  { k:'--bg-1',      ad:'Arka plan · merkez', v:'#0d2436' },
  { k:'--bg-2',      ad:'Arka plan · kenar',  v:'#04101c' },
  { k:'--neon',      ad:'Çark neonu',         v:'#7ee8f7' },
  { k:'--neon-soft', ad:'Çark yazısı',        v:'#bff3fb' },
  { k:'--hub',       ad:'Göbek',              v:'#e4e93f' },
  { k:'--pointer',   ad:'İbre',               v:'#ff2d55' },
  { k:'--btn',       ad:'ÇEVİR butonu',       v:'#c9ec4e' },
  { k:'--card-line', ad:'Sonuç çerçevesi',    v:'#66ff8a' },
  { k:'--f-disc',    ad:'Yüz zemini',         v:'#e9f9ff' },
  { k:'--f-ink',     ad:'Yüz çizgisi',        v:'#0d3f4d' },
  { k:'--f-pupil',   ad:'Göz bebeği',         v:'#1c7f99' },
  { k:'--f-acc',     ad:'Yüz vurgusu',        v:'#ff3b5c' }
];

const AYAR_VARSAYILAN = { kartSaniye: 8, butonGoster: true, renkler: {} };
let ayar = Object.assign({}, AYAR_VARSAYILAN);

function ayarYukle(){
  try {
    const ham = localStorage.getItem(LS_AYAR);
    if (ham) ayar = Object.assign({}, AYAR_VARSAYILAN, JSON.parse(ham));
  } catch(_){ ayar = Object.assign({}, AYAR_VARSAYILAN); }
  if (!ayar.renkler || typeof ayar.renkler !== 'object') ayar.renkler = {};
}
function ayarKaydet(){
  try { localStorage.setItem(LS_AYAR, JSON.stringify(ayar)); } catch(_){}
}
function ayarUygula(){
  const kok = document.documentElement;
  RENKLER.forEach(r => {
    const secilen = ayar.renkler[r.k];
    if (secilen) kok.style.setProperty(r.k, secilen);
    else kok.style.removeProperty(r.k);
  });
  document.body.classList.toggle('butonsuz', !ayar.butonGoster);
  $('hint').hidden = ayar.butonGoster;
}

let moods    = [];
let rotation = 0;       // derece
let spinning = false;
let showing  = false;   // sonuç kartı açık mı
let soundOn  = localStorage.getItem(LS_SOUND) !== '0';

const $ = id => document.getElementById(id);
const rotor = $('rotor'), spinBtn = $('spin');

/* ---------- mod listesi ---------- */
function defaultMoods(){
  return (window.MOODS || [])
    .map(m => ({ t: String(m.t || '').trim(), e: m.e || '🙂' }))
    .filter(m => m.t);
}
function loadMoods(){
  try {
    const raw = localStorage.getItem(LS_MOODS);
    if (raw){
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length >= 2) return arr;
    }
  } catch(_){}
  return defaultMoods();
}

/* ---------- çarkı çiz ---------- */
const el = (tag, attrs) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};
const pt = (r, deg) => {
  const a = deg * Math.PI / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
};

function buildWheel(){
  rotor.textContent = '';
  const n = moods.length, seg = 360 / n;

  rotor.appendChild(el('circle', { class:'rim',      r:R_OUT  }));
  rotor.appendChild(el('circle', { class:'rim-thin', r:R_BAND }));
  rotor.appendChild(el('circle', { class:'rim-thin', r:R_HUB  }));

  // yazı ve rozet boyutu dilim sayısına göre ölçeklenir
  const fs    = Math.max(6, Math.min(13, 460 / n));
  const chipR = Math.max(7, Math.min(15, 660 / n));

  for (let i = 0; i < n; i++){
    const A = i * seg;                 // dilim ortası (0° = saat 3 yönü)
    const B = A - seg / 2;             // dilim sınırı

    // ayraç çizgisi
    const [x1, y1] = pt(R_HUB,  B);
    const [x2, y2] = pt(R_BAND, B);
    rotor.appendChild(el('line', { class:'spoke', x1, y1, x2, y2 }));

    // etiket — sol yarıda ters durmasın diye 180° çevrilir
    const flip = Math.cos(A * Math.PI / 180) < 0;
    const t = el('text', {
      class: 'label',
      transform: 'rotate(' + (flip ? A + 180 : A) + ')',
      x: flip ? -R_LBL : R_LBL,
      y: 0,
      'text-anchor': flip ? 'end' : 'start',
      'font-size': fs
    });
    t.textContent = moods[i].t;
    rotor.appendChild(t);

    // rozet: çizilmiş yüz varsa onu, yoksa emoji karakterini kullan
    const [cx, cy] = pt(R_CHIP, A);
    const face = window.BrewFaces && BrewFaces.faceGroup(moods[i].t);
    if (face){
      const sc = (chipR * 2.05) / 100;
      face.setAttribute('transform',
        'translate(' + (cx - chipR * 1.025) + ',' + (cy - chipR * 1.025) + ') scale(' + sc + ')');
      rotor.appendChild(face);
    } else {
      rotor.appendChild(el('circle', { class:'chip', cx, cy, r: chipR }));
      const e = el('text', { class:'chip-e', x:cx, y:cy, 'font-size': chipR * 1.15 });
      e.textContent = moods[i].e;
      rotor.appendChild(e);
    }
  }
  applyRotation();
}

const applyRotation = () => rotor.setAttribute('transform', 'rotate(' + rotation + ')');

/* ---------- ses (WebAudio — ses dosyası gerekmez) ---------- */
let ac = null;
function audio(){
  if (!ac){
    const C = window.AudioContext || window.webkitAudioContext;
    if (C) ac = new C();
  }
  if (ac && ac.state === 'suspended') ac.resume();
  return ac;
}
function blip(freq, dur, type, vol){
  if (!soundOn) return;
  const c = audio(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'triangle';
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol || 0.12, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur);
}
const tick = () => blip(1500, 0.035, 'square', 0.06);
function fanfare(){
  if (!soundOn) return;
  [[523,0],[659,110],[784,220],[1047,330]]
    .forEach(pair => setTimeout(() => blip(pair[0], 0.28, 'triangle', 0.14), pair[1]));
}

/* ---------- çevirme ---------- */
function spin(){
  if (spinning) return;

  if (showing) kartiGizle();          // açık kartı önce kapat
  clearTimeout(kartSayaci);

  const n = moods.length;
  if (n < 2) return;

  const seg    = 360 / n;
  const idx    = crypto.getRandomValues(new Uint32Array(1))[0] % n;
  const turns  = 5 + Math.floor(Math.random() * 3);     // 5–7 tam tur
  const dur    = 4800 + Math.random() * 1200;           // ~5 saniye
  const jitter = (Math.random() - 0.5) * seg * 0.62;    // dilim içinde rastgele dur

  const from = rotation;
  const base = from + turns * 360;
  const need = ((-idx * seg - base) % 360 + 360) % 360; // ibre 0°'da (saat 3)
  const to   = base + need + jitter;

  spinning = true;
  document.body.classList.add('spinning');
  spinBtn.disabled = true;
  spinBtn.classList.remove('attract');

  const t0 = performance.now(), w0 = Date.now();
  let lastSeg = Math.floor(from / seg), lastAt = 0, done = false;

  // Emniyet: ekran uyursa / sekme arka plana düşerse requestAnimationFrame
  // durabilir. O durumda çark sonsuza kadar asılı kalmasın diye bitişi garanti eder.
  const guard = setTimeout(() => finish(), dur + 1500);

  function finish(){
    if (done) return;
    done = true;
    clearTimeout(guard);
    rotation = ((to % 360) + 360) % 360;
    applyRotation();
    spinning = false;
    document.body.classList.remove('spinning');
    setTimeout(() => reveal(idx), 320);
  }

  const frame = now => {
    if (done) return;
    // iki saat kaynağı: biri takılırsa animasyon yine de ilerler
    const p = Math.min(1, Math.max((now - t0) / dur, (Date.now() - w0) / dur));
    const eased = 1 - Math.pow(1 - p, 4.2);             // yavaşlayarak durur
    rotation = from + (to - from) * eased;
    applyRotation();

    const cur = Math.floor(rotation / seg);
    if (cur !== lastSeg && now - lastAt > 28){
      lastSeg = cur; lastAt = now; tick();
    }

    if (p < 1){ requestAnimationFrame(frame); return; }
    finish();
  };
  requestAnimationFrame(frame);
}

let kartSayaci = null;
function kartiGizle(){
  clearTimeout(kartSayaci); kartSayaci = null;
  showing = false;
  document.body.classList.remove('result-on');
}

function reveal(i){
  const txt = moods[i].t;
  const el2 = $('result-text');
  // en uzun kelimeye gore yazi boyutunu kucult ki kart tasmasin
  const longest = Math.max.apply(null, txt.split(' ').map(w => w.length));
  const k = Math.min(1, 9 / Math.max(6, longest));
  el2.style.setProperty('--rt-k', k.toFixed(3));

  const holder = $('result-emoji');
  holder.textContent = '';
  const big = window.BrewFaces && BrewFaces.faceSvg(txt);
  if (big) holder.appendChild(big); else holder.textContent = moods[i].e;

  el2.textContent = txt;
  document.body.classList.add('result-on');
  showing = true;
  fanfare();
  spinBtn.disabled = false;
  resetIdle();

  // ayarlanan süre dolunca kart kendiliğinden kapansın (0 = kapalı)
  clearTimeout(kartSayaci);
  if (ayar.kartSaniye > 0) kartSayaci = setTimeout(kartiGizle, ayar.kartSaniye * 1000);
}

/* ---------- boşta kalınca butonu nabız gibi attır ---------- */
let idleTimer = null;
function resetIdle(){
  clearTimeout(idleTimer);
  spinBtn.classList.remove('attract');
  idleTimer = setTimeout(() => {
    if (!spinning) spinBtn.classList.add('attract');
  }, 45000);
}

/* ---------- ayarlar paneli ---------- */
const toText = list => list.map(m => m.t + ' | ' + m.e).join('\n');
const toList = txt => txt.split('\n').map(line => {
    const parts = line.split('|');
    return { t: (parts[0] || '').trim(), e: (parts[1] || '').trim() || '🙂' };
  }).filter(m => m.t);

function renkleriKur(){
  const kap = $('cfg-renkler');
  if (kap.childElementCount) return;              // bir kez kurulur
  RENKLER.forEach(r => {
    const et = document.createElement('label');
    et.className = 'renk';
    const gir = document.createElement('input');
    gir.type = 'color';
    gir.dataset.degisken = r.k;
    const ad = document.createElement('span');
    ad.textContent = r.ad;
    et.appendChild(gir); et.appendChild(ad);
    kap.appendChild(et);

    gir.addEventListener('input', () => {
      ayar.renkler[r.k] = gir.value;
      document.documentElement.style.setProperty(r.k, gir.value);
      ayarKaydet();
    });
  });
}

function renkleriGoster(){
  $('cfg-renkler').querySelectorAll('input[type=color]').forEach(gir => {
    const k = gir.dataset.degisken;
    const varsayilan = (RENKLER.find(r => r.k === k) || {}).v || '#000000';
    gir.value = ayar.renkler[k] || varsayilan;
  });
}

function sureGoster(){
  const n = +$('cfg-sure').value;
  $('cfg-sure-deger').textContent = n === 0 ? 'kapalı' : n + ' sn';
}

function sekmeSec(ad){
  $('cfg-tabs').querySelectorAll('button').forEach(b =>
    b.classList.toggle('on', b.dataset.sek === ad));
  $('cfg-box').querySelectorAll('section').forEach(sec =>
    sec.classList.toggle('on', sec.dataset.sek === ad));
}

function openCfg(){
  renkleriKur();
  renkleriGoster();
  $('cfg-text').value    = toText(moods);
  $('cfg-sure').value    = ayar.kartSaniye;
  $('cfg-buton').checked = ayar.butonGoster;
  $('cfg-ses').checked   = soundOn;
  sureGoster();
  $('cfg-msg').textContent = '';
  $('cfg').classList.add('open');
}
const closeCfg = () => $('cfg').classList.remove('open');

/* ---------- olaylar ---------- */
spinBtn.addEventListener('click', ev => { ev.stopPropagation(); audio(); spin(); });

$('btn-cfg').addEventListener('click', openCfg);

$('cfg-tabs').addEventListener('click', ev => {
  const b = ev.target.closest('button[data-sek]');
  if (b) sekmeSec(b.dataset.sek);
});

$('cfg-sure').addEventListener('input', () => {
  ayar.kartSaniye = +$('cfg-sure').value;
  sureGoster();
  ayarKaydet();
});

$('cfg-buton').addEventListener('change', () => {
  ayar.butonGoster = $('cfg-buton').checked;
  ayarUygula();
  ayarKaydet();
});

$('cfg-ses').addEventListener('change', () => {
  soundOn = $('cfg-ses').checked;
  localStorage.setItem(LS_SOUND, soundOn ? '1' : '0');
  $('btn-sound').textContent = soundOn ? '🔊' : '🔇';
  if (soundOn){ audio(); tick(); }
});

$('renk-sifirla').addEventListener('click', () => {
  ayar.renkler = {};
  ayarUygula();
  renkleriGoster();
  ayarKaydet();
  $('cfg-msg').textContent = 'Renkler varsayılana döndü.';
});
$('cfg-close').addEventListener('click', closeCfg);
$('cfg-save').addEventListener('click', () => {
  const list = toList($('cfg-text').value);
  if (list.length < 2){ $('cfg-msg').textContent = 'En az 2 satır gerekli.'; return; }
  moods = list;
  localStorage.setItem(LS_MOODS, JSON.stringify(list));
  buildWheel();
  closeCfg();
});
$('cfg-reset').addEventListener('click', () => {
  localStorage.removeItem(LS_MOODS);
  moods = defaultMoods();
  $('cfg-text').value = toText(moods);
  buildWheel();
});

$('btn-sound').addEventListener('click', ev => {
  soundOn = !soundOn;
  localStorage.setItem(LS_SOUND, soundOn ? '1' : '0');
  ev.currentTarget.textContent = soundOn ? '🔊' : '🔇';
  $('cfg-ses').checked = soundOn;          // panelle aynı kalsın
  if (soundOn){ audio(); tick(); }
});

$('btn-full').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape'){ closeCfg(); return; }
  if ($('cfg').classList.contains('open')) return;
  if (ev.key === ' ' || ev.key === 'Enter'){ ev.preventDefault(); audio(); spin(); }
  if (ev.key === 'f' || ev.key === 'F') $('btn-full').click();
});

// çarka veya sonuç kartına dokununca da çevirsin
$('wheel-wrap').addEventListener('click', () => { audio(); spin(); });
$('hint').addEventListener('click', () => { audio(); spin(); });

['pointerdown','keydown'].forEach(t => document.addEventListener(t, resetIdle, true));
window.addEventListener('resize', resetIdle);

/* ---------- başlat ---------- */
ayarYukle();
ayarUygula();
moods = loadMoods();
$('btn-sound').textContent = soundOn ? '🔊' : '🔇';
buildWheel();
resetIdle();

})();
