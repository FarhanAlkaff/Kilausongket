import React from "react";

interface ShopeeIconProps {
  className?: string;
}

export default function ShopeeIcon({ className = "w-4 h-4" }: ShopeeIconProps) {
  return (
    <img
      src="/images/shopee-logo.png"
      alt="Shopee"
      className={`object-contain inline-block shrink-0 ${className}`}
    />
  );
}

