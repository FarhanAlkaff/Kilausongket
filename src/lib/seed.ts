import { getDb, generateId, generateSlug } from "../lib/db";
import bcrypt from "bcryptjs";

// This file seeds the database with initial data from the existing products.ts

export function seedDatabase() {
  const db = getDb();

  // Seed admin
  const existingAdmin = db.prepare("SELECT id FROM admins LIMIT 1").get();
  if (!existingAdmin) {
    const id = generateId();
    const hashedPassword = bcrypt.hashSync("admin123", 12);
    db.prepare(
      "INSERT INTO admins (id, username, password, name) VALUES (?, ?, ?, ?)"
    ).run(id, "admin", hashedPassword, "Administrator");
  }

  // Seed store settings
  const existingSettings = db.prepare("SELECT id FROM store_settings LIMIT 1").get();
  if (!existingSettings) {
    db.prepare(`
      INSERT INTO store_settings (id, name, tagline, whatsapp_number, whatsapp_display, shopee_url, instagram_url, tiktok_url, email, operational_hours, address, hero_title, hero_subtitle, about_text)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "main",
      "Kilau Songket",
      "Keanggunan Warisan Songket Nusantara untuk Seluruh Generasi",
      "6281234567890",
      "+62 812-3456-7890",
      "https://shopee.co.id/kilausongket",
      "https://instagram.com/kilausongket",
      "https://tiktok.com/@kilausongket",
      "halo@kilausongket.com",
      "Senin - Minggu: 08.00 - 21.00 WIB",
      "Sentra Tenun & Butik Kilau Songket, Jl. Kebangsaan No. 88, Indonesia",
      "Keanggunan Warisan Songket untuk Seluruh Generasi",
      "Koleksi setelan songket premium untuk anak-anak dan dewasa dengan furing katun lembut anti-gatal. Dibuat dengan benang emas berkualitas tinggi.",
      "Kilau Songket lahir dari kecintaan mendalam terhadap warisan tenun songket nusantara. Kami percaya setiap helai benang emas yang terjalin menyimpan cerita keagungan budaya yang patut dilestarikan."
    );
  }

  // Seed categories
  const existingCats = db.prepare("SELECT id FROM categories LIMIT 1").get();
  if (!existingCats) {
    const categories = [
      { slug: "all", label: "Semua Koleksi", description: "Seluruh pilihan busana songket eksklusif anak dan dewasa", badge: null, sort_order: 0 },
      { slug: "anak", label: "Songket Anak (1-12 Th)", description: "Pakaian adat anak nyaman, furing katun adem anti-gatal", badge: "Terlaris", sort_order: 1 },
      { slug: "dewasa", label: "Songket Dewasa (Pria & Wanita)", description: "Setelan kurung wanita elegan & kemeja pria berwibawa", badge: "Elegan", sort_order: 2 },
      { slug: "sarimbit", label: "Sarimbit Keluarga", description: "Koleksi serasi ayah, ibu, dan anak untuk hari istimewa", badge: "Eksklusif", sort_order: 3 },
    ];

    const stmt = db.prepare("INSERT INTO categories (id, slug, label, description, badge, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
    for (const cat of categories) {
      stmt.run(generateId(), cat.slug, cat.label, cat.description, cat.badge, cat.sort_order);
    }
  }

  // Seed products
  const existingProducts = db.prepare("SELECT id FROM products LIMIT 1").get();
  if (!existingProducts) {
    const products = [
      {
        slug: "ks-01",
        name: "Setelan Songket Cilik Panglima Emas (Anak Laki-laki)",
        category: "anak",
        sub_category: "anak-laki",
        category_label: "Songket Anak Laki-laki",
        price: 385000,
        original_price: 450000,
        images: JSON.stringify([
          "/images/logo.jpg",
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
        ]),
        motif: "Lepus Bintang Berlian Klasik",
        material: "Songket Tenun Halus Grade A & Benang Emas Metalik",
        furing: "Katun Silky Lembut (Hypoallergenic, Dingin & Anti Gatal)",
        available_sizes: JSON.stringify(["1-2 Th (XS)", "3-4 Th (S)", "5-6 Th (M)", "7-8 Th (L)", "9-11 Th (XL)"]),
        colors: JSON.stringify(["Deep Emerald Green", "Maroon Royal", "Navy Gold"]),
        is_featured: 1,
        is_best_seller: 1,
        is_new: 0,
        rating: 4.9,
        sold_count: 142,
        description: "Setelan baju adat songket mewah khusus anak laki-laki yang dirancang dengan furing katun silky super lembut. Tidak kaku, tidak menusuk, dan sangat nyaman dipakai berjam-jam saat acara pawai adat, khitanan, pernikahan keluarga, maupun hari raya. Dilengkapi dengan peci/tanjak senada.",
        specs: JSON.stringify([
          { label: "Paket Termasuk", value: "Baju Atasan Songket, Celana Senada, Tanjak Cilik" },
          { label: "Bahan Furing", value: "Katun Silky Premium Adem" },
          { label: "Pinggang Celana", value: "Full Karet Elastis Nyaman" },
          { label: "Rekomendasi Acara", value: "Karnaval TK/SD, Sunatan, Pendamping Pengantin, Acara Adat" }
        ]),
        shopee_url: "https://shopee.co.id/kilausongket",
      },
      {
        slug: "ks-02",
        name: "Baju Kurung Songket Putri Mayang (Anak Perempuan)",
        category: "anak",
        sub_category: "anak-perempuan",
        category_label: "Songket Anak Perempuan",
        price: 395000,
        original_price: 475000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
        ]),
        motif: "Tabur Bunga Melati Emas",
        material: "Tenun Songket Sutra Sintetis Lemas Jatuh",
        furing: "Full Double-Lining Furing Katun Adem",
        available_sizes: JSON.stringify(["2-3 Th (XS)", "4-5 Th (S)", "6-7 Th (M)", "8-9 Th (L)", "10-12 Th (XL)"]),
        colors: JSON.stringify(["Champagne Gold", "Blush Peach", "Emerald Green", "Ruby Maroon"]),
        is_featured: 1,
        is_best_seller: 1,
        is_new: 0,
        rating: 5.0,
        sold_count: 189,
        description: "Keanggunan busana songket cilik untuk putri tercinta. Menggunakan kombinasi tenun motif bunga melati berkilau dengan furing ganda yang mencegah rasa gatal pada kulit sensitif anak.",
        specs: JSON.stringify([
          { label: "Paket Termasuk", value: "Baju Kurung Songket, Rok Span Lipit, Selendang Kecil" },
          { label: "Furing", value: "Katun Ero Lembut Anti-Alergi" },
          { label: "Resleting", value: "YKK Invisible Back Zipper" },
          { label: "Rekomendasi Acara", value: "Hari Kartini, Pentas Seni, Pesta Keluarga, Foto Studio" }
        ]),
        shopee_url: "https://shopee.co.id/kilausongket",
      },
      {
        slug: "ks-03",
        name: "Koleksi Sarimbit Songket Keluarga Kirana Dirgahayu",
        category: "sarimbit",
        sub_category: "sarimbit",
        category_label: "Sarimbit Keluarga",
        price: 1350000,
        original_price: 1580000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        ]),
        motif: "Pucuk Rebung Raja & Limar Kencana",
        material: "Songket Tenun Benang Tembaga Emas Eksklusif",
        furing: "Premium Silk Habutai & Katun Silky",
        available_sizes: JSON.stringify(["Ayah (M, L, XL, XXL)", "Ibu (S, M, L, XL)", "Anak Laki (1-10 Th)", "Anak Perempuan (1-10 Th)", "Custom Size"]),
        colors: JSON.stringify(["Deep Forest Green & Gold", "Midnight Navy & Silver", "Royal Maroon & Gold"]),
        is_featured: 1,
        is_best_seller: 0,
        is_new: 1,
        rating: 5.0,
        sold_count: 78,
        description: "Paket serasi keluarga mewah untuk momen sakral dan hajatan besar.",
        specs: JSON.stringify([
          { label: "Pilihan Set", value: "Bisa pesan 3 pcs (Ayah + Ibu + 1 Anak) atau 4 pcs (+ 2 Anak)" },
          { label: "Layanan Khusus", value: "Bisa Custom Ukuran Tubuh (Bust / Waist / Panjang Celana)" },
          { label: "Kemasan", value: "Exclusive Hardbox & Greeting Card Kilau Songket" },
          { label: "Waktu Jahit Custom", value: "Ready Stock & Fast Pre-Order (3-5 Hari)" }
        ]),
        shopee_url: "https://shopee.co.id/kilausongket",
      },
      {
        slug: "ks-04",
        name: "Setelan Kebaya Kurung Songket Anggun Nirmala (Dewasa Wanita)",
        category: "dewasa",
        sub_category: "dewasa-wanita",
        category_label: "Songket Wanita Dewasa",
        price: 680000,
        original_price: 799000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
        ]),
        motif: "Cantik Manis Palembang Serat Kilau",
        material: "Songket ATBM Tradisional Kombinasi Sutra Halus",
        furing: "Trikot Furing Halus Menempel di Badan",
        available_sizes: JSON.stringify(["S", "M", "L", "XL", "XXL", "Custom Size"]),
        colors: JSON.stringify(["Deep Forest Green", "Champagne Gold", "Rose Gold", "Onyx Black Gold"]),
        is_featured: 1,
        is_best_seller: 1,
        is_new: 0,
        rating: 4.9,
        sold_count: 230,
        description: "Busana kurung modern wanita dengan potongan fitted yang melangsingkan dan siluet elegan.",
        specs: JSON.stringify([
          { label: "Paket Termasuk", value: "Tunik Songket, Rok Span Belah Belakang, Selendang Senada" },
          { label: "Detail Jahitan", value: "Kupnat Depan & Belakang, Resleting Jepang" },
          { label: "Panjang Baju", value: "90 cm (Tutup Pinggul)" },
          { label: "Panjang Rok", value: "98 cm dengan Karet Pinggang Kiri-Kanan" }
        ]),
        shopee_url: "https://shopee.co.id/kilausongket",
      },
      {
        slug: "ks-05",
        name: "Kemeja Songket Tenun Satria Bangsawan (Dewasa Pria)",
        category: "dewasa",
        sub_category: "dewasa-pria",
        category_label: "Songket Pria Dewasa",
        price: 495000,
        original_price: 575000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        ]),
        motif: "Geometris Songket Rantai Raja",
        material: "Kombinasi Katun Primisima Lembut & Panel Songket Tenun",
        furing: "Full Furing Hero Adem Menyerap Keringat",
        available_sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
        colors: JSON.stringify(["Emerald Green Gold", "Charcoal Black Gold", "Navy Silver"]),
        is_featured: 1,
        is_best_seller: 0,
        is_new: 0,
        rating: 4.8,
        sold_count: 165,
        description: "Kemeja pria formal eksklusif beraksen panel songket tenun tangan di bagian dada dan manset lengan.",
        specs: JSON.stringify([
          { label: "Kerah", value: "Mandarin Collar (Kerah Shanghai) Berdiri Kokoh" },
          { label: "Kancing", value: "Kancing Tersembunyi (Fly Front) Rapi Minimalis" },
          { label: "Lengan", value: "Lengan Panjang Berkancing Songket" },
          { label: "Kantong", value: "Kantong Paspol Depan Presisi" }
        ]),
        shopee_url: "https://shopee.co.id/kilausongket",
      },
      {
        slug: "ks-06",
        name: "Setelan Songket Balita Pangeran Kecil (6 Bln - 2 Tahun)",
        category: "anak",
        sub_category: "anak-laki",
        category_label: "Songket Balita & Batita",
        price: 295000,
        original_price: 345000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
        ]),
        motif: "Miniatur Songket Melati Emas",
        material: "Songket Katun Tenun Super Soft Anti-Iritasi",
        furing: "100% Katun Bambu Organik Extra Soft",
        available_sizes: JSON.stringify(["6-12 Bulan", "12-18 Bulan", "18-24 Bulan"]),
        colors: JSON.stringify(["Ivory Gold", "Forest Green Gold", "Royal Navy"]),
        is_featured: 0,
        is_best_seller: 0,
        is_new: 1,
        rating: 5.0,
        sold_count: 94,
        description: "Spesial untuk si kecil batita/balita! Furing katun bambu yang luar biasa lembut.",
        specs: JSON.stringify([
          { label: "Bahan Khusus", value: "Ultra-Soft Cotton Songket ramah kulit bayi" },
          { label: "Bukaan", value: "Kancing snap leher lebar agar mudah dipakaikan" },
          { label: "Celana", value: "Desain elastis longgar muat popok/diapers" },
          { label: "Aksesoris", value: "Termasuk topi tanjak mini karet elastis" }
        ]),
        shopee_url: "https://shopee.co.id/kilausongket",
      },
      {
        slug: "ks-07",
        name: "Set Baju Adat Songket Dara Jelita Cilik (Anak Perempuan)",
        category: "anak",
        sub_category: "anak-perempuan",
        category_label: "Songket Anak Perempuan",
        price: 420000,
        original_price: 490000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        ]),
        motif: "Naga Besaung & Bunga Cina Emas",
        material: "Tenun Songket Gradasi Halus Lemas",
        furing: "Double Katun Jepang Adem",
        available_sizes: JSON.stringify(["3-4 Th (S)", "5-6 Th (M)", "7-8 Th (L)", "9-10 Th (XL)"]),
        colors: JSON.stringify(["Ruby Red Gold", "Champagne Gold", "Emerald Teal"]),
        is_featured: 0,
        is_best_seller: 0,
        is_new: 0,
        rating: 4.9,
        sold_count: 112,
        description: "Pilihan terbaik untuk foto keluarga, pentas seni sekolah, dan karnaval busana adat anak.",
        specs: JSON.stringify([
          { label: "Bahan Furing", value: "Katun Jepang Dingin Menyerap Keringat" },
          { label: "Rok", value: "Model Rok Span Instan dengan Belahan Lipat Tertutup" },
          { label: "Aksesoris", value: "Termasuk Selendang Bahu Cilik Senada" }
        ]),
        shopee_url: "https://shopee.co.id/kilausongket",
      },
      {
        slug: "ks-08",
        name: "Setelan Beskap & Kain Songket Sampin Bangsawan (Pria Dewasa)",
        category: "dewasa",
        sub_category: "dewasa-pria",
        category_label: "Songket Pria Dewasa",
        price: 890000,
        original_price: 1050000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        ]),
        motif: "Lepus Bintang Penuh & Pucuk Rebung Tembaga",
        material: "Kain Songket Tenun Tangan Asli & Wool Semi-Formal Beskap",
        furing: "Full Satin Silk Suiting",
        available_sizes: JSON.stringify(["M", "L", "XL", "XXL", "Custom Size"]),
        colors: JSON.stringify(["Deep Emerald & Gold", "Classic Black & Gold", "Royal Navy & Silver"]),
        is_featured: 0,
        is_best_seller: 0,
        is_new: 1,
        rating: 4.9,
        sold_count: 63,
        description: "Set busana adat pria premium lengkap: Jas Beskap modern berpotongan rapi.",
        specs: JSON.stringify([
          { label: "Kelengkapan", value: "Jas Beskap, Kain Sampin Songket Instan, Tanjak Kepala, Rantai Hiasan" },
          { label: "Kain Sampin", value: "Dilengkapi resleting dan perekat velcro praktis" },
          { label: "Ukuran Tanjak", value: "Bisa disesuaikan dengan lingkar kepala" }
        ]),
        shopee_url: "https://shopee.co.id/kilausongket",
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO products (id, slug, name, category, sub_category, category_label, price, original_price, images, motif, material, furing, available_sizes, colors, is_featured, is_best_seller, is_new, rating, sold_count, description, specs, shopee_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    products.forEach((p, i) => {
      stmt.run(
        generateId(), p.slug, p.name, p.category, p.sub_category, p.category_label,
        p.price, p.original_price, p.images, p.motif, p.material, p.furing,
        p.available_sizes, p.colors, p.is_featured, p.is_best_seller, p.is_new,
        p.rating, p.sold_count, p.description, p.specs, p.shopee_url, i
      );
    });
  }

  // Seed testimonials
  const existingTestimonials = db.prepare("SELECT id FROM testimonials LIMIT 1").get();
  if (!existingTestimonials) {
    const testimonials = [
      { name: "dr. Amanda Kartika", city: "Jakarta Selatan", role: "Pelanggan Sarimbit Keluarga", event: "Resepsi Pernikahan Keluarga", rating: 5, content: "Awalnya ragu beli songket untuk anak umur 4 tahun karena takut gerah dan gatal. Ternyata baju Kilau Songket bagian dalamnya furing katun super halus dan adem banget! Anak saya nyaman seharian di acara kondangan.", product_purchased: "Sarimbit Keluarga Kirana Dirgahayu" },
      { name: "Rian Hidayat, S.T.", city: "Palembang", role: "Pelanggan Songket Pria", event: "Acara Lamaran Adat", rating: 5, content: "Kemeja songketnya berkelas sekali! Kilauan benang emasnya mewah tapi tidak norak. Jahitannya rapi setara butik ternama.", product_purchased: "Kemeja Songket Satria Bangsawan" },
      { name: "Ibu Nurul Fadilah", city: "Bandung", role: "Orang Tua Siswa TK", event: "Karnaval Hari Kartini Sekolah", rating: 5, content: "Baju Kurung Puteri Mayang cantik banget waktu dipakai putri saya. Semua guru dan wali murid memuji penampilannya.", product_purchased: "Baju Kurung Songket Putri Mayang" },
      { name: "Siti Rahmawati, M.Pd.", city: "Surabaya", role: "Pelanggan Kebaya Wisuda", event: "Wisuda Pascasarjana", rating: 5, content: "Jatuh cinta sama motif Cantik Manisnya! Potongannya bikin siluet tubuh kelihatan ramping dan anggun.", product_purchased: "Kebaya Kurung Songket Anggun Nirmala" },
    ];

    const stmt = db.prepare("INSERT INTO testimonials (id, name, city, role, event, rating, content, product_purchased, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    testimonials.forEach((t, i) => {
      stmt.run(generateId(), t.name, t.city, t.role, t.event, t.rating, t.content, t.product_purchased, i);
    });
  }

  // Seed FAQs
  const existingFaqs = db.prepare("SELECT id FROM faqs LIMIT 1").get();
  if (!existingFaqs) {
    const faqs = [
      { question: "Apakah bahan songket Kilau Songket aman dan tidak gatal untuk anak-anak?", answer: "Sangat aman! Seluruh koleksi songket anak Kilau Songket kami lapisi dengan furing katun silky / katun Jepang ganda yang berserat halus dan hypoallergenic." },
      { question: "Bagaimana cara memesan lewat WhatsApp dan Shopee?", answer: "Sangat mudah! Pada halaman produk, Anda cukup klik tombol 'Pesan via WhatsApp' untuk langsung terhubung dengan admin kami. Atau klik tombol 'Beli di Shopee'." },
      { question: "Apakah bisa request ukuran khusus (Custom Size)?", answer: "Bisa! Kami melayani Custom Size untuk dewasa maupun anak-anak. Silakan hubungi admin WhatsApp kami." },
      { question: "Berapa lama proses pengiriman?", answer: "Untuk produk Ready Stock, pesanan dikirim dalam 1x24 jam. Untuk Custom Size / Pre-Order, pengerjaan 3-5 hari kerja." },
      { question: "Apakah ada garansi jika ukuran tidak pas?", answer: "Ada! Garansi Tukar Ukuran dalam 3 hari setelah barang diterima, asalkan label belum dilepas dan pakaian belum dicuci." },
    ];

    const stmt = db.prepare("INSERT INTO faqs (id, question, answer, sort_order) VALUES (?, ?, ?, ?)");
    faqs.forEach((f, i) => {
      stmt.run(generateId(), f.question, f.answer, i);
    });
  }
}

