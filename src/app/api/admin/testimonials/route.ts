import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC").all() as any[];
    const testimonials = rows.map((r) => ({
      id: r.id,
      name: r.name,
      city: r.city,
      role: r.role,
      event: r.event,
      rating: r.rating,
      content: r.content,
      productPurchased: r.product_purchased,
      source: r.source || "shopee",
      photoUrl: r.photo_url || "",
      isActive: Boolean(r.is_active),
      sortOrder: r.sort_order,
    }));
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, city, role, event, rating, content, productPurchased, source, photoUrl, isActive, sortOrder } = body;

    if (!name || !content) {
      return NextResponse.json({ success: false, error: "Nama dan isi testimoni wajib diisi" }, { status: 400 });
    }

    const db = getDb();
    const id = generateId();

    db.prepare(`
      INSERT INTO testimonials (id, name, city, role, event, rating, content, product_purchased, source, photo_url, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      city || "",
      role || "Pelanggan Shopee",
      event || "",
      rating !== undefined ? Number(rating) : 5,
      content,
      productPurchased || "",
      source || "shopee",
      photoUrl || "",
      isActive !== undefined ? (isActive ? 1 : 0) : 1,
      sortOrder !== undefined ? Number(sortOrder) : 0
    );

    return NextResponse.json({ success: true, data: { id, message: "Testimoni berhasil ditambahkan" } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

