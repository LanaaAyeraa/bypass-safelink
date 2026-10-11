# Spec: Universal Safelink & Shortlink Bypasser

Status: ready-for-agent

## Problem Statement

Pengguna internet sering kali terhalang oleh berbagai tautan pendek (shortlink) dan safelink (seperti Safelinku, sfl.gl, idsly, AdLinkFly clones, Blogger/WordPress safelinks, dan puluhan ribu domain pemendek URL lainnya) yang menyajikan jeda waktu (countdown timer) berbelit-belit, iklan pop-up berbahaya, serta pengalihan bertingkat sebelum dapat mengakses tautan tujuan asli (Destination URL). Pengguna membutuhkan aplikasi yang cepat, bersih, aman, dan mudah digunakan untuk melewati rintangan tersebut secara otomatis dan langsung mendapatkan tautan asli.

## Solution

Membangun aplikasi web fullstack modern (**Universal Safelink & Shortlink Bypasser**) dengan antarmuka berbasis React, Tailwind CSS, dan komponen **shadcn/ui** (didukung tema modern, dark/light mode, mobile-friendly), serta backend API berbasis Node.js/Express dengan **Multi-Stage Bypass Engine** yang mampu mengekstrak Destination URL dari puluhan ribu domain pemendek link, safelink AdLinkFly/Safelinku, template blog safelink, dan rantai pengalihan HTTP. Aplikasi juga menyediakan fitur Batch Bypass, riwayat lokal, pemantauan status hop pengalihan, dan generator Bookmarklet.

## User Stories

1. As a user, I want to paste a single Safelinku or shortlink URL into an input field, so that I can bypass the interstitial ads and get the destination URL immediately.
2. As a user, I want to paste multiple shortlinks at once in a batch mode, so that I can bypass tens of links simultaneously without doing them one-by-one.
3. As a user, I want to see the destination URL clearly presented with a single-click "Copy" and "Open" button, so that I can quickly navigate or share it.
4. As a user, I want to view the redirect chain (the intermediate hops and status codes), so that I understand how the original shortlink resolved to the final target.
5. As a user, I want my bypassed links saved automatically in local history (localStorage), so that I can review and re-copy previously bypassed links anytime without re-running them.
6. As a user, I want to clear or filter my bypass history, so that I can keep my workspace tidy.
7. As a user, I want a safety indicator and URL inspection before opening unknown destination links, so that I can avoid malicious destinations.
8. As a user, I want to install/drag a Bookmarklet to my browser's bookmark bar, so that I can trigger an automatic bypass directly when landing on an ad-heavy safelink page.
9. As a user, I want clear and informative error messages when a link is invalid, expired, or blocked, so that I understand why the bypass failed.
10. As a user, I want a modern dark/light mode interface built with polished shadcn/ui components, so that the application is comfortable to use in any lighting condition and screen size.

## Implementation Decisions

- **Frontend Tech Stack**: React (Vite), TypeScript, Tailwind CSS, Lucide React icons, and shadcn/ui component library (Card, Button, Input, Textarea, Badge, Tabs, Progress, Alert, Dialog, Tooltip, Switch/Theme Toggle).
- **Backend API Stack**: Node.js, Express, TypeScript, Axios/Fetch, Cheerio (DOM parser).
- **Multi-Stage Resolver Engine**:
  - *Stage 1 - Parameter & Token Heuristics*: Ekstraksi parameter URL (`?url=`, `?r=`, `?link=`, `?dest=`, `?go=`, dll.) dengan multi-decoding (Base64, Hex, URL-encoded, ROT13, Reverse).
  - *Stage 2 - Recursive HTTP Redirect Tracer*: Menelusuri status 301, 302, 303, 307, 308 dan `<meta http-equiv="refresh">` / JavaScript location redirects hingga 15 hops dengan header peramban realistis (User-Agent desktop modern). Menangani 10.000+ domain generic shorteners.
  - *Stage 3 - AdLinkFly / Safelinku Specialized Extractor*: Parsing form input (`_wp_http_referer`, CSRF token, intermediate link `/links/go`), mengekstrak script payload Safelinku dan jaringannya.
  - *Stage 4 - DOM Script Unpacker*: Regex & script evaluation untuk mendeteksi `atob(...)` atau konstruksi link dinamis pada template WordPress/Blogger safelink.
- **Bookmarklet Generator**: Komponen UI yang membuat JavaScript URL (`javascript:(function(){...})()`) untuk mendeteksi URL aktif dan membukanya di resolver backend.
- **Local Storage Manager**: Menyimpan riwayat hasil bypass (URL asal, URL tujuan, domain, timestamp, status) dengan kapasitas maksimal 100 item dan fitur ekspor/hapus.

## Testing Decisions

- **Testing Principles**: Fokus pada pengujian perilaku eksternal (*black-box external behavior*):
  - Unit test untuk Heuristic Parameter Unpacker (Base64, Hex, nested URL decoding, ROT13).
  - Unit test untuk AdLinkFly / Safelinku HTML parser (ekstraksi token dan penentuan target endpoint).
  - Integrasi test untuk Redirect Tracer (handling status redirects, cyclic loop prevention, hop limit).
  - API endpoint testing (`POST /api/bypass` dan `POST /api/bypass/batch`).
- **Test Framework**: Vitest untuk pengujian backend dan engine.

## Out of Scope

- Memecahkan Google reCAPTCHA v2/v3 atau Cloudflare Turnstile interaktif yang membutuhkan solving captcha berbasis token AI CAPTCHA solver berbayar pihak ketiga (akan ditangani dengan graceful fallback dan petunjuk penggunaan bookmarklet).
- Hosting server berbayar eksternal (aplikasi siap dijalankan secara lokal/self-hosted atau di-deploy ke Vercel/Render).

## Further Notes

Semua antarmuka dibuat responsive untuk desktop dan mobile dengan desain bersih, profesional, dan micro-interaction yang nyaman.
