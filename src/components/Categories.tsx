"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

interface CategoriesProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string;
}

export const Categories: React.FC<CategoriesProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const categoryCards = [
    {
      id: "anak",
      title: "Koleksi Songket Anak",
      subTitle: "Usia 1 - 12 Tahun & Balita",
      desc: "Dirancang khusus dengan furing katun hypoallergenic super adem. Aman untuk kulit si kecil, bebas rasa gatal saat karnaval, pentas & pesta keluarga.",
      badge: "Paling Diminati Orang Tua",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      stats: "4+ Varian Model Anak"
    },
    {
      id: "dewasa",
      title: "Songket Dewasa (Pria & Wanita)",
      subTitle: "Pernikahan, Wisuda & Acara Adat",
      desc: "Setelan kebaya kurung modern yang melangsingkan serta kemeja pria berwibawa dengan panel tenun emas autentik.",
      badge: "Elegan & Mewah",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      stats: "Pilihan Ukuran S - XXL & Custom"
    },
    {
      id: "sarimbit",
      title: "Sarimbit Keluarga",
      subTitle: "Serasi Ayah, Ibu & Buah Hati",
      desc: "Tampil harmonis dan kompak di hari istimewa dengan motif songket senada. Tersedia opsi custom ukuran tubuh seluruh anggota keluarga.",
      badge: "Eksklusif & Terbatas",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      stats: "Paket Lengkap 3 - 4 Pcs"
    }
  ];

  return (
    <section className="py-16 bg-ivory/50 border-b border-gold/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with FadeIn Motion */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase mb-2 block">
            Kategori Busana
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-forest-dark">
            Pilihan Koleksi Kilau Songket
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-light">
            Temukan padanan busana songket yang tepat untuk si kecil, diri Anda, hingga seragam serasi seluruh keluarga.
          </p>
        </FadeIn>

        {/* Cards Grid with Stagger Motion */}
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categoryCards.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <StaggerItem key={cat.id}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-white transition-all duration-300 border h-full flex flex-col justify-between ${
                    isSelected 
                      ? "ring-2 ring-gold border-gold shadow-goldGlow" 
                      : "border-stone-200/80 hover:border-gold/60 shadow-md hover:shadow-xl"
                  }`}
                >
                  {/* Image Banner */}
                  <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-forest-dark border border-gold/40 shadow-sm">
                        {cat.badge}
                      </span>
                    </div>

                    {/* Arrow Indicator Top Right */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-forest group-hover:bg-gold group-hover:text-forest-dark transition-colors shadow-sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>

                    {/* Subtitle / Stat over image bottom */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-xs font-medium text-gold-light tracking-wide">{cat.subTitle}</p>
                      <h3 className="text-lg font-serif font-bold text-white leading-snug">{cat.title}</h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed mb-4">
                      {cat.desc}
                    </p>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-forest">
                        {cat.stats}
                      </span>

                      <span className="text-xs font-bold text-gold-dark group-hover:underline flex items-center gap-1">
                        Lihat Produk &rarr;
                      </span>
                    </div>
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

export default Categories;
