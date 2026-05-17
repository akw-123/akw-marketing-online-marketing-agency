import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BASE_URL = 'https://akwmarketing.com'; // v2

const STATIC_URLS = [
  { loc: '/Landing',        priority: '1.0', changefreq: 'weekly'  },
  { loc: '/Home',           priority: '0.9', changefreq: 'weekly'  },
  { loc: '/gbp',            priority: '1.0', changefreq: 'weekly'  },
  { loc: '/kitchener',      priority: '0.9', changefreq: 'weekly'  },
  { loc: '/newsletter',     priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog',           priority: '0.8', changefreq: 'weekly'  },
  { loc: '/PrivacyPolicy',  priority: '0.3', changefreq: 'yearly'  },
  { loc: '/TermsOfService', priority: '0.3', changefreq: 'yearly'  },
];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Fetch all published blog posts
  const posts = await base44.asServiceRole.entities.BlogPost.filter({ published: true });

  const urlEntries = [
    ...STATIC_URLS.map(({ loc, priority, changefreq }) => `
  <url>
    <loc>${BASE_URL}${loc}</loc>
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