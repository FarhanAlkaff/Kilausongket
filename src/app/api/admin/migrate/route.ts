import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/auth";
import { isPostgresAvailable, getPostgresClient } from "@/lib/postgres";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, FAQS, STORE_INFO } from "@/data/products";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  return handleMigration(req);
}

export async function POST(req: NextRequest) {
  return handleMigration(req);
}

async function handleMigration(req: NextRequest) {
  try {
    if (!isPostgresAvailable()) {
      return NextResponse.json(
        {
          success: false,
          error: "POSTGRES_URL atau DATABASE_URL belum terdeteksi. Pastikan database Neon sudah tersambung di Vercel.",
        },
        { status: 400 }
      );
    }

    const sql = getPostgresClient();

    // 1. Create Tables in public schema
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

    // 2. Insert Admin
    const defaultUser = process.env.ADMIN_USERNAME || "admin";
    const defaultPass = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = bcrypt.hashSync(defaultPass, 12);
    await sql.query(
      `INSERT INTO public.admins (id, username, password, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password`,
      ["admin-root", defaultUser, hashedPassword, "Administrator"]
    );

    // 3. Insert Store Settings (Using the actual configured info)
    const customWA = "6281524223045";
    const customWADisplay = "+6281524223045";
    const customShopee = "https://shopee.co.id/kilausongket.id#product_list";
    const customIg = "https://instagram.com/kilausongket.id";
    const customTiktok = "https://tiktok.com/@kilausongket.id";

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
        whatsapp_number = EXCLUDED.whatsapp_number,
        whatsapp_display = EXCLUDED.whatsapp_display,
        shopee_url = EXCLUDED.shopee_url,
        instagram_url = EXCLUDED.instagram_url,
        tiktok_url = EXCLUDED.tiktok_url`,
      [
        STORE_INFO.name,
        STORE_INFO.tagline,
        customWA,
        customWADisplay,
        customShopee,
        customIg,
        customTiktok,
        STORE_INFO.email,
        STORE_INFO.operationalHours,
        STORE_INFO.address,
        (STORE_INFO as any).promoTitle || "",
        (STORE_INFO as any).promoSubtitle || "",
        (STORE_INFO as any).heroTitle || "",
        (STORE_INFO as any).heroSubtitle || "",
        (STORE_INFO as any).aboutText || "",
      ]
    );

    // 4. Insert Categories
    for (const cat of CATEGORIES) {
      await sql.query(
        `INSERT INTO public.categories (id, slug, label, description, badge, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, description = EXCLUDED.description`,
        [cat.id, cat.id, cat.label, cat.description || "", cat.badge || null, 0, 1]
      );
    }

    // 5. Insert Products
    for (let i = 0; i < PRODUCTS.length; i++) {
      const p = PRODUCTS[i];
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
          price = EXCLUDED.price,
          images = EXCLUDED.images,
          description = EXCLUDED.description`,
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
          i,
        ]
      );
    }

    // 6. Insert Testimonials
    for (let i = 0; i < TESTIMONIALS.length; i++) {
      const t = TESTIMONIALS[i] as any;
      await sql.query(
        `INSERT INTO public.testimonials (id, name, city, role, event, rating, content, product_purchased, source, photo_url, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content`,
        [
          t.id ? String(t.id) : `t-${i + 1}`,
          t.name,
          t.city,
          t.role,
          t.event || "",
          t.rating,
          t.content,
          t.productPurchased || "",
          t.source || "shopee",
          t.photoUrl || "",
          1,
          i,
        ]
      );
    }

    // 7. Insert FAQs
    for (let i = 0; i < FAQS.length; i++) {
      const f = FAQS[i] as any;
      await sql.query(
        `INSERT INTO public.faqs (id, question, answer, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET answer = EXCLUDED.answer`,
        [f.id ? String(f.id) : `faq-${i + 1}`, f.question, f.answer, 1, i]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Migrasi data ke Neon Postgres sukses! Semua data toko, katalog, ulasan & kontak WhatsApp sudah aktif.",
      counts: {
        products: PRODUCTS.length,
        categories: CATEGORIES.length,
        testimonials: TESTIMONIALS.length,
        faqs: FAQS.length,
      },
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
