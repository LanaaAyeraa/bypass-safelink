# 05: Frontend UI dengan React, Tailwind CSS & shadcn/ui

**What to build:**
Antarmuka web modern kelas satu menggunakan React (Vite), Tailwind CSS, Lucide Icons, dan standar pustaka komponen **shadcn/ui**. UI mencakup:
1. Header modern dengan dark/light mode toggle dan indikator status engine.
2. Mode Tabs: Single Bypass (input tunggal dengan auto-paste dan instant bypass) & Batch Bypass (textarea multi-line dengan progress bar).
3. Result Card: Menampilkan Destination URL dengan tombol Copy dan Open Link, badge metode bypass, serta akordeon rincian rantai pengalihan (Hop Chain visual).
4. Panel Riwayat (Recent Bypasses): Tersimpan di LocalStorage dengan pencarian, filter, dan tombol hapus/ekspor.
5. Tab Panduan & Bookmarklet: Tombol Bookmarklet yang dapat diseret/disalin ke bookmark bar browser.

**Blocked by:** 04: Express API Server & Batch Bypass Endpoint

**Status:** resolved

- [x] Inisialisasi Vite + React + Tailwind CSS + shadcn/ui komponen
- [x] Komponen Single Bypass dengan input URL, tombol Bypass, loading spinner
- [x] Komponen Batch Bypass dengan multi-link queue dan progress indicator
- [x] Komponen visualisasi Hasil (Result Card, Hop Chain timeline, Copy/Open)
- [x] Komponen History manager dengan LocalStorage persistence
- [x] Komponen Bookmarklet generator dan panduan penggunaan
- [x] Dark/Light mode theme switch

## Answer
Antarmuka frontend web dibangun dengan standar komponen shadcn/ui di direktori `client/`. Menggunakan React + TypeScript + Tailwind CSS + Lucide Icons dengan fitur:
- Single Bypass dengan auto-paste dan shortcut contoh link (Safelinku, Blogger, Bitly).
- Batch Bypass multi-link dengan progress bar dan tombol ekspor .txt.
- ResultCard dengan tombol Salin (Copy), Buka Tautan (Open), dan HopTimeline interaktif.
- Riwayat Bypass lokal (LocalStorage) dengan fitur pencarian dan pembersihan.
- Generator Bookmarklet drag & drop serta salin kode JavaScript.
- Pengalih tema gelap/terang (Dark/Light mode) otomatis tersimpan.
Diverifikasi bebas error kompilasi TypeScript dan lolos build produksi Vite (2.35 detik).

