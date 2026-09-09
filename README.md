# Choose Your Mood — dokunmatik çark kiosk'u

Kafedeki dokunmatik ekran için mod çarkı. **ÇEVİR**'e basılır, çark yavaşlayarak durur,
ibrenin gösterdiği mod büyük bir kartla ekranda belirir.

Kurulum gerekmez: harici kütüphane, build adımı, sunucu ya da internet
bağlantısı yok. Aynı dosyalar hem web adresinden hem de cihazın kendisinden
(çevrimdışı) çalışır.

**Canlı deneme:** <https://denizstudiox.github.io/choose-your-mood/>

## Çalıştırma

### İnternetten

Yukarıdaki adresi açmanız yeterli. Sayfa bir kez açıldıktan sonra da
internet gerekmez; ayarlar cihazın tarayıcısında saklanır.

### Cihazın kendisinden (çevrimdışı)

Dosyaları indirin — GitHub'da yeşil **Code** düğmesi → **Download ZIP** —
ve klasörü açın. Sonrasında:

- **Kiosk (önerilen):** `start.bat` — Chrome'u tam ekran kiosk modunda açar. Çıkış: `Alt+F4`.
- **Hızlı bakış:** `index.html` dosyasına çift tıklayın. Sunucu gerekmez;
  `file://` üzerinden de tam çalışır.
- **Telefon/tabletten (aynı Wi-Fi):** `serve.bat` — portu açar ve bağlanılacak
  adresi ekrana yazar.
- **Tek dosya:** `standalone.html` — her şey (CSS, JS, yüzler) içine gömülüdür.
  Tek başına kopyalanabilir: mail'le gönderilebilir, USB'den açılabilir.

## Kullanım

| Ne yapar | Nasıl |
|---|---|
| Çevir | **ÇEVİR** butonu, çarka dokunma, ya da `Boşluk` / `Enter` |
| Tam ekran | Sağ alttaki ⛶ ya da `F` |
| Ses aç/kapa | Sağ alttaki 🔊 (tercih cihazda saklanır) |
| Ayarlar | Sağ alttaki ⚙ |

Sonuç kartı ayarlanan süre dolunca kendiliğinden kapanır; kapanmadan tekrar
çevirirseniz de kapanır. 45 saniye dokunulmazsa buton dikkat çekmek için
hafifçe nabız gibi atar.

## Ayarlar (⚙)

Üç sekme var; hepsi bu cihazın tarayıcısında saklanır.

**Modlar** — her satıra bir mod: `YAZI | emoji`. **Modları kaydet** ile uygulanır,
**Varsayılan listeye dön** ile `moods.js`'e geri dönülür.

**Renkler** — 12 renk: arka plan (merkez/kenar), çark neonu, çark yazısı, göbek,
ibre, ÇEVİR butonu, sonuç çerçevesi, yüz zemini, yüz çizgisi, göz bebeği,
yüz vurgusu. Değişiklik anında uygulanır; neon parlaması da seçilen rengi izler.
**Renkleri varsayılana döndür** hepsini geri alır.

**Davranış**
- *Sonuç ekranda kalsın* — 0–30 saniye. `0` = kendiliğinden kapanmasın.
- *ÇEVİR butonunu göster* — kapatınca buton kaybolur, çark boşalan alanı
  doldurur ve altında "çevirmek için ekrana dokun" yönergesi belirir.
  Çarka (ya da yönergeye) dokunmak çevirir.
- *Ses* — köşedeki 🔊 ile aynı ayar.

## Mod listesini değiştirme

İki yol var:

1. **Ekrandan (⚙ butonu).** Her satır `YAZI | emoji` biçiminde. Kaydedince
   o cihazın tarayıcısında saklanır. "Varsayılana dön" ile dosyadaki listeye geri dönülür.
2. **Kalıcı olarak:** [`moods.js`](moods.js) dosyasını düzenleyin. Bu, tüm cihazlar için
   varsayılan listedir.

Kaç mod olursa olsun çark dilimleri, yazı boyutunu ve rozet boyutunu kendi ayarlar —
20 mod da yazabilirsiniz, 60 da.

## Yüzler

Rozetlerdeki ve sonuç kartındaki yüzler hazır bir ikon paketi değil; [`faces.js`](faces.js)
içinde parçalardan kuruluyor — kaş + göz + ağız + aksan. Videodaki görünüm (beyaz disk,
koyu mürekkep çizgiler, çift halka, kırmızı aksan) esas alındı.

Böylece: indirilecek dosya yok, lisans/atıf yükümlülüğü yok, her çözünürlükte keskin,
rengi CSS'ten tek yerden değişiyor (`--f-ink`, `--f-disc`, `--f-acc`).

Yeni bir mod eklerken yüzünü de tanımlamak için `faces.js` içindeki `FACES` tablosuna
bir satır ekleyin:

```js
'YENİ MOD': { b:'raised', e:'happy', m:'grin', x:['sparkle'] },
```

Kullanılabilir parça adları aynı dosyadaki `BROWS`, `EYES`, `MOUTHS`, `EXTRAS`
tablolarında listelidir. **Tarifi olmayan modlar** (örneğin ⚙ panelinden eklediğiniz
yeni bir mod) otomatik olarak `moods.js`'teki emoji karakterine düşer — yani hiçbir
zaman boş görünmez.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `index.html` | Sayfa iskeleti, SVG göbeği ve ibre |
| `style.css` | Neon görünüm, yüz renkleri, sonuç kartı, ayar paneli, duyarlı yerleşim |
| `app.js` | Çarkın çizimi, çevirme fiziği, ses, ayarlar |
| `moods.js` | **Mod listesi — düzenlemek isteyeceğiniz dosya** |
| `faces.js` | Çizilmiş yüzler (parça kütüphanesi + mod→yüz tablosu) |
| `build.py` | `standalone.html`'i üretir (`python build.py`) |
| `standalone.html` | Üretilmiş tek dosyalık sürüm — elle düzenlemeyin |
| `start.bat` | Chrome'u kiosk modunda açar |
| `serve.bat` | Aynı Wi-Fi'daki telefon/tabletler için yerel sunucu |
| `LICENSE` | **Kullanım koşulları — izinsiz kullanılamaz** |

## Notlar

- Ses dosyası yok; tık sesi ve bitiş melodisi WebAudio ile üretiliyor. Tarayıcılar
  ilk dokunuştan önce ses çalmaya izin vermez — bu normaldir, ilk ÇEVİR'de açılır.
- Sonuç, çevirmeden **önce** `crypto.getRandomValues` ile seçilir; animasyon her zaman
  ibrenin altındaki dilimde durur (matematiği 200.000 rastgele denemede doğrulandı).
- Yatay ekran için tasarlandı; dikey/dar ekranda çark üstte, buton altta olacak
  şekilde yerleşim kendini değiştirir.
- Çark dönerken neon parlama filtresi geçici olarak kapatılır: 48 yüz çizimle birlikte
  düğüm sayısı arttığı için, zayıf kiosk kutularında her karede filtre hesaplamak
  takılmaya yol açıyordu. Hızlı dönüşte fark edilmez, çark durunca geri gelir.

## Lisans

© 2026 denizstudiox — **tüm hakları saklıdır.**

Depo herkese açıktır, yani kaynak kod görüntülenebilir. Bunun dışında
hiçbir kullanım serbest değildir: kopyalamak, değiştirmek, dağıtmak ya da
bir kafede/mağazada/etkinlikte çalıştırmak **yazılı izin gerektirir**.

Koşulların tamamı [`LICENSE`](LICENSE) dosyasındadır.
İzin için: denizstudiox@gmail.com
