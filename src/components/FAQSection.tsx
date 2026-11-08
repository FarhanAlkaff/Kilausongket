"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { FAQS, STORE_INFO } from "@/data/products";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

interface FAQSectionProps {
  faqs?: typeof FAQS;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs = FAQS }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 bg-ivory-warm border-b border-gold/15 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase mb-2 block">
            Pertanyaan Umum (FAQ)
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-forest-dark">
            Informasi Penting Sebelum Memesan
          </h2>
          <p className="mt-3 text-sm text-charcoal-light">
            Temukan jawaban cepat seputar bahan, ukuran, sistem pengiriman, dan pemesanan busana di Kilau Songket.
          </p>
        </FadeIn>

        {/* Accordion List with Motion */}
        <StaggerContainer staggerDelay={0.08} className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <StaggerItem key={idx}>
                <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden transition-all duration-200 shadow-sm hover:border-gold/40">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-forest-dark flex items-center gap-3">
                      <span className="text-gold-dark font-sans font-bold text-xs bg-gold/15 px-2 py-0.5 rounded-md">
                        Q{idx + 1}
                      </span>
                      {faq.question}
                    </span>
                    <motion.div 
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0 ${isOpen ? "bg-gold/20 text-forest" : ""}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-charcoal-light leading-relaxed border-t border-stone-100 bg-ivory/30">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Extra Question CTA with Motion */}
        <FadeIn delay={0.2} className="mt-10 p-6 rounded-2xl bg-white border border-gold/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-gold-dark" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-forest-dark">Punya pertanyaan lain yang belum terjawab?</h4>
              <p className="text-xs text-stone-500">Admin kami siap membantu konsultasi busana dan motif via chat.</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Kilau%20Songket,%20saya%20ingin%20bertanya%20mengenai%20produk`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-forest hover:bg-forest-light transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 text-gold-light" />
            <span>Tanya via WhatsApp</span>
          </a>
        </FadeIn>

      </div>
    </section>
  );
};

export default FAQSection;
