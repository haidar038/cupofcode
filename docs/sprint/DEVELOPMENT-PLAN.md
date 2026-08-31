# Development Plan — Sprint F-11: Pre-Production Hardening

> **Status:** 📋 Planned (belum dimulai)
> **Target:** Production-ready deployment
> **Estimasi:** 2-3 minggu kerja
> **Dependency:** `docs/review/CODEBASE-REVIEW-2026-08-30.md` (WAJIB BACA DULU)
> **Konteks:** Sesi review 2026-08-30 mengidentifikasi 11 blocker kritis + 15 area improvement

---

## 🎯 Tujuan Sprint

Mengubah project dari **"mendekati production-ready"** menjadi **"siap production deployment"** dengan:
1. Menyelesaikan 11 blocker kritis
2. Memvalidasi manual (Lighthouse, Rich Results, cross-browser)
3. Menyiapkan infrastruktur deployment (nginx, monitoring)
4. Mendokumentasikan prosedur operasional

---

## 📋 Cara Menggunakan Dokumen Ini

Dokumen ini dirancang untuk **AI agent atau developer** yang melanjutkan pengerjaan di sesi baru.

### Workflow per Sesi Chat

```
1. Baca section "Konteks Project" di bawah (WAJIB)
2. Baca `docs/review/CODEBASE-REVIEW-2026-08-30.md` untuk konteks lengkap
3. Identifikasi task aktif (lihat "Status Task" di bawah)
4. Kerjakan task SATU PER SATU sesuai urutan (ada dependensi)
5. Centang acceptance criteria setelah selesai
6. Jalankan verification commands di akhir
7. Update changelog & status task
8. JANGAN lanjut ke task berikutnya sebelum DoD terpenuhi
```

### Guardrails (JANGAN DILANGGAR)

| # | Aturan | Alasan |
|---|--------|--------|
| G1 | **Tetap di scope task aktif.** Jangan sentuh task lain. | Mencegah scope creep |
| G2 | **Jangan refactor kode yang tidak terkait task.** | Menjaga diff fokus & reviewable |
| G3 | **Pertahankan konvensi**: Tailwind CSS 4, `kebab-case`, `.astro` untuk statis, `.tsx` untuk interaktif. | Konsistensi codebase |
| G4 | **Setelah setiap task**: jalankan `npx astro check` dan `npm run build`. Build HARUS pass. | Mencegah broken build |
| G5 | **Jangan hapus konten** (posts/snippets/assets). Tambah/edit saja. | Konten = deliverable |
| G6 | **Satu task = satu commit logical.** Commit message format: `fix(f11): {ringkasan}` atau `feat(f11): {ringkasan}` | Historis git bersih |
| G7 | **Tidak boleh menambah dependency baru** tanpa konfirmasi user. | Menjaga bundle kecil |
| G8 | **Semua teks UI tetap Bahasa Indonesia** (`lang="id"`). | Konsistensi bahasa |
| G9 | **Jangan klaim task selesai** sebelum acceptance criteria terverifikasi. | Kejujuran status |

---

## 📚 Konteks Project (WAJIB BACA)

### Stack & Versi

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Astro | 7.1.3 |
| UI Library | React | 19.2.7 |
| Styling | Tailwind CSS | 4.3.0 |
| CMS | Keystatic | 5.1.0 |
| Content | Markdoc | 1.0.6 |
| Adapter | @astrojs/node | 11.0.2 (standalone) |
| Monitoring | @sentry/astro | 10.69.0 |
| Email | Resend | (REST API, no SDK) |
| Analytics | Umami | (self-hosted, optional) |
| TypeScript | typescript | 6.0.3 |
| Node | node | ≥22.12.0 |

### Environment Variables (Penting)

Lihat `.env.example` untuk lengkap. Yang kritis untuk production:
- `PUBLIC_SITE_URL` — domain produksi (saat ini inkonsisten `.cc` vs `.id`)
- `RESEND_API_KEY` — email API (WAJIB set, jika tidak newsletter/kontak masih mock)
- `EMAIL_FROM`, `EMAIL_ADMIN` — sender email
- `PUBLIC_SENTRY_DSN` — error monitoring
- `PUBLIC_UMAMI_SRC`, `PUBLIC_UMAMI_WEBSITE_ID` — analytics (optional)
- `KEYSTATIC_*` — CMS production storage

