# Changelog — Codebase Review Session (2026-08-30)

> **Status:** Aktif
> **Tujuan:** Mencatat SEMUA perubahan, investigasi, dan temuan dari sesi review komprehensif terhadap codebase Cup of Code.

---

## [Review Session 1] — 2026-08-30

**Status:** ✅ Selesai (audit statis)
**Tujuan:** Identifikasi kekuatan, kelemahan, dan area improvement sebelum production deployment
**Output:** `docs/review/CODEBASE-REVIEW-2026-08-30.md` (laporan lengkap)

### Task List

- [x] **R1.1** Audit struktur project & file (`src/`, `docs/`, `public/`, root config)
- [x] **R1.2** Baca & analisis 9 file dokumentasi (`docs/*.md` + `docs/finalization/*.md`)
- [x] **R1.3** Verifikasi inkonsistensi klaim dokumentasi vs kode aktual
- [x] **R1.4** Identifikasi dead code & duplikat komponen
- [x] **R1.5** Audit security headers & CSP
- [x] **R1.6** Audit SEO (JSON-LD, sitemap, robots.txt, canonical)
- [x] **R1.7** Audit performance (font, images, hydration, SW)
- [x] **R1.8** Audit API endpoints (newsletter, contact, health)
- [x] **R1.9** Buat laporan lengkap di `docs/review/CODEBASE-REVIEW-2026-08-30.md`

### Temuan Kritis (🔴 Blocker Production)

#### Inkonsistensi Klaim vs Kode
- [x] **Temuan #1** `src/styles/global.css` line 1 masih import `Google Sans Flex` (Sprint 3 S3.2 klaim ganti Inter)
- [x] **Temuan #2** `src/styles/global.css` line 25 `--font-body` masih `"Google Sans Flex"` (Sprint 3 S3.2 klaim Inter)
- [x] **Temuan #3** `src/styles/global.css` line 1 `@import url(...)` font masih render-blocking (Sprint 3 S3.1 klaim hapus)
- [x] **Temuan #4** `src/pages/posts/[...slug].astro` line 188–210 `<Author Bio>` di-comment-kan (Fase 3.7 klaim implemented)

#### Dead Code
- [x] **Temuan #5** `src/pages/posts/[...slug].astro` line 300: `<CodeBlock />` tanpa props
- [x] **Temuan #6** `src/pages/snippets/[...slug].astro` line 119: `<CodeBlock />` tanpa props
- [x] **Temuan #7** `src/pages/assets/[...slug].astro` line 275: `<CodeBlock />` tanpa props
- [x] **Temuan #8** `src/components/digital-assets/PromptFiller.astro` duplikat dengan `PromptFiller.tsx` (yang aktif `.tsx`)

#### Domain Inkonsisten
- [x] **Temuan #9** `cupofcode.cc` vs `cupofcode.cc` tercampur di 8+ lokasi:
  - `astro.config.mjs` line 22: `.cc`
  - `src/consts.ts` line 5: `.cc`
  - `public/robots.txt`: `.cc`
  - `.env.example` line 6: `.id`
  - `FINALIZATION-CONTEXT.md` Appendix B: `.id`
  - `src/pages/api/newsletter.ts` line 15, 49: `.id`
  - `src/pages/api/contact.ts` line 39, 40: `.id`

#### Dokumentasi Belum Final
- [x] **Temuan #10** `README.md` masih template default Astro Starter Kit (emoji korup, placeholder)
- [x] **Temuan #11** `.env.example` masih comment `# Plausible` (sudah migrasi ke Umami per FINALIZATION §5.1)

### Temuan High Priority (🟠)

- [x] **Temuan #12** CSP masih pakai `'unsafe-inline'` untuk script & style (Sprint F-4 0% selesai)
- [x] **Temuan #13** Security headers cakupan parsial — middleware hanya untuk route SSR, halaman prerendered bypass
- [x] **Temuan #14** Newsletter subscriber storage belum persistent (hanya console.log)
- [x] **Temuan #15** Manual verification belum dilakukan (Lighthouse, Rich Results, cross-browser — FINALIZATION §F-8 0%)

