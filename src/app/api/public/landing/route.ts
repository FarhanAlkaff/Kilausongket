import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, FAQS, STORE_INFO } from "@/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
};

export async function GET() {
  try {
    try {
      seedDatabase();
    } catch {}
    const db = getDb();

    // Products
    const productRows = db.prepare("SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC").all() as any[];
    const products = productRows.map((row) => ({
      ...row,
      images: JSON.parse(row.images || "[]"),
      availableSizes: JSON.parse(row.available_sizes || "[]"),
      colors: JSON.parse(row.colors || "[]"),
      specs: JSON.parse(row.specs || "[]"),
      subCategory: row.sub_category,
      categoryLabel: row.category_label,
      originalPrice: row.original_price,
      isFeatured: Boolean(row.is_featured),
      isBestSeller: Boolean(row.is_best_seller),
      isNew: Boolean(row.is_new),
      isActive: Boolean(row.is_active),
      soldCount: row.sold_count,
      shopeeUrl: row.shopee_url,
      sortOrder: row.sort_order,
    }));

    // Categories with count
    const catRows = db.prepare("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC").all() as any[];
    const categories = catRows.map((cat) => {
      let count = 0;
      if (cat.slug === "all") {
        count = products.length;
      } else {
        count = products.filter((p) => p.category === cat.slug).length;
      }
      return {
        id: cat.slug,
        label: cat.label,
        count,
        description: cat.description,
        badge: cat.badge,
      };
    });

    // Testimonials
    const testRows = db.prepare("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC").all() as any[];
    const testimonials = testRows.map((t) => ({
      id: t.id,
      name: t.name,
      city: t.city,
      role: t.role,
      event: t.event,
      rating: t.rating,
      content: t.content,
      productPurchased: t.product_purchased,
      source: t.source || "shopee",
      photoUrl: t.photo_url || "",
    }));

    // FAQs
    const faqRows = db.prepare("SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC").all() as any[];
    const faqs = faqRows.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));

    // Store Settings
    const settings = db.prepare("SELECT * FROM store_settings WHERE id = 'main'").get() as any;
    const storeInfo = settings
      ? {
          name: settings.name,
          tagline: settings.tagline,
          whatsappNumber: settings.whatsapp_number,
          whatsappDisplay: settings.whatsapp_display,
          shopeeUrl: settings.shopee_url,
          instagramUrl: settings.instagram_url,
          tiktokUrl: settings.tiktok_url,
          email: settings.email,
          operationalHours: settings.operational_hours,
          address: settings.address,
          promoTitle: settings.promo_title,
          promoSubtitle: settings.promo_subtitle,
          heroTitle: settings.hero_title,
          heroSubtitle: settings.hero_subtitle,
          aboutText: settings.about_text,
        }
      : null;

    return NextResponse.json(
      {
        success: true,
        data: {
          products,
          categories,
          testimonials,
          faqs,
          storeInfo,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("Public landing DB fallback:", error);
    return NextResponse.json(
      {
        success: true,
        data: {
          products: PRODUCTS,
          categories: CATEGORIES,
          testimonials: TESTIMONIALS,
          faqs: FAQS,
          storeInfo: STORE_INFO,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  }
}

