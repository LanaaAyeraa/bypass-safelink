# 01: Bypass Engine Core (Heuristics & Parameter Unpacker)

**What to build:**
Modul engine core yang menguraikan URL dan mendeteksi parameter query yang membungkus URL tujuan (seperti `?url=`, `?r=`, `?link=`, `?dest=`, `?go=`, `?target=`, `?next=`, `?d=`, `?to=`). Mendukung decoding otomatis untuk format Base64, Hex, URL-encoding ganda, ROT13, dan reverse string. Dilengkapi unit test komprehensif (TDD).

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Implementasi fungsi `unpackUrlParameters(url: string): string | null`
- [x] Deteksi dan dekripsi format Base64, Hex, Double URL-encoded, ROT13
- [x] Pembersihan URL hasil (validasi protokol http/https dan struktur URL)
- [x] Unit test Vitest dengan berbagai variasi format parameter

## Answer
Modul parameter unpacker diimplementasikan di `server/src/engine/paramUnpacker.ts`. Mendukung decoding multi-level untuk parameter query umum (`url`, `link`, `target`, `dest`, `r`, dll.) mencakup format Plain URL-encoded, Base64, Hex, Double-encoded, ROT13, dan Reverse. Diverifikasi dengan 7 unit test di `server/src/engine/__tests__/paramUnpacker.test.ts` (100% lulus).

