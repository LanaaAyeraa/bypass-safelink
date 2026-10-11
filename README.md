# ⚡ Universal Safelink & Shortlink Bypasser (10,000+ Links)

Aplikasi web modern (*Fullstack*) untuk melewati berbagai macam tautan safelink, countdown timer iklan, dan pemendek link (shortlink) secara instan untuk langsung mendapatkan **Destination URL** (tautan tujuan asli).

Dibangun dengan antarmuka **shadcn/ui (React, Tailwind CSS, Lucide Icons)** yang responsif, mendukung tema gelap/terang, dan mesin resolver backend berbasis **Node.js/Express**.

---

## ✨ Fitur Utama

- **Cakupan Sangat Luas (10,000+ Shortlink Domains)**:
  - **Safelinku Network**: `safelinku.com`, `sfl.gl`, `idsly.bid`, `idsly.com`, dll.
  - **AdLinkFly Script Clones**: `droplink.co`, `clicksfly.com`, `shrinkearn.com`, `exe.io`, `clk.sh`, `shortzon.com`, `adbull.me`, dll.
  - **Template Blogger & WordPress Safelink**: Mendekripsi otomatis parameter token query (`Base64`, `Hex`, `ROT13`, nested URL-encoding) dan skrip `atob(...)` in-page.
  - **Generic Shortlink Redirectors**: Menelusuri seluruh rantai pengalihan HTTP (301, 302, 303, 307, 308), `<meta http-equiv="refresh">`, dan JavaScript redirection secara rekursif hingga 15 hops dengan proteksi anti-loop.
- **Single Bypass**: Input satu link dengan auto-paste dari clipboard dan shortcut link contoh.
- **Batch Bypass**: Melewati hingga 50 tautan sekaligus dalam satu kali klik dengan progress indicator, opsi salin semua, dan ekspor ke file `.txt`.
- **Rantai Pengalihan Visual (Hop Timeline)**: Melihat setiap tahapan lompatan URL, status HTTP code, dan latensi pemrosesan.
- **Riwayat Lokal (Local History)**: Hasil bypass otomatis tersimpan di peramban (`localStorage`) lengkap dengan filter pencarian dan penghapusan data.
- **Bookmarklet Browser**: Pasang tombol bookmarklet di Chrome, Edge, Firefox, atau browser HP untuk melakukan bypass instan langsung dari tab safelink aktif tanpa bolak-balik copy-paste!
- **UI Modern & Clean**: Komponen shadcn/ui dengan mode Dark/Light otomatis.

---

## 🛠️ Arsitektur & Teknologi

| Bagian | Teknologi |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, Cheerio, Axios |
| **Testing** | Vitest (TDD Red-Green-Refactor, 22 unit & integration tests) |
| **Architecture** | ADR-0001 Multi-Stage Resolver Pipeline |

---

## 🚀 Cara Menjalankan

### 1. Prasyarat
- Node.js versi 18+ (disarankan Node.js 20 atau 24)
- npm versi 9+

### 2. Instalasi Dependensi
Jalankan perintah berikut di direktori utama:
```bash
# Instal dependensi root, backend, dan frontend
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Menjalankan Aplikasi (Development)
Jalankan backend dan frontend secara bersamaan dengan satu perintah:
```bash
npm run dev
```

- **Frontend Web UI**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

### 4. Menjalankan Pengujian (Testing)
```bash
npm test
```
Seluruh 22 tes unit dan integrasi akan dieksekusi menggunakan Vitest.

### 5. Build Produksi
```bash
npm run build
```

---

## 🔖 Cara Menggunakan Bookmarklet

1. Buka dashboard aplikasi di `http://localhost:5173`.
2. Klik tab **Bookmarklet**.
3. Tarik (*drag & drop*) tombol **⚡ Bypass Safelink** ke Bookmarks Bar browser Anda (`Ctrl+Shift+B` untuk menampilkan bilah bookmark).
4. Saat Anda membuka halaman safelink atau shortlink yang penuh iklan, cukup klik tombol bookmarklet tersebut untuk melewati rintangan secara otomatis!

---

## 📡 Dokumentasi REST API

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "engine": "Universal Safelink & Shortlink Bypasser",
  "version": "1.0.0",
  "timestamp": "2026-10-11T15:30:00.000Z"
}
```

### 2. Bypass Single URL
```http
POST /api/bypass
Content-Type: application/json

{
  "url": "https://safelinkreviewer.blogspot.com/?url=aHR0cHM6Ly9naXRodWIuY29t"
}
```
**Response:**
```json
{
  "success": true,
  "originalUrl": "https://safelinkreviewer.blogspot.com/?url=aHR0cHM6Ly9naXRodWIuY29t",
  "destinationUrl": "https://github.com",
  "domain": "safelinkreviewer.blogspot.com",
  "method": "param-unpacker",
  "hops": [
    {
      "url": "https://safelinkreviewer.blogspot.com/?url=aHR0cHM6Ly9naXRodWIuY29t",
      "status": 200,
      "redirectUrl": "https://github.com",
      "type": "http-redirect"
    }
  ],
  "totalHops": 1,
  "durationMs": 1
}
```

### 3. Bypass Batch URLs
```http
POST /api/bypass/batch
Content-Type: application/json

{
  "urls": [
    "https://sfl.gl/example1",
    "https://tinyurl.com/example2"
  ]
}
```

---

## 🛡️ Catatan & Etika Penggunaan
Aplikasi ini ditujukan untuk mempermudah navigasi web yang bersih dan aman dari jebakan malware atau phishing yang kerap disisipkan pada situs-situs pemendek tautan agresif. Selalu periksa kembali keaslian domain Destination URL sebelum mengunduh berkas.
