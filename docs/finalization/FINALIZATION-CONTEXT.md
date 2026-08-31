# Cup of Code — Finalization & Hardening Checklist

> **Dibuat:** 2026-08-03  
> **Status:** On Track  
> **Tujuan:** Menyelesaikan semua technical debt, hardening, dan polish sebelum go-live production.

---

## 1. Version & Metadata Consistency

| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Sync `package.json` version → `v1.1.2` | 🔴 Critical | 5m | ✅ Done (2026-08-03) | Match CHANGELOG; required for CI/CD tagging |
| Update `version` in `ecosystem.config.cjs` | 🟡 Medium | 5m | ✅ Done (2026-08-03) | Via `env.VERSION: '1.1.2'` (PM2 tidak baca root `version`) |
| Set `PRIVATE=false` metadata consistency | 🟡 Medium | 5m | ✅ Done (2026-08-03) | `"private": true` di `package.json` — cegah accidental publish |
| Add `repository.url` field | 🟡 Medium | 5m | ✅ Done (2026-08-03) | `git+https://github.com/cupofcode/cupofcode.git` — verifikasi URL aktual sebelum go-public |

**Acceptance Criteria:**
- `npm version patch/minor/major` berfungsi untuk release tracking
- GitHub releases perlu tag `v1.1.2` untuk match

---

## 2. Digital Assets Feature Completion

### 2.1 ComponentPreview.astro — Live Code Preview
| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Read `asset.variables` → parse component props schema | 🔴 Critical | 2h | ✅ Done (2026-08-03) | Extraction dari raw `.mdoc` via static parser (no eval) |
| Dynamically render React component from string | 🔴 Critical | 3h | ✅ Done (2026-08-03) | Dengan `<Code>` bawaan Astro — static highlight tanpa runtime eval |
| Show code block with syntax highlighting | 🔴 Critical | 1h | ✅ Done (2026-08-03) | Built-in Astro `Code` component (shiki) |
| Add "Copy Code" button | 🔴 Critical | 30m | ✅ Done (2026-08-03) | Reused `CopyButton.tsx` sebelum di-header |

[^1]: **Security Risk**: Rendering user-provided code as executable component berbahaya dalam production. **Solusi**: Render ke iframe sandbox atau use static image preview.

### 2.2 PromptFiller.astro — Live Variables → Copy
| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Parse `asset.variables` from frontmatter | 🔴 Critical | 30m | ✅ Done (2026-08-03) | Passed as props to `PromptFiller.tsx` |
| Create React State for input values | 🔴 Critical | 1h | ✅ Done (2026-08-03) | `useState<Record<string, string>>` per component |
| Template interpolation (`{{variable}}`) | 🔴 Critical | 1h | ✅ Done (2026-08-03) | Real-time typing via `.replace()` pattern |
| Copy button untuk filled prompt | 🔴 Critical | 30m | ✅ Done (2026-08-03) | Reused `CopyButton.tsx` dengan final interpolated text |
| Add character count | 🟡 Medium | 15m | ✅ Done (2026-08-03) | Show `{filledTemplate.length} karakter` |

### 2.3 GemsViewer.astro — Full Feature Parity
| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Instructions editor dengan keyboard nav | 🔴 Critical | 1h | ✅ Done (2026-08-03) | `tabindex="0"` + `aria-label` pada container scroll |
| Copy button (already exists) | ✅ Done | - | ✅ | Implemented in Sprint 4 |
| Show "Usage Tips" section | 🟡 Medium | 30m | ✅ Done (2026-08-03) | Extracted via parsing raw `.md` di `asset.data.body` |
| Add example transformation demo | 🟡 Medium | 1h | ✅ Done (2026-08-03) | Native `<details>` toggle with before/after text |

### 2.4 Download Button — Real File Handling
| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Add `downloadUrl` field ke schema | 🔴 Critical | 10m | ✅ Done (2026-08-03) | `.zip` atau `.md` file — format dinamis allowed |
| Host files di `public/downloads/` | 🔴 Critical | 15m | ⏳ TODO | **Prereq**: Masih dummy URL untuk UI demo — butuh actual file SaaS-ready |
| Disable button jika `isFree === false` | 🔴 Critical | 15m | ✅ Done (2026-08-03) | Conditional render via `isFree && downloadUrl` flag |
| Track download count (Analytics event) | 🟡 Medium | 1h | ✅ Done (2026-08-03) | `window.plausible('asset_download', { props: { title, type } })` |

