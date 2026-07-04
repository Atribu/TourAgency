# book to tour - Master Proje Metni

Bu dokuman, `book to tour` projesinin marka kimligini, ekran yapisini, yonetim panelini, icerik kurallarini ve teknik mimarisini tek yerde toplar. Amac, projeyi hem tasarim hem gelistirme hem de GPT tabanli uretim sureclerinde ayni dogrultuda ilerletmektir.

## 1. Proje Tanimi

`book to tour`, kullanicilarin yurt ici, yurt disi ve gunubirlik turlari kesfedebildigi, tur detaylarini inceleyebildigi, talep birakabildigi ve rezervasyon surecini baslatabildigi profesyonel bir seyahat platformudur.

Is modeli ilk asamada dogrudan kendi sanal POS altyapisina dayanmaz. Odeme akisinda ana model:

- kullanicidan rezervasyon veya on talep toplamak
- ilgili tur icin satis surecini yonetmek
- gerekli oldugunda odemeyi Jolly altyapisina veya Jolly odeme yonlendirmesine baglamak

Platform hem vitrinde guven veren bir tur markasi gibi calismali hem de operasyon tarafinda yonetilebilir bir admin panele sahip olmalidir.

## 2. Temel Is Kararlari

- Marka adi: `book to tour`
- Nihai logo sonra eklenecek, simdilik gecici ama duzgun bir logo kullanilacak
- Telefon, WhatsApp, e-posta, adres ve resmi belge bilgileri simdilik placeholder olabilir
- TURSAB belge alani sonra doldurulacak, ama sitede yeri hazir olacak
- Sistem hem `on talep` hem `rezervasyon talebi` toplayabilmeli
- Ilk fazda odeme sayfasi tam entegre olmayabilir; Jolly odeme yonlendirmesi ve manuel takip modeli desteklenecek
- Altyapi en basindan 4 dil destekleyecek: `TR`, `EN`, `DE`, `RU`
- Demo asamasinda veritabani zorunlu degil; sistem demo store ile calisabilmeli
- Arayuz taslagi gibi degil, yayina alinacakmis hissi veren seviyede olmali

## 3. Marka ve Tasarim Dili

### Marka hissi

Marka sicak, davetkar, guvenilir ve profesyonel hissettirmeli. "Tatil heyecani" ile "kurumsal guven" ayni anda verilmelidir.

### Renk sistemi

Ana renkler:

- Lacivert: `#28374f`
- Turuncu: `#ff9900`

Destek renkleri:

- Beyaz ana zemin: `#ffffff`
- Acik gri arka planlar: bolum ayrimi icin yumusak ama beyaza yakin tonlar
- Basarili durumlar icin kontrollu yesil
- Uyari ve hata alanlari icin sade kirmizi

Not:

- Krem agirlikli bir genel zemin kullanilmayacak
- Arayuzun ana okuma zemini beyaz olacak

### Tipografi

- Baslik fontu: `Montserrat`
- Govde ve arayuz yazilari: `Inter` veya mevcut sistemdeki benzer sade sans-serif

### Sekil dili

- Oval ve asiri yumusak formlar kullanilmayacak
- Butonlar, inputlar, kartlar ve paneller daha keskin, net ve kontrollu bir geometriye sahip olacak
- Radius degerleri dusuk tutulacak: tercihen `6px` veya `8px`
- `rounded-full` hissi veren kapsul yapilar genel tasarim dili olmamali

### UI karakteri

- Premium ama ulasilabilir
- Ferah ve okunabilir
- Bilgi yogun sayfalarda net hiyerarsi
- Mobilde temiz, masaustunde guclu grid yapisi

## 4. Tasarimda Kacinilacak Seyler