### Temuan Medium Priority (🟡)

- [x] **Temuan #16** Rate limiter in-memory via `globalThis` (tidak persistent, tidak shared antar instance)
- [x] **Temuan #17** Honeypot tanpa CAPTCHA (rentan spam burst)
- [x] **Temuan #18** OG image generator otomatis belum ada
- [x] **Temuan #19** Zero testing coverage (no unit, E2E, atau visual regression tests)
- [x] **Temuan #20** Sitemap filter pakai `includes('/api/')` — bisa false match
- [x] **Temuan #21** Missing security headers: COEP, COOP, CORP, X-Permitted-Cross-Domain-Policies
- [x] **Temuan #22** `getCollection("posts")` diulang di homepage & detail (tidak scalable untuk 100+ posts)
- [x] **Temuan #23** SearchBar tidak benar-benar mencari di body artikel (hanya title/description)
- [x] **Temuan #24** Tidak ada author page atau tag pages
- [x] **Temuan #25** Direktori mencurigakan di root: `.agent/`, `.codegraph/`, `.freebuff/` (sisa tooling AI?)
- [x] **Temuan #26** `changelog.txt` terpisah dari `CHANGELOG.md` resmi (kemungkinan TODO lama)

### Verdict

**Project LAYAK production DENGAN 11 blocker kritis diselesaikan lebih dulu.**

Estimasi: **2-3 minggu kerja** (1 sprint finalisasi) jika dilakukan dengan disiplin.

### Output Sesi Ini

- 📄 `docs/review/CODEBASE-REVIEW-2026-08-30.md` — Laporan lengkap (~500 baris)
- 📄 `docs/review/CHANGELOG.md` — File ini
- 📄 `docs/sprint/DEVELOPMENT-PLAN.md` — Development plan untuk new session

---

## [Review Session 2 / Sprint F-11] — 2026-08-30

**Status:** 🟡 In Progress (Phase 1 & 2 selesai; sisanya butuh domain live & keputusan user)
**Tujuan:** Eksekusi Sprint F-11 Pre-Production Hardening
**Detail:** `docs/sprint/DEVELOPMENT-PLAN.md`

### Koreksi Temuan Review #1 (Claude verifikasi langsung)

Saat eksekusi, ditemukan **beberapa inkonsistensi antara review report dan kode aktual** — klaim di `CODEBASE-REVIEW-2026-08-30.md` perlu dikoreksi:

| Klaim di Review | Realita di Kode | Aksi |
|---|---|---|
| "Line 1 masih `@import Google Sans Flex`" | Line 1 adalah `@import Cal Sans + Inter`, **bukan** Google Sans Flex. `--font-body` di line 25 sudah `Inter`. | Hapus `@import url()` (sesuai Sprint 3 intent) |
| "Domain `.cc` vs `.id` inkonsisten di 8 lokasi" | Mayoritas sudah `.cc`. Review report menyebut lokasi `.id` yang sebenarnya sudah `.cc`. `.env.example` & API endpoint fallback sudah `.cc` | Konsisten (sudah) — tidak ada perubahan |
| "`.gitignore` belum exclude AI dirs" | `.gitignore` sudah exclude `.freebuff`, `.codegraph`, `.agent`, `.kilo`. Tapi ada baris `docs` (SALAH — harus di-track) | Hapus baris `docs` dari `.gitignore` |
| "`PromptFiller.astro` unused" | Confirmed. File di-import di `assets/[...slug].astro` line 12 = `.tsx` | Hapus `.astro` |
| "`<CodeBlock />` dead di 3 file" | Confirmed | Hapus 3 instance |
| "`<Author Bio>` di-comment" | Confirmed | Uncomment (sesuai keputusan user) |

