"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  ExternalLink,
  Star,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import ShopeeIcon from "@/components/ShopeeIcon";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  images: string[];
  motif: string;
  material: string;
  furing: string;
  availableSizes: string[];
  colors: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  description: string;
  specs: { label: string; value: string }[];
  shopeeUrl: string;
}

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("anak");
  const [formSubCategory, setFormSubCategory] = useState("anak-laki");
  const [formCategoryLabel, setFormCategoryLabel] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [formMotif, setFormMotif] = useState("");
  const [formMaterial, setFormMaterial] = useState("");
  const [formFuring, setFormFuring] = useState("");
  const [formSizes, setFormSizes] = useState("");
  const [formColors, setFormColors] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formShopeeUrl, setFormShopeeUrl] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsNew, setFormIsNew] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Merge with local overrides so admin edits are never lost
        let merged = data.data;
        try {
          const overrides = JSON.parse(localStorage.getItem("ks_product_overrides") || "{}");
          merged = merged.map((p: Product) => {
            const override = overrides[p.id] || overrides[p.slug];
            return override ? { ...p, ...override } : p;
          });
        } catch {}

        setProducts(merged);
        try {
          localStorage.setItem("ks_live_products", JSON.stringify(merged));
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const bc = new BroadcastChannel("ks_sync");
            bc.postMessage({ type: "PRODUCTS_UPDATED", products: merged });
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
    loadProducts();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormName("");
    setFormCategory("anak");
    setFormSubCategory("anak-laki");
    setFormCategoryLabel("Songket Anak Laki-laki");
    setFormPrice("");
    setFormOriginalPrice("");
    setFormImages([]);
    setFormMotif("");
    setFormMaterial("Songket Tenun Halus Grade A");
    setFormFuring("Katun Silky Lembut (Hypoallergenic & Anti Gatal)");
    setFormSizes("1-2 Th (XS), 3-4 Th (S), 5-6 Th (M), 7-8 Th (L)");
    setFormColors("Deep Emerald Green, Maroon Royal, Navy Gold");
    setFormDescription("");
    setFormShopeeUrl("https://shopee.co.id/kilausongket");
    setFormIsFeatured(false);
    setFormIsBestSeller(false);
    setFormIsNew(true);
    setFormIsActive(true);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setIsEditing(true);
    setCurrentId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSubCategory(p.subCategory || p.category);
    setFormCategoryLabel(p.categoryLabel || "");
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : "");
    setFormImages(p.images || []);
    setFormMotif(p.motif || "");
    setFormMaterial(p.material || "");
    setFormFuring(p.furing || "");
    setFormSizes((p.availableSizes || []).join(", "));
    setFormColors((p.colors || []).join(", "));
    setFormDescription(p.description || "");
    setFormShopeeUrl(p.shopeeUrl || "");
    setFormIsFeatured(Boolean(p.isFeatured));
    setFormIsBestSeller(Boolean(p.isBestSeller));
    setFormIsNew(Boolean(p.isNew));
    setFormIsActive(Boolean(p.isActive));
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormImages((prev) => [...prev, data.url]);
      } else {
        alert(data.error || "Gagal upload gambar");
      }
    } catch {
      alert("Terjadi kesalahan saat upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= formImages.length) return;
    setFormImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    moveImage(index, 0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formName.trim() || !formPrice) {
      setErrorMessage("Nama produk dan harga wajib diisi.");
      return;
    }

    setSaving(true);

    const sizesArray = formSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const colorsArray = formColors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const finalImages = formImages.length > 0 ? formImages : ["/images/logo.jpg"];

    const payload = {
      name: formName,
      category: formCategory,
      subCategory: formSubCategory,
      categoryLabel: formCategoryLabel || formCategory,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      images: finalImages,
      motif: formMotif,
      material: formMaterial,
      furing: formFuring,
      availableSizes: sizesArray,
      colors: colorsArray,
      description: formDescription,
      shopeeUrl: formShopeeUrl,
      isFeatured: formIsFeatured,
      isBestSeller: formIsBestSeller,
      isNew: formIsNew,
      isActive: formIsActive,
      updatedAt: new Date().toISOString(),
    };

    try {
      const url = isEditing
        ? `/api/admin/products/${currentId}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);

        // Immediately update in-memory state
        const updatedList: Product[] = products.map((item) =>
          item.id === currentId || ((item as any).slug && (item as any).slug === currentId)
            ? ({ ...item, ...payload } as Product)
            : item
        );
        setProducts(updatedList);

        // Save persistent override so it syncs across tabs instantly
        try {
          localStorage.setItem("ks_live_products", JSON.stringify(updatedList));
          const overrides = JSON.parse(localStorage.getItem("ks_product_overrides") || "{}");
          if (currentId) overrides[currentId] = payload;
          const matched = products.find((p) => p.id === currentId || ((p as any).slug && (p as any).slug === currentId));
          if (matched?.id) overrides[matched.id] = payload;
          if ((matched as any)?.slug) overrides[(matched as any).slug] = payload;
          localStorage.setItem("ks_product_overrides", JSON.stringify(overrides));

          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const bc = new BroadcastChannel("ks_sync");
            bc.postMessage({ type: "PRODUCTS_UPDATED", products: updatedList });
            bc.close();
          }
        } catch {}

        loadProducts();
      } else {
        setErrorMessage(data.error || "Gagal menyimpan produk.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadProducts();
      } else {
        alert(data.error || "Gagal menghapus produk");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const toggleProductActive = async (p: Product) => {
    try {
      await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      setProducts((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.motif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Manajemen Produk</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Tambah, edit, sesuaikan harga, deskripsi, foto & link Shopee produk
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-light text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, motif, atau bahan..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "anak", "dewasa", "sarimbit"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-forest text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat === "all" ? "Semua Kategori" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-stone-400">
            <div className="w-8 h-8 border-3 border-forest border-t-gold rounded-full animate-spin mx-auto mb-2" />
            Memuat daftar produk...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400">
            Tidak ada produk yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga</th>
                  <th className="py-3 px-4">Furing & Bahan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-charcoal">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden relative flex-shrink-0 border border-stone-200">
                          {p.images && p.images[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-stone-400 m-auto mt-3.5" />
                          )}
                        </div>
                        <div className="max-w-[220px]">
                          <div className="font-bold text-charcoal truncate" title={p.name}>
                            {p.name}
                          </div>
                          <div className="text-[11px] text-stone-400 truncate">
                            {p.motif || "Motif Tradisional"}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.isFeatured && (
                              <span className="px-1.5 py-0.2 bg-gold/20 text-gold-dark text-[9px] font-bold rounded">
                                Unggulan
                              </span>
                            )}
                            {p.isBestSeller && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                                Terlaris
                              </span>
                            )}
                            {p.isNew && (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                                Baru
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-forest">
                        Rp {p.price.toLocaleString("id-ID")}
                      </div>
                      {p.originalPrice && (
                        <div className="text-[10px] text-stone-400 line-through">
                          Rp {p.originalPrice.toLocaleString("id-ID")}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-[180px]">
                      <div className="text-[11px] text-stone-600 truncate" title={p.furing}>
                        <span className="font-medium text-emerald-700">Furing:</span> {p.furing || "-"}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate" title={p.material}>
                        {p.material || "-"}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductActive(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          p.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200"
                        }`}
                        title="Klik untuk toggle status tampil di website"
                      >
                        {p.isActive ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Tampil</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 text-stone-400" />
                            <span>Sembunyi</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-stone-500 hover:text-forest hover:bg-stone-100 rounded-lg transition"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-charcoal">
                  {isEditing ? "Edit Produk Songket" : "Tambah Produk Songket Baru"}
                </h3>
                <p className="text-xs text-stone-500">
                  Lengkapi data produk untuk ditampilkan di katalog website
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Setelan Songket Cilik Panglima Emas (Anak Laki-laki)"
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kategori Utama *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-white"
                  >
                    <option value="anak">Anak (1-12 Th)</option>
                    <option value="dewasa">Dewasa</option>
                    <option value="sarimbit">Sarimbit Keluarga</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Sub Kategori
                  </label>
                  <select
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-white"
                  >
                    <option value="anak-laki">Anak Laki-laki</option>
                    <option value="anak-perempuan">Anak Perempuan</option>
                    <option value="dewasa-wanita">Dewasa Wanita</option>
                    <option value="dewasa-pria">Dewasa Pria</option>
                    <option value="sarimbit">Sarimbit Keluarga</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Label Kategori
                  </label>
                  <input
                    type="text"
                    value={formCategoryLabel}
                    onChange={(e) => setFormCategoryLabel(e.target.value)}
                    placeholder="Contoh: Songket Anak Laki-laki"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Harga Jual (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="385000"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Harga Coret (Sebelum Diskon)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="450000 (Opsional)"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>

              {/* Furing & Material (USP Kilau Songket) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Lapisan Furing (USP Utama) *
                  </label>
                  <input
                    type="text"
                    value={formFuring}
                    onChange={(e) => setFormFuring(e.target.value)}
                    placeholder="Contoh: Katun Silky Lembut (Anti Gatal)"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bahan / Kain Songket
                  </label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="Contoh: Tenun ATBM Grade A & Benang Emas"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>

              {/* Motif & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nama Motif
                  </label>
                  <input
                    type="text"
                    value={formMotif}
                    onChange={(e) => setFormMotif(e.target.value)}
                    placeholder="Contoh: Lepus Bintang Berlian Klasik"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Pilihan Ukuran (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    placeholder="1-2 Th (XS), 3-4 Th (S), 5-6 Th (M)"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pilihan Warna / Varian (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formColors}
                  onChange={(e) => setFormColors(e.target.value)}
                  placeholder="Deep Emerald Green, Maroon Royal, Navy Gold"
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              {/* Images with Reorder & Primary Selector */}
              <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block font-semibold text-stone-800 text-xs">
                      Foto Produk ({formImages.length} Foto)
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Foto <strong>#1 (Cover Depan)</strong> adalah foto yang otomatis tampil di etalase depan katalog website. Klik tombol <strong>← / →</strong> atau klik <strong>Utama</strong> untuk mengatur urutan sebelum disimpan.
                    </p>
                  </div>
                </div>

                {formImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {formImages.map((img, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={() => setDraggedImageIndex(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedImageIndex !== null && draggedImageIndex !== idx) {
                            moveImage(draggedImageIndex, idx);
                            setDraggedImageIndex(null);
                          }
                        }}
                        className={`relative rounded-xl border-2 transition-all p-1.5 flex flex-col justify-between bg-white shadow-sm ${
                          idx === 0
                            ? "border-amber-500 ring-2 ring-amber-400/40 shadow-md"
                            : "border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {/* Image Preview */}
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-100 mb-1.5">
                          <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Primary Badge or Sequence */}
                          <div className="absolute top-1 left-1">
                            {idx === 0 ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-current" /> Cover Depan
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm shadow">
                                #{idx + 1}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-stone-100">
                          {/* Move Left */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveImage(idx, idx - 1)}
                            className="p-1 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-25 disabled:pointer-events-none transition"
                            title="Geser ke Kiri (Tampilkan Lebih Depan)"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* Make Primary Button (if not already #0) */}
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(idx)}
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
                              title="Jadikan Foto Cover Utama di Etalase Depan"
                            >
                              ★ Cover
                            </button>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold px-1">
                              Tampilan Depan
                            </span>
                          )}

                          {/* Move Right */}
                          <button
                            type="button"
                            disabled={idx === formImages.length - 1}
                            onClick={() => moveImage(idx, idx + 1)}
                            className="p-1 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-25 disabled:pointer-events-none transition"
                            title="Geser ke Kanan"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-stone-400 border border-dashed border-stone-300 rounded-xl mb-3">
                    Belum ada foto. Upload foto atau masukkan link gambar di bawah ini.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* File Upload */}
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-stone-300 rounded-xl hover:bg-white hover:border-forest/60 cursor-pointer text-stone-700 font-medium transition bg-stone-50 shadow-sm">
                    <Upload className="w-4 h-4 text-forest" />
                    <span>{uploading ? "Mengupload..." : "Upload Foto dari Komputer / HP"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>

                  {/* URL Input */}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Atau tempel link URL foto..."
                      className="flex-1 px-3 py-1.5 border border-stone-300 rounded-xl focus:outline-none focus:border-forest text-[11px] bg-white"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-semibold transition"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* Shopee URL */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Link Produk Shopee
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <ShopeeIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={formShopeeUrl}
                    onChange={(e) => setFormShopeeUrl(e.target.value)}
                    placeholder="https://shopee.co.id/kilausongket/..."
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deskripsi Lengkap Produk
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Jelaskan kenyamanan furing katun, keunggulan motif, dan kecocokan untuk acara apa..."
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              {/* Badges / Checkboxes */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-4 text-xs font-semibold text-stone-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-forest focus:ring-forest w-4 h-4"
                  />
                  <span>Produk Unggulan</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsBestSeller}
                    onChange={(e) => setFormIsBestSeller(e.target.checked)}
                    className="rounded text-forest focus:ring-forest w-4 h-4"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="rounded text-forest focus:ring-forest w-4 h-4"
                  />
                  <span>Koleksi Baru</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded text-forest focus:ring-forest w-4 h-4"
                  />
                  <span>Aktif di Etalase</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2.5">
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
                  {saving ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

