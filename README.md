# NAL PROTO — Website Company Profile, Kad Perniagaan Digital & Katalog Produk

Dibina dengan **Next.js 16** (App Router, TypeScript, Server Actions), **Tailwind CSS v4**,
**PostgreSQL** melalui **Prisma ORM**, dan **NextAuth v5** untuk log masuk admin.

## Ciri-ciri

- Laman utama company profile (logo, tagline, servis, produk pilihan)
- Katalog produk awam dengan penapis kategori (`/produk`)
- Halaman detail produk dengan butang WhatsApp terus (`/produk/[slug]`)
- Kad perniagaan digital + kod QR + muat turun kenalan `.vcf` (`/kad-perniagaan`)
- Halaman hubungi dengan semua saluran (telefon, emel, WhatsApp, alamat) (`/hubungi`)
- **Panel Admin** (`/admin`) — dilindungi log masuk emel & kata laluan, boleh berbilang admin:
  - Tambah / sunting / padam produk, termasuk muat naik banyak gambar
  - Sembunyi/aktifkan produk tanpa memadamnya
  - Kemas kini maklumat syarikat (nama, tagline, tentang kami, kenalan, media sosial)
  - Urus akaun admin lain (tambah/padam pengguna)

## 1. Setup Tempatan (Local Development)

```bash
npm install
```

Salin `.env.example` kepada `.env` dan isikan:

```bash
cp .env.example .env
```

- `DATABASE_URL` — connection string PostgreSQL anda (dibaca oleh `prisma.config.ts` dan oleh
  `src/lib/prisma.ts` semasa runtime)
- `AUTH_SECRET` — jana dengan `openssl rand -base64 32`
- `NEXT_PUBLIC_SITE_URL` — URL laman (guna `http://localhost:3000` untuk local)

> Projek ini menggunakan **Prisma ORM v7**, yang memindahkan connection URL daripada
> `schema.prisma` ke fail `prisma.config.ts` di root projek, dan menggunakan *driver adapter*
> (`@prisma/adapter-pg`) untuk sambungan PostgreSQL. Ini sudah dikonfigurasikan — anda hanya
> perlu isi `DATABASE_URL` dalam `.env`.

Jana Prisma Client, buat jadual dalam database, dan masukkan data contoh:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

Seed akan cipta akaun admin pertama:
- **Emel:** `admin@nalproto.com`
- **Kata laluan:** `ubahsaya123`

> ⚠️ **Tukar kata laluan ini serta-merta** selepas log masuk kali pertama (buat admin baharu
> di `/admin/pengguna` dengan kata laluan sendiri, kemudian padam akaun default ini).
>
> Anda juga boleh tetapkan `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD` sebagai environment
> variable sebelum menjalankan `npm run db:seed` untuk terus guna kelayakan sendiri.

Jalankan server pembangunan:

```bash
npm run dev
```

Buka `http://localhost:3000` untuk laman awam, dan `http://localhost:3000/admin/login` untuk
panel admin.

## 2. Deploy ke Railway (Go-Live)

1. **Push kod ini ke repositori GitHub** (buat repo baharu, `git init`, `git add .`,
   `git commit`, `git push`).
2. Di [Railway](https://railway.app), buat **New Project → Deploy from GitHub repo**, pilih
   repo ini.
3. Tambah plugin **PostgreSQL** ke projek Railway yang sama (`+ New → Database → PostgreSQL`).
   Railway akan sediakan `DATABASE_URL` secara automatik dan boleh dirujuk sebagai
   `${{Postgres.DATABASE_URL}}` dalam tetapan environment variable servis web anda.
4. Di servis web (Next.js), tetapkan **Variables**:
   - `DATABASE_URL` = rujuk kepada Postgres plugin (`${{Postgres.DATABASE_URL}}`)
   - `AUTH_SECRET` = hasil `openssl rand -base64 32`
   - `NEXT_PUBLIC_SITE_URL` = domain Railway anda (cth. `https://nalproto.up.railway.app`)
5. Railway akan jalankan `npm install` (yang memicu `postinstall: prisma generate`) dan
   `npm run build` (yang jalankan `prisma generate && next build`) secara automatik.
6. Selepas deploy pertama berjaya, jalankan migration pada database production melalui
   **Railway Shell** / one-off command pada servis:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
7. Log masuk di `https://domain-anda/admin/login` dengan kelayakan seed, tukar kata laluan,
   dan mula kemas kini tetapan syarikat serta produk.

Anda boleh sambungkan domain custom (cth. `nalproto.com`) melalui tab **Settings → Domains**
pada servis Railway.

## 3. Struktur Projek

```
src/
  app/                    # Laman awam & panel admin (App Router)
    page.tsx              # Laman utama
    produk/                # Katalog & detail produk
    kad-perniagaan/        # Kad perniagaan digital
    hubungi/                # Halaman hubungi
    admin/
      login/                # Log masuk admin (awam)
      (protected)/           # Semua laman admin yang perlu log masuk
        produk/               # Urus produk
        tetapan/              # Tetapan syarikat
        pengguna/             # Urus akaun admin
  components/             # Komponen UI (awam + admin)
  lib/
    actions/               # Server Actions (createProduct, updateSettings, dll.)
    auth.ts                 # Konfigurasi NextAuth
    prisma.ts               # Prisma Client singleton
prisma/
  schema.prisma            # Skema database
  seed.ts                   # Data awal (admin, tetapan, produk contoh)
```

## 4. Nota Teknikal

- **Gambar produk** disimpan terus dalam PostgreSQL (base64, had 3MB setiap gambar) supaya
  tiada perkhidmatan storan luar (cth. S3) diperlukan untuk mula. Sesuai untuk katalog
  bersaiz kecil–sederhana. Jika katalog membesar dengan banyak gambar resolusi tinggi,
  pertimbangkan migrasi ke storan objek (Cloudflare R2 / AWS S3) pada masa hadapan.
- **Reka bentuk** menggunakan tema "blueprint teknikal" (navy + amber + garis grid + tanda
  sudut) yang sepadan dengan identiti logo NAL PROTO.
- Semua tindakan admin (tambah/sunting/padam) disahkan di sisi server (`requireAdmin()`)
  sebagai lapisan keselamatan tambahan selain middleware.

## 5. Skrip Berguna

| Skrip                | Fungsi                                             |
|-----------------------|-----------------------------------------------------|
| `npm run dev`          | Jalankan server pembangunan                         |
| `npm run build`        | Jana Prisma Client + build production               |
| `npm start`             | Jalankan server production (selepas build)          |
| `npm run db:seed`       | Masukkan data awal (admin, tetapan, produk contoh)  |
| `npm run db:migrate`    | Jalankan migration production (`prisma migrate deploy`) |
