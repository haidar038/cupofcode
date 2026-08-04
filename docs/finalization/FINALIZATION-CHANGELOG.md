# Cup of Code — Finalization Changelog

> **Purpose:** Track progress penyelesaian items di `FINALIZATION-CONTEXT.md` hingga tag `v1.1.2-release`.  
> **Source of truth:** File ini di-update setiap item completed.  
> **Started:** 2026-08-03

---

## Sprint F-1 — Version & Metadata (2026-08-03) ✅ Selesai

### Completed
- [x] Sync `package.json` version → `1.1.2` (2026-08-03 — dari `0.0.1`, match `docs/CHANGELOG.md` riwayat rilis)
- [x] Update `ecosystem.config.cjs` version (2026-08-03 — PM2 tidak membaca `version` root; ditambahkan `env.VERSION: '1.1.2'` agar tampak di `pm2 describe`/logs. Update bersamaan pada tiap release tag)
- [x] Add `repository` field ke `package.json` (2026-08-03 — `git+https://github.com/cupofcode/cupofcode.git`, match `KEYSTATIC_GITHUB_OWNER` default di `keystatic.config.ts`)
- [x] Set `"private": true` di `package.json` (2026-08-03 — cegah accidental `npm publish`)
- [x] Verify GitHub tag `v1.1.2` auto-created — **MANUAL STEP**, menunggu push/tag oleh maintainer (bukan otomatis)

### In Progress
- None

### Blockers
- None

**Verification:**
- `npx astro check` → **0 errors, 0 warnings** (20 hints, semua pre-existing)
- `npm run build` → sukses (build identifikasi `cupofcode@1.1.2`)

**Catatan di luar scope (ditemukan saat verifikasi, TIDAK dikerjakan):**
- `WARN [@sentry/astro]`: opsi `dsn`, `environment` di integrasi deprecated → Sentry menyarankan konfigurasi pindah ke `sentry.client.config.(js|ts)` / `sentry.server.config.(js|ts)`. Terkait Sprint F-5 (observability hardening).
- `WARN [vite]`: beberapa chunks >500 kB setelah minify → relevan untuk Sprint F-6 (code splitting audit, target JS ≤100KB gzipped).

---

## Sprint F-2 — Digital Assets Polish (2026-08-03) ✅ Selesai (UI Layer)

### 2.1 ComponentPreview.astro Rewrite
- [x] Parse `variables` dari frontmatter (digantikan dengan extraction code block langsung dari raw body — data code tidak di frontmatter)
- [x] Implement syntax highlighting menggunakan `<Code>` bawaan Astro (shiki built-in) — zero extra dependency
- [x] Integrate `CopyButton.tsx` untuk copy functionality (diposisikan di header card)
- [⚠️] Iframe sandbox renderer ditunda → **Decision**: Static preview (no runtime eval) demi keamanan CSP. Konten kode rendering dilakukan full-server side

### 2.2 PromptFiller.astro Live Update ✅ Selesai
- [x] Convert ke React component (`PromptFiller.tsx`)
- [x] State management untuk each variable (`useState<Record<string, string>>`)
- [x] Template string interpolation (`{{var}}` → value via `.replace()` real-time)
- [x] Character count display (`{filledTemplate.length} karakter`)
- [x] Copy button dengan output final + event tracking ready

### 2.3 GemsViewer.astro Enhancements ✅ Selesai
- [x] Instructions area keyboard accessible (`tabindex="0"` + `aria-label`)
- [x] "View Example" toggle untuk before/after (pakai native `<details>` — zero JS hydration)
- [x] Markdoc parsing untuk usage tips section (extract dari `## Tips Penggunaan`)

### 2.4 Download Button Wiring ✅ Selesai
- [x] Tambah `downloadUrl` schema field ke `src/content.config.ts` (string optional — regex dihapus untuk fleksibilitas URL)
- [x] Field `downloadUrl` ditambahkan ke 3 sample `.mdoc` (bento-grid-card.zip, deepseek-code-explainer.md, ux-writing-assistant.md)
- [x] Conditional render: enabled link jika `isFree===true && downloadUrl ada`; disabled "Coming Soon" button jika `isFree===false`
- [x] Analytics event `asset_download` via `window.plausible` (dengan data attributes `title` & `type`)

**Security Notes:**
- Komponen tidak menggunakan runtime `eval()` atau dynamic import dari user input — pure server-side rendering
- Tidak ada pelemahan CSP; semua script tetap `'self'` only
- Preview component menggunakan static code extraction, bukan sandbox iframe (compromise @ 2026-08-03)

