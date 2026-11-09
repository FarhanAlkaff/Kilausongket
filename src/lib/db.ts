import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const isVercel = Boolean(process.env.VERCEL) || (process.env.NODE_ENV === "production" && !fs.existsSync(path.join(process.cwd(), "prisma", "dev.db")));
    let DB_PATH: string;

    if (isVercel) {
      DB_PATH = path.join("/tmp", "dev.db");
    } else {
      try {
        const prismaDir = path.join(process.cwd(), "prisma");
        if (!fs.existsSync(prismaDir)) {
          fs.mkdirSync(prismaDir, { recursive: true });
        }
        DB_PATH = path.join(prismaDir, "dev.db");
      } catch {
        DB_PATH = path.join("/tmp", "dev.db");
      }
    }

    db = new Database(DB_PATH, { timeout: 5000 });
    db.pragma("journal_mode = DELETE");
    db.pragma("foreign_keys = ON");
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT NOT NULL,
      category_label TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER,
      images TEXT DEFAULT '[]',
      motif TEXT DEFAULT '',
      material TEXT DEFAULT '',
      furing TEXT DEFAULT '',
      available_sizes TEXT DEFAULT '[]',
      colors TEXT DEFAULT '[]',
      is_featured INTEGER DEFAULT 0,
      is_best_seller INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      rating REAL DEFAULT 5.0,
      sold_count INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      specs TEXT DEFAULT '[]',
      shopee_url TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      description TEXT,
      badge TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      role TEXT NOT NULL,
      event TEXT,
      rating INTEGER DEFAULT 5,
      content TEXT NOT NULL,
      product_purchased TEXT,
      source TEXT DEFAULT 'shopee',
      photo_url TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS store_settings (
      id TEXT PRIMARY KEY DEFAULT 'main',
      name TEXT DEFAULT 'Kilau Songket',
      tagline TEXT DEFAULT '',
      whatsapp_number TEXT DEFAULT '',
      whatsapp_display TEXT DEFAULT '',
      shopee_url TEXT DEFAULT '',
      instagram_url TEXT DEFAULT '',
      tiktok_url TEXT DEFAULT '',
      email TEXT DEFAULT '',
      operational_hours TEXT DEFAULT '',
      address TEXT DEFAULT '',
      promo_title TEXT DEFAULT '',
      promo_subtitle TEXT DEFAULT '',
      hero_title TEXT DEFAULT '',
      hero_subtitle TEXT DEFAULT '',
      about_text TEXT DEFAULT ''
    );
  `);

  // Safe migration for testimonials extra columns
  try {
    db.exec("ALTER TABLE testimonials ADD COLUMN source TEXT DEFAULT 'shopee'");
  } catch {}
  try {
    db.exec("ALTER TABLE testimonials ADD COLUMN photo_url TEXT DEFAULT ''");
  } catch {}
}

// Generate a simple unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
