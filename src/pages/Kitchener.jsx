import React, { useEffect } from "react";

// Load Wistia scripts
if (typeof window !== 'undefined') {
  const script1 = document.createElement('script');
  script1.src = 'https://fast.wistia.com/player.js';
  script1.async = true;
  document.head.appendChild(script1);
  
  const script2 = document.createElement('script');
  script2.src = 'https://fast.wistia.com/embed/9ikdkbbamh.js';
  script2.async = true;
  script2.type = 'module';
  document.head.appendChild(script2);
}
import { motion } from "framer-motion";
import { Users, Clock, Zap, Phone, ArrowRight, MapPin } from "lucide-react";
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
            src="/assets/logo-official.png"
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
              Digital Marketing Agency Kitchener
            </h1>

            <p className="mt-6 text-stone-600 leading-relaxed max-w-lg">
              77% of all search requests go to the top 3 results on Google Maps.
              <br /><br />
              If your Kitchener business isn't there, those customers are going to your competitors. Want to see how this applies to your business? <a href="/free-analysis" className="text-stone-800 underline underline-offset-2 hover:text-stone-900">Request a free analysis</a> and we'll show you exactly where you stand.
            </p>
            <p className="mt-4 text-stone-600 leading-relaxed max-w-lg">
              <a href="/blog" className="text-stone-800 underline underline-offset-2 hover:text-stone-900">Learn more about how local SEO works in Kitchener-Waterloo</a> in our resource library.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/20">
              <style>{`wistia-player[media-id='9ikdkbbamh']:not(:defined){background:center/contain no-repeat url('https://fast.wistia.com/embed/medias/9ikdkbbamh/swatch');display:block;filter:blur(5px);padding-top:56.25%;}`}</style>
              <wistia-player media-id="9ikdkbbamh" aspect="1.7777777777777777"></wistia-player>
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

function ExploreInsights() {
  const posts = [
    { href: "/blog/why-bother", title: "Why Bother Ranking in the Top 3 on Google?" },
    { href: "/blog/the-google-ruse", title: "The Google Ruse: Why Customers Can't Find You" },
    { href: "/blog/quick-way-to-get-higher-in-google", title: "Quick Way to Get Higher in Google" },
    { href: "/blog/how-to-rank-higher-in-google-tomorrow", title: "How to Rank Higher in Google Tomorrow" },
    { href: "/blog/easy-wins", title: "Easy Wins: Why Local Businesses Have a Hidden Edge" },
  ];

  return (
    <section className="py-16 px-6 border-t border-stone-200/60">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight mb-6">Explore our insights</h2>
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.href}>
              <a href={post.href} className="text-stone-700 underline underline-offset-2 hover:text-stone-900 text-base">
                {post.title}
              </a>
            </li>
          ))}
        </ul>
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

function WhereWeWork() {
  const areas = [
    { name: "Waterloo", href: "/waterloo" },
    { name: "Cambridge", href: "/cambridge" },
    { name: "Guelph", href: "/guelph" },
    { name: "Stratford", href: "/stratford" },
    { name: "Brantford", href: "/brantford" },
    { name: "Hamilton", href: "/hamilton" },
    { name: "Burlington", href: "/burlington" },
  ];

  return (
    <section className="py-20 md:py-28 px-6 border-t border-stone-200/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            <MapPin className="w-3 h-3" />
            Where We Work
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Ontario Cities We{" "}
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Serve
            </span>
          </h2>
          <p className="mt-4 text-stone-500 max-w-xl mx-auto text-sm">
            Based in Kitchener, we deliver our Local SEO Top 3 Ranking playbook to businesses across the region.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areas.map((area) => (
            <a
              key={area.href}
              href={area.href}
              className="group bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-md hover:border-stone-300 transition-all duration-300"
            >
              <span className="text-sm font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                {area.name}
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Kitchener() {
  useEffect(() => {
    document.title = "Digital Marketing Agency Kitchener | SEO, Google Ads & Local SEO for Kitchener Businesses | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "Kitchener digital marketing agency offering SEO, Google Ads & Meta Ads. Get found, attract leads, scale revenue. Free analysis from AKW Marketing.";

    const schema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "AKW Marketing Agency",
      "alternateName": ["AKW Marketing", "AKW Marketing Kitchener"],
      "description": "Digital marketing agency helping local businesses in Kitchener and the Kitchener-Waterloo area rank in the top 3 on Google.",
      "founder": {
        "@type": "Person",
        "name": "Andre Kadjo",
        "jobTitle": "Founder",
        "worksFor": { "@type": "Organization", "name": "AKW Marketing" }
      },
      "url": "https://akwmarketing.com/kitchener",
      "telephone": "+1-437-475-0076",
      "email": "contact@akwmarketing.com",
      "image": "/assets/logo-official.png",
      "logo": "/assets/logo-official.png",
      "areaServed": [
        {"@type":"City","name":"Kitchener","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Waterloo","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Cambridge","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Guelph","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Hamilton","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Listowel","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Brantford","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Stratford","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Woodstock","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Burlington","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Orangeville","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
        {"@type":"City","name":"Mount Forest","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}}
      ],
      "openingHours": "Mo-Su 00:00-23:59",
      "priceRange": "$$",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "3",
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://www.instagram.com/akw_marketing/",
        "https://x.com/akw_marketing",
        "https://www.tiktok.com/@akw_marketing",
        "https://www.linkedin.com/company/akw-marketing/",
        "https://www.youtube.com/@AKWMarketing"
      ]
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'professional-service-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { const el = document.getElementById('professional-service-schema'); if (el) el.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <KitchenerNav />
      <KitchenerHero />
      <AdvantagesSection />
      <BeforeAfterSection />
      <KitchenerProcessSection />
      <TestimonialsSection />
      <WhereWeWork />
      <FAQSection />
      <ExploreInsights />
      <KitchenerCTA />
      <KitchenerFooter />
    </div>
  );
}