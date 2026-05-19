import React, { useState, useEffect } from "react";
import { ArrowUpRight, Loader2, CheckCircle, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How do I know you can actually get me in the top 3?",
    a: "We've done this for dozens of local businesses across plumbing, legal, dental, landscaping, construction, and more. We only take on businesses we know we can rank — that's why we've never had to refund anyone. Before we take your money, we audit your market and only proceed if we're confident we can get you there. If we can't deliver top 3 in 90 days, you get every penny back.",
  },
  {
    q: "What's this actually going to cost me?",
    a: "We'll discuss pricing on the strategy call based on your market and competition. There are no hidden fees or monthly retainers unless we agree on it together. You only pay if we're confident we can deliver results.",
  },
  {
    q: "Will this work for my type of business?",
    a: "If you're a local service business with a physical service area, yes. We've ranked plumbers, dentists, electricians, lawyers, contractors, and many more. On our call, we'll tell you straight up if your market has any obstacles. We don't take your money if we can't deliver.",
  },
  {
    q: "How long until I see results?",
    a: "Most businesses see ranking movement within 2–3 weeks. The goal is top 3 within 90 days, but many hit it sooner. Once you're in the top 3, the calls start coming in consistently — that's the real ROI.",
  },
  {
    q: "How much of my time does this require?",
    a: "About 30 minutes total. One short onboarding call where we get access to your Google Business Profile. After that, we handle everything — optimization, reviews, posts, citations. You just keep running your business.",
  },
  {
    q: "What if I need a refund?",
    a: "If you're not in the top 3 after 90 days, email us and we'll process a full refund within 48 hours. No forms, no fighting. You either get top 3 rankings or your money back — simple as that.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 py-5 last:border-0">
      <button
        className="w-full flex justify-between items-center text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-stone-800 font-semibold text-sm md:text-base">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-stone-500 text-sm leading-relaxed mt-3 pr-6">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full px-0 py-3 border-0 border-b border-stone-300 bg-transparent text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors";

const TIMELINE_OPTIONS = ["Today", "Tomorrow", "In a few weeks"];

export default function FreeAnalysis() {
  useEffect(() => {
    document.title = "Free Google Profile Analysis — AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "Get a free personalized analysis of your Google Business Profile. We'll show you exactly what needs to happen to rank in the top 3 in your area.";
  }, []);

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", website: "", business_name: "", google_maps_url: "", timeline: "Today",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await base44.entities.StrategyApplication.create({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      website: form.website,
      business_name: form.business_name,
      additional_info: `Google Maps URL: ${form.google_maps_url}\nTimeline: ${form.timeline}`,
    });

    await base44.integrations.Core.SendEmail({
      to: "andre@akwmarketing.com",
      subject: `New Free Analysis Request: ${form.business_name} (${form.full_name})`,
      body: `New Free Analysis Request\n\nFull Name: ${form.full_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nWebsite: ${form.website || "N/A"}\nBusiness Name: ${form.business_name}\nGoogle Maps URL: ${form.google_maps_url || "N/A"}\nTimeline: ${form.timeline}`,
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Navbar */}
      <nav className="border-b border-stone-200/60 px-6 h-16 flex items-center justify-between bg-[#F5F0EB]">
        <a href="/" className="flex items-center gap-2">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
            alt="AKW Marketing Logo"
            className="w-8 h-8 rounded-md object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
        </a>
        <a href="/">
          <button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium transition-colors">
            Sign Up
          </button>
        </a>
      </nav>

      {/* Hero + Form */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <span className="inline-flex items-center bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
              Free Stuff
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.0] tracking-tight mb-8">
              Get Your<br />Profile<br />Analyzed
            </h1>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed mb-6 max-w-sm">
              Fill out the form and we will record your personalized analysis with the exact things that need to happen so you can rank in the top 3 within your area.
            </p>
            <p className="text-stone-500 text-base leading-relaxed font-medium">
              No costs, no obligations, no annoying sales pitch. Guaranteed.
            </p>
          </div>

          {/* Right — Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CheckCircle className="w-14 h-14 text-green-500 mb-5" />
                <h3 className="text-2xl font-bold text-stone-900 mb-2">Request Received!</h3>
                <p className="text-stone-500 text-sm max-w-xs leading-relaxed">
                  Thanks, <strong>{form.full_name}</strong>! We'll review your profile and send your personalized analysis within 24–48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-1">
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Full Name *"
                    value={form.full_name}
                    onChange={set("full_name")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <input
                    required
                    type="email"
                    placeholder="Business Email *"
                    value={form.email}
                    onChange={set("email")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <input
                    required
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={set("phone")}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="Website *"
                    value={form.website}
                    onChange={set("website")}
                    className={inputClass}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Company Name *"
                    value={form.business_name}
                    onChange={set("business_name")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="Your Google Maps URL *"
                    value={form.google_maps_url}
                    onChange={set("google_maps_url")}
                    className={inputClass}
                  />
                </div>

                {/* Timeline */}
                <div className="pt-4 pb-2">
                  <p className="text-sm text-stone-700 font-medium mb-3">
                    By when do you want to solve this problem? *
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {TIMELINE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm({ ...form, timeline: opt })}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          form.timeline === opt
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-600 border-stone-300 hover:border-stone-500"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Submit <ArrowUpRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="mb-10">
          <span className="inline-flex items-center bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-5">
            Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Frequently Asked<br />Questions
          </h2>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 px-6">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}