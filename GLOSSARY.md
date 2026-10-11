# Glossary

Istilah domain yang digunakan dalam proyek Bypass Safelink.

### Safelink / Shortlink
Layanan perantara atau pemendek URL yang menyisipkan jeda waktu (countdown timer), iklan, dan halaman berlapis sebelum mengarahkan pengguna ke tautan asli. Contoh: Safelinku (`sfl.gl`), Safelink Blogger/WordPress template, dsb.

### Destination URL (URL Tujuan)
Alamat web akhir sesungguhnya yang ingin diakses pengguna setelah melewati rantai pengalihan (*redirect chain*).

### Bypass Engine (Resolver)
Modul perangkat lunak yang bertugas menganalisis struktur URL atau dokumen HTML dari safelink, mengekstrak token/skrip pengarah, dan melompati rintangan iklan/timer untuk mendapatkan Destination URL secara langsung.

### Bypass Token
Data terenkripsi, ter-hash, atau ter-encode (seperti Base64, hex, atau hidden input form) yang terdapat di dalam skrip/halaman safelink untuk memvalidasi dan memicu pengalihan ke URL tujuan.

### Redirect Chain
Urutan pengalihan HTTP (status code 301, 302, 307, atau meta refresh/JavaScript redirect) dari safelink awal hingga mendarat di Destination URL akhir.
