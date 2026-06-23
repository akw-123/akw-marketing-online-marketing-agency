import React, { useState } from "react";
import { Users, Zap, TrendingUp, CheckCircle, ChevronDown, ArrowRight, Clock, Loader2 } from "lucide-react";
import FooterSection from "@/components/landing/FooterSection";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stats = [
  { icon: Users, label: "32+ Satisfied Clients" },
  { icon: Clock, label: "4+ Years of Experience" },
  { icon: Zap, label: "Lightning Fast Results" },
];

const advantages = [
  {
    title: "Visibility",
    desc: "75% of all leads who are searching for your services go to the top 3 results. If you're not there, you're invisible.",
  },
  {
    title: "Free",
    desc: "No pay per click or huge ad budgets as with running Google Ads, Meta Ads, or alike.",
  },
  {
    title: "Long Term Strategy",
    desc: "As soon as you're in the top 3, you'll usually stay there for years. Without any additional monthly costs.",
  },
];

const process = [
  { num: "01", title: "Strategy Call", desc: "Book a free call so we can assess your market and current rankings." },
  { num: "02", title: "Onboarding", desc: "We'll send you detailed instructions that shows you how we can get secure access to your profile." },
  { num: "03", title: "Execution", desc: "We'll walk through every step of the process so we not only fill your calendar for weeks." },
  { num: "04", title: "What works?", desc: "We track relevant data to see what actually works and do more of it." },
];