### Path Penting

| File | Peran |
|------|-------|
| `astro.config.mjs` | Config inti, integrasi, site URL, middleware |
| `src/middleware.ts` | Security headers + CSP + noindex |
| `src/styles/global.css` | Font declarations, design tokens, prose-coc |
| `src/components/BaseHead.astro` | SEO meta tags, font preconnect, analytics |
| `src/layouts/BaseLayout.astro` | Layout utama + JSON-LD global |
| `src/content.config.ts` | Schema content collection (Zod) |
| `keystatic.config.ts` | Schema Keystatic CMS |
| `src/pages/posts/[...slug].astro` | Detail post (line 188–210 Author Bio di-comment) |
| `src/pages/assets/[...slug].astro` | Detail asset (line 275 `<CodeBlock />` dead) |
| `src/pages/snippets/[...slug].astro` | Detail snippet (line 119 `<CodeBlock />` dead) |
| `public/sw.js` | Service worker |
| `public/robots.txt` | Crawl rules |
| `public/manifest.json` | PWA manifest |
| `ecosystem.config.cjs` | PM2 config |

### Domain Inkonsisten (Pilih & Konsistenkan)

| Lokasi | Domain Saat Ini |
|--------|-----------------|
| `astro.config.mjs` line 22 | `cupofcode.cc` |
| `src/consts.ts` line 5 | `cupofcode.cc` |
| `public/robots.txt` | `cupofcode.cc` |
| `.env.example` line 6 | `cupofcode.cc` |
| `src/pages/api/newsletter.ts` | `cupofcode.cc` |
| `src/pages/api/contact.ts` | `cupofcode.cc` |

**Rekomendasi:** Pilih `cupofcode.cc` (sesuai `.env.example` & intent produk), konsistenkan ke semua lokasi, set redirect 301 di nginx dari `.cc` → `.id`.

---

## 📊 Status Task (Master Checklist)

### Phase 1: Critical Fixes (Hari 1-3) — 🔴 BLOCKER

| # | Task | Prioritas | Status | Catatan |
|---|------|-----------|--------|---------|
| F-11.1.1 | Fix font `Google Sans Flex` di `global.css` | 🔴 P0 | ⏳ TODO | Lihat detail di bawah |
| F-11.1.2 | Hapus `<CodeBlock />` dead code (3 file) | 🔴 P0 | ⏳ TODO | |
| F-11.1.3 | Hapus `PromptFiller.astro` (duplikat) | 🔴 P0 | ⏳ TODO | |
| F-11.1.4 | Restore atau hapus `<Author Bio>` | 🔴 P0 | ⏳ TODO | Keputusan produk diperlukan |
| F-11.1.5 | Pilih domain & konsistenkan | 🔴 P0 | ⏳ TODO | Rekomendasi: `.id` |

### Phase 2: Documentation (Hari 4-5) — 🔴 BLOCKER

| # | Task | Prioritas | Status | Catatan |
|---|------|-----------|--------|---------|
| F-11.2.1 | Tulis `README.md` final (ganti template) | 🔴 P0 | ⏳ TODO | |
| F-11.2.2 | Cleanup `.env.example` (hapus Plausible comment) | 🔴 P0 | ⏳ TODO | |
| F-11.2.3 | Investigasi `.agent/`, `.codegraph/`, `.freebuff/` | 🟠 P1 | ⏳ TODO | Gitignore atau hapus |

### Phase 3: Infrastructure (Hari 6-8) — 🟠 HIGH

| # | Task | Prioritas | Status | Catatan |
|---|------|-----------|--------|---------|
| F-11.3.1 | Buat nginx config template | 🔴 P0 | ⏳ TODO | Replicate security headers |
| F-11.3.2 | Setup uptime monitoring (UptimeRobot) | 🔴 P0 | ⏳ TODO | Monitor `/api/health` |
| F-11.3.3 | Set `RESEND_API_KEY` atau disable form | 🔴 P0 | ⏳ TODO | Newsletter/kontak masih mock |
| F-11.3.4 | Verifikasi backup strategy | 🟠 P1 | ⏳ TODO | Test restore dari Git tag |

