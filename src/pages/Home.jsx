import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AdvantagesSection from "@/components/landing/AdvantagesSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import ProcessSection from "@/components/landing/ProcessSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import PricingSection from "@/components/landing/PricingSection";
import FooterSection from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <HeroSection />
      <AdvantagesSection />
      <BeforeAfterSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
}