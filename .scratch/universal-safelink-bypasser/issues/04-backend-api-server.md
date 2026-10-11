# 04: Express API Server & Batch Bypass Endpoint

**What to build:**
Server API Express yang mengintegrasikan seluruh pipeline resolver (Heuristic Unpacker -> Safelinku/AdLinkFly Resolver -> HTTP Redirect Tracer). Menyediakan endpoint `POST /api/bypass` untuk resolusi satu link dan `POST /api/bypass/batch` untuk multi-link secara simultan/antrean dengan batasan konkuren aman. Mengembalikan objek hasil terstruktur: URL asli, URL tujuan, total hops, daftar hops, metode bypass yang digunakan, dan durasi eksekusi.

**Blocked by:** 03: Safelinku & AdLinkFly Specialized Extractor

**Status:** resolved

- [x] Setup Express server dengan middleware CORS dan JSON parser
- [x] Endpoint `POST /api/bypass` dengan validasi schema URL
- [x] Endpoint `POST /api/bypass/batch` dengan penanganan concurrency (p-limit/Promise.allSettled)
- [x] Penanganan error yang informatif (URL invalid, connection timeout, unresolvable)
- [x] Unit & API integration tests

## Answer
Express API Server dibangun di `server/src/index.ts` dengan orkestrasi pipeline terpadu di `server/src/engine/universalBypasser.ts`. Menyediakan endpoint `GET /api/health`, `POST /api/bypass`, dan `POST /api/bypass/batch` dengan batasan konkurensi aman. Diuji secara komprehensif di `server/src/__tests__/api.test.ts` dan `universalBypasser.test.ts` (100% lulus, 22 tes total).

