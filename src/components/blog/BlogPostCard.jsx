import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function BlogPostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-stone-200/60 hover:shadow-lg transition-all duration-300"
    >
      {post.cover_image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-stone-100">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        {post.category && (
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
            {post.category}
          </span>
        )}
        <h2 className="text-xl font-bold text-stone-900 mb-3 leading-tight group-hover:text-stone-600 transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-stone-500 leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-stone-400">
            {post.published_date && (
              <span>{format(new Date(post.published_date), "MMM d, yyyy")}</span>
            )}
            {post.read_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.read_time_minutes} min read
              </span>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}