"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS } from "@/data/products";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

export const Testimonials: React.FC = () => {
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
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.id}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-gold/40 transition-all duration-300 flex flex-col justify-between relative group h-full"
              >
                {/* Quote Icon Background */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-gold/15 group-hover:text-gold/30 transition-colors pointer-events-none" />

                <div>
                  {/* Rating & Event Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <span className="text-[11px] font-semibold text-forest-dark bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                      {t.event}
                    </span>
                  </div>

                  {/* Review Content */}
                  <p className="text-xs sm:text-sm text-charcoal leading-relaxed italic mb-6">
                    &ldquo;{t.content}&rdquo;
                  </p>
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

                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-stone-400 block">Produk:</span>
                    <span className="text-xs font-semibold text-forest-dark max-w-[160px] truncate block">
                      {t.productPurchased}
                    </span>
                  </div>
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
    </section>
  );
};

export default Testimonials;
