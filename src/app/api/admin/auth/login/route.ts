import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { verifyPassword, hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";
import { isPostgresAvailable, initPostgres, getPostgresClient } from "@/lib/postgres";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    let admin: any = null;

    if (isPostgresAvailable()) {
      try {
        await initPostgres();
        const sql = getPostgresClient();
        const rows = (await sql.query("SELECT * FROM admins WHERE username = $1", [username])) as any[];
        admin = rows[0] || null;
      } catch (e) {
        console.error("Postgres Auth Query error:", e);
      }
    } else {
      try {
        seedDatabase();
      } catch (e) {
        console.error("Seeding warning:", e);
      }
      const db = getDb();
      try {
        admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as any;
      } catch (e) {
        console.error("DB Query error:", e);
      }
    }

    // Direct environment / default fallback recovery
    const defaultUser = process.env.ADMIN_USERNAME || "admin";
    const defaultPass = process.env.ADMIN_PASSWORD || "admin123";

    if (!admin && username === defaultUser && password === defaultPass) {
      const id = generateId();
      const hashedPassword = await hashPassword(defaultPass);
      try {
        if (isPostgresAvailable()) {
          const sql = getPostgresClient();
          await sql.query(
            "INSERT INTO admins (id, username, password, name) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO UPDATE SET password = $3",
            [id, defaultUser, hashedPassword, "Administrator"]
          );
        } else {
          const db = getDb();
          db.prepare(
            "INSERT OR REPLACE INTO admins (id, username, password, name) VALUES (?, ?, ?, ?)"
          ).run(id, defaultUser, hashedPassword, "Administrator");
        }
      } catch {}
      admin = { id, username: defaultUser, name: "Administrator" };
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Username atau password salah" },
        { status: 401 }
      );
    }

    if (admin.password) {
      const valid = await verifyPassword(password, admin.password);
      if (!valid) {
        return NextResponse.json(
          { success: false, error: "Username atau password salah" },
          { status: 401 }
        );
      }
    }

    const token = createToken({
      id: admin.id || "admin-root",
      username: admin.username,
      name: admin.name || "Administrator",
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      data: { id: admin.id || "admin-root", username: admin.username, name: admin.name || "Administrator" },
    });
  } catch (error: any) {
    console.error("Login fatal error:", error);
    return NextResponse.json({ success: false, error: error.message || "Gagal masuk" }, { status: 500 });
  }
}

