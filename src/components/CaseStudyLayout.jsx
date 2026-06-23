import React, { useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function CaseStudyLayout({ title, metaDescription, h1, content, slug }) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = metaDescription;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": h1,
      "description": metaDescription,
      "author": { "@type": "Organization", "name": "AKW Marketing", "url": "https://akwmarketing.com" },
      "publisher": { "@type": "Organization", "name": "AKW Marketing", "url": "https://akwmarketing.com" },
      "datePublished": "2026-06-23",
      "mainEntityOfPage": `https://akwmarketing.com/case-studies/${slug}`
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { const el = document.getElementById('article-schema'); if (el) el.remove(); };
  }, [title, metaDescription, h1, slug]);

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
          <Link to="/case-studies" className="text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors">Case Studies</Link>
          <a href="/" className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium transition-colors flex items-center">
            Get Started
          </a>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link to="/case-studies" className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Case Studies
        </Link>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 pt-6 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight tracking-tight mb-8">{h1}</h1>
        <div className="prose prose-stone prose-sm md:prose-base max-w-none
          prose-headings:font-bold prose-headings:text-stone-900 prose-headings:tracking-tight
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
          prose-p:text-stone-600 prose-p:leading-relaxed
          prose-strong:text-stone-900
          prose-li:text-stone-600 prose-li:leading-relaxed
          prose-ul:space-y-1
          prose-blockquote:border-l-4 prose-blockquote:border-stone-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-stone-500">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </article>

      {/* CTA */}
      <section className="border-t border-stone-200/60 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Ready to get results like this?</h2>
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