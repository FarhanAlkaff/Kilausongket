"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MessageCircle, 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles, 
  PhoneCall, 
  ChevronRight,
  Ruler
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import NavHeader from "@/components/ui/nav-header";
import { STORE_INFO } from "@/data/products";

interface NavbarProps {
  onOpenSizeGuide?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSizeGuide, onSelectCategory }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (category?: string) => {
    setIsMobileMenuOpen(false);
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
  };

  const navMenuItems = [
    { label: "Beranda", href: "#beranda", onClick: () => handleNavClick() },
    { label: "Katalog", href: "#katalog", onClick: () => handleNavClick("all") },
    { label: "Anak", href: "#katalog", onClick: () => handleNavClick("anak") },
    { label: "Dewasa", href: "#katalog", onClick: () => handleNavClick("dewasa") },
    { label: "Sarimbit", href: "#katalog", onClick: () => handleNavClick("sarimbit") },
    { label: "Keunggulan", href: "#keunggulan", onClick: () => handleNavClick() },
    ...(onOpenSizeGuide
      ? [{ label: "Ukuran", onClick: onOpenSizeGuide }]
      : []),
    { label: "Testimoni", href: "#testimoni", onClick: () => handleNavClick() },
  ];

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-forest-dark text-ivory text-xs py-2 px-4 border-b border-gold/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse"></span>
            <span className="font-semibold text-gold-light">Koleksi 2026:</span>
            <span className="text-ivory/90 hidden sm:inline">Setelan Songket Anak & Dewasa Furing Katun Anti-Gatal.</span>
            <span className="text-ivory/90 sm:hidden">Songket Anak & Dewasa Anti-Gatal.</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-ivory/80">
            <span className="hidden md:inline">Buka: 08.00 - 21.00 WIB</span>
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors flex items-center gap-1 font-medium"
            >
              <PhoneCall className="w-3 h-3 text-gold" />
              <span>{STORE_INFO.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? "glass-header shadow-md border-b border-gold/20 py-2.5" 
            : "bg-ivory-warm/95 border-b border-stone-200/80 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                onClick={() => handleNavClick()}
                className="focus:outline-none"
              >
                <BrandLogo variant="dark" size="sm" />
              </Link>
            </div>

            {/* Center: Sleek Animated Pill NavHeader */}
            <div className="hidden xl:flex items-center justify-center flex-1">
              <NavHeader items={navMenuItems} />
            </div>

            {/* Compact Desktop fallback for medium screens (lg only) */}
            <div className="hidden lg:flex xl:hidden items-center gap-6 text-xs font-semibold uppercase tracking-wider text-charcoal">
              <a href="#beranda" className="hover:text-gold-dark transition-colors">Beranda</a>
              <a href="#katalog" onClick={() => handleNavClick("all")} className="hover:text-gold-dark transition-colors">Katalog</a>
              <a href="#katalog" onClick={() => handleNavClick("anak")} className="hover:text-gold-dark transition-colors">Anak</a>
              <a href="#katalog" onClick={() => handleNavClick("dewasa")} className="hover:text-gold-dark transition-colors">Dewasa</a>
              <a href="#keunggulan" className="hover:text-gold-dark transition-colors">Keunggulan</a>
              {onOpenSizeGuide && (
                <button onClick={onOpenSizeGuide} className="hover:text-gold-dark transition-colors">Ukuran</button>
              )}
            </div>

            {/* Right: Clean Action Buttons (Shopee & WhatsApp) */}
            <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
              {/* Shopee Button */}
              <a
                href={STORE_INFO.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#EE4D2D] bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 border border-[#EE4D2D]/30 rounded-full transition-all shadow-sm"
                title="Kunjungi Toko Shopee"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shopee</span>
              </a>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Kilau%20Songket,%20saya%20ingin%20konsultasi%20katalog%20dan%20pemesanan`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-forest hover:bg-forest-light rounded-full transition-all shadow-sm border border-gold/40"
              >
                <MessageCircle className="w-3.5 h-3.5 text-gold-light" />
                <span>Konsultasi WA</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-forest-dark bg-gold/20 rounded-full"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-charcoal hover:bg-stone-200/60 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-ivory-warm px-5 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col gap-2 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal">
              <a 
                href="#beranda" 
                onClick={() => handleNavClick()}
                className="py-2.5 border-b border-stone-200/60 flex items-center justify-between"
              >
                <span>Beranda</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
              <a 
                href="#katalog" 
                onClick={() => handleNavClick("anak")}
                className="py-2.5 border-b border-stone-200/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>Songket Anak (1 - 12 Th)</span>
                  <span className="text-[10px] bg-gold/20 text-forest-dark px-1.5 py-0.5 rounded-full font-semibold">
                    Kids
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
              <a 
                href="#katalog" 
                onClick={() => handleNavClick("dewasa")}
                className="py-2.5 border-b border-stone-200/60 flex items-center justify-between"
              >
                <span>Songket Dewasa</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
              <a 
                href="#katalog" 
                onClick={() => handleNavClick("sarimbit")}
                className="py-2.5 border-b border-stone-200/60 flex items-center justify-between"
              >
                <span>Sarimbit Keluarga</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
              <a 
                href="#keunggulan" 
                onClick={() => handleNavClick()}
                className="py-2.5 border-b border-stone-200/60 flex items-center justify-between"
              >
                <span>Keunggulan Furing Katun</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
              {onOpenSizeGuide && (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenSizeGuide();
                  }}
                  className="py-2.5 border-b border-stone-200/60 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gold-dark" />
                    <span>Panduan Ukuran (Size Guide)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              )}
              <a 
                href="#testimoni" 
                onClick={() => handleNavClick()}
                className="py-2.5 border-b border-stone-200/60 flex items-center justify-between"
              >
                <span>Testimoni Pelanggan</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
            </div>

            <div className="pt-4 flex flex-col gap-2.5">
              <a
                href={STORE_INFO.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-[#EE4D2D] bg-[#EE4D2D]/10 border border-[#EE4D2D]/30 rounded-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Kunjungi Toko Shopee</span>
              </a>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Kilau%20Songket,%20saya%20ingin%20konsultasi%20katalog`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white bg-forest hover:bg-forest-light rounded-xl shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-gold-light" />
                <span>Konsultasi via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
