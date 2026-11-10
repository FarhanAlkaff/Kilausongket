import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";
import { isPostgresAvailable, initPostgres, getPostgresClient } from "@/lib/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      await sql.query(
        `UPDATE categories SET
          label = COALESCE($1, label),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          badge = $4,
          sort_order = COALESCE($5, sort_order),
          is_active = COALESCE($6, is_active)
        WHERE id = $7 OR slug = $7`,
        [
          label !== undefined ? label : null,
          slug !== undefined ? slug : null,
          description !== undefined ? description : null,
          badge !== undefined ? badge : null,
          sortOrder !== undefined ? Number(sortOrder) : null,
          isActive !== undefined ? (isActive ? 1 : 0) : null,
          id
        ]
      );
      return NextResponse.json({ success: true, message: "Kategori berhasil diperbarui" });
    }

    const db = getDb();
    db.prepare(`
      UPDATE categories SET
        label = COALESCE(?, label),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        badge = ?,
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active)
      WHERE id = ? OR slug = ?
    `).run(
      label,
      slug,
      description,
      badge !== undefined ? badge : null,
      sortOrder !== undefined ? Number(sortOrder) : null,
      isActive !== undefined ? (isActive ? 1 : 0) : null,
      id,
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

    if (id === "all" || id === "cat-all") {
      return NextResponse.json({ success: false, error: "Kategori default tidak dapat dihapus" }, { status: 400 });
    }

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      const check = (await sql`SELECT slug FROM categories WHERE id = ${id} OR slug = ${id}`) as any[];
      if (check[0]?.slug === "all") {
        return NextResponse.json({ success: false, error: "Kategori default tidak dapat dihapus" }, { status: 400 });
      }
      await sql`DELETE FROM categories WHERE id = ${id} OR slug = ${id}`;
      return NextResponse.json({ success: true, message: "Kategori berhasil dihapus" });
    }

    const db = getDb();
    const cat = db.prepare("SELECT slug FROM categories WHERE id = ? OR slug = ?").get(id, id) as any;
    if (cat?.slug === "all") {
      return NextResponse.json({ success: false, error: "Kategori default tidak dapat dihapus" }, { status: 400 });
    }

    db.prepare("DELETE FROM categories WHERE id = ? OR slug = ?").run(id, id);
    return NextResponse.json({ success: true, message: "Kategori berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
