# Refactoring Plan — Migrasi Plausible → Umami (6 files)

**Scope constraint:** Hanya lokasi yang disebut. Env vars sudah aktif. Tidak ada perubahan core logic — murni swap integrasi third-party.

**Catatan kunci API Umami v2:**
- Script tag me-register `window.umami` (bukan `window.plausible`).
- Custom event: `window.umami.track("event_name", { key: "value" })` — data harus flat object (string/number/boolean).
- CSP tetap butuh origin Umami di `script-src` + `connect-src` (sudah ada di middleware, pastikan tidak ikut terhapus).

---

## Task Breakdown per File

### TASK-1 · `src/middleware.ts` — Bersihkan CSP Plausible
**Risiko:** Rendah | **Verifikasi:** `curl -I` cek header CSP

- **Hapus** blok Plausible (line 40–45):
  ```ts
  const plausibleSrc = import.meta.env.PUBLIC_PLAUSIBLE_SRC as string | undefined;
  const plausibleOrigin = originOf(plausibleSrc);
  if (plausibleOrigin) { ... }
  ```
- **Pertahankan** blok Umami (line 47–52) tanpa perubahan — sudah benar: menambahkan `PUBLIC_UMAMI_SRC` origin ke `script-src` dan `connect-src`.
- Update komentar line 39: `// Analytics env-driven` → sebut Umami saja (hilangkan kesan multi-provider aktif).

### TASK-2 · `src/components/BaseHead.astro` — Hapus script tag Plausible
**Risiko:** Rendah | **Verifikasi:** view-source homepage, script Plausible tidak muncul

- **Hapus** variabel (line 20–21): `plausibleDomain`, `plausibleSrc`.
- **Hapus** render block (line 84–88): `<script defer data-domain={plausibleDomain} src={plausibleSrc} />`.
- **Pertahankan** block Umami (line 92–95) sebagai satu-satunya analytics aktif:
  ```html
  <script defer src={umamiSrc} data-website-id={umamiWebsiteId} />
  ```
- Ini juga menghilangkan 2 hint `astro(4000)` dari Plausible script di `astro check`.

### TASK-3 · `src/components/ui/NewsletterForm.tsx` — Swap event `newsletter_signup`
**Risiko:** Rendah | **Verifikasi:** Network tab → POST ke Umami `/api/send` saat signup sukses

Ganti block analytics (line 26–28):
```tsx
// Sebelum
if (typeof window !== "undefined" && typeof (window as any).plausible !== "undefined") {
  (window as any).plausible("newsletter_signup");
}

// Sesudah
if (typeof window !== "undefined" && typeof (window as any).umami?.track === "function") {
  (window as any).umami.track("newsletter_signup");
}
```
Gunakan optional chain `umami?.track === "function"` — Umami script defer bisa belum load saat user interaksi cepat; guard ini mencegah TypeError.

### TASK-4 · `src/pages/contact.astro` — Swap event `contact_submit`
**Risiko:** Rendah | **Verifikasi:** submit form valid → event muncul di Umami dashboard

Ganti (line 163–165):
```js
// Sebelum
if (res.ok && typeof (window as any).plausible !== "undefined") {
    (window as any).plausible("contact_submit");
}

// Sesudah
if (res.ok && typeof (window as any).umami?.track === "function") {
    (window as any).umami.track("contact_submit");
}
```

### TASK-5 · `src/pages/assets/[...slug].astro` — Swap event `asset_download`
**Risiko:** Rendah | **Verifikasi:** klik download → event + custom data terekam

Inline script line 254–260. Ganti isi `trackDownload`:
```js
// Sebelum
if (typeof window.plausible !== 'undefined') {
  window.plausible('asset_download', { props: { title, type } });
}

// Sesudah — Umami pakai flat custom data, bukan nested `props`
if (typeof window.umami?.track === 'function') {
  window.umami.track('asset_download', { title, type });
}
```
**Penting:** Umami tidak menerima nested `{ props: {...} }` ala Plausible — data event langsung flat. Nilai harus primitive (string OK untuk `title`/`type`).

### TASK-6 · `src/pages/privacy.astro` — Sinkronisasi teks legal
**Risiko:** Tidak ada (konten) | **Verifikasi:** visual baca halaman

Section 6 "Layanan Pihak Ketiga" (line 68–69): perbarui agar akurat terhadap provider aktif:
```md
Sebelum: "...(seperti Plausible, Umami, atau Google Analytics)..."
Sesudah: "...menggunakan Umami (self-hosted, privacy-friendly, tanpa cookie)..."
```
Opsional: tambahkan tautan ke kebijakan privasi Umami. Botak keputusan PDPL/PDP — Umami self-hosted tanpa cookie memperkuat narasi compliance halaman ini.

---

## Verifikasi Global (setelah 6 task)

1. **Grep sweep:** `grep -ri "plausible" src/` → 0 match (hanya boleh tersisa di `.env.example`/docs, di luar scope file).
2. `npx astro check` → 0 error (hint `astro(4000)` turun dari 18 → ~16).
3. `npm run build` → sukses.
4. **Runtime E2E:** jalankan dev server, buka DevTools Network:
   - Homepage load → request ke `PUBLIC_UMAMI_SRC` berhasil (200), tidak ada CSP violation di console.
   - Trigger ketiga event → 3 POST ke Umami `/api/send` dengan payload event name benar.
5. **CSP check:** `curl -I` route SSR → `script-src`/`connect-src` memuat origin Umami, tidak ada origin Plausible.

## Catatan Luar Scope (dicatat, tidak dikerjakan)

- `.env.example` masih mendokumentasikan `PUBLIC_PLAUSIBLE_*` — cleanup bersama Sprint F-10 (dokumentasi).
- Fallback GA (`PUBLIC_GA_ID`) di `BaseHead.astro`/middleware masih ada — tidak disentuh karena bukan Plausible dan mungkin masih dipakai sebagai alternatif tersimpan.
- Setelah merge, update Decision Log `FINALIZATION-CHANGELOG.md` dengan entry: *"Migrasi Plausible → Umami (self-hosted) — alasan: [isi dari keputusan Anda], event names tidak berubah (`newsletter_signup`, `contact_submit`, `asset_download`)".*

**Estimasi total: ~30–45 menit.** Urutan persiapan disarankan: TASK-1 & 2 dulu (infra/CSP), lalu TASK-3→5 (event swap identik, bisa paralel), TASK-6 terakhir (konten legal). Siap dieksekusi kapan pun Anda instruksikan.