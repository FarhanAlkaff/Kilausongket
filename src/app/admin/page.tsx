"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Tags,
  MessageSquareQuote,
  HelpCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Settings,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    categories: 0,
    testimonials: 0,
    faqs: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [prodRes, catRes, testRes, faqRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/testimonials"),
          fetch("/api/admin/faqs"),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const testData = await testRes.json();
        const faqData = await faqRes.json();

        if (prodData.success) {
          const prods = prodData.data || [];
          setRecentProducts(prods.slice(0, 5));
          setStats((prev) => ({
            ...prev,
            totalProducts: prods.length,
            activeProducts: prods.filter((p: any) => p.isActive).length,
          }));
        }

        if (catData.success) {
          setStats((prev) => ({ ...prev, categories: catData.data?.length || 0 }));
        }

        if (testData.success) {
          setStats((prev) => ({ ...prev, testimonials: testData.data?.length || 0 }));
        }

        if (faqData.success) {
          setStats((prev) => ({ ...prev, faqs: faqData.data?.length || 0 }));
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-forest to-forest-light text-white p-6 sm:p-8 rounded-2xl shadow-md border border-gold/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-gold-light font-medium mb-2 border border-gold/30">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Selamat Datang di Panel Kilau Songket</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-white">
            Kelola Website & Katalog Produk
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">
            Perubahan yang Anda lakukan di sini langsung diterapkan ke halaman utama website secara instan tanpa perlu restart server.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link
            href="/admin/produk"
            className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-dark text-forest-dark font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </Link>
          <Link
            href="/admin/pengaturan"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">Total Produk</span>
            <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-charcoal">{stats.totalProducts}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.activeProducts} Produk Aktif</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">Kategori</span>
            <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-charcoal">{stats.categories}</div>
            <div className="text-[11px] text-stone-400 mt-1">
              Anak, Dewasa, Sarimbit, dll
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">Testimoni</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-charcoal">{stats.testimonials}</div>
            <div className="text-[11px] text-stone-400 mt-1">
              Ulasan pelanggan asli
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">FAQ Tanya Jawab</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-charcoal">{stats.faqs}</div>
            <div className="text-[11px] text-stone-400 mt-1">
              Pertanyaan umum pembeli
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-charcoal">Koleksi Produk Terbaru</h3>
              <p className="text-xs text-stone-500">Daftar produk yang aktif di etalase</p>
            </div>
            <Link
              href="/admin/produk"
              className="text-xs font-semibold text-forest hover:text-forest-light flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-stone-400">Memuat katalog...</div>
          ) : recentProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">Belum ada produk.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {recentProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-stone-100 overflow-hidden relative flex-shrink-0 border border-stone-200">
                      {p.images && p.images[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-stone-400 m-auto mt-3" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-charcoal truncate">{p.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                        <span className="capitalize">{p.categoryLabel || p.category}</span>
                        <span>•</span>
                        <span className="font-semibold text-forest">
                          Rp {p.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {p.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                    <Link
                      href="/admin/produk"
                      className="p-1.5 text-stone-400 hover:text-forest hover:bg-stone-100 rounded-lg transition"
                      title="Edit Produk"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Guide Card (1 col) */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-charcoal mb-1">Panduan Cepat Admin</h3>
            <p className="text-xs text-stone-500 mb-4">
              Tips mengelola etalase Kilau Songket dengan mudah:
            </p>

            <ul className="space-y-3 text-xs text-stone-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Nomor WhatsApp:</strong> Ganti nomor CS di menu <em>Pengaturan Toko</em> agar pelanggan langsung diarahkan ke nomor Anda.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Link Shopee:</strong> Setiap produk dapat dipasang link produk Shopee spesifik atau link toko umum.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Foto Produk:</strong> Bisa upload foto langsung dari komputer atau paste URL gambar online.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  <strong>Furing Katun:</strong> Cantumkan detail bahan furing di spesifikasi karena ini adalah USP utama Kilau Songket.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-400">Kilau Songket v1.0</span>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-forest hover:text-gold flex items-center gap-1"
            >
              <span>Kunjungi Toko</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