- Marka adinin baska bir isimle karismasi
- Asiri yuvarlak kartlar, kapsul butonlar, yumusak baloncuk UI
- Tek bir mockup dilinin birebir kopyalanmasi
- Fazla dekoratif ama bilgi tasimayan alanlar
- Landing page gibi duran ama kullaniciyi ture goturmeyen bos hero yapilari
- Kurumsal guveni zedeleyen sahte ya da taslak hissi

## 5. Ana Hedef Kullanici Gruplari

- Yaz tatili ve paket tur arayan bireysel kullanicilar
- Aileler
- Vizesiz tur arayan kullanicilar
- Kultur turlariyla ilgilenen yetiskin segment
- Gunubirlik ve kisa kacamak arayan kullanicilar
- Yurtdisindan gelip farkli dilde inceleme yapan ziyaretciler

## 6. Kullanici Tarafi Bilgi Mimarisi

Site en az su ana alanlardan olusmali:

- Ana sayfa
- Tur listeleme sayfasi
- Tur detay sayfasi
- Kampanyalar
- Rehber veya blog
- Iletisim
- Yasal sayfalar
- Hakkimizda
- SSS

Dil yapisi locale tabanli olmalidir:

- `/tr`
- `/en`
- `/de`
- `/ru`

## 7. Ana Sayfa Gereksinimleri

Ana sayfa sade bir tanitim sayfasi degil, satisa acilan giris ekrani olmalidir.

Icerik bolumleri:

- Guclu hero alani
- Hizli tur arama modulu
- Kategori bazli kesif alani
- Populer turlar
- Kampanyali veya one cikan turlar
- Neden bizi tercih etmelisiniz alani
- Guven rozetleri
- Jolly yonlendirme ve rezervasyon bilgilendirmesi
- Cok dilli destek vurgusu
- Blog veya rehber icerikleri
- Iletisim ve hizli talep formu

Hero mesajinda odak:

- kolay kesif
- guvenli rezervasyon sureci
- uzman destek
- yurt ici ve yurt disi secenekleri

## 8. Tur Listeleme Sayfasi

Listeleme ekrani kullanicinin hizli karar verecegi ticari bir ekran olmalidir.

Zorunlu ozellikler:

- Kategori veya tur tipi sekmeleri
- Bolge filtresi
- Fiyat araligi filtresi
- Sure filtresi
- Ulasim tipi
- Mevsim veya tarih secimi
- Dil veya hareket noktasi gibi ek filtreler
- Siralama secenekleri
- Sonuc sayisi
- Kart veya grid gorunumu

Her tur kartinda en az su bilgiler olmali:

- Kapak gorseli
- Tur adi
- Kisa aciklama
- Bolge veya rota
- Sure
- Ulasim tipi
- Cikis noktasi
- Baslangic fiyat
- Kampanya etiketi varsa
- Incele butonu
- Talep birak veya rezervasyon baslat butonu

## 9. Tur Detay Sayfasi

Tur detay sayfasi satisin merkezidir. Kullanici burada karar vermelidir.

Olmasi gereken alanlar:

- Guclu gorsel galeri
- Tur basligi
- Ozet bilgi seridi
- Fiyat bilgisi
- Hareket noktasi
- Sure
- Konaklama bilgisi
- Ulasim tipi
- Kontenjan veya uygunluk notu
- Dahil olan hizmetler
- Dahil olmayan hizmetler
- Gun gun program
- Harita veya rota ozeti
- SSS
- Yorumlar veya referans alani
- Benzer turlar
- Sabit rezervasyon veya talep paneli

Sag panel ya da mobil alt yapiskan aksiyon alaninda sunlar olmali:

- tarih secimi
- kisi sayisi
- fiyat ozet alanı
- talep olustur
- rezervasyon baslat
- Jolly odeme veya yonlendirme bilgilendirmesi

## 10. Rezervasyon ve On Talep Akisi

Platform ilk fazda hibrit bir akisla calisacak.

Kullanici akislari:

