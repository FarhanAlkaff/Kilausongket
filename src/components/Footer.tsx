"use client";

import React from "react";
import Link from "next/link";
import { 
  MessageCircle, 
  ShoppingBag, 
  Instagram, 
  MapPin, 
  Clock, 
  Mail, 
  PhoneCall, 
  ShieldCheck, 
  Heart 
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { STORE_INFO } from "@/data/products";
import { useStoreSettings } from "@/context/StoreSettingsContext";

interface FooterProps {
  onOpenSizeGuide?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSizeGuide, onSelectCategory }) => {
  const { settings } = useStoreSettings();
  const whatsappNum = settings.whatsappNumber || STORE_INFO.whatsappNumber;
  const whatsappDisp = settings.whatsappDisplay || STORE_INFO.whatsappDisplay;
  const shopeeLink = settings.shopeeUrl || STORE_INFO.shopeeUrl;
  const igLink = settings.instagramUrl || STORE_INFO.instagramUrl;
  const addr = settings.address || STORE_INFO.address;
  const hours = settings.operationalHours || STORE_INFO.operationalHours;
  const mail = settings.email || STORE_INFO.email;
  return (
    <footer className="bg-forest-dark text-ivory pt-16 pb-10 border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-forest-light">
          
          {/* Col 1: Brand Info & Logo */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" size="lg" />
            
            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed pt-2">
              Kilau Songket merupakan butik busana songket nusantara modern yang menyediakan setelan mewah untuk anak-anak maupun dewasa. Dirancang dengan furing lembut anti-gatal dan kemilau tenun berkelas.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={shopeeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#EE4D2D] hover:text-white flex items-center justify-center transition-colors text-ivory border border-white/10"
                aria-label="Shopee Kilau Songket"
              >
                <ShoppingBag className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-ivory border border-white/10"
                aria-label="WhatsApp Kilau Songket"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors text-ivory border border-white/10"
                aria-label="Instagram Kilau Songket"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Kategori Produk */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-base text-gold-light tracking-wide uppercase">
              Koleksi Busana
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-ivory/80">
              <li>
                <a 
                  href="#katalog" 
                  onClick={() => onSelectCategory && onSelectCategory("anak")} 
                  className="hover:text-gold transition-colors block"
                >
                  Songket Anak Laki-laki (1-12 Th)
                </a>
              </li>
              <li>
                <a 
                  href="#katalog" 
                  onClick={() => onSelectCategory && onSelectCategory("anak")} 
                  className="hover:text-gold transition-colors block"
                >
                  Baju Kurung Songket Anak Perempuan
                </a>
              </li>
              <li>
                <a 
                  href="#katalog" 
                  onClick={() => onSelectCategory && onSelectCategory("dewasa")} 
                  className="hover:text-gold transition-colors block"
                >
                  Kebaya Kurung Wanita Dewasa
                </a>
              </li>
              <li>
                <a 
                  href="#katalog" 
                  onClick={() => onSelectCategory && onSelectCategory("dewasa")} 
                  className="hover:text-gold transition-colors block"
                >
                  Kemeja Tenun Songket Pria
                </a>
              </li>
              <li>
                <a 
                  href="#katalog" 
                  onClick={() => onSelectCategory && onSelectCategory("sarimbit")} 
                  className="hover:text-gold transition-colors block"
                >
                  Setelan Sarimbit Keluarga (Family Set)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan & Informasi */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-base text-gold-light tracking-wide uppercase">
              Bantuan & Layanan
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-ivory/80">
              {onOpenSizeGuide && (
                <li>
                  <button 
                    onClick={onOpenSizeGuide}
                    className="hover:text-gold transition-colors text-left"
                  >
                    Panduan Ukuran (Size Chart)
                  </button>
                </li>
              )}
              <li>
                <a href="#keunggulan" className="hover:text-gold transition-colors block">
                  Keunggulan Furing Katun
                </a>
              </li>
              <li>
                <a href="#testimoni" className="hover:text-gold transition-colors block">
                  Ulasan Pembeli
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-gold transition-colors block">
                  Cerita Kilau Songket
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${whatsappNum}?text=Halo%20Kilau%20Songket,%20saya%20ingin%20tanya%20prosedur%20tukar%20ukuran`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors block"
                >
                  Garansi & Retur Ukuran
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Butik */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-base text-gold-light tracking-wide uppercase">
              Kontak Butik
            </h4>
            <div className="space-y-2.5 text-xs text-ivory/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-light flex-shrink-0 mt-0.5" />
                <span>{addr}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-light flex-shrink-0" />
                <span>{hours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-gold-light flex-shrink-0" />
                <span>WhatsApp: {whatsappDisp}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-light flex-shrink-0" />
                <span>{mail}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-gold-light/80 block mb-1.5 font-medium">Kanal Belanja Resmi:</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-white/10 text-[10px] font-semibold text-emerald-300">
                  ✓ WhatsApp Official
                </span>
                <span className="px-2.5 py-1 rounded bg-white/10 text-[10px] font-semibold text-orange-300">
                  ✓ Shopee Verified
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          <p>
            &copy; {new Date().getFullYear()} <strong>Kilau Songket</strong>. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Dibuat dengan rasa bangga akan kain tenun warisan nusantara</span>
            <Heart className="w-3.5 h-3.5 text-gold fill-current" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

