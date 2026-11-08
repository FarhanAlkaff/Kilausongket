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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  // Dynamic state loaded from SQLite Admin Database
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<any[]>(CATEGORIES);
  const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS);
  const [faqs, setFaqs] = useState<any[]>(FAQS);
  const [storeSettings, setStoreSettings] = useState<any>(STORE_INFO);

  useEffect(() => {
    async function fetchLandingData() {
      try {
        const res = await fetch("/api/public/landing");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.products?.length > 0) {
            setProducts(json.data.products);
          }
          if (json.data.categories?.length > 0) {
            setCategories(json.data.categories);
          }
          if (json.data.testimonials?.length > 0) {
            setTestimonials(json.data.testimonials);
          }
          if (json.data.faqs?.length > 0) {
            setFaqs(json.data.faqs);
          }
          if (json.data.storeInfo) {
            setStoreSettings(json.data.storeInfo);
          }
        }
      } catch (err) {
        // Fallback to static data on network error
        console.log("Using static data fallback");
      }
    }
    fetchLandingData();
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
        onViewProduct={(product) => setSelectedProduct(product)}
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
        onClose={() => setSelectedProduct(null)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </main>
  );
}
