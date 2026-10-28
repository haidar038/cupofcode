import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';
import { getPublishedPosts } from '../lib/content';

export async function GET(context: APIContext) {
	const posts = await getPublishedPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site || SITE_URL,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.publishDate as Date,
			description: post.data.description || '',
			link: `/posts/${post.id}/`,
		})),
		customData: `<language>id-id</language>`,
	});
}
