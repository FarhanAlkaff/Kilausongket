import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId, generateSlug } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";
import { isPostgresAvailable, initPostgres, getPostgresClient } from "@/lib/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_CATEGORIES = [
  { slug: "all", label: "Semua Koleksi", description: "Seluruh pilihan busana songket eksklusif anak dan dewasa", badge: null, sort_order: 0 },
  { slug: "anak", label: "Songket Anak (1-12 Th)", description: "Pakaian adat anak nyaman, furing katun adem anti-gatal", badge: "Terlaris", sort_order: 1 },
  { slug: "dewasa", label: "Songket Dewasa (Pria & Wanita)", description: "Setelan kurung wanita elegan & kemeja pria berwibawa", badge: "Elegan", sort_order: 2 },
  { slug: "sarimbit", label: "Sarimbit Keluarga", description: "Koleksi serasi ayah, ibu, dan anak untuk hari istimewa", badge: "Eksklusif", sort_order: 3 },
];

export async function GET() {
  try {
    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();

      let catRows = (await sql`SELECT * FROM categories ORDER BY sort_order ASC, id ASC`) as any[];

      // Auto seed default categories if table is empty
      if (catRows.length === 0) {
        for (const cat of DEFAULT_CATEGORIES) {
          const id = "cat-" + cat.slug;
          await sql.query(
            `INSERT INTO categories (id, slug, label, description, badge, sort_order, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, 1)
             ON CONFLICT (slug) DO NOTHING`,
            [id, cat.slug, cat.label, cat.description, cat.badge, cat.sort_order]
          );
        }
        catRows = (await sql`SELECT * FROM categories ORDER BY sort_order ASC, id ASC`) as any[];
      }

      // Count active products for each category in PostgreSQL
      const withCounts = await Promise.all(
        catRows.map(async (cat) => {
          let count = 0;
          try {
            if (cat.slug === "all") {
              const res = await sql`SELECT COUNT(*)::int as count FROM products WHERE is_active = 1`;
              count = res[0]?.count || 0;
            } else {
              const res = await sql.query(
                `SELECT COUNT(*)::int as count FROM products WHERE (category = $1 OR sub_category = $1) AND is_active = 1`,
                [cat.slug]
              );
              count = res[0]?.count || 0;
            }
          } catch {
            count = 0;
          }
          return {
            id: cat.id,
            slug: cat.slug,
            label: cat.label,
            description: cat.description || "",
            badge: cat.badge || null,
            sortOrder: Number(cat.sort_order || 0),
            isActive: Boolean(cat.is_active),
            count,
          };
        })
      );

      return NextResponse.json({ success: true, data: withCounts });
    }

    // SQLite Fallback
    const db = getDb();
    let categories = db.prepare("SELECT * FROM categories ORDER BY sort_order ASC").all() as any[];

    if (categories.length === 0) {
      for (const cat of DEFAULT_CATEGORIES) {
        db.prepare(`
          INSERT OR IGNORE INTO categories (id, slug, label, description, badge, sort_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `).run("cat-" + cat.slug, cat.slug, cat.label, cat.description, cat.badge, cat.sort_order);
      }
      categories = db.prepare("SELECT * FROM categories ORDER BY sort_order ASC").all() as any[];
    }

    const withCounts = categories.map((cat) => {
      let count = 0;
      try {
        if (cat.slug === "all") {
          const row = db.prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1").get() as any;
          count = row?.count || 0;
        } else {
          const row = db.prepare("SELECT COUNT(*) as count FROM products WHERE (category = ? OR sub_category = ?) AND is_active = 1").get(cat.slug, cat.slug) as any;
          count = row?.count || 0;
        }
      } catch {
        count = 0;
      }
      return {
        id: cat.id,
        slug: cat.slug,
        label: cat.label,
        description: cat.description || "",
        badge: cat.badge || null,
        sortOrder: Number(cat.sort_order || 0),
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

    if (!label || !label.trim()) {
      return NextResponse.json({ success: false, error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const finalSlug = (slug && slug.trim()) ? generateSlug(slug) : generateSlug(label);
    const id = "cat-" + finalSlug;

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      await sql.query(
        `INSERT INTO categories (id, slug, label, description, badge, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, 1)
         ON CONFLICT (slug) DO UPDATE SET
           label = EXCLUDED.label,
           description = EXCLUDED.description,
           badge = EXCLUDED.badge,
           sort_order = EXCLUDED.sort_order,
           is_active = 1`,
        [id, finalSlug, label.trim(), description || "", badge || null, Number(sortOrder || 0)]
      );
      return NextResponse.json({ success: true, data: { id, slug: finalSlug, message: "Kategori berhasil disimpan" } });
    }

    const db = getDb();
    db.prepare(`
      INSERT INTO categories (id, slug, label, description, badge, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(slug) DO UPDATE SET
        label = excluded.label,
        description = excluded.description,
        badge = excluded.badge,
        sort_order = excluded.sort_order
    `).run(id, finalSlug, label.trim(), description || "", badge || null, Number(sortOrder || 0));

    return NextResponse.json({ success: true, data: { id, slug: finalSlug, message: "Kategori berhasil ditambahkan" } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
