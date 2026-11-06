import React, { useEffect } from "react";
import SeoArticlePage from "@/components/landing/SeoArticlePage";
import { upsertJsonLd } from "@/lib/upsertJsonLd";

export default function About() {
  useEffect(() => {
    document.title = "About AKW Marketing | Kitchener Digital Marketing Agency Founded by Andre Kadjo";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "AKW Marketing is a digital marketing agency in Kitchener, Ontario, founded by Andre Kadjo. On-demand marketing department for local businesses. Free analysis available.";

    const schema = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About AKW Marketing",
      "url": "https://akwmarketing.com/about",
      "mainEntity": {
        "@type": "ProfessionalService",
        "name": "AKW Marketing",
        "founder": {
          "@type": "Person",
          "name": "Andre Kadjo",
          "jobTitle": "Founder",
          "worksFor": { "@type": "Organization", "name": "AKW Marketing" }
        },
        "url": "https://akwmarketing.com",
        "areaServed": [
          {"@type":"City","name":"Kitchener","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
          {"@type":"City","name":"Waterloo","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
          {"@type":"City","name":"Cambridge","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
          {"@type":"City","name":"Guelph","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
          {"@type":"City","name":"Hamilton","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
          {"@type":"City","name":"Burlington","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
          {"@type":"City","name":"Brantford","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}},
          {"@type":"City","name":"Stratford","containedInPlace":{"@type":"AdministrativeArea","name":"Ontario"}}
        ]
      }
    };
    upsertJsonLd("about-page-schema", schema);
    return () => { const el = document.getElementById('about-page-schema'); if (el) el.remove(); };
  }, []);

  return (
    <SeoArticlePage>
      <h1>About AKW Marketing</h1>

      <p>AKW Marketing is a digital marketing agency based in Kitchener, Ontario, founded by Andre Kadjo. We help local businesses across Kitchener-Waterloo, Cambridge, Guelph, Hamilton, Burlington, Brantford, and Stratford show up on Google, attract better leads, and build the kind of online presence that compounds over time.</p>

      <p>We work as your on-demand marketing department. That means you get senior-level SEO, Google Ads, Meta Ads, and content work without hiring a full-time marketer or paying agency overhead. The result: measurable ranking gains, better inbound leads, and a marketing operation that actually gets executed instead of sitting in a plan.</p>

      <h2>Why AKW exists</h2>

      <p>Every local business owner in Kitchener-Waterloo has heard some version of the same story: hire an agency, pay the retainer, wait six months, see nothing move, cancel the contract. The pattern repeats because most agencies are built for scale, not for outcomes. They optimize for keeping many clients on retainer, not for actually getting each one into the top three on Google.</p>

      <p>AKW was built to break that pattern. We work with a small number of businesses at any given time, we deliver work weekly (not monthly), and we measure ourselves against real ranking movement and real revenue lift, not vanity metrics. If you don't move, we tell you. If you do move, we double down on what worked.</p>

      <h2>What we do</h2>

      <p>Every AKW engagement builds on the same core capabilities:</p>

      <ul>
        <li><strong>Local SEO.</strong> Our signature service. Google Business Profile optimization, on-page rebuilding, citation work, review acquisition, and the weekly maintenance that moves local rankings. The full playbook is on the <a href="/kitchener">Kitchener page</a>, and the <a href="/">AKW Marketing homepage</a> has the overview.</li>
        <li><strong>Google Ads and Meta Ads.</strong> Paid traffic that pays for itself. We build campaigns targeted to your city, write ad copy that speaks to your buyer's actual research question, and report cost per lead every month. See <a href="/google-ads-kitchener">Google Ads Kitchener</a> and <a href="/meta-ads-kitchener">Meta Ads Kitchener</a>.</li>
        <li><strong>Content and SEO copywriting.</strong> Blog clusters, service pages, and landing pages built for both search engines and buyers. Structured for topical authority, not keyword stuffing.</li>
        <li><strong>Website conversion optimization.</strong> Traffic without conversion is a waste. We audit and rebuild landing pages, forms, and CTAs so that a higher share of your visitors becomes actual inquiries.</li>
        <li><strong>Marketing automation.</strong> Once leads are coming in, we help you set up the follow-up sequences, CRM workflows, and reporting dashboards that turn one-off inquiries into repeat customers.</li>
      </ul>

      <h2>The Local SEO Top 3 Ranking Playbook</h2>

      <p>Behind every local-SEO engagement sits our internal Top 3 Ranking Playbook — a structured methodology developed and refined across five active client engagements. It runs through eight phases: baseline audit, keyword and rank-target selection, Google Business Profile optimization, on-page rebuilding, technical foundation, citations and off-page signals, ongoing weekly maintenance, and reporting.</p>

      <p>What makes it different from a generic SEO checklist is the emphasis on execution cadence. Ranking in the top three of Google is not a one-time project; it's a weekly discipline. Our runners fire weekly, our reports land weekly, and our clients see progress notes weekly. That rhythm is what compounds over 90-day, 6-month, and 12-month horizons.</p>

      <h2>Who we work with</h2>

      <p>AKW is a good fit for local service businesses in Southern Ontario that want to compete for the top three organic and map-pack positions on Google. Typical clients include insurance brokers, immigration consultants, wedding photographers, professional services firms, home services, and e-commerce brands with a Canadian audience.</p>

      <p>We are not a good fit for national brands with in-house SEO teams, for businesses looking for a one-week fix, or for buyers who see marketing as a cost to minimize rather than a lever to grow. If you want real ranking movement over 3 to 12 months and are willing to invest in the weekly work that gets you there, we can help.</p>

      <h2>Why Kitchener</h2>

      <p>Kitchener-Waterloo is one of Canada's most under-served local markets. The region has a technology hub reputation (Communitech, Waterloo tech corridor, University of Waterloo research spinouts), a strong small-business base along King Street and beyond, and buyer intent that ranks with any major city. But most of the local SEO work in KW is either done by out-of-town agencies with no local knowledge or by generalist marketers who treat SEO as a side service.</p>

      <p>We built AKW here because Kitchener deserves an agency that understands its neighbourhoods, its business rhythms, and its buyer psychology, and that shows up every week to move rankings that matter. From Kitchener we serve Waterloo, Cambridge, Guelph, Stratford, Brantford, Hamilton, and Burlington — the full corridor.</p>

      <h2>How to work with us</h2>

      <p>Every engagement starts the same way: a free local marketing analysis. We audit your website, your Google Business Profile, your competitors, and your quick-win opportunities, then walk you through the findings on a 30-minute call. No obligation, no pressure. If it makes sense to work together, we scope the engagement from there. If not, you leave with a written diagnostic you can use with any agency you choose.</p>

      <p>Book your free analysis at <a href="/free-analysis">akwmarketing.com/free-analysis</a>, or reach out directly to Andre at <a href="mailto:contact@akwmarketing.com">contact@akwmarketing.com</a>.</p>

      <h2>Contact</h2>

      <p><strong>AKW Marketing</strong><br />
      Kitchener, Ontario<br />
      Serving Kitchener-Waterloo, Cambridge, Guelph, Hamilton, Burlington, Brantford, and Stratford<br />
      <a href="mailto:contact@akwmarketing.com">contact@akwmarketing.com</a> · +1 437-475-0076</p>
    </SeoArticlePage>
  );
}