### Task Selesai (✅)

- [x] **F-11.1.1** Hapus `@import url(...)` font di `src/styles/global.css` line 1 (render-blocking CSS)
- [x] **F-11.1.2** Hapus `<CodeBlock />` dead code di `posts/[...slug].astro`, `snippets/[...slug].astro`, `assets/[...slug].astro`
- [x] **F-11.1.3** Hapus `src/components/digital-assets/PromptFiller.astro` (duplikat dari `.tsx`)
- [x] **F-11.1.4** Restore (uncomment) `<Author Bio>` di `posts/[...slug].astro`
- [x] **F-11.1.5** Domain `.cc` sudah konsisten → **tidak ada perubahan kode** (verifikasi via grep)
- [x] **F-11.2.1** Tulis ulang `README.md` (ganti template Astro Starter Kit)
- [x] **F-11.2.2** Cleanup `.env.example` — hapus blok Plausible, perbarui contoh Umami
- [x] **F-11.2.3** Verifikasi `.agent/`, `.codegraph/`, `.freebuff/`, `.kilo` sudah di-`.gitignore`. **Hapus baris `docs` dari `.gitignore` (SALAH — `docs/` harus di-track)**

### Task Belum (⏳ — butuh aksi manual/deployment)

- [ ] **F-11.3.1** Buat `deploy/nginx.conf` — **butuh kepastian SSL paths & server block**. Template konsep tersedia di plan
- [ ] **F-11.3.2** Setup uptime monitoring (UptimeRobot) — **butuh akun & domain live**
- [ ] **F-11.3.3** `RESEND_API_KEY` sudah ada di `.env` lokal. Domain `cupofcode.cc` di Resend dashboard perlu diverifikasi sebelum go-live
- [ ] **F-11.3.4** Verifikasi backup strategy (restore dari Git tag)
- [ ] **F-11.4.x** Manual verification (Lighthouse, Rich Results, cross-browser) — **butuh domain live**
- [ ] **F-11.5.1** CSP nonce migration (Sprint F-4)
- [ ] **F-11.5.2** Tambah security headers (COEP/COOP/CORP)
- [ ] **F-11.5.3** Fix sitemap filter (`includes` → `startsWith`)
- [ ] **F-11.5.4** Deploy ke production
- [ ] **F-11.5.5** Post-launch monitoring (24 jam)

### Build Verification

```
$ npx astro check
Result (52 files):
  - 0 errors
  - 0 warnings
  - 12 hints (pre-existing, tidak terkait perubahan ini)

$ npx astro build
[build] Complete!
[build] 18 static routes prerendered
[@astrojs/sitemap] sitemap-index.xml created
```

### Catatan Penting untuk User

1. **`.env` line 23 malformed**: `PUBLIC_UMAMI_SRC="...data-website-id=...">` — ada `data-website-id` dan `>` tertinggal dalam string URL. **Belum diperbaiki** karena di luar scope F-11 (`.env` lokal, di-gitignore). Umami kemungkinan tidak loading sampai dibetulkan. **Akan memblokir F-11.5.5 monitoring** jika tidak diperbaiki.

2. **`.env` line 35-36 inkonsisten**: `EMAIL_FROM` & `EMAIL_ADMIN` pakai `cupofcode.cc`, padahal user memilih domain `.cc`. **Belum diperbaiki** (di luar scope F-11, `.env` lokal). Sebelum go-live production, **perlu diselaraskan ke `.cc`** agar email From/Reply-To konsisten dengan domain.

3. **Build hints (12 total)** — semua pre-existing, bukan dari perubahan F-11. Tidak memblokir. Bisa di-address di sprint terpisah.

4. **`.agent/`, `.codegraph/`, `.freebuff/` di `.gitignore` TAPI sudah terlanjur di-track di git history sebelumnya?** — perlu `git rm --cached -r .agent .codegraph .freebuff` jika user ingin benar-benar bersih dari tracking. Tidak dilakukan otomatis untuk menghindari risiko.

