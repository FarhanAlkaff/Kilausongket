"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { STORE_INFO } from "@/data/products";

export interface StoreSettings {
  name: string;
  tagline: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  shopeeUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  email: string;
  operationalHours: string;
  address: string;
  promoTitle: string;
  promoSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
}

interface StoreSettingsContextType {
  settings: StoreSettings;
  getWhatsAppProductUrl: (productName: string, selectedSize?: string) => string;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: StoreSettings = {
  ...STORE_INFO,
  promoTitle: "",
  promoSubtitle: "",
  heroTitle: "",
  heroSubtitle: "",
  aboutText: "",
};

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: defaultSettings,
  getWhatsAppProductUrl: (productName: string, selectedSize?: string) => {
    const sizeText = selectedSize ? ` (Ukuran: ${selectedSize})` : "";
    const text = `Halo Kilau Songket, saya tertarik dengan produk ${productName}${sizeText}. Apakah produk ini masih tersedia dan bisa konsultasi detailnya?`;
    return `https://wa.me/${defaultSettings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },
  refreshSettings: async () => {},
});

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setSettings((prev) => ({
          ...prev,
          name: json.data.name || prev.name,
          tagline: json.data.tagline || prev.tagline,
          whatsappNumber: json.data.whatsappNumber || prev.whatsappNumber,
          whatsappDisplay: json.data.whatsappDisplay || prev.whatsappDisplay,
          shopeeUrl: json.data.shopeeUrl || prev.shopeeUrl,
          instagramUrl: json.data.instagramUrl || prev.instagramUrl,
          tiktokUrl: json.data.tiktokUrl || prev.tiktokUrl,
          email: json.data.email || prev.email,
          operationalHours: json.data.operationalHours || prev.operationalHours,
          address: json.data.address || prev.address,
          promoTitle: json.data.promoTitle || prev.promoTitle,
          promoSubtitle: json.data.promoSubtitle || prev.promoSubtitle,
          heroTitle: json.data.heroTitle || prev.heroTitle,
          heroSubtitle: json.data.heroSubtitle || prev.heroSubtitle,
          aboutText: json.data.aboutText || prev.aboutText,
        }));
      }
    } catch (err) {
      console.log("Could not fetch store settings, using defaults", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getWhatsAppProductUrl = (productName: string, selectedSize?: string) => {
    const sizeText = selectedSize ? ` (Ukuran: ${selectedSize})` : "";
    const text = `Halo Kilau Songket, saya tertarik dengan produk ${productName}${sizeText}. Apakah produk ini masih tersedia dan bisa konsultasi detailnya?`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, getWhatsAppProductUrl, refreshSettings: fetchSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => useContext(StoreSettingsContext);
