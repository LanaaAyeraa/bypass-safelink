# 02: Recursive HTTP Redirect & Meta-Refresh Tracer

**What to build:**
Modul penelusur pengalihan HTTP rekursif yang mampu melacak status kode redirect (301, 302, 303, 307, 308), header `Location`, serta deteksi tag HTML `<meta http-equiv="refresh">` dan JavaScript redirection sederhana. Mampu menangani lebih dari 10.000+ domain shortlink umum (seperti Bitly, TinyURL, Cuttly, dll.) dengan proteksi cyclic redirect loop dan batas maksimal hops.

**Blocked by:** 01: Bypass Engine Core (Heuristics & Parameter Unpacker)

**Status:** ready-for-agent

- [ ] Implementasi recursive fetcher dengan custom User-Agent realistis
- [ ] Pelacakan setiap langkah hop (URL perantara, HTTP status code, durasi)
- [ ] Deteksi HTML `<meta http-equiv="refresh">` dan parsing URL redirect
- [ ] Proteksi infinite loop dan batas kedalaman hops (maksimal 15 hops)
- [ ] Unit & mock tests untuk skenario 301, 302, dan meta refresh
