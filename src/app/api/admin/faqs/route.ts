import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";
import { isPostgresAvailable, initPostgres, getPostgresClient } from "@/lib/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      const rows = (await sql`SELECT * FROM faqs ORDER BY sort_order ASC, id DESC`) as any[];
      const faqs = rows.map((r) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        isActive: Boolean(r.is_active),
        sortOrder: Number(r.sort_order || 0),
      }));
      return NextResponse.json({ success: true, data: faqs });
    }

    const db = getDb();
    const rows = db.prepare("SELECT * FROM faqs ORDER BY sort_order ASC, id DESC").all() as any[];
    const faqs = rows.map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      isActive: Boolean(r.is_active),
      sortOrder: Number(r.sort_order || 0),
    }));
    return NextResponse.json({ success: true, data: faqs });
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
    const { question, answer, isActive, sortOrder } = body;

    if (!question || !answer) {
      return NextResponse.json({ success: false, error: "Pertanyaan dan jawaban wajib diisi" }, { status: 400 });
    }

    const id = generateId();

    if (isPostgresAvailable()) {
      await initPostgres();
      const sql = getPostgresClient();
      await sql.query(
        `INSERT INTO faqs (id, question, answer, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          question,
          answer,
          isActive !== undefined ? (isActive ? 1 : 0) : 1,
          sortOrder !== undefined ? Number(sortOrder) : 0,
        ]
      );
      return NextResponse.json({ success: true, data: { id, message: "FAQ berhasil ditambahkan" } });
    }

    const db = getDb();
    db.prepare(`
      INSERT INTO faqs (id, question, answer, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      id,
      question,
      answer,
      isActive !== undefined ? (isActive ? 1 : 0) : 1,
      sortOrder !== undefined ? Number(sortOrder) : 0
    );

    return NextResponse.json({ success: true, data: { id, message: "FAQ berhasil ditambahkan" } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
