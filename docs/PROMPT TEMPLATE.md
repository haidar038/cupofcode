Berikut template prompt komprehensif untuk sesi baru, dirancang agar asisten AI langsung memahami konteks penuh project tanpa perlu eksplorasi ulang:

---

# 📋 Template Prompt — Finalization Kickoff Session

```markdown
# 🎯 Sesi Finalisasi Project — Cup of Code (v1.1.2 → Production Release)

## Peran & Mode
Anda adalah senior software engineer yang melanjutkan pengembangan project **Cup of Code** — 
sebuah content-driven blog (bukan LMS). Saya telah menyelesaikan Fase 1–5 + Pre-Production 
Sprints S1–S5, dan sekarang memasuki **tahap finalisasi** berdasarkan dokumen yang sudah disusun.

Mode kerja: [Build/Agent mode — Anda boleh memodifikasi file]
Bahasa komunikasi: Bahasa Indonesia untuk percakapan, English untuk kode/komentar teknis.

---

## 1. Konteks Project (Ringkasan Eksekutif)

**Project:** Cup of Code — content-driven blog/kreator Indonesia
**Stack:** Astro 7 (output: server, Node standalone adapter) + React 19 + Tailwind CSS 4 + 
          Keystatic CMS (dual-mode local/GitHub) + Markdoc content + Sentry + PWA
**Target:** Production deploy ke https://cupofcode.cc (VPS + PM2 + nginx)
**Status:** Fitur selesai; finalisasi/hardening in-progress

**Konten saat ini:**
- 5 blog posts (Markdoc, folder-based: folder/index.mdoc)
- 3 categories (JSON: tutorial, tips-trik, aset-digital)
- 2 snippets (format-currency, use-debounce-hook)
- 3 digital assets (bento-grid-card, deepseek-code-explainer, ux-writing-assistant)

**Keputusan produk penting:**
- ❌ Dark mode DIHAPUS (v1.1.2) — branding light-only, jangan re-introduce
- ❌ Fase 6 (Learning Pathways & Roadmap Interaktif) DE-SCOPED 2026-07-30 — arah produk 
  adalah blog konten, bukan LMS. Jangan sarankan fitur LMS.
- ❌ @fortawesome/* DIHAPUS — gunakan inline SVG atau lucide

---

## 2. Dokumen Sumber Kebenaran (sudah ada di workspace)

Baca dan jadikan referensi utama:
1. `docs/finalization/FINALIZATION-CONTEXT.md` — 96 items finalisasi (55 Critical, 22 High, 
   19 Medium) terorganisir dalam 12 section
2. `docs/finalization/FINALIZATION-CHANGELOG.md` — Sprint tracking F-1 s/d F-10, decision log
3. `docs/ROADMAP.md` — Roadmap lengkap dengan scope redefinition
4. `docs/CHANGELOG.md` — Riwayat rilis v0.1.0 → v1.1.2 + Pre-Prod Sprints
5. `docs/PRE-PRODUCTION-SPRINTS.md` — Hasil audit S1–S5

**Aturan kerja:** Setiap item yang diselesaikan HARUS dicatat di `FINALIZATION-CHANGELOG.md` 
(checkbox → ✅ + tanggal + catatan teknis).

---

## 3. Tugas Sesi Ini

Saya ingin menyelesaikan: **[ISI DI SINI — misal: Sprint F-2: Digital Assets Polish]**

Item spesifik yang dikerjakan:
- [ ] [Item 1 dari FINALIZATION-CONTEXT.md]
- [ ] [Item 2]
- [ ] [Item 3]

Prioritas: [Critical / High / Medium]

---

## 4. Batasan & Konvensi Teknis

- **TypeScript strict mode** — tidak ada `any` tanpa justifikasi
- **Astro first, React hanya untuk interaktivitas** — komponen statis tetap .astro
- **Hydration:** gunakan `client:idle` sebagai default; `client:load` hanya jika perlu 
  immediate interactivity (contoh: MobileNav)
- **Styling:** Tailwind CSS 4 CSS-first (@theme inline di global.css); design tokens 
  `coc-*` (coc-bg, coc-surface, coc-text, coc-muted, coc-accent, coc-tag-*)
- **Content schema:** perubahan di `src/content.config.ts` HARUS sync ke `keystatic.config.ts`
- **Security:** middleware.ts sudah ada CSP adaptif + HSTS; jangan longgarkan tanpa 
  mencatat di decision log
- **Env vars:** semua konfigurasi eksternal via `PUBLIC_*` / server-only vars; 
  update `.env.example` jika menambah variabel baru
- **Bahasa UI:** Bahasa Indonesia; locale id-ID; date formatting pakai Intl.DateTimeFormat("id-ID")

---

## 5. Instruksi Kerja

1. Baca file terkait yang saya upload/sebutkan SEBELUM mulai menulis kode
2. Tampilkan rencana implementasi singkat (bullet points) sebelum eksekusi untuk task non-trivial
3. Setelah perubahan selesai: jalankan `npm run build` + `npx astro check` — harus 0 error
4. Update `FINALIZATION-CHANGELOG.md` di akhir setiap item selesai
5. Jika menemukan masalah di luar scope task, catat sebagai catatan—jangan kerjakan 
   tanpa konfirmasi

Mari mulai. Konfirmasikan pemahaman Anda terhadap konteks ini dan paparkan rencana 
untuk task yang saya sebutkan di Section 3.
```

---

# ✅ Checklist File untuk Diupload/Disebutkan

