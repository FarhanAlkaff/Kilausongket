"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  Star,
  X,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  MessageCircle,
  Sparkles
} from "lucide-react";
import ShopeeIcon from "@/components/ShopeeIcon";

interface Testimonial {
  id: string;
  name: string;
  city: string;
  role: string;
  event?: string;
  rating: number;
  content: string;
  productPurchased?: string;
  source?: string;
  photoUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminTestimonialPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formRole, setFormRole] = useState("Pelanggan Shopee");
  const [formEvent, setFormEvent] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formContent, setFormContent] = useState("");
  const [formProduct, setFormProduct] = useState("");
  const [formSource, setFormSource] = useState("shopee");
  const [formPhotoUrl, setFormPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/testimonials?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTestimonials(data.data);
        try {
          localStorage.setItem("ks_live_testimonials", JSON.stringify(data.data));
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const bc = new BroadcastChannel("ks_sync");
            bc.postMessage({ type: "TESTIMONIALS_UPDATED", testimonials: data.data });
            bc.close();
          }
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openAddModal = (defaultSource = "shopee") => {
    setIsEditing(false);
    setCurrentId(null);
    setFormName("");
    setFormCity("");
    setFormRole(defaultSource === "shopee" ? "Pelanggan Shopee" : "Pelanggan WhatsApp");
    setFormEvent(defaultSource === "shopee" ? "Shopee Verified" : "Pesanan Adat");
    setFormRating(5);
    setFormContent("");
    setFormProduct("");
    setFormSource(defaultSource);
    setFormPhotoUrl("");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setIsEditing(true);
    setCurrentId(t.id);
    setFormName(t.name);
    setFormCity(t.city);
    setFormRole(t.role);
    setFormEvent(t.event || "");
    setFormRating(t.rating);
    setFormContent(t.content);
    setFormProduct(t.productPurchased || "");
    setFormSource(t.source || "shopee");
    setFormPhotoUrl(t.photoUrl || "");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setErrorMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormPhotoUrl(data.url);
      } else {
        setErrorMessage(data.error || "Gagal mengunggah gambar screenshot");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan saat mengunggah gambar");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) {
      setErrorMessage("Nama pelanggan dan isi ulasan wajib diisi");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const url = isEditing ? `/api/admin/testimonials/${currentId}` : "/api/admin/testimonials";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          city: formCity,
          role: formRole,
          event: formEvent,
          rating: Number(formRating),
          content: formContent,
          productPurchased: formProduct,
          source: formSource,
          photoUrl: formPhotoUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadTestimonials();
      } else {
        setErrorMessage(data.error || "Gagal menyimpan ulasan");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus ulasan dari "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadTestimonials();
      } else {
        alert(data.error || "Gagal menghapus testimoni");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
            <span>Testimoni Pelanggan</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola ulasan pembeli dari Shopee & WhatsApp untuk tampil di landing page toko
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal("shopee")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <ShopeeIcon className="w-4 h-4" />
            <span>+ Tambah dari Shopee</span>
          </button>
          <button
            onClick={() => openAddModal("whatsapp")}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-forest hover:bg-forest-light text-white font-semibold text-xs rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4 text-gold-light" />
            <span>Ulasan Manual / WA</span>
          </button>
        </div>
      </div>

      {/* Shopee Integration Helper Box */}
      <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center shrink-0 shadow-sm">
            <ShopeeIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-charcoal">Cara Gampang Masukkan Ulasan dari Aplikasi Shopee:</p>
            <p className="text-[11px] text-stone-500">
              1. Buka aplikasi Shopee &gt; Toko Saya &gt; Penilaian Toko. <br className="hidden sm:inline" />
              2. Screenshot ulasan pembeli bintang 5 &gt; Klik tombol <strong>&ldquo;+ Tambah dari Shopee&rdquo;</strong> di atas, upload fotonya atau salin teks ulasannya.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-stone-400">
            Memuat ulasan pelanggan...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-xs text-stone-400">
            Belum ada ulasan yang ditambahkan.
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-charcoal">{t.name}</h3>
                      {t.source === "shopee" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#EE4D2D] bg-[#EE4D2D]/10 px-2 py-0.5 rounded-full border border-[#EE4D2D]/20">
                          <ShopeeIcon className="w-3 h-3" />
                          <span>Shopee Verified</span>
                        </span>
                      ) : t.source === "whatsapp" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp Order</span>
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {t.city} • {t.role}
                    </p>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {t.productPurchased && (
                  <div className="mb-2">
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
                      Produk: {t.productPurchased}
                    </span>
                  </div>
                )}

                <p className="text-xs text-stone-600 italic leading-relaxed mb-3">
                  &ldquo;{t.content}&rdquo;
                </p>

                {t.photoUrl && (
                  <div className="mb-3">
                    <span className="text-[10px] text-stone-400 block mb-1">Bukti Foto / Screenshot:</span>
                    <a href={t.photoUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={t.photoUrl}
                        alt="Screenshot Ulasan"
                        className="w-24 h-24 object-cover rounded-xl border border-stone-200 hover:opacity-90 transition shadow-sm"
                      />
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-stone-400">
                  {t.event ? `Acara: ${t.event}` : "Pembeli Terverifikasi"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 text-stone-500 hover:text-forest hover:bg-stone-100 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah / Edit Testimoni */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                {formSource === "shopee" && <ShopeeIcon className="w-5 h-5" />}
                <h3 className="text-sm font-bold text-charcoal">
                  {isEditing ? "Edit Testimoni" : formSource === "shopee" ? "Tambah Ulasan Pembeli Shopee" : "Tambah Testimoni Baru"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-xs text-red-600 rounded-xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              {/* Pilihan Sumber Testimoni */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Sumber Ulasan / Testimoni
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormSource("shopee");
                      if (!formRole || formRole === "Pelanggan" || formRole === "Pelanggan WhatsApp") {
                        setFormRole("Pembeli Shopee");
                      }
                      if (!formEvent) setFormEvent("Shopee Verified");
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold border transition ${
                      formSource === "shopee"
                        ? "bg-[#EE4D2D]/10 text-[#EE4D2D] border-[#EE4D2D]/40 shadow-sm"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <ShopeeIcon className="w-3.5 h-3.5" />
                    <span>Shopee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormSource("whatsapp");
                      if (formRole === "Pembeli Shopee") setFormRole("Pelanggan WhatsApp");
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold border transition ${
                      formSource === "whatsapp"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormSource("website")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold border transition ${
                      formSource === "website"
                        ? "bg-forest/10 text-forest border-forest/30 shadow-sm"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Umum</span>
                  </button>
                </div>
              </div>

              {/* Upload Screenshot / Foto Bukti */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <label className="block font-semibold text-stone-700">
                  Foto Screenshot Ulasan / Foto Produk Pembeli (Opsional)
                </label>
                <div className="flex items-center gap-3">
                  {formPhotoUrl ? (
                    <div className="relative group">
                      <img
                        src={formPhotoUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-stone-300 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setFormPhotoUrl("")}
                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow"
                        title="Hapus foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-stone-300 flex items-center justify-center text-stone-400 bg-white">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold rounded-lg cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5 text-forest" />
                      <span>{uploadingPhoto ? "Mengunggah..." : "Pilih File Screenshot"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={formPhotoUrl}
                      onChange={(e) => setFormPhotoUrl(e.target.value)}
                      placeholder="Atau tempel link URL foto..."
                      className="w-full px-2.5 py-1 text-[11px] border border-stone-300 rounded-lg focus:outline-none focus:border-forest bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nama Akun Pembeli *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="misal: a***9 atau Ibu Amanda"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kota Asal Pembeli
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Jakarta / Palembang"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Label Pembeli
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Pembeli Shopee Terverifikasi"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bintang Rating (1-5)
                  </label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Varian / Produk yang Dibeli
                </label>
                <input
                  type="text"
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  placeholder="Setelan Songket Cilik Panglima Emas"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Teks Ulasan dari Pembeli *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Salin teks ulasan pembeli dari aplikasi Shopee..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-forest hover:bg-forest-light text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Ulasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

