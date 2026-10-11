# 06: End-to-End Verification & Documentation

**What to build:**
Pengujian integrasi menyeluruh end-to-end antara UI frontend dan server backend. Pengujian berbagai variasi shortlink riil dan tiruan. Penambahan dokumentasi lengkap di README.md mencakup cara menjalankan lokal (`npm run dev`), cara menggunakan Bookmarklet, daftar kategori shortlink yang didukung, serta tinjauan kode mandiri (*code-review*).

**Blocked by:** 05: Frontend UI dengan React, Tailwind CSS & shadcn/ui

**Status:** ready-for-agent

- [ ] Skrip terpadu di `package.json` untuk menjalankan backend dan frontend secara bersamaan (`npm run dev`)
- [ ] Pengujian E2E alur Single Bypass dan Batch Bypass
- [ ] Dokumentasi komprehensif README.md
- [ ] Self-review kode & verifikasi bebas lint/tipe error
