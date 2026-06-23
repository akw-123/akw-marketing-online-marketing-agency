import React from "react";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const content = `
**Industry:** Specialty coffee café
**Location:** Guelph, ON
**Service used:** Google Business Profile optimization (standalone)
**Engagement length:** 8 weeks

## The Challenge
A new Guelph café had opened four months earlier. Their Google Business Profile was barely set up: no photos, one service listed, three reviews. Despite a prime downtown location, foot traffic from Google searches was minimal. The owner was paying for Facebook Ads to drive awareness because organic search wasn't delivering.

## What We Did
- Fully optimized the GBP. Primary category set to "Coffee shop," 18 secondary services added (espresso, pour-over, breakfast pastry, lunch options, oat milk, vegan, etc.).
- Uploaded 47 photos: storefront, interior, menu items, baristas at work. All geotagged to downtown Guelph.
- Set up Google Posts cadence: one post per week (specials, new menu items, events).
- Added a Q&A pre-seed: 8 common questions answered by the owner directly (parking, hours, accessibility, etc.).
- Set up a point-of-sale review-request flow. Every receipt printed the QR-code review link.

## The Results
**Google "Direction requests" 47 per month to 1,247 per month in 8 weeks.**

- Direction requests: 47 to 1,247
- Profile views: 320 per month to 8,400 per month
- Phone calls from GBP: 6 to 89 per month
- Reviews: 3 to 41 (4.9 stars)
- Foot traffic (owner estimate): up 60 to 80% on weekday mornings
- Facebook Ads spend: $1,400 per month to $0. Paused because organic now delivers more.

## Timeline
- Weeks 1 to 2: GBP rebuilt, photos uploaded, Q&A seeded
- Weeks 3 to 4: Direction requests crossed 200 per week
- Weeks 5 to 8: Sustained at 1,200+ per month. Owner paused all paid ad spend.

## What the Owner Says
"I had no idea Google could do that. We didn't change anything physical about the shop. We just made sure Google knew we exist."
Owner, Guelph café (name withheld)
`;

export default function CaseStudyGuelphCafe() {
  return (
    <CaseStudyLayout
      slug="guelph-cafe-gbp"
      title="Guelph Café Case Study, 1,200 Monthly Direction Requests, AKW Marketing"
      metaDescription="A new Guelph café went from invisible to 1,247 monthly direction requests in 8 weeks with just Google Business Profile optimization. Here's how."
      h1="How a Guelph Café Went from Invisible to 1,200 Monthly Direction Requests"
      content={content}
    />
  );
}