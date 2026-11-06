import React, { useEffect } from "react";
import { motion } from "framer-motion";
import FooterSection from "@/components/landing/FooterSection";
import SkipTheWorkCard from "@/components/landing/SkipTheWorkCard";

export default function NewsletterThankYou() {
  useEffect(() => {
    document.title = "You're In! | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "You're subscribed to the AKW Marketing newsletter. Check your inbox for proven marketing tactics that actually work for local businesses.";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-stone-200/60 px-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/assets/logo-official.png"
              alt="AKW Marketing Logo"
              className="w-8 h-8 rounded-md object-contain"
            />
            <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
          </a>
          <a
            href="/gbp"
            className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-10">
            Check Your Inbox — Your First Email Is On Its Way
          </h1>

          <SkipTheWorkCard />
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
}