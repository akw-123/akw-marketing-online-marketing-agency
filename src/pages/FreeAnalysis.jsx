import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { leadCaptureEnabled, submitFormLead } from "@/lib/previewLeadCapture";
import TurnstileWidget from "@/components/TurnstileWidget";

const faqs = [
  {
    q: "How do I know you can actually get me in the top 3?",
    a: "We've done this for dozens of local businesses across plumbing, legal, dental, landscaping, construction, and more. We only take on businesses we know we can rank — that's why we've never had to refund anyone. Before we take your money, we audit your market and only proceed if we're confident we can get you there. If we can't deliver top 3 in 90 days, you get every penny back.",
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
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const captureReady = leadCaptureEnabled();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError("");
    setSubmitOk("");
    setSubmitting(true);
    const result = await submitFormLead({
      source: "free-analysis",
      payload: form,
      formEl: e.currentTarget,
      hostname: window.location.hostname,
    });
    setSubmitting(false);
    if (result.ok) setSubmitOk(result.message);
    else setSubmitError(result.message);
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Navbar */}
      <nav className="border-b border-stone-200/60 px-6 h-16 flex items-center justify-between bg-[#F5F0EB]">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/assets/logo-official.png"
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
              Fill out the form and we will record your personalized analysis with the exact things that need to happen so you can rank in the top 3 within your area. <a href="/kitchener" className="text-stone-800 underline underline-offset-2 hover:text-stone-900">We work specifically with Kitchener-Waterloo businesses</a> and know exactly what it takes to rank in this market.
            </p>
            <p className="text-stone-500 text-base leading-relaxed font-medium">
              No costs, no obligations, no annoying sales pitch. Guaranteed. <a href="/blog" className="text-stone-600 underline underline-offset-2 hover:text-stone-800">Browse our blog</a> to see how we've done it for others.
            </p>
          </div>

          {/* Right — Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-1" data-lead-capture={captureReady ? "ready" : "unavailable"}>
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  defaultValue=""
                  className="hidden"
                />
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

                <TurnstileWidget />
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit"} <ArrowUpRight className="w-4 h-4" />
                  </button>
                  {submitError && (
                    <p className="text-sm text-stone-600 leading-relaxed mt-4" role="alert">
                      {submitError}
                    </p>
                  )}
                  {submitOk && (
                    <p className="text-sm text-stone-600 leading-relaxed mt-4" role="status">
                      {submitOk}
                    </p>
                  )}
                </div>
              </form>
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