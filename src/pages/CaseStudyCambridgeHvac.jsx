import React from "react";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const content = `
**Industry:** HVAC. Heating, cooling, ductwork.
**Location:** Cambridge, ON
**Service used:** Local SEO, Google Business Profile optimization, reviews, citations
**Engagement length:** 3 months (ongoing)

## The Challenge
A Cambridge HVAC contractor was buried at rank #43 for "HVAC Cambridge" and "furnace repair Cambridge." Their Google Business Profile had 4 reviews, a barely-filled services list, and no recent photos. Average call volume from search: 6 calls per month, most from repeat customers, not new ones. Two newer competitors had locked down the Cambridge map pack.

## What We Did
- Rebuilt the GBP from scratch. Primary category set to "HVAC contractor," 40+ services with custom descriptions, real on-site work photos replacing stock images, business hours corrected, Bookings linked to contact page.
- Added LocalBusiness schema and a NAP block to the homepage, plus a dedicated /cambridge-hvac landing page with 1,500 words of locally relevant content.
- Built 28 high-trust citations (Bing Places, Apple Business Connect, Foursquare, Yelp, plus Cambridge-specific business directories) with identical NAP.
- Set up a post-job review-request flow. Every completed job triggered an email and SMS within 24 hours.
- Launched a small Google Ads campaign on emergency-intent keywords to capture demand while organic ranking improved.

## The Results
**Rank #43 to #2 in the Cambridge map pack. Calls from search 6 per month to 41 per month.**

- Map-pack rank for "HVAC Cambridge": #43 to #2
- Calls from GBP: 6 per month to 41 per month (+583%)
- Google reviews: 4 to 47 (5.0 stars average)
- New customer estimated LTV: $32,000+ per month
- Google Ads cost per qualified lead: dropped 47% over 60 days as organic took the cheap clicks

## Timeline
- Weeks 1 to 3: GBP rebuilt, schema added, citations submitted, review flow live
- Weeks 4 to 6: Map-pack rank crossed into top-10. Reviews hit 18.
- Weeks 7 to 9: Top-5. Calls roughly tripled vs. baseline.
- Weeks 10 to 12: Top-3 sustained. 41 calls per month became the new normal.

## What the Owner Says
"We'd been doing the same Google Ads budget for three years and getting nowhere on local search. Within three months Andre's team had us in the top 3 in Cambridge and the phone hasn't stopped. The reviews keep coming in too. I wish we'd done this years ago."
Owner, Cambridge HVAC contractor (name withheld)
`;

export default function CaseStudyCambridgeHvac() {
  return (
    <CaseStudyLayout
      slug="cambridge-hvac-local-seo"
      title="Cambridge HVAC Case Study, Top 3 on Google in 12 Weeks, AKW Marketing"
      metaDescription="A Cambridge HVAC contractor went from rank #43 to #2 in Google's map pack in 12 weeks. Calls from search jumped from 6 to 41 per month. Here's exactly how."
      h1="How a Cambridge HVAC Company Hit Google's Top 3 in 12 Weeks"
      content={content}
    />
  );
}