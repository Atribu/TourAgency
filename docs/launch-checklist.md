# book to tour Launch Checklist

Bu liste canlıya çıkıştan önce hızlı kontrol için tutulur.

## Zorunlu

- `ADMIN_AUTH_SECRET` güçlü ve canlı ortama özel olmalı.
- `ADMIN_PASSWORD` demo şifreden farklı olmalı.
- Gerçek telefon, WhatsApp ve e-posta bilgileri girilmeli.
- TÜRSAB belge numarası ve doğrulama alanı doldurulmalı.
- Jolly yönlendirme linkleri tur ve tarih bazında kontrol edilmeli.
- KVKK, mesafeli satış, paket tur sözleşmesi, iptal/iade ve iletişim sayfaları son metinlerle güncellenmeli.
- `/api/health`, `/sitemap.xml` ve `/robots.txt` canlı domain üzerinde kontrol edilmeli.

## Canlı Öncesi

- `DATA_SOURCE=postgres` ve `DATABASE_URL` ile database bağlantısı test edilmeli.
- TR/EN/DE/RU sayfa başlığı, slug, meta title, meta description ve canonical alanları gözden geçirilmeli.
- Ana sayfa, tur listeleme, tur detay, ön talep formu, Jolly linki ve WhatsApp linki mobil/desktop test edilmeli.
- Admin panelde tur CRUD, tarih/fiyat yönetimi, lead CRM, SEO paneli ve raporlar denenmeli.
- Google Analytics / GTM eklenirse event adları `src/lib/tracking.ts` ile eşleştirilmeli.

## Demo Modu

Demo store verileri `.demo-data/touragency-store.json` içinde tutulur. Database bağlanana kadar panel, formlar ve raporlar bu dosya üzerinden çalışır.
