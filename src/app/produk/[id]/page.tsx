"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  MessageCircle, 
  ShoppingBag, 
  Star, 
  Ruler, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronRight,
  Share2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SizeGuideModal from "@/components/SizeGuideModal";
import ShopeeIcon from "@/components/ShopeeIcon";
import { PRODUCTS, Product, formatRupiah, STORE_INFO } from "@/data/products";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { settings, getWhatsAppProductUrl } = useStoreSettings();
  const resolvedParams = use(params);
  const staticProduct = PRODUCTS.find((p) => p.id === resolvedParams.id);

  const [product, setProduct] = useState<Product | null>(staticProduct || null);
  const [loading, setLoading] = useState(!staticProduct);
  const [selectedImage, setSelectedImage] = useState(staticProduct?.images[0] || "");
  const [selectedSize, setSelectedSize] = useState(staticProduct?.availableSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(staticProduct?.colors[0] || "");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${resolvedParams.id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProduct(json.data);
          setSelectedImage(json.data.images[0] || "");
          setSelectedSize(json.data.availableSizes[0] || "");
          setSelectedColor(json.data.colors[0] || "");
        }
      } catch (err) {
        console.error("Could not fetch product from API", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-warm flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-forest border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Recommendations: Other products from same category or featured
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured)).slice(0, 4);

  const dynamicWaUrl = getWhatsAppProductUrl(product.name, `${selectedSize} - Warna: ${selectedColor}`);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-warm text-charcoal">
      <Navbar onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-light mb-6">
          <Link href="/" className="hover:text-forest transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/#katalog" className="hover:text-forest transition">Katalog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="capitalize">{product.categoryLabel || product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-forest font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/#katalog" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-forest transition px-3 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog Lengkap</span>
          </Link>
        </div>

        {/* Product Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm mb-12">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Featured Image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.isFeatured && (
                <div className="absolute top-4 left-4 bg-gold/95 backdrop-blur-sm text-forest-dark px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 border border-white/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Koleksi Unggulan</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === img ? "border-gold shadow-md scale-105" : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark bg-gold/15 px-3 py-1 rounded-full">
                  {product.categoryLabel || product.category}
                </span>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-forest transition"
                  title="Salin Link Produk"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedShare ? "Tersalin!" : "Bagikan"}</span>
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark leading-snug">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-forest">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-stone-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* USP Highlight Box */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Jaminan Kenyamanan Furing Katun</span>
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  {product.furing || "Dilapisi furing katun silky adem dan lembut, bebas gatal dan aman untuk kulit sensitif."}
                </p>
              </div>

              {/* Size Selector */}
              {product.availableSizes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal">Pilih Ukuran:</span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-semibold text-gold-dark hover:underline flex items-center gap-1"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Panduan Ukuran</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedSize === size
                            ? "border-forest bg-forest text-white shadow-sm font-semibold"
                            : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-charcoal">Pilihan Warna / Motif:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedColor === color
                            ? "border-forest bg-forest text-white shadow-sm font-semibold"
                            : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="pt-4 space-y-3">
                <a
                  href={dynamicWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-forest hover:bg-forest-light text-white font-bold text-sm rounded-2xl shadow-lg transition duration-200"
                >
                  <MessageCircle className="w-4 h-4 text-gold-light" />
                  <span>Pesan Sekarang via WhatsApp</span>
                </a>

                {(product.shopeeUrl || settings.shopeeUrl) && (
                  <a
                    href={product.shopeeUrl || settings.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/15 text-[#EE4D2D] font-bold text-sm rounded-2xl border border-[#EE4D2D]/30 transition"
                  >
                    <ShopeeIcon className="w-4 h-4" />
                    <span>Beli di Shopee</span>
                  </a>
                )}
              </div>
            </div>

            {/* Description & Specs */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Deskripsi Busana
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.specs && product.specs.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Spesifikasi Produk
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="text-[10px] text-stone-400 block">{spec.label}</span>
                        <span className="font-semibold text-charcoal">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-forest-dark mb-6">
              Rekomendasi Pilihan Lainnya
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/produk/${rel.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[4/5] bg-stone-100 overflow-hidden relative">
                    <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h3 className="text-xs font-bold text-charcoal line-clamp-1 group-hover:text-forest transition">
                      {rel.name}
                    </h3>
                    <p className="text-xs font-bold text-forest">{formatRupiah(rel.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />
      <FloatingWhatsApp />
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