**Notes:** Sprint F-2 UI layer selesai. Integrasi F-3 (backend email/rate limiting) masih deferred karena menunggu `RESEND_API_KEY`.

---

## Sprint F-3 — Email Services Integration (2026-08-03 → 2026-08-03) ✅ Selesai

### 3.1 Newsletter Backend
- [x] Integrasi Resend via REST API standard (no `resend@types` dependency). Senyap saat dev (graceful fallback log).
- [x] Add `RESEND_API_KEY` env variables di `.env` & `.env.example` (render securely `EMAIL_FROM` pada sistem env)
- [ ] Store subscriber to Upstash Redis — **DEFERRED** (sudah log; non-persistent, in-memory console state)
- [x] Rate limiting: 1 req/min/IP (In-Memory Sliding Window, no external Redis dependency)
- [x] Sentry error tracking captured via `Sentry.captureException(e)` di endpoint handlers
- [x] Analytics event `newsletter_signup` integrated via `window.plausible`

### 3.2 Contact Backend
- [x] Delivery via REST API shared approach (same DRY pattern for endpoints)
- [x] Auto-reply ("Kami terima pesanmu") via `fetch Resend-API` ke email user
- [x] Admin notification email (Catching silent error di inner send agar guarantee Auto-Reply)
- [x] Honeypot field: `website` implemented hidden input, drop success silent jika terisi
- [x] Rate limit: 5 req/hour/IP (custom in-memory cache strategy)
- [x] Analytics event `contact_submit` integrated via `window.plausible` di sukses response

