# 01: Bypass Engine Core (Heuristics & Parameter Unpacker)

**What to build:**
Modul engine core yang menguraikan URL dan mendeteksi parameter query yang membungkus URL tujuan (seperti `?url=`, `?r=`, `?link=`, `?dest=`, `?go=`, `?target=`, `?next=`, `?d=`, `?to=`). Mendukung decoding otomatis untuk format Base64, Hex, URL-encoding ganda, ROT13, dan reverse string. Dilengkapi unit test komprehensif (TDD).

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Implementasi fungsi `unpackUrlParameters(url: string): string | null`
- [ ] Deteksi dan dekripsi format Base64, Hex, Double URL-encoded, ROT13
- [ ] Pembersihan URL hasil (validasi protokol http/https dan struktur URL)
- [ ] Unit test Vitest dengan berbagai variasi format parameter