### Phase 4: Manual Verification (Hari 9-12) — 🔴 BLOCKER

| # | Task | Prioritas | Status | Catatan |
|---|------|-----------|--------|---------|
| F-11.4.1 | Lighthouse audit semua tipe halaman | 🔴 P0 | ⏳ TODO | Target: Perf≥90, A11y≥95, SEO≥95 |
| F-11.4.2 | Google Rich Results Test | 🔴 P0 | ⏳ TODO | Submit URL live |
| F-11.4.3 | Cross-browser testing | 🔴 P0 | ⏳ TODO | Chrome, Firefox, Safari, Edge |
| F-11.4.4 | Mobile testing (iOS + Android) | 🔴 P0 | ⏳ TODO | iOS Safari + Android Chrome |
| F-11.4.5 | Dokumentasikan hasil verifikasi | 🔴 P0 | ⏳ TODO | Screenshot + laporan |

### Phase 5: Polish & Deploy (Hari 13-15) — 🟠 HIGH

| # | Task | Prioritas | Status | Catatan |
|---|------|-----------|--------|---------|
| F-11.5.1 | CSP nonce migration (hapus `'unsafe-inline'`) | 🟠 P1 | ⏳ TODO | Sprint F-4 |
| F-11.5.2 | Tambah security headers (COEP/COOP/CORP) | 🟡 P2 | ⏳ TODO | |
| F-11.5.3 | Fix sitemap filter (`includes` → `startsWith`) | 🟡 P2 | ⏳ TODO | |
| F-11.5.4 | Deploy ke production | 🔴 P0 | ⏳ TODO | Final step |
| F-11.5.5 | Post-launch monitoring (24 jam) | 🟠 P1 | ⏳ TODO | |

---

## 🔍 Detail Task

### F-11.1.1: Fix Font `Google Sans Flex` → `Inter`

**File:** `src/styles/global.css`

**Masalah:**
- Line 1: `@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap');`
- Line 25: `--font-body: "Google Sans Flex", Arial, sans-serif;`
- Sprint 3 S3.2 mengklaim sudah diganti ke Inter, tapi kode masih pakai Google Sans Flex

**Solusi:**
1. Hapus `@import url(...)` di line 1 (hanya `@import "tailwindcss";` yang boleh ada)
2. Ubah line 25: `--font-body: "Inter", Arial, sans-serif;`
3. Verifikasi: buka `BaseHead.astro` line 39-42, pastikan stylesheet Google Fonts sudah include `Inter`:
   ```html
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Inter:wght@400;500;600;700&display=swap" />
   ```
   (Sudah benar di BaseHead, jadi hanya perlu fix di global.css)

**Acceptance Criteria:**
- [ ] Tidak ada `@import url(...)` untuk font di `global.css`
- [ ] `--font-body` menggunakan `Inter`
- [ ] Font Inter ter-render di body text (verifikasi via DevTools Computed)
- [ ] `npx astro check` pass
- [ ] `npm run build` sukses
- [ ] Tidak ada 404 di Network tab untuk font request

**Depends on:** —

---

### F-11.1.2: Hapus `<CodeBlock />` Dead Code

**File:** 3 file
- `src/pages/posts/[...slug].astro` line 300
- `src/pages/snippets/[...slug].astro` line 119
- `src/pages/assets/[...slug].astro` line 275

**Masalah:**
- Masing-masing file memiliki `<CodeBlock />` (self-closing) tanpa props di akhir BaseLayout
- Sudah ada `<CodeBlock>` dengan props lengkap di body artikel (line 173 di posts)
- Dead code, tidak melakukan apa-apa

**Solusi:**
1. Hapus baris `<CodeBlock />` (self-closing tanpa props) di akhir BaseLayout
2. Pastikan `<CodeBlock>` dengan props lengkap masih ada di body untuk render code blocks

**Acceptance Criteria:**
- [ ] 3 baris `<CodeBlock />` dead code terhapus
- [ ] Code blocks masih ter-render di body artikel/asset/snippet
- [ ] `npx astro check` pass
- [ ] `npm run build` sukses
- [ ] Visual regression test: bandingkan screenshot sebelum/sesudah

**Depends on:** —

---

