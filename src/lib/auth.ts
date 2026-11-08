import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDb, generateId } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "kilau-songket-default-secret";
const TOKEN_NAME = "ks_admin_token";

export interface AdminUser {
  id: string;
  username: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hashSync(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compareSync(password, hash);
}

export function createToken(admin: AdminUser): string {
  return jwt.sign(
    { id: admin.id, username: admin.username, name: admin.name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function getAuthAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour (3600 seconds)
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

// Seed default admin if none exists
export function seedAdmin() {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM admins LIMIT 1").get();
  if (!existing) {
    const id = generateId();
    const hashedPassword = bcrypt.hashSync("admin123", 12);
    db.prepare(
      "INSERT INTO admins (id, username, password, name) VALUES (?, ?, ?, ?)"
    ).run(id, "admin", hashedPassword, "Administrator");
    console.log("✅ Default admin created: username=admin, password=admin123");
  }
}