const faqs = [
  { q: "What is the difference between SEO and Google Ads?", a: "SEO (Search Engine Optimization) is a long-term strategy that helps your business rank organically in search results. Google Ads is a pay-per-click model where you pay every time someone clicks your ad. SEO provides sustainable, free traffic once you rank, while ads stop the moment you stop paying." },
  { q: "Which companies do you work with?", a: "We work with local service-based businesses such as plumbers, dentists, electricians, lawyers, real estate agents, restaurants, and more. Essentially any business that relies on local customers finding them through Google." },
  { q: "How much time will I need to invest?", a: "Very little. After the initial onboarding which takes about 15 minutes, we handle everything. You will receive bi-weekly progress updates and can reach out to us anytime with questions." },
  { q: "What are the contract terms?", a: "We require a 3-month minimum commitment to allow enough time for results. After the initial period, you can cancel monthly. We are confident in our results, which is why we offer a money-back guarantee." },
  { q: "How can we get started?", a: "Schedule a short strategy call via the button on this page. We will review your current Google presence together, assess your market, and tell you exactly what is needed to get you into the top 3. Free, no obligations." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 py-5 last:border-0">
      <button
        className="w-full flex justify-between items-center text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-stone-800 font-semibold text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
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
            <p className="text-stone-500 text-sm leading-relaxed mt-3 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = "w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400";
const selectClass = "w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 appearance-none cursor-pointer";

const emptyForm = {
  full_name: "", business_name: "", email: "", phone: "", website: "",
  gbp_status: "", primary_goal: "", monthly_budget: "", start_timeline: "",
  referral_source: "", additional_info: ""
};

function ApplicationForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await base44.entities.StrategyApplication.create(form);

    const emailBody = `
New GBP Strategy Application

Full Name: ${form.full_name}
Business Name: ${form.business_name}
Email: ${form.email}
Phone: ${form.phone}
Website: ${form.website || "N/A"}

GBP Status: ${form.gbp_status || "N/A"}
Primary Goal: ${form.primary_goal || "N/A"}
Monthly Budget: ${form.monthly_budget || "N/A"}
Start Timeline: ${form.start_timeline || "N/A"}
How They Heard: ${form.referral_source || "N/A"}

Additional Info:
${form.additional_info || "N/A"}
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: "andre@akwmarketing.com",
      subject: `New GBP Application: ${form.business_name} (${form.full_name})`,
      body: emailBody,
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-5" />
        <h3 className="text-2xl font-bold text-stone-900 mb-2">Application Received!</h3>
        <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
          Thank you, <strong>{form.full_name}</strong>! We'll review your application and reach out within 24–48 hours to schedule your free GBP strategy session.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
          <input required type="text" placeholder="John Smith" value={form.full_name} onChange={set("full_name")} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Business Name <span className="text-red-400">*</span></label>
          <input required type="text" placeholder="Your Business LLC" value={form.business_name} onChange={set("business_name")} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
          <input required type="email" placeholder="you@yourbusiness.com" value={form.email} onChange={set("email")} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
          <input required type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Business Website URL</label>
        <input type="url" placeholder="https://yourbusiness.com" value={form.website} onChange={set("website")} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Current Google Business Profile Status</label>
        <select value={form.gbp_status} onChange={set("gbp_status")} className={selectClass}>
          <option value="">Select an option…</option>
          <option>Not set up yet</option>
          <option>Set up but not optimized</option>
          <option>Suspended/Penalized</option>
          <option>Already optimized but want more</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Primary Goal</label>
        <select value={form.primary_goal} onChange={set("primary_goal")} className={selectClass}>
          <option value="">Select an option…</option>
          <option>Get more calls</option>
          <option>Get more foot traffic</option>
          <option>Rank higher in local search</option>
          <option>Improve reviews &amp; reputation</option>
          <option>All of the above</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Monthly Marketing Budget</label>
          <select value={form.monthly_budget} onChange={set("monthly_budget")} className={selectClass}>
            <option value="">Select a range…</option>
            <option>Under $500</option>
            <option>$500–$1,000</option>
            <option>$1,000–$2,500</option>
            <option>$2,500–$5,000</option>
            <option>$5,000+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">How soon to start?</label>
          <select value={form.start_timeline} onChange={set("start_timeline")} className={selectClass}>
            <option value="">Select a timeline…</option>
            <option>Immediately</option>
            <option>Within 30 days</option>
            <option>1–3 months</option>
            <option>Just exploring</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Anything else? <span className="text-stone-400 font-normal">(optional)</span></label>
        <textarea
          rows={4}
          placeholder="Tell us about your business, current challenges, or any questions…"
          value={form.additional_info}
          onChange={set("additional_info")}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Submit Application <ArrowRight className="w-4 h-4" /></>}
      </button>
      <p className="text-xs text-stone-400 text-center">We review every application personally. Expect a reply within 24–48 hours.</p>
    </form>
  );
}

export default function MetaAds() {
  React.useEffect(() => {
    document.title = "Online Marketing Agency in Kitchener-Waterloo | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "AKW Marketing is an online marketing agency serving the Kitchener-Waterloo area. We run Google Ads, Meta Ads, and SEO as your on-demand marketing department — every metric tracked, strategy adjusted to results. Get more customers; book a free introductory consultation.";

    const schema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "AKW Marketing Agency",
      "description": "AKW Marketing Agency — get your local business into Google's top 3 in 90 days. Serving the Kitchener-Waterloo area.",
      "url": "https://akwmarketing.com/gbp",
      "telephone": "+1-437-475-0076",
      "email": "contact@akwmarketing.com",
      "image": "https://media.base44.com/images/public/69aa2d66169a7c4374014381/c8e3cd9e0_Logo_official1.png",
      "logo": "https://media.base44.com/images/public/69aa2d66169a7c4374014381/c8e3cd9e0_Logo_official1.png",
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
        "https://www.linkedin.com/company/akw-marketing/"
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
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F0EB]/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
              alt="AKW Marketing Logo"
              className="w-8 h-8 rounded-md object-contain"
            />
            <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
          </a>
          <a href="/">
            <button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2 transition-colors">
              Sign Up
            </button>
          </a>
        </div>
      </nav>

      <div className="pt-24 max-w-4xl mx-auto px-6">

        {/* Hero */}
        <section className="pt-12 pb-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm text-stone-500">Ontario, Canada</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 leading-tight">
              The <span className="font-black">ONLY two things</span> you need to know about marketing
            </h1>
          </motion.div>
        </section>

        {/* Video */}
         <section className="pb-10">
           <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
             <div className="rounded-2xl overflow-hidden shadow-lg">
               <style>{`wistia-player[media-id='w99ol7hw7u']:not(:defined){background:center/contain no-repeat url('https://fast.wistia.com/embed/medias/w99ol7hw7u/swatch');display:block;filter:blur(5px);padding-top:56.25%;}`}</style>
               <wistia-player media-id="w99ol7hw7u" aspect="1.7777777777777777"></wistia-player>
             </div>
           </motion.div>
         </section>

        {/* Trust Stats */}
        <section className="pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl px-5 py-4 flex items-center gap-3"
              >
                <stat.icon className="w-5 h-5 text-stone-400 flex-shrink-0" />
                <span className="text-sm font-medium text-stone-700">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Advantages */}
        <section className="pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
              The Advantage
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              But, Is This Even{" "}
              <span className="italic" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Worth It?</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-stone-200 p-6"
              >
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{adv.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Before / After */}
        <section className="pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
              Before / After
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              The{" "}
              <span className="italic" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Difference</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-white rounded-2xl border border-stone-200 p-6">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Before</p>
              <div className="space-y-1">
                {[
                  { label: "Average Rank", value: "86th" },
                  { label: "Market Share", value: "1%" },
                  { label: "Clicks / Month", value: "~5" },
                  { label: "New Clients / Month", value: "1–2" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
                    <span className="text-sm text-stone-500">{row.label}</span>
                    <span className="text-sm font-semibold text-red-400">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.15 }} className="bg-stone-900 rounded-2xl p-6 text-white">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">After</p>
              <div className="space-y-1">
                {[
                  { label: "Average Rank", value: "Top 3" },
                  { label: "Market Share", value: "30–60%" },
                  { label: "Clicks / Month", value: "200+" },
                  { label: "New Clients / Month", value: "10–20+" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-stone-700 last:border-0">
                    <span className="text-sm text-stone-400">{row.label}</span>
                    <span className="text-sm font-semibold text-green-400">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process */}
        <section className="pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
              How Does It Work?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              It's Pretty{" "}
              <span className="italic" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Easy.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-stone-200 p-6"
              >
                <p className="text-3xl font-bold text-stone-200 mb-3">{step.num}</p>
                <h3 className="text-base font-semibold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
              FAQs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              Frequently Asked{" "}
              <span className="italic" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Questions</span>
            </h2>
          </motion.div>
          <div className="bg-white rounded-2xl border border-stone-200 px-6">
            {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </section>

        {/* Book Strategy Call CTA */}
        <section className="pb-16 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
              Free stuff
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Book Your Free Strategy Call
            </h2>
            <p className="text-stone-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              If this sounds like what your business needs, let's talk.<br />
              Book a quick call with our team and we'll walk you through exactly how we'd get you ranking in the top 3.
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
          </motion.div>
        </section>

        {/* Apply Section */}
        <section id="apply" className="pb-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
              Apply now
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Send in your application
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              If we think we would be a good fit, we will reach back out and schedule a call with you.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-stone-200 p-8"
          >
            <ApplicationForm />
          </motion.div>

        </section>
      </div>

      <FooterSection />
    </div>
  );
}