### F-11.1.3: Hapus `PromptFiller.astro` (Duplikat)

**File:**
- Hapus: `src/components/digital-assets/PromptFiller.astro`
- Tetap: `src/components/digital-assets/PromptFiller.tsx` (yang aktif dipakai di `assets/[...slug].astro`)

**Masalah:**
- Ada 2 file PromptFiller: `.astro` dan `.tsx`
- `assets/[...slug].astro` line 12 import yang `.tsx`
- `.astro` adalah duplikat/lama

**Solusi:**
1. Verifikasi `.astro` benar-benar tidak dipakai (grep)
2. Hapus file `.astro`
3. Verifikasi build masih sukses

**Acceptance Criteria:**
- [ ] `PromptFiller.astro` terhapus
- [ ] `PromptFiller.tsx` masih berfungsi di `assets/[...slug].astro`
- [ ] `npx astro check` pass
- [ ] `npm run build` sukses

**Depends on:** —

---

### F-11.1.4: Restore atau Hapus `<Author Bio>`

**File:** `src/pages/posts/[...slug].astro` line 188–210

**Masalah:**
- Block `<Author Bio>` di-comment-kan
- Fase 3.7 mengklaim "Author Bio implemented" tapi kode di-comment
- Inkonsistensi klaim vs kode

**Solusi (pilih satu, konfirmasi user):**

**Opsi A: Restore (Recommended)**
- Uncomment block Author Bio
- Tampilkan di bawah related articles section
- Sesuai klaim dokumentasi

**Opsi B: Hapus permanen**
- Hapus seluruh block commented
- Update CHANGELOG Fase 3.7: "Author Bio dihapus, ganti dengan..."

**Acceptance Criteria (Opsi A):**
- [ ] Author Bio ter-render di post detail
- [ ] Avatar, nama, bio, dan social links tampil
- [ ] Styling konsisten dengan design system
- [ ] `npx astro check` pass
- [ ] `npm run build` sukses

**Depends on:** Keputusan user (Opsi A atau B)

---

### F-11.1.5: Pilih Domain & Konsistenkan

**Rekomendasi:** `cupofcode.cc` (sesuai `.env.example` & intent produk Indonesia)

**File yang perlu diubah:**
1. `astro.config.mjs` line 22: fallback `https://cupofcode.cc`
2. `src/consts.ts` line 5: `https://cupofcode.cc`
3. `public/robots.txt`: `Sitemap: https://cupofcode.cc/sitemap-index.xml`
4. `src/pages/api/newsletter.ts` line 15, 49: konsisten (sudah `.id`)
5. `src/pages/api/contact.ts` line 39, 40: konsisten (sudah `.id`)
6. `docs/finalization/FINALIZATION-CONTEXT.md` Appendix B: (sudah `.id`)

**Solusi tambahan:**
1. Set `PUBLIC_SITE_URL=https://cupofcode.cc` di `.env` production
2. Set nginx redirect 301 dari `cupofcode.cc` → `cupofcode.cc`
3. Set nginx redirect 301 dari `www.cupofcode.cc` → `cupofcode.cc` (jika www dipakai)

**Acceptance Criteria:**
- [ ] Semua referensi domain konsisten ke `cupofcode.cc`
- [ ] Tidak ada lagi referensi `cupofcode.cc` di source code
- [ ] Canonical URL di HTML = `https://cupofcode.cc/...`
- [ ] OG URL di HTML = `https://cupofcode.cc/...`
- [ ] Sitemap URL = `https://cupofcode.cc/sitemap-index.xml`
- [ ] `npx astro check` pass
- [ ] `npm run build` sukses
- [ ] (Post-deploy) curl `https://cupofcode.cc` → 301 ke `cupofcode.cc`

**Depends on:** Konfirmasi user (pilih `.id` atau tetap `.cc`)

---

### F-11.2.1: Tulis `README.md` Final

**File:** `README.md` (overwrite)

**Konten yang harus ada:**
- [ ] Project title & branding (Cup of Code)
- [ ] One-line description (Bahasa Indonesia)
- [ ] Tech stack badges (Astro, React, Tailwind, Keystatic, TypeScript)
- [ ] Quick start: `pnpm install && pnpm dev`
- [ ] Environment variables table (link ke `.env.example`)
- [ ] Project structure diagram
- [ ] Content creation guide (Keystatic usage)
- [ ] Deployment guide (nginx + PM2)
- [ ] Link ke `docs/` (ROADMAP, CHANGELOG, dll)
- [ ] Screenshot homepage (opsional, tapi sangat disarankan)

