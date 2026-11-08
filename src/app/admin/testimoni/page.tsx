"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  Star,
  X,
  AlertCircle
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  city: string;
  role: string;
  event?: string;
  rating: number;
  content: string;
  productPurchased?: string;
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
  const [formRole, setFormRole] = useState("Pelanggan");
  const [formEvent, setFormEvent] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formContent, setFormContent] = useState("");
  const [formProduct, setFormProduct] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data || []);
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

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormName("");
    setFormCity("");
    setFormRole("Pelanggan");
    setFormEvent("");
    setFormRating(5);
    setFormContent("");
    setFormProduct("");
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
    setErrorMessage("");
    setIsModalOpen(true);
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
          <h2 className="text-xl font-bold text-charcoal">Testimoni Pelanggan</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola ulasan pembeli yang ditampilkan di section Testimoni
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-light text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          <span>Tambah Ulasan</span>
        </button>
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
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-charcoal">{t.name}</h3>
                    <p className="text-[11px] text-stone-400">
                      {t.city} • {t.role}
                    </p>
                  </div>
                  <div className="flex text-gold">
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

                <p className="text-xs text-stone-600 italic leading-relaxed">
                  "{t.content}"
                </p>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-charcoal">
                {isEditing ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h3>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nama Pelanggan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="dr. Amanda Kartika"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kota Asal
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Jakarta Selatan"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Status / Peran
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Orang Tua Siswa TK"
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
                  Nama Produk yang Dibeli
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
                  Momen / Acara Dipakai
                </label>
                <input
                  type="text"
                  value={formEvent}
                  onChange={(e) => setFormEvent(e.target.value)}
                  placeholder="Kondangan Pernikahan Keluarga"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Isi Testimoni *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Ceritakan pengalaman furing katun adem, bahan tidak gatal, anak nyaman..."
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
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

