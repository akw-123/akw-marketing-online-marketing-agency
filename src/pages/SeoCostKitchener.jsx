import React, { useEffect } from "react";
import SeoArticlePage from "@/components/landing/SeoArticlePage";
import {
  SEO_PLANS,
  bestValueSavingsCad,
  formatCad,
  prosePrice,
  tablePrice,
  threeMonthsOfStandardCad,
} from "@/data/seoPlans";

const faqs = [
  {
    q: "How much does SEO cost for a small business in Kitchener-Waterloo?",
    a: "With AKW Marketing, local SEO costs CA$500 a month (Minimum), CA$599 a month (Standard), or CA$999 a quarter (Best Value). Prices are in Canadian dollars. Monthly plans have a 3 month commitment and can be cancelled monthly after that.",
  },
  {
    q: "What do I get at each price?",
    a: "Every plan includes a full competitor analysis, updates every two weeks, ranking work on your main search term and high quality backlinks. Standard and Best Value add full website optimization and the money-back guarantee. Minimum has limited website optimization and no guarantee.",
  },
  {
    q: "What is the guarantee?",
    a: "On Standard and Best Value, your main search term is guaranteed to reach the top 3 on Google within 90 days, or you don't pay.",
  },
  {
    q: "Is there a long contract?",
    a: "No. Standard and Minimum have a 3 month commitment, then you can cancel monthly. Best Value is billed every 3 months and can be cancelled at each 3 month mark.",
  },
  {
    q: "What changes the price?",
    a: "How competitive your search term is, how much work your website needs, and how many locations you serve. The three plans cover most local businesses in Kitchener, Waterloo and Cambridge. If you are unsure which fits, book a call.",
  },
  {
    q: "Is this for every kind of business?",
    a: "It is built for local businesses that serve customers in Kitchener-Waterloo and nearby cities, such as trades, home services, clinics, professional services and shops. It is not built for businesses that need to rank nationally.",
  },
  {
    q: "How do I get started?",
    a: "Book a free local SEO analysis at akwmarketing.com/free-analysis, or call 437-475-0076.",
  },
];

export default function SeoCostKitchener() {
  useEffect(() => {
    document.title = "SEO Cost in Kitchener-Waterloo: Real Prices | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `What local SEO costs in Kitchener-Waterloo: ${formatCad(SEO_PLANS.minimum.amount)} to ${formatCad(SEO_PLANS.standard.amount)} a month, or ${formatCad(SEO_PLANS.bestValue.amount)} a quarter. What is included, what changes the price, and the 90 day guarantee.`;

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "faq-ld";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
    document.head.appendChild(ld);
    return () => { const el = document.getElementById("faq-ld"); if (el) el.remove(); };
  }, []);

  return (
    <SeoArticlePage>
      <h1>How much does SEO cost in Kitchener-Waterloo?</h1>

      <p><strong>Short answer:</strong> local SEO with AKW Marketing costs {prosePrice(SEO_PLANS.minimum)}, {prosePrice(SEO_PLANS.standard)}, or {prosePrice(SEO_PLANS.bestValue)}, depending on the plan. The {formatCad(SEO_PLANS.standard.amount)} Standard plan and the {formatCad(SEO_PLANS.bestValue.amount)} quarterly plan come with a guarantee: your main search term reaches the top 3 on Google within 90 days, or you don't pay.</p>

      <p>AKW Marketing is a local SEO agency in Kitchener, Ontario. We work with businesses in Kitchener, Waterloo and Cambridge. Here is what each plan includes and what changes the price.</p>

      <h2>SEO prices by plan</h2>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm text-left text-stone-700 border-collapse">
          <thead>
            <tr className="border-b border-stone-300 text-stone-900">
              <th className="py-3 pr-4 font-semibold">Plan</th>
              <th className="py-3 pr-4 font-semibold">Price (CAD)</th>
              <th className="py-3 pr-4 font-semibold">Commitment</th>
              <th className="py-3 pr-4 font-semibold">Guarantee</th>
              <th className="py-3 font-semibold">Website work</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-stone-200">
              <td className="py-3 pr-4">Minimum</td>
              <td className="py-3 pr-4">{tablePrice(SEO_PLANS.minimum)}</td>
              <td className="py-3 pr-4">3 months, then cancel monthly</td>
              <td className="py-3 pr-4">None. Goal: first page of Google within 90 days</td>
              <td className="py-3">Limited optimization</td>
            </tr>
            <tr className="border-b border-stone-200">
              <td className="py-3 pr-4">Standard (most popular)</td>
              <td className="py-3 pr-4">{tablePrice(SEO_PLANS.standard)}</td>
              <td className="py-3 pr-4">3 months, then cancel monthly</td>
              <td className="py-3 pr-4">Top 3 on Google within 90 days, or you don't pay</td>
              <td className="py-3">Full optimization</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Best Value</td>
              <td className="py-3 pr-4">{tablePrice(SEO_PLANS.bestValue)}</td>
              <td className="py-3 pr-4">Cancel every 3 months</td>
              <td className="py-3 pr-4">Top 3 on Google within 90 days, or you don't pay</td>
              <td className="py-3">Full optimization</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Paying quarterly on Best Value costs {formatCad(SEO_PLANS.bestValue.amount)} for three months. Three months of Standard costs {formatCad(threeMonthsOfStandardCad())}, so you save {formatCad(bestValueSavingsCad())}.</p>

      <h2>What every plan includes</h2>
      <ul>
        <li>A full competitor analysis of who is ranking for your main search term in Kitchener-Waterloo</li>
        <li>An update every two weeks on what was done and where you rank</li>
        <li>Ranking work on your main search term, for example "plumber Kitchener"</li>
        <li>High quality backlinks</li>
      </ul>

      <h2>What changes the price</h2>
      <ul>
        <li><strong>How competitive your search term is.</strong> "Dentist Kitchener" is harder than a narrow service in a small area.</li>
        <li><strong>How much work your website needs.</strong> Full website optimization is included on Standard and Best Value. Minimum covers limited changes.</li>
        <li><strong>How many places you serve.</strong> Kitchener, Waterloo and Cambridge are the core. Other Ontario cities are quoted on a call.</li>
      </ul>

      <h2>Who this is for, and who it is not for</h2>
      <p>This is for local businesses that win customers in Kitchener-Waterloo and nearby: trades, home services, clinics, professional services and shops. It is not for businesses that need to rank across Canada, because national SEO is a different job with a different price.</p>

      <h2>Frequently asked questions</h2>
      {faqs.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}

      <h2>About the author</h2>
      <p>Written by Andre Kadjo, founder of AKW Marketing in Kitchener, Ontario. AKW Marketing runs local SEO, Google Ads and Meta Ads for businesses in Kitchener, Waterloo and Cambridge.</p>

      <h2>Get a price for your business</h2>
      <p>Book a free local SEO analysis at <a href="/free-analysis">/free-analysis</a> or call <a href="tel:+14374750076">437-475-0076</a>. Related: <a href="/seo-services-kitchener">SEO services in Kitchener</a> and <a href="/local-seo-kitchener">local SEO in Kitchener</a>.</p>
    </SeoArticlePage>
  );
}
