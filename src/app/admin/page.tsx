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
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Welcome Banner - Compact & Elegant */}
      <div className="bg-gradient-to-r from-forest via-[#153328] to-forest-light text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gold/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 rounded-full text-[10px] text-gold-light font-bold mb-2 border border-gold/30">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>Panel Kilau Songket</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-serif tracking-wide text-white">
            Kelola Website & Katalog Butik
          </h2>
          <p className="text-xs text-stone-300 mt-0.5 max-w-xl leading-relaxed">
            Perubahan yang Anda simpan langsung terhubung otomatis ke landing page utama toko.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
          <Link
            href="/admin/produk"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gold hover:bg-gold-light text-forest-dark font-bold text-xs rounded-xl shadow-sm transition hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </Link>
          <Link
            href="/admin/pengaturan"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition hover:scale-[1.02]"
          >
            <Settings className="w-4 h-4 text-gold-light" />
            <span>Pengaturan</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards - Modern & Fitted */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Produk</span>
            <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-charcoal">{stats.totalProducts}</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.activeProducts} Produk Aktif</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Kategori</span>
            <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-charcoal">{stats.categories}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Anak, Dewasa, Sarimbit
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Testimoni</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#EE4D2D] flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-charcoal">{stats.testimonials}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Ulasan Shopee & WA
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">FAQ Pertanyaan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-charcoal">{stats.faqs}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Tanya Jawab Aktif
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Recent Products (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-stone-100">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal">Koleksi Produk Terbaru</h3>
              <p className="text-[11px] text-stone-500">Daftar produk yang aktif di etalase</p>
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
                <div key={p.id} className="py-2.5 px-2 hover:bg-stone-50/80 rounded-xl transition flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden relative flex-shrink-0 border border-stone-200">
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
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="pb-2.5 mb-3 border-b border-stone-100">
              <h3 className="text-xs sm:text-sm font-bold text-charcoal">Panduan Cepat Admin</h3>
              <p className="text-[11px] text-stone-500">
                Tips praktis mengelola toko Kilau Songket:
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-600">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-[11px] leading-relaxed">
                  <strong>Nomor WhatsApp:</strong> Ubah nomor CS di <em>Pengaturan Toko</em> agar langsung ke WhatsApp Anda.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-[11px] leading-relaxed">
                  <strong>Link Shopee:</strong> Setiap produk bisa dipasang link spesifik atau link toko utama.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-[11px] leading-relaxed">
                  <strong>Foto Produk:</strong> Upload foto langsung dari HP/komputer atau tempelkan URL gambar online.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </span>
                <span className="text-[11px] leading-relaxed">
                  <strong>Furing Katun:</strong> Cantumkan detail furing anti-gatal karena ini nilai jual utama Kilau Songket.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-mono">Kilau Songket v1.2</span>
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

