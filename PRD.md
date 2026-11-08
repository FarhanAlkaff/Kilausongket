# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# KILAU SONGKET
### Digital Storefront & Product Catalog

**Versi:** 0.2  
**Status:** Draft – Requirement Refinement  
**Platform:** Web Application  
**Kategori:** Fashion & Songket Clothing  
**Target Pasar:** Anak-anak dan Dewasa

---

## 1. Product Overview

Kilau Songket merupakan platform digital berbasis website yang berfungsi sebagai katalog produk dan media pemasaran toko yang menjual setelan pakaian songket untuk anak-anak maupun dewasa.

Website dirancang dengan pendekatan modern, clean, elegan, dan premium untuk memberikan pengalaman menjelajahi produk yang nyaman bagi pelanggan.

Website menyediakan dua alternatif pemesanan:

1. WhatsApp – pelanggan dapat menghubungi toko secara langsung untuk konsultasi dan pemesanan.
2. Shopee – pelanggan dapat melakukan pembelian melalui marketplace dengan diarahkan ke halaman produk yang sesuai.

Kilau Songket akan menjadi pusat informasi produk yang menghubungkan pelanggan dengan kedua kanal transaksi tersebut.

## 2. Product Objectives

1. Membangun identitas digital dan branding Kilau Songket.
2. Menampilkan katalog produk songket anak dan dewasa.
3. Memudahkan pelanggan menemukan produk berdasarkan kategori.
4. Memberikan informasi produk secara lengkap dan menarik.
5. Mengintegrasikan website dengan WhatsApp dan Shopee.
6. Meningkatkan kepercayaan pelanggan melalui tampilan website profesional.
7. Menyediakan fondasi aplikasi yang dapat dikembangkan menjadi e-commerce mandiri di masa depan.

## 3. Target Users

- Orang tua yang mencari pakaian songket untuk anak.
- Pria dan wanita dewasa yang membutuhkan setelan songket.
- Pelanggan yang mencari pakaian untuk acara formal, pernikahan, wisuda, dan acara adat.
- Pengunjung yang ingin melihat katalog sebelum membeli.
- Pelanggan yang lebih nyaman bertransaksi melalui WhatsApp maupun Shopee.

## 4. Functional Requirements

### A. Homepage

- Navigation bar dengan logo Kilau Songket.
- Hero section dengan foto koleksi unggulan.
- Headline dan deskripsi singkat toko.
- Tombol eksplorasi koleksi.
- Kategori produk anak dan dewasa.
- Produk unggulan.
- Keunggulan toko.
- Testimoni pelanggan.
- Banner promosi.
- Call to action pemesanan.
- Footer berisi informasi toko, kontak, dan media sosial.

### B. Product Catalog

- Menampilkan seluruh produk.
- Filter berdasarkan kategori Anak dan Dewasa.
- Filter berdasarkan jenis produk.
- Fitur pencarian produk.
- Pengurutan produk.
- Informasi nama dan harga produk.
- Foto produk.
- Indikator produk unggulan atau promo jika tersedia.

### C. Product Detail

Setiap produk memiliki halaman detail yang menampilkan:

- Galeri foto produk.
- Nama produk.
- Harga produk.
- Deskripsi produk.
- Pilihan ukuran.
- Pilihan warna atau motif jika tersedia.
- Informasi ketersediaan produk.
- Tombol WhatsApp.
- Tombol Shopee.
- Rekomendasi produk lainnya.

### D. WhatsApp Integration

- Tombol pemesanan melalui WhatsApp.
- Mengarahkan pelanggan ke nomor WhatsApp resmi toko.
- Pesan otomatis berdasarkan produk yang dipilih.
- Informasi produk dimasukkan ke dalam pesan.
- Pelanggan dapat berkonsultasi mengenai ukuran, stok, dan detail produk.

Contoh pesan otomatis:

"Halo Kilau Songket, saya tertarik dengan produk Setelan Songket Premium. Apakah produk ini masih tersedia?"

### E. Shopee Integration

- Setiap produk dapat memiliki link Shopee masing-masing.
- Tombol Beli di Shopee pada halaman detail produk.
- Pelanggan diarahkan langsung ke halaman produk terkait.
- Jika link produk belum tersedia, sistem dapat mengarahkan pelanggan ke halaman utama toko Shopee.
- Link Shopee dapat dikelola melalui dashboard admin.

### F. About Us

- Profil Kilau Songket.
- Cerita dan identitas toko.
- Keunggulan produk.
- Informasi kontak.

### G. Contact & Social Media

- Nomor WhatsApp toko.
- Link toko Shopee.
- Instagram atau media sosial lainnya.
- Alamat toko jika tersedia.
- Jam operasional.
- Google Maps jika tersedia.

