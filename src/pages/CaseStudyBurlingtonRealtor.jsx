import React from "react";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const content = `
**Industry:** Residential real estate
**Location:** Burlington, ON
**Service used:** Full-funnel marketing. SEO, GBP, Google Ads, Meta Ads.
**Engagement length:** 6 months (ongoing)

## The Challenge
An independent Burlington real estate agent was averaging 4 to 6 qualified leads per month split across organic, paid, and referrals. They were spending $1,800 per month on Google Ads with no formal tracking and couldn't tell which campaigns produced leads vs. just clicks. SEO rankings for "Burlington real estate agent" sat outside the top 30. The marketing was active but invisible.

## What We Did
- Audited the existing Google Ads account. Paused 11 underperforming campaigns, restructured the remaining four around buyer intent and neighborhood-specific keywords (Roseland, Aldershot, Tyandaga, Brant Hills).
- Built two Meta Ads funnels: top-of-funnel "first-time buyer" content plus retargeting on listing-view audiences.
- Rebuilt the agent's GBP profile and added LocalBusiness schema to their site.
- Created four neighborhood landing pages for Burlington micro-markets. Each hyperlocal, 1,500+ words, with proper internal linking.
- Set up real conversion tracking. Call tracking, form-fill tracking, GA4 events tied to lead value.

## The Results
**Qualified leads 5 per month to 17 per month. Cost per qualified lead dropped 38%.**

- Qualified leads per month: 5 to 17 (+240%)
- Cost per qualified lead: $360 to $223 (-38%)
- GBP map-pack rank for "real estate agent Burlington": outside top-30 to top-5
- Closing ratio on AKW-sourced leads: 14% (vs. 8% on prior lead sources)
- Total ad spend held constant. All gains came from efficiency.

## Timeline
- Months 1 to 2: Ads restructured. Funnel built. Tracking live.
- Months 3 to 4: Lead volume climbed past 10 per month. Cost per lead started dropping.
- Months 5 to 6: Sustained at 17 per month. Neighborhood pages ranking in top-10.

## What the Agent Says
"I was running ads I didn't understand and getting leads I couldn't measure. The first thing Andre did was tell me how much I was actually paying per closed deal, and it was twice what I thought. Six months later I'm spending less and closing more."
Realtor, Burlington (name withheld)
`;

export default function CaseStudyBurlingtonRealtor() {
  return (
    <CaseStudyLayout
      slug="burlington-realtor-full-funnel"
      title="Burlington Real Estate Case Study, Tripled Leads in 6 Months, AKW Marketing"
      metaDescription="A Burlington real estate agent tripled qualified leads and cut cost-per-lead by 38% in 6 months with a full-funnel rebuild. SEO, GBP, Google Ads, Meta Ads."
      h1="How a Burlington Real Estate Agent Tripled Qualified Leads in 6 Months"
      content={content}
    />
  );
}