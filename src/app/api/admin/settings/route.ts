import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/settings
export async function GET() {
  try {
    const db = getDb();
    const settings = db.prepare("SELECT * FROM store_settings WHERE id = 'main'").get() as any;

    if (!settings) {
      return NextResponse.json({ success: true, data: {} });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: settings.id,
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
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/settings
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      tagline,
      whatsappNumber,
      whatsappDisplay,
      shopeeUrl,
      instagramUrl,
      tiktokUrl,
      email,
      operationalHours,
      address,
      promoTitle,
      promoSubtitle,
      heroTitle,
      heroSubtitle,
      aboutText,
    } = body;

    const db = getDb();

    db.prepare(`
      INSERT INTO store_settings (
        id, name, tagline, whatsapp_number, whatsapp_display, shopee_url,
        instagram_url, tiktok_url, email, operational_hours, address,
        promo_title, promo_subtitle, hero_title, hero_subtitle, about_text
      ) VALUES (
        'main', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      ON CONFLICT(id) DO UPDATE SET
        name = COALESCE(excluded.name, store_settings.name),
        tagline = COALESCE(excluded.tagline, store_settings.tagline),
        whatsapp_number = COALESCE(excluded.whatsapp_number, store_settings.whatsapp_number),
        whatsapp_display = COALESCE(excluded.whatsapp_display, store_settings.whatsapp_display),
        shopee_url = COALESCE(excluded.shopee_url, store_settings.shopee_url),
        instagram_url = COALESCE(excluded.instagram_url, store_settings.instagram_url),
        tiktok_url = COALESCE(excluded.tiktok_url, store_settings.tiktok_url),
        email = COALESCE(excluded.email, store_settings.email),
        operational_hours = COALESCE(excluded.operational_hours, store_settings.operational_hours),
        address = COALESCE(excluded.address, store_settings.address),
        promo_title = COALESCE(excluded.promo_title, store_settings.promo_title),
        promo_subtitle = COALESCE(excluded.promo_subtitle, store_settings.promo_subtitle),
        hero_title = COALESCE(excluded.hero_title, store_settings.hero_title),
        hero_subtitle = COALESCE(excluded.hero_subtitle, store_settings.hero_subtitle),
        about_text = COALESCE(excluded.about_text, store_settings.about_text)
    `).run(
      name,
      tagline,
      whatsappNumber,
      whatsappDisplay,
      shopeeUrl,
      instagramUrl,
      tiktokUrl,
      email,
      operationalHours,
      address,
      promoTitle,
      promoSubtitle,
      heroTitle,
      heroSubtitle,
      aboutText
    );

    return NextResponse.json({ success: true, message: "Pengaturan berhasil disimpan" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

