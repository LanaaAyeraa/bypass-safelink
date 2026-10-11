# 03: Safelinku & AdLinkFly Specialized Extractor

**What to build:**
Modul extractor khusus untuk Safelinku (`safelinku.com`, `sfl.gl`, `idsly.bid`, dll.), skrip AdLinkFly, serta template WordPress/Blogger Safelink. Modul ini menganalisis dokumen HTML, mengekstrak hidden input token (`_wp_http_referer`, CSRF token, alias), mengekstrak encoded strings dalam script JavaScript (seperti `atob(...)` atau konstruksi link dinamis), dan mengeksekusi request lanjutan untuk memperoleh Destination URL sesungguhnya.

**Blocked by:** 02: Recursive HTTP Redirect & Meta-Refresh Tracer

**Status:** ready-for-agent

- [ ] Detektor domain Safelinku / AdLinkFly & Blogger safelink
- [ ] Parser form token dan payload input tersembunyi menggunakan Cheerio
- [ ] Parser inline script regex untuk token base64/dekripsi client-side
- [ ] Simulasi POST / GET kelanjutan untuk mendapatkan final destination
- [ ] Unit tests dengan mock HTML response dari Safelinku & AdLinkFly
