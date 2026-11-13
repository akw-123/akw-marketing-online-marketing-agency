/**
 * /BlogPost?slug= target.
 *
 * BlogPost.jsx has used the path param /blog/:slug since it was added
 * (commit 468f7dd). Nothing in the repo links to /BlogPost?slug=.
 * The page component is still named BlogPost, and each post has a slug,
 * so a request that does use that query is sent at the matching post.
 *
 * @param {string | null | undefined} slug
 * @param {(slug: string) => boolean} isPublishedSlug
 * @returns {string | null} A site path, or null when the request should 404.
 */
export function legacyBlogPostPath(slug, isPublishedSlug) {
  if (slug == null || String(slug).trim() === "") return "/blog";
  const trimmed = String(slug).trim();
  if (!/^[a-z0-9-]+$/.test(trimmed)) return null;
  if (!isPublishedSlug(trimmed)) return null;
  return `/blog/${trimmed}`;
}
