import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { PRODUCTS, TESTIMONIALS, FAQS } from "@/data/products";

let isInitialized = false;

export function isPostgresAvailable(): boolean {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  return Boolean(url && (url.startsWith("postgres://") || url.startsWith("postgresql://")));
}

export function getPostgresClient() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("POSTGRES_URL or DATABASE_URL is not defined");
  return neon(url);
}

export async function initPostgres(): Promise<void> {
  if (isInitialized || !isPostgresAvailable()) return;

  try {
    const sql = getPostgresClient();

    // 1. Create Admins Table
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Create Products Table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
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

    // 3. Create Categories Table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        label TEXT NOT NULL,
        description TEXT,
        badge TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      )
    `;

    // 4. Create Testimonials Table
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
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

    // 5. Create FAQs Table
    await sql`
      CREATE TABLE IF NOT EXISTS faqs (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      )
    `;

    // 6. Create Store Settings Table
    await sql`
      CREATE TABLE IF NOT EXISTS store_settings (
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

    // Seed Admin
    const admins = await sql`SELECT id FROM admins LIMIT 1`;
    if (admins.length === 0) {
      const defaultUser = process.env.ADMIN_USERNAME || "admin";
      const defaultPass = process.env.ADMIN_PASSWORD || "admin123";
      const hashedPassword = bcrypt.hashSync(defaultPass, 12);
      await sql.query(
        "INSERT INTO admins (id, username, password, name) VALUES ($1, $2, $3, $4)",
        [Date.now().toString(36), defaultUser, hashedPassword, "Administrator"]
      );
    }

    // Seed Settings
    const settings = await sql`SELECT id FROM store_settings LIMIT 1`;
    if (settings.length === 0) {
      await sql.query(
        `INSERT INTO store_settings (id, name, tagline, whatsapp_number, whatsapp_display, shopee_url, instagram_url, tiktok_url, email, operational_hours, address, hero_title, hero_subtitle, about_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
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
        ]
      );
    }

    // Seed Categories
    const cats = await sql`SELECT id FROM categories LIMIT 1`;
    if (cats.length === 0) {
      const defaultCategories = [
        { slug: "all", label: "Semua Koleksi", description: "Seluruh pilihan busana songket eksklusif anak dan dewasa", badge: null, sort_order: 0 },
        { slug: "anak", label: "Songket Anak (1-12 Th)", description: "Pakaian adat anak nyaman, furing katun adem anti-gatal", badge: "Terlaris", sort_order: 1 },
        { slug: "dewasa", label: "Songket Dewasa (Pria & Wanita)", description: "Setelan kurung wanita elegan & kemeja pria berwibawa", badge: "Elegan", sort_order: 2 },
        { slug: "sarimbit", label: "Sarimbit Keluarga", description: "Koleksi serasi ayah, ibu, dan anak untuk hari istimewa", badge: "Eksklusif", sort_order: 3 },
      ];
      for (const cat of defaultCategories) {
        await sql.query(
          "INSERT INTO categories (id, slug, label, description, badge, sort_order) VALUES ($1, $2, $3, $4, $5, $6)",
          [Date.now().toString(36) + Math.random().toString(36).substring(2, 6), cat.slug, cat.label, cat.description, cat.badge, cat.sort_order]
        );
      }
    }

    // Seed Products
    const prods = await sql`SELECT id FROM products LIMIT 1`;
    if (prods.length === 0) {
      for (let i = 0; i < PRODUCTS.length; i++) {
        const p = PRODUCTS[i];
        await sql.query(
          `INSERT INTO products (
            id, slug, name, category, sub_category, category_label, price, original_price,
            images, motif, material, furing, available_sizes, colors,
            is_featured, is_best_seller, is_new, is_active,
            rating, sold_count, description, specs, shopee_url, sort_order
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18,
            $19, $20, $21, $22, $23, $24
          )`,
          [
            p.id,
            p.id,
            p.name,
            p.category,
            p.subCategory,
            p.categoryLabel,
            p.price,
            p.originalPrice || null,
            JSON.stringify(p.images),
            p.motif,
            p.material,
            p.furing,
            JSON.stringify(p.availableSizes),
            JSON.stringify(p.colors),
            p.isFeatured ? 1 : 0,
            p.isBestSeller ? 1 : 0,
            p.isNew ? 1 : 0,
            1,
            p.rating,
            p.soldCount,
            p.description,
            JSON.stringify(p.specs),
            p.shopeeUrl,
            i
          ]
        );
      }
    }

    // Seed Testimonials
    const tests = await sql`SELECT id FROM testimonials LIMIT 1`;
    if (tests.length === 0) {
      for (let i = 0; i < TESTIMONIALS.length; i++) {
        const t = TESTIMONIALS[i];
        await sql.query(
          `INSERT INTO testimonials (id, name, city, role, event, rating, content, product_purchased, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            t.name,
            t.city,
            t.role,
            t.event,
            t.rating,
            t.content,
            t.productPurchased,
            i
          ]
        );
      }
    }

    // Seed FAQs
    const faqRows = await sql`SELECT id FROM faqs LIMIT 1`;
    if (faqRows.length === 0) {
      for (let i = 0; i < FAQS.length; i++) {
        const f = FAQS[i];
        await sql.query(
          "INSERT INTO faqs (id, question, answer, sort_order) VALUES ($1, $2, $3, $4)",
          [Date.now().toString(36) + Math.random().toString(36).substring(2, 6), f.question, f.answer, i]
        );
      }
    }

    isInitialized = true;
  } catch (error) {
    console.error("Postgres initialization warning:", error);
  }
}