**Acceptance Criteria:**
- [ ] README.md tidak ada lagi referensi ke "Astro Starter Kit" atau emoji korup
- [ ] Semua link internal valid
- [ ] Markdown valid (cek via markdownlint)
- [ ] Section quick start dapat diikuti tanpa error

**Depends on:** —

---

### F-11.2.2: Cleanup `.env.example`

**File:** `.env.example`

**Masalah:**
- Masih ada blok `# Plausible` di-comment (sudah migrasi ke Umami)

**Solusi:**
1. Hapus blok:
   ```bash
   # Plausible
   # PUBLIC_PLAUSIBLE_DOMAIN=cupofcode.cc
   # PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js
   ```
2. Pertahankan blok Umami (sudah benar)
3. Pertahankan blok Google Analytics (sebagai alternatif)
4. Tambahkan komentar untuk setiap variabel (jika belum ada)

**Acceptance Criteria:**
- [ ] Tidak ada referensi Plausible (kecuali di docs)
- [ ] Semua variabel aktif didokumentasikan
- [ ] File mudah dibaca & dipahami

**Depends on:** —

---

### F-11.2.3: Investigasi Direktori Mencurigakan

**Direktori:** `.agent/`, `.codegraph/`, `.freebuff/` (di root)

**Masalah:**
- Tidak jelas fungsinya
- Kemungkinan sisa tooling sesi AI
- Bisa污染 repository jika di-commit

**Solusi (pilih satu):**
- **Opsi A:** Tambah ke `.gitignore` (jika dipakai lokal saja)
- **Opsi B:** Hapus permanen (jika tidak dipakai)

**Acceptance Criteria:**
- [ ] Direktori tidak akan ter-commit ke Git
- [ ] `.gitignore` ter-update
- [ ] (Jika dihapus) Direktori tidak ada lagi di root

**Depends on:** Investigasi fungsi direktori (grep isi)

---

### F-11.3.1: Buat nginx Config Template

**File baru:** `deploy/nginx.conf` (atau `nginx.conf.example`)

**Isi yang harus ada:**

```nginx
# HTTPS Redirect
server {
    listen 80;
    server_name cupofcode.cc cupofcode.cc;
    return 301 https://cupofcode.cc$request_uri;
}

# www redirect
server {
    listen 443 ssl http2;
    server_name www.cupofcode.cc;
    return 301 https://cupofcode.cc$request_uri;
}

# cupofcode.cc redirect
server {
    listen 443 ssl http2;
    server_name cupofcode.cc;
    return 301 https://cupofcode.cc$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name cupofcode.cc;

    # SSL config (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/cupofcode.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cupofcode.cc/privkey.pem;

    # Security Headers (CRITICAL: middleware hanya cover SSR routes)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;
    add_header X-XSS-Protection "0" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;

    # CSP (mirror dari middleware)
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://umami.example.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com; connect-src 'self' https://ingest.sentry.io https://*.sentry.io https://umami.example.com; manifest-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests" always;

    # Proxy ke Astro
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Acceptance Criteria:**
- [ ] File `deploy/nginx.conf` atau `nginx.conf.example` dibuat
- [ ] Semua security headers dari middleware di-replicate
- [ ] HTTPS redirect 301 dikonfigurasi
- [ ] Static asset caching dikonfigurasi
- [ ] Dokumentasi cara install & enable di README

**Depends on:** F-11.1.5 (domain choice)

---

### F-11.3.2: Setup Uptime Monitoring

**Tool rekomendasi:** UptimeRobot (gratis) atau BetterStack

**Setup:**
1. Buat akun di UptimeRobot
2. Add monitor untuk `https://cupofcode.cc/api/health`
3. Set interval: 5 menit
4. Set alert: email + Slack/Discord webhook
5. Dokumentasikan credentials di `.env.example` (jika ada API key)

