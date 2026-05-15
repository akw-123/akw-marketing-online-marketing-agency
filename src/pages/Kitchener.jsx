import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Zap, Phone, ArrowRight } from "lucide-react";
import AdvantagesSection from "@/components/landing/AdvantagesSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import KitchenerProcessSection from "@/components/landing/KitchenerProcessSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import KitchenerFooter from "@/components/landing/KitchenerFooter";

const stats = [
  { icon: Users, label: "32+ Satisfied Clients" },
  { icon: Clock, label: "4+ Years of Experience" },
  { icon: Zap, label: "Lightning Fast Results" },
];

function KitchenerNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F0EB]/80 backdrop-blur-xl border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
            alt="AKW Marketing Logo"
            className="w-8 h-8 rounded-md object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
        </a>
        <a href="https://akwmarketing.com/landing">
          <button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2 transition-colors">
            Sign Up
          </button>
        </a>
      </div>
    </nav>
  );
}

function KitchenerHero() {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm text-stone-500">Kitchener, Ontario</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-stone-900 leading-[1.1] tracking-tight">
              Internet Marketing Service in Kitchener
            </h1>

            <p className="mt-6 text-stone-600 leading-relaxed max-w-lg">
              75% of all search requests go to the top 3 results on Google Maps.
              <br /><br />
              If your Kitchener business isn't there, those customers are going to your competitors.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/20 relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                src="https://fast.wistia.net/embed/iframe/g8bkx9vdzr?videoFoam=true&playButton=true&controlsVisibleOnLoad=true&volumeControl=true&fullscreenButton=true&playbar=true"
                title="AKW Marketing Video"
                allow="autoplay; fullscreen"
                allowFullScreen
                frameBorder="0"
                scrolling="no"
                className="absolute inset-0 w-full h-full"
                style={{ border: "none" }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl px-5 py-4"
            >
              <Icon className="w-5 h-5 text-stone-400" />
              <span className="text-sm font-medium text-stone-700">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function KitchenerCTA() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            Free Strategy Call
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            Book Your Free{" "}
            <span className="italic font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Strategy Call
            </span>
          </h2>
          <p className="text-stone-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            If this sounds like what your Kitchener business needs, let's talk. We'll show you exactly how we get you into the top 3.
          </p>
          <a
            href="https://calendar.app.google/B2umMiNgAUYvewSN6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-full text-sm transition-colors"
          >
            Book Strategy Call
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="mt-4 text-xs text-stone-400">Free. No commitment. 15 minutes.</p>
        </motion.div>
      </div>
    </section>
  );
}

export default function Kitchener() {
  useEffect(() => {
    document.title = "Best Internet Marketing Service in Kitchener - AKW Marketing Agency is your internet marketing service in Kitchener";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <KitchenerNav />
      <KitchenerHero />
      <AdvantagesSection />
      <BeforeAfterSection />
      <KitchenerProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <KitchenerCTA />
      <KitchenerFooter />
    </div>
  );
}