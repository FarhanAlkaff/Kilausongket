"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingBag, Gift, Clock } from "lucide-react";
import { STORE_INFO } from "@/data/products";
import { ScaleIn } from "@/components/ui/motion-wrapper";
import { useStoreSettings } from "@/context/StoreSettingsContext";

interface PromoBannerProps {
  promoTitle?: string;
  promoSubtitle?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  promoTitle,
  promoSubtitle,
}) => {
  const { settings } = useStoreSettings();
  const whatsappNum = settings.whatsappNumber || STORE_INFO.whatsappNumber;
  const shopeeLink = settings.shopeeUrl || STORE_INFO.shopeeUrl;
  const finalTitle = promoTitle || settings.promoTitle || "Rencanakan Momen Bersejarah Keluarga dengan Kemilau Songket Mewah";
  const finalSubtitle = promoSubtitle || settings.promoSubtitle;
  return (
    <section className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScaleIn>
          <div className="relative rounded-3xl overflow-hidden bg-forest-dark text-white p-8 sm:p-12 border border-gold/40 shadow-2xl">
            {/* Subtle Ambient Lighting with Motion */}
            <motion.div 
              animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.05, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none" 
            />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Text & Pitch */}
              <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/50 text-gold-light text-xs font-semibold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Penawaran Spesial Seragam Keluarga & Acara Adat</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ivory leading-snug">
                  {finalTitle}
                </h2>

                <p className="text-sm sm:text-base text-ivory/80 max-w-2xl leading-relaxed">
                  {finalSubtitle || (
                    <>
                      Dapatkan <strong>diskon khusus untuk pesanan Sarimbit Keluarga (3 pcs atau lebih)</strong> serta gratis konsultasi ukuran custom. Pesan sekarang melalui WhatsApp untuk persiapan lebih awal!
                    </>
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-gold-light">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold" /> Promo Berlaku Terbatas
                  </span>
                  <span>•</span>
                  <span>Bisa Kirim ke Seluruh Indonesia</span>
                  <span>•</span>
                  <span>Tersedia Pembayaran COD via Shopee</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href={`https://wa.me/${whatsappNum}?text=Halo%20Kilau%20Songket,%20saya%20tertarik%20dengan%20promo%20sarimbit%20keluarga%20/%20pesanan%20khusus`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-forest-dark bg-gold hover:bg-gold-light transition-all shadow-lg hover:shadow-goldGlow hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Klaim Promo via WhatsApp</span>
                </a>

                <a
                  href={shopeeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#EE4D2D]" />
                  <span>Lihat Toko di Shopee</span>
                </a>
              </div>

            </div>

          </div>
        </ScaleIn>

      </div>
    </section>
  );
};

export default PromoBanner;
