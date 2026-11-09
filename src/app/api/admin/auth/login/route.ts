import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { verifyPassword, hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function POST(req: NextRequest) {
  try {
    try {
      seedDatabase();
    } catch (e) {
      console.error("Seeding warning:", e);
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const db = getDb();
    let admin: any = null;
    try {
      admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as any;
    } catch (e) {
      console.error("DB Query error:", e);
    }

    // Direct environment / default fallback recovery
    const defaultUser = process.env.ADMIN_USERNAME || "admin";
    const defaultPass = process.env.ADMIN_PASSWORD || "admin123";

    if (!admin && username === defaultUser && password === defaultPass) {
      const id = generateId();
      const hashedPassword = await hashPassword(defaultPass);
      try {
        db.prepare(
          "INSERT OR REPLACE INTO admins (id, username, password, name) VALUES (?, ?, ?, ?)"
        ).run(id, defaultUser, hashedPassword, "Administrator");
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