**Acceptance Criteria:**
- [ ] Monitor aktif dan mengirim alert test
- [ ] Response time tracked historis
- [ ] Downtime alert diterima saat simulasi failure

**Depends on:** F-11.1.5 (domain live)

---

### F-11.3.3: Set `RESEND_API_KEY` atau Disable Form

**Masalah:**
- Tanpa `RESEND_API_KEY`, endpoint `/api/newsletter` dan `/api/contact` masih mock
- `console.log` saja, email tidak benar-benar terkirim
- Form akan return success tapi tidak ada efek nyata

**Solusi (pilih satu):**

**Opsi A: Set Resend API Key (Recommended)**
1. Daftar akun di resend.com
2. Verifikasi domain `cupofcode.cc` di dashboard
3. Generate API key
4. Set di production env: `RESEND_API_KEY=re_xxxxx`
5. Set `EMAIL_FROM=newsletter@cupofcode.cc`
6. Set `EMAIL_ADMIN=admin@cupofcode.cc`
7. Test kirim email (manual via form)

**Opsi B: Disable Form (Temporary)**
1. Tambah flag `PUBLIC_FORMS_ENABLED=false` di `.env.example`
2. Di komponen form, cek flag dan tampilkan "Form sementara tidak tersedia"
3. Endpoint API return 503 Service Unavailable
4. Dokumentasikan di README bahwa forms disabled

**Acceptance Criteria (Opsi A):**
- [ ] API key ter-set di production env
- [ ] Email test terkirim & diterima
- [ ] Newsletter form berfungsi end-to-end
- [ ] Contact form berfungsi end-to-end
- [ ] Auto-reply diterima user
- [ ] Admin notification diterima

**Depends on:** Konfirmasi user (pilih Opsi A atau B)

---

### F-11.3.4: Verifikasi Backup Strategy

**File:** `docs/BACKUP-STRATEGY.md`

**Tujuan:** Pastikan prosedur restore berfungsi

**Langkah verifikasi:**
1. Identifikasi Git tag terakhir (mis. `v1.1.2`)
2. Clone repository di environment terpisah
3. Checkout ke tag `v1.1.2`
4. Install dependencies (`pnpm install`)
5. Build (`pnpm build`)
6. Jalankan (`pnpm preview`)
7. Verifikasi semua halaman dapat diakses
8. Restore `.env` dari backup (jika ada)
9. Verifikasi form & API berfungsi

**Acceptance Criteria:**
- [ ] Restore procedure terdokumentasi step-by-step
- [ ] Test restore berhasil (catat waktu RTO)
- [ ] (Opsional) GitHub Actions backup workflow dibuat

**Depends on:** —

---

### F-11.4.1: Lighthouse Audit

**Tool:** Chrome DevTools → Lighthouse atau PageSpeed Insights

**Halaman yang di-test:**
- `/` (homepage)
- `/posts` (listing)
- `/posts/[slug]` (detail, pilih 1)
- `/assets` (listing)
- `/assets/[slug]` (detail, pilih 1)
- `/snippets` (listing)
- `/snippets/[slug]` (detail, pilih 1)
- `/about`
- `/contact`
- `/privacy`
- `/terms`

**Target (mobile, throttling 4G):**
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

**Acceptance Criteria:**
- [ ] Semua halaman mencapai target
- [ ] Hasil screenshot & score disimpan di `docs/review/lighthouse-2026-MM-DD.md`
- [ ] Jika ada halaman yang gagal, buat task improvement di Sprint F-12

**Depends on:** F-11.1.5 (domain live)

---

### F-11.4.2: Google Rich Results Test

**Tool:** https://search.google.com/test/rich-results

**Halaman yang di-test:**
- `/posts/[slug]` (Article schema)
- `/posts/[slug]` (BreadcrumbList schema)
- `/` (WebSite + Organization schema)
- `/assets/[slug]` (BreadcrumbList schema)

**Acceptance Criteria:**
- [ ] Article schema valid (tidak ada error)
- [ ] BreadcrumbList schema valid
- [ ] WebSite schema valid
- [ ] Organization schema valid
- [ ] Screenshot hasil disimpan di `docs/review/rich-results-2026-MM-DD.md`

**Depends on:** F-11.1.5 (domain live)

---

### F-11.4.3: Cross-Browser Testing

