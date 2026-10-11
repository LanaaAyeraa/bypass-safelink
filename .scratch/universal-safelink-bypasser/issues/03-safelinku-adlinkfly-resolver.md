# 03: Safelinku & AdLinkFly Specialized Extractor

**What to build:**
Modul extractor khusus untuk Safelinku (`safelinku.com`, `sfl.gl`, `idsly.bid`, dll.), skrip AdLinkFly, serta template WordPress/Blogger Safelink. Modul ini menganalisis dokumen HTML, mengekstrak hidden input token (`_wp_http_referer`, CSRF token, alias), mengekstrak encoded strings dalam script JavaScript (seperti `atob(...)` atau konstruksi link dinamis), dan mengeksekusi request lanjutan untuk memperoleh Destination URL sesungguhnya.

**Blocked by:** 02: Recursive HTTP Redirect & Meta-Refresh Tracer

**Status:** resolved

- [x] Detektor domain Safelinku / AdLinkFly & Blogger safelink
- [x] Parser form token dan payload input tersembunyi menggunakan Cheerio
- [x] Parser inline script regex untuk token base64/dekripsi client-side
- [x] Simulasi POST / GET kelanjutan untuk mendapatkan final destination
- [x] Unit tests dengan mock HTML response dari Safelinku & AdLinkFly

## Answer
Modul Safelinku & AdLinkFly Extractor diimplementasikan di `server/src/engine/safelinkResolver.ts`. Dilengkapi pengenalan domain Safelinku / AdLinkFly, ekstraksi atribut HTML `data-url`/`data-link`, pemindaian regex skrip `atob(...)` dan variabel tujuan, serta deteksi form redirect. Diverifikasi melalui 5 unit test di `server/src/engine/__tests__/safelinkResolver.test.ts` (100% lulus).

