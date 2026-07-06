import React from "react";
import { Link } from "react-router-dom";

const INSIGHTS = [
  { title: "Why Bother Ranking in the Top 3 on Google?", slug: "why-bother" },
  { title: "The Google Ruse: Why Customers Can't Find You", slug: "the-google-ruse" },
  { title: "Quick Way to Get Higher in Google", slug: "quick-way-to-get-higher-in-google" },
  { title: "How to Rank Higher in Google Tomorrow", slug: "how-to-rank-higher-in-google-tomorrow" },
  { title: "Easy Wins: Why Local Businesses Have a Hidden Edge", slug: "easy-wins" },
];

export default function ExploreInsights() {
  return (
    <section className="px-6 pt-14 pb-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-6">
          Explore our insights
        </h2>
        <ul className="space-y-1">
          {INSIGHTS.map((item) => (
            <li key={item.slug}>
              <Link
                to={`/blog/${item.slug}`}
                className="block py-2 text-lg font-medium text-stone-900 underline underline-offset-4 hover:text-stone-600 transition-colors"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}