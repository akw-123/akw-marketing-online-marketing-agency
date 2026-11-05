import React, { useState, useEffect } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FAQSection from "@/components/landing/FAQSection";
import FooterSection from "@/components/landing/FooterSection";

export default function Newsletter() {
  useEffect(() => {
    document.title = "AKW Marketing | Newsletter Sign-Up";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "AKW Marketing is the online marketing agency in the Kitchener-Waterloo area that helps local businesses grow. Subscribe to our newsletter for proven marketing tactics.";
  }, []);
  const [form, setForm] = useState({ first_name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Add subscriber to Brevo Newsletter list #14 (SOURCE=inbound) via Make webhook
    try {
      await fetch("https://hook.us2.make.com/45wtmbr89f94ixnzmgctrfo38v1kyrld", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, first_name: form.first_name }),
      });
    } catch (err) {
      // non-blocking: signup still succeeds if the webhook hiccups
    }

    setLoading(false);
    navigate("/newsletter-thank-you");
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
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
            href="https://akwmarketing.com/landing"
            className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left: Headline + Description */}
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.05] tracking-tight">
              THE Newsletter To Grow Your Business.
            </h1>
            <p className="mt-8 text-stone-500 text-base leading-relaxed">
              Simple marketing tactics that actually work for local businesses.
            </p>
            <p className="mt-4 text-stone-500 text-base leading-relaxed">
              No fluff, no theory — just proven strategies you can use this week to bring more customers through your door.
            </p>
          </div>

          {/* Right: Form */}
          <div className="md:pt-4">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <input
                    required
                    type="text"
                    placeholder="First Name *"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-stone-300 py-4 text-stone-900 placeholder-stone-400 text-base focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
                <div>
                  <input
                    required
                    type="email"
                    placeholder="Business Email *"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-stone-300 py-4 text-stone-900 placeholder-stone-400 text-base focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold py-4 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing…</>
                  ) : (
                    <>Send Value To Your Inbox <ArrowUpRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
          </div>
        </div>
      </div>
      <FAQSection />
      <FooterSection />
    </div>
  );
}