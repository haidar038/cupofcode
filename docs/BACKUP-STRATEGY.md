# Backup Strategy — Cup of Code

## Content Backup

Konten Cup of Code disimpan di file-based content collections dalam repository Git:

- **Posts:** `src/content/posts/*.mdoc`
- **Categories:** `src/content/categories/*.json`
- **Snippets:** `src/content/snippets/*/*.mdoc`
- **Digital Assets:** `src/content/digital-assets/*/*.mdoc`

Karena semua konten berada di Git, backup otomatis terjadi setiap kali push ke remote repository.
Untuk keamanan tambahan:

1. **GitHub Remote** — Repository utama di GitHub sebagai source of truth.
2. **Local Clone** — Developer memiliki salinan lokal terbaru.
3. **Git Tags** — Tag rilis dibuat setiap fase selesai sebagai checkpoint.

## Asset & Media Backup

- **Gambar:** Disimpan di `src/assets/` (file statis) dan referensi URL eksternal (Unsplash).
- **Database (future):** Jika ada database di masa depan, backup via Supabase automated backups (jika menggunakan Supabase) atau cron job PostgreSQL dump.

## Automated Backup Recommendations

Untuk production, disarankan:

1. **GitHub Actions backup workflow** — Cron job harian yang melakukan git push otomatis.
2. **Database backup** — Jika menggunakan Supabase, aktifkan Point-in-Time Recovery.
3. **Server snapshot** — Jika menggunakan VPS, buat snapshot mingguan.
4. **Storage backup** — Jika ada user uploads, backup ke S3/Cloudflare R2 secara berkala.

## Recovery Procedure

1. **Konten hilang (content files):** Git checkout dari commit terakhir.
2. **Server down:** Deploy ulang dari CI/CD pipeline.
3. **Database hilang:** Restore dari backup terbaru, lalu verifikasi integritas data.