**File Structure:**
```
public/
└── downloads/
    ├── bento-grid-card.zip
    ├── deepseek-code-explainer.md
    └── ux-writing-assistant.md
```

---

## 3. Backend Services Integration

### 3.1 Newsletter API — Persistent Storage

| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Choose email provider (Resend/Mailchimp/ConvertKit) | 🔴 Critical | 30m | ✅ Done (2026-08-03) | Resend via REST API fetch (no SDK — menghindari konflik peer-deps ADM) |
| Add `RESEND_API_KEY` env var | 🔴 Critical | 5m | ✅ Done (2026-08-03) | Sudah terverifikasi ada oleh user + template di `.env.example` |
| Implement send email logic | 🔴 Critical | 2h | ✅ Done (2026-08-03) | Welcome email via Resend REST, graceful mock mode jika key tidak set |
| Add rate limiting | 🔴 Critical | 1h | ✅ Done (2026-08-03) | In-memory sliding window: 1 req/min per IP |
| Integrate Sentry for error tracking | 🔴 Critical | 30m | ✅ Done (2026-08-03) | `Sentry.captureException()` pada failure + unknown errors |
| Add unsubscribe link | 🟠 High | 1h | ❌ Deferred → P.10 | Butuh data persistence (subscriber storage) terlebih dahulu |
| Double opt-in flow | 🟡 Medium | 4h | ❌ Deferred → P.10 | Keputusan di Appendix A tetap berlaku (MVP pertama) |

**Email Flow:**
```
User submits form → Store to DB (optional: Upstash Redis)
  ↓
Send confirmation via Resend
  ↓
User clicks link → Activate subscription
  ↓
Add to list (notified on new posts)
```

### 3.2 Contact API — Email Notification

| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Same provider as newsletter (DRY) | 🔴 Critical | 5m | ✅ Done (2026-08-03) | Resend REST + shared env vars (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_ADMIN`) |
| Send auto-reply to user | 🟠 High | 1h | ✅ Done (2026-08-03) | "Kami terima pesanmu" dengan reply_to → `EMAIL_ADMIN` |
| Notify admin email | 🔴 Critical | 30m | ✅ Done (2026-08-03) | Non-blocking send dengan error silenced agar auto-reply tetap terjamin |
| Add honeypot field | 🟡 Medium | 30m | ✅ Done (2026-08-03) | Field `website` (hidden, tabindex -1, autocomplete off) — silent 200 jika terisi |
| Rate limit: 5 req/hour per IP | 🔴 Critical | 30m | ✅ Done (2026-08-03) | In-memory sliding window via `globalThis` store |

---

## 4. Security Hardening

| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| **CSP Nonce Migration** — remove `'unsafe-inline'` | 🟠 High | 4h | ⏳ TODO | Astro dynamic nonce support |
| Add nonce to inline scripts | 🟠 High | 2h | ⏳ TODO | `BaseHead.astro`, `Footer.astro` |
| HSTS for prerendered pages | 🔴 Critical | 1h | ⏳ TODO | Verify nginx config |
| Security headers for static assets | 🔴 Critical | 1h | ⏳ TODO | CDN-level config |
| Add `X-Permitted-Cross-Domain-Policies: none` | 🟡 Medium | 5m | ⏳ TODO | Adobe products security |
| COEP/COOP headers | 🟡 Medium | 1h | ⏳ TODO | Cross-origin isolation |
| Audit third-party scripts (GA, Sentry) | 🟡 Medium | 2h | ⏳ TODO | Justify `'unsafe-inline'` usage |

**Nginx Sample (untuk static files):**
```nginx
location /assets/ {
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
}
```

---

## 5. Analytics & Observability

### 5.1 Analytics Provider (Pilih Satu)
| Option | Priority | Effort | Status | Notes |
|--------|----------|--------|--------|-------|
| **Umami** | 🔴 Critical | 2h | ✅ Done (2026-08-04) | Self-hosted, no cookies, GDPR/PDPL compliant — dipilih sebagai provider aktif. Script tag di `BaseHead.astro` via `PUBLIC_UMAMI_SRC`/`PUBLIC_UMAMI_WEBSITE_ID`; CSP middleware allows its origin. |
| ~~Plausible~~ | — | — | ✅ Migrated | Fully removed (2026-08-04 Sprint F-5). All event tracking now `window.umami.track("event")`. |
| Google Analytics 4 | ⏸️ Latent | 1h | — | Env fallback `PUBLIC_GA_ID` masih aktif sebagai opsi; bukan provider utama. |

**Decision:** Umami self-hosted as analytics provider.**
- **Rationale:** Privacy-friendly (no cookies), full control data, GDPR/PDPL compliance tanpa CMP banner. Event names persist across migration.

### 5.2 Event Tracking
| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Track search queries | 🟠 High | 1h | ⏳ TODO | SearchBar search intent — `search_query` via `umami?.track` deferred → P.11 |
| Track asset downloads | 🟠 High | 1h | ✅ Done (2026-08-04) | `assets/[...slug].astro` — `asset_download` via `umami?.track` with flat `{ title, type }` |
| Track share clicks | 🟡 Medium | 30m | ⏳ TODO | `share_twitter`/`share_facebook` via `umami?.track` deferred → P.11 |
| Track newsletter signup | 🔴 Critical | 15m | ✅ Done (2026-08-04) | `NewsletterForm.tsx` — `newsletter_signup` via `umami?.track`; silent failure if script not yet loaded |
| Track 404 errors | 🟠 High | 30m | ⏳ TODO | Direct analytics defers → Sentry for now; Umami event `404_error` optional → P.11 |

### 5.3 Monitoring Setup
| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Sentry sourcemaps upload | 🔴 Critical | 1h | ✅ Done (2026-08-04) | `vite.build.sourcemap: true` in `astro.config.mjs`; auto-upload via integration `sourceMapsUploadOptions.enabled`; `.map` files now land in `dist/client/_astro/` (19 files at build time). Known vite warnings: `astro:content-render-imports` + `astro:transitions` sourcemaps non-blocking. |
| Uptime monitoring (crontab) | 🟠 High | 30m | ✅ Done (2026-08-04) | `/api/health` endpoint created at `src/pages/api/health.ts`; returns `{status, version, uptime, ts}` JSON; `no-cache` cache-control; sitemap filter already excludes `/api/*` |
| Performance dashboard | 🟡 Medium | 4h | ⏳ TODO | Self-hosted Lighthouse CI — defer to Sprint F-6 |
| Error rate alerts | 🟠 High | 1h | ⏳ TODO | Sentry Alerts → Slack/Email — config manual in Sentry UI (Sprint F-5 closing gap) |

---

## 6. Performance Optimization

| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| **Font optimization** — subset Latin + Latin-ext | 🟠 High | 30m | ⏳ TODO | Inter subset vs Google Sans Flex |
| Lazy-load non-critical images | ✅ Done | - | ✅ | Sprint 3 implementation |
| Font display swap | ✅ Done | - | ✅ | `display=swap` at Google Fonts |
| **Critical CSS** — inline above-fold | 🟠 High | 2h | ⏳ TODO | Astro experimental flag |
| **Code splitting** — remove unused components | 🟡 Medium | 1h | ⏳ TODO | Tree-shaking verification |
| Image: WebP fallback | 🟠 High | 1h | ⏳ TODO | `<picture>` for Safari |
| **SW assets precache** verification | 🟠 High | 30m | ⏳ TODO | `sw.js` cache-first manifest |
| Add `loading=lazy` to all images below fold | ✅ Done | - | ✅ | Default attr on `<Image>` |
| Reduce JavaScript payload | 🟡 Medium | 2h | ⏳ TODO | Defer ScrollAnimations |

**Target Budgets:**
```
HTML: < 50KB gzipped
CSS: < 50KB gzipped  
JS:  < 100KB gzipped (React hydration: ~45KB)
Images: WebP < 200KB per image
```

---

## 7. Accessibility Audit & Fixes

| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| **Keyboard nav audit** — all interactive elements | 🔴 Critical | 2h | ⏳ TODO | Tab order, focus visible |
| **ARIA landmarks** — verify main/nav/aside | 🟠 High | 1h | ⏳ TODO | Landmark roles complete? |
| Color contrast check | 🔴 Critical | 1h | ⏳ TODO | All combos ≥ 4.5:1 |
| Screen reader test | 🟠 High | 2h | ⏳ TODO | NVDA + JAWS + VoiceOver |
| Focus trap in Modal/MobileNav | 🟠 High | 1h | ⏳ TODO | Already implemented, verify |
| Reduced motion for animations | ✅ Done | - | ✅ | Sprint 2 verification |
| Alt text for all images | ✅ Done | - | ✅ | Unsplash descriptive alt |
| Skip-to-content link | 🟠 High | 30m | ⏳ TODO | `BaseLayout.astro` add |
| Error message ARIA live regions | 🟡 Medium | 1h | ⏳ TODO | Form errors announce |

**Tools:**
- axe DevTools Chrome extension
- Lighthouse Accessibility audit
- manual keyboard testing

---

## 8. SEO Final Verification

| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Google Rich Results Test | 🔴 Critical | 30m | ⏳ TODO | Verify JSON-LD valid |
| Sitemap XML validasi | 🔴 Critical | 15m | ⏳ TODO | Validator sitemap tool |
| robots.txt verification | 🔴 Critical | 5m | ⏳ TODO | Allow all, sitemap URL |
| Canonical URL consistency | 🔴 Critical | 30m | ⏳ TODO | No duplicate content |
| og:image dimensions (1200x630) | ✅ Done | - | ✅ | Verified Sprint 2 |
| Twitter card validation | 🔴 Critical | 15m | ⏳ TODO | card = summary_large_image |
| Mobile-Friendly Test | 🔴 Critical | 15m | ⏳ TODO | Google Search Console |
| PageSpeed Insights | 🔴 Critical | 30m | ⏳ TODO | Core Web Vitals green |

---

## 9. DevOps & Deployment

### 9.1 CI/CD Pipeline Hardening
| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Add `audit` step — vulnerability scan | 🟠 High | 15m | ⏳ TODO | npm audit or Snyk |
| Bundle size alert | 🟡 Medium | 30m | ⏳ TODO | Size-Limit GitHub Action |
| Deploy preview for PRs | 🟡 Medium | 2h | ⏳ TODO | Netlify/Vercel integration |
| Rollback procedure doc | 🟠 High | 30m | ⏳ TODO | Tag-based restore |
| Secrets audit (.env.*) | 🔴 Critical | 15m | ⏳ TODO | No real credentials committed |
| HTTPS enforcement | 🔴 Critical | 15m | ⏳ TODO | nginx redirect 301 |

### 9.2 Backup & Recovery
| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Verify `BACKUP-STRATEGY.md` reproducible | 🟠 High | 1h | ⏳ TODO | Test restore from Git tags |
| Database backup (future Supabase) | 🟡 Medium | 30m | ⏳ TODO | defer to Post-Launch P.5 |
| `node_modules` cache | 🔴 Critical | 15m | ⏳ TODO | pnpm CI install speedup |

### 9.3 Production Checklist
- [ ] Site load `https://cupofcode.cc` (no www redirect needed)
- [ ] All forms work (newsletter, contact)
- [ ] SearchBar returns results for all pages
- [ ] Sitemap includes only public pages
- [ ] RSS feed valid XML
- [ ] PWA install prompt works
- [ ] Dark mode absence confirmed (match v1.1.2 decision)
- [ ] Analytics events firing correctly
- [ ] Sentry capturing errors
- [ ] Security headers present (securityheaders.com Grade A)

---

## 10. Documentation Finalization

| Item | Priority | Effort | Status | Notes |
|------|----------|--------|--------|-------|
| Write comprehensive `README.md` | 🔴 Critical | 2h | ⏳ TODO | Onboarding guide |
| Add `CONTRIBUTING.md` | 🟡 Medium | 1h | ⏳ TODO | Only if multi-dev |
| Document environment variables reference | 🔴 Critical | 30m | ⏳ TODO | `.env.example` comments |
| Add screenshots to README | 🟡 Medium | 30m | ⏳ TODO | Homepage, posts, assets |
| Swagger/OpenAPI untuk API routes | 🟡 Medium | 2h | ⏳ TODO | `/api/newsletter`, `/api/contact` spec |
| CHANGELOG finalization pass | 🟡 Medium | 30m | ⏳ TODO | Proofread all sections |
| Create GitHub Release Notes v1.1.2 | 🟠 High | 30m | ⏳ TODO | Highlights dari Pre-Prod Sprints |
| Delete outdated `astro-7.1.md` notes | 🟡 Medium | 5m | ⏳ TODO | Space/updating markers |

---

## 11. Post-Launch Roadmap Items (P.1-P.13 de-scoped)

Catatan: Semua items di bawah **de-scoped** (dihapus 2026-07-30). Tidak dikerjakan.

| Former ID | Feature | Status | Notes |
|-----------|---------|--------|-------|
| P.1-P.6 | User Accounts, Download tracking, PAID assets, Dashboard, Rating | ❌ De-scoped | Moved to Post-Launch (est. 3-6 bulan post-launch) |
| P.7-P.8 | ~~Learning Pathways~~, ~~Roadmap Interaktif~~ | ❌ Removed 2026-07-30 | Content-driven blog, bukan LMS |
| P.9-P.13 | Admin Dashboard, Newsletter Engine, i18n, Forum, AI features | ❌ De-scoped | Moved to Post-Launch |

---

## 12. Sign-off Checklist

Sebelum tag `v1.1.2-release`:

- [ ] All Critical items (🔴) completed
- [ ] `npm run build` — 0 errors, 0 warnings
- [ ] Security headers grade A di securityheaders.com
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95
- [ ] JSON-LD valid di Rich Results Test
- [ ] Manual cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Manual mobile (iOS Safari + Android Chrome)
- [ ] Forms tested end-to-end
- [ ] PWA installable + offline mode works
- [ ] GitHub Release created dengan notes lengkap

**Authorized Sign-off:**  
Date: ___________  
Signed: _________________ (Lead Developer)  
Approved: _________________ (Product Owner)

---

## Appendix A: Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-03 | Plausible as analytics provider | Privacy-friendly, GDPR/PDP compliance, Indonesia hosting friendly |
| 2026-08-03 | iframe sandbox for ComponentPreview | Balance display vs security — no arbitrary code execution |
| 2026-08-03 | Defer double opt-in to Post-Launch P.10 | Newsletter MVP first, optimization later |
| 2026-08-03 | Keep posts/[...slug] prerendered | SEO priority > headers flexibility; nginx compensates |
| 2026-08-03 | Remove Google Sans Flex font | Consistency + performance (Inter already loaded); font-display swap prevents layout shift |

## Appendix B: Environment Variables Reference

```bash
# === Production Domain ===
PUBLIC_SITE_URL=https://cupofcode.cc

# === Keystatic CMS ===
KEYSTATIC_STORAGE_KIND=github
KEYSTATIC_GITHUB_OWNER=cupofcode
KEYSTATIC_GITHUB_REPO=cupofcode
GITHUB_TOKEN=github_pat_...  # repo scope only

# === Analytics ===
PUBLIC_PLAUSIBLE_DOMAIN=cupofcode.cc
PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js
# or
PUBLIC_UMAMI_SRC=https://umami.yourdomain.com/script.js
PUBLIC_UMAMI_WEBSITE_ID=uuid-here
# or GA4
PUBLIC_GA_ID=G-XXXXXXXXXX

# === Monitoring ===
PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...  # Sourcemaps upload

# === Email (Resend) ===
RESEND_API_KEY=re_...  
EMAIL_FROM=newsletter@cupofcode.cc
EMAIL_ADMIN=admin@cupofcode.cc
```

---

*Last updated: 2026-08-03*  
*Next review: 2026-08-10 (Weekly check-in until all Critical items resolved)*
