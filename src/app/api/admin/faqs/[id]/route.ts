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
    const { question, answer, isActive, sortOrder } = body;

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      await sql.query(
        `UPDATE faqs SET
          question = COALESCE($1, question),
          answer = COALESCE($2, answer),
          is_active = COALESCE($3, is_active),
          sort_order = COALESCE($4, sort_order)
        WHERE id = $5`,
        [
          question !== undefined ? question : null,
          answer !== undefined ? answer : null,
          isActive !== undefined ? (isActive ? 1 : 0) : null,
          sortOrder !== undefined ? Number(sortOrder) : null,
          id,
        ]
      );
      return NextResponse.json({ success: true, message: "FAQ berhasil diperbarui" });
    }

    const db = getDb();
    db.prepare(`
      UPDATE faqs SET
        question = COALESCE(?, question),
        answer = COALESCE(?, answer),
        is_active = COALESCE(?, is_active),
        sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `).run(
      question,
      answer,
      isActive !== undefined ? (isActive ? 1 : 0) : null,
      sortOrder !== undefined ? Number(sortOrder) : null,
      id
    );

    return NextResponse.json({ success: true, message: "FAQ berhasil diperbarui" });
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

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      await sql`DELETE FROM faqs WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: "FAQ berhasil dihapus" });
    }

    const db = getDb();
    db.prepare("DELETE FROM faqs WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "FAQ berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
