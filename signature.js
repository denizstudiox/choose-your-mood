/* ==================================================================
   TELİF İMZASI  —  tek dosya, tek satırla kaldırılır

   KALDIRMAK İÇİN:
     1) index.html içindeki  <script src="signature.js"></script>  satırını silin
     2) bu dosyayı silin
   Başka hiçbir yere dokunmanıza gerek yok — bu dosya kendi stilini,
   kendi DOM'unu ve kendi olaylarını kendisi kuruyor.

   NE YAPAR:
     1) Ekranın sol alt köşesine çok soluk, küçük bir imza koyar.
     2) O imzaya 2 saniye basılı tutunca (ya da klavyeden "imza" yazınca)
        tam künyeyi gösteren bir panel açılır — fotoğrafı çekilebilir.
     3) Sayfa kaynağına <meta> etiketleri ve bir HTML yorumu ekler.
     4) Tarayıcı konsoluna künyeyi basar (F12 ile görünür).

   NİYE BİRDEN FAZLA YERDE: biri silinse bile diğerleri kalsın diye.
   Asıl kanıt değeri BUILD kimliğinde: bağımsız yazılmış bir uygulamada
   bu dizginin bulunmasının hiçbir sebebi yoktur.
================================================================== */
(() => {
'use strict';

/* ---------- BURAYI KENDİNE GÖRE DÜZENLE ---------- */
const SIGN = {
  sahip:   'denizstudiox',
  iletisim:'denizstudiox@gmail.com',
  eser:    'Choose Your Mood — dokunmatik mod çarkı',
  yil:     '2026',
  tarih:   '2026-09-06',
  kimlik:  '0576-45B3-CA3E-EC82',
  damga:   'abdaf7bb359edd991460bfe9bb00ada7'
};
/* ------------------------------------------------- */

const satir = SIGN.eser + ' © ' + SIGN.yil + ' ' + SIGN.sahip +
              ' · ' + SIGN.kimlik;

/* 1) sayfa kaynağındaki izler ------------------------------------ */
function meta(name, content){
  const m = document.createElement('meta');
  m.setAttribute('name', name);
  m.setAttribute('content', content);
  document.head.appendChild(m);
}
meta('author', SIGN.sahip);
meta('copyright', '© ' + SIGN.yil + ' ' + SIGN.sahip + ' · ' + SIGN.iletisim);
meta('build-id', SIGN.kimlik);
meta('build-date', SIGN.tarih);
document.documentElement.setAttribute('data-build', SIGN.kimlik);
document.head.appendChild(document.createComment(' ' + satir + ' · ' + SIGN.iletisim + ' '));

/* 2) konsol künyesi ---------------------------------------------- */
try {
  console.log('%c' + SIGN.eser,
    'color:#7ee8f7;font-size:14px;font-weight:700');
  console.log('© ' + SIGN.yil + ' ' + SIGN.sahip + '  ·  ' + SIGN.iletisim +
              '\nYapım kimliği: ' + SIGN.kimlik +
              '\nDamga: ' + SIGN.damga +
              '\nTarih: ' + SIGN.tarih);
} catch (_) {}

/* 3) stiller (bu dosyaya ait, ayrı CSS'e dokunmuyor) -------------- */
const css = document.createElement('style');
css.textContent = [
  /* köşedeki soluk imza — uzaktan fark edilmez, yakından okunur */
  '#sig-mark{position:fixed;left:7px;bottom:6px;z-index:30;',
  '  font:400 8px/1 "Segoe UI",Arial,sans-serif;letter-spacing:.4px;',
  '  color:#7ee8f7;opacity:.13;user-select:none;cursor:default;',
  '  padding:6px 8px;margin:-6px -8px;-webkit-tap-highlight-color:transparent;',
  '  transition:opacity .25s ease;}',
  '#sig-mark:hover{opacity:.42;}',

  /* künye paneli */
  '#sig-panel{position:fixed;inset:0;z-index:60;display:none;',
  '  align-items:center;justify-content:center;background:rgba(2,10,18,.9);}',
  '#sig-panel.open{display:flex;}',
  '#sig-card{background:#07202f;color:#eaf7ff;border:2px solid #7ee8f7;',
  '  border-radius:14px;padding:26px 30px;max-width:min(560px,90vw);',
  '  box-shadow:0 0 40px rgba(126,232,247,.35);',
  '  font:14px/1.75 "Segoe UI",Arial,sans-serif;}',
  '#sig-card h3{margin:0 0 14px;font-size:17px;color:#7ee8f7;letter-spacing:.5px;}',
  '#sig-card dl{margin:0;display:grid;grid-template-columns:auto 1fr;',
  '  gap:6px 16px;align-items:baseline;}',
  '#sig-card dt{opacity:.6;font-size:12px;text-transform:uppercase;',
  '  letter-spacing:1px;white-space:nowrap;}',
  '#sig-card dd{margin:0;font-weight:600;word-break:break-all;}',
  '#sig-card .mono{font-family:Consolas,"Courier New",monospace;',
  '  font-size:13px;color:#c9ec4e;}',
  '#sig-card button{margin-top:20px;background:#c9ec4e;color:#12200a;',
  '  border:0;border-radius:9px;padding:10px 20px;font-size:14px;',
  '  font-weight:700;cursor:pointer;}',
  '#sig-card p{margin:14px 0 0;font-size:12px;opacity:.55;line-height:1.6;}'
].join('');
document.head.appendChild(css);

/* 4) köşedeki imza ------------------------------------------------ */
const mark = document.createElement('div');
mark.id = 'sig-mark';
mark.textContent = '© ' + SIGN.yil + ' ' + SIGN.sahip;
mark.title = satir;
document.body.appendChild(mark);

/* 5) künye paneli ------------------------------------------------- */
const panel = document.createElement('div');
panel.id = 'sig-panel';
const alan = (k, v, mono) =>
  '<dt>' + k + '</dt><dd' + (mono ? ' class="mono"' : '') + '>' + v + '</dd>';
panel.innerHTML =
  '<div id="sig-card" role="dialog" aria-label="Telif künyesi">' +
    '<h3>Telif Künyesi</h3>' +
    '<dl>' +
      alan('Eser',    SIGN.eser) +
      alan('Sahip',   SIGN.sahip) +
      alan('İletişim',SIGN.iletisim) +
      alan('Telif',   '© ' + SIGN.yil + ' ' + SIGN.sahip) +
      alan('Tarih',   SIGN.tarih) +
      alan('Yapım kimliği', SIGN.kimlik, true) +
      alan('Damga',   SIGN.damga, true) +
    '</dl>' +
    '<p>Bu künye uygulamanın kaynağına gömülüdür; sayfa kaynağındaki ' +
    '<code>meta</code> etiketlerinde ve tarayıcı konsolunda da görünür.</p>' +
    '<button type="button" id="sig-close">Kapat</button>' +
  '</div>';
document.body.appendChild(panel);

const ac    = () => panel.classList.add('open');
const kapat = () => panel.classList.remove('open');
panel.addEventListener('click', e => { if (e.target === panel) kapat(); });
document.getElementById('sig-close').addEventListener('click', kapat);

/* 6) açma yolları -------------------------------------------------- */
// a) imzaya 2 saniye basılı tut (dokunmatikte de çalışır)
let bekle = null;
const basla = e => { e.preventDefault(); bekle = setTimeout(ac, 2000); };
const birak = () => { clearTimeout(bekle); bekle = null; };
mark.addEventListener('pointerdown', basla);
['pointerup','pointerleave','pointercancel'].forEach(t =>
  mark.addEventListener(t, birak));

// b) klavyeden "imza" yaz
let tampon = '';
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') return kapat();
  if (e.key.length !== 1) return;
  const t = e.target && e.target.tagName;      // ayar panelinde yazarken tetiklenmesin
  if (t === 'INPUT' || t === 'TEXTAREA') return;
  tampon = (tampon + e.key.toLowerCase()).slice(-8);
  if (tampon.indexOf('imza') !== -1){ tampon = ''; ac(); }
});

// c) konsoldan çağırmak için
window.TELIF = Object.freeze(Object.assign({ goster: ac }, SIGN));

})();
