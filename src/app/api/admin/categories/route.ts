import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId, generateSlug } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const db = getDb();
    const categories = db.prepare("SELECT * FROM categories ORDER BY sort_order ASC").all() as any[];

    // Add product counts
    const withCounts = categories.map((cat) => {
      let count = 0;
      if (cat.slug === "all") {
        const row = db.prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1").get() as any;
        count = row.count;
      } else {
        const row = db.prepare("SELECT COUNT(*) as count FROM products WHERE category = ? AND is_active = 1").get(cat.slug) as any;
        count = row.count;
      }
      return {
        id: cat.id,
        slug: cat.slug,
        label: cat.label,
        description: cat.description,
        badge: cat.badge,
        sortOrder: cat.sort_order,
        isActive: Boolean(cat.is_active),
        count,
      };
    });

    return NextResponse.json({ success: true, data: withCounts });
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
    const { label, slug, description, badge, sortOrder } = body;

    if (!label) {
      return NextResponse.json({ success: false, error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const db = getDb();
    const id = generateId();
    const finalSlug = slug || generateSlug(label);

    db.prepare(`
      INSERT INTO categories (id, slug, label, description, badge, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, finalSlug, label, description || "", badge || null, sortOrder || 0);

    return NextResponse.json({ success: true, data: { id, message: "Kategori berhasil ditambahkan" } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

