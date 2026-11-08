import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light" | "color";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  variant = "dark",
  size = "md",
  showText = true,
}) => {
  const sizeMap = {
    sm: { img: 36, textTitle: "text-base tracking-[0.16em]", textSub: "text-[9px] tracking-[0.32em]" },
    md: { img: 46, textTitle: "text-lg tracking-[0.18em]", textSub: "text-[10px] tracking-[0.34em]" },
    lg: { img: 60, textTitle: "text-2xl tracking-[0.2em]", textSub: "text-xs tracking-[0.36em]" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Logo Mark Container */}
      <div 
        className={`relative flex items-center justify-center rounded-xl overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 ${
          variant === "light" 
            ? "bg-white/10 ring-1 ring-gold/40 backdrop-blur-sm" 
            : "bg-white ring-1 ring-gold/30 shadow-sm"
        }`}
        style={{ width: currentSize.img, height: currentSize.img }}
      >
        <Image
          src="/images/logo.jpg"
          alt="Kilau Songket Logo"
          width={currentSize.img}
          height={currentSize.img}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {/* Typography matching official logo style */}
      {showText && (
        <div className="flex flex-col">
          <span 
            className={`font-sans font-black uppercase leading-tight ${
              variant === "light" 
                ? "text-ivory" 
                : "text-forest-dark"
            } ${currentSize.textTitle}`}
          >
            KILAU
          </span>
          <span 
            className={`font-sans font-semibold uppercase ${
              variant === "light" 
                ? "text-gold-light" 
                : "text-gold-dark"
            } ${currentSize.textSub}`}
          >
            SONGKET
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
