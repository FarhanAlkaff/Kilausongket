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
    const { name, city, role, event, rating, content, productPurchased, source, photoUrl, isActive, sortOrder } = body;

    const db = getDb();
    db.prepare(`
      UPDATE testimonials SET
        name = COALESCE(?, name),
        city = COALESCE(?, city),
        role = COALESCE(?, role),
        event = ?,
        rating = COALESCE(?, rating),
        content = COALESCE(?, content),
        product_purchased = ?,
        source = COALESCE(?, source),
        photo_url = COALESCE(?, photo_url),
        is_active = COALESCE(?, is_active),
        sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `).run(
      name,
      city,
      role,
      event !== undefined ? event : null,
      rating !== undefined ? Number(rating) : null,
      content,
      productPurchased !== undefined ? productPurchased : null,
      source !== undefined ? source : null,
      photoUrl !== undefined ? photoUrl : null,
      isActive !== undefined ? (isActive ? 1 : 0) : null,
      sortOrder !== undefined ? Number(sortOrder) : null,
      id
    );

    return NextResponse.json({ success: true, message: "Testimoni berhasil diperbarui" });
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
    db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "Testimoni berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

