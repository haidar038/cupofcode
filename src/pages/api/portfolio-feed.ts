import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL } from "../../consts";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 10;

export const GET: APIRoute = async ({ url }) => {
  const rawLimit = url.searchParams.get("limit");
  const requestedLimit =
    rawLimit === null ? DEFAULT_LIMIT : Number.parseInt(rawLimit, 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;
  const now = new Date();

  const [posts, categories] = await Promise.all([
    getCollection("posts", ({ data }) =>
      Boolean(data.publishDate && data.publishDate <= now),
    ),
    getCollection("categories"),
  ]);

  const categoryLabels = new Map(
    categories.map((category) => [category.id, category.data.label]),
  );

  const items = [...posts]
    .sort(
      (a, b) =>
        (b.data.publishDate?.getTime() ?? 0) -
        (a.data.publishDate?.getTime() ?? 0),
    )
    .slice(0, limit)
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description ?? "",
      category: post.data.category,
      categoryLabel: categoryLabels.get(post.data.category) ?? "Artikel",
      image: post.data.featured_image ?? null,
      publishedAt: post.data.publishDate?.toISOString() ?? null,
      url: new URL(`/posts/${post.id}`, SITE_URL).toString(),
    }));

  return new Response(
    JSON.stringify({
      version: 1,
      source: { name: "Cup of Code", url: SITE_URL },
      items,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control":
          "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
};
