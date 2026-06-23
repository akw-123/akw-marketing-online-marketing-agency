import React from "react";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const content = `
**Industry:** General and cosmetic dentistry
**Location:** Waterloo, ON
**Service used:** Review management, GBP optimization
**Engagement length:** 4 months

## The Challenge
A multi-chair Waterloo dental practice had been operating for 11 years with only 8 Google reviews. Their direct competitor a block away had 142. New patients who searched "dentist Waterloo" rarely chose them because the review gap was the deciding factor. New patient calls from search were stuck at 4 to 6 per month.

## What We Did
- Audited the GBP. Corrected the primary category to "Dentist," added 35+ services including cosmetic procedures with custom descriptions, replaced generic photos with real practice imagery.
- Designed a post-visit review-request flow. Every patient who completed a procedure received a personal SMS and email within 24 hours of their appointment with the direct GBP review link.
- Trained the front-desk team on a 30-second verbal review ask at checkout, turning every satisfied patient into a soft ambassador.
- Set up a weekly tracking dashboard the practice could check to see which providers generated reviews and which didn't.
- Created review-response templates so the practice owner could reply to every review (positive or negative) within 48 hours.

## The Results
**8 reviews to 64 reviews in 4 months. 4.9 stars sustained.**

- Google reviews: 8 to 64 (+700%)
- Map-pack rank for "dentist Waterloo": #14 to #4
- New patient calls from GBP: 5 per month to 31 per month
- Response rate on reviews: 0% to 100%
- Cancellation rate on first-time appointments: dropped 18% (social proof effect)

## Timeline
- Month 1: GBP rebuilt, request flow live. Reviews grew 8 to 19.
- Month 2: Reviews 19 to 34. Map-pack rank entered top-10.
- Month 3: Reviews 34 to 51. New patient calls doubled.
- Month 4: Reviews 51 to 64. Top-5 map pack sustained.

## What the Practice Says
"We'd been asking for reviews for years and getting nowhere. Andre's team gave us a system the whole team could follow. The reviews started coming in within a week and they haven't stopped, and the new patient calls followed."
Practice Owner, Waterloo dental practice (name withheld)
`;

export default function CaseStudyWaterlooDental() {
  return (
    <CaseStudyLayout
      slug="waterloo-dental-reviews"
      title="Waterloo Dental Case Study, 8 Reviews to 64 in 4 Months, AKW Marketing"
      metaDescription="A Waterloo dental practice grew from 8 to 64 Google reviews in 4 months and tripled new-patient calls. The exact review-request system we used."
      h1="How a Waterloo Dental Practice Went from 8 Reviews to 64 in 4 Months"
      content={content}
    />
  );
}