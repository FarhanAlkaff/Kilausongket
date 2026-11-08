"use client";

import React, { useState, useEffect } from "react";
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
  AlertCircle
} from "lucide-react";

interface Category {
  id: string;
  slug: string;
  label: string;
  description?: string;
  badge?: string;
  sortOrder: number;
  isActive: boolean;
  count: number;
}

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formLabel, setFormLabel] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormLabel("");
    setFormSlug("");
    setFormDescription("");
    setFormBadge("");
    setFormSortOrder(categories.length);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setIsEditing(true);
    setCurrentId(cat.id);
    setFormLabel(cat.label);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setFormBadge(cat.badge || "");
    setFormSortOrder(cat.sortOrder);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim()) {
      setErrorMessage("Nama kategori wajib diisi");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const url = isEditing ? `/api/admin/categories/${currentId}` : "/api/admin/categories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: formLabel,
          slug: formSlug,
          description: formDescription,
          badge: formBadge || null,
          sortOrder: Number(formSortOrder),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadCategories();
      } else {
        setErrorMessage(data.error || "Gagal menyimpan kategori");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Hapus kategori "${label}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadCategories();
      } else {
        alert(data.error || "Gagal menghapus kategori");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Kategori Produk</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola filter kategori pada etalase katalog landing page
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-light text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-400">
            Memuat kategori...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Kategori</th>
                  <th className="py-3 px-4">Slug ID</th>
                  <th className="py-3 px-4">Deskripsi</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Jumlah Produk</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-charcoal">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-3 px-4 font-bold text-charcoal">
                      {c.label}
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-[11px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 font-mono">
                        {c.slug}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                      {c.description || "-"}
                    </td>
                    <td className="py-3 px-4">
                      {c.badge ? (
                        <span className="px-2 py-0.5 bg-gold/20 text-gold-dark font-bold text-[10px] rounded-full">
                          {c.badge}
                        </span>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-600">
                      {c.count} Produk
                    </td>
                    <td className="py-3 px-4 text-right">
                      {c.slug !== "all" ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 text-stone-500 hover:text-forest hover:bg-stone-100 rounded-lg transition"
                            title="Edit Kategori"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.label)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-stone-400 italic">Default</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-charcoal">
                {isEditing ? "Edit Kategori" : "Tambah Kategori Baru"}
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
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Label Kategori *
                </label>
                <input
                  type="text"
                  required
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="Contoh: Songket Pengantin"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Slug ID (Huruf kecil & tanda hubung)
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="pengantin (otomatis jika dikosongkan)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deskripsi Kategori
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Contoh: Pilihan pakaian adat nikah songket mewah"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Contoh: Terlaris / Eksklusif"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
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

