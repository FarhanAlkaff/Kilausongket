import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { label, slug, description, badge, sortOrder, isActive } = body;

    const db = getDb();
    db.prepare(`
      UPDATE categories SET
        label = COALESCE(?, label),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        badge = ?,
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(
      label,
      slug,
      description,
      badge !== undefined ? badge : null,
      sortOrder !== undefined ? Number(sortOrder) : null,
      isActive !== undefined ? (isActive ? 1 : 0) : null,
      id
    );

    return NextResponse.json({ success: true, message: "Kategori berhasil diperbarui" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    // Check if it's the "all" category
    const cat = db.prepare("SELECT slug FROM categories WHERE id = ?").get(id) as any;
    if (cat?.slug === "all") {
      return NextResponse.json({ success: false, error: "Kategori default tidak dapat dihapus" }, { status: 400 });
    }

    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: "Kategori berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

