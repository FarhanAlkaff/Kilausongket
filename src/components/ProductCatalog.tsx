"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Star, 
  MessageCircle, 
  ShoppingBag, 
  Eye, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Product, PRODUCTS, CATEGORIES, formatRupiah, getWhatsAppProductUrl } from "@/data/products";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import ShopeeIcon from "./ShopeeIcon";

interface ProductCatalogProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onViewProduct: (product: Product) => void;
  products?: Product[];
  categories?: any[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  onViewProduct,
  products = PRODUCTS,
  categories = CATEGORIES,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "bestseller">("featured");

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Subfilter
      if (subFilter !== "all" && product.subCategory !== subFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesMotif = product.motif.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.categoryLabel.toLowerCase().includes(query);
        return matchesName || matchesMotif || matchesDesc || matchesCat;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "bestseller") return b.soldCount - a.soldCount;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, subFilter, searchQuery, sortBy]);

  return (
    <section id="katalog" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-dark text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Resmi Kilau Songket</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-forest-dark">
            Koleksi Songket Anak & Dewasa
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-light">
            Sentuhan keindahan tenun songket berkelas tinggi. Pilih model favorit Anda, konsultasikan ukuran via WhatsApp, atau belanja langsung di Shopee.
          </p>
        </FadeIn>

        {/* Filters & Search Toolbar */}
        <FadeIn delay={0.1} className="bg-ivory-warm p-4 sm:p-6 rounded-2xl border border-stone-200/90 shadow-sm mb-10 space-y-4">
          
          {/* Top Row: Main Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setSubFilter("all");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-forest text-white shadow-md scale-105"
                        : "bg-white text-charcoal hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span 
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-gold text-forest-dark font-bold" : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-4 h-4 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-300 text-xs sm:text-sm font-medium text-charcoal rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="featured">Urutan: Rekomendasi</option>
                <option value="bestseller">Paling Laris (Terlaris)</option>
                <option value="price-asc">Harga: Terendah &rarr; Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi &rarr; Terendah</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Search Box & Subfilters */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari produk, motif (cth: Lepus, Cilik)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sub-Filters */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter Jenis:
              </span>
              <button
                onClick={() => setSubFilter("all")}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  subFilter === "all" ? "bg-forest-light text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Semua
              </button>
              {(selectedCategory === "all" || selectedCategory === "anak") && (
                <>
                  <button
                    onClick={() => setSubFilter("anak-laki")}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                      subFilter === "anak-laki" ? "bg-forest-light text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    Anak Laki-laki
                  </button>
                  <button
                    onClick={() => setSubFilter("anak-perempuan")}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                      subFilter === "anak-perempuan" ? "bg-forest-light text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    Anak Perempuan
                  </button>
                </>
              )}
              {(selectedCategory === "all" || selectedCategory === "dewasa") && (
                <>
                  <button
                    onClick={() => setSubFilter("dewasa-wanita")}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                      subFilter === "dewasa-wanita" ? "bg-forest-light text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    Wanita Dewasa
                  </button>
                  <button
                    onClick={() => setSubFilter("dewasa-pria")}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                      subFilter === "dewasa-pria" ? "bg-forest-light text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    Pria Dewasa
                  </button>
                </>
              )}
              {(selectedCategory === "all" || selectedCategory === "sarimbit") && (
                <button
                  onClick={() => setSubFilter("sarimbit")}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                    subFilter === "sarimbit" ? "bg-forest-light text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  Sarimbit
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Product Grid with Motion */}
        {filteredProducts.length === 0 ? (
          <FadeIn className="text-center py-16 bg-ivory-warm rounded-3xl border border-stone-200">
            <p className="text-lg font-medium text-stone-600">Tidak ada produk yang sesuai dengan kriteria.</p>
            <button
              onClick={() => {
                onSelectCategory("all");
                setSubFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 px-5 py-2 text-xs font-semibold text-forest bg-gold/20 hover:bg-gold/30 rounded-xl"
            >
              Reset Semua Filter
            </button>
          </FadeIn>
        ) : (
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const waUrl = getWhatsAppProductUrl(product.name);

              return (
                <StaggerItem key={product.id}>
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    {/* Image & Badges Container */}
                    <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onViewProduct(product)}>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        unoptimized={product.images[0]?.startsWith("data:")}
                        className="object-cover group-hover:scale-106 transition-transform duration-500"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                        {product.isBestSeller && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                            Terlaris ★
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-forest text-white shadow-sm">
                            Koleksi Baru
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-forest-dark border border-stone-200 shadow-sm">
                          {product.categoryLabel}
                        </span>
                      </div>

                      {/* Hover Quick View Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProduct(product);
                        }}
                        className="absolute bottom-3 left-3 right-3 py-2 px-3 rounded-xl bg-white/95 backdrop-blur-md text-forest-dark text-xs font-semibold flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg hover:bg-gold hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Detail & Ukuran</span>
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Motif Tag */}
                        <p className="text-[11px] font-medium text-gold-dark truncate mb-1">
                          Motif: {product.motif}
                        </p>

                        {/* Product Title */}
                        <h3 
                          onClick={() => onViewProduct(product)}
                          className="font-serif font-bold text-sm sm:text-base text-forest-dark line-clamp-2 hover:text-gold-dark cursor-pointer transition-colors"
                        >
                          {product.name}
                        </h3>

                        {/* Ratings & Sold */}
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-500">
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="ml-1 font-semibold text-stone-700">{product.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{product.soldCount} Terjual</span>
                        </div>

                        {/* Furing Highlight Tag */}
                        <div className="mt-2 text-[11px] text-stone-600 bg-ivory px-2 py-1 rounded-md border border-stone-200">
                          🛡️ <span className="font-medium text-forest-dark">{product.furing.split('(')[0]}</span>
                        </div>
                      </div>

                      {/* Price and Action Buttons */}
                      <div className="pt-3 mt-3 border-t border-stone-100">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <p className="text-base sm:text-lg font-bold text-forest">
                              {formatRupiah(product.price)}
                            </p>
                            {product.originalPrice && (
                              <p className="text-[11px] text-stone-400 line-through">
                                {formatRupiah(product.originalPrice)}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                            Ready & Custom
                          </span>
                        </div>

                        {/* Dual Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold text-white bg-forest hover:bg-forest-light transition-all shadow-sm"
                            title="Pesan Langsung via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-gold-light" />
                            <span>Pesan WA</span>
                          </a>

                          <a
                            href={product.shopeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-[#EE4D2D] bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 border border-[#EE4D2D]/30 transition-all"
                            title="Beli via Shopee"
                          >
                            <ShopeeIcon className="w-3.5 h-3.5" />
                            <span>Shopee</span>
                          </a>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

      </div>
    </section>
  );
};

export default ProductCatalog;
