import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId, generateSlug } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/products
export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const countOnly = searchParams.get("count");

    const db = getDb();

    if (countOnly === "true") {
      const total = db.prepare("SELECT COUNT(*) as count FROM products").get() as any;
      const active = db.prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1").get() as any;
      return NextResponse.json({
        success: true,
        data: { total: total.count, active: active.count },
      });
    }

    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (category && category !== "all") {
      query += " AND category = ?";
      params.push(category);
    }

    if (search) {
      query += " AND (name LIKE ? OR motif LIKE ? OR material LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += " ORDER BY sort_order ASC, created_at DESC";

    const rows = db.prepare(query).all(...params) as any[];

    // Parse JSON fields
    const products = rows.map((row) => ({
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
    }));

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

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
    } = body;

    if (!name || !category || !price) {
      return NextResponse.json(
        { success: false, error: "Nama, kategori, dan harga wajib diisi" },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = generateId();
    let slug = generateSlug(name);

    // Ensure slug is unique
    const existingSlug = db.prepare("SELECT id FROM products WHERE slug = ?").get(slug);
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Get max sort_order
    const maxOrder = db.prepare("SELECT MAX(sort_order) as max FROM products").get() as any;
    const sortOrder = (maxOrder?.max ?? -1) + 1;

    db.prepare(`
      INSERT INTO products (
        id, slug, name, category, sub_category, category_label, price, original_price,
        images, motif, material, furing, available_sizes, colors,
        is_featured, is_best_seller, is_new, is_active,
        description, specs, shopee_url, sort_order
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `).run(
      id,
      slug,
      name,
      category,
      subCategory || category,
      categoryLabel || category,
      Number(price),
      originalPrice ? Number(originalPrice) : null,
      JSON.stringify(images || []),
      motif || "",
      material || "",
      furing || "",
      JSON.stringify(availableSizes || []),
      JSON.stringify(colors || []),
      isFeatured ? 1 : 0,
      isBestSeller ? 1 : 0,
      isNew ? 1 : 0,
      isActive !== undefined ? (isActive ? 1 : 0) : 1,
      description || "",
      JSON.stringify(specs || []),
      shopeeUrl || "",
      sortOrder
    );

    return NextResponse.json({
      success: true,
      data: { id, slug, message: "Produk berhasil ditambahkan" },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

