# ADR 0002: Distribusi Multi-Platform (GitHub, Vercel, Windows Installer, Android)

## Konteks
Pengguna meminta distribusi dan pemasangan aplikasi pada berbagai platform:
1. Repositori publik/privat di GitHub (`LanaaAyeraa`).
2. Deployment web production ke Vercel (`sultanmaulana51209-6148`).
3. File installer aplikasi desktop Windows (`.exe` / Setup).
4. Pemasangan ke laptop dan shortcut Desktop/Taskbar.
5. Aplikasi Android (berhubung Java/Android SDK tidak tersedia secara lokal, build otomatis APK dijalankan melalui CI/CD GitHub Actions dan PWA Android).

## Keputusan
1. **GitHub Repository**:
   - Buat remote repositori di GitHub menggunakan `gh repo create LanaaAyeraa/bypass-safelink --public --source=. --push`.
2. **Vercel Deployment**:
   - Konfigurasi `vercel.json` untuk menyatukan client static build (`client/dist`) dan API serverless function (`api/index.ts`).
   - Jalankan `vercel --prod` untuk merilis live website.
3. **Windows Desktop App & Installer**:
   - Buat modul desktop wrapper berbasis Electron + `electron-builder` di `desktop/` yang mengemas UI dan engine lokal.
   - Hasilkan berkas installer `Setup.exe` yang dapat dipasang langsung di Windows.
   - Buat shortcut aplikasi di Desktop dan pandu pinning ke Taskbar Windows.
4. **Android App & CI/CD**:
   - Konfigurasi proyek Capacitor Android dengan Web App Manifest (PWA) agar dapat langsung diinstal di ponsel Android (*Add to Home Screen*).
   - Buat workflow GitHub Actions `.github/workflows/build-android.yml` untuk meng-compile file APK secara otomatis di cloud runner GitHub.

## Konsekuensi
- Seluruh kebutuhan multi-platform terpenuhi secara terintegrasi.
- Pengguna mendapatkan web online di Vercel, kode di GitHub, installer `.exe` untuk PC/laptop, dan APK Android via GitHub Actions.
