"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  X, 
  MessageCircle, 
  ShoppingBag, 
  Star, 
  Ruler, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  ExternalLink
} from "lucide-react";
import { Product, formatRupiah, STORE_INFO } from "@/data/products";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import ShopeeIcon from "./ShopeeIcon";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
}) => {
  const { settings, getWhatsAppProductUrl } = useStoreSettings();
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");

  const dynamicWaUrl = getWhatsAppProductUrl(product.name, `${selectedSize} - Warna: ${selectedColor}`);
  const shopeeLink = product.shopeeUrl || settings.shopeeUrl || STORE_INFO.shopeeUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Modal Dialog Card */}
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gold/30 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors shadow-sm"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Primary Large Image Preview */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-forest-dark border border-gold/40 shadow-sm">
                  {product.categoryLabel}
                </span>
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === img ? "border-gold ring-2 ring-gold/40 scale-95" : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box */}
            <div className="bg-ivory-warm p-4 rounded-2xl border border-stone-200 text-xs space-y-2 text-charcoal">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Furing Anti-Gatal:</strong> Nyaman untuk kulit sensitif anak.</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span><strong>Garansi Tukar Ukuran:</strong> Bisa retur jika ukuran tidak cocok.</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-forest flex-shrink-0" />
                <span><strong>Pengiriman Cepat:</strong> J&T, SiCepat, JNE seluruh Indonesia.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Motif Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-dark text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Motif Songket: {product.motif}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark leading-snug">
                {product.name}
              </h2>

              {/* Rating & Sold count */}
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-bold text-stone-800">{product.rating}</span>
                </div>
                <span>•</span>
                <span>{product.soldCount} Pembeli Puas</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Stok Tersedia & Custom</span>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-ivory border border-gold/30 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 block mb-0.5">Harga Produk:</span>
                  <p className="text-2xl sm:text-3xl font-bold text-forest">
                    {formatRupiah(product.price)}
                  </p>
                </div>
                {product.originalPrice && (
                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                    <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
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
                    onClick={onOpenSizeGuide}
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
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
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

              {/* Color Options */}
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
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
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
                <h4 className="text-xs font-bold text-forest-dark uppercase tracking-wide mb-1.5">
                  Deskripsi & Keunggulan Produk:
                </h4>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {product.specs.map((spec, i) => (
                  <div key={i} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">{spec.label}</span>
                    <span className="font-medium text-stone-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons (Shopee & WhatsApp Integration) */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="text-xs text-stone-500 flex items-center justify-between">
                <span>Pilihan Kanal Transaksi:</span>
                <span className="font-semibold text-forest">CS Fast Response 08.00 - 21.00</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Order Button */}
                <a
                  href={dynamicWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-forest hover:bg-forest-light transition-all shadow-luxury hover:shadow-goldGlow"
                >
                  <MessageCircle className="w-4 h-4 text-gold-light" />
                  <span>Pesan via WhatsApp</span>
                </a>

                {/* Shopee Buy Button */}
                <a
                  href={shopeeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-[#EE4D2D] bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 border border-[#EE4D2D]/40 transition-all"
                >
                  <ShopeeIcon className="w-4 h-4" />
                  <span>Beli di Shopee</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>💡 Info produk & ukuran terisi otomatis di WA.</span>
                <a
                  href={`/produk/${product.id}`}
                  className="text-gold-dark hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Buka Halaman Lengkap</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

