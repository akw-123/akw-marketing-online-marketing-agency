import React, { useState } from "react";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import FooterSection from "@/components/landing/FooterSection";
import WhereWeWork from "@/components/landing/WhereWeWork";
import ProcessSection from "@/components/landing/ProcessSection";
import PricingSection from "@/components/landing/PricingSection";

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
    try {
      await fetch("https://hook.us2.make.com/45wtmbr89f94ixnzmgctrfo38v1kyrld", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name: "" }),
      });
    } catch (err) {
      // non-blocking: signup still succeeds if the webhook fails
    }
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
    const isHome = window.location.pathname.toLowerCase() === '/home';
    document.title = isHome
      ? "Top 3 on Google in 90 Days | AKW Marketing"
      : "Is Your Business Invisible on Google? | AKW Marketing";
    
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "AKW Marketing is the online marketing agency in Kitchener-Waterloo area that helps local businesses grow. As your on-demand marketing department, we drive more customers your way through Google Ads, Meta Ads, and SEO. We track every metric and adjust our strategy based on results. Looking for a reliable online marketing agency in Kitchener-Waterloo that delivers real results? Contact us for a free introductory consultation";

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AKW Marketing",
      "url": "https://akwmarketing.com"
    };
    const websiteScript = document.createElement('script');
    websiteScript.type = 'application/ld+json';
    websiteScript.id = 'website-schema';
    websiteScript.textContent = JSON.stringify(websiteSchema);
    document.head.appendChild(websiteScript);

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AKW Marketing",
      "url": "https://akwmarketing.com",
      "logo": "https://media.base44.com/images/public/69aa2d66169a7c4374014381/c8e3cd9e0_Logo_official1.png",
      "sameAs": [
        "https://www.instagram.com/akw_marketing/",
        "https://www.youtube.com/@AKWMarketing",
        "https://www.tiktok.com/@akw_marketing",
        "https://www.linkedin.com/company/akw-marketing/",
        "https://x.com/akw_marketing"
      ]
    };
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.id = 'organization-schema';
    orgScript.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgScript);

    const psSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "AKW Marketing",
      "alternateName": [
        "AKW Marketing Kitchener-Waterloo",
        "AKW Marketing Kitchener",
        "AKW Marketing KW"
      ],
      "description": "AKW Marketing Agency helps local businesses in the Kitchener-Waterloo area rank in the top 3 on Google in 90 days.",
      "url": "https://akwmarketing.com/",
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
        "reviewCount": "6",
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
    const psScript = document.createElement('script');
    psScript.type = 'application/ld+json';
    psScript.id = 'professional-service-schema';
    psScript.textContent = JSON.stringify(psSchema);
    document.head.appendChild(psScript);
    return () => {
      const ws = document.getElementById('website-schema'); if (ws) ws.remove();
      const org = document.getElementById('organization-schema'); if (org) org.remove();
      const ps = document.getElementById('professional-service-schema'); if (ps) ps.remove();
    };
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
            Watch this short video to learn why you're not ranking in the top 3. We specialize in <a href="/kitchener" className="text-stone-700 underline underline-offset-2 hover:text-stone-900">digital marketing in Kitchener-Waterloo</a> and surrounding areas.
          </p>
          <p className="mt-4 text-stone-900 font-semibold text-base leading-relaxed max-w-md">
            Sign up below to get three FREE tips you can implement today to start climbing ⬇️
          </p>
          <div className="mt-7">
            <EmailForm />
          </div>
        </div>

        {/* Video */}
        <div className="rounded-2xl overflow-hidden shadow-xl shadow-stone-900/10">
          <style>{`wistia-player[media-id='aekmn6ipn3']:not(:defined){background:center/contain no-repeat url('https://fast.wistia.com/embed/medias/aekmn6ipn3/swatch');display:block;filter:blur(5px);padding-top:56.25%;}`}</style>
          <wistia-player media-id="aekmn6ipn3" aspect="1.7777777777777777"></wistia-player>
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
            Get a free video showing you the first three things we do when we start working with a local business to get them ranking in the top 3. You can also <a href="/free-analysis" className="text-stone-700 underline underline-offset-2 hover:text-stone-900">get a free analysis of your business</a> to see exactly where you stand.
          </p>
          <p className="text-stone-500 text-sm mb-2">No technical know-how needed. <a href="/blog" className="text-stone-700 underline underline-offset-2 hover:text-stone-900">Read our latest insights</a> for more marketing strategies.</p>
          <p className="text-stone-500 text-sm mb-8">Enter your email and you'll get instant access, or <a href="/newsletter" className="text-stone-700 underline underline-offset-2 hover:text-stone-900">subscribe to our weekly newsletter</a> for ongoing tips.</p>
          <a
            href="https://calendar.app.google/B2umMiNgAUYvewSN6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-full text-sm transition-colors"
          >
            Get 3 Free Tips
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <ProcessSection />
      <PricingSection />
      <WhereWeWork />
      <FooterSection />
    </div>
  );
}