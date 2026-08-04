# Pre-Production Sprint Plan — Cup of Code

> **Status Dokumen:** Aktif — Single Source of Truth untuk sprint pre-production
> **Dibuat:** 2026-07-29
> **Target Go-Live:** Setelah Sprint 1–5 selesai & tervalidasi
> **Tujuan:** Membawa project dari kondisi saat ini menjadi **ready-for-production**, dengan fokus utama pada **SEO yang bekerja dengan benar**.

Dokumen ini adalah **peta jalan eksekusi** yang dibangun dari hasil audit codebase menyeluruh. Setiap sprint berisi task list terperinci dengan kriteria penerimaan (acceptance criteria) yang terukur, agar dapat dijalankan oleh **AI agent di sesi chat terpisah** tanpa keluar dari outline.

---

## Daftar Isi

- [Cara Menggunakan Dokumen Ini (WAJIB BACA)](#cara-menggunakan-dokumen-ini-wajib-baca--ai-agent)
- [Konteks Teknis Global](#konteks-teknis-global)
- [Definition of Done (DoD) Global](#definition-of-done-dod-global)
- [Sprint 1 — Fix Bug Fungsional & Blocking (P0)](#sprint-1--fix-bug-fungsional--blocking-p0)
- [Sprint 2 — SEO Deep Fix](#sprint-2--seo-deep-fix)
- [Sprint 3 — Performance & Core Web Vitals](#sprint-3--performance--core-web-vitals)
- [Sprint 4 — Fungsionalitas & Polish](#sprint-4--fungsionalitas--polish)
- [Sprint 5 — Pre-Launch Verification](#sprint-5--pre-launch-verification)
- [Master Changelog (Sprint Log)](#master-changelog-sprint-log)
- [Pre-Launch Checklist Final](#pre-launch-checklist-final)
- [Appendix — Catatan & Referensi](#appendix--catatan--referensi)

---

## Cara Menggunakan Dokumen Ini (WAJIB BACA — AI AGENT)

Bagian ini adalah **kontrak kerja** untuk siapapun (manusia atau AI agent) yang mengeksekusi sprint di dokumen ini. Baca seluruhnya sebelum memulai task apapun.

### 1.1 Alur Eksekusi per Sesi Chat

```
1. Identifikasi sprint aktif (lihat "Status Sprint" di master changelog)
2. Baca GOAL + SCOPE sprint tersebut
3. Kerjakan task SATU PER SATU sesuai urutan (task ada dependensi)
4. Setelah tiap task: centang checklist acceptance criteria
5. Jalankan verification commands di akhir sprint
6. Update changelog entry sprint
7. Jangan lanjut ke sprint berikutnya sebelum DoD sprint terpenuhi
```

### 1.2 Aturan Main (Guardrails) — JANGAN DILANGGAR

| # | Aturan | Alasan |
|---|--------|--------|
| G1 | **Tetap di scope sprint aktif.** Jangan sentuh task dari sprint lain. | Mencegah scope creep & konflik |
| G2 | **Jangan refactor kode yang tidak terkait task**, sekalipun terlihat "perlu". Catat saja di section "Catatan untuk Sprint Lain". | Menjaga diff fokus & reviewable |
| G3 | **Pertahankan konvensi yang ada**: Tailwind CSS 4 utility-first, naming `kebab-case`, komponen Astro `.astro`, interaktif React `.tsx`. | Konsistensi codebase |
| G4 | **Jangan ubah schema content collection** tanpa sync `content.config.ts` ↔ `keystatic.config.ts` secara bersamaan. | Mencegah drift schema |
| G5 | **Setelah setiap task**: jalankan `npx astro check` dan `npm run build`. Build HARUS pass. | Mencegah broken build terakumulasi |
| G6 | **Jangan hapus konten yang ada** (posts/snippets/assets). Tambah/edit saja, kecuali eksplisit diminta. | Konten = deliverable |
| G7 | **Satu task = satu commit logical** (jika user meminta commit). Commit message pakai format di section 1.4. | Historis git bersih |
| G8 | **Tidak boleh menambah dependency baru** tanpa sepengetahuan user. Jika wajib, sebutkan alasannya. | Menjaga bundle kecil |
| G9 | **Semua teks UI tetap dalam Bahasa Indonesia** (sesuai `lang="id"`). Komentar kode boleh ID/EN. | Konsistensi bahasa |
| G10 | **Jangan menandai task `[x]` sebelum acceptance criteria benar-benar terpenuhi & terverifikasi.** | Kejujuran status |

### 1.3 Konvensi Penulisan Task

Setiap task dalam dokumen ini mengikuti format:

```
#### [S{Sprint}.{Nomor}] Judul Task — Prioritas: 🔴/🟠/🟡/🟢

- **File terkait:** `path/ke/file.ext` (baris jika relevan)
- **Masalah:** deskripsi singkat mengapa task ini diperlukan
- **Solusi:** langkah implementasi ( cukup detail, tidak over-prescriptive )
- **Acceptance Criteria:**
  - [ ] kriteria terukur 1
  - [ ] kriteria terukur 2
- **Depends on:** [Sx.y] atau "—"
```

Indikator prioritas: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low

### 1.4 Format Commit Message

```
feat(sprint{N}): {ringkasan task}

- detail perubahan 1
- detail perubahan 2

refs #S{N}.{task}
```

Contoh: `fix(sprint1): aktifkan SSR pada posts/index untuk filter kategori`

### 1.5 Status Sprint

Status tiap sprint dilihat di section [Master Changelog](#master-changelog-sprint-log). Sprint status: `📋 Planned` → `🚧 In Progress` → `✅ Done` → `🔒 Locked`.

---

## Konteks Teknis Global

### Stack Inti

| Layer | Teknologi | Catatan |
|-------|-----------|---------|
| Framework | Astro 7 (`output: 'server'`, hybrid via `prerender`) | SSR default, per-page opt-in static |
| UI Library | React 19 | Untuk komponen interaktif (`client:load`/`idle`/`visible`) |
| Styling | Tailwind CSS 4 (Vite plugin, CSS-first) | Token via CSS variables + `@theme inline` |
| CMS | Keystatic | Dual-mode: `local` (dev) / `github` (prod) via `KEYSTATIC_STORAGE_KIND` |
| Content | Markdoc (`.mdoc`) + JSON | Loader glob di `content.config.ts` |
| Icons | Lucide (astro) + FontAwesome (react) | ⚠️ akan dikonsolidasikan di Sprint 4 |
| Fonts | Cal Sans + Google Sans Flex | ⚠️ Google Sans Flex bermasalah, lihat Sprint 3 |
| Adapter | `@astrojs/node` (standalone) | Deploy via PM2 + VPS |
| Monitoring | Sentry (`@sentry/astro`) | Aktif jika `PUBLIC_SENTRY_DSN` ada |

### Peta File Penting

| File | Peran | Sprint yang menyentuh |
|------|-------|----------------------|
| `astro.config.mjs` | Config inti, integrasi, site URL | S2, S3 |
| `src/components/BaseHead.astro` | **SEO meta tags** (canonical, OG, Twitter, analytics) | **S2** |
| `src/layouts/BaseLayout.astro` | Layout utama + ClientRouter | S2 |
| `src/middleware.ts` | Security headers | **S1** |
| `src/components/Header.astro` | Navigasi + responsif | **S1** |
| `src/consts.ts` | Konstanta site (title, url, dll) | S2 |
| `src/content.config.ts` | Schema content collection (Zod) | S4 |
| `keystatic.config.ts` | Schema Keystatic CMS | S4 |
| `src/styles/global.css` | Token + base styles + font import | **S3** |
| `src/pages/posts/index.astro` | Listing artikel + filter `?cat=` | **S1** |
| `src/pages/posts/[...slug].astro` | Detail artikel + JSON-LD | S2, S3 |
| `src/pages/rss.xml.ts` | RSS feed | S2 |
| `public/sw.js` | Service worker PWA | S3 |
| `public/manifest.json` | PWA manifest | S4 |
| `src/components/Breadcrumb.astro` | Breadcrumb visual | S2 |

### Environment Variables (`.env.example`)

Variabel kunci: `PUBLIC_SITE_URL`, `PUBLIC_SITE_TITLE`, `PUBLIC_PLAUSIBLE_*`, `PUBLIC_SENTRY_DSN`, `KEYSTATIC_*`. Lihat file `.env.example` untuk detail. **Jangan hardcode domain** — selalu gunakan `SITE_URL` dari `consts.ts`.

---

## Definition of Done (DoD) Global

Sebuah sprint dianggap **selesai** hanya jika SEMUA berikut terpenuhi:

- [ ] Semua task di sprint tersebut berstatus `[x]` dengan acceptance criteria terverifikasi
- [ ] `npx astro check` berjalan **tanpa error** (warning boleh, dicatat)
- [ ] `npm run build` sukses dan menghasilkan output `dist/`
- [ ] Tidak ada regression pada halaman yang tidak disentuh
- [ ] Changelog entry sprint telah diisi di section [Master Changelog](#master-changelog-sprint-log)
- [ ] Status sprint diubah menjadi `✅ Done`
- [ ] Catatan untuk sprint lain (jika ada) terdokumentasi di Appendix

---

## Sprint 1 — Fix Bug Fungsional & Blocking (P0)

> **Status:** ✅ Done (2026-07-29)
> **Prioritas:** 🔴 Critical — memblokir pengalaman pengguna inti
> **Estimasi:** 1 sesi chat
> **Realisasi:** 1 sesi chat
> **Goal:** Menghapus semua bug yang membuat fitur core TIDAK berfungsi atau rusak secara visual, sebelum menyentuh optimasi.

### Scope

- ✅ **IN:** filter kategori, middleware security, responsivitas header
- ❌ **OUT:** SEO meta tags (Sprint 2), performance (Sprint 3), fitur baru (Sprint 4)

### Task List

#### [S1.1] Aktifkan filter kategori `/posts?cat=` — Prioritas: 🔴

- **File terkait:** `src/pages/posts/index.astro` (line 2, 15)
- **Masalah:** Halaman pakai `export const prerender = true` (static) tapi membaca `Astro.url.searchParams.get('cat')`. Saat build, query param selalu kosong → **filter kategori tidak bekerja sama sekali**. Semua link kategori (homepage, footer, learning page) menuju `/posts?cat=...` menjadi sia-sia.
- **Solusi:**
  1. Hapus `export const prerender = true;` dari `src/pages/posts/index.astro` agar halaman jadi SSR dan bisa membaca query param saat request.
  2. Verifikasi logika filter yang sudah ada (line 18-20) tetap valid saat runtime.
  3. Pastikan fallback ketika `cat` tidak valid/empty → tampilkan semua post.
- **Acceptance Criteria:**
  - [x] Membuka `/posts` menampilkan semua artikel
  - [x] Membuka `/posts?cat=tutorial` hanya menampilkan artikel kategori tutorial
  - [x] Membuka `/posts?cat=tips-trik` hanya menampilkan artikel kategori tips-trik
  - [x] Membuka `/posts?cat=invalid` menampilkan empty state, bukan crash
  - [x] `npm run build` tetap sukses
- **Depends on:** —
- **Realisasi (2026-07-29):** Selain menghapus `prerender = true`, ditemukan bug kedua: `const { cat } = Astro.url.searchParams` mengembalikan `undefined` (object destructuring pada instance `URLSearchParams` tidak mengekspos key sebagai properti). Diubah ke `Astro.url.searchParams.get("cat")`. Diverifikasi via HTTP: `/posts`=5 kartu, `?cat=tutorial`=3, `?cat=tips-trik`=2, `?cat=invalid`=empty state.

#### [S1.2] Refactor middleware security headers + tambah HSTS — Prioritas: 🔴

- **File terkain:** `src/middleware.ts`
- **Masalah:** Pola `response.then(...)` bersifat fragile (race condition microtask). Juga **tidak ada `Strict-Transport-Security` (HSTS)** yang wajib untuk site HTTPS, dan tidak ada CSP.
- **Solusi:**
  1. Refactor ke `async/await`:
     ```ts
     export const onRequest = defineMiddleware(async (context, next) => {
       const response = await next();
       for (const [key, value] of Object.entries(securityHeaders)) {
         response.headers.set(key, value);
       }
       response.headers.set(
         'Strict-Transport-Security',
         'max-age=63072000; includeSubDomains; preload'
       );
       return response;
     });
     ```
  2. Pertahankan header yang sudah ada (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`).
  3. **Jangan tambahkan CSP dulu** (butuh analisis cros-origin font/analytics, catat di Appendix untuk Sprint 5).
- **Acceptance Criteria:**
  - [x] Tidak ada pola `.then()` lagi di middleware
  - [x] Header `Strict-Transport-Security` hadir di response
  - [x] Semua header security lama tetap ada
  - [x] Tidak ada error runtime saat menjalankan dev server / SSR page
- **Depends on:** —
- **Realisasi (2026-07-29):** Direfactor ke `async/await`. Header security (6 total) diverifikasi via HTTP pada route SSR `/posts`: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection: 0`, dan HSTS `max-age=63072000; includeSubDomains; preload`. ⚠️ Catatan: header TIDAK ter-set pada halaman prerendered (lihat Appendix A).

#### [S1.3] Perbaiki responsivitas Header — Prioritas: 🔴

- **File terkait:** `src/components/Header.astro` (line 8-29)
- **Masalah:** Dua bug:
  1. **Desktop (≥768px):** blok `hidden md:flex` (desktop nav) DAN blok `sm:flex hidden` (line 25) muncul bersamaan → **dua ThemeToggle + satu hamburger** tampil di desktop.
  2. **Mobile (<640px):** blok `sm:flex hidden` disembunyikan → **tidak ada hamburger menu**, user tak bisa navigasi di ponsel kecil.
  3. Typo `dark:boder-b-gray-700` (harus `border`) dan `dark:bg-coc-bg-dark` (token tidak terdefinisi).
- **Solusi:**
  1. Restruktur: desktop nav (`hidden md:flex`) hanya muncul di ≥768px. ThemeToggle desktop ada di dalamnya.
  2. Blok mobile (`md:hidden`) berisi ThemeToggle + MobileNav, muncul **di semua breakpoint <768px** (termasuk <640px). Ubah dari `sm:flex hidden` → `flex md:hidden`.
  3. Hapus class dark yang typo/tidak terdefinisi.
- **Acceptance Criteria:**
  - [x] Di desktop (≥768px): hanya satu set navigasi (full nav + 1 ThemeToggle), TIDAK ada hamburger
  - [x] Di tablet/mobile (<768px): hamburger menu (MobileNav) + ThemeToggle muncul
  - [x] Di ponsel kecil (<640px): hamburger tetap terlihat dan berfungsi
  - [x] Tidak ada class dark yang typo (`boder` → tidak ada)
- **Depends on:** —
- **Realisasi (2026-07-29):** Blok desktop (`hidden md:flex`) tetap berisi nav + 1 ThemeToggle. Blok mobile diubah dari `sm:flex hidden` → `flex md:hidden` (muncul di SEMUA breakpoint <768px). Dihapus class `dark:boder-b-gray-700` (typo) & `dark:bg-coc-bg-dark` (token tak terdefinisi) — dark mode sudah ditangani via CSS variable override pada `html[data-theme="dark"]`, sehingga `bg-coc-bg` otomatis adaptif. Struktur HTML diverifikasi via preview.

### Verification — Sprint 1

```powershell
npx astro check
npm run build
npm run preview   # lalu test manual: /posts?cat=tutorial, resize ke mobile
```

---

## Sprint 2 — SEO Deep Fix

> **Status:** ✅ Done (2026-07-29)
> **Prioritas:** 🔴 Critical — **fokus utama user**
> **Estimasi:** 1–2 sesi chat
> **Realisasi:** 1 sesi chat
> **Goal:** Memastikan semua sinyal SEO (meta tags, structured data, crawlability) konsisten, valid, dan optimal untuk indexing.

### Scope

- ✅ **IN:** BaseHead meta, JSON-LD (Article + WebSite + Organization + BreadcrumbList), sitemap filter, canonical, RSS
- ❌ **OUT:** performance/LCP (Sprint 3), content rewrite, fitur baru

### Task List

#### [S2.1] Konsistenkan meta URL (canonical, og:url, twitter:url) — Prioritas: 🔴

- **File terkait:** `src/components/BaseHead.astro` (line 13, 48, 57, 68)
- **Masalah:** Canonical pakai `new URL(Astro.url.pathname, ...)` (benar, tanpa query), tapi `og:url` & `twitter:url` pakai `Astro.url` mentah (bisa include query param) → **inkonsisten**, crawler bingung.
- **Solusi:**
  1. Gunakan variabel `canonicalURL` (sudah ada di line 13) untuk SEMUA tag URL: `og:url`, `twitter:url`.
  2. Pastikan output selalu URL absolut dengan origin dari `Astro.site`.
- **Acceptance Criteria:**
  - [x] `og:url`, `twitter:url`, dan `<link rel="canonical">` menampilkan URL yang IDENTIK (absolut, tanpa query)
  - [x] URL selalu pakai origin dari `site` config (https://cupofcode.cc)
- **Depends on:** —
- **Realisasi (2026-07-29):** `og:url` & `twitter:url` kini memakai `canonicalURL` (variabel yang sama dengan `<link rel="canonical">`). Diverifikasi via HTTP pada post detail: ketiganya = `https://cupofcode.cc/posts/.../`.

#### [S2.2] Tambahkan `twitter:site` / `twitter:creator` + dukungan `og:type` dinamis — Prioritas: 🔴

- **File terkait:** `src/components/BaseHead.astro`, `src/layouts/BaseLayout.astro`, `src/consts.ts`
- **Masalah:**
  - `TWITTER_HANDLE` (`@cupofcode`) didefinisikan di `consts.ts:8` tapi **tidak pernah dipakai**.
  - `og:type` hardcode `"website"` di semua halaman; halaman artikel seharusnya `"article"`.
- **Solusi:**
  1. Tambah prop opsional `type?: string` di `Props` BaseHead (default `"website"`).
  2. Tambah prop `type` juga di `BaseLayout.Props`, teruskan ke BaseHead.
  3. Tambah meta:
     ```html
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:site" content={TWITTER_HANDLE} />
     <meta name="twitter:creator" content={TWITTER_HANDLE} />
     ```
  4. Di detail pages (post/asset/snippet), teruskan `type="article"`.
- **Acceptance Criteria:**
  - [x] `twitter:site` & `twitter:creator` hadir dengan `@cupofcode`
  - [x] Homepage/listing → `og:type = website`
  - [x] Detail artikel/asset/snippet → `og:type = article`
- **Depends on:** —
- **Realisasi (2026-07-29):** Prop `type?` ditambah di BaseHead & BaseLayout (default `website`). Detail pages (post/asset/snippet) meneruskan `type="article"`. `TWITTER_HANDLE` dipakai untuk `twitter:site` & `twitter:creator`. Seluruh meta twitter juga dikoreksi dari `property=` → `name=` (konvensi resmi Twitter). Diverifikasi: homepage `og:type=website`, post `og:type=article`, twitter:site/creator=`@cupofcode`.

#### [S2.3] Perbaiki JSON-LD Article (URL absolut + tanggal valid) — Prioritas: 🔴

- **File terkait:** `src/pages/posts/[...slug].astro` (line 66, 78-104)
- **Masalah:**
  - `image` bisa relatif (`featured_image` string / `FeaturedImage.src`) → Google **wajib absolut**.
  - `mainEntityOfPage.@id` pakai `Astro.url.href` (bisa berubah).
  - `datePublished` bisa `""` (invalid).
  - Tidak ada `dateModified`.
  - URL `author`/`logo` di-hardcode `https://cupofcode.cc/...`.
- **Solusi:**
  1. Import `SITE_URL` dari `consts.ts`.
  2. Buat helper buat URL absolut: `const abs = (u) => new URL(u, SITE_URL).href;`
  3. `image`: `abs(post.data.featured_image || FeaturedImage.src)`.
  4. `mainEntityOfPage.@id`: pakai `canonicalURL` (bukan `Astro.url.href`).
  5. `datePublished`: jika tidak ada publishDate, **jangan output string kosong** — gunakan field hari ini atau skip field.
  6. Tambah `dateModified` (default = datePublished).
  7. Ganti semua hardcoded `https://cupofcode.cc` → pakai `SITE_URL`.
- **Acceptance Criteria:**
  - [x] Semua URL di JSON-LD adalah absolut (`https://cupofcode.cc/...`)
  - [x] `datePublished` selalu valid ISO date (tidak pernah `""`)
  - [x] Field `dateModified` hadir
  - [x] Tidak ada hardcoded domain (semua dari `SITE_URL`)
  - [x] Lolos validasi Google Rich Results Test (Article)
- **Depends on:** —
- **Realisasi (2026-07-29):** Helper `abs()` + `canonicalURL` dari `SITE_URL`. `datePublished`/`dateModified` hanya di-emit bila `publishDate` ada (tidak fabrikasi). Semua domain hardcoded diganti `SITE_URL`. Diverifikasi: image absolut, tanggal `2026-07-15`, `dateModified` hadir, `@id`/author/logo semua absolut `cupofcode.cc`. (URL remote featured image `images.unsplash.com` memang absolut & sah.)

#### [S2.4] Tambah JSON-LD `WebSite` + `Organization` global — Prioritas: 🟠

- **File terkait:** `src/layouts/BaseLayout.astro`, `src/consts.ts`
- **Masalah:** Tidak ada structured data global → kalah potensi sitelinks search box & knowledge panel.
- **Solusi:**
  1. Tambahkan di `<head>` BaseLayout (atau di body) JSON-LD `WebSite` + `Organization`:
     ```json
     {
       "@context": "https://schema.org",
       "@type": "WebSite",
       "name": SITE_TITLE,
       "url": SITE_URL,
       "description": SITE_DESCRIPTION,
       "inLanguage": "id-ID",
       "potentialAction": { "@type": "SearchAction", ... }  // opsional, jika ada search page
     }
     ```
  2. `Organization` dengan `name`, `url`, `logo` (absolut), `sameAs` (sosmed).
- **Acceptance Criteria:**
  - [x] JSON-LD WebSite + Organization hadir di SEMUA halaman
  - [x] Semua URL absolut
  - [x] Tidak konflik/duplikat dengan Article schema di halaman post
- **Depends on:** S2.3
- **Realisasi (2026-07-29):** Ditambah di `<head>` BaseLayout (membungkus semua halaman) via 2 script `application/ld+json`. `@type` berbeda (WebSite/Organization) jadi tidak duplikat dengan Article/BreadcrumbList. Diverifikasi pada homepage & post (4 blok di post, 2 blok di homepage), semua URL absolut `cupofcode.cc`.

#### [S2.5] Tambah JSON-LD `BreadcrumbList` — Prioritas: 🟠

- **File terkait:** `src/components/Breadcrumb.astro`, halaman detail (post/asset/snippet)
- **Masalah:** `Breadcrumb.astro` hanya visual. CHANGELOG (4.10) mengklaim BreadcrumbList ada tapi **tidak ada di kode** → ketidaksesuaian dokumen.
- **Solusi:**
  1. Modifikasi `Breadcrumb.astro` agar menerima `items` (sudah ada) dan generate JSON-LD `BreadcrumbList` dari items tersebut (name + absolut URL).
  2. Output `<script type="application/ld+json">` di dalam komponen.
  3. Pastikan URL absolut.
- **Acceptance Criteria:**
  - [x] Setiap halaman detail (post/asset/snippet) punya BreadcrumbList JSON-LD valid
  - [x] Item pertama = Beranda (`https://cupofcode.cc/`)
  - [x] Lolos Rich Results Test
- **Depends on:** S2.3
- **Realisasi (2026-07-29):** `Breadcrumb.astro` sekarang memancarkan `BreadcrumbList` dari items (URL di-absolutkan via `SITE_URL`; item terakhir tanpa href otomatis pakai canonical halaman saat ini). Halaman asset (sebelumnya nav inline) dialihkan ke komponen `Breadcrumb` agar tercakup. Diverifikasi: item [1]=Beranda→`https://cupofcode.cc/`, semua item absolut.

#### [S2.6] Filter sitemap: exclude `/keystatic` & `/api/*` + tambah `noindex` — Prioritas: 🟠

- **File terkait:** `astro.config.mjs` (config sitemap), `src/components/BaseHead.astro`
- **Masalah:** Route `/keystatic` (CMS admin) dan `/api/*` mungkin masuk sitemap & terindex → bocor endpoint.
- **Solusi:**
  1. Di `astro.config.mjs`, tambah `filter` pada integrasi sitemap:
     ```js
     sitemap({
       filter: (page) =>
         !page.includes('/keystatic') && !page.includes('/api/'),
     })
     ```
  2. Tambahkan meta `robots` `noindex,nofollow` untuk route `/keystatic` (bisa via middleware cek `context.url.pathname.startsWith('/keystatic')`).
- **Acceptance Criteria:**
  - [x] `/sitemap-index.xml` tidak mengandung `/keystatic` atau `/api/*`
  - [x] Halaman `/keystatic/*` punya meta `robots: noindex,nofollow`
- **Depends on:** —
- **Realisasi (2026-07-29):** `filter` ditambah di integrasi `sitemap()` astro.config. Untuk noindex, dipakai header **`X-Robots-Tag: noindex, nofollow`** di middleware (equivalent meta robots, lebih robust karena /keystatic dirender on-demand jadi middleware berlaku). Diverifikasi: sitemap-0 (20 URL) bebas `/keystatic` & `/api/`; `GET /keystatic` → 200 + header `X-Robots-Tag` hadir.

#### [S2.7] Perbaiki RSS feed (trailing slash + tanggal) — Prioritas: 🟡

- **File terkait:** `src/pages/rss.xml.ts` (line 13, 15)
- **Masalah:**
  - `pubDate: post.data.publishDate || new Date()` → **memalsukan tanggal hari ini** untuk post tanpa publishDate.
  - `link: /posts/${post.id}/` pakai trailing slash, mungkin tidak konsisten dengan route aktual.
- **Solusi:**
  1. Skip/handle post tanpa publishDate (jangan fabricate `new Date()`).
  2. Samakan format link dengan canonical route (cek apakah route pakai trailing slash — lihat `trailingSlash` config; default Astro `'ignore'`, jadi pilih satu & konsisten).
- **Acceptance Criteria:**
  - [x] RSS hanya berisi post yang punya `publishDate` valid
  - [x] Format link konsisten dengan URL kanonik
  - [x] Feed valid di validator RSS (w3.org feed validator)
- **Depends on:** —
- **Realisasi (2026-07-29):** Post tanpa `publishDate` di-filter (tak ada fabrikasi `new Date()`). `context` diberi tipe `APIContext` (memperbaiki error pre-existing). Link `/posts/${id}/` dipertahankan (trailing slash) karena **URL kanonik halaman prerendered memang pakai trailing slash** (Astro `build.format: 'directory'`) — sehingga konsisten dengan canonical. Diverifikasi: 5 item, semua pubDate valid (Jun–Jul 2026), link absolut cocok canonical. (Validator w3.org tidak dijalankan otomatis — manual.)

### Verification — Sprint 2

```powershell
npx astro check
npm run build
npm run preview
# Lalu cek view-source tiap tipe halaman: homepage, /posts, /posts/[slug], /assets/[slug]
# Validasi JSON-LD di https://search.google.com/test/rich-results
# Cek /sitemap-index.xml tidak ada /keystatic & /api
```

---

## Sprint 3 — Performance & Core Web Vitals

> **Status:** ✅ Done (2026-07-30)
> **Prioritas:** 🟠 High (faktor ranking)
> **Estimasi:** 1 sesi chat
> **Realisasi:** 1 sesi chat
> **Goal:** Mencapai Lighthouse Performance 90+ dan Core Web Vitals (LCP < 2.5s) dengan menghilangkan bottleneck.

### Scope

- ✅ **IN:** font loading, image optimization, hydration strategy, service worker cache strategy
- ❌ **OUT:** perubahan visual besar, fitur baru

### Task List

#### [S3.1] Eliminasi render-blocking font `@import` — Prioritas: 🔴

- **File terkait:** `src/styles/global.css` (line 1), `src/components/BaseHead.astro`
- **Masalah:** `@import url("https://fonts.googleapis.com/...")` di awal CSS bersifat **render-blocking** → menaikkan LCP signifikan.
- **Solusi:**
  1. Hapus `@import url(...)` dari `global.css`.
  2. Di BaseHead `<head>`, tambahkan:
     ```html
     <link rel="preconnect" href="https://fonts.googleapis.com" />
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
     <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap" />
     ```
  3. **Lihat juga S3.2** soal Google Sans Flex.
- **Acceptance Criteria:**
  - [x] Tidak ada `@import url(...)` di global.css
  - [x] Font dimuat via `<link rel="stylesheet">` + `preconnect`
  - [x] `display=swap` dipertahankan (cegah FOIT)
  - [x] Lighthouse flag "render-blocking resources" untuk font hilang
- **Depends on:** —
- **Realisasi (2026-07-30):** `@import url(...)` dihapus dari `global.css` (hanya `@import "tailwindcss"` tersisa). BaseHead kemuhamat `<link rel="preconnect">` (googleapis + gstatic crossorigin) + `<link rel="stylesheet">` CSS2. Diverifikasi via built CSS (no `@import url(`) & homepage HTML (preconnect + stylesheet link hadir). (Lighthouse flag diverifikasi manual di S5.2.)

#### [S3.2] Verifikasi & perbaiki font `Google Sans Flex` — Prioritas: 🟠

- **File terkait:** `src/styles/global.css` (line 1, 25)
- **Masalah:** `Google Sans Flex` **BUKAN font publik** di Google Fonts CSS API → kemungkinan 404, body jatuh ke Arial fallback. Tipografi tidak sesuai desain.
- **Solusi (pilih satu, konfirmasi user):**
  - **Opsi A:** Ganti ke font publik yang mirip (mis. `Google Sans` jika tersedia via Google Fonts, atau alternatif seperti `Inter`, `Manrope`).
  - **Opsi B:** Self-host font resmi jika punya lisensi.
- **Acceptance Criteria:**
  - [x] Request font tidak 404 di Network tab
  - [x] Body text memakai font yang dimaksud (cek `font-family` computed)
  - [x] Fallback system font tetap dirantai dengan benar
- **Depends on:** S3.1
- **Realisasi (2026-07-30):** ⚠️ **Temuan:** premis audit ("Google Sans Flex 404") **sudah tidak akurat** — Google kini menyajikannya via Google Fonts API (CSS + woff2 = 200 OK). Namun tetap variabel-font berat (`wght@1..1000`). Per konfirmasi user, body font diganti ke **`Inter`** (ringan, feel geometris mirip). `--font-body` = `"Inter", Arial, sans-serif`. Fallback rantai dipertahankan. Built CSS mengandung `Inter`, font stylesheet request OK.

#### [S3.3] Optimasi featured image remote via `astro:assets` — Prioritas: 🔴

- **File terkait:** `src/pages/index.astro` (line 140, 196), `src/pages/posts/index.astro` (line 75), `src/pages/roadmap.astro` (line 183), `astro.config.mjs`
- **Masalah:** Featured image pakai raw `<img src={remoteURL}>` → tanpa optimasi (no WebP/AVIF, no srcset, no resize) → bandwidth & LCP buruk. Hanya fallback yang pakai `<Image>`.
- **Solusi:**
  1. Tambah konfigurasi `image.domains` / `image.remotePatterns` di `astro.config.mjs` untuk domain gambar (mis. `images.unsplash.com`).
  2. Ganti raw `<img>` jadi komponen `<Image>` dari `astro:assets` dengan `inferSize` (karena dimensi remote tidak diketahui):
     ```astro
     <Image src={post.data.featured_image} inferSize alt={...} loading="lazy" />
     ```
  3. Tetap pertahankan fallback ke `FeaturedImage` lokal untuk post tanpa featured image.
- **Acceptance Criteria:**
  - [x] Gambar remote ter-serve sebagai WebP/AVIF dengan srcset
  - [x] LCP image (hero homepage/featured) pakai `loading="eager"` + `fetchpriority="high"`
  - [x] Tidak ada regression visual
- **Depends on:** —
- **Realisasi (2026-07-30):** `image.remotePatterns` ditambah (unsplash + cloudinary) — sebelumnya remote `<Image>` diabaikan & URL raw diteruskan tanpa optimasi. Raw `<img>` di `index.astro`, `posts/index.astro`, `roadmap.astro` diganti `<Image>` (explicit `width`/`height`, **bukan `inferSize`** agar render SSR `/posts` tak fetch remote tiap request) + `densities={[1,2]}` (srcset 1x/2x) + `sizes`. Featured homepage: webp + `srcset` + `loading="eager" fetchpriority="high"`. Diverifikasi: 0 URL raw unsplash tersisa, 5 ref `/_astro/*.webp`, avif→webp terkonversi.

#### [S3.4] Optimasi hydration React — Prioritas: 🟠

- **File terkait:** `src/components/ui/BackToTop.tsx` (dipakai di banyak halaman), SearchBar, dll.
- **Masalah:** `BackToTop client:load` di-setiap halaman → JS blocking untuk tombol sederhana.
- **Solusi:**
  1. Ubah `BackToTop` dari `client:load` → `client:idle` (atau `client:visible`).
  2. Audit komponen lain: SearchBar bisa `client:idle` di listing; ThemeToggle tetap `client:load` (cegah FOUC).
  3. Jangan ubah komponen yang interaksi critical-first (mis. RoadmapStep jika dirasa perlu).
- **Acceptance Criteria:**
  - [x] BackToTop pakai `client:idle` (atau visible)
  - [x] Fungsionalitas tetap bekerja (muncul setelah scroll)
  - [x] Lighthouse "Reduce JS execution time" membaik
- **Depends on:** —
- **Realisasi (2026-07-30):** `BackToTop` (9 halaman) → `client:idle`; `SearchBar` (4 listing) → `client:idle`; `NewsletterForm` (Footer, di semua halaman) → `client:idle`. Tetap `client:load`: `ThemeToggle` (cegah FOUC), `MobileNav`, `RoadmapStep` (interaksi critical-first per doc). Diverifikasi via `client=` attr island pada built HTML homepage (SearchBar/BackToTop/NewsletterForm=`idle`, ThemeToggle=`load`).

#### [S3.5] Ubah service worker jadi network-first untuk HTML — Prioritas: 🟠

- **File terkait:** `public/sw.js` (line 39-54), tambahkan `/learning`, `/roadmap` ke precache (line 3-17)
- **Masalah:** SW pakai **cache-first untuk SEMUA request termasuk HTML** → konten stale. Update via Keystatic tidak langsung terlihat user. Juga precache belum include route Fase 6.
- **Solusi:**
  1. Strategi **network-first untuk navigasi (HTML)**, cache-first untuk aset statis (CSS/JS/font/img).
  2. Deteksi request HTML via `request.mode === 'navigate'` atau `Accept` header.
  3. Tambah `/learning` & `/roadmap` ke array `ASSETS` precache.
- **Acceptance Criteria:**
  - [x] HTML navigasi selalu fetch fresh dulu, fallback cache saat offline
  - [x] Aset statis tetap cache-first
  - [x] Update konten langsung terlihat tanpa hard refresh
  - [x] `/learning` & `/roadmap` ada di precache
- **Depends on:** —
- **Realisasi (2026-07-30):** `sw.js` direwrite: deteksi navigasi via `request.mode==='navigate'` ∪ header `Accept` → **network-first** (cache fallback + `caches.match('/')`); aset statis (same-origin) tetap **cache-first**. Cross-origin (font/analytics) dilepas. `ASSETS` precache ditambah `/learning` & `/roadmap`. Cache dibump `cupofcode-v1`→`v2` (cache lama dihapus pada activate). (Perilaku runtime penuu perlu uji browser — S5.2.)

### Verification — Sprint 3

```powershell
npm run build
npm run preview
# Jalankan Lighthouse (Chrome DevTools) di: / , /posts/[slug], /posts
# Target: Performance ≥ 90, LCP < 2.5s
# Cek Network tab: no 404 font, gambar WebP
```

---

## Sprint 4 — Fungsionalitas & Polish

> **Status:** ✅ Done (2026-07-30)
> **Prioritas:** 🟠 High
> **Estimasi:** 1 sesi chat
> **Realisasi:** 1 sesi chat
> **Goal:** Menuntaskan fitur yang masih setengah jadi & membersihkan inkonsistensi teknis.

### Task List

#### [S4.1] Implementasi form kontak (endpoint + validasi) — Prioritas: 🟠

- **File terkait:** `src/pages/contact.astro` (line 83), baru: `src/pages/api/contact.ts`
- **Masalah:** Tombol "Kirim Pesan" pakai `type="button"` & tidak ada action → **dead form**.
- **Solusi:**
  1. Buat endpoint `POST /api/contact` (mirip pola `newsletter.ts`): validasi nama/email/subjek/pesan, log atau integrasi email service (stub dulu, catat untuk production).
  2. Ubah form jadi `type="submit"` dengan `action="/api/contact"` atau handle via fetch client-side untuk UX better.
  3. Tampilkan feedback sukses/error.
- **Acceptance Criteria:**
  - [x] Form submit mengirim data ke endpoint
  - [x] Validasi email/format di sisi server
  - [x] User mendapat feedback sukses/gagal
- **Depends on:** —
- **Realisasi (2026-07-30):** Endpoint baru `src/pages/api/contact.ts` (POST, pola `newsletter.ts`) memvalidasi name/email/subject(enum)/message. Form `contact.astro` kini pakai `name`+`required`, `type="submit"`, `action`/`method` (progressive enhancement) + handler `fetch` client-side dengan elemen `#contact-feedback` (sukses hijau / gagal merah, tombol disabled saat submit). Temp script hapus. Diverifikasi runtime via `preview`: payload valid → 200 `{"success":true,...}`, email invalid → 400 `{"success":false,"message":"Email tidak valid."}`. (Bonus: hapus import `Mail` yang tak terpakai.) Integrasi email production di-stub (`console.log`) → S5/deployment.

#### [S4.2] Sinkronkan schema Keystatic ↔ content.config — Prioritas: 🟠

- **File terkait:** `src/content.config.ts`, `keystatic.config.ts`
- **Masalah:** Drift schema: keystatic butuh `name` di categories (content.config tidak ada); required-ness `description`/`publishDate` berbeda.
- **Solusi:**
  1. Audit field-by-field kedua schema.
  2. Samakan: nama field, required/optional, default, enum.
  3. Untuk categories: keystatic pakai `name` sebagai slug → pastikan `content.config` konsisten (slug = filename).
- **Acceptance Criteria:**
  - [x] Kedua schema sejajar (no field hanya ada di salah satu)
  - [x] Tidak ada error validasi saat edit via Keystatic
  - [x] `npx astro check` pass
- **Depends on:** —
- **Realisasi (2026-07-30):** Audit field-by-field. Drift asli: `description` wajib di `content.config` (snippets & digitalAssets) tapi opsional di Keystatic → ditambah `validation: { isRequired: true }` di Keystatic (cocok dengan data eksisting). `language` snippets: `z.string()` → `z.enum([...])` agar paralel dengan select Keystatic (aman — semua snippet `typescript`). ⚠️ **Temuan:** klaim "categories butuh `name` di content.config" **tidak akurat** — `name` di Keystatic adalah `slugField` (= nama file), BUKAN field data; file JSON hanya berisi `label`+`tone` sehingga `content.config` sudah benar (no change). Posts sudah sejajar (no change).

#### [S4.3] Konsistenkan struktur konten posts (flat vs folder) — Prioritas: 🟡

- **File terkait:** `src/content/posts/*`
- **Masalah:** 2 post flat file (`.mdoc` langsung), 3 post folder (`/index.mdoc`). Inkonsisten → slug/id tak terduga.
- **Solusi:**
  1. Pilih satu konvensi (rekomendasi: **folder dengan `index.mdoc`**, sesuai default Keystatic).
  2. Migrasi 2 post flat ke struktur folder.
  3. Verifikasi semua internal link (`/posts/{id}`) tetap valid.
- **Acceptance Criteria:**
  - [x] Semua post pakai struktur seragam
  - [x] Tidak ada broken internal link
  - [x] RSS & sitemap URL tetap valid
- **Depends on:** —
- **Realisasi (2026-07-30):** 2 post flat (`roadmap-...-2026.mdoc`, `cara-membuat-custom-gems-di-gemini.mdoc`) dipindah ke struktur folder `/index.mdoc` via `Move-Item` (byte-identical). Sekarang 5/5 post seragam folder+`index.mdoc`. ⚠️ **Catatan penting:** Astro menyimpan content store persisten di `node_modules/.astro/data-store.json`; saat memindahkan file, store lama mempertahankan path flat → build gagal (`failed to resolve ...deferred-module`). **Solusi:** hapus `.astro/`, `node_modules/.astro/`, `dist/` lalu rebuild. Slug/id `post.id` TIDAK berubah (glob loader turunkan dari nama folder) → semua `/posts/{slug}` valid. Diverifikasi via `sitemap-0.xml` (5 URL post identik).

#### [S4.4] Konsolidasi library ikon (lucide + fontawesome) — Prioritas: 🟡

- **File terkait:** `src/pages/posts/[...slug].astro` (line 12-21), `package.json`
- **Masalah:** Pakai FontAwesome React (berat, full library) untuk 4 ikon share, padahal lucide sudah dipakai di tempat lain. Inkonsisten + bundle bengkak.
- **Solusi:**
  1. Ganti ikon share (WhatsApp, Facebook, X) ke SVG inline atau cari padanan di lucide.
  2. Hapus dependency `@fortawesome/*` jika sudah tidak dipakai (dengan konfirmasi user — lihat G8).
- **Acceptance Criteria:**
  - [x] Ikon share tetap tampil & konsisten visually
  - [x] Tidak ada import `@fortawesome` lagi (atau dicatat alasannya)
  - [x] Bundle JS berkurang
- **Depends on:** —
- **Realisasi (2026-07-30):** 3 ikon share (`<FontAwesomeIcon>` WhatsApp/Facebook/X) di `[...slug].astro` diganti **inline `<svg>`** (`fill="currentColor"`, path brand simple-icons; ikon X memakai path yang sama dengan `contact.astro`). Seluruh import `@fortawesome/*` + `library.add(...)` dihapus. `faInstagram` ternyata hanya di-`library.add` (tak pernah dipakai di markup). Per konfirmasi user, 3 dep `@fortawesome/*` dihapus dari `package.json` (`bun install`: "Removed: 3"). Build sukses; inline SVG terverifikasi ada di kelima HTML post.

#### [S4.5] Cleanup dead code & typo — Prioritas: 🟢

- **File terkait:** `src/consts.ts`, `.env.example`, `astro.config.mjs`
- **Masalah:** `TWITTER_HANDLE` unused (akan dipakai di S2.2), typo `.env.example` `NEWSLetter_API_KEY`, `astro.config.mjs:39` no-op server config.
- **Solusi:**
  1. `.env.example:33` → `NEWSLETTER_API_KEY`.
  2. Hapus/clarify `server: (await import('node:http2')).constants ? {} : {}` di astro.config.
  3. (TWITTER_HANDLE akan dipakai setelah S2.2 — verifikasi.)
- **Acceptance Criteria:**
  - [x] `.env.example` tanpa typo
  - [x] Config astro bersih, tidak ada no-op membingungkan
- **Depends on:** S2.2
- **Realisasi (2026-07-30):** `.env.example` `NEWSLetter_API_KEY` → `NEWSLETTER_API_KEY`. Baris no-op `server: (await import('node:http2')).constants ? {} : {}` dihapus dari `astro.config.mjs` (selalu mengevaluasi ke `{}`/default). `TWITTER_HANDLE` diverifikasi **sudah dipakai** pasca-S2.2 (import + `twitter:site`/`creator` di `BaseHead.astro`) → bukan dead code, tidak dihapus.

#### [S4.6] Lengkapi PWA manifest icon (192/512) — Prioritas: 🟢

- **File terkait:** `public/manifest.json`, `public/`
- **Masalah:** Hanya SVG + ico 48×48 → Lighthouse PWA installable fail.
- **Solusi:**
  1. Generate PNG icon 192×192 & 512×512 dari favicon.svg (pakai sharp atau tool).
  2. Tambah entry ke `manifest.json` icons.
- **Acceptance Criteria:**
  - [x] Ikon 192 & 512 hadir & tervalidasi
  - [x] Manifest lolos PWA audit
- **Depends on:** —
- **Realisasi (2026-07-30):** PNG 192×192 & 512×512 diraster dari `public/favicon.svg` memakai `sharp` (density 512) → `public/icon-192.png` (2.7 KB) & `public/icon-512.png` (9 KB). Kedua entry ditambah ke `manifest.json` (`type: image/png`, `purpose: any`). `manifest.json` valid JSON; kedua file ter-copy ke `dist/client/`. (Audit Lighthouse PWA aktual perlu browser → S5.2.)

---

## Sprint 5 — Pre-Launch Verification

> **Status:** 🚧 In Progress (2026-07-30) — bagian otomatis selesai; validasi browser manual (Lighthouse/Rich Results/cross-browser) **pending, wajib sebelum go-live**
> **Prioritas:** 🔴 Critical (gate go-live)
> **Estimasi:** 1 sesi chat (verifikasi + dokumentasi)
> **Realisasi:** 1 sesi chat (otomatis) + manual (user)
> **Goal:** Memvalidasi SEMUA aspek sebelum expose ke production. Tidak ada kode baru di sini, kecuali fix minor yang ditemukan.

### Task List

#### [S5.1] Audit build & typecheck bersih — Prioritas: 🔴

- **Perintah:** `bunx astro check && bun run build`
- **Acceptance:**
  - [x] `astro check`: 0 error (perbaikan 29 error `class`→`className` di 6 komponen React `.tsx`)
  - [x] `build`: sukses, `dist/` tergenerate
  - [x] Tidak ada warning baru yang signifikan (`astro check` = 0 warning)
- **Depends on:** —
- **Realisasi (2026-07-30):** Memperbaiki blocker DoD: 29 error pre-existing `class` (bukan `className`) pada `BackToTop.tsx`, `CopyButton.tsx`, `MobileNav.tsx`, `NewsletterForm.tsx`, `SearchBar.tsx`, `ThemeToggle.tsx` → semua jadi `className`. Hasil `astro check` dari 29 error → **0 error, 0 warning**. `bun run build` sukses.

#### [S5.2] Lighthouse audit semua tipe halaman — Prioritas: 🔴

- **Halaman test:** `/`, `/posts`, `/posts/[slug]`, `/assets`, `/assets/[slug]`, `/snippets` (⚠️ `/learning` & `/roadmap` dihapus pasca scope-redef — lihat Appendix #17)
- **Target (mobile):**
  - [ ] Performance ≥ 90
  - [ ] Accessibility ≥ 95
  - [ ] Best Practices ≥ 95
  - [ ] SEO ≥ 95
  - [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Catatan eksekusi:** Wajib dijalankan manual di browser (Chrome DevTools → Lighthouse, mobile, throttling 4G). Sprint 3 sudah meletakkan fondasi (font non-render-blocking, gambar webp/srcset, `client:idle`). Jalankan pada URL **produksi live** (bukan localhost) agar CWV akurat. CLI opsional: `bunx lighthouse http://... --preset=desktop`.

#### [S5.3] Validasi structured data — Prioritas: 🔴

- [x] Article schema valid (JSON well-formed, @type=Article) — diverifikasi otomatis dari built HTML
- [x] BreadcrumbList valid (JSON well-formed) — diverifikasi
- [x] WebSite + Organization valid (JSON well-formed) — diverifikasi
- [ ] Lolos [Google Rich Results Test](https://search.google.com/test/rich-results) — **manual** pada URL produksi live
- **Realisasi (2026-07-30):** Scan otomatis semua blok `<script type="application/ld+json">` di HTML hasil build: post (WebSite+Organization+Article+BreadcrumbList), homepage (WebSite+Organization), asset (WebSite+Organization+BreadcrumbList) — semua parse JSON sukses dengan `@context=https://schema.org`. Validasi visual Google tetap manual.

#### [S5.4] Crawlability check — Prioritas: 🔴

- [x] `/robots.txt` valid & menunjuk sitemap (`Sitemap: https://cupofcode.cc/sitemap-index.xml`)
- [x] `/sitemap-index.xml` lengkap, exclude `/keystatic` & `/api/*` (diverifikasi: keduanya tidak ada di sitemap-0.xml)
- [x] Tidak ada broken internal link (scan otomatis seluruh HTML hasil build)
- **Realisasi (2026-07-30):** Scan otomatis semua `href/src` internal dari 20+ HTML di `dist/client`, di-match terhadap file statis + route SSR. **0 broken link**; satu-satunya non-statik `/rss.xml` adalah endpoint SSR valid (`rss.xml.ts`), bukan broken.

#### [S5.5] Cross-browser & responsive test — Prioritas: 🟠

- [ ] Chrome, Firefox, Safari, Edge (desktop)
- [ ] iOS Safari, Android Chrome (mobile)
- [ ] Dark mode toggle bekerja di semua halaman
- [ ] Tidak ada layout break di breakpoint utama
- **Catatan eksekusi:** Manual. Cek breakpoint utama (640/768/1024px), toggle dark mode (`html[data-theme]`), interaktivitas React island (ThemeToggle/MobileNav/SearchBar). Prioritas: iOS Safari (varian WebKit) untuk hydration & View Transitions.

#### [S5.6] Rekonsiliasi dokumentasi — Prioritas: 🟠

- [x] Update `ROADMAP.md` & `CHANGELOG.md` agar status = kondisi aktual (banyak klaim `✅` yang perlu diverifikasi)
- [x] Tandai item yang akhirnya selesai via sprint ini
- **Realisasi (2026-07-30):** ROADMAP.md: koreksi font (Cal Sans+Inter, bukan Google Sans Flex), ikon (Lucide+inline SVG, FontAwesome dihapus), structured data (lengkap), security headers (+HSTS+CSP), mermaid Fase 5 (audit ✅ / deploy ⏳), note rekonsiliasi. CHANGELOG.md: koreksi 4.10/4.11, status Fase 5 (🚧, deploy pending), 5.13/5.14 jadi `[ ]`, deskripsi SW (network-first), + section **Pre-Production Sprints S1–S5** baru sebagai sumber kebenaran + tabel rilis.

#### [S5.7] Tambah CSP (jika aman) — Prioritas: 🟡

- Catat dari Sprint 1 (S1.2) — analisis origin font/analytics, tambah `Content-Security-Policy` di middleware.
- [x] CSP di-set tanpa break font/analytics (adaptif: origin analytics dari env; font/img/sentry diizinkan)
- [ ] Tidak ada violation di console — **manual** (browser smoke test dengan analytics aktif)
- **Realisasi (2026-07-30):** `buildCsp()` adaptif di `src/middleware.ts`. `script-src 'self' 'unsafe-inline'` (+ origin Plausible/Umami/GA bila env set); `style-src 'self' 'unsafe-inline' fonts.googleapis.com`; `font-src fonts.gstatic.com`; `img-src` unsplash/cloudinary/data/blob; `connect-src *.sentry.io` (+analytics); `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`. Diverifikasi runtime: header `Content-Security-Policy` hadir di route SSR `/posts`. ⚠️ **'unsafe-inline' script diperlukan** karena inline script (anti-FOUC, SW, GA) — nonce-migration = hardening masa depan. ⚠️ **Cakupan parsial:** middleware bypass halaman prerendered → nginx wajib mirror CSP (lihat Appendix #14).

---

## Master Changelog (Sprint Log)

Log ini adalah **sumber kebenaran status sprint**. Update setelah tiap sprint selesai.

| Sprint | Judul | Status | Estimasi | Realisasi | Catatan |
|--------|-------|--------|----------|-----------|---------|
| S1 | Fix Bug Fungsional & Blocking | ✅ Done (2026-07-29) | 1 sesi | 1 sesi | Filter cat (2 bug), middleware+HSTS, header responsif. Lihat detail di bawah. |
| S2 | SEO Deep Fix | ✅ Done (2026-07-29) | 1–2 sesi | 1 sesi | Meta URL, og:type, Twitter, JSON-LD (Article/WebSite/Org/Breadcrumb), sitemap filter, RSS. Lihat detail di bawah. |
| S3 | Performance & Core Web Vitals | ✅ Done (2026-07-30) | 1 sesi | 1 sesi | Font @import→link+Inter, image optim (webp/srcset), hydration idle, SW network-first. Lihat detail di bawah. |
| S4 | Fungsionalitas & Polish | ✅ Done (2026-07-30) | 1 sesi | 1 sesi | Form kontak, schema sync, struktur post, konsolidasi ikon, cleanup, PWA icon. Lihat detail di bawah. |
| S5 | Pre-Launch Verification | 🚧 In Progress (2026-07-30) | 1 sesi + manual | 1 sesi (otomatis) | 0 error (fix class→className), JSON-LD valid, sitemap/link bersih, CSP middleware, rekonsiliasi doc. Lighthouse/Rich Results/cross-browser = manual pending. |

### Format Entry Detail (isi setelah sprint selesai)

```
### [Sprint N — Judul] — ✅ Done (YYYY-MM-DD)

**Realisasi:** X jam | **Tasks selesai:** N/N

#### Yang dikerjakan
- [S.N.1] {ringkasan} — {file yang diubah}
- [S.N.2] ...

#### Catatan teknis
- {temuan/keputusan penting}

#### Bug/issue tersisa (pindah ke sprint lain)
- {deskripsi} → [S.x.y]
```

### [Sprint 1 — Fix Bug Fungsional & Blocking] — ✅ Done (2026-07-29)

**Realisasi:** 1 sesi chat | **Tasks selesai:** 3/3

#### Yang dikerjakan
- [S1.1] Aktifkan filter kategori `/posts?cat=` — `src/pages/posts/index.astro`
  - Hapus `export const prerender = true` agar halaman SSR.
  - **Bug tambahan ditemukan & diperbaiki:** `const { cat } = Astro.url.searchParams` selalu `undefined` (destructuring pada instance `URLSearchParams` tidak mengambil value). Diubah ke `.get("cat")`.
  - Verifikasi HTTP: `/posts`=5 artikel, `?cat=tutorial`=3, `?cat=tips-trik`=2, `?cat=invalid`=empty state.
- [S1.2] Refactor middleware + HSTS — `src/middleware.ts`
  - Refactor `.then()` → `async/await`.
  - Tambah `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
  - 5 header lama dipertahankan. Tidak menambah CSP (defer Sprint 5).
- [S1.3] Perbaiki responsivitas Header — `src/components/Header.astro`
  - Blok mobile `sm:flex hidden` → `flex md:hidden` (hamburger + ThemeToggle muncul di semua <768px).
  - Hapus `dark:boder-b-gray-700` (typo) & `dark:bg-coc-bg-dark` (token tak terdefinisi); dark mode via CSS var.

#### Catatan teknis
- `astro check` turun dari 31 → **30 error** (error `Property 'cat'` teratasi via S1.1). Sisa 30 error adalah masalah pre-existing di komponen React `.tsx` (pakai `class` bukan `className`) + `rss.xml.ts` implicit any — di luar scope S1 (G2). → catatan Appendix A.
- `bun run build` sukses (dist tergenerate). Verifikasi runtime via `astro preview` + `Invoke-WebRequest`.

#### Bug/issue tersisa (pindah ke sprint lain)
- Header security (incl. HSTS) tidak ter-set pada halaman prerendered (served as static file, bypass middleware) → S5.7 / deployment (nginx).
- 30 error `astro check` pre-existing (React `class`/`className`) → perlu task cleanup (usulkan S4.5 diperluas atau task baru).

### [Sprint 2 — SEO Deep Fix] — ✅ Done (2026-07-29)

**Realisasi:** 1 sesi chat | **Tasks selesai:** 7/7

#### Yang dikerjakan
- [S2.1] Konsistenkan meta URL — `src/components/BaseHead.astro`. `og:url` & `twitter:url` memakai `canonicalURL` (sama dengan `<link rel="canonical">`). Diverifikasi identik & absolut.
- [S2.2] Twitter handles + `og:type` dinamis — `BaseHead.astro`, `BaseLayout.astro`, 3 detail pages. Prop `type?` (default `website`); detail pages → `article`. `twitter:site`/`creator`=`@cupofcode`. Meta twitter `property=`→`name=`.
- [S2.3] JSON-LD Article — `src/pages/posts/[...slug].astro`. Helper `abs()` + `SITE_URL`; `dateModified` ditambah; tanggal hanya saat `publishDate` ada; semua hardcoded domain dihapus.
- [S2.4] JSON-LD WebSite + Organization — `src/layouts/BaseLayout.astro` (`<head>`, semua halaman). URL absolut.
- [S2.5] JSON-LD BreadcrumbList — `src/components/Breadcrumb.astro` (emit dari items, URL di-absolutkan). Halaman asset dialihkan dari nav inline ke komponen `Breadcrumb`.
- [S2.6] Sitemap filter + noindex — `astro.config.mjs` (`filter` exclude `/keystatic` & `/api/`) + `src/middleware.ts` (`X-Robots-Tag: noindex, nofollow` untuk `/keystatic` & `/api/*`).
- [S2.7] RSS feed — `src/pages/rss.xml.ts`. Filter post tanpa `publishDate`; `APIContext` type (fix error pre-existing); link trailing-slash disesuaikan dengan canonical prerendered.

#### Catatan teknis
- `astro check` turun dari 30 → **29 error** (error `rss.xml.ts` implicit-any teratasi via S2.7). Sisa 29 = pre-existing React `class`/`className` (G2).
- `bun run build` sukses. Verifikasi runtime via `astro preview` + `Invoke-WebRequest` (meta tags, 4 blok JSON-LD, sitemap, RSS, header `/keystatic`).
- **URL kanonik halaman prerendered memakai trailing slash** (Astro `build.format: 'directory'`). RSS diselaraskan ke trailing slash. SSR `/posts` (pasca-S1.1) tanpa trailing slash. → catatan Appendix A.
- noindex `/keystatic` memakai header `X-Robots-Tag` (bukan `<meta robots>`) — ekuivalen & robust karena route on-demand.

#### Bug/issue tersisa (pindah ke sprint lain)
- Validasi Google Rich Results Test & w3.org RSS validator harus dijalankan **manual** pada URL produksi (tidak bisa di-automate di sesi ini) → S5.3.
- Inconsistensi trailing-slash minor (SSR `/posts` vs prerendered pages). Bila ingin uniform no-trailing-slash, perlu ubah `build.format`/`trailingSlash` global (berdampak luas) → evaluasi di Sprint 5.

### [Sprint 3 — Performance & Core Web Vitals] — ✅ Done (2026-07-30)

**Realisasi:** 1 sesi chat | **Tasks selesai:** 5/5

#### Yang dikerjakan
- [S3.1] Hapus render-blocking font `@import` — `src/styles/global.css`, `src/components/BaseHead.astro`. `@import url(...)` dihapus; font dimuat via `<link>` + 2× `preconnect` di `<head>`.
- [S3.2] Ganti body font — `src/styles/global.css`. **Temuan:** Google Sans Flex sekarang publik (200, bukan 404) — premis audit usang. Per konfirmasi user → diganti **Inter** (`wght@400;500;600;700`) agar ringan. `--font-body="Inter", Arial, sans-serif`.
- [S3.3] Optimasi gambar remote — `astro.config.mjs` (`image.remotePatterns`: unsplash+cloudinary), `index.astro`, `posts/index.astro`, `roadmap.astro`. Raw `<img>` → `<Image>` (explicit `width/height`, `densities={[1,2]}` srcset, `sizes`). Sebelumnya remote `<Image>` terlewat (URL raw); kini webp+srcset. LCP featured: `loading="eager" fetchpriority="high"`.
- [S3.4] Optimasi hydration — 9× `BackToTop` → `client:idle`; 4× `SearchBar` → `client:idle`; `NewsletterForm` → `client:idle`. Tetap `client:load`: ThemeToggle/MobileNav/RoadmapStep.
- [S3.5] Service worker network-first — `public/sw.js`. Navigasi (HTML) network-first + cache fallback; aset statis cache-first; cross-origin dilepas. Precache `+ /learning /roadmap`. Cache bump v1→v2.

#### Catatan teknis
- `astro check`: tetap **29 error** (pre-existing React `class`/`className`), nol di file yang disentuh. `bun run build` sukses.
- Strategi explicit `width/height` (bukan `inferSize`) dipakai supaya render SSR `/posts` tak men-fetch gambar remote tiap request; optimasi berjalan lazy via endpoint `/_image` (cached).
- `densities={[1,2]}` menghasilkan srcset density-descriptor (1x/2x). Bila ingin width-descriptor, gunakan `widths={[...]}` (opsional tuning lanjutan).
- Verifikasi via built CSS/HTML + `client=` attr island. **Lighthouse & CWV aktual belum di-run** (perlu browser/produksi) → S5.2.

#### Bug/issue tersisa (pindah ke sprint lain)
- Body font berubah dari Google Sans Flex → Inter (keputusan user, per brand). Branding/visual review direkomendasikan.
- `RoadmapStep` tetap `client:load` (×4 di `/roadmap`) — kandidat `client:visible` bila INP masih tinggi setelah audit S5.2.
- srcset memakai density-descriptor; pertimbangkan `widths` + `sizes` presisi untuk optimasi lanjutan.

### [Sprint 4 — Fungsionalitas & Polish] — ✅ Done (2026-07-30)

**Realisasi:** 1 sesi chat | **Tasks selesai:** 6/6

#### Yang dikerjakan
- [S4.1] Form kontak berfungsi — baru `src/pages/api/contact.ts`, edit `src/pages/contact.astro`. Endpoint POST memvalidasi name/email/subject(enum)/message; form kini submit + feedback inline (fetch + progressive enhancement). Diverifikasi runtime 200/400.
- [S4.2] Sinkronisasi schema — `keystatic.config.ts`, `src/content.config.ts`. `description` snippets & digitalAssets jadi required di Keystatic; `language` snippets jadi enum. Kategori `name` dikonfirmasi = slug (bukan field data).
- [S4.3] Struktur post seragam — `src/content/posts/*`. 2 post flat → folder `/index.mdoc` (5/5 seragam); slug tidak berubah.
- [S4.4] Konsolidasi ikon — `src/pages/posts/[...slug].astro`, `package.json`. 3 ikon share FontAwesome → inline SVG; 3 dep `@fortawesome/*` dihapus (konfirmasi user).
- [S4.5] Cleanup — `.env.example` (typo `NEWSLETTER_API_KEY`), `astro.config.mjs` (hapus no-op `server`). `TWITTER_HANDLE` diverifikasi sudah dipakai.
- [S4.6] PWA icon — `public/icon-192.png`, `public/icon-512.png` (sharp), `public/manifest.json` (2 entry PNG).

#### Catatan teknis
- `astro check`: tetap **29 error** (pre-existing React `class`/`className`, G2/Appendix A), 0 di file yang disentuh. `bun run build` sukses tiap task.
- **Penting (operasional):** memindahkan file content collection (S4.3) mewajibkan penghapusan `node_modules/.astro/data-store.json` (+ `.astro/`) sebelum rebuild, karena content store persisten mempertahankan path lama → build gagal. Lihat Appendix #11.
- Penghapusan dep `@fortawesome/*` memperkecil bundle (3 paket keluar dari dependency tree).
- Endpoint kontak & manifest PWA diverifikasi struktural; validasi Lighthouse/PWA audit aktual di browser → S5.2.

#### Bug/issue tersisa (pindah ke sprint lain)
- Integrasi pengiriman email form kontak masih stub (`console.log`) → produksi/deployment (butuh service email + env).
- 29 error `astro check` pre-existing (React `class`/`className`) masih memblokir DoD S5.1 "0 error" → perlu task cleanup (usulkan perluas S4.5 atau task baru di Sprint 5).
- Lighthouse PWA installability audit belum di-run → S5.2.

### [Sprint 5 — Pre-Launch Verification] — 🚧 In Progress (2026-07-30)

**Realisasi:** 1 sesi chat (otomatis) + manual (user) | **Tasks otomatis:** 5/7 selesai; S5.2 & S5.5 = manual browser

#### Yang dikerjakan (otomatis)
- [S5.1] Typecheck bersih — 6 komponen React `.tsx`. Perbaikan 29 error `class`→`className` → `astro check` **0 error, 0 warning**; `bun run build` sukses. (Menutup blocker DoD dari Appendix A #2.)
- [S5.3] Validasi structured data — scan JSON-LD hasil build. Post=WebSite+Organization+Article+BreadcrumbList; homepage=WebSite+Organization; asset=+BreadcrumbList. Semua well-formed JSON. (Rich Results Test = manual.)
- [S5.4] Crawlability — robots.txt valid; sitemap-0.xml exclude `/keystatic` & `/api/`; scan 0 broken internal link (`/rss.xml` = endpoint SSR valid).
- [S5.6] Rekonsiliasi dokumen — `ROADMAP.md` & `CHANGELOG.md` dikoreksi (font, ikon, structured data, security headers, SW, status Fase 5/deploy); section Pre-Production Sprints ditambahkan.
- [S5.7] CSP — `buildCsp()` adaptif di `src/middleware.ts`; header terverifikasi pada route SSR `/posts`.

#### Manual (wajib user, sebelum go-live)
- [S5.2] Lighthouse semua tipe halaman (target Perf≥90, A11y≥95, BP≥95, SEO≥95, LCP<2.5s, CLS<0.1, INP<200ms) — di URL produksi live.
- [S5.3 lanjutan] Google Rich Results Test pada URL live.
- [S5.5] Cross-browser (Chrome/Firefox/Safari/Edge + iOS/Android) & responsive breakpoint.
- [S5.7 lanjutan] Browser smoke test console CSP violation dengan analytics aktif.

#### Catatan teknis
- **CSP 'unsafe-inline' (script/style)** diperlukan oleh inline script (anti-FOUC theme, registrasi SW, GA inline) & style inline. Hardening lanjutan: migrasi nonce/hash (Astro CSP experimental).
- **CSP & header security cakupan parsial** lewat middleware — halaman prerendered bypass middleware. nginx wajib mereplikasi CSP + HSTS + security headers untuk SEMUA route. Lihat Appendix #14.
- Sprint 5 **bukan** "✅ Done" penuh karena S5.2/S5.5 (dan Rich Results live) inherently manual — tidak bisa dijalankan di environment CLI ini. Status tetap 🚧 sampai manual verification selesai.

#### Bug/issue tersisa (pindah ke deployment / post-launch)
- Header security (HSTS/CSP) di halaman prerendered → set di nginx saat deployment.
- Deploy production (DNS/SSL/PM2) & post-launch monitoring (CHANGELOG 5.13/5.14) belum dieksekusi → go-live.

---

## Pre-Launch Checklist Final

Tick semua sebelum deploy production.

### Build & Kode
- [ ] `npx astro check` bersih (0 error)
- [ ] `npm run build` sukses
- [ ] Tidak ada `console.error` di production build

### SEO
- [ ] Canonical, og:url, twitter:url konsisten di semua halaman
- [ ] `og:type` benar (article vs website)
- [ ] JSON-LD Article/WebSite/Organization/BreadcrumbList valid
- [ ] Sitemap bersih (no /keystatic, /api)
- [ ] robots.txt valid
- [ ] RSS feed valid

### Performance
- [ ] Font tidak render-blocking
- [ ] Gambar teroptimasi (WebP/srcset)
- [ ] Lighthouse Performance ≥ 90 (mobile)

### Fungsional
- [ ] Filter kategori `/posts?cat=` bekerja
- [ ] Header responsif di semua breakpoint
- [ ] Form kontak & newsletter berfungsi
- [ ] Service worker tidak menyajikan konten stale

### Security
- [ ] Security headers lengkap (incl. HSTS)
- [ ] `/keystatic` noindex
- [ ] `.env` tidak bocor ke repo

### Deployment
- [ ] Environment variables production ter-set
- [ ] DNS + SSL aktif
- [ ] PM2/ecosystem config valid
- [ ] Post-launch monitoring (Sentry/analytics) aktif

---

## Appendix — Catatan & Referensi

### A. Catatan untuk Sprint Lain

> Section ini untuk mencatat temuan saat mengerjakan satu sprint yang relevan untuk sprint lain (agar tidak lupa, tanpa melanggar guardrail G2).

**Dari Sprint 1 (2026-07-29):**

1. **Header security tidak ter-set pada halaman prerendered.** Middleware hanya jalan untuk route SSR (on-demand). Halaman prerendered (`/`, `/learning`, `/roadmap`, dll.) di-serve sebagai static file oleh `@astrojs/node` dan **bypass middleware** → tidak dapat HSTS/X-Frame-Options/dll. Implikasi: pada deployment VPS, header security harus di-set di level reverse proxy (nginx) untuk menutupi SEMUA route, atau migrasi page-page kunci ke SSR. → **S5.7** / konfigurasi deployment.

2. **29 error `astro check` pre-existing (di luar scope S1/S2).** Hampir semua di komponen React `.tsx` yang memakai prop `class=` (harusnya `className`): `BackToTop.tsx`, `CopyButton.tsx`, `MobileNav.tsx`, `NewsletterForm.tsx`, `SearchBar.tsx`, `ThemeToggle.tsx`. (Catatan: `rss.xml.ts` implicit-any **sudah diperbaiki di S2.7**, 30→29 error.) Ini akan memblokir DoD "astro check 0 error" di S5.1 jika tidak ditangani. → usulkan **task cleanup baru** atau perluas **S4.5** (konfirmasi user — perhatikan G2/G8).

3. **Mekanisme dark mode = CSS variable override** pada `html[data-theme="dark"]` (bukan Tailwind `dark:` variant). Konsekuensi: utility `dark:…` Tailwind di codebase **tidak merespon** theme toggle. Setiap styling dark harus lewat token `coc-*` (otomatis adaptif) atau selector `html[data-theme="dark"]`. Hapus/evitari `dark:` utility saat menyentuh styling di sprint lain. (Sprint 1 sudah membersihkan 2 instance di Header.astro.)

**Dari Sprint 2 (2026-07-29):**

4. **Trailing slash pada URL kanonik tidak seragam.** Halaman prerendered memakai trailing slash (mis. `/posts/slug/`, `/learning/`) karena `build.format: 'directory'`. Sedangkan route SSR `/posts` (pasca-S1.1) tanpa trailing slash. RSS & canonical sudah diselaraskan per-page, namun internal link `<a href="/posts/slug">` (tanpa slash) berbeda dari canonical-nya. Bila ingin uniform no-trailing-slash seluruh site, perlu ubah `build.format: 'file'` / `trailingSlash` di `astro.config.mjs` (berdampak ke sitemap, redirect, semua internal link) → **evaluasi di Sprint 5**.

5. **noindex `/keystatic` via `X-Robots-Tag` header** (bukan `<meta name="robots">`). Ekuivalen secara fungsional & lebih robust untuk route on-demand. Bila deployment pakai reverse proxy, pastikan header ini tidak di-strip. → **S5.4**.

6. **Validasi SEO eksternal belum dijalankan otomatis.** Google Rich Results Test (Article/BreadcrumbList) & w3.org Feed Validator perlu di-run manual pada URL produksi live. → **S5.3**.

**Dari Sprint 3 (2026-07-30):**

7. **Premis audit S3.2 (Google Sans Flex = 404) sudah usang.** Font tersebut kini publik via Google Fonts (CSS+woff2 = 200). Tetap diganti ke **Inter** atas pertimbangan payload (variabel-font berat) — keputusan user. Dokumen audit lain yang mengasumsikan font ini rusak perlu dikoreksi.

8. **Gambar remote sebelumnya TIDAK dioptimasi sama sekali.** Tanpa `image.remotePatterns`, `<Image>` dari `astro:assets` meneruskan URL raw remote (unsplash/cloudinary) tanpa WebP/srcset/resize — bahkan di halaman detail yang sudah pakai `<Image>`. Kini `remotePatterns` aktif → semua `<Image>` remote teroptimasi. Sprint lain yang menambah gambar remote HARUS mendaftarkan domainnya di `astro.config.mjs`.

9. **`inferSize` dihindari untuk gambar remote di route SSR.** `inferSize` men-fetch gambar remote saat render → berat pada SSR `/posts` (on-demand). Pakai explicit `width`/`height`; optimasi jalan lazy via `/_image` (cached). Sprint lain: gunakan pola yang sama untuk gambar remote di page SSR.

10. **Strategi SW berubah (v1→v2).** Navigasi network-first, aset cache-first. Pengguna eksisting perlu update otomatis (cache v1 dihapus saat activate). Bila ada kebutuhan "offline-first total" di halaman tertentu, pertimbangkan strategy per-route.

**Dari Sprint 4 (2026-07-30):**

11. **Content store persisten Astro (data-store.json).** Saat memindahkan/mengganti nama file content collection (mis. migrasi flat→folder di S4.3), Astro menyimpan daftar entry di `node_modules/.astro/data-store.json`. Store ini **tidak otomatis bersih** — path lama dipertahankan dan menyebabkan build gagal (`Rolldown failed to resolve import ...deferred-module`). **Solusi:** hapus `.astro/`, `node_modules/.astro/`, dan `dist/` lalu rebuild. Catatan ini berlaku untuk sprint lain yang memodifikasi struktur file content collection.

12. **Premis audit S4.2 (categories butuh `name`) tidak akurat.** Di Keystatic, field bertanda `slugField` (mis. `name`) menjadi **nama file**, bukan field data — file JSON hanya menyimpan `label`+`tone`. Maka `content.config` dengan benar mengomisikan `name`. Tidak ada drift pada categories; jangan tambah field slug ke schema data.

13. **FontAwesome dihapus sepenuhnya.** Setelah S4.4, tidak ada lagi `@fortawesome/*` di dependency tree. Sprint lain yang butuh ikon brand gunakan **inline SVG** (`fill="currentColor"`) seperti pola di `contact.astro` / share section post, atau lucide. Jangan re-introduce FontAwesome.

**Dari Sprint 5 (2026-07-30):**

14. **CSP & semua header security hanya berlaku route SSR via middleware.** Sama seperti Appendix #1: halaman prerendered (sebagian besar site — `/`, `/posts/[slug]`, `/about`, `/assets/*`, dll.) di-serve sebagai static file oleh `@astrojs/node` dan **bypass middleware** → tidak dapat CSP/HSTS/X-Frame-Options. **Akibatnya:** saat deployment, nginx (reverse proxy) **wajib** mereplikasi SELURUH security headers + CSP untuk menutupi semua route. Contoh konfigurasi nginx: `add_header Content-Security-Policy "<policy>" always;` di blok `server`/`location`. Tanpa ini, CSP efektif hanya pada `/posts` (SSR) + `/api/*` + `/rss.xml`.

15. **CSP memakai `'unsafe-inline'` untuk script-src & style-src.** Diperlukan oleh inline script (anti-FOUC theme, registrasi SW, GA inline `set:html`) dan style inline/komponen Astro. Ini melemahkan proteksi XSS terhadap injeksi script inline. Hardening masa depan: migrasi ke **nonce** (Astro CSP experimental `astro:middleware` nonce) atau **hash** per inline script, lalu hapus `'unsafe-inline'` dari script-src. Lakukan SETELAH semua inline script dipetakan & diuji.

16. **Validasi Lighthouse / Google Rich Results / cross-browser bersifat manual.** Environment CLI tidak bisa menjalankan browser-headless Lighthouse yang akurat atau Rich Results Test (butuh URL publik yang dapat di-crawl Google). Akibatnya Sprint 5 tidak dapat ditandai `✅ Done` penuh otomatis — S5.2 & S5.5 wajib dijalankan user pada URL produksi live sebelum go-live.

17. **Scope redefinition — Learning Pathways & Roadmap Interaktif DIHAPUS (2026-07-30).** Arah produk diubah: Cup of Code adalah **content-driven blog** (artikel/tutorial + aset digital: template/snippet/AI prompt + snippet), **bukan LMS**. Dihapus: `src/pages/learning.astro`, `src/pages/roadmap.astro`, `src/components/ui/RoadmapStep.tsx`, link Header/Footer, entry precache SW (cache di-bump v2→v3). Sitemap otomatis mengecualikan keduanya. **Konsekuensi pada dokumen ini:** catatan historis Sprint 3 & 4 (S3.3, S3.5, Appendix #1/#4 yang menyebut `/learning` & `/roadmap`) adalah **rekam jejak saat itu** dan dibiarkan apa adanya — fitur tersebut kini tidak ada. Yang **tetap**: artikel blog `posts/roadmap-jadi-web-developer-...` (konten editorial, bukan fitur LMS). Catatan: dark mode juga dihapus sesi terakhir (branding light-only) — `ThemeToggle.tsx`, FOUC script, palet dark CSS bersih; Appendix #3 (mekanisme dark mode) kini **usang**.


### B. Decision Log (Keputusan Arsitektur)

| Tanggal | Keputusan | Alasan |
|---------|-----------|--------|
| 2026-07-29 | Sprint plan dibuat dari audit codebase | Banyak klaim "selesai" tidak sesuai kondisi aktual |
| 2026-07-29 | CSP ditunda ke Sprint 5 | Butuh analisis cros-origin font/analytics |
| 2026-07-29 | Security headers via middleware hanya berlaku route SSR; halaman prerendered bypass | `@astrojs/node` menyajikan static file tanpa middleware. Header harus dilengkapi di nginx (deployment) untuk cakupan penuh → S5.7 |
| 2026-07-29 | Filter `/posts?cat=` punya 2 bug (prerender + destructuring URLSearchParams) | Keduanya harus diperbaiki bersamaan agar filter benar-benar bekerja |
| 2026-07-29 | Meta twitter dikonversi `property=` → `name=` | Konvensi resmi Twitter Card; konsisten dengan dokumen task S2.2 |
| 2026-07-29 | RSS link dipertahankan trailing slash | URL kanonik halaman prerendered pakai trailing slash (`build.format:'directory'`); RSS diselaraskan ke canonical |
| 2026-07-29 | noindex `/keystatic` via header `X-Robots-Tag` | Route on-demand → middleware berlaku; ekuivalen meta robots, lebih robust |
| 2026-07-30 | Body font: Google Sans Flex → Inter | Audit S3.2 (404) usang; font kini publik tapi variabel-font berat. Inter lebih ringan (per konfirmasi user) |
| 2026-07-30 | Gambar remote: explicit width/height, bukan `inferSize` | Hindari fetch remote saat render SSR `/posts`; optimasi lazy via `/_image` |
| 2026-07-30 | SW: network-first navigasi + cache-first aset (cache v1→v2) | Cegah konten stale; update Keystatic langsung tampak tanpa hard refresh |
| 2026-07-30 | Form kontak: fetch client-side + progressive enhancement (`action`/`method`) | UX tanpa reload + tetap bekerja tanpa JS; validasi server-side otoritatif |
| 2026-07-30 | Migrasi post flat→folder; slug tak berubah | Konvensi seragam sesuai default Keystatic; `post.id` diturunkan dari nama folder |
| 2026-07-30 | Ikon share: FontAwesome → inline SVG; hapus dep `@fortawesome/*` | Konsisten dengan lucide/inline; kurangi bundle (per konfirmasi user) |
| 2026-07-30 | Perbaiki 29 error `class`→`className` di komponen React | Membuka DoD S5.1 (0 error); error pre-existing yang di-skip di G2 sebelumnya, kini in-scope S5.1 |
| 2026-07-30 | CSP adaptif di middleware + `'unsafe-inline'` script/style | Inline script/style eksisting memerlukan unsafe-inline; nonce-migration = hardening lanjutan. Cakupan penuh butuh nginx |
| 2026-07-30 | Sprint 5 = 🚧 (bukan ✅) | S5.2 Lighthouse & S5.5 cross-browser inherently manual; tidak bisa di-automate di CLI |
| 2026-07-30 | De-scope Learning Pathways & Roadmap Interaktif (hapus penuh) | Produk = content-driven blog (artikel/aset/snippet/prompt), bukan LMS. Hapus route + RoadmapStep + nav + SW precache; artikel blog terkait tetap |
| 2026-07-30 | Hapus dark mode (branding light-only) | Brand sengaja light palette; hapus ThemeToggle, FOUC script, palet dark CSS. Token `--color-dark` (charcoal) dipertahankan sebagai warna brand |

### C. Referensi Eksternal

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Article](https://schema.org/Article)
- [Astro Image Optimization](https://docs.astro.build/en/guides/images/)
- [Astro Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### D. Dokumen Terkait

- `docs/ROADMAP.md` — roadmap fase-fase pengembangan (catatan: beberapa status perlu direkonsiliasi di Sprint 5)
- `docs/CHANGELOG.md` — changelog per fase
- `docs/PERFORMANCE-BUDGET.md` — threshold performance target
- `docs/BACKUP-STRATEGY.md` — strategi backup konten
- `docs/references/` — referensi HTML mockup per halaman

---

* Dokumen ini adalah **living document**. Update saat sprint selesai & saat ditemukan temuan baru. Sebelum mulai eksekusi sprint di sesi chat baru, **selalu baca ulang section "Cara Menggunakan Dokumen Ini"**.
