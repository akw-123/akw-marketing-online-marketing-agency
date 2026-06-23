import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const caseStudies = [
  {
    slug: "cambridge-hvac-local-seo",
    tag: "HVAC, Cambridge",
    headline: "How a Cambridge HVAC Company Hit Google's Top 3 in 12 Weeks",
    metric: "Rank #43 to #2 in the Cambridge map pack. Calls from search 6 per month to 41 per month.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
  },
  {
    slug: "waterloo-dental-reviews",
    tag: "Dentistry, Waterloo",
    headline: "How a Waterloo Dental Practice Went from 8 Reviews to 64 in 4 Months",
    metric: "8 reviews to 64 reviews in 4 months. 4.9 stars sustained.",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=80",
  },
  {
    slug: "burlington-realtor-full-funnel",
    tag: "Real Estate, Burlington",
    headline: "How a Burlington Real Estate Agent Tripled Qualified Leads in 6 Months",
    metric: "Qualified leads 5 per month to 17 per month. Cost per qualified lead dropped 38%.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
  },
  {
    slug: "guelph-cafe-gbp",
    tag: "Café, Guelph",
    headline: "How a Guelph Café Went from Invisible to 1,200 Monthly Direction Requests",
    metric: "Google direction requests 47 per month to 1,247 per month in 8 weeks.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
  },
  {
    slug: "hamilton-accountant-google-ads",
    tag: "Accounting, Hamilton",
    headline: "How a Hamilton Accounting Firm Cut Cost-Per-Lead 54% on Google Ads",
    metric: "Cost per qualified lead: $467 to $215 (-54%). Qualified leads: 9 per month to 24 per month.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  },
];

export default function CaseStudies() {
  useEffect(() => {
    document.title = "Case Studies, Real Results for Local Businesses, AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "See how AKW Marketing helps Kitchener-Waterloo businesses rank in Google's top 3, cut their cost per lead, and grow predictably. Real clients, real numbers.";

    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Case Studies, Real Results for Local Businesses, AKW Marketing",
      "url": "https://akwmarketing.com/case-studies",
      "hasPart": caseStudies.map(cs => ({
        "@type": "Article",
        "url": `https://akwmarketing.com/case-studies/${cs.slug}`
      }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'collection-page-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { const el = document.getElementById('collection-page-schema'); if (el) el.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Nav */}
      <nav className="border-b border-stone-200/60 px-6 h-16 flex items-center justify-between bg-[#F5F0EB]">
        <a href="/" className="flex items-center gap-2">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
            alt="AKW Marketing Logo"
            className="w-8 h-8 rounded-md object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
        </a>
        <div className="flex items-center gap-6">
          <Link to="/blog" className="text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors">Blog</Link>
          <Link to="/case-studies" className="text-sm text-stone-900 font-semibold transition-colors">Case Studies</Link>
          <a href="/" className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium transition-colors flex items-center">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
          Real Results for Real Local Businesses
        </h1>
        <p className="mt-5 text-stone-500 text-base leading-relaxed max-w-3xl">
          Every business on this page started where you might be right now. Invisible to local searchers, paying too much for leads, or wondering why marketing wasn't translating into customers. Below are the real strategies we used, the timelines they ran on, and the measurable results they produced. No vanity metrics. No vague wins. Real businesses, real numbers, real outcomes.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              to={`/case-studies/${cs.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-video overflow-hidden">
                <img src={cs.image} alt={cs.tag} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">{cs.tag}</span>
                <h2 className="text-sm font-semibold text-stone-900 leading-snug mb-3">{cs.headline}</h2>
                <p className="text-xs text-stone-500 leading-relaxed mb-4 flex-1"><strong>{cs.metric}</strong></p>
                <span className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read full story <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200/60 py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6">Want results like these?</h2>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-full text-sm transition-colors"
        >
          Book a free consultation
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}