"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductCatalog from "@/components/ProductCatalog";
import ValueProps from "@/components/ValueProps";
import Testimonials from "@/components/Testimonials";
import PromoBanner from "@/components/PromoBanner";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ProductDetailModal from "@/components/ProductDetailModal";
import SizeGuideModal from "@/components/SizeGuideModal";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Product, PRODUCTS, CATEGORIES, TESTIMONIALS, FAQS, STORE_INFO } from "@/data/products";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  // Dynamic state loaded from SQLite Admin Database with local cache fallback
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<any[]>(CATEGORIES);
  const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS);
  const [faqs, setFaqs] = useState<any[]>(FAQS);
  const [storeSettings, setStoreSettings] = useState<any>(STORE_INFO);

  // Dynamically resolve active selected product from products list so all modal images and details stay 100% in sync
  const selectedProduct = React.useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((p) => p.id === selectedProductId || (p as any).slug === selectedProductId) || null;
  }, [products, selectedProductId]);

  useEffect(() => {
    // Helper to merge overrides
    const applyOverrides = (list: any[]) => {
      try {
        const overrides = JSON.parse(localStorage.getItem("ks_product_overrides") || "{}");
        if (Object.keys(overrides).length > 0) {
          return list.map((p) => {
            const override = overrides[p.id] || overrides[p.slug];
            if (override) {
              if (override.updatedAt && p.updatedAt) {
                const overrideTime = new Date(override.updatedAt).getTime();
                const serverTime = new Date(p.updatedAt).getTime();
                if (serverTime >= overrideTime) return p;
              }
              return { ...p, ...override };
            }
            return p;
          });
        }
      } catch {}
      return list;
    };

    // 1. Instant hydration from client cache if available
    try {
      const cachedProducts = localStorage.getItem("ks_live_products");
      if (cachedProducts) {
        const parsed = JSON.parse(cachedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(applyOverrides(parsed));
        }
      } else {
        setProducts(applyOverrides(PRODUCTS));
      }
      const cachedTestimonials = localStorage.getItem("ks_live_testimonials");
      if (cachedTestimonials) {
        const parsed = JSON.parse(cachedTestimonials);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonials(parsed);
        }
      }
      const cachedSettings = localStorage.getItem("ks_live_settings");
      if (cachedSettings) {
        const parsed = JSON.parse(cachedSettings);
        if (parsed) {
          setStoreSettings(parsed);
        }
      }
    } catch {}

    // 2. Fetch fresh real-time data from API with strict cache-busting
    async function fetchLandingData() {
      try {
        const res = await fetch(`/api/public/landing?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.products?.length > 0) {
            const finalProducts = applyOverrides(json.data.products);
            setProducts(finalProducts);
            try {
              localStorage.setItem("ks_live_products", JSON.stringify(finalProducts));
            } catch {}
          }
          if (json.data.categories?.length > 0) {
            setCategories(json.data.categories);
          }
          if (json.data.testimonials?.length > 0) {
            setTestimonials(json.data.testimonials);
            try {
              localStorage.setItem("ks_live_testimonials", JSON.stringify(json.data.testimonials));
            } catch {}
          }
          if (json.data.faqs?.length > 0) {
            setFaqs(json.data.faqs);
          }
          if (json.data.storeInfo) {
            setStoreSettings(json.data.storeInfo);
            try {
              localStorage.setItem("ks_live_settings", JSON.stringify(json.data.storeInfo));
            } catch {}
          }
        }
      } catch (err) {
        console.log("Using cached or static data fallback");
      }
    }
    fetchLandingData();

    // 3. Real-time broadcast channel listener (sync immediately across admin & public tabs)
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("ks_sync");
      bc.onmessage = (event) => {
        if (event.data?.type === "PRODUCTS_UPDATED" && Array.isArray(event.data.products)) {
          setProducts(event.data.products);
          try {
            localStorage.setItem("ks_live_products", JSON.stringify(event.data.products));
          } catch {}
        }
        if (event.data?.type === "TESTIMONIALS_UPDATED" && Array.isArray(event.data.testimonials)) {
          setTestimonials(event.data.testimonials);
        }
        if (event.data?.type === "SETTINGS_UPDATED" && event.data.settings) {
          setStoreSettings(event.data.settings);
        }
      };
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ks_live_products" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch {}
      }
      if (e.key === "ks_live_testimonials" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setTestimonials(parsed);
        } catch {}
      }
      if (e.key === "ks_live_settings" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed) setStoreSettings(parsed);
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const catalogElement = document.getElementById("katalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreClick = () => {
    const catalogElement = document.getElementById("katalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory-warm text-charcoal">
      {/* Navigation Bar */}
      <Navbar
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Hero Section */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Category Highlights */}
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Interactive Product Catalog */}
      <ProductCatalog
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onViewProduct={(product) => setSelectedProductId(product.id || (product as any).slug)}
        products={products}
        categories={categories}
      />

      {/* Value Propositions / Keunggulan Toko */}
      <ValueProps />

      {/* Promotional Banner */}
      <PromoBanner
        promoTitle={storeSettings?.promoTitle}
        promoSubtitle={storeSettings?.promoSubtitle}
      />

      {/* Customer Testimonials & Reviews */}
      <Testimonials testimonials={testimonials} />

      {/* About Kilau Songket */}
      <AboutSection aboutText={storeSettings?.aboutText} />

      {/* Frequently Asked Questions */}
      <FAQSection faqs={faqs} />

      {/* Footer */}
      <Footer
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Floating WhatsApp Action Widget */}
      <FloatingWhatsApp />

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProductId(null)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </main>
  );
}
