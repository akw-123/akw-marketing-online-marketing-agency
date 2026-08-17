import React, { useEffect } from "react";
import FooterSection from "@/components/landing/FooterSection";
import SkipTheWorkCard from "@/components/landing/SkipTheWorkCard";

// Load Wistia scripts
if (typeof window !== 'undefined') {
  const script1 = document.createElement('script');
  script1.src = 'https://fast.wistia.com/player.js';
  script1.async = true;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.src = 'https://fast.wistia.com/embed/wj3p7msfk8.js';
  script2.async = true;
  script2.type = 'module';
  document.head.appendChild(script2);
}

export default function GbpThreeFree() {
  useEffect(() => {
    document.title = "How To Get Into The Top 3 On Google | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "Watch the video: How to get into the top 3 on Google. AKW Marketing helps local businesses rank higher and win more customers with proven local SEO.";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
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

      <section className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight text-center mb-10">
            Your Video: How To Get Into The Top 3 On Google
          </h1>

          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/20 mb-14">
            <style>{`wistia-player[media-id='wj3p7msfk8']:not(:defined){background:center/contain no-repeat url('https://fast.wistia.com/embed/medias/wj3p7msfk8/swatch');display:block;filter:blur(5px);padding-top:56.25%;}`}</style>
            <wistia-player media-id="wj3p7msfk8" aspect="1.7777777777777777"></wistia-player>
          </div>

          <SkipTheWorkCard ctaHref="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3-OF5q-gJ76X212y9PZuHe2EBRoNqjed20SOVs1BzDPoEzoEDPmXH1r-rbisJjaFiWJzFGOUTT" />
        </div>
      </section>

      <FooterSection />
    </div>
  );
}