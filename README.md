# Cup of Code

> Tutorial coding, tips & trik, serta aset digital siap pakai untuk developer Indonesia.

[![Astro](https://img.shields.io/badge/Astro-7.1-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Keystatic](https://img.shields.io/badge/Keystatic-CMS-1E1E1E)](https://keystatic.com)

**Cup of Code** adalah blog konten skala kecil-menengah yang membahas dunia web development — dari artikel mendalam, snippet siap pakai, hingga aset digital (UI component, AI prompt, custom gem). Ditulis dalam Bahasa Indonesia, ditujukan untuk developer Indonesia.

🌐 **Website:** [https://cupofcode.cc](https://cupofcode.cc)

---

## ✨ Fitur Utama

- 📝 **Artikel** — tutorial & opini web development (TypeScript, Astro, React, keamanan Node.js, dll.)
- 🧩 **Aset Digital** — UI component, AI prompt template, dan custom gem siap pakai
- 🔍 **Pencarian** — search bar dengan suggestion real-time
- 🌐 **SEO lengkap** — JSON-LD (WebSite, Organization, Article, BreadcrumbList), Open Graph, sitemap, RSS feed
- 🛡️ **Security** — security headers (HSTS, CSP, X-Frame-Options, dll.), rate limiting, honeypot
- 📱 **PWA** — service worker, manifest, installable ke homescreen
- 🎨 **Design system** — Tailwind CSS 4 + design tokens via CSS variables
- ⚡ **Performa** — SSR via Astro Node adapter + island hydration React 19
- 📊 **Analytics** — Umami (atau GA4) untuk privasi-friendly tracking
- 🚨 **Monitoring** — Sentry untuk error reporting dengan sourcemap upload

---

## 🚀 Quick Start

### Prasyarat

- **Node.js** ≥ 24 (sesuai `engines`)
- **bun** (lockfile resmi: `bun.lock`)
- **Git** untuk clone & Keystatic storage

### Instalasi

```bash
git clone https://github.com/cupofcode/cupofcode.git
cd cupofcode
bun install
cp .env.example .env
# Edit .env: isi PUBLIC_SITE_URL, KEYSTATIC_*, RESEND_API_KEY, dll.
bun dev
```

Server lokal: <http://localhost:4321>

CMS Keystatic: <http://localhost:4321/keystatic>

---

## 🛠️ Tech Stack

| Layer       | Teknologi         | Catatan |
|-------------|-------------------|---------|
| Framework   | Astro 7           | SSR (server output) + Vercel adapter |
| UI Library  | React 19          | Hanya untuk komponen interaktif (island) |
| Styling     | Tailwind CSS 4    | CSS-first via `@tailwindcss/vite` + design tokens |
| CMS         | Keystatic 5.1     | Dual-mode (local dev / GitHub OAuth prod) |
| Content     | Markdoc + Astro Content Collections | Type-safe via Zod |
| TypeScript  | 6.0               | `astro check` = 0 error / 0 warning |
| Monitoring  | Sentry            | Sourcemap auto-upload |
| Email       | Resend (REST)      | Newsletter + contact form |
| Analytics   | Umami (atau GA4)  | Self-hosted / cloud |

---

## 📁 Struktur Direktori

```
cupofcode/
├── src/
│   ├── assets/              # Gambar, ikon (processed oleh Astro)
│   ├── components/          # Komponen Astro (.astro) & React (.tsx)
│   │   ├── ui/              # Komponen UI interaktif (React)
│   │   └── digital-assets/  # Komponen spesifik aset digital
│   ├── content/             # Astro Content Collections (markdown/markdoc)
│   │   ├── posts/           # Artikel
│   │   ├── snippets/        # Code snippets
│   │   └── digital-assets/  # UI component / AI prompt / custom gem
│   ├── layouts/             # BaseLayout, dst.
│   ├── pages/               # Routes (Astro file-based routing)
│   │   ├── api/             # SSR endpoints (newsletter, contact, health)
│   │   └── posts|snippets|assets/[...slug].astro
│   ├── styles/
│   │   └── global.css       # Design tokens, prose-coc typography
│   ├── consts.ts            # SITE_TITLE, SITE_URL, dll.
│   └── middleware.ts        # Security headers + CSP + rate limit
├── public/                  # Static assets (favicon, manifest, robots.txt, sw.js)
├── docs/                    # Dokumentasi proyek
├── keystatic.config.ts      # Schema CMS
├── astro.config.mjs         # Konfigurasi Astro
├── ecosystem.config.cjs     # PM2 config (production)
└── .env.example             # Template environment variables
```

---

## ⚙️ Environment Variables

Salin `.env.example` ke `.env` lalu isi:

| Variabel                    | Wajib? | Keterangan |
|-----------------------------|--------|------------|
| `PUBLIC_SITE_URL`           | ✅     | Domain produksi (mis. `https://cupofcode.cc`) |
| `PUBLIC_SITE_TITLE`         | ✅     | Nama situs |
| `KEYSTATIC_STORAGE_KIND`    | ✅     | `local` (dev) / `github` (prod) |
| `KEYSTATIC_GITHUB_CLIENT_ID`| Prod   | OAuth Client ID untuk Keystatic |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Prod | OAuth Client Secret |
| `KEYSTATIC_SECRET`          | Prod   | Encryption secret untuk Keystatic session |
| `PUBLIC_UMAMI_SRC`          | Opt    | URL script Umami |
| `PUBLIC_UMAMI_WEBSITE_ID`   | Opt    | Website ID Umami |
| `PUBLIC_GA_ID`              | Opt    | Google Analytics Measurement ID (alternatif) |
| `PUBLIC_SENTRY_DSN`         | Opt    | DSN Sentry untuk error monitoring |
| `SENTRY_AUTH_TOKEN`         | Prod   | Token untuk sourcemap upload ke Sentry |
| `RESEND_API_KEY`            | Prod   | API key Resend (tanpa ini form jadi mock) |
| `EMAIL_FROM`                | Prod   | Sender email (mis. `Cup of Code <newsletter@cupofcode.cc>`) |
| `EMAIL_ADMIN`               | Prod   | Email admin untuk receive contact form |
| `RESEND_AUDIENCE_ID`        | Prod   | Audience ID Resend — simpan subscriber newsletter |
| `UPSTASH_REDIS_REST_URL`    | Prod   | Upstash Redis REST URL — rate limit shared antar instance |
| `UPSTASH_REDIS_REST_TOKEN`  | Prod   | Upstash Redis REST token |
| `NEWSLETTER_RATE_LIMIT`     | Opt    | Default: `1/min` |
| `CONTACT_RATE_LIMIT`        | Opt    | Default: `5/hour` |

Lihat `.env.example` untuk template lengkap.

---

## 📝 Commands

| Command            | Aksi |
|--------------------|------|
| `bun install`      | Install dependencies |
| `bun dev`          | Jalankan dev server di `localhost:4321` |
| `bun run build`    | Build production ke `./dist/` |
| `bun run preview`  | Preview build lokal |
| `bunx astro check` | Type-check (.astro & .ts files) |

---

## ✍️ Kontribusi Konten (via Keystatic)

1. Jalankan `bun dev`
2. Buka <http://localhost:4321/keystatic>
3. Login (mode local dev: tanpa OAuth)
4. Buat/edit post / snippet / digital asset
5. Commit & push ke Git

Untuk production, Keystatic menggunakan GitHub OAuth — kontributor non-developer bisa langsung edit via UI tanpa menyentuh Git CLI.

---

## 🚢 Deployment

Project ini di-deploy ke **Vercel** (SSR via `@astrojs/vercel`): setiap push ke `main` otomatis di-build dan di-deploy.

- **Security headers & CSP** diset di [`vercel.json`](vercel.json) agar menjangkau SEMUA response, termasuk halaman prerendered yang bypass middleware Astro (`src/middleware.ts` hanya backup `X-Robots-Tag` untuk route SSR).
- **Environment variables** diset di Vercel dashboard — `UPSTASH_*` + `RESEND_AUDIENCE_ID` wajib diisi agar rate limit & newsletter berfungsi di production.
- **CI** (`.github/workflows/ci-cd.yml`) hanya quality gate: `bun install --frozen-lockfile` → `astro check` → `build`.

> Catatan: sebagian besar file di `docs/` ter-track di git, tapi rule `docs` di `.gitignore` membuat file docs **baru** (mis. `docs/cupofcode-feed-integration.md`) tidak ikut ter-commit — kondisi setengah jadi yang perlu dirapikan (track semua atau untrack semua).

Lihat [Codebase Review 2026-08-30](docs/review/CODEBASE-REVIEW-2026-08-30.md) untuk checklist produksi lengkap.

---

## 📚 Dokumentasi

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — Peta jalan pengembangan (6 fase + post-launch)
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — Changelog v0.1.0 → v1.1.2
- [`docs/PRE-PRODUCTION-SPRINTS.md`](docs/PRE-PRODUCTION-SPRINTS.md) — Audit jujur S1–S5
- [`docs/finalization/`](docs/finalization/) — Sprint finalisasi F-1 s/d F-10
- [`docs/PERFORMANCE-BUDGET.md`](docs/PERFORMANCE-BUDGET.md) — Threshold performa
- [`docs/BACKUP-STRATEGY.md`](docs/BACKUP-STRATEGY.md) — Strategi backup konten
- [`docs/review/CODEBASE-REVIEW-2026-08-30.md`](docs/review/CODEBASE-REVIEW-2026-08-30.md) — Review terakhir

---

## 📜 Lisensi

MIT © Cup of Code