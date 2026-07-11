import React, { useEffect } from "react";
import { GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import FooterSection from "@/components/landing/FooterSection";

export default function NewsletterThankYou() {
  useEffect(() => {
    document.title = "You're In! | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "You're subscribed to the AKW Marketing newsletter. Check your inbox for proven marketing tactics that actually work for local businesses.";
  }, []);

  const points = [
    "Google Business Profile optimization",
    "Backend website fixes",
    "Local authority building",
  ];

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-stone-200/60 px-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
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

          <div className="bg-white rounded-3xl border border-stone-200/70 p-8 md:p-12 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-stone-900 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
            </div>

            <span className="inline-flex items-center bg-stone-100 text-stone-500 rounded-full px-3 py-1 text-xs font-medium mb-5">
              Skip The Work
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight mb-4">
              Want Us To <span className="italic">Do</span> This For You?
            </h2>

            <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto mb-6">
              These tips will get you started, but ranking in the top 3 takes a full strategy.
            </p>

            <ul className="text-left space-y-2 max-w-sm mx-auto mb-6">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-stone-700">
                  <span className="text-stone-900 mt-0.5">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
              We handle all of it. If you'd rather skip the work and let us take care of it, click the link below.
            </p>

            <a
              href="/gbp"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-full text-sm transition-colors"
            >
              See How We Get You to The Top 3
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
}