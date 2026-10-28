import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/**
 * A post is published once it has a `publishDate` that is not in the future.
 * Every surface (RSS, catalog API, listings, prerendered routes) must use
 * this so future-dated drafts never leak anywhere.
 */
export function isPublished(post: Post, now = new Date()): boolean {
	return Boolean(post.data.publishDate && post.data.publishDate <= now);
}

/** Published posts, newest first. */
export async function getPublishedPosts(now = new Date()): Promise<Post[]> {
	const posts = await getCollection("posts", (post) => isPublished(post, now));
	return [...posts].sort(
		(a, b) =>
			(b.data.publishDate?.getTime() ?? 0) - (a.data.publishDate?.getTime() ?? 0),
	);
}
