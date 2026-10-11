# 04: Express API Server & Batch Bypass Endpoint

**What to build:**
Server API Express yang mengintegrasikan seluruh pipeline resolver (Heuristic Unpacker -> Safelinku/AdLinkFly Resolver -> HTTP Redirect Tracer). Menyediakan endpoint `POST /api/bypass` untuk resolusi satu link dan `POST /api/bypass/batch` untuk multi-link secara simultan/antrean dengan batasan konkuren aman. Mengembalikan objek hasil terstruktur: URL asli, URL tujuan, total hops, daftar hops, metode bypass yang digunakan, dan durasi eksekusi.

**Blocked by:** 03: Safelinku & AdLinkFly Specialized Extractor

**Status:** ready-for-agent

- [ ] Setup Express server dengan middleware CORS dan JSON parser
- [ ] Endpoint `POST /api/bypass` dengan validasi schema URL
- [ ] Endpoint `POST /api/bypass/batch` dengan penanganan concurrency (p-limit/Promise.allSettled)
- [ ] Penanganan error yang informatif (URL invalid, connection timeout, unresolvable)
- [ ] Unit & API integration tests
