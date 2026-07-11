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
- Tur detay sayfasında galeri, satış rozetleri, hareket noktaları, tarih kartları ve Jolly/WhatsApp aksiyonları mobil/desktop kontrol edilmeli.
- Admin tur editöründe galeri URL'leri, satış vurguları, hareket noktaları ve iptal/güvence metinleri gerçek içerikle doldurulmalı.
- CRM tarafında yüksek skor lead, takip tarihi geçmiş lead ve WhatsApp mesaj şablonları satış ekibiyle test edilmeli.
- Google Analytics / GTM eklenirse event adları `src/lib/tracking.ts` ile eşleştirilmeli.

## Demo Modu

Demo store verileri `.demo-data/touragency-store.json` içinde tutulur. Database bağlanana kadar panel, formlar ve raporlar bu dosya üzerinden çalışır.

## Database Geçiş Notu

Yeni tur satış alanları `gallery`, `sales_badges`, `highlights`, `pickup_points` ve `cancellation_policy` kolonlarıyla taşınır. Lead CRM alanları için `channel`, `owner`, `last_contact_at`, `next_follow_up_at`, `internal_note` ve `timeline` kolonları kullanılır.
