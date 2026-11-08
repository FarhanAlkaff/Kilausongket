"use client";

import React, { useState } from "react";
import { X, Ruler, MessageCircle, HelpCircle } from "lucide-react";
import { STORE_INFO } from "@/data/products";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"anak" | "dewasa-wanita" | "dewasa-pria">("anak");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gold/30 my-auto p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors shadow-sm"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gold/20 flex items-center justify-center text-forest-dark">
            <Ruler className="w-5 h-5 text-gold-dark" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-forest-dark">
              Panduan Ukuran Busana (Size Chart)
            </h3>
            <p className="text-xs text-stone-500">
              Standar ukuran Kilau Songket dengan toleransi jahitan ±1-2 cm.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-4">
          <button
            onClick={() => setActiveTab("anak")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "anak" ? "bg-forest text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Songket Anak (1-12 Th)
          </button>
          <button
            onClick={() => setActiveTab("dewasa-wanita")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "dewasa-wanita" ? "bg-forest text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Wanita Dewasa
          </button>
          <button
            onClick={() => setActiveTab("dewasa-pria")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "dewasa-pria" ? "bg-forest text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Pria Dewasa
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-stone-200 mb-6">
          {activeTab === "anak" && (
            <table className="w-full text-xs text-left text-charcoal">
              <thead className="bg-ivory text-forest-dark font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Ukuran / Usia</th>
                  <th className="py-2.5 px-3">Lebar Dada</th>
                  <th className="py-2.5 px-3">Panjang Baju</th>
                  <th className="py-2.5 px-3">Pinggang (Karet)</th>
                  <th className="py-2.5 px-3">Panjang Celana/Rok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-2 px-3 font-semibold">XS (1-2 Tahun)</td>
                  <td className="py-2 px-3">30 cm</td>
                  <td className="py-2 px-3">40 cm</td>
                  <td className="py-2 px-3">40 - 56 cm</td>
                  <td className="py-2 px-3">45 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">S (3-4 Tahun)</td>
                  <td className="py-2 px-3">33 cm</td>
                  <td className="py-2 px-3">45 cm</td>
                  <td className="py-2 px-3">44 - 62 cm</td>
                  <td className="py-2 px-3">55 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">M (5-6 Tahun)</td>
                  <td className="py-2 px-3">36 cm</td>
                  <td className="py-2 px-3">50 cm</td>
                  <td className="py-2 px-3">48 - 68 cm</td>
                  <td className="py-2 px-3">65 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">L (7-8 Tahun)</td>
                  <td className="py-2 px-3">39 cm</td>
                  <td className="py-2 px-3">55 cm</td>
                  <td className="py-2 px-3">52 - 74 cm</td>
                  <td className="py-2 px-3">75 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">XL (9-11 Tahun)</td>
                  <td className="py-2 px-3">42 cm</td>
                  <td className="py-2 px-3">60 cm</td>
                  <td className="py-2 px-3">56 - 80 cm</td>
                  <td className="py-2 px-3">82 cm</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "dewasa-wanita" && (
            <table className="w-full text-xs text-left text-charcoal">
              <thead className="bg-ivory text-forest-dark font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Ukuran</th>
                  <th className="py-2.5 px-3">Lingkar Dada (LD)</th>
                  <th className="py-2.5 px-3">Panjang Tunik</th>
                  <th className="py-2.5 px-3">Lingkar Pinggul</th>
                  <th className="py-2.5 px-3">Panjang Rok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-2 px-3 font-semibold">S</td>
                  <td className="py-2 px-3">90 - 92 cm</td>
                  <td className="py-2 px-3">88 cm</td>
                  <td className="py-2 px-3">94 cm</td>
                  <td className="py-2 px-3">95 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">M</td>
                  <td className="py-2 px-3">96 - 98 cm</td>
                  <td className="py-2 px-3">90 cm</td>
                  <td className="py-2 px-3">100 cm</td>
                  <td className="py-2 px-3">96 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">L</td>
                  <td className="py-2 px-3">102 - 104 cm</td>
                  <td className="py-2 px-3">92 cm</td>
                  <td className="py-2 px-3">106 cm</td>
                  <td className="py-2 px-3">98 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">XL</td>
                  <td className="py-2 px-3">108 - 110 cm</td>
                  <td className="py-2 px-3">94 cm</td>
                  <td className="py-2 px-3">112 cm</td>
                  <td className="py-2 px-3">100 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">XXL / Custom</td>
                  <td className="py-2 px-3">114+ cm</td>
                  <td className="py-2 px-3">Sesuai request</td>
                  <td className="py-2 px-3">Sesuai request</td>
                  <td className="py-2 px-3">Sesuai request</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "dewasa-pria" && (
            <table className="w-full text-xs text-left text-charcoal">
              <thead className="bg-ivory text-forest-dark font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Ukuran</th>
                  <th className="py-2.5 px-3">Lingkar Dada (LD)</th>
                  <th className="py-2.5 px-3">Panjang Kemeja</th>
                  <th className="py-2.5 px-3">Panjang Lengan</th>
                  <th className="py-2.5 px-3">Lebar Bahu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-2 px-3 font-semibold">M</td>
                  <td className="py-2 px-3">104 cm</td>
                  <td className="py-2 px-3">72 cm</td>
                  <td className="py-2 px-3">60 cm</td>
                  <td className="py-2 px-3">44 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">L</td>
                  <td className="py-2 px-3">110 cm</td>
                  <td className="py-2 px-3">74 cm</td>
                  <td className="py-2 px-3">61 cm</td>
                  <td className="py-2 px-3">46 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">XL</td>
                  <td className="py-2 px-3">116 cm</td>
                  <td className="py-2 px-3">76 cm</td>
                  <td className="py-2 px-3">62 cm</td>
                  <td className="py-2 px-3">48 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">XXL</td>
                  <td className="py-2 px-3">122 cm</td>
                  <td className="py-2 px-3">78 cm</td>
                  <td className="py-2 px-3">63 cm</td>
                  <td className="py-2 px-3">50 cm</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Tips Box */}
        <div className="bg-gold/10 p-4 rounded-2xl border border-gold/30 text-xs text-charcoal space-y-2 mb-6">
          <p className="font-bold text-forest-dark flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-gold-dark" />
            <span>Tips Mengukur Baju Anak:</span>
          </p>
          <p className="text-stone-600 leading-relaxed">
            Jika tinggi atau berat badan si kecil berada di antara dua ukuran, kami sarankan memilih <strong>1 ukuran lebih besar</strong> agar anak leluasa bergerak dan baju dapat dipakai lebih lama. Pinggang celana anak dilengkapi karet fleksibel yang elastis.
          </p>
        </div>

        {/* Direct WhatsApp Consultation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-stone-200">
          <div>
            <p className="text-xs font-bold text-forest-dark">Masih ragu memilih ukuran?</p>
            <p className="text-[11px] text-stone-500">Kirim tinggi & berat badan Anda/si kecil, tim kami bantu pilihkan.</p>
          </div>

          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Kilau%20Songket,%20saya%20ingin%20konsultasi%20panduan%20ukuran%20baju%20songket`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-forest hover:bg-forest-light transition-all"
          >
            <MessageCircle className="w-4 h-4 text-gold-light" />
            <span>Konsultasi Ukuran via WA</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default SizeGuideModal;