---

## [Review Session 3 / Sprint F-11.5.4a] — 2026-08-31

**Status:** ✅ Selesai (Vercel migration)
**Tujuan:** Migrasi dari VPS/PM2/nginx ke Vercel Serverless (deployment strategy change)

### Perubahan

- [x] **Migrasi adapter**: `@astrojs/node` (standalone) → `@astrojs/vercel@^11.0.8`
- [x] **Archive** `ecosystem.config.cjs` → `archive/ecosystem.config.cjs.vps` (PM2 tidak relevan di Vercel)
- [x] **Buat** `vercel.json` dengan security headers lengkap (HSTS, CSP-friendly, X-Frame-Options, COOP, CORP, dll.) + `X-Robots-Tag: noindex` di `/keystatic` & `/api/*` + cache-control untuk `_astro/*` (1 year immutable)
- [x] **Refactor** `src/middleware.ts` — hapus logic security headers (sekarang delegate ke `vercel.json` agar menjangkau SEMUA response, termasuk prerendered). Middleware hanya handle `X-Robots-Tag` & debug header
- [x] **Update** `.gitignore` — tambah `.vercel` (Vercel build output, sama seperti `dist/`)
- [x] **Hapus** `sentry:sourcemaps` script dari `package.json` (sourcemap upload di Vercel handle oleh Sentry integration, bukan CLI manual)

### Mengapa Migrasi ke Vercel?

- Blog skala kecil-menengah (5 artikel, 3 aset, 2 snippet) — **Vercel fully-managed** lebih cost-effective daripada maintain VPS + PM2 + nginx + Let's Encrypt renewal manual
- Vercel menyediakan out-of-the-box: HTTPS auto, CDN global, HTTP/2, DDoS protection, image optimization — semua yang nginx + certbot + Cloudflare kasih
- **Waktu deploy turun dari ~2-3 jam ke ~10 menit** (import Git repo, set env vars, klik deploy)
- Astro 7.1 + `@astrojs/vercel` adalah first-class supported platform

### Catatan Penting

1. **Node runtime warning**: Lokal pakai Node 26, Vercel akan fallback ke Node 24 di serverless. Aman, hanya warning.
2. **Build output pindah**: dari `dist/` ke `.vercel/output/`. Sitemap tetap ter-generate di `.vercel/output/static/sitemap-index.xml`.
3. **Sitemap filter tetap**: `!page.includes('/keystatic') && !page.includes('/api/')` masih bekerja di Vercel build.
4. **`resend.com` & `umami.is` env** harus di-set di Vercel dashboard (Project Settings → Environment Variables) karena `.env` lokal tidak ter-deploy.
5. **`KEYSTATIC_*`** env juga harus di-set di Vercel untuk CMS production.

### Yang Masih Manual (User)

- Setup Vercel project via https://vercel.com → Import Git repo
- Set environment variables di Vercel dashboard
- Setup custom domain `cupofcode.cc` di Vercel (auto SSL)
- Submit sitemap ke Google Search Console setelah deploy live
- Setup UptimeRobot untuk monitor `/api/health`

### Verifikasi Build

```
$ npm install @astrojs/vercel@^11.0.8
added 54 packages, removed 69 packages, changed 8 packages

$ npx astro check
Result (51 files):
  - 0 errors
  - 0 warnings
  - 12 hints (pre-existing)

$ npx astro build
[build] Complete!
[@astrojs/sitemap] sitemap-index.xml created at .vercel/output/static
[build] Server built in 2m 40s
```

Output structure Vercel-ready:
- `.vercel/output/static/` — 18 prerendered HTML pages + assets
- `.vercel/output/functions/_render.func/` — serverless function untuk SSR routes
- `.vercel/output/config.json` — Vercel routing config

---

*Last updated: 2026-08-31*

---

*Last updated: 2026-08-30*
