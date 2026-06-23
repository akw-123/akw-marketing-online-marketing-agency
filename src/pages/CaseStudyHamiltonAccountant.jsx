import React from "react";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const content = `
**Industry:** Small business accounting and bookkeeping
**Location:** Hamilton, ON
**Service used:** Google Ads management, landing page optimization, conversion tracking
**Engagement length:** 5 months (ongoing)

## The Challenge
A Hamilton CPA firm was spending $4,200 per month on Google Ads and getting nine qualified leads. That's $467 per qualified lead, high enough that their owner was about to cut paid spend entirely. The campaigns targeted generic high-volume terms ("Hamilton accountant"). The landing page receiving ad clicks was the homepage, not a campaign-specific page.

## What We Did
- Pulled 90 days of Google Ads data, identified the six keywords producing 80% of cost with 30% of conversions, paused them.
- Rebuilt the campaign structure: one ad group per service (corporate tax filing, year-end, monthly bookkeeping, CRA audit support, etc.) with service-specific ad copy.
- Built five dedicated landing pages, one per ad group. Each with the service explained, pricing transparency, social proof, and a streamlined contact form.
- Added proper conversion tracking for each lead source so future optimization had real attribution.
- Expanded the negative keyword list from 12 to 380 to stop wasted clicks on irrelevant searches.

## The Results
**Cost per qualified lead: $467 to $215 (-54%). Qualified leads: 9 per month to 24 per month.**

- Cost per qualified lead: $467 to $215
- Qualified leads per month: 9 to 24 (+167%)
- Wasted ad spend (irrelevant clicks): cut by 41% via expanded negatives
- Landing page conversion rate: 1.8% to 6.4%
- Total monthly ad spend held constant. Efficiency gains absorbed into more leads.

## Timeline
- Month 1: Account audited. Underperformers paused. Landing pages built.
- Month 2: New structure live. Cost per lead dropped to $310.
- Month 3: Conversion rate doubled. Lead count hit 18.
- Months 4 to 5: Sustained at $215 cost per qualified lead and 24 leads per month.

## What the Firm Says
"We were about to give up on Google Ads entirely. AKW didn't just optimize the campaigns, they rebuilt the entire funnel from keyword to landing page. We're getting more clients at half the cost."
Partner, Hamilton accounting firm (name withheld)
`;

export default function CaseStudyHamiltonAccountant() {
  return (
    <CaseStudyLayout
      slug="hamilton-accountant-google-ads"
      title="Hamilton Accountant Case Study, Cost-Per-Lead Cut 54% on Google Ads, AKW Marketing"
      metaDescription="A Hamilton accounting firm cut their cost per qualified lead by 54% and grew qualified leads from 9 to 24 per month. Same ad budget, better funnel."
      h1="How a Hamilton Accounting Firm Cut Cost-Per-Lead 54% on Google Ads"
      content={content}
    />
  );
}