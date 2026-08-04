import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';

export async function GET(context: APIContext) {
	const posts = (await getCollection('posts')).filter(
		(post) => Boolean(post.data.publishDate)
	);
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
