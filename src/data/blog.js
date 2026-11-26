import catalog from "./blog-posts.json";

const posts = Array.isArray(catalog.posts) ? catalog.posts : [];

function byNewest(a, b) {
  return String(b.published_date || "").localeCompare(String(a.published_date || ""));
}

/** Published posts shipped with this build. Listing matches the live limit of 50. */
export function listPublishedPosts(limit = 50) {
  return posts
    .filter((post) => post && post.published === true && post.slug)
    .sort(byNewest)
    .slice(0, limit);
}

export function getPublishedPost(slug) {
  return posts.find((post) => post && post.published === true && post.slug === slug) || null;
}

export function relatedPosts(post, limit = 3) {
  if (!post) return [];
  const others = posts
    .filter((item) => item && item.published === true && item.id !== post.id && item.slug)
    .sort(byNewest);
  const sameCategory = post.category
    ? others.filter((item) => item.category === post.category)
    : [];
  const rest = others.filter((item) => !sameCategory.some((match) => match.id === item.id));
  return [...sameCategory, ...rest].slice(0, limit);
}

export const blogCatalog = {
  fetchedAt: catalog.fetchedAt || null,
  unavailableReason: catalog.unavailableReason || null,
  count: posts.length,
};
