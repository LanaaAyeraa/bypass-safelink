# 05: Frontend UI dengan React, Tailwind CSS & shadcn/ui

**What to build:**
Antarmuka web modern kelas satu menggunakan React (Vite), Tailwind CSS, Lucide Icons, dan standar pustaka komponen **shadcn/ui**. UI mencakup:
1. Header modern dengan dark/light mode toggle dan indikator status engine.
2. Mode Tabs: Single Bypass (input tunggal dengan auto-paste dan instant bypass) & Batch Bypass (textarea multi-line dengan progress bar).
3. Result Card: Menampilkan Destination URL dengan tombol Copy dan Open Link, badge metode bypass, serta akordeon rincian rantai pengalihan (Hop Chain visual).
4. Panel Riwayat (Recent Bypasses): Tersimpan di LocalStorage dengan pencarian, filter, dan tombol hapus/ekspor.
5. Tab Panduan & Bookmarklet: Tombol Bookmarklet yang dapat diseret/disalin ke bookmark bar browser.

**Blocked by:** 04: Express API Server & Batch Bypass Endpoint

**Status:** ready-for-agent

- [ ] Inisialisasi Vite + React + Tailwind CSS + shadcn/ui komponen
- [ ] Komponen Single Bypass dengan input URL, tombol Bypass, loading spinner
- [ ] Komponen Batch Bypass dengan multi-link queue dan progress indicator
- [ ] Komponen visualisasi Hasil (Result Card, Hop Chain timeline, Copy/Open)
- [ ] Komponen History manager dengan LocalStorage persistence
- [ ] Komponen Bookmarklet generator dan panduan penggunaan
- [ ] Dark/Light mode theme switch