1. Kullanici dogrudan tur icin rezervasyon talebi gonderebilir
2. Kullanici sadece on bilgi / teklif / geri donus talebi birakabilir
3. Kullanici odeme asamasinda Jolly yonlendirmesine gecirilebilir

Formlarda olmasi gereken alanlar:

- ad soyad
- telefon
- e-posta
- kisi sayisi
- tercih edilen tarih
- not alani
- KVKK onayi
- iletisim izni
- Jolly yonlendirme bilgilendirmesi

Akis mantigi:

- Form gonderildiginde veri admin paneline dusmeli
- Durumlar: `Yeni`, `Takipte`, `Teklif verildi`, `Onaylandi`, `Iptal`, `Odeme bekleniyor`
- Kullanici tarafinda basarili bir "talebiniz alindi" deneyimi olmali

## 11. Iletisim ve Guven Katmani

Sitede guven olusturacak alanlar net gorunmeli:

- telefon
- WhatsApp
- e-posta
- ofis veya merkez bilgisi
- TURSAB belge alani
- sosyal medya alanlari
- acik rezervasyon sureci anlatimi

Guven mesajlari:

- uzman danisman destegi
- rezervasyon surecinde birebir iletisim
- odeme ve yonlendirme bilgilendirmesi
- yasal metinlere kolay erisim

## 12. Yasal Sayfalar

Yasal alanlar placeholder olsa bile yapisal olarak ilk gunden hazir olmalidir.

Gerekli sayfalar:

- KVKK
- Gizlilik Politikasi
- Cerez Politikasi
- Mesafeli Satis On Bilgilendirme Metni
- Paket Tur veya Hizmet Kosullari
- Iptal ve Iade Politikasi
- Iletisim ve resmi unvan bilgileri
- TURSAB belge alani

## 13. Rehber / Blog Alani

Icerik stratejisi acisindan blog veya rehber alani onemlidir.

Icerik turleri:

- gezi onerileri
- vizesiz rota icerikleri
- mevsime gore tur secim rehberleri
- aileler icin tur tavsiyeleri
- yurt disi gezi kontrol listeleri
- bolgesel tanitim icerikleri

Bu alan hem SEO hem guven hem de organik trafik icin calisacaktir.

## 14. Kampanya Yapisi

Kampanya sayfalari sadece banner degil, yonetilebilir landing benzeri icerikler olmali.

Olmasi gerekenler:

- indirimli turlar
- donemsel firsatlar
- erken rezervasyon
- son dakika turlari
- ozel koleksiyon sayfalari

## 15. Admin Panel Genel Yapisi

Admin panel demo olsa bile gercek urun gibi calismalidir. Taslak hissi vermemelidir.

Ana moduller:

- Dashboard
- Tur Yonetimi
- Tur Tarih ve Fiyat Yonetimi
- Talep ve Rezervasyon Takibi
- Kampanya ve Sayfa Yonetimi
- SEO ve Icerik Yonetimi
- Iletisim Talepleri
- Ayarlar
- Kullanici / rol mantigina hazir yapi

## 16. Admin Dashboard

Dashboard ekraninda sunlar yer almali:

- toplam gelen talepler
- aktif tur sayisi
- one cikan kampanyalar
- dil bazli trafik veya ilgi gorunumu
- son gelen talepler
- durum bazli lead dagilimi
- populer turlar
- manuel operasyon notlari icin alan

Demo ortamda bu veriler JSON tabanli store'dan gelebilir.

## 17. Tur Yonetimi Modulu

Tur yonetimi ekrani tam CRUD mantigina uygun olmalidir.

Yoneticinin yapabilmesi gerekenler:

- tur ekleme
- tur duzenleme
- tur silme
- aktif / pasif durumu verme
- one cikan tur isaretleme
- slug yonetimi
- kategori atama
- ulke / bolge / rota tanimlama
- sure, ulasim, hareket noktasi, fiyat, para birimi alanlarini yonetme
- gorsel ve galeri mantigina hazir alanlar
- Jolly yonlendirme linki tanimlama

