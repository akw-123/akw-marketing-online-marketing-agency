import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
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
        <a href="https://akwmarketing.com/landing">
          <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium">
            Sign Up
          </Button>
        </a>
      </div>
    </nav>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    base44.entities.BlogPost.filter({ slug, published: true })
      .then(async (results) => {
        if (results.length === 0) { setNotFound(true); return; }
        const p = results[0];
        setPost(p);
        document.title = `${p.title} | AKW Marketing`;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
        meta.content = p.excerpt
          ? p.excerpt
          : `AKW Marketing is the online marketing agency in the Kitchener-Waterloo area that helps local businesses rank higher on Google. ${p.title}`;

        // Try same-category first, fall back to most recent
        let related = [];
        if (p.category) {
          const byCat = await base44.entities.BlogPost.filter({ category: p.category, published: true }, '-published_date', 10);
          related = byCat.filter(r => r.id !== p.id).slice(0, 3);
        }
        if (related.length < 3) {
          const recent = await base44.entities.BlogPost.filter({ published: true }, '-published_date', 10);
          const extra = recent.filter(r => r.id !== p.id && !related.find(x => x.id === r.id));
          related = [...related, ...extra].slice(0, 3);
        }
        setRelatedPosts(related);
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

              {/* Related Section */}
              <div className="mt-16 pt-10 border-t border-stone-200">
                <h2 className="text-xl font-bold text-stone-900 mb-8">Related from AKW Marketing</h2>

                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-4">More on this topic</h3>
                <ul className="space-y-3 mb-10">
                  {relatedPosts.map((rp) => (
                    <li key={rp.id}>
                      <Link to={`/blog/${rp.slug}`} className="text-sm font-medium text-stone-900 hover:underline underline-offset-2">
                        {rp.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-4">Ready to start?</h3>
                <ul className="space-y-3 mb-10">
                  <li><Link to="/free-analysis" className="text-sm font-medium text-stone-900 hover:underline underline-offset-2">Request a free analysis</Link></li>
                  <li><Link to="/kitchener" className="text-sm font-medium text-stone-900 hover:underline underline-offset-2">See our Kitchener-Waterloo SEO services</Link></li>
                  <li><Link to="/blog" className="text-sm font-medium text-stone-900 hover:underline underline-offset-2">Read more from our blog</Link></li>
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-10 py-12 text-center border-t border-stone-200">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-stone-500 border border-stone-300 rounded-full px-4 py-1.5 mb-6">
                  Free stuff
                </span>
                <h3 className="text-3xl font-black text-stone-900 mb-4">3 Tips to Rank Higher on Google</h3>
                <p className="text-stone-500 max-w-lg mx-auto mb-2">
                  Get a free video showing you the first three things we do when we start working with a local business to get them ranking in the top 3.
                </p>
                <p className="text-stone-500 mb-2">No technical know-how needed.</p>
                <p className="text-stone-500 mb-8">Enter your email and you'll get instant access.</p>
                <a
                  href="https://calendly.com/akwmarketing/strategy-call"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8 h-12 text-base font-semibold">
                    Book a Free Strategy Call →
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