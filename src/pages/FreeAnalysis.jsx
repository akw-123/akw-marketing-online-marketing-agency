import React, { useState } from "react";
import { Phone, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const inputClass = "w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400";

const timelines = ["Today", "This Week", "In a few weeks"];

export default function FreeAnalysis() {
  const [form, setForm] = useState({ name: "", email: "", business_name: "", timeline: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await base44.entities.FreeAnalysisRequest.create(form);

    await base44.integrations.Core.SendEmail({
      to: "andre@akwmarketing.com",
      subject: `New Free Analysis Request — ${form.business_name} (${form.name})`,
      body: `New Free GBP Analysis Request\n\nName: ${form.name}\nEmail: ${form.email}\nBusiness: ${form.business_name}\nTimeline: ${form.timeline || "Not specified"}`,
    });

    setLoading(false);
    setSubmitted(true);
  };

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
          <a href="tel:+15067038558">
            <button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +1 506 703 8558
            </button>
          </a>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 pt-10">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Free Stuff</p>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Get Your Profile{" "}
              <span className="italic" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                Analyzed
              </span>
            </h1>
            <p className="text-stone-500 text-base leading-relaxed">
              Fill out the form and we will record your personalized analysis with the exact things that need to happen so you can rank in the top 3 within your area. No costs, no obligations, no annoying sales pitch. Guaranteed.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-5" />
                <h3 className="text-2xl font-bold text-stone-900 mb-3">You're in!</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
                  We'll record your personalized GBP analysis and send it to your email within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Name <span className="text-red-400">*</span></label>
                  <input required type="text" placeholder="John Smith" value={form.name} onChange={set("name")} className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input required type="email" placeholder="you@yourbusiness.com" value={form.email} onChange={set("email")} className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Business Name <span className="text-red-400">*</span></label>
                  <input required type="text" placeholder="Your Business LLC" value={form.business_name} onChange={set("business_name")} className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">By when do you want to solve this problem?</label>
                  <div className="flex flex-wrap gap-3">
                    {timelines.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, timeline: t })}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                          form.timeline === t
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                    : <>Get My Free Analysis <ArrowRight className="w-4 h-4" /></>}
                </button>

                <p className="text-xs text-stone-400 text-center">No costs, no obligations. Just results.</p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 py-8 px-6 text-center">
        <p className="text-xs text-stone-400">© {new Date().getFullYear()} AKW Marketing. All rights reserved.</p>
      </footer>
    </div>
  );
}