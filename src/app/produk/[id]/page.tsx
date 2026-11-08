"use client";

import React, { useState, use } from "react";
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
  ExternalLink,
  ChevronRight,
  Share2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SizeGuideModal from "@/components/SizeGuideModal";
import { PRODUCTS, Product, formatRupiah, getWhatsAppProductUrl, STORE_INFO } from "@/data/products";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = PRODUCTS.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

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
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-forest-dark transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/#katalog" className="hover:text-forest-dark transition-colors">
            Katalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-gold-dark font-medium">{product.categoryLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-forest-dark font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/#katalog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest hover:text-forest-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-600 hover:text-forest-dark shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? "Link Disalin!" : "Bagikan Produk"}</span>
          </button>
        </div>

        {/* Product Detail Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-forest-dark border border-gold/40 shadow-sm">
                    {product.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === img ? "border-gold ring-2 ring-gold/40 scale-95" : "border-stone-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Guarantee Cards */}
              <div className="bg-ivory-warm p-4 rounded-2xl border border-stone-200 text-xs space-y-2 text-charcoal">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Furing Anti-Gatal:</strong> Nyaman untuk kulit sensitif anak.</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-gold-dark flex-shrink-0" />
                  <span><strong>Garansi Tukar Ukuran:</strong> Retur aman jika ukuran kurang pas.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-forest flex-shrink-0" />
                  <span><strong>Pengiriman Aman:</strong> J&T, SiCepat, JNE ke seluruh Indonesia.</span>
                </div>
              </div>
            </div>

            {/* Right: Info, Price, Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-dark text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Motif Songket: {product.motif}</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest-dark leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 font-bold text-stone-800">{product.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{product.soldCount} Pembeli Puas</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Stok Ready & Custom</span>
                </div>

                {/* Price Display */}
                <div className="p-5 rounded-2xl bg-ivory border border-gold/30 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-stone-500 block mb-0.5">Harga Produk:</span>
                    <p className="text-3xl font-bold text-forest">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                  {product.originalPrice && (
                    <div className="text-right">
                      <span className="text-sm text-stone-400 line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                      <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded">
                        Hemat {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Size Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-forest-dark uppercase tracking-wide">
                      Pilih Ukuran: <span className="text-gold-dark font-semibold">{selectedSize}</span>
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-gold-dark hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Lihat Panduan Ukuran</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => {
                      const isSizeSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            isSizeSelected
                              ? "bg-forest text-white border-forest shadow-md"
                              : "bg-white text-stone-700 hover:bg-stone-50 border-stone-300"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-forest-dark uppercase tracking-wide block mb-2">
                      Pilihan Warna: <span className="text-gold-dark font-semibold">{selectedColor}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => {
                        const isColorSelected = selectedColor === color;
                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                              isColorSelected
                                ? "bg-gold text-forest-dark font-bold border-gold shadow-sm"
                                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                            }`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-forest-dark uppercase tracking-wide mb-1.5">
                    Deskripsi Lengkap & Bahan:
                  </h3>
                  <p className="text-sm text-charcoal-light leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Specs Table */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <span className="text-stone-400 block text-[10px] uppercase font-semibold">{spec.label}</span>
                      <span className="font-medium text-stone-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-stone-200 space-y-3">
                <div className="text-xs text-stone-500 flex items-center justify-between">
                  <span>Pilihan Kanal Pemesanan:</span>
                  <span className="font-semibold text-forest">CS Fast Response 08.00 - 21.00</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={dynamicWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold text-white bg-forest hover:bg-forest-light transition-all shadow-luxury hover:shadow-goldGlow"
                  >
                    <MessageCircle className="w-5 h-5 text-gold-light" />
                    <span>Pesan via WhatsApp</span>
                  </a>

                  <a
                    href={product.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold text-[#EE4D2D] bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 border border-[#EE4D2D]/40 transition-all"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Beli di Shopee</span>
                    <ExternalLink className="w-4 h-4 opacity-70" />
                  </a>
                </div>

                <p className="text-[11px] text-center text-stone-400">
                  💡 Tombol WhatsApp langsung menyertakan informasi produk dan ukuran pilihan Anda secara otomatis.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* PRD Section 4C: Rekomendasi Produk Lainnya */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase mb-1 block">
                Pilihan Serupa
              </span>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-forest-dark">
                Rekomendasi Koleksi Lainnya
              </h2>
            </div>
            <Link
              href="/#katalog"
              className="text-xs sm:text-sm font-bold text-gold-dark hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Katalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                  <Image
                    src={rel.images[0]}
                    alt={rel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-forest-dark border border-stone-200">
                      {rel.categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-gold-dark truncate mb-1">
                      {rel.motif}
                    </p>
                    <Link
                      href={`/produk/${rel.id}`}
                      className="font-serif font-bold text-sm text-forest-dark line-clamp-2 hover:text-gold-dark transition-colors"
                    >
                      {rel.name}
                    </Link>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                    <p className="text-sm font-bold text-forest">
                      {formatRupiah(rel.price)}
                    </p>
                    <Link
                      href={`/produk/${rel.id}`}
                      className="text-xs font-semibold text-gold-dark hover:underline"
                    >
                      Detail &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />
      <FloatingWhatsApp />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}