Tur icerigi cok dilli kurgulanmalidir:

- baslik
- kisa aciklama
- detay aciklama
- dahil / haric maddeleri
- program gunleri
- SSS

## 18. Tur Tarih, Fiyat ve Kontenjan Yonetimi

Her tur icin birden fazla tarih yonetilebilmelidir.

Alanlar:

- baslangic tarihi
- bitis tarihi
- fiyat
- para birimi
- kontenjan notu
- durum
- varsa tarih bazli Jolly linki

Bu modulin mantigi daha sonra gercek veritabanina rahat tasinacak sekilde tasarlanmalidir.

## 19. Talep ve Rezervasyon Takibi

Admin panelinde lead ve rezervasyon yonetimi kritik alanlardan biridir.

Ozellikler:

- yeni gelen talepleri listeleme
- durum degistirme
- not dusme
- hangi turdan geldigi bilgisi
- hangi dilden geldigi bilgisi
- kullaniciya geri donus durumu
- odeme yonlendirme notu
- takipteki kayitlari filtreleme

## 20. SEO ve Icerik Yonetimi

SEO paneli sadece gostermelik olmamali, gercekten calisir mantikta kurgulanmalidir.

Alanlar:

- sayfa bazli meta baslik
- meta aciklama
- canonical mantigi
- index / noindex durumu
- open graph alanlari
- temel anahtar kelime notu
- icerik ozet alanlari
- blog sayfalarinin meta yonetimi

Yonetilebilir sayfa tipleri:

- ana sayfa
- tur listeleme
- tur detay
- kampanya sayfasi
- rehber yazisi
- statik sayfalar

## 21. Ayarlar Modulu

Ayarlar ekraninda en az sunlar bulunmali:

- site adi
- logo metni veya gecici logo
- telefon
- WhatsApp
- e-posta
- adres
- Jolly genel yonlendirme URL'i
- TURSAB belge numarasi alani
- sosyal medya linkleri
- varsayilan dil ayarlari

Bu alanlar demo store icinde saklanabilir.

## 22. Cok Dilli Mimari

Cok dilli yapi, sonradan eklenmis gibi degil, en basindan temel mimariye yerlestirilmis olmalidir.

Kurallar:

- Tum route'lar locale prefix ile calismali
- Metinler translation sisteminden gelmeli
- Tur, kampanya, rehber ve statik sayfalar dil bazli alanlara sahip olmali
- SEO alanlari da dil bazli dusunulmeli
- Admin panelinde her icerigin 4 dil sekmesi veya 4 dil alan yapisi olmali

Desteklenecek diller:

- Turkce
- Ingilizce
- Almanca
- Rusca

## 23. Teknik Mimari

Mevcut proje teknik olarak su omurga uzerinde ilerlemelidir:

- `Next.js 16`
- `React 19`
- `TypeScript`
- `App Router`
- `Tailwind CSS 4`

Mevcut yapida yer alan ve korunmasi gereken mantik:

- locale bazli route sistemi
- demo store tabanli gecici veri modeli
- admin ve lead API route'lari
- ileride veritabanina tasinabilecek moduler veri katmani

Ilk faz teknik yaklasim:

- Demo veri saklama icin JSON tabanli store
- CRUD islemleri icin local API route'lari
- UI tarafinda production'a yakin yonetim deneyimi
- Sonraki fazda DB adaptor mantigina gecis

## 24. Veri ve Icerik Modeli

Temel varliklar:

- Tour
- TourDate
- Lead
- ContactRequest
- ManagedPage
- Campaign
- Article
- SiteSettings
- User

Tur icerik modeli su mantiga uygun olmalidir:

- tekil kimlik
- slug
- kategori
- bolge
- sure
- fiyat baslangici
- jolly linki
- aktiflik
- one cikan bilgisi
- cok dilli icerik bloklari
- tarih/fiyat kayitlari

