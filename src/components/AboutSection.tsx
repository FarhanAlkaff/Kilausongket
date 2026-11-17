"use client";

import React from "react";
import { Sparkles, Heart, Award, Shield, Play, ExternalLink } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { FadeInLeft, FadeInRight, FadeIn } from "@/components/ui/motion-wrapper";
import { useStoreSettings } from "@/context/StoreSettingsContext";

interface AboutSectionProps {
  aboutText?: string;
  aboutVideoUrl?: string;
}

export function getYouTubeEmbedInfo(url?: string): { embedUrl: string; videoId: string; watchUrl: string } {
  const fallbackId = "3g8K1oWq0eE";
  if (!url) {
    return {
      videoId: fallbackId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${fallbackId}?rel=0&modestbranding=1&playsinline=1`,
      watchUrl: `https://www.youtube.com/watch?v=${fallbackId}`,
    };
  }
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  const videoId = match && match[1] ? match[1] : fallbackId;
  return {
    videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutText, aboutVideoUrl }) => {
  const { settings } = useStoreSettings();
  const currentVideo = aboutVideoUrl || settings.aboutVideoUrl || "https://www.youtube.com/watch?v=3g8K1oWq0eE";
  const videoInfo = getYouTubeEmbedInfo(currentVideo);

  return (
    <section id="tentang" className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story Video with FadeInLeft */}
          <FadeInLeft className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-ivory aspect-[4/5] bg-stone-950 group">
              {/* YouTube Video Player Embed */}
              <iframe
                src={videoInfo.embedUrl}
                title="Filosofi Kilau Songket - Tenun Tradisional Palembang"
                className="w-full h-full border-0 rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* YouTube Top Badge */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10 shadow-lg">
                  <Play className="w-3 h-3 text-red-500 fill-current" />
                  <span>Video Dokumenter YouTube</span>
                </span>
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

            {aboutText ? (
              <p className="text-sm sm:text-base text-charcoal-light leading-relaxed whitespace-pre-line">
                {aboutText}
              </p>
            ) : (
              <>
                <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
                  <strong>Kilau Songket</strong> lahir dari keinginan tulus menghadirkan busana tenun songket yang tidak hanya memukau dipandang, tetapi juga benar-benar nyaman dipakai oleh siapa saja — mulai dari bayi dan anak-anak hingga orang dewasa.
                </p>

                <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
                  Banyak orang tua enggan memakaikan kain songket pada si kecil karena teksturnya yang kaku dan menusuk kulit. Di Kilau Songket, kami memecahkan masalah ini dengan merancang <strong>konstruksi furing katun silky ganda</strong> yang ramah kulit sensitif, sehingga si kecil dapat tampil gagah dan anggun tanpa rasa gerah maupun gatal.
                </p>
              </>
            )}

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
