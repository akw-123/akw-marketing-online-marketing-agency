import catalog from "../src/data/blog-posts.json";
import { legacyBlogPostPath } from "../src/lib/legacyBlogPost.js";

/**
 * /BlogPost only. A second blogpost.js file collides with this one in the
 * Pages functions bundler, so the lowercase path is a _redirects rule.
 *
 * Cloudflare Pages _redirects cannot match a query string. This function
 * reads ?slug=. A published slug 301s to /blog/<slug>. No slug 301s to /blog.
 * Anything else falls through so Pages serves 404.html with status 404.
 *
 * No link, route, or sitemap entry in this repo used /BlogPost?slug=.
 * Blog posts have been /blog/:slug since BlogPost.jsx was added. The
 * component name and the BlogPost.slug field are the evidence for this path.
 */
function isPublishedSlug(slug) {
  return catalog.posts.some((post) => post && post.published === true && post.slug === slug);
}

export function onRequest(context) {
  const slug = new URL(context.request.url).searchParams.get("slug");
  const target = legacyBlogPostPath(slug, isPublishedSlug);
  if (!target) return context.next();
  return Response.redirect(new URL(target, context.request.url), 301);
}
