# 02: Recursive HTTP Redirect & Meta-Refresh Tracer

**What to build:**
Modul penelusur pengalihan HTTP rekursif yang mampu melacak status kode redirect (301, 302, 303, 307, 308), header `Location`, serta deteksi tag HTML `<meta http-equiv="refresh">` dan JavaScript redirection sederhana. Mampu menangani lebih dari 10.000+ domain shortlink umum (seperti Bitly, TinyURL, Cuttly, dll.) dengan proteksi cyclic redirect loop dan batas maksimal hops.

**Blocked by:** 01: Bypass Engine Core (Heuristics & Parameter Unpacker)

**Status:** resolved

- [x] Implementasi recursive fetcher dengan custom User-Agent realistis
- [x] Pelacakan setiap langkah hop (URL perantara, HTTP status code, durasi)
- [x] Deteksi HTML `<meta http-equiv="refresh">` dan parsing URL redirect
- [x] Proteksi infinite loop dan batas kedalaman hops (maksimal 15 hops)
- [x] Unit & mock tests untuk skenario 301, 302, dan meta refresh

## Answer
Modul HTTP redirect tracer diimplementasikan di `server/src/engine/redirectTracer.ts`. Mampu menelusuri pengalihan status code 301/302/303/307/308, tag HTML `<meta http-equiv="refresh">`, dan pengalihan JavaScript inline (`window.location`) dengan batas aman 15 hops serta proteksi pencegahan infinite loop. Diuji dengan local HTTP server dan lolos 100% tes pada `server/src/engine/__tests__/redirectTracer.test.ts`.