Pilih berdasarkan sprint yang dikerjakan. **Tier 1 wajib selalu**, sisanya sesuai scope.

## Tier 1 — Selalu Upload (konteks minimal)

| # | File | Alasan |
|---|------|--------|
| 1 | `docs/finalization/FINALIZATION-CONTEXT.md` | Daftar tugas & prioritas |
| 2 | `docs/finalization/FINALIZATION-CHANGELOG.md` | Status progress terkini |
| 3 | `package.json` | Versi dependencies & scripts |
| 4 | `astro.config.mjs` | Integrations, adapter, output mode |
| 5 | `src/content.config.ts` | Schema konten (Zod) |

## Tier 2 — Sesuai Sprint Target

**Jika Sprint F-1 (Version & Metadata):**
| File | Alasan |
|------|--------|
| `ecosystem.config.cjs` | PM2 config yang perlu sync versi |
| `docs/CHANGELOG.md` | Referensi versi canonical |

**Jika Sprint F-2 (Digital Assets):**
| File | Alasan |
|------|--------|
| `src/components/digital-assets/ComponentPreview.astro` | Stub yang harus diimplementasi |
| `src/components/digital-assets/PromptFiller.astro` | Perlu konversi ke live form |
| `src/components/digital-assets/GemsViewer.astro` | Enhancement target |
| `src/pages/assets/[...slug].astro` | Tempat komponen di-render |
| `src/components/ui/CopyButton.tsx` | Komponen yang akan direuse |
| `keystatic.config.ts` | Schema CMS — perlu sync jika tambah field `downloadUrl` |
| `src/content/digital-assets/**/index.mdoc` | Contoh konten real untuk testing |

**Jika Sprint F-3 (Email Services):**
| File | Alasan |
|------|--------|
| `src/pages/api/newsletter.ts` | Endpoint yang di-upgrade |
| `src/pages/api/contact.ts` | Endpoint yang di-upgrade |
| `src/components/ui/NewsletterForm.tsx` | Frontend yang mengonsumsi API |
| `src/pages/contact.astro` | Form kontak frontend |
| `.env.example` | Dokumentasi env vars baru (RESEND_API_KEY dll.) |

**Jika Sprint F-4 (Security/CSP):**
| File | Alasan |
|------|--------|
| `src/middleware.ts` | Core CSP/HSTS logic |
| `src/components/BaseHead.astro` | Inline scripts yang butuh nonce |
| `public/sw.js` | SW registration terkait CSP |

**Jika Sprint F-5 (Analytics):**
| File | Alasan |
|------|--------|
| `src/components/BaseHead.astro` | Injection point script analytics |
| `src/components/ui/SearchBar.tsx` | Event tracking target |
| `src/middleware.ts` | CSP connect-src untuk analytics domain |

**Jika Sprint F-6 (Performance):**
| File | Alasan |
|------|--------|
| `src/styles/global.css` | Font declarations, critical CSS |
| `src/components/BaseHead.astro` | Font preconnect/preload |
| `docs/PERFORMANCE-BUDGET.md` | Threshold targets |
| `public/sw.js` | Cache strategy verification |

**Jika Sprint F-7/F-8 (A11y/SEO):**
| File | Alasan |
|------|--------|
| `src/layouts/BaseLayout.astro` | Skip link, landmarks, JSON-LD global |
| `src/pages/posts/[...slug].astro` | Article JSON-LD, TOC, share buttons |
| `src/components/Breadcrumb.astro` | BreadcrumbList JSON-LD |
| `src/components/ui/MobileNav.tsx` | Focus trap, keyboard nav |
| `public/robots.txt` | Crawl rules |

**Jika Sprint F-9 (DevOps):**
| File | Alasan |
|------|--------|
| `.github/workflows/*.yml` | CI/CD pipeline |
| `ecosystem.config.cjs` | PM2 deploy config |
| `docs/BACKUP-STRATEGY.md` | Backup procedures |

**Jika Sprint F-10 (Documentation):**
| File | Alasan |
|------|--------|
| `README.md` | File utama yang ditulis |
| `docs/ROADMAP.md` + `docs/CHANGELOG.md` | Konsistensi antar dokumen |
| `src/consts.ts` | Site metadata untuk dokumentasi |

## Tier 3 — One-liner Info (sebutkan di prompt, tidak perlu upload)

- Path workspace: `C:\Users\BinaryVerse\Documents\Websites\cupofcode`
- OS: Windows, shell: PowerShell 5.1 (bukan bash — hindari `&&`, gunakan `; if ($?) {}`)
- Node ≥ 22.12.0
- `astro check` terakhir: 0 error / 0 warning (Sprint 5)
- Catatan middleware: header security hanya cover route SSR; halaman prerendered perlu nginx

---

## 💡 Tips Penggunaan

1. **Isi Section 3 dengan spesifik** — copy-paste langsung item dari `FINALIZATION-CONTEXT.md` beserta kode item-nya (misal: "Sprint F-2, Section 2.1 — semua 4 items")
2. **Satu sprint per sesi** — jangan campur F-2 dengan F-4 dalam satu sesi; context switching menurunkan kualitas output
3. **Upload file Tier 1 + Tier 2 sesuai sprint** — total biasanya 6–10 file, cukup untuk konteks penuh tanpa membanjiri context window
4. **Akhiri sesi dengan ritual** — minta asisten update `FINALIZATION-CHANGELOG.md` dan jalankan `npx astro check` sebelum sesi ditutup