**Browser:**
- Chrome (desktop)
- Firefox (desktop)
- Safari (desktop, jika Mac tersedia)
- Edge (desktop)
- iOS Safari (mobile)
- Android Chrome (mobile)

**Aspek yang di-test:**
- Layout consistency
- Font rendering
- Interactivity (hamburger menu, search, form, copy button)
- View transitions smooth
- Dark/light mode (jika ada)
- PWA install prompt

**Acceptance Criteria:**
- [ ] Tidak ada layout break di semua browser
- [ ] Semua interaktivitas berfungsi
- [ ] Screenshot per browser disimpan di `docs/review/cross-browser-2026-MM-DD.md`

**Depends on:** F-11.1.5 (domain live)

---

### F-11.4.4: Mobile Testing

**Device:**
- iPhone SE (small screen)
- iPhone 14 Pro (standard)
- Android Pixel 5 (standard)
- iPad (tablet, opsional)

**Aspek yang di-test:**
- Touch target minimal 44px
- Scroll performance
- Form input usability
- MobileNav hamburger
- Orientation change (portrait/landscape)
- Safe area untuk notch

**Acceptance Criteria:**
- [ ] Tidak ada horizontal scroll
- [ ] Touch target sesuai standar
- [ ] Form mudah diisi di mobile
- [ ] Screenshot per device disimpan

**Depends on:** F-11.1.5 (domain live)

---

### F-11.4.5: Dokumentasikan Hasil Verifikasi

**File baru:**
- `docs/review/lighthouse-2026-MM-DD.md`
- `docs/review/rich-results-2026-MM-DD.md`
- `docs/review/cross-browser-2026-MM-DD.md`
- `docs/review/mobile-testing-2026-MM-DD.md`

**Acceptance Criteria:**
- [ ] Semua hasil verifikasi terdokumentasi
- [ ] Screenshot tersimpan (jika memungkinkan)
- [ ] Rekomendasi improvement (jika ada) dicatat untuk Sprint F-12

**Depends on:** F-11.4.1, F-11.4.2, F-11.4.3, F-11.4.4

---

### F-11.5.1: CSP Nonce Migration

**File:** `src/middleware.ts`, `astro.config.mjs`, `src/components/BaseHead.astro`

**Tujuan:** Hapus `'unsafe-inline'` dari `script-src` dan `style-src`

**Solusi (Astro 7.1 CSP API):**
1. Enable Astro CSP di `astro.config.mjs`:
   ```js
   security: {
     csp: {
       algorithm: 'SHA-256',
       scriptDirective: {
         resources: ["'self'"],
       },
     },
   }
   ```
2. Astro akan otomatis generate nonce/hash untuk inline script
3. Hapus custom CSP di middleware (biarkan Astro handle)
4. Test: verifikasi tidak ada CSP violation di console

**Acceptance Criteria:**
- [ ] Tidak ada `'unsafe-inline'` di CSP
- [ ] Inline script tetap berjalan (nonce/hash di-inject)
- [ ] Tidak ada CSP violation di console
- [ ] securityheaders.com score: A+

**Depends on:** —

---

### F-11.5.2: Tambah Security Headers

**File:** `src/middleware.ts` + `deploy/nginx.conf`

