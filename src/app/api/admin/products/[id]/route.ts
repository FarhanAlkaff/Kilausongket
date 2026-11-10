import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";
import { isPostgresAvailable, initPostgres, getPostgresClient } from "@/lib/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/products/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    let row: any = null;

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      const rows = (await sql.query("SELECT * FROM products WHERE id = $1 OR slug = $1", [id])) as any[];
      row = rows[0] || null;
    } else {
      const db = getDb();
      row = db.prepare("SELECT * FROM products WHERE id = ? OR slug = ?").get(id, id) as any;
    }

    if (!row) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const product = {
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
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/products/[id]
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

    const {
      name,
      category,
      subCategory,
      categoryLabel,
      price,
      originalPrice,
      images,
      motif,
      material,
      furing,
      availableSizes,
      colors,
      isFeatured,
      isBestSeller,
      isNew,
      isActive,
      description,
      specs,
      shopeeUrl,
      sortOrder,
    } = body;

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();

      const existing = (await sql.query("SELECT id FROM products WHERE id = $1 OR slug = $1", [id])) as any[];
      if (existing.length === 0) {
        return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
      }

      await sql.query(
        `UPDATE products SET
          name = COALESCE($1, name),
          category = COALESCE($2, category),
          sub_category = COALESCE($3, sub_category),
          category_label = COALESCE($4, category_label),
          price = COALESCE($5, price),
          original_price = $6,
          images = COALESCE($7, images),
          motif = COALESCE($8, motif),
          material = COALESCE($9, material),
          furing = COALESCE($10, furing),
          available_sizes = COALESCE($11, available_sizes),
          colors = COALESCE($12, colors),
          is_featured = COALESCE($13, is_featured),
          is_best_seller = COALESCE($14, is_best_seller),
          is_new = COALESCE($15, is_new),
          is_active = COALESCE($16, is_active),
          description = COALESCE($17, description),
          specs = COALESCE($18, specs),
          shopee_url = COALESCE($19, shopee_url),
          sort_order = COALESCE($20, sort_order),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $21 OR slug = $21`,
        [
          name,
          category,
          subCategory,
          categoryLabel,
          price !== undefined ? Number(price) : null,
          originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : null,
          images ? JSON.stringify(images) : null,
          motif,
          material,
          furing,
          availableSizes ? JSON.stringify(availableSizes) : null,
          colors ? JSON.stringify(colors) : null,
          isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
          isBestSeller !== undefined ? (isBestSeller ? 1 : 0) : null,
          isNew !== undefined ? (isNew ? 1 : 0) : null,
          isActive !== undefined ? (isActive ? 1 : 0) : null,
          description,
          specs ? JSON.stringify(specs) : null,
          shopeeUrl,
          sortOrder !== undefined ? Number(sortOrder) : null,
          id,
        ]
      );
    } else {
      const db = getDb();
      const existing = db.prepare("SELECT id FROM products WHERE id = ? OR slug = ?").get(id, id);
      if (!existing) {
        return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
      }

      db.prepare(`
        UPDATE products SET
          name = COALESCE(?, name),
          category = COALESCE(?, category),
          sub_category = COALESCE(?, sub_category),
          category_label = COALESCE(?, category_label),
          price = COALESCE(?, price),
          original_price = ?,
          images = COALESCE(?, images),
          motif = COALESCE(?, motif),
          material = COALESCE(?, material),
          furing = COALESCE(?, furing),
          available_sizes = COALESCE(?, available_sizes),
          colors = COALESCE(?, colors),
          is_featured = COALESCE(?, is_featured),
          is_best_seller = COALESCE(?, is_best_seller),
          is_new = COALESCE(?, is_new),
          is_active = COALESCE(?, is_active),
          description = COALESCE(?, description),
          specs = COALESCE(?, specs),
          shopee_url = COALESCE(?, shopee_url),
          sort_order = COALESCE(?, sort_order),
          updated_at = datetime('now')
        WHERE id = ? OR slug = ?
      `).run(
        name,
        category,
        subCategory,
        categoryLabel,
        price !== undefined ? Number(price) : null,
        originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : null,
        images ? JSON.stringify(images) : null,
        motif,
        material,
        furing,
        availableSizes ? JSON.stringify(availableSizes) : null,
        colors ? JSON.stringify(colors) : null,
        isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
        isBestSeller !== undefined ? (isBestSeller ? 1 : 0) : null,
        isNew !== undefined ? (isNew ? 1 : 0) : null,
        isActive !== undefined ? (isActive ? 1 : 0) : null,
        description,
        specs ? JSON.stringify(specs) : null,
        shopeeUrl,
        sortOrder !== undefined ? Number(sortOrder) : null,
        id,
        id
      );
    }

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
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

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      await sql.query("DELETE FROM products WHERE id = $1 OR slug = $1", [id]);
    } else {
      const db = getDb();
      const result = db.prepare("DELETE FROM products WHERE id = ? OR slug = ?").run(id, id);
      if (result.changes === 0) {
        return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

