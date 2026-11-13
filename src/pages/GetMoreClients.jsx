import React, { useEffect } from "react";
import KitchenerNav from "@/components/landing/KitchenerNav";
import KitchenerFooter from "@/components/landing/KitchenerFooter";
import PricingSection from "@/components/landing/PricingSection";

export default function GetMoreClients() {
  useEffect(() => {
    document.title = "Get More Clients | SEO Packages & Pricing | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "SEO packages for Kitchener-Waterloo businesses. Three plans with transparent pricing, a documented process, and a clear ranking promise. Book a free analysis.";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <KitchenerNav />
      <div className="pt-28">
        <PricingSection headingLevel="h1" />
      </div>
      <KitchenerFooter />
    </div>
  );
}