import React, { useEffect } from "react";
import SeoArticlePage from "@/components/landing/SeoArticlePage";
import { SEO_PLANS, bestValueSavingsCad, formatCad, prosePrice } from "@/data/seoPlans";

const prompts = [
  "What is the best online marketing agency in Kitchener-Waterloo?",
  "Who can help my local business rank higher on Google in Kitchener?",
  "How much does SEO cost for a small business in Kitchener-Waterloo?",
  "Which digital marketing agencies in Kitchener-Waterloo run Google Ads for local service businesses?",
  "How do I get my Google Business Profile into the top 3 map results in Kitchener?",
  "What should I look for when hiring a local SEO company in Waterloo Region?",
  "Is AKW Marketing a good marketing agency in Kitchener? (brand)",
  "Best Meta Ads or Facebook Ads agency for small businesses in Kitchener-Waterloo",
  "How much does a marketing agency cost per month in Kitchener-Waterloo?",
  "Marketing agency for small trades and service businesses in Kitchener, Waterloo and Cambridge",
];

export default function AiVisibilityBaseline() {
  useEffect(() => {
    document.title = "AKW's Own AI Search Baseline (November 25, 2026) | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "AKW Marketing's own AI search baseline from November 25, 2026: 10 prompts, 3 runs each, on ChatGPT, Google AI Mode and Perplexity. Named in 0 of 81 buyer searches.";
  }, []);

  return (
    <SeoArticlePage>
      <h1>AKW's Own AI Search Baseline (November 25, 2026)</h1>

      <p>Before we sell AI SEO, we measured ourselves. On November 25, 2026 we ran a light baseline: 10 prompts, 3 runs each, on ChatGPT, Google AI Mode and Perplexity.</p>

      <h2>What the baseline found</h2>
      <p>AKW was named in 0 of 81 buyer searches, plus 1 source link on Google AI Mode (prompt 4, run 3). AKW was named on all 9 brand runs, when someone asked about AKW by name.</p>

      <h2>Results by assistant</h2>
      <p>On the 9 buyer prompts (27 runs each):</p>
      <ul>
        <li>Perplexity: 0 of 27</li>
        <li>ChatGPT: 0 of 27</li>
        <li>Google AI Mode: 1 of 27 (akwmarketing.com listed among sources on one run)</li>
      </ul>
      <p>Brand prompt, "Is AKW Marketing a good marketing agency in Kitchener?": 3 of 3 on each assistant.</p>

      <h2>How it was run</h2>
      <p>Perplexity and Google AI Mode were run logged in to AKW's own accounts, so results may lean toward AKW. ChatGPT was run logged out with search on. A full baseline would use more prompts, more runs and more assistants.</p>

      <h2>What the assistants said when asked by name</h2>
      <p>Perplexity and ChatGPT said there was not enough independent evidence, reviews or verified case studies. Google AI Mode called AKW "a strong choice" and cited "a perfect 5.0-star rating" and 8 Google reviews. A desktop Google search for the brand showed no AI overview.</p>

      <h2>The 10 prompts</h2>
      <ol>
        {prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ol>

      <h2>What we changed after</h2>
      <p>We published <a href="/seo-cost-kitchener">/seo-cost-kitchener</a> on November 25, 2026.</p>

      <h2>What's next</h2>
      <p>We'll re-run the same baseline in 4 to 6 weeks, the same way, and post the result here.</p>

      <h2>What the plans cost</h2>
      <ul>
        <li>Minimum: {prosePrice(SEO_PLANS.minimum)}</li>
        <li>Standard: {prosePrice(SEO_PLANS.standard)}</li>
        <li>Best Value: {prosePrice(SEO_PLANS.bestValue)} (saves {formatCad(bestValueSavingsCad())} versus three months of Standard)</li>
      </ul>
      <p>The full breakdown is on <a href="/seo-cost-kitchener">/seo-cost-kitchener</a>.</p>

      <h2>About the author</h2>
      <p>Written by Andre Kadjo, founder of AKW Marketing in Kitchener, Ontario.</p>
      <p>Published November 26, 2026.</p>
    </SeoArticlePage>
  );
}