**Headers yang ditambah:**
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-site`
- `X-Permitted-Cross-Domain-Policies: none`

**Acceptance Criteria:**
- [ ] Headers muncul di response (via curl -I)
- [ ] Tidak break functionality
- [ ] securityheaders.com score: A+

**Depends on:** —

---

### F-11.5.3: Fix Sitemap Filter

**File:** `astro.config.mjs` line 32

**Masalah:**
- `filter: (page) => !page.includes('/api/')` — substring match

**Solusi:**
- Ubah ke: `filter: (page) => !page.startsWith('/api/')`
- Atau lebih aman: `!page.includes('/keystatic') && !page.match(/^\/api\//)`

**Acceptance Criteria:**
- [ ] Filter lebih akurat
- [ ] Sitemap tidak mengandung false positives
- [ ] Verifikasi via `curl https://cupofcode.cc/sitemap-index.xml`

**Depends on:** —

---

### F-11.5.4: Deploy ke Production

**Langkah:**
1. Pastikan semua env vars ter-set di production server
2. Pull latest code dari Git
3. `pnpm install --frozen-lockfile`
4. `pnpm build`
5. Restart PM2: `pm2 restart ecosystem.config.cjs`
6. Reload nginx: `sudo nginx -s reload`
7. Verifikasi DNS: `dig cupofcode.cc`
8. Verifikasi SSL: `curl -I https://cupofcode.cc`
9. Test halaman: `curl https://cupofcode.cc/posts/...`
10. Submit sitemap ke Google Search Console

**Acceptance Criteria:**
- [ ] DNS mengarah ke server yang benar
- [ ] SSL valid (A+ di ssllabs.com)
- [ ] Semua halaman dapat diakses
- [ ] Forms berfungsi (jika RESEND_API_KEY set)
- [ ] Analytics tracking aktif (jika Umami set)
- [ ] Sitemap submitted ke Search Console

**Depends on:** Semua task sebelumnya selesai

---

### F-11.5.5: Post-Launch Monitoring (24 Jam)

**Tujuan:** Pastikan tidak ada issue kritis dalam 24 jam pertama

**Monitoring:**
1. Cek Sentry untuk error baru
2. Cek UptimeRobot untuk downtime
3. Cek Google Search Console untuk indexing
4. Cek analytics untuk traffic pattern
5. Monitor response time & server load
6. Cek forms (newsletter & contact) berfungsi

**Acceptance Criteria:**
- [ ] Tidak ada error kritis di Sentry
- [ ] Uptime 100% dalam 24 jam
- [ ] Forms mengirim email dengan sukses
- [ ] Google mulai meng-index halaman
- [ ] Traffic pattern sesuai ekspektasi (atau lebih tinggi)

**Depends on:** F-11.5.4 (deploy sukses)

---

## ✅ Definition of Done (DoD) Global

Sprint F-11 dianggap **selesai** hanya jika SEMUA berikut terpenuhi:

- [ ] Semua task Phase 1 (Critical Fixes) berstatus `[x]` dengan acceptance criteria terverifikasi
- [ ] Semua task Phase 2 (Documentation) berstatus `[x]`
- [ ] Semua task Phase 3 (Infrastructure) berstatus `[x]`
- [ ] Semua task Phase 4 (Manual Verification) berstatus `[x]` dengan screenshot/laporan tersimpan
- [ ] Task Phase 5 (Deploy & Monitor) selesai
- [ ] `npx astro check` berjalan tanpa error (0 error, 0 warning)
- [ ] `npm run build` sukses dan menghasilkan output `dist/`
- [ ] Tidak ada regression pada halaman yang tidak disentuh
- [ ] Changelog entry sprint telah diisi di `docs/review/CHANGELOG.md`
- [ ] Project live di production domain dengan SSL valid
- [ ] Lighthouse score ≥ target (90/95/95/95)
- [ ] Google Rich Results Test pass
- [ ] Uptime monitoring aktif

---

## 📊 Progress Tracking

**Last updated:** 2026-08-30
**Status:** 📋 Planned (belum dimulai)
**Next milestone:** Phase 1 selesai (3 hari)

Update checklist di atas setelah setiap task selesai. Jangan klaim selesai sebelum DoD terpenuhi.

---

## 🔗 Referensi

- `docs/review/CODEBASE-REVIEW-2026-08-30.md` — Laporan audit lengkap (WAJIB BACA)
- `docs/ROADMAP.md` — Roadmap fase-fase pengembangan
- `docs/CHANGELOG.md` — Changelog per fase
- `docs/PRE-PRODUCTION-SPRINTS.md` — Hasil audit S1–S5
- `docs/PERFORMANCE-BUDGET.md` — Threshold performance target
- `docs/BACKUP-STRATEGY.md` — Strategi backup konten
- `docs/finalization/FINALIZATION-CONTEXT.md` — 96 items finalisasi
- `docs/finalization/FINALIZATION-CHANGELOG.md` — Sprint F-1 s/d F-10

---

**Catatan Akhir:** Sprint ini adalah **gerbang terakhir** sebelum production. Disiplin dalam mengikuti workflow & guardrails akan menentukan kualitas hasil. Dokumentasikan setiap keputusan dan temuan di changelog untuk referensi masa depan.
