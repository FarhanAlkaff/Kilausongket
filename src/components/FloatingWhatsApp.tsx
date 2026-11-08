"use client";

import React, { useState } from "react";
import { MessageCircle, X, Sparkles, Send, PhoneCall } from "lucide-react";
import { STORE_INFO } from "@/data/products";

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickTopics = [
    { label: "Pilihan Songket Anak", text: "Halo admin Kilau Songket, saya ingin tanya pilihan model songket untuk anak-anak." },
    { label: "Sarimbit Keluarga", text: "Halo admin, mau tanya info paket sarimbit keluarga untuk acara pesta/adat." },
    { label: "Konsultasi Ukuran", text: "Halo admin, saya ingin konsultasi panduan ukuran badan agar tidak salah pesan." },
    { label: "Link Toko Shopee", text: "Halo admin, boleh minta tautan produk di Shopee resmi Kilau Songket?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Mini Chat Card Popover */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-gold/40 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-forest-dark p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                  <MessageCircle className="w-5 h-5 text-gold-light" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-forest-dark" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-ivory">CS Kilau Songket</h4>
                <p className="text-[11px] text-gold-light flex items-center gap-1">
                  <span>Online</span> • <span>Buka 08.00 - 21.00</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-ivory"
              aria-label="Tutup Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Message */}
          <div className="p-4 bg-ivory-warm space-y-3 text-xs">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-200 text-stone-700 leading-relaxed">
              Halo! Selamat datang di <strong>Kilau Songket</strong> ✨ Ada yang bisa kami bantu seputar koleksi songket anak, dewasa, atau sarimbit keluarga?
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] uppercase font-bold text-stone-400">Pilih Topik Chat Cepat:</p>
              {quickTopics.map((topic, i) => (
                <a
                  key={i}
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(topic.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 rounded-xl bg-white hover:bg-forest/5 border border-stone-200 hover:border-gold/60 text-stone-700 hover:text-forest-dark font-medium transition-all text-[11px] flex items-center justify-between group"
                >
                  <span>{topic.label}</span>
                  <Send className="w-3 h-3 text-gold-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Direct CTA */}
          <div className="p-3 bg-white border-t border-stone-100">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Kilau%20Songket,%20saya%20ingin%20konsultasi`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Buka Chat Langsung via WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white"
        aria-label="Hubungi WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-emerald-600 animate-ping" />
        </div>
        
        <span className="text-xs font-bold hidden sm:inline tracking-wide">
          Chat WhatsApp
        </span>

        {/* Status Bubble */}
        <span className="text-[10px] bg-emerald-900/60 text-emerald-100 px-2 py-0.5 rounded-full font-semibold">
          Online
        </span>
      </button>

    </div>
  );
};

export default FloatingWhatsApp;

