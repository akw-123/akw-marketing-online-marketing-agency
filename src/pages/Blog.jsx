import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogPostCard from "@/components/blog/BlogPostCard";
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

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BlogPost.filter({ published: true }, "-published_date", 50)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <BlogNavbar />

      {/* Hero */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-stone-400 border border-stone-300 rounded-full px-4 py-1.5 mb-8">
              Blog
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-stone-900 leading-[1.05] mb-6">
              The Blog To Get<br />More Customers.
            </h1>
            <p className="text-lg text-stone-500 max-w-xl leading-relaxed">
              Simple marketing tactics that actually work for local businesses. No fluff, no theory — just proven strategies you can use this week to bring more customers through your door.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-200/60 animate-pulse">
                  <div className="aspect-[16/9] bg-stone-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-stone-200 rounded w-1/4" />
                    <div className="h-5 bg-stone-200 rounded w-3/4" />
                    <div className="h-4 bg-stone-200 rounded w-full" />
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-stone-400 text-lg">No posts yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <BlogPostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FooterSection />
    </div>
  );
}