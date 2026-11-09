"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, MessageCircle, X, ExternalLink } from "lucide-react";
import ShopeeIcon from "@/components/ShopeeIcon";
import { TESTIMONIALS } from "@/data/products";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

interface TestimonialItem {
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
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = TESTIMONIALS as any }) => {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  return (
    <section id="testimoni" className="py-16 sm:py-24 bg-ivory-warm border-b border-gold/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase mb-2 block">
            Kisah Pelanggan
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-forest-dark">
            Dipercaya Ratusan Keluarga Indonesia
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-light">
            Simak pengalaman nyata para orang tua dan pelanggan yang telah merasakan keindahan dan kenyamanan busana Kilau Songket.
          </p>
        </FadeIn>

        {/* Testimonials Grid with Stagger Motion */}
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t: any) => (
            <StaggerItem key={t.id}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-gold/40 transition-all duration-300 flex flex-col justify-between relative group h-full"
              >
                {/* Quote Icon Background */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-gold/15 group-hover:text-gold/30 transition-colors pointer-events-none" />

                <div>
                  {/* Rating & Event Tag / Shopee Badge */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {t.source === "shopee" ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#EE4D2D] bg-[#EE4D2D]/10 px-2.5 py-0.5 rounded-full border border-[#EE4D2D]/20">
                          <ShopeeIcon className="w-3.5 h-3.5" />
                          <span>Shopee Verified</span>
                        </span>
                      ) : t.source === "whatsapp" ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Order</span>
                        </span>
                      ) : null}

                      {t.event && (
                        <span className="text-[11px] font-semibold text-forest-dark bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                          {t.event}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-xs sm:text-sm text-charcoal leading-relaxed italic mb-4">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  {/* Screenshot / Photo Bukti Pembeli (if exists) */}
                  {t.photoUrl && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setActivePhoto(t.photoUrl || null)}
                        className="inline-block relative group/photo rounded-2xl overflow-hidden border border-stone-200 shadow-sm focus:outline-none"
                      >
                        <img
                          src={t.photoUrl}
                          alt={`Ulasan dari ${t.name}`}
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover group-hover/photo:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium">
                          Lihat Bukti
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Author & Product */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-forest-dark">
                      {t.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {t.role} • <span className="font-medium text-stone-700">{t.city}</span>
                    </p>
                  </div>

                  {t.productPurchased && (
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-stone-400 block">Produk:</span>
                      <span className="text-xs font-semibold text-forest-dark max-w-[160px] truncate block">
                        {t.productPurchased}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Social Proof Badge */}
        <FadeIn delay={0.2} className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gold/30 shadow-sm text-xs font-medium text-stone-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Semua ulasan diverifikasi dari pesanan WhatsApp & Toko Shopee resmi.</span>
          </div>
        </FadeIn>

      </div>

      {/* Modal View Full Screenshot / Foto Testimoni */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center shadow-lg hover:bg-forest transition"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={activePhoto}
              alt="Bukti Ulasan Asli"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
