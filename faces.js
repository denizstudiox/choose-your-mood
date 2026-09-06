/* ================= BrewMood yüzleri =================
   Videodaki çizgi-stili yüzler. Hazır görsel yok; her yüz
   parçalardan (göz + ağız + kaş + aksan) SVG olarak kuruluyor.

   100x100'lük bir kutuda çizilir: yüz merkezi (50,50), yarıçap 45.
   Böylece hem çarktaki küçük rozette hem sonuç kartındaki
   büyük halde aynı dosya, keskin şekilde kullanılır.

   Yeni yüz eklemek: FACES tablosuna
     "MOD ADI": { b:'kaş', e:'göz', m:'ağız', x:['aksan', ...] }
   satırı ekleyin. Parça adları aşağıdaki BROWS / EYES /
   MOUTHS / EXTRAS tablolarında.
==================================================== */
(() => {
'use strict';

const NS = 'http://www.w3.org/2000/svg';

/* yerleşim */
const CX = 50, CY = 50, R = 45;
const EL = 34, ER = 66;      // sol / sağ göz merkezi
const EY = 42;               // göz hizası
const BY = 27;               // kaş hizası
const MY = 68;               // ağız hizası

/* kısa yazım: ['etiket', {öznitelikler}] */
const n = (tag, at, txt) => [tag, at, txt];
const path  = (d, cls, w) => n('path',   { d, class: cls || 'f-ink', 'stroke-width': w || 3.4 });
const line  = (x1,y1,x2,y2, cls, w) => n('line', { x1,y1,x2,y2, class: cls || 'f-ink', 'stroke-width': w || 3.4 });
const circ  = (cx,cy,r, cls, w) => n('circle', { cx,cy,r, class: cls || 'f-ink', 'stroke-width': w || 3 });
const ell   = (cx,cy,rx,ry, cls, w) => n('ellipse', { cx,cy,rx,ry, class: cls || 'f-ink', 'stroke-width': w || 3 });

/* ---------------- kaşlar ---------------- */
const BROWS = {
  none:   () => [],
  raised: () => [ path('M ' + (EL-9) + ' ' + (BY+2) + ' q 9 -6 18 0', 'f-ink', 3),
                  path('M ' + (ER-9) + ' ' + (BY+2) + ' q 9 -6 18 0', 'f-ink', 3) ],
  angry:  () => [ path('M ' + (EL-10) + ' ' + (BY-2) + ' L ' + (EL+9) + ' ' + (BY+6), 'f-ink', 3.6),
                  path('M ' + (ER+10) + ' ' + (BY-2) + ' L ' + (ER-9) + ' ' + (BY+6), 'f-ink', 3.6) ],
  sad:    () => [ path('M ' + (EL-10) + ' ' + (BY+6) + ' L ' + (EL+9) + ' ' + (BY-1), 'f-ink', 3.2),
                  path('M ' + (ER+10) + ' ' + (BY+6) + ' L ' + (ER-9) + ' ' + (BY-1), 'f-ink', 3.2) ],
  one:    () => [ path('M ' + (EL-10) + ' ' + (BY+4) + ' q 10 -9 19 -1', 'f-ink', 3.2),
                  path('M ' + (ER-9) + ' ' + (BY+3) + ' q 9 -2 18 0', 'f-ink', 3) ],
  flat:   () => [ line(EL-9, BY+2, EL+9, BY+2, 'f-ink', 3),
                  line(ER-9, BY+2, ER+9, BY+2, 'f-ink', 3) ]
};

/* ---------------- gözler ---------------- */
// referanstaki temel göz: dik oval + dolu bebek
const eyeOval = x => [ ell(x, EY, 8, 10.5, 'f-white-s', 3),
                       ell(x, EY + 2.5, 4.2, 5.4, 'f-pupil', 0) ];

const EYES = {
  open:   () => [].concat(eyeOval(EL), eyeOval(ER)),
  dot:    () => [ circ(EL, EY, 4.2, 'f-fill', 0), circ(ER, EY, 4.2, 'f-fill', 0) ],
  happy:  () => [ path('M ' + (EL-9) + ' ' + (EY+4) + ' q 9 -13 18 0', 'f-ink', 4),
                  path('M ' + (ER-9) + ' ' + (EY+4) + ' q 9 -13 18 0', 'f-ink', 4) ],
  closed: () => [ path('M ' + (EL-9) + ' ' + EY + ' q 9 9 18 0', 'f-ink', 3.6),
                  path('M ' + (ER-9) + ' ' + EY + ' q 9 9 18 0', 'f-ink', 3.6) ],
  half:   () => [ line(EL-9, EY-1, EL+9, EY-1, 'f-ink', 3.6),
                  line(ER-9, EY-1, ER+9, EY-1, 'f-ink', 3.6),
                  circ(EL, EY + 4, 2.6, 'f-fill', 0), circ(ER, EY + 4, 2.6, 'f-fill', 0) ],
  wink:   () => [].concat(eyeOval(EL),
                  [ path('M ' + (ER-9) + ' ' + (EY+3) + ' q 9 -12 18 0', 'f-ink', 4) ]),
  wide:   () => [ circ(EL, EY, 10, 'f-white-s', 3), circ(EL, EY, 3.4, 'f-fill', 0),
                  circ(ER, EY, 10, 'f-white-s', 3), circ(ER, EY, 3.4, 'f-fill', 0) ],
  pleading:()=> [ circ(EL, EY, 10.5, 'f-white-s', 3), circ(EL, EY+1, 6, 'f-pupil', 0),
                  circ(EL-2.5, EY-2.5, 2.6, 'f-white', 0),
                  circ(ER, EY, 10.5, 'f-white-s', 3), circ(ER, EY+1, 6, 'f-pupil', 0),
                  circ(ER-2.5, EY-2.5, 2.6, 'f-white', 0) ],
  x:      () => [ path('M ' + (EL-7) + ' ' + (EY-7) + ' l 14 14 M ' + (EL+7) + ' ' + (EY-7) + ' l -14 14', 'f-ink', 4),
                  path('M ' + (ER-7) + ' ' + (EY-7) + ' l 14 14 M ' + (ER+7) + ' ' + (EY-7) + ' l -14 14', 'f-ink', 4) ],
  sad:    () => [].concat(eyeOval(EL), eyeOval(ER),
                  [ path('M ' + (EL-10) + ' ' + (EY-9) + ' q 10 -3 19 3', 'f-ink', 3),
                    path('M ' + (ER+10) + ' ' + (EY-9) + ' q -10 -3 -19 3', 'f-ink', 3) ]),
  angry:  () => [].concat(eyeOval(EL), eyeOval(ER),
                  [ path('M ' + (EL-10) + ' ' + (EY-13) + ' L ' + (EL+9) + ' ' + (EY-5), 'f-ink', 4),
                    path('M ' + (ER+10) + ' ' + (EY-13) + ' L ' + (ER-9) + ' ' + (EY-5), 'f-ink', 4) ]),
  heart:  () => [ n('path', { d: heartD(EL, EY, 10), class:'f-acc-f', 'stroke-width':0 }),
                  n('path', { d: heartD(ER, EY, 10), class:'f-acc-f', 'stroke-width':0 }) ],
  star:   () => [ n('path', { d: starD(EL, EY, 10), class:'f-fill', 'stroke-width':0 }),
                  n('path', { d: starD(ER, EY, 10), class:'f-fill', 'stroke-width':0 }) ],
  spiral: () => [ path(spiralD(EL, EY, 10), 'f-ink', 2.6),
                  path(spiralD(ER, EY, 10), 'f-ink', 2.6) ],
  money:  () => [ n('text', { x:EL, y:EY+6, class:'f-glyph' }, '$'),
                  n('text', { x:ER, y:EY+6, class:'f-glyph' }, '$') ],
  side:   () => [ ell(EL, EY, 8, 10.5, 'f-white-s', 3), ell(ER, EY, 8, 10.5, 'f-white-s', 3),
                  circ(EL - 3, EY - 2.5, 3.8, 'f-fill', 0), circ(ER - 3, EY - 2.5, 3.8, 'f-fill', 0) ],
  lashes: () => [].concat(eyeOval(EL), eyeOval(ER),
                  [ path('M ' + (EL-9) + ' ' + (EY-8) + ' l -5 -4 M ' + (EL-4) + ' ' + (EY-11) + ' l -3 -5', 'f-ink', 2.6),
                    path('M ' + (ER+9) + ' ' + (EY-8) + ' l 5 -4 M ' + (ER+4) + ' ' + (EY-11) + ' l 3 -5', 'f-ink', 2.6) ]),
  up:     () => [ ell(EL, EY, 8, 10.5, 'f-white-s', 3), ell(EL, EY - 3, 4.2, 5, 'f-pupil', 0),
                  ell(ER, EY, 8, 10.5, 'f-white-s', 3), ell(ER, EY - 3, 4.2, 5, 'f-pupil', 0) ],
  tired:  () => [ path('M ' + (EL-9) + ' ' + (EY-2) + ' q 9 8 18 0', 'f-ink', 3.4),
                  path('M ' + (ER-9) + ' ' + (EY-2) + ' q 9 8 18 0', 'f-ink', 3.4),
                  path('M ' + (EL-7) + ' ' + (EY+7) + ' q 7 5 14 0', 'f-ink', 2.2),
                  path('M ' + (ER-7) + ' ' + (EY+7) + ' q 7 5 14 0', 'f-ink', 2.2) ]
};

/* ---------------- ağızlar ---------------- */
const MOUTHS = {
  // referanstaki açık gülümseme: dış hat + iç boşluk
  grin:  () => [ n('path', { d:'M 31 ' + (MY-5) + ' q 19 26 38 0 q -19 9 -38 0 z', class:'f-white-s', 'stroke-width':3.2 }) ],
  smile: () => [ path('M 33 ' + (MY-3) + ' q 17 15 34 0', 'f-ink', 3.6) ],
  flat:  () => [ line(37, MY, 63, MY, 'f-ink', 3.6) ],
  frown: () => [ path('M 34 ' + (MY+5) + ' q 16 -15 32 0', 'f-ink', 3.6) ],
  sigh:  () => [ path('M 36 ' + (MY+2) + ' q 14 -8 28 -1', 'f-ink', 3.4) ],
  wavy:  () => [ path('M 33 ' + MY + ' q 5 -6 9 0 t 9 0 t 9 0 t 9 0', 'f-ink', 3.4) ],
  open:  () => [ ell(50, MY + 1, 7, 8.5, 'f-white-s', 3.2) ],
  bigopen:()=> [ n('path', { d:'M 30 ' + (MY-8) + ' q 20 -6 40 0 q -6 26 -20 26 q -14 0 -20 -26 z', class:'f-white-s', 'stroke-width':3.2 }) ],
  teeth: () => [ n('rect', { x:32, y:MY-8, width:36, height:16, rx:4, class:'f-white-s', 'stroke-width':3 }),
                 line(50, MY-8, 50, MY+8, 'f-ink', 2),
                 line(41, MY-8, 41, MY+8, 'f-ink', 2),
                 line(59, MY-8, 59, MY+8, 'f-ink', 2),
                 line(32, MY, 68, MY, 'f-ink', 2) ],
  tongue:() => [ n('path', { d:'M 31 ' + (MY-5) + ' q 19 26 38 0 q -19 9 -38 0 z', class:'f-white-s', 'stroke-width':3.2 }),
                 n('path', { d:'M 45 ' + (MY+8) + ' q 6 12 13 1 q -6 4 -13 -1 z', class:'f-acc-f', 'stroke-width':0 }) ],
  smirk: () => [ path('M 35 ' + (MY+2) + ' q 14 6 28 -8', 'f-ink', 3.6) ],
  cat:   () => [ path('M 37 ' + (MY-2) + ' q 6 9 13 0 q 7 9 13 0', 'f-ink', 3.4) ],
  kiss:  () => [ n('path', { d:'M 44 ' + MY + ' q 6 -8 12 0 q -6 10 -12 0 z', class:'f-acc-f', 'stroke-width':0 }),
                 path('M 44 ' + MY + ' q 6 -8 12 0 q -6 10 -12 0', 'f-acc', 2.2) ],
  small: () => [ ell(50, MY, 4.5, 4, 'f-white-s', 2.8) ]
};

/* ---------------- aksanlar ---------------- */
const EXTRAS = {
  none:   () => [],
  hearts: () => [ n('path', { d: heartD(84, 22, 11), class:'f-acc-f', 'stroke-width':0 }),
                  n('path', { d: heartD(16, 30,  8), class:'f-acc-f', 'stroke-width':0 }) ],
  heart:  () => [ n('path', { d: heartD(83, 24, 12), class:'f-acc-f', 'stroke-width':0 }) ],
  broken: () => [ n('path', { d: heartD(83, 24, 13), class:'f-acc-f', 'stroke-width':0 }),
                  path('M 83 13 l -5 7 l 7 4 l -5 8', 'f-white-line', 3.4) ],
  question:()=> [ n('text', { x:80, y:32, class:'f-glyph-acc' }, '?') ],
  dots:   () => [ circ(64, 82, 3.2, 'f-fill', 0), circ(74, 78, 3.2, 'f-fill', 0), circ(83, 72, 3.2, 'f-fill', 0) ],
  sparkle:() => [ n('path', { d: sparkD(85, 20, 10), class:'f-white', 'stroke-width':0 }),
                  n('path', { d: sparkD(15, 28, 7),  class:'f-white', 'stroke-width':0 }) ],
  blush:  () => [ ell(20, 60, 8, 5, 'f-acc-f', 0), ell(80, 60, 8, 5, 'f-acc-f', 0) ],
  sweat:  () => [ n('path', { d: dropD(84, 24, 10), class:'f-drop', 'stroke-width':0 }) ],
  tears:  () => [ n('path', { d: dropD(EL, EY + 16, 8), class:'f-pupil', 'stroke-width':0 }),
                  n('path', { d: dropD(ER, EY + 16, 8), class:'f-pupil', 'stroke-width':0 }) ],
  zzz:    () => [ n('text', { x:82, y:28, class:'f-glyph-sm' }, 'z'),
                  n('text', { x:92, y:16, class:'f-glyph-xs' }, 'z') ],
  thumb:  () => [ n('path', { d:'M 20 78 q 0 -10 5 -14 q 3 -3 4 -9 q 1 -5 5 -4 q 4 1 2 8 l -1 5 l 10 0 q 5 0 4 5 l -2 12 q -1 5 -6 5 l -16 0 q -5 0 -5 -8 z',
                    class:'f-white-s', 'stroke-width':2.8, transform:'translate(-9,4)' }) ],
  bolt:   () => [ n('path', { d:'M 84 12 l -11 18 l 7 1 l -8 16 l 14 -20 l -7 -1 z', class:'f-acc-f', 'stroke-width':0 }) ],
  flame:  () => [ n('path', { d:'M 82 12 q 8 8 6 15 q -1 6 -6 8 q -6 -1 -7 -8 q -1 -8 7 -15 z', class:'f-acc-f', 'stroke-width':0 }) ],
  cloud:  () => [ n('path', { d:'M 66 20 q -6 0 -6 -5 q 0 -5 6 -5 q 1 -6 8 -6 q 7 0 8 6 q 6 0 6 5 q 0 5 -6 5 z',
                    class:'f-white-s', 'stroke-width':2.6 }) ],
  thermo: () => [ line(72, 16, 88, 38, 'f-white-line', 6.5),
                  line(74, 19, 86, 35, 'f-acc', 3),
                  circ(89, 40, 5, 'f-acc-f', 0) ],
  clover: () => [ circ(78, 19, 5.4, 'f-white-s', 2), circ(89, 19, 5.4, 'f-white-s', 2),
                  circ(83.5, 12, 5.4, 'f-white-s', 2), circ(83.5, 26, 5.4, 'f-white-s', 2) ],
  wings:  () => [ path('M 3 40 q 12 -12 21 -3 q -12 0 -21 3 z', 'f-white', 0),
                  path('M 97 40 q -12 -12 -21 -3 q 12 0 21 3 z', 'f-white', 0) ],
  dash:   () => [ line(76, 20, 96, 20, 'f-white-line', 3.4), line(76, 30, 90, 30, 'f-white-line', 3.4) ],
  shades: () => [ n('path', { d:'M 16 36 q 18 -5 68 0 l -2 6 q -3 12 -14 12 q -12 0 -14 -11 q -4 -2 -8 0 q -2 11 -14 11 q -11 0 -14 -12 z',
                    class:'f-fill', 'stroke-width':0 }) ]
};

/* ---------------- şekil yardımcıları ---------------- */
function heartD(cx, cy, s){
  const r = s / 2;
  return 'M ' + cx + ' ' + (cy + r * 1.25) +
         ' C ' + (cx - r * 2) + ' ' + (cy - r * 0.2) + ' ' + (cx - r) + ' ' + (cy - r * 1.6) + ' ' + cx + ' ' + (cy - r * 0.45) +
         ' C ' + (cx + r) + ' ' + (cy - r * 1.6) + ' ' + (cx + r * 2) + ' ' + (cy - r * 0.2) + ' ' + cx + ' ' + (cy + r * 1.25) + ' z';
}
function starD(cx, cy, s){
  let d = '';
  for (let i = 0; i < 10; i++){
    const a  = (Math.PI / 5) * i - Math.PI / 2;
    const rr = (i % 2 ? s * 0.42 : s);
    d += (i ? ' L ' : 'M ') + (cx + rr * Math.cos(a)).toFixed(2) + ' ' + (cy + rr * Math.sin(a)).toFixed(2);
  }
  return d + ' z';
}
function sparkD(cx, cy, s){
  return 'M ' + cx + ' ' + (cy - s) +
         ' q ' + (s * 0.22) + ' ' + (s * 0.78) + ' ' + s + ' ' + s +
         ' q ' + (-s * 0.78) + ' ' + (s * 0.22) + ' ' + (-s) + ' ' + s +
         ' q ' + (-s * 0.22) + ' ' + (-s * 0.78) + ' ' + (-s) + ' ' + (-s) +
         ' q ' + (s * 0.78) + ' ' + (-s * 0.22) + ' ' + s + ' ' + (-s) + ' z';
}
function dropD(cx, cy, s){
  return 'M ' + cx + ' ' + (cy - s) +
         ' q ' + (s * 0.72) + ' ' + (s * 0.8) + ' ' + (s * 0.55) + ' ' + (s * 1.15) +
         ' a ' + (s * 0.55) + ' ' + (s * 0.55) + ' 0 0 1 ' + (-s * 1.1) + ' 0' +
         ' q ' + (-s * 0.17) + ' ' + (-s * 0.35) + ' ' + (s * 0.55) + ' ' + (-s * 1.15) + ' z';
}
function spiralD(cx, cy, s){
  let d = 'M ' + cx + ' ' + cy;
  for (let i = 1; i <= 26; i++){
    const a = i * 0.62, r = s * (i / 26);
    d += ' L ' + (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2);
  }
  return d;
}

/* ---------------- mod → yüz tarifi ---------------- */
const FACES = {
  'AŞK':           { b:'raised', e:'heart',   m:'smile',   x:['hearts']  },
  'ÇAPKIN':        { b:'one',    e:'wink',    m:'smirk',   x:['sparkle'] },
  'DENGESİZ':      { b:'one',    e:'spiral',  m:'wavy',    x:[]          },
  'HANGOVER':      { b:'sad',    e:'tired',   m:'wavy',    x:['sweat']   },
  'HEYECANLI':     { b:'raised', e:'star',    m:'grin',    x:['sparkle'] },
  'KARARSIZ':      { b:'none',   e:'side',    m:'flat',    x:['question']},
  'PAMUK GİBİ':    { b:'none',   e:'happy',   m:'cat',     x:['blush']   },
  'SICAKKANLI':    { b:'raised', e:'happy',   m:'grin',    x:['blush']   },
  'UMUTLU':        { b:'raised', e:'up',      m:'smile',   x:['sparkle'] },
  'YIKIK':         { b:'sad',    e:'x',       m:'frown',   x:[]          },

  'BİR ŞEY EKSİK': { b:'one',    e:'side',    m:'flat',    x:['dots']    },
  'ÇEKİCİ':        { b:'one',    e:'wink',    m:'kiss',    x:['heart']   },
  'DÜŞÜNCELİ':     { b:'none',   e:'side',    m:'smirk',   x:['question']},
  'HARİKA':        { b:'raised', e:'open',    m:'grin',    x:['thumb']   },
  'HUZURLU':       { b:'none',   e:'closed',  m:'smile',   x:[]          },
  'LOSER':         { b:'sad',    e:'sad',     m:'frown',   x:[]          },
  'PARAGÖZ':       { b:'raised', e:'money',   m:'grin',    x:[]          },
  'STANDART':      { b:'flat',   e:'dot',     m:'flat',    x:[]          },
  'UYKUSUZ':       { b:'sad',    e:'wide',    m:'wavy',    x:[]          },
  'YORGUN':        { b:'sad',    e:'tired',   m:'sigh',    x:['sweat']   },

  'BOK GİBİ':      { b:'sad',    e:'x',       m:'wavy',    x:['cloud']   },
  'ÇILGIN':        { b:'raised', e:'spiral',  m:'bigopen', x:[]          },
  'EH İŞTE':       { b:'flat',   e:'half',    m:'flat',    x:[]          },
  'HASTA':         { b:'sad',    e:'half',    m:'wavy',    x:['thermo']  },
  'MİNNOŞ':        { b:'sad',    e:'pleading',m:'cat',     x:['blush']   },
  'RÜKÜŞ':         { b:'one',    e:'lashes',  m:'kiss',    x:['sparkle'] },
  'STRESLİ':       { b:'angry',  e:'wide',    m:'teeth',   x:['sweat']   },
  'UYUŞUK':        { b:'sad',    e:'half',    m:'small',   x:['zzz']     },

  'AGRESİF':       { b:'none',   e:'angry',   m:'teeth',   x:[]          },
  'BOMBA GİBİ':    { b:'raised', e:'star',    m:'grin',    x:['flame']   },
  'DARMADAĞIN':    { b:'one',    e:'spiral',  m:'wavy',    x:['dash']    },
  'ENERJİK':       { b:'raised', e:'wide',    m:'grin',    x:['bolt']    },
  'HAVALI':        { b:'none',   e:'dot',     m:'smirk',   x:['shades']  },
  'İNCİNMİŞ':      { b:'sad',    e:'sad',     m:'frown',   x:['broken']  },
  'MUTLU':         { b:'none',   e:'happy',   m:'grin',    x:[]          },
  'ŞANSLI':        { b:'raised', e:'happy',   m:'smile',   x:['clover']  },
  'ŞAPŞİK':        { b:'one',    e:'wink',    m:'tongue',  x:[]          },

  'AĞLAK':         { b:'sad',    e:'closed',  m:'frown',   x:['tears']   },
  'ÇALIŞKAN':      { b:'angry',  e:'open',    m:'flat',    x:['sweat']   },
  'DELİ GİBİ':     { b:'one',    e:'spiral',  m:'tongue',  x:[]          },
  'FARKETMEZ':     { b:'flat',   e:'half',    m:'smirk',   x:['dash']    },
  'HAYALPEREST':   { b:'raised', e:'up',      m:'smile',   x:['cloud']   },
  'İYİ':           { b:'none',   e:'dot',     m:'smile',   x:[]          },
  'ÖZGÜR':         { b:'raised', e:'closed',  m:'grin',    x:['wings']   },
  'SEXY':          { b:'one',    e:'lashes',  m:'kiss',    x:['flame']   },
  'ŞİRİN':         { b:'none',   e:'happy',   m:'cat',     x:['blush']   },
  'YALNIZ':        { b:'sad',    e:'sad',     m:'flat',    x:['cloud']   }
};

/* ---------------- kurucu ---------------- */
function build(spec){
  const parts = []
    .concat((BROWS [spec.b] || BROWS.none  )())
    .concat((EYES  [spec.e] || EYES.dot    )())
    .concat((MOUTHS[spec.m] || MOUTHS.smile)());
  (spec.x || []).forEach(k => { if (EXTRAS[k]) parts.push.apply(parts, EXTRAS[k]()); });
  return parts;
}

/**
 * Bir mod adı için 100x100'lük SVG <g> döndürür.
 * Tarifi olmayan modlarda null döner (çağıran emojiye düşer).
 */
function faceGroup(name){
  const spec = FACES[name];
  if (!spec) return null;

  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'face');

  // disk + çift halka (referanstaki gibi)
  const disc = document.createElementNS(NS, 'circle');
  disc.setAttribute('cx', CX); disc.setAttribute('cy', CY); disc.setAttribute('r', R);
  disc.setAttribute('class', 'f-disc');
  g.appendChild(disc);

  const ring = document.createElementNS(NS, 'circle');
  ring.setAttribute('cx', CX); ring.setAttribute('cy', CY); ring.setAttribute('r', R - 4.5);
  ring.setAttribute('class', 'f-ring');
  g.appendChild(ring);

  build(spec).forEach(item => {
    const [tag, at, txt] = item;
    const e = document.createElementNS(NS, tag);
    for (const k in at) e.setAttribute(k, at[k]);
    if (txt != null) e.textContent = txt;
    g.appendChild(e);
  });
  return g;
}

/** Sonuç kartı için hazır, kendi başına duran <svg>. */
function faceSvg(name){
  const g = faceGroup(name);
  if (!g) return null;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', 'face-svg');
  svg.appendChild(g);
  return svg;
}

window.BrewFaces = { faceGroup, faceSvg, has: name => !!FACES[name], list: () => Object.keys(FACES) };

})();
