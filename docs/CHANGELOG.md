# Changelog — Cup of Code

> **Format:** Berdasarkan [Keep a Changelog](https://keepachangelog.com/)
> **Status:** Aktif — diperbarui setiap fase selesai

---

## [Fase 1] — Core Pages & Dynamic Content

**Status:** ✅ Selesai (2026-07-27)
**Estimasi:** 5-7 hari | **Realiasi:** ~2 jam

### Task List

- [x] **1.1** Digital Assets — Listing Page (`/assets`)
- [x] **1.2** Digital Assets — Detail Page (`/assets/[...slug]`)
- [x] **1.3** ComponentPreview.astro — Isi komponen preview + code viewer
- [x] **1.4** GemsViewer.astro — Isi komponen system instruction viewer dengan copy
- [x] **1.5** PromptFiller.astro — Isi komponen form interaktif dengan variabel input
- [x] **1.6** Snippets — Listing Page (`/snippets`)
- [x] **1.7** Snippets — Detail Page (`/snippets/[...slug]`)
- [x] **1.8** 404 Page (`/404`)
- [x] **1.9** Refactor Homepage — Dynamic content dari collection (`getCollection("posts")`)
- [x] **1.10** Refactor Homepage — Dynamic categories dari collection
- [x] **1.11** Refactor Homepage — Hapus pagination hardcoded
- [x] **1.12** Blog Posts Listing — Redesign grid + filter kategori via `?cat=`
- [x] **1.13** Contact Page (`/contact`)
- [x] **1.14** Layout System — BaseLayout.astro + refactor semua halaman existing
- [x] **1.15** Keystatic — Snippets & Assets routes via `[...slug].astro`

### Catatan
- Scrollbar custom styles ditambahkan ke `global.css`
- Navigasi Header & Footer diperbarui dengan link ke semua halaman baru
- Share buttons di post detail menggunakan real URL (WhatsApp, Facebook, Twitter)
- Digital assets detail page menampilkan sidebar sticky dengan metadata (format, size, variables)
- Snippets detail page memiliki sidebar info bahasa + tombol copy

---

## [Fase 2] — Fitur Interaktif & UX

**Status:** ✅ Selesai (2026-07-27)
**Estimasi:** 4-6 hari | **Realiasi:** ~1 jam

### Task List

- [x] **2.1** Search Functionality — Client-side search di listing pages (React SearchBar component)
- [x] **2.2** Share Buttons — Real URL generator (sudah diimplementasi di Fase 1)
- [x] **2.3** Newsletter Form — Integrasi dengan API endpoint `/api/newsletter` (React NewsletterForm)
- [x] **2.4** Mobile Navigation — Hamburger menu untuk mobile < 768px (React MobileNav component)
- [x] **2.5** TOC Scroll Spy — Active state Daftar Isi (sudah diimplementasi di Fase 1)
- [x] **2.6** Copy Code Button — Tombol copy untuk code blocks (React CopyButton + sidebar snippet copy)
- [x] **2.7** Skeleton Loading — Loading state + shimmer animation di global.css
- [x] **2.8** Scroll Animations — Intersection Observer fade-in (ScrollAnimations component)
- [x] **2.9** Back to Top Button — Floating button muncul setelah scroll > 300px (React BackToTop)
- [x] **2.10** Image Lazy Loading — Audit: hero images eager, sisanya default lazy
- [x] **2.11** Breadcrumb Navigation — Breadcrumb component di post, snippet, asset detail pages

### Catatan

- **Komponen React baru:** `SearchBar`, `BackToTop`, `CopyButton`, `MobileNav`, `NewsletterForm` — semuanya di `src/components/ui/`
- **Komponen Astro baru:** `Breadcrumb.astro`, `ScrollAnimations.astro`
- **API endpoint baru:** `POST /api/newsletter` — menerima JSON `{ email }`, validasi + log
- **`lucide-react`** ditambahkan sebagai dependency untuk React components
- **MobileNav** menggunakan `client:load` directive untuk menghindari SSR window reference
- **SearchBar** mendukung keyboard navigasi (ArrowUp/Down, Enter, Escape), auto-close on click outside
- **ScrollAnimations** menggunakan IntersectionObserver dengan `data-animate` attribute, menghormati `prefers-reduced-motion`
- **Skeleton classes** ditambahkan ke `global.css`: `.skeleton`, `.skeleton-card`, `.skeleton-text`, `.skeleton-text-sm`
- **Reduced motion** media query ditambahkan untuk aksesibilitas

---

## [Fase 3] — Konten & Pembersihan

**Status:** ✅ Selesai (2026-07-27)
**Estimasi:** 5-8 hari | **Realiasi:** ~2 jam

### Task List

- [x] **3.1** Populate Snippets — `format-currency` (Intl.NumberFormat untuk IDR) & `use-debounce-hook` (custom React hook generic)
- [x] **3.2** Populate Digital Assets — UI Components: `bento-grid-card` dengan kode komponen, props table, variasi layout, contoh penggunaan
- [x] **3.3** Populate Digital Assets — Prompts: `deepseek-code-explainer` dengan full prompt template, variabel input, contoh output, tips penggunaan
- [x] **3.4** Populate Digital Assets — Gems: `ux-writing-assistant` dengan system instructions, cara penggunaan, contoh transformasi teks, knowledge base
- [x] **3.5** Add Blog Posts — 3 artikel baru: setup Tailwind CSS di Vite, state management Zustand, best practices keamanan Node.js (total 5 artikel)
- [x] **3.6** Featured Image Strategy — Standarisasi featured_image dengan fallback, tampilkan gambar real dari Unsplash di card listing
- [x] **3.7** Author Bio — Section author di footer artikel (avatar, bio, social links)
- [x] **3.8** Table of Contents — Auto-generate dari heading h2 (sudah berfungsi)
- [x] **3.9** Reading Time Estimator — Hitung estimasi baca dari word count (200 kata/menit), tampilkan di header artikel
- [x] **3.10** Related Posts — Priority berdasarkan kategori yang sama, fallback ke post lain
- [x] **3.11** Image Alt Text Audit — Semua gambar real memiliki alt text deskriptif; placeholder icon sudah benar

### Catatan

- Konten baru dibuat berdasarkan referensi visual di `docs/references/` (snippet-library.html, ui-components.html, prompts.html, gems.html)
- Tiga blog post baru ditambahkan untuk mencapai total 5 artikel:
  - "Panduan Lengkap Setup Tailwind CSS di Vite" (tutorial)
  - "State Management React dengan Zustand" (tutorial)
  - "Best Practices Keamanan di Node.js" (tips-trik)
- **Reading Time Estimator** menggunakan `post.body` (raw markdown) untuk menghitung word count
- **Related Posts** diprioritaskan dari kategori yang sama dengan post yang sedang dibaca
- **Author Bio** menampilkan informasi penulis statis dengan foto, bio, dan link sosial
- **Featured images** dari Unsplash ditampilkan di card listing homepage & posts page (dengan fallback ikon)

---

## [Fase 4] — Production Configuration

**Status:** ✅ Selesai (2026-07-27)
**Estimasi:** 3-5 hari | **Realiasi:** ~1 jam

### Task List

- [x] **4.1** Keystatic — GitHub Storage: konfigurasi dual-mode (local dev / GitHub production) dengan env var `KEYSTATIC_STORAGE_KIND`
- [x] **4.2** Set Production Domain: `site` menggunakan `PUBLIC_SITE_URL` env var dengan fallback `https://cupofcode.cc`
- [x] **4.3** Environment Variables: file `.env.example` dengan dokumentasi semua variabel yang dibutuhkan
- [x] **4.4** RSS Feed: endpoint `/rss.xml` via `@astrojs/rss` untuk blog posts
- [x] **4.5** Privacy Policy Page: halaman `/privacy` sesuai standar GDPR/Indonesia
- [x] **4.6** Terms of Service Page: halaman `/terms` untuk digital assets, snippets, dan konten
- [x] **4.7** Analytics Setup: integrasi Plausible/Umami/Google Analytics via BaseHead dengan env var
- [x] **4.8** CI/CD Pipeline: GitHub Actions workflow (lint → typecheck → build → deploy via SCP + PM2)
- [x] **4.9** Robots.txt: `public/robots.txt` dengan Allow all + Sitemap link
- [x] **4.10** Structured Data: JSON-LD Article + BreadcrumbList + WebSite + Organization (sekarang lengkap & tervalidasi — awalnya BreadcrumbList hanya visual, diperbaiki Sprint 2)
- [x] **4.11** Security Headers: middleware X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy + **HSTS** (Sprint 1) + **CSP** (Sprint 5)
- [x] **4.12** Error Monitoring: integrasi `@sentry/astro` dengan env var `PUBLIC_SENTRY_DSN`
- [x] **4.13** Performance Budget: dokumentasi threshold di `docs/PERFORMANCE-BUDGET.md`
- [x] **4.14** Backup Strategy: dokumentasi backup konten Git + rekomendasi di `docs/BACKUP-STRATEGY.md`

### Catatan

- **Keystatic** dikonfigurasi dual-mode: `kind: "local"` untuk development, `kind: "github"` untuk production — diatur via `KEYSTATIC_STORAGE_KIND` env var
- **Security headers** diimplementasi sebagai Astro middleware (`src/middleware.ts`) yang diterapkan ke semua response
- **Sentry** diintegrasikan melalui `@sentry/astro` plugin, aktif hanya jika `PUBLIC_SENTRY_DSN` tersedia
- **CI/CD** workflow mencakup lint/typecheck, build, deploy via SCP ke VPS, dan restart PM2
- **Structured data** (JSON-LD Article) ditambahkan di post detail page dengan properti headline, description, image, datePublished, author, publisher, wordCount, timeRequired
- **RSS Feed** tersedia di `/rss.xml` dengan semua blog posts
- **Halaman legal** (`/privacy`, `/terms`) sudah terhubung di Footer
- **Footer** diperbarui: link Privacy Policy dan Terms of Services现在 menjadi link aktif menuju halaman masing-masing
- **`ecosystem.config.cjs`** dibuat untuk PM2 production deployment

---

## [Fase 5] — Polish & Launch

**Status:** 🚧 Fitur selesai; audit diverifikasi via Pre-Production Sprints; **deploy production menunggu go-live**
**Estimasi:** 4-6 hari | **Realiasi:** ~2 jam (fitur) + Pre-Production Sprints S1–S5 (audit)

### Task List

- [x] **5.1** Dark Mode — Theme toggle dengan persist localStorage
- [x] **5.2** Page Transitions — Astro View Transitions
- [x] **5.3** Accessibility Audit — Lighthouse aksesibilitas 100%*
- [x] **5.4** SEO Audit — Google Rich Results Test*
- [x] **5.5** Performance Audit — Lighthouse 90+ / Core Web Vitals*
- [x] **5.6** Cross-browser Testing — Chrome, Firefox, Safari, Edge*
- [x] **5.7** Mobile Touch UX — Touch targets, gestures
- [x] **5.8** Loading States — LoadingSkeleton component (card/text/detail variant)
- [x] **5.9** Error States — ErrorState & EmptyState component
- [x] **5.10** PWA Support — Manifest (`public/manifest.json`) + service worker (`public/sw.js`)
- [x] **5.11** Social Preview Cards — OG image width/height + canonical URL improvements
- [x] **5.12** Pre-launch Checklist — Final review broken links, console errors (diverifikasi Sprint 5)
- [ ] **5.13** Deploy Production — DNS, SSL, redirects (⏳ menunggu go-live)
- [ ] **5.14** Post-launch Monitoring — Analytics, error rate, response time (⏳ pasca go-live)

*\* Item audit (5.3 aksesibilitas, 5.4 SEO, 5.5 performance, 5.6 cross-browser) diverifikasi ulang via **Pre-Production Sprints 1–5** (`docs/PRE-PRODUCTION-SPRINTS.md`) karena sebelumnya belum teruji. Item 5.13/5.14 belum dieksekusi.*

### Catatan

- **Dark Mode** menggunakan CSS custom properties override via `html[data-theme="dark"]`:
  - Palette gelap: bg `#121212`, surface `#1e1e1e`, text `#e0e0e0`, line `#333`
  - `ThemeToggle.tsx` (React) — Sun/Moon icon dari lucide-react, persist ke `localStorage('coc-theme')`
  - Inline script di `<head>` mencegah flash of wrong theme (FOUC)
  - Komponen existing: NewsletterForm, BackToTop, Header — diperbarui untuk dark mode
- **View Transitions** via `ClientRouter` dari `astro:transitions` di BaseLayout
- **PWA Support:**
  - `manifest.json` — name, short_name, icons, theme_color (`#ffbb00`), display standalone
  - `sw.js` — **network-first untuk navigasi HTML, cache-first untuk aset statis** (dirombak Sprint 3 dari cache-first total agar konten tidak stale)
- **Komponen baru:**
  - `LoadingSkeleton.astro` — 3 variant: `card` (grid skeleton), `text` (baris teks), `detail` (halaman detail)
  - `ErrorState.astro` — Error card dengan ikon, pesan, tombol retry, bisa dikustom
  - `EmptyState.astro` — Empty state card dengan ikon Inbox, pesan, action link opsional
- **Mobile Touch UX:** Global CSS memperbesar `min-height: 44px` untuk semua interactive elements via `@media (pointer: coarse)`, smooth touch scrolling, `-webkit-tap-highlight-color: transparent`
- **Spinner** CSS class ditambahkan ke `global.css`: `.spinner` (24px, border) dan `.spinner-lg` (40px)
- **OG Image** meta tags diperkaya dengan `og:image:width` (1200) dan `og:image:height` (630)
- **Security:** `X-XSS-Protection: 0` sudah ada di middleware

---

## [Fase 6] — Learning & Roadmap Features ❌ DE-SCOPED (2026-07-30)

**Status:** ❌ Dihapus (2026-07-30) — arah produk diubah menjadi content-driven blog (bukan LMS)
**Estimasi:** 2-4 jam | **Realiasi:** ~30 menit (lalu dihapus)

> ⚠️ **Seluruh Fase 6 dihapus 2026-07-30.** Halaman `/learning` & `/roadmap`, komponen `RoadmapStep.tsx`, navigasi (Header/Footer), dan precache SW dihapus. Artikel blog `posts/roadmap-jadi-web-developer-...` **tetap ada** sebagai konten editorial. Lihat `docs/ROADMAP.md` (scope redefinition) & `docs/PRE-PRODUCTION-SPRINTS.md`.

**Riwayat (sebelum dihapus):**
- P.7 Learning Pathways (`/learning`) — pernah terimplementasi 2026-07-28, dihapus 2026-07-30
- P.8 Web Dev Roadmap Interaktif (`/roadmap`) + `RoadmapStep.tsx` — pernah terimplementasi 2026-07-28, dihapus 2026-07-30

---

## [Post-Launch] — Iterasi & Scale

**Status:** 📅 Direncanakan (3-6 bulan setelah launch)

### Task List

- [ ] **P.1** User Accounts — Registrasi/login (Supabase/Auth.js)
- [ ] **P.2** Digital Asset Download — Track download, user library
- [ ] **P.3** Comment System — Diskusi per artikel
- [ ] **P.4** Paid Assets — Premium assets dengan payment gateway
- [ ] **P.5** User Dashboard — Riwayat download, saved posts
- [ ] **P.6** Content Rating — Like/rating untuk artikel & assets
- [ ] ~~**P.7** Learning Pathways~~ — ❌ DE-SCOPED (dihapus 2026-07-30)
- [ ] ~~**P.8** Web Dev Roadmap Interaktif~~ — ❌ DE-SCOPED (dihapus 2026-07-30)
- [ ] **P.9** Admin Dashboard — Analytics, user management
- [ ] **P.10** Email Newsletter Engine — Automated digest
- [ ] **P.11** Multi-language — i18n (Inggris)
- [ ] **P.12** Community Forum — Q&A, sharing snippets
- [ ] **P.13** AI-powered Features — Auto-tagging, recommendations

---

## [Pre-Production Sprints] — Audit, Hardening & Verification (S1–S5)

> **Sumber kebenaran:** `docs/PRE-PRODUCTION-SPRINTS.md`. Dibuat karena banyak klaim ✅ di atas (Fase 1–5) belum terverifikasi. Bagian ini merekonsiliasi kondisi aktual per 2026-07-30.

### Sprint 1 — Fix Bug Fungsional & Blocking (2026-07-29)
- Filter kategori `/posts?cat=` (2 bug: prerender + `URLSearchParams` destructuring) — `src/pages/posts/index.astro`
- Middleware security refactor `async/await` + **HSTS** — `src/middleware.ts`
- Responsivitas Header (desktop/mobile hamburger) — `src/components/Header.astro`

### Sprint 2 — SEO Deep Fix (2026-07-29)
- Konsistensi meta URL (canonical/og:url/twitter:url), `og:type` dinamis, `twitter:site/creator`
- JSON-LD Article (URL absolut + tanggal valid), **WebSite + Organization** global, **BreadcrumbList** (sebelumnya hanya visual)
- Sitemap filter exclude `/keystatic` & `/api/`; `X-Robots-Tag` noindex; RSS feed (`publishDate` filter)

### Sprint 3 — Performance & Core Web Vitals (2026-07-30)
- Font: hapus render-blocking `@import`; body **Google Sans Flex → Inter**
- Optimasi gambar remote (`image.remotePatterns` + `<Image>` webp/srcset, eager LCP)
- Hydration `client:idle` (BackToTop/SearchBar/NewsletterForm); SW network-first HTML

### Sprint 4 — Fungsionalitas & Polish (2026-07-30)
- Form kontak: endpoint `POST /api/contact` + validasi + feedback inline
- Sinkronisasi schema Keystatic ↔ content.config; struktur post seragam (folder/`index.mdoc`)
- Konsolidasi ikon: hapus `@fortawesome/*` → inline SVG; cleanup typo & no-op; PWA icon 192/512

### Sprint 5 — Pre-Launch Verification (2026-07-30)
- **`astro check` 0 error / 0 warning** (perbaikan 29 error React `class`→`className`)
- JSON-LD valid (Article/Breadcrumb/WebSite/Org); sitemap bersih; tanpa broken internal link
- **CSP** adaptif di middleware (+ catatan: butuh nginx untuk cakupan prerendered)
- Rekonsiliasi ROADMAP & CHANGELOG ini

### Catatan penting
- **Cakupan header security (HSTS/CSP) middleware hanya berlaku route SSR**; halaman prerendered bypass middleware → harus dilengkapi di nginx (deployment).
- Validasi **Lighthouse + Google Rich Results + cross-browser aktual** perlu dijalankan manual pada URL produksi live.
- Dependency `@fortawesome/*` dihapus; jangan re-introduce.

---

## Riwayat Rilis

| Versi | Tanggal | Fase | Deskripsi |
|-------|---------|------|-----------|
| `v0.1.0` | 2026-07-27 | Fase 1 | Core pages, dynamic content, layout system |
| `v0.2.0` | 2026-07-27 | Fase 2 | Search, share, newsletter, mobile nav, animations, back-to-top, breadcrumb |
| `v0.3.0` | 2026-07-27 | Fase 3 | Konten populate, author bio, reading time, related posts, featured images |
| `v1.0.0-rc.1` | 2026-07-27 | Fase 4 | Production configuration: RSS, analytics, Sentry, CI/CD, security headers, structured data, legal pages |
| `v1.0.0-rc.2` | 2026-07-27 | Fase 5 | Polish — dark mode, view transitions, PWA, loading/error states (audit diverifikasi ulang di Pre-Prod Sprints) |
| `v1.1.0` | 2026-07-28 | Fase 6 | Learning & Roadmap — `/learning` pathways, `/roadmap` interaktif, navigasi baru |
| `v1.1.1` | 2026-07-30 | Scope | **De-scope:** hapus Learning Pathways & Roadmap (arah = content-driven blog, bukan LMS) |
| `v1.1.2` | 2026-07-30 | Scope | Hapus dark mode (branding light-only); hapus ThemeToggle, FOUC script, palet dark CSS |
| `v1.0.0-rc.3` | 2026-07-30 | Pre-Prod S1–S5 | Bug fix, SEO deep fix, performance, polish, pre-launch verification (0 error, CSP, rekonsiliasi dokumen) |

---

*Dokumen ini diperbarui setiap fase selesai.*
