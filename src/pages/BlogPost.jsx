import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import FooterSection from "@/components/landing/FooterSection";

function BlogNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F0EB]/80 backdrop-blur-xl border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
            alt="AKW Marketing Logo"
            className="w-8 h-8 rounded-md object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
        </a>
        <a href="tel:+14374750076">
          <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium">
            <Phone className="w-3.5 h-3.5 mr-2" />
            +1 437 475 0076
          </Button>
        </a>
      </div>
    </nav>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    base44.entities.BlogPost.filter({ slug, published: true })
      .then((results) => {
        if (results.length === 0) setNotFound(true);
        else setPost(results[0]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <BlogNavbar />

      <div className="pt-24 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-200 rounded w-1/4" />
              <div className="aspect-[4/3] bg-stone-200 rounded-2xl mt-8" />
              <div className="space-y-3 mt-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-stone-200 rounded w-full" />
                ))}
              </div>
            </div>
          )}

          {notFound && (
            <div className="text-center py-24">
              <p className="text-stone-400 text-lg">Post not found.</p>
              <Link to="/blog" className="text-stone-900 underline mt-4 inline-block">
                Go back to blog
              </Link>
            </div>
          )}

          {post && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {post.category && (
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-stone-400 border border-stone-300 rounded-full px-4 py-1.5 mb-6">
                  {post.category}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-stone-400 mb-10">
                {post.published_date && (
                  <span>{format(new Date(post.published_date), "MMMM d, yyyy")}</span>
                )}
                {post.read_time_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.read_time_minutes} min read
                  </span>
                )}
              </div>

              {post.cover_image_url && (
                <div className="rounded-2xl overflow-hidden mb-10">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-stone prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-stone-900
                prose-p:text-stone-700 prose-p:leading-relaxed
                prose-a:text-stone-900 prose-a:underline
                prose-strong:text-stone-900
                prose-li:text-stone-700">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* CTA */}
              <div className="mt-16 bg-stone-900 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Ready to rank higher on Google?</h3>
                <p className="text-stone-400 text-sm mb-6">Book a free strategy call and find out how we can get your business into the top 3.</p>
                <a
                  href="https://calendly.com/akwmarketing/strategy-call"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-stone-900 hover:bg-stone-100 rounded-full px-8 h-10 font-semibold">
                    Book a Free Strategy Call
                  </Button>
                </a>
              </div>
            </motion.article>
          )}
        </div>
      </div>

      <FooterSection />
    </div>
  );
}