### H. Admin Dashboard (Planned)

Dashboard admin disiapkan untuk pengembangan pengelolaan konten dan produk.

Fitur yang direncanakan:

- Login admin.
- Dashboard ringkasan.
- Tambah produk.
- Edit produk.
- Hapus produk.
- Upload dan pengelolaan foto produk.
- Pengelolaan kategori.
- Pengelolaan harga.
- Pengelolaan ukuran dan varian.
- Pengelolaan link Shopee setiap produk.
- Pengaturan nomor WhatsApp toko.
- Pengelolaan banner promosi dan produk unggulan.

## 5. User Journey

### Alur pembelian melalui WhatsApp

1. Pelanggan membuka website Kilau Songket.
2. Pelanggan memilih kategori produk.
3. Pelanggan memilih produk.
4. Pelanggan membuka halaman detail.
5. Pelanggan menekan tombol Pesan via WhatsApp.
6. Sistem membuka WhatsApp dengan pesan otomatis.
7. Pelanggan melanjutkan konsultasi dan transaksi dengan admin toko.

### Alur pembelian melalui Shopee

1. Pelanggan membuka website Kilau Songket.
2. Pelanggan memilih kategori produk.
3. Pelanggan memilih produk.
4. Pelanggan membuka halaman detail.
5. Pelanggan menekan tombol Beli di Shopee.
6. Sistem membuka halaman produk terkait di Shopee.
7. Pelanggan melanjutkan transaksi melalui Shopee.

## 6. UI/UX Design Requirements

Konsep visual:

- Modern Minimalist.
- Premium Fashion Boutique.
- Clean Layout.
- Elegant Typography.
- High Quality Product Photography.
- Responsive Design.

Prinsip desain:

1. Produk menjadi fokus utama.
2. Navigasi sederhana.
3. Penggunaan whitespace yang cukup.
4. Foto produk berkualitas tinggi.
5. Warna identitas konsisten.
6. Tombol pemesanan mudah ditemukan.
7. Pengalaman pengguna optimal pada perangkat mobile.

### Rekomendasi Color Palette

- Deep Forest Green: #263B32
- Champagne Gold: #C5A46D
- Warm Ivory: #F7F4EE
- White: #FFFFFF
- Charcoal: #292724

## 7. Technology Stack

| Komponen | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Next.js |
| Language | TypeScript |
| Frontend | React |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Database | PostgreSQL (planned) |
| ORM | Prisma (planned) |
| Image Storage | Cloudinary (planned) |
| Deployment | Vercel / VPS |

## 8. Non-Functional Requirements

- Responsive pada desktop, tablet, dan smartphone.
- SEO-friendly.
- Optimasi ukuran gambar.
- Loading cepat.
- Keamanan aplikasi.
- Struktur kode modular.
- Mudah dikembangkan dan dipelihara.
- Tautan WhatsApp dan Shopee dapat diperbarui tanpa mengubah tampilan website.

## 9. MVP Scope

Fokus pengembangan versi pertama:

1. Homepage.
2. Katalog produk.
3. Kategori anak dan dewasa.
4. Halaman detail produk.
5. Integrasi WhatsApp.
6. Integrasi Shopee.
7. About Us.
8. Contact.
9. Responsive design.
10. SEO dasar.

Dashboard admin dan database produk menjadi tahap pengembangan lanjutan apabila belum diperlukan pada peluncuran awal.

## 10. Future Development

Fitur yang dapat dikembangkan setelah MVP:

- Dashboard admin lengkap.
- Manajemen produk dan stok.
- Database pelanggan.
- Keranjang belanja.
- Checkout mandiri.
- Integrasi payment gateway.
- Riwayat pesanan.
- Analisis pengunjung website.
- Integrasi API marketplace jika tersedia dan diperlukan.

## 11. Success Criteria

- Website dapat diakses dengan baik pada berbagai perangkat.
- Pengunjung dapat menemukan produk dengan mudah.
- Detail produk tampil lengkap dan informatif.
- Tombol WhatsApp mengarah ke nomor toko yang benar.
- Tombol Shopee mengarah ke produk yang benar.
- Website memiliki tampilan konsisten dengan identitas Kilau Songket.
- Website cepat, responsif, dan mudah dikembangkan.

## 12. Development Roadmap

1. PRD Finalization.
2. Sitemap & User Flow.
3. UI/UX Design.
4. Project Initialization (Node.js & Next.js).
5. Frontend Development.
6. Product Data Management.
7. WhatsApp & Shopee Integration.
8. Testing & Optimization.
9. Deployment.
10. Evaluation & Future Development.