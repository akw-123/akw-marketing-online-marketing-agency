import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BASE_URL = 'https://www.akwmarketing.com'; // v2
const TODAY = new Date().toISOString().split('T')[0];

const STATIC_URLS = [
  { loc: '/',               priority: '1.0', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/gbp',            priority: '1.0', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/kitchener',      priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/waterloo',       priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/cambridge',      priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/guelph',         priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/hamilton',       priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/burlington',     priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/brantford',      priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/stratford',      priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/local-seo-kitchener',        priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/seo-services-kitchener',     priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/google-ads-kitchener',       priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/meta-ads-kitchener',         priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/website-design-kitchener',   priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/content-marketing-kitchener',priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/hardest-working-seo-expert-kitchener-waterloo',       priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/hardest-working-marketing-agency-kitchener-waterloo',  priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/about',          priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/blog',           priority: '0.8', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/free-analysis',  priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/get-more-clients', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/newsletter',     priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/PrivacyPolicy',  priority: '0.3', changefreq: 'yearly',  lastmod: TODAY },
  { loc: '/TermsOfService', priority: '0.3', changefreq: 'yearly',  lastmod: TODAY },
];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Fetch all published blog posts (no limit)
  const posts = await base44.asServiceRole.entities.BlogPost.filter({ published: true }, 'published_date', 500);

  const urlEntries = [
    ...STATIC_URLS.map(({ loc, priority, changefreq, lastmod }) => `
  <url>
    <loc>${BASE_URL}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`),
    ...posts.map((post) => `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.published_date || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});