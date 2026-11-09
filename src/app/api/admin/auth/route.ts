import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, hashPassword, createToken, setAuthCookie, clearAuthCookie, getAuthAdmin, AdminUser } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

// GET /api/admin/auth - Check auth status
export async function GET() {
  try {
    try {
      seedDatabase();
    } catch {}
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: { id: admin.id, username: admin.username, name: admin.name } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/auth - Update admin profile & credentials
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, newUsername, newName } = await req.json();

    const db = getDb();
    const currentAdminRow = db.prepare("SELECT * FROM admins WHERE id = ?").get(admin.id) as any;
    if (!currentAdminRow) {
      return NextResponse.json({ success: false, error: "Akun admin tidak ditemukan" }, { status: 404 });
    }

    // Verify current password if changing password or username
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: "Password saat ini wajib diisi untuk mengubah password" }, { status: 400 });
      }
      const isValid = await verifyPassword(currentPassword, currentAdminRow.password);
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Password saat ini salah" }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: "Password baru minimal 6 karakter" }, { status: 400 });
      }
      const hashedNew = await hashPassword(newPassword);
      db.prepare("UPDATE admins SET password = ? WHERE id = ?").run(hashedNew, admin.id);
    }

    const finalUsername = newUsername?.trim() || currentAdminRow.username;
    const finalName = newName?.trim() || currentAdminRow.name;

    // Check if new username is taken by another admin
    if (finalUsername !== currentAdminRow.username) {
      const exists = db.prepare("SELECT id FROM admins WHERE username = ? AND id != ?").get(finalUsername, admin.id);
      if (exists) {
        return NextResponse.json({ success: false, error: "Username tersebut sudah digunakan" }, { status: 400 });
      }
    }

    db.prepare("UPDATE admins SET username = ?, name = ? WHERE id = ?").run(finalUsername, finalName, admin.id);

    const updatedAdmin: AdminUser = { id: admin.id, username: finalUsername, name: finalName };
    const token = createToken(updatedAdmin);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Profil dan kredensial admin berhasil diperbarui!",
      data: updatedAdmin
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

