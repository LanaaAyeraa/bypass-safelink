# ADR 0001: Arsitektur Universal Shortlink Bypass & Frontend UI

## Konteks
Pengguna memerlukan aplikasi "Bypass Safelink / Shortlink" yang mampu menangani Safelinku dan beragam shortlink lain secara luas ("all in shortlink apapun 10000+"). Shortlink di internet terbagi menjadi beberapa kategori:
1. Shortlink berbasis pengalihan HTTP standar (Bitly, TinyURL, Cuttly, dan ribuan domain kustom).
2. Safelink berbasis AdLinkFly (Safelinku, Sfl.gl, Idsly, Droplink, Clicksfly, Clk.sh, dsb.) yang menyematkan token CSRF dan pengalihan perantara.
3. Safelink berbasis template CMS (Blogger / WordPress) yang mengenkripsi URL tujuan dalam parameter query (Base64, Hex, ROT13) atau skrip halaman perantara.
4. Rantai pengalihan bertingkat (*multi-hop redirect chains*).

Frontend harus mematuhi aturan global pengguna: arsitektur modern berbasis React, Tailwind CSS, dan komponen **shadcn/ui** dengan tampilan modern, clean, responsif, dark mode, dan interaktif.

## Keputusan
1. **Frontend**: Menggunakan React + Vite dengan Tailwind CSS dan pustaka komponen **shadcn/ui** (Card, Button, Input, Badge, Progress, Tabs, Alert, Dialog, dsb.) serta Lucide Icons. Menyediakan fitur Single Bypass, Batch Bypass (multi-link), Riwayat Lokal (LocalStorage), serta generator Bookmarklet.
2. **Backend Resolver Engine**: Menggunakan Node.js/Express dengan pipeline resolver berlapis (*multi-stage pipeline*):
   - **Stage 1 (URL Heuristics & Parameter Unpacker)**: Mendeteksi dan mendecode URL tujuan langsung dari query string (`?r=`, `?url=`, `?link=`, `?dest=`, `?go=`, dll.) dengan deteksi encoding (Base64, Hex, URL-encoding, ROT13, reverse string).
   - **Stage 2 (HTTP & Meta-Refresh Recursive Tracer)**: Melacak status pengalihan HTTP (301, 302, 303, 307, 308) dan tag `<meta http-equiv="refresh">` secara rekursif hingga batas aman (*max hops = 15*) dengan header peramban realistis dan manajemen cookie.
   - **Stage 3 (AdLinkFly / Safelinku Specialized Parser)**: Mengambil payload halaman HTML, mengekstrak token validasi / form session / intermediate route, dan mengeksekusi request kelanjutan untuk mendapatkan Destination URL.
   - **Stage 4 (In-Page Script & DOM Pattern Extractor)**: Menganalisis skrip halaman untuk mengekstrak URL tujuan yang disamarkan dalam fungsi JavaScript (`atob`, `window.location`, dsb.).
3. **Pengujian (TDD)**: Pengujian unit dan integrasi untuk setiap stage resolver menggunakan Vitest/Jest untuk memverifikasi fungsionalitas Red-Green-Refactor sebelum penyelesaian.

## Konsekuensi
- **Positif**: Ringan, waktu resolusi cepat (< 1-2 detik per link), tidak memerlukan Puppeteer/headless browser yang berat, mencakup ribuan pemendek URL standar dan safelink khusus, serta antarmuka UI sesuai standar shadcn/ui.
- **Batasan**: Shortlink yang menggunakan proteksi Cloudflare Turnstile / Captcha interaktif tingkat tinggi (yang membutuhkan interaksi manual mouse/captcha) akan memberikan indikasi dan bantuan alternatif (bookmarklet/script).
