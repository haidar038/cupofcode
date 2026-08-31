import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const typeLabels: Record<string, string> = {
  component: "UI Component",
  prompt: "AI Prompt",
  gem: "Custom Gem",
};

/**
 * Catalog feed used by the homepage sidebar filter.
 *
 *   GET /api/catalog?cat=all         → all posts
 *   GET /api/catalog?cat=tutorial    → posts in category "tutorial"
 *   GET /api/catalog?cat=assets      → digital assets (no thumbnails)
 */
export const GET: APIRoute = async ({ url }) => {
  const cat = url.searchParams.get("cat") ?? "all";

  if (cat === "assets") {
    const assets = await getCollection("digitalAssets");
    const items = assets.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      url: `/assets/${a.id}`,
      badge: typeLabels[a.data.type] ?? a.data.type,
      meta: a.data.isFree ? "Gratis" : "Premium",
    }));
    return new Response(
      JSON.stringify({ contentType: "assets", total: items.length, items }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  const [posts, categories] = await Promise.all([
    getCollection("posts"),
    getCollection("categories"),
  ]);

  const labelById = new Map(categories.map((c) => [c.id, c.data.label]));
  const toneById = new Map(categories.map((c) => [c.id, c.data.tone]));

  const filtered =
    cat === "all" ? posts : posts.filter((p) => p.data.category === cat);

  const items = filtered.map((p) => ({
    title: p.data.title,
    description: p.data.description ?? "",
    url: `/posts/${p.id}`,
    badge: labelById.get(p.data.category) ?? "Artikel",
    tone: toneById.get(p.data.category) ?? "yellow",
    image: p.data.featured_image ?? null,
    date: p.data.publishDate
      ? new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(p.data.publishDate)
      : null,
  }));

  return new Response(
    JSON.stringify({ contentType: "posts", total: items.length, items }),
    { headers: { "Content-Type": "application/json" } },
  );
};
