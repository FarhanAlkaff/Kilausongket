const { neon } = require("@neondatabase/serverless");
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Load .env if present
try {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    });
  }
} catch (e) {
  console.log("Could not parse .env:", e.message);
}

const connectionUrl =
  process.argv[2] ||
  process.env.POSTGRES_URL ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres") ? process.env.DATABASE_URL : null);

if (!connectionUrl) {
  console.error("❌ ERROR: Connection string Postgres tidak ditemukan!");
  console.error("Silakan jalankan perintah:");
  console.error('node scripts/migrate.js "postgres://user:password@host/database?sslmode=require"');
  console.error("atau isi POSTGRES_URL=... di dalam file .env");
  process.exit(1);
}

async function runMigration() {
  console.log("🚀 Memulai migrasi data ke Neon Postgres...");
  console.log("Target database:", connectionUrl.replace(/:[^:@]+@/, ":****@"));

  const sql = neon(connectionUrl);
  const sqlitePath = path.join(__dirname, "..", "prisma", "dev.db");
  const sqlite = new Database(sqlitePath);

  // 1. Create Tables
  console.log("\n📦 1. Membuat tabel di schema public...");
  await sql`
    CREATE TABLE IF NOT EXISTS public.admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS public.products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT NOT NULL,
      category_label TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER,
      images TEXT DEFAULT '[]',
      motif TEXT DEFAULT '',
      material TEXT DEFAULT '',
      furing TEXT DEFAULT '',
      available_sizes TEXT DEFAULT '[]',
      colors TEXT DEFAULT '[]',
      is_featured INTEGER DEFAULT 0,
      is_best_seller INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      rating NUMERIC DEFAULT 5.0,
      sold_count INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      specs TEXT DEFAULT '[]',
      shopee_url TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS public.categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      description TEXT,
      badge TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS public.testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      role TEXT NOT NULL,
      event TEXT,
      rating INTEGER DEFAULT 5,
      content TEXT NOT NULL,
      product_purchased TEXT,
      source TEXT DEFAULT 'shopee',
      photo_url TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS public.faqs (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS public.store_settings (
      id TEXT PRIMARY KEY DEFAULT 'main',
      name TEXT DEFAULT 'Kilau Songket',
      tagline TEXT DEFAULT '',
      whatsapp_number TEXT DEFAULT '',
      whatsapp_display TEXT DEFAULT '',
      shopee_url TEXT DEFAULT '',
      instagram_url TEXT DEFAULT '',
      tiktok_url TEXT DEFAULT '',
      email TEXT DEFAULT '',
      operational_hours TEXT DEFAULT '',
      address TEXT DEFAULT '',
      promo_title TEXT DEFAULT '',
      promo_subtitle TEXT DEFAULT '',
      hero_title TEXT DEFAULT '',
      hero_subtitle TEXT DEFAULT '',
      about_text TEXT DEFAULT ''
    )
  `;

  // 2. Migrate Admins
  console.log("👤 2. Migrasi data admin...");
  const admins = sqlite.prepare("SELECT * FROM admins").all();
  for (const a of admins) {
    await sql.query(
      `INSERT INTO public.admins (id, username, password, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, name = EXCLUDED.name`,
      [a.id, a.username, a.password, a.name]
    );
  }
  console.log(`   ✓ ${admins.length} akun admin termigrasi.`);

  // 3. Migrate Categories
  console.log("🏷️  3. Migrasi kategori...");
  const categories = sqlite.prepare("SELECT * FROM categories").all();
  for (const c of categories) {
    await sql.query(
      `INSERT INTO public.categories (id, slug, label, description, badge, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         label = EXCLUDED.label,
         description = EXCLUDED.description,
         badge = EXCLUDED.badge,
         sort_order = EXCLUDED.sort_order,
         is_active = EXCLUDED.is_active`,
      [c.id, c.slug, c.label, c.description, c.badge, c.sort_order, c.is_active]
    );
  }
  console.log(`   ✓ ${categories.length} kategori termigrasi.`);

  // 4. Migrate Products
  console.log("👗 4. Migrasi katalog produk songket...");
  const products = sqlite.prepare("SELECT * FROM products").all();
  for (const p of products) {
    await sql.query(
      `INSERT INTO public.products (
        id, slug, name, category, sub_category, category_label, price, original_price,
        images, motif, material, furing, available_sizes, colors,
        is_featured, is_best_seller, is_new, is_active,
        rating, sold_count, description, specs, shopee_url, sort_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        sub_category = EXCLUDED.sub_category,
        category_label = EXCLUDED.category_label,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        images = EXCLUDED.images,
        motif = EXCLUDED.motif,
        material = EXCLUDED.material,
        furing = EXCLUDED.furing,
        available_sizes = EXCLUDED.available_sizes,
        colors = EXCLUDED.colors,
        is_featured = EXCLUDED.is_featured,
        is_best_seller = EXCLUDED.is_best_seller,
        is_new = EXCLUDED.is_new,
        is_active = EXCLUDED.is_active,
        rating = EXCLUDED.rating,
        sold_count = EXCLUDED.sold_count,
        description = EXCLUDED.description,
        specs = EXCLUDED.specs,
        shopee_url = EXCLUDED.shopee_url,
        sort_order = EXCLUDED.sort_order`,
      [
        p.id, p.slug, p.name, p.category, p.sub_category, p.category_label,
        p.price, p.original_price, p.images, p.motif, p.material, p.furing,
        p.available_sizes, p.colors, p.is_featured, p.is_best_seller, p.is_new, p.is_active,
        p.rating, p.sold_count, p.description, p.specs, p.shopee_url, p.sort_order
      ]
    );
  }
  console.log(`   ✓ ${products.length} produk berhasil termigrasi.`);

  // 5. Migrate Testimonials
  console.log("⭐ 5. Migrasi ulasan / testimoni pembeli...");
  const testimonials = sqlite.prepare("SELECT * FROM testimonials").all();
  for (const t of testimonials) {
    await sql.query(
      `INSERT INTO public.testimonials (id, name, city, role, event, rating, content, product_purchased, source, photo_url, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         city = EXCLUDED.city,
         role = EXCLUDED.role,
         event = EXCLUDED.event,
         rating = EXCLUDED.rating,
         content = EXCLUDED.content,
         product_purchased = EXCLUDED.product_purchased,
         source = EXCLUDED.source,
         photo_url = EXCLUDED.photo_url,
         is_active = EXCLUDED.is_active,
         sort_order = EXCLUDED.sort_order`,
      [t.id, t.name, t.city, t.role, t.event, t.rating, t.content, t.product_purchased, t.source || "shopee", t.photo_url || "", t.is_active !== undefined ? t.is_active : 1, t.sort_order || 0]
    );
  }
  console.log(`   ✓ ${testimonials.length} testimoni termigrasi.`);

  // 6. Migrate FAQs
  console.log("❓ 6. Migrasi FAQ...");
  const faqs = sqlite.prepare("SELECT * FROM faqs").all();
  for (const f of faqs) {
    await sql.query(
      `INSERT INTO public.faqs (id, question, answer, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         question = EXCLUDED.question,
         answer = EXCLUDED.answer,
         is_active = EXCLUDED.is_active,
         sort_order = EXCLUDED.sort_order`,
      [f.id, f.question, f.answer, f.is_active, f.sort_order]
    );
  }
  console.log(`   ✓ ${faqs.length} FAQ termigrasi.`);

  // 7. Migrate Store Settings
  console.log("⚙️  7. Migrasi pengaturan toko, kontak WA & Shopee...");
  const settings = sqlite.prepare("SELECT * FROM store_settings WHERE id = 'main'").get();
  if (settings) {
    await sql.query(
      `INSERT INTO public.store_settings (
        id, name, tagline, whatsapp_number, whatsapp_display, shopee_url,
        instagram_url, tiktok_url, email, operational_hours, address,
        promo_title, promo_subtitle, hero_title, hero_subtitle, about_text
      ) VALUES (
        'main', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        tagline = EXCLUDED.tagline,
        whatsapp_number = EXCLUDED.whatsapp_number,
        whatsapp_display = EXCLUDED.whatsapp_display,
        shopee_url = EXCLUDED.shopee_url,
        instagram_url = EXCLUDED.instagram_url,
        tiktok_url = EXCLUDED.tiktok_url,
        email = EXCLUDED.email,
        operational_hours = EXCLUDED.operational_hours,
        address = EXCLUDED.address,
        promo_title = EXCLUDED.promo_title,
        promo_subtitle = EXCLUDED.promo_subtitle,
        hero_title = EXCLUDED.hero_title,
        hero_subtitle = EXCLUDED.hero_subtitle,
        about_text = EXCLUDED.about_text`,
      [
        settings.name, settings.tagline, settings.whatsapp_number, settings.whatsapp_display,
        settings.shopee_url, settings.instagram_url, settings.tiktok_url, settings.email,
        settings.operational_hours, settings.address, settings.promo_title, settings.promo_subtitle,
        settings.hero_title, settings.hero_subtitle, settings.about_text
      ]
    );
    console.log("   ✓ Pengaturan toko (WhatsApp, Shopee, Alamat) berhasil dimigrasi.");
  }

  console.log("\n🎉 SELAMAT! Migrasi ke Neon Postgres sukses 100%!");
  console.log("Semua data produk, testimoni, FAQ, dan pengaturan toko sudah tersimpan di cloud.");
}

runMigration().catch((err) => {
  console.error("\n❌ Gagal migrasi:", err);
  process.exit(1);
});
