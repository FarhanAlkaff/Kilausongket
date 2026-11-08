"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  MessageCircle,
  ShoppingBag,
  Instagram,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function AdminSettingsPage() {
  const { refreshSettings } = useStoreSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: "Kilau Songket",
    tagline: "",
    whatsappNumber: "6281234567890",
    whatsappDisplay: "+62 812-3456-7890",
    shopeeUrl: "https://shopee.co.id/kilausongket",
    instagramUrl: "https://instagram.com/kilausongket",
    tiktokUrl: "https://tiktok.com/@kilausongket",
    email: "halo@kilausongket.com",
    operationalHours: "Senin - Minggu: 08.00 - 21.00 WIB",
    address: "Sentra Tenun & Butik Kilau Songket, Jl. Kebangsaan No. 88, Indonesia",
    heroTitle: "Busana Songket Premium untuk Si Kecil & Keluarga",
    heroSubtitle: "Koleksi setelan songket anak & dewasa dengan furing katun anti-gatal. Tenunan benang emas presisi, desain modern elegan.",
    promoTitle: "Promo Spesial Hari Kartini & Hari Raya 2026",
    promoSubtitle: "Dapatkan Gratis Tanjak Cilik / Selendang Senada untuk setiap pembelian paket Songket Anak & Sarimbit Keluarga.",
    aboutText: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.data) {
          setForm((prev) => ({ ...prev, ...data.data }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await refreshSettings();
        setSuccessMessage("Pengaturan toko dan kontak berhasil disimpan!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.error || "Gagal menyimpan pengaturan.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-stone-400">
        Memuat pengaturan toko...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Pengaturan Toko & Landing Page</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Atur nomor WhatsApp, link Shopee, headline hero, dan alamat toko
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-forest hover:bg-forest-light text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-gold-light" />
          <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Kontak & Kanal Pemesanan Utama */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-forest" />
              <span>Kanal Pemesanan (WhatsApp & Shopee)</span>
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Tombol pemesanan di seluruh website akan mengarah ke nomor dan link ini
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nomor WhatsApp (Format Internasional tanpa +) *
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="6281234567890"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Contoh: <code className="bg-stone-100 px-1 rounded">6281234567890</code> (awali dengan 62)
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Tampilan Nomor WhatsApp di Website
              </label>
              <input
                type="text"
                name="whatsappDisplay"
                value={form.whatsappDisplay}
                onChange={handleChange}
                placeholder="+62 812-3456-7890"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Link Toko Utama Shopee *
              </label>
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#EE4D2D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="shopeeUrl"
                  value={form.shopeeUrl}
                  onChange={handleChange}
                  placeholder="https://shopee.co.id/kilausongket"
                  className="w-full pl-9 pr-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Banner Hero & Promo di Landing Page */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <span>Teks Headline & Banner Landing Page</span>
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Sesuaikan kata-kata sambutan pada section paling atas dan banner promo
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Judul Hero Section (Headline Utama)
              </label>
              <input
                type="text"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
                placeholder="Busana Songket Premium untuk Si Kecil & Keluarga"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Sub-Headline Hero Section
              </label>
              <textarea
                rows={2}
                name="heroSubtitle"
                value={form.heroSubtitle}
                onChange={handleChange}
                placeholder="Deskripsi singkat keunggulan furing katun dan tenunan emas..."
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Judul Banner Promosi
                </label>
                <input
                  type="text"
                  name="promoTitle"
                  value={form.promoTitle}
                  onChange={handleChange}
                  placeholder="Promo Spesial Hari Kartini..."
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deskripsi Banner Promosi
                </label>
                <input
                  type="text"
                  name="promoSubtitle"
                  value={form.promoSubtitle}
                  onChange={handleChange}
                  placeholder="Dapatkan Gratis Tanjak Cilik..."
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Informasi Toko, Alamat & Medsos */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-600" />
              <span>Profil Toko & Media Sosial</span>
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Ditampilkan pada footer dan halaman Tentang Kami
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nama Brand / Toko
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Jam Operasional
              </label>
              <input
                type="text"
                name="operationalHours"
                value={form.operationalHours}
                onChange={handleChange}
                placeholder="Senin - Minggu: 08.00 - 21.00 WIB"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={form.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/kilausongket"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                TikTok URL
              </label>
              <input
                type="url"
                name="tiktokUrl"
                value={form.tiktokUrl}
                onChange={handleChange}
                placeholder="https://tiktok.com/@kilausongket"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Alamat Fisik / Workshop Butik
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Sentra Tenun & Butik Kilau Songket, Jl. Kebangsaan No. 88, Indonesia"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Cerita Kilau Songket (Tentang Kami)
              </label>
              <textarea
                rows={3}
                name="aboutText"
                value={form.aboutText}
                onChange={handleChange}
                placeholder="Ceritakan latar belakang Kilau Songket..."
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-forest hover:bg-forest-light text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold-light" />
            <span>{saving ? "Menyimpan..." : "Simpan Pengaturan Toko"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

