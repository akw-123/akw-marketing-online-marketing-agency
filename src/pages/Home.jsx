import React, { useState } from "react";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import FooterSection from "@/components/landing/FooterSection";

const clients = [
  "Simpson Drew",
  "Woodfelder Tree Care",
  "Good Skin Club",
  "Cabas Construction",
  "Gibson Baptists",
  "Carter Solutions",
];

const team = [
  {
    name: "Andre Kadjo",
    role: "Founder & CEO",
    img: "https://media.base44.com/images/public/69aa2d66169a7c4374014381/c080ba885_1570675559675.jpeg",
  },
];

function EmailForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await base44.integrations.Core.SendEmail({
      to: "andre@akwmarketing.com",
      subject: `New Free Tips Subscriber: ${email}`,
      body: `A new subscriber signed up for the 3 Free Tips:\n\nEmail: ${email}`,
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
        <CheckCircle className="w-5 h-5" />
        You're in! Check your inbox shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@email.com"
        className="px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 w-64"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Subscribe
      </button>
    </form>
  );
}

export default function Home() {
  React.useEffect(() => {
    document.title = "AKW Marketing | Online Marketing Agency";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "AKW Marketing is the online marketing agency in the Kitchener-Waterloo area that helps local businesses rank higher on Google and get more customers.";
  }, []);

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

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
            Is Your Business<br />Invisible on Google?
          </h1>
          <p className="mt-5 text-stone-500 text-base leading-relaxed max-w-md">
            Watch this short video to learn why you're not ranking in the top 3.
          </p>
          <p className="mt-4 text-stone-900 font-semibold text-base leading-relaxed max-w-md">
            Sign up below to get three FREE tips you can implement today to start climbing ⬇️
          </p>
          <div className="mt-7">
            <EmailForm />
          </div>
        </div>

        {/* Video */}
        <div className="rounded-2xl overflow-hidden shadow-xl shadow-stone-900/10" style={{ paddingTop: "56.25%", position: "relative" }}>
          <iframe
            src="https://fast.wistia.net/embed/iframe/rpkp3l7mfn?videoFoam=true&playButton=true&controlsVisibleOnLoad=true&volumeControl=true&fullscreenButton=true&playbar=true"
            title="AKW Marketing Video"
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder="0"
            scrolling="no"
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
          />
        </div>
      </section>

      {/* Client Logos */}
      <section className="border-t border-stone-200/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-6 md:gap-10">
          <span className="text-sm text-stone-400 font-medium whitespace-nowrap">Working with...</span>
          {clients.map((name) => (
            <span key={name} className="text-sm text-stone-400 font-semibold tracking-wide uppercase">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-5">
              Our team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">Meet the team</h2>
          </div>
          <div className="flex justify-center">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-2xl overflow-hidden mb-4 shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-semibold text-stone-900 text-sm">{member.name}</p>
                <p className="text-stone-400 text-xs mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tips CTA */}
      <section className="py-20 px-6 border-t border-stone-200/60">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            Free stuff
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            3 Tips to Rank Higher on Google
          </h2>
          <p className="text-stone-500 text-base leading-relaxed mb-2">
            Get a free video showing you the first three things we do when we start working with a local business to get them ranking in the top 3.
          </p>
          <p className="text-stone-500 text-sm mb-2">No technical know-how needed.</p>
          <p className="text-stone-500 text-sm mb-8">Enter your email and you'll get instant access.</p>
          <a
            href="https://calendar.app.google/B2umMiNgAUYvewSN6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-full text-sm transition-colors"
          >
            Book a Free Strategy Call
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}