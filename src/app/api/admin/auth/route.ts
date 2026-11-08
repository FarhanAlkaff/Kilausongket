import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie, clearAuthCookie, getAuthAdmin, AdminUser } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

// GET /api/admin/auth - Check auth status
export async function GET() {
  try {
    seedDatabase(); // Ensure DB is seeded
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: { id: admin.id, username: admin.username, name: admin.name } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

