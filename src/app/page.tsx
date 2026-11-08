"use client";

import React, { useState } from "react";
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
import { Product } from "@/data/products";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

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
      />

      {/* Value Propositions / Keunggulan Toko */}
      <ValueProps />

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Customer Testimonials & Reviews */}
      <Testimonials />

      {/* About Kilau Songket */}
      <AboutSection />

      {/* Frequently Asked Questions */}
      <FAQSection />

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

