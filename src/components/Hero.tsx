"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  ShoppingBag, 
  ShieldCheck, 
  Star,
  CheckCircle2
} from "lucide-react";
import { STORE_INFO } from "@/data/products";

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section id="beranda" className="relative overflow-hidden bg-ivory-warm pt-6 pb-16 lg:pt-12 lg:pb-24 border-b border-gold/15">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[450px] h-[450px] bg-forest/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 border border-gold/40 text-forest-dark text-xs sm:text-sm font-semibold tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <span>Digital Storefront & Eksklusif Songket Indonesia</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-forest-dark tracking-tight leading-[1.15]">
              Keanggunan Warisan{" "}
              <span className="text-gold-gradient relative inline-block">
                Songket
                <svg className="absolute -bottom-1 left-0 w-full h-2 text-gold/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>{" "}
              untuk Seluruh Generasi
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-charcoal-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Koleksi setelan songket premium untuk <strong className="text-forest font-semibold">anak-anak</strong> dan <strong className="text-forest font-semibold">dewasa</strong>. Dibuat dengan benang emas berkualitas tinggi dan <span className="bg-gold/15 px-1.5 py-0.5 rounded text-forest-dark font-medium">furing katun lembut anti-gatal</span> agar si kecil dan keluarga nyaman tampil memukau di momen istimewa.
            </p>

            {/* Key Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-charcoal font-medium">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>Furing Katun Adem (Aman untuk Kulit Anak)</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>Tersedia Ukuran Anak, Dewasa & Custom</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>Pesan Cepat via WhatsApp / Shopee</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>Garansi Tukar Ukuran 100% Aman</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-semibold text-white bg-forest hover:bg-forest-light rounded-full shadow-luxury hover:shadow-goldGlow transition-all duration-300 group hover:scale-[1.02]"
              >
                <span>Jelajahi Katalog Produk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Kilau%20Songket,%20saya%20tertarik%20dengan%20koleksi%20songket%20anak%20dan%20dewasa.%20Boleh%20minta%20info%20katalog%20lengkap?`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-forest-dark bg-white hover:bg-ivory border border-gold/50 rounded-full shadow-sm hover:border-gold transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 text-forest" />
                <span>Konsultasi WhatsApp</span>
              </a>

              <a
                href={STORE_INFO.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-[#EE4D2D] bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 border border-[#EE4D2D]/30 rounded-full transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Beli di Shopee</span>
              </a>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 text-charcoal">
              <div>
                <p className="text-2xl font-serif font-bold text-forest-dark">500+</p>
                <p className="text-xs text-charcoal-muted">Pesanan Terkirim</p>
              </div>
              <div className="h-8 w-px bg-stone-300 hidden sm:block" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-serif font-bold text-forest-dark">4.9</span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-charcoal-muted">Ulasan Pelanggan Puas</p>
              </div>
              <div className="h-8 w-px bg-stone-300 hidden sm:block" />
              <div>
                <p className="text-2xl font-serif font-bold text-forest-dark">1-12 Th</p>
                <p className="text-xs text-charcoal-muted">& Dewasa Lengkap</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Product Showcase with Float Motion */}
          <motion.div 
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Image Card with Floating Animation */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 aspect-[4/5] group"
              >
                <Image
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
                  alt="Koleksi Busana Kilau Songket Anak dan Dewasa"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-black/10" />

                {/* Floating Bottom Info within Image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-gold/30 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
                        Koleksi Unggulan
                      </span>
                      <h4 className="text-sm font-bold text-forest-dark">
                        Sarimbit Kirana & Setelan Cilik
                      </h4>
                      <p className="text-xs text-stone-500">
                        Pilihan busana adat & pesta keluarga
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-400 line-through">Rp 450.000</span>
                      <p className="text-sm font-bold text-forest">Mulai Rp 295rb</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge Top Left: Quality Guarantee */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-4 -left-4 sm:-left-6 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-gold/30 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center text-forest">
                  <ShieldCheck className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-dark">Furing Katun Silky</p>
                  <p className="text-[10px] text-stone-500">100% Nyaman Anti-Gatal</p>
                </div>
              </motion.div>

              {/* Floating Badge Bottom Right: 2 Transaction Channels */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -bottom-4 -right-4 sm:-right-6 bg-forest-dark text-ivory py-2.5 px-4 rounded-2xl shadow-2xl border border-gold/40 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                  <Sparkles className="w-4 h-4 text-gold-light" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Order Mudah</p>
                  <p className="text-[10px] text-gold-light">Via WhatsApp & Shopee</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