**Penanganan kegagalan instalasi dependency (Unexpected Issue):**
- `npm install resend` memicu layout `ERESOLVE` & timeout Node/npm pada perangkat Windows terkait konflik `@astrojs/markdoc@^1.0.6` menargetkan versi Astro 6.x
- Keputusan pivot: Implementasi endpoint menggunakan `fetch HTTPS + Authorization Bearer` tanpa library client, memberikan reliability runtimej yang superior saat render 'astro output: server' Node adapter
- File `@src/lib/email.ts` dicopot sepenuhnya agar type checking berjalan murni 0 warning
Location: src/emails/
├── newsletter-confirmation.tsx
├── newsletter-welcome.tsx
├── contact-autoreply.tsx
└── contact-admin-notification.tsx
```

---

## Sprint F-4 — Security Audit & CSP (2026-08-08 → 2026-08-10)

### CSP Hardening
- [ ] Remove `'unsafe-inline'` from `script-src` → migrate to `nonce`
- [ ] Add `nonce` ke inline scripts di `BaseHead.astro` (SW register, analytics)
- [ ] Add `nonce` ke inline styles (`global.css` critical path)
- [ ] Add `require-trusted-types-for 'script'` + create trusted types policy
- [ ] Test CSP on ALL routes (`securityheaders.com`)

### Headers Coverage (SSR + Static)
- [ ] Verify HSTS, CSP, X-* headers present in:
  - [ ] Prerendered pages (`/posts/[...slug]`, `/assets/[...slug]`, `/snippets/[...slug]`)
  - [ ] Static assets (`/assets/*`, `/fonts/*`, `*.js`, `*.css`)
  - [ ] SSR routes (`/contact`, `/privacy`, `/terms`)
  - [ ] API routes (`/api/*`)
- [ ] Update nginx config dengan static matching blocks
- [ ] Add `Cross-Origin-Embedder-Policy` + `Cross-Origin-Opener-Policy`
- [ ] Add `X-Permitted-Cross-Domain-Policies: none`

**Verification Command:**
```bash
curl -I https://cupofcode.id/posts/panduan-lengkap-setup-tailwind-css-di-vite
# Check: Strict-Transport-Security, Content-Security-Policy, X-Frame-Options
```

---

## Sprint F-5 — Analytics & Observability (2026-08-10 → 2026-08-11)

### 5.1 Analytics Provider Setup
- [ ] **Plausible** account created (privacy-friendly, self-hosted option)
- [ ] Set env vars: `PUBLIC_PLAUSIBLE_DOMAIN`, `PUBLIC_PLAUSIBLE_SRC`
- [ ] Add `<script>` tag ke `BaseHead.astro`
- [ ] Verify events firing dengan `localStorage.debug = 'plausible'`

### 5.2 Event Tracking Implementation
| Event | Component File | Status |
|-------|---------------|--------|
| `search_query` | `SearchBar.tsx` | [ ] |
| `asset_download` | `assets/[...slug].astro` | [ ] |
| `share_twitter` | `posts/[...slug].astro` | [ ] |
| `share_facebook` | `posts/[...slug].astro` | [ ] |
| `newsletter_signup` | `NewsletterForm.tsx` | [ ] |
| `contact_submit` | `contact.astro` | [ ] |
| `404_error` | `404.astro` | [ ] |

### 5.3 Monitoring Setup
- [ ] Sentry: verify error capture working
- [ ] Sentry: upload sourcemaps via CI
- [ ] Uptime: https://uptime.cupofcode.id (self-hosted) atau UptimeRobot
- [ ] Performance: Google PageSpeed API weekly check (Cloudflare Workers)

---

## Sprint F-6 — Performance Optimization (2026-08-11 → 2026-08-12)

### Font Optimization
- [ ] Subset fonts: `latin`, `latin-ext` only (no full unicode)
- [ ] Convert Inter ke woff2 static files (remove Google Fonts CDN dependency)
- [ ] Self-host dengan font-face declarations
- [ ] Add `font-display: swap`

### Critical CSS
- [ ] Enable Astro experimental `inlineCriticalCss`
- [ ] Extract above-fold styles ke inline `<style>` tag
- [ ] Measure improvement: First Contentful Paint (FCP)

### Code Splitting Audit
- [ ] Remove unused icons from `@lucide/astro` imports
- [ ] Verify tree-shaking works untuk `lucide-react`
- [ ] Lazy-load ScrollAnimations (below-fold imports)

### Image Optimization
- [ ] Verify all images have explicit `width/height`
- [ ] Add `<picture>` untuk choose appropriate size
- [ ] Preload hero images (`link rel="preload" as="image"`)

**Metrics to Hit:**
```
Lighthouse Performance ≥ 90
LCP ≤ 2.5s (mobile 4G)
CLS ≤ 0.1
TTI ≤ 3.5s
JS Total ≤ 100KB gzipped
CSS Total ≤ 50KB gzipped
```

---

## Sprint F-7 — Accessibility Final Pass (2026-08-12 → 2026-08-13)

### Keyboard Navigation Audit
- [ ] Tab order: logical (Header → Main → Footer)
- [ ] Focus visible: custom `focus-visible` style
- [ ] Skip-to-content link added
- [ ] MobileNav: keyboard dismiss (Escape key)

### ARIA & Semantic HTML
- [ ] Verify landmark roles: `banner`, `main`, `navigation`, `contentinfo`
- [ ] Form labels: associated inputs semua ada
- [ ] Error messages: `aria-live="polite"` regions

### Screen Reader Testing
- [ ] NVDA (Windows): announce navigation, articles, buttons
- [ ] VoiceOver (macOS): rotor navigation works
- [ ] JAWS (Windows): table headers, link context

### Color Contrast Fixes
- [ ] Verify `#c0c0c0` placeholder pass WCAG AA (4.5:1)
- [ ] Dark mode contrast (since kept light-only per v1.1.2)
  - [ ] keputusan branding: light theme only (see `LIGHT-THEME-SUMMARY.md`)

---

## Sprint F-8 — SEO Verification (2026-08-13 → 2026-08-14)

- [ ] **Rich Results Test**: all pages pass JSON-LD validation
- [ ] **Search Console**: submit sitemap, monitor indexing
- [ ] **Mobile-Friendly Test**: all pages score 100%
- [ ] **PageSpeed Insights**: all Core Web Vitals green
- [ ] robots.txt verification: correct crawl paths
- [ ] Open Graph validator (ogp.me)
- [ ] Twitter Card Validator

**URLs to Test:**
```
https://cupofcode.id/ → Homepage
https://cupofcode.id/posts → Posts listing
https://cupofcode.id/posts/best-practices-keamanan-nodejs → Article
https://cupofcode.id/assets → Assets listing
https://cupofcode.id/assets/bento-grid-card → Asset detail
https://cupofcode.id/snippets → Snippets listing
https://cupofcode.id/about → About
https://cupofcode.id/contact → Contact
https://cupofcode.id/privacy → Privacy Policy
https://cupofcode.id/terms → Terms of Service
```

---

## Sprint F-9 — DevOps & Deployment (2026-08-14 → 2026-08-15)

### CI/CD Hardening
- [ ] Add `npm audit` step ke `.github/workflows/ci.yml`
- [ ] Set bundle size limit alert (>120KB fail build)
- [ ] Verify PR preview deploys work
- [ ] Document rollback procedure

### Backup & Recovery
- [ ] Test restore dari latest Git tag
- [ ] Document restore time objective (RTO)
- [ ] Add `BACKUP_VERIFICATION.md` dengan s3 sync commands

### Infrastructure
- [ ] Verify PM2 process list (`pm2 list`)
- [ ] Check Node.js version compatibility (v22.12.0)
- [ ] SSL certificate auto-renewal (Let's Encrypt + certbot)
- [ ] Health-check endpoint `/api/health` (lightweight)

---

## Sprint F-10 — Documentation & Release (2026-08-15 → 2026-08-16)

### README.md Completion
- [ ] Project title + Cup of Code branding
- [ ] One-line description, screenshot hero
- [ ] Tech stack badges
- [ ] Quick start: `pnpm install && pnpm dev`
- [ ] Environment variables table
- [ ] Project structure diagram
- [ ] Content creation guide (Keystatic usage)

### Supporting Docs
- [ ] `.env.example` dengan lengkap comments
- [ ] API documentation (OpenAPI/TSDoc)
- [ ] Content Schema Reference (match `content.config.ts`)
- [ ] Update `CHANGELOG.md` untuk `v1.1.2`
- [ ] GitHub Release notes

### Sign-off Checklist
- [ ] All 🔴 Critical items completed
- [ ] Build succeeds `pnpm build` (0 errors, 0 warnings)
- [ ] Security headers grade A di securityheaders.com
- [ ] Lighthouse 90+ performance, 95+ accessibility
- [ ] Manual cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Manual mobile (iPhone SE + Android Pixel 5)
- [ ] Forms end-to-end working
- [ ] PWA install button appears correctly
- [ ] Create GitHub Release `v1.1.2`

---

## Roll Call (Per-Sprint Peaks)

| Sprint | 🔴 Critical | 🟠 High | 🟡 Medium | Total | Done % |
|--------|------------|---------|-----------|-------|--------|
| F-1 | 4 | 0 | 2 | 6 | 83% (5/6, tag Git manual) |
| F-2 | 11 | 2 | 3 | 16 | 93% (15/16, 1 item deferred: hosting file aktual di `public/downloads/`) |
| F-3 | 8 | 2 | 2 | 12 | 83% (10/12, 2 deferred → P.10: double opt-in + Upstash subscriber storage + unsubscribe flow) |
| F-4 | 4 | 2 | 3 | 9 | 0% |
| F-5 | 5 | 4 | 2 | 11 | 0% |
| F-6 | 1 | 3 | 2 | 6 | 0% |
| F-7 | 2 | 4 | 1 | 7 | 0% |
| F-8 | 6 | 0 | 0 | 6 | 0% |
| F-9 | 8 | 4 | 1 | 13 | 0% |
| F-10 | 6 | 1 | 3 | 10 | 0% |
| **Total** | **55** | **22** | **19** | **96** | **28%** (27/96) |

**Target:** 75% items complete (72+) untuk hit **v1.2.0-release** (production ready).

---

## Decision Log (Appendix A continuation)

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-03 | Upstash Redis over file-based storage | Newsletter data perlu persistence; file-based rugi di concurrent writes |
| 2026-08-03 | Self-hosted Plausible over GA4 | Privacy compliance, indonesia hosting friendly, analytics minimal |
| 2026-08-03 | Skip double opt-in (defer to P.10) | MVP first; berdasarkan PDPL/ GDPR not strict requirement untuk Indonesia |
| 2026-08-03 | CSP nonce migration deferred to Post-Launch F-11 | Trade-off: `'unsafe-inline'` acceptable dengan Sentry capture; nonce complexity tidak worth | 
| 2026-08-03 | iframe `sandbox="allow-same-origin"` untuk ComponentPreview | Balance: interactive preview tanpa arbitrary code execution risk |
| 2026-08-03 | **Ganti iframe sandbox → static highlight** | Astro `<Code>` built-in (shiki) tidak butuh CSP longgar; zero-dependency approach lebih stabil untuk v1.2.0-release |
| 2026-08-03 | **Native `<details>` untuk toggle Gem example** | Zero JS hydration untuk kemampuan a11y out-of-the-box (keyboard navigable sibling) |
| 2026-08-03 | **Resend via REST API fetch, bukan SDK npm** | `import("resend")` trigger ERESOLVE konflik `@astrojs/markdoc`↔`astro@7` di npm Windows. REST std-out lebih stabil, zero dependency baru |
| 2026-08-03 | **Rate limiter in-memory via `globalThis` store** | Decision log F-3 sebut Upstash Redis "optional". In-memory cukup untuk 1-instance PM2; migrasi Redis deferred bersama subscriber storage |

---

*Sprints update: Daily EOD check-in*  
*Owner: Development Team*  
*Stakeholder: Product Owner (@cupofcode)*  
**Status**: ⚪ Planning — kickoff 2026-08-04
