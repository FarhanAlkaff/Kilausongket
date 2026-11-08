"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ShieldCheck, 
  Scissors, 
  Users, 
  ShoppingBag, 
  RotateCcw,
  CheckCircle
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

export const ValueProps: React.FC = () => {
  const values = [
    {
      icon: ShieldCheck,
      title: "Furing Katun Silky Anti-Gatal",
      desc: "Seluruh bagian dalam dilapisi furing katun halus, lembut dan hypoallergenic. Si kecil tidak akan rewel karena gatal atau panas, nyaman dipakai berjam-jam.",
      badge: "Kenyamanan #1 Anak"
    },
    {
      icon: Sparkles,
      title: "Tenunan Halus & Benang Emas Asli",
      desc: "Motif songket dirajut dengan benang metalik berkualitas tinggi yang memantulkan kilau elegan dan mewah, tidak kusam dan tidak mudah rontok.",
      badge: "Kemewahan Tradisi"
    },
    {
      icon: Scissors,
      title: "Jahitan Butik Presisi & Rapi",
      desc: "Dikerjakan oleh penjahit berpengalaman dengan potongan pola ergonomis. Potongan fitted melangsingkan untuk dewasa dan fleksibel untuk anak.",
      badge: "Kualitas Tailor"
    },
    {
      icon: Users,
      title: "Koleksi Sarimbit & Custom Ukuran",
      desc: "Tersedia setelan kompak untuk seluruh keluarga (Ayah, Ibu, Anak Laki & Perempuan). Melayani Custom Size jika ukuran badan memiliki standar khusus.",
      badge: "Solusi Keluarga"
    },
    {
      icon: ShoppingBag,
      title: "Order Fleksibel: WhatsApp & Shopee",
      desc: "Bisa konsultasi ramah dengan stylist toko via WhatsApp, atau transaksi cepat dengan fitur gratis ongkir dan promo marketplace di akun resmi Shopee.",
      badge: "Dua Kanal Praktis"
    },
    {
      icon: RotateCcw,
      title: "Garansi Tukar Ukuran 100% Aman",
      desc: "Khawatir kekecilan atau kebesaran? Kami berikan jaminan tukar ukuran dalam 3 hari agar pakaian pas sempurna saat hari acara berlangsung.",
      badge: "Belanja Tanpa Cemas"
    }
  ];

  return (
    <section id="keunggulan" className="py-16 sm:py-24 bg-ivory-warm border-y border-gold/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title with Motion */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase mb-2 block">
            Mengapa Kilau Songket?
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-forest-dark">
            Komitmen Kualitas & Kenyamanan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-light">
            Kami memadukan kemegahan tradisi tenun nusantara dengan standar kenyamanan modern yang ramah bagi anak-anak dan orang dewasa.
          </p>
        </FadeIn>

        {/* Value Cards Grid with Stagger Motion */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <StaggerItem key={idx}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-forest/5 group-hover:bg-gold/20 flex items-center justify-center text-forest group-hover:text-forest-dark transition-colors">
                        <Icon className="w-6 h-6 text-gold-dark" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-ivory text-forest-dark border border-stone-200">
                        {v.badge}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-forest-dark mb-2 group-hover:text-gold-dark transition-colors">
                      {v.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                      {v.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-forest font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Standar Kilau Songket</span>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
};

export default ValueProps;
