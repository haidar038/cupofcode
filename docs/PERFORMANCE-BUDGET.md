# Performance Budget — Cup of Code

> **Target:** Lighthouse 90+ pada semua metrik utama.

## Thresholds

| Metrik | Target | Alat Ukur |
|--------|--------|-----------|
| Lighthouse Performance | ≥ 90 | Lighthouse / PageSpeed Insights |
| Lighthouse Accessibility | ≥ 95 | Lighthouse |
| Lighthouse SEO | ≥ 95 | Lighthouse |
| Lighthouse Best Practices | ≥ 90 | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | CrUX / Lighthouse |
| First Input Delay (FID) / INP | < 200ms | CrUX |
| Cumulative Layout Shift (CLS) | < 0.1 | CrUX / Lighthouse |
| Time to First Byte (TTFB) | < 800ms | Lighthouse / Server log |
| Total Bundle JS | < 200KB | Astro build output / bundle analyzer |
| Total Page Weight | < 1MB (incl. images) | DevTools Network tab |
| Image Optimization | Semua gambar real harus WebP/AVIF via sharp | Astro Image integration |

## Resource Budget

| Resource | Budget |
|----------|--------|
| First-party JS (client) | < 50KB gzipped |
| Third-party JS (analytics, fonts) | < 50KB gzipped |
| CSS (critical inline) | < 30KB |
| Total CSS | < 100KB |
| Fonts (Google Fonts) | < 30KB |

## Enforcement

- Audit otomatis di CI/CD via Lighthouse CI atau PageSpeed Insights API.
- Jika melebihi threshold, build gagal dan perlu optimasi sebelum deploy.
