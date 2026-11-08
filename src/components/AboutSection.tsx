"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Heart, Award, Shield } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { FadeInLeft, FadeInRight, FadeIn } from "@/components/ui/motion-wrapper";

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story Image with FadeInLeft */}
          <FadeInLeft className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-ivory aspect-[4/5] bg-stone-100">
              <Image
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
                alt="Proses Pengerjaan dan Filosofi Kilau Songket"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-semibold text-gold-light tracking-widest block mb-1">
                  Filosofi Kilau Songket
                </span>
                <h3 className="font-serif text-xl font-bold text-ivory">
                  Menjaga Martabat Tradisi dalam Setiap Rajutan Benang Emas
                </h3>
              </div>
            </div>

            {/* Floating Logo Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 rounded-2xl shadow-xl border border-gold/30 hidden sm:block">
              <BrandLogo variant="dark" size="sm" />
            </div>
          </FadeInLeft>

          {/* Right Column: Story & Identity with FadeInRight */}
          <FadeInRight className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 border border-gold/40 text-forest-dark text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              <span>Tentang Kilau Songket</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-dark leading-snug">
              Melestarikan Pesona Tenun Nusantara dengan Kenyamanan Modern
            </h2>

            <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
              <strong>Kilau Songket</strong> lahir dari keinginan tulus menghadirkan busana tenun songket yang tidak hanya memukau dipandang, tetapi juga benar-benar nyaman dipakai oleh siapa saja — mulai dari bayi dan anak-anak hingga orang dewasa.
            </p>

            <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
              Banyak orang tua enggan memakaikan kain songket pada si kecil karena teksturnya yang kaku dan menusuk kulit. Di Kilau Songket, kami memecahkan masalah ini dengan merancang <strong>konstruksi furing katun silky ganda</strong> yang ramah kulit sensitif, sehingga si kecil dapat tampil gagah dan anggun tanpa rasa gerah maupun gatal.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
              <div className="bg-ivory-warm p-4 rounded-2xl border border-stone-200">
                <Heart className="w-5 h-5 text-gold-dark mb-2" />
                <h4 className="text-xs font-bold text-forest-dark uppercase mb-1">Ramah Anak</h4>
                <p className="text-[11px] text-stone-600">Material furing lembut dan potongan longgar leluasa bergerak.</p>
              </div>

              <div className="bg-ivory-warm p-4 rounded-2xl border border-stone-200">
                <Award className="w-5 h-5 text-gold-dark mb-2" />
                <h4 className="text-xs font-bold text-forest-dark uppercase mb-1">Tenun Pilihan</h4>
                <p className="text-[11px] text-stone-600">Hanya menggunakan benang emas berkualitas tinggi yang tidak mudah pudar.</p>
              </div>

              <div className="bg-ivory-warm p-4 rounded-2xl border border-stone-200">
                <Shield className="w-5 h-5 text-gold-dark mb-2" />
                <h4 className="text-xs font-bold text-forest-dark uppercase mb-1">Jahitan Tailor</h4>
                <p className="text-[11px] text-stone-600">Potongan presisi berstandar butik dengan opsi custom size.</p>
              </div>
            </div>

          </FadeInRight>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