## 25. Analitik ve Takip

Sistemde en az temel seviye olay takibi dusunulmelidir.

Takip edilmesi faydali olaylar:

- tur karti tiklama
- tur detay goruntuleme
- lead form gonderimi
- iletisim formu gonderimi
- Jolly yonlendirme tiklamasi
- kampanya karti tiklamasi
- dil degistirme davranisi

## 26. UX Kurallari

- Her ekranda ana aksiyon net olmali
- Mobilde form kullanimi rahat olmali
- Fiyat ve tarih bilgisi kaybolmamali
- CTA alanlari gerektiginde sticky yapida olmali
- Arama ve filtreleme kolay ulasilabilir olmali
- Tur sayfalari hem duygusal hem bilgi odakli karar vermeye yardim etmeli
- Kullanici odemeyi hemen yapmasa bile kolayca talep birakabilmeli

## 27. Bu Proje Icin Net Tasarim Kurallari

- Marka adi her yerde sadece `book to tour` olacak
- `TRAVLR` benzeri baska marka isimleri kullanilmayacak
- Beyaz ana zemin korunacak
- Lacivert ve turuncu ana vurgu renkleri olacak
- Keskin ve net UI dili korunacak
- Asiri yuvarlak form yapilarindan kacinilacak
- Demo modda bile gercek urun hissi verilecek

## 28. GPT Icin Hazir Master Prompt

Asagidaki metin, tasarim veya gelistirme yardimi almak icin GPT'ye dogrudan verilebilir:

```text
"book to tour" isimli profesyonel bir tur ve seyahat platformu tasarliyorum. Platformun marka kimligi sicak tatil hissi veren ama ayni zamanda guven oluşturan bir yapiya sahip olmali. Ana renkler lacivert (#28374f) ve turuncu (#ff9900). Arka plan zemini agirlikli olarak beyaz olmali. Tipografide Montserrat baslik, sade bir sans-serif govde yazi yapisi kullanilmali.

Bu marka icin yuvarlak ve oval hatli bir arayuz istemiyorum. Kartlar, butonlar, inputlar ve paneller daha keskin hatli, net, modern ve profesyonel gorunmeli. Radius degerleri dusuk olmali; asiri rounded tasarim dili kullanilmayacak.

Platformun amaci yurt ici, yurt disi ve gunubirlik turlar satmak ve kullanicidan rezervasyon/on talep toplamaktir. Is modeli ilk asamada tam odeme entegrasyonuna dayanmayacak. Kullanici turu inceleyebilecek, rezervasyon talebi veya on talep birakabilecek, gerekli asamada odeme icin Jolly yapisina veya Jolly yonlendirme akısina gecirilebilecek. Bu nedenle sistemde hem lead toplama hem rezervasyon baslatma mantigi birlikte yer almali.

Platform 4 dili desteklemeli: Turkce, Ingilizce, Almanca ve Rusca. Mimari buna gore en bastan kurulmalı; locale bazli route yapisi, cok dilli icerik alanlari ve dil bazli SEO alanlari dusunulmeli.

Kullanici tarafinda su sayfalar ve moduller bulunmali:
- Ana sayfa
- Tur listeleme / kesfet sayfasi
- Tur detay sayfasi
- Kampanyalar
- Rehber / blog
- Iletisim
- Hakkimizda
- SSS
- Yasal sayfalar

Ana sayfada guclu bir hero, hizli arama modulu, kategori alanlari, populer turlar, kampanyali turlar, guven rozetleri, iletisim / talep alani ve blog/rehber alanlari olmali.

Tur listeleme sayfasinda kategori, bolge, fiyat, sure, tarih, ulasim gibi filtreler olmali. Tur kartlarinda gorsel, baslik, kisa aciklama, rota, sure, fiyat, cikis noktasi ve aksiyon butonlari yer almali.

Tur detay sayfasinda etkileyici galeri, fiyat bilgisi, rota ozeti, sure, dahil/hariç hizmetler, gun gun program, SSS, yorumlar, benzer turlar ve sticky rezervasyon/talep paneli bulunmali.

Rezervasyon akisi hibrit olmali:
- kullanici rezervasyon talebi birakabilmeli
- kullanici sadece on bilgi/talep formu gonderebilmeli
- odeme gerekli asamada Jolly yonlendirmesiyle ilerleyebilmeli

Admin paneli taslak gibi degil, yayina alinabilecek seviyede gorunmeli. Sistem demo store ile veritabanisiz calisabilmeli ama gelecekte veritabanina baglanabilecek temiz bir mimariye sahip olmali.

Admin panelde su moduller olmali:
- Dashboard
- Tur Yonetimi
- Tur tarih/fiyat/kontenjan yonetimi
- Talep ve rezervasyon takibi
- Kampanya ve statik sayfa yonetimi
- SEO ve icerik yonetimi
- Ayarlar

Tur yonetiminde ekleme, duzenleme, silme, aktif/pasif, one cikan tur, slug, kategori, fiyat, rota, sure, gorsel ve Jolly link yonetimi olmali. Her tur icin cok dilli alanlar bulunmali.

SEO paneli gercek mantikta calismali. Meta title, meta description, canonical, open graph, index/noindex ve icerik notlari sayfa bazli yonetilebilmeli.

Yasal alanlar ilk gunden yapisal olarak hazir olmali: KVKK, Gizlilik Politikasi, Cerez Politikasi, Mesafeli Satis On Bilgilendirme, Iptal/Iade, Hizmet Kosullari, Iletisim, TURSAB belge alani.

Lutfen bu projeyi sadece guzel gorunen bir mockup gibi degil, gercek bir tur satis ve talep toplama platformu gibi dusun. Tasarim, bilgi mimarisi, komponent yapisi, admin panel kurgusu ve teknik mimari bu hedefe gore sekillensin."
```

## 29. Daha Kisa Teknik Uretim Promptu

Bu daha kisa versiyon, kod uretirken veya yeni ekran isterken kullanilabilir:

```text
book to tour icin production hissi veren, cok dilli bir tur satis ve talep toplama platformu gelistir. Marka renkleri #28374f ve #ff9900, zemin beyaz, tipografi Montserrat agirlikli olsun. Tasarim keskin hatli olsun; asiri yuvarlak UI kullanma. Kullanicı tarafinda ana sayfa, tur listeleme, tur detay, kampanyalar, rehber, iletisim ve yasal sayfalar olsun. Odeme ilk fazda Jolly yonlendirmesiyle veya manuel surecle ilerlesin; bu nedenle rezervasyon talebi ve on talep akislari birlikte desteklensin. Admin panelde dashboard, tur CRUD, tarih/fiyat yonetimi, lead takibi, SEO paneli, sayfa yonetimi ve ayarlar modulleri bulunsun. Altyapi TR/EN/DE/RU destekli locale mimarisiyle kurulsun ve demo store ile veritabanisiz da calisabilsin.
```

## 30. Bu Dokumanin Pratik Kullanimi

Bu metin su amaclarla kullanilabilir:

- tasarim brief'i olarak
- gelistiriciya teknik kapsam vermek icin
- GPT veya benzeri araclardan tutarli cikti almak icin
- admin ve kullanici tarafi ekranlarini ayni mantikta buyutmek icin
- ileride veritabani, odeme ve operasyon entegrasyonlarina gecis yaparken referans belge olarak

## 31. Son Karar

Bu proje, basit bir tatil vitrini degil; guven veren, operasyonel olarak yonetilebilir, cok dilli, lead ve rezervasyon odakli bir tur platformudur. Tasarim dili sicak ama duzgun; teknik yapi esnek ama duzensiz degil; admin paneli demo olsa bile ciddi bir urun kalitesinde hissettirmelidir.
