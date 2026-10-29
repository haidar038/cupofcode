import { defineMiddleware } from 'astro:middleware';

/**
 * Catatan: Di Vercel, security headers (CSP-lite, HSTS, X-Frame-Options, dll.)
 * diset via `vercel.json` agar menjangkau SEMUA response — termasuk
 * halaman prerendered. Middleware Astro ini hanya jalan untuk route
 * SSR, jadi tidak bisa menjadi sumber tunggal.
 *
 * Middleware ini dipertahankan untuk:
 * 1. Set `X-Robots-Tag: noindex, nofollow` di `/keystatic` & `/api/*`
 *    (meskipun Vercel `vercel.json` juga handle ini, ini jadi backup).
 * 2. Menambah header debug `x-astro-mw` saat dev untuk verifikasi.
 */

export const onRequest = defineMiddleware(async (context, next) => {
	// 301 legacy filter URL `/posts?cat=X` ke route kategori bersih
	// `/posts/X` (footer & filter pill sudah memakai URL bersih; redirect ini
	// menyatukan sinyal untuk tautan lama). Kategori tak dikenal akan mendarat
	// di 404 lewat route kategori.
	if (context.url.pathname === '/posts' || context.url.pathname === '/posts/') {
		const cat = context.url.searchParams.get('cat');
		if (cat) {
			const destination = cat === 'aset-digital' ? '/assets' : `/posts/${cat}`;
			return new Response(null, {
				status: 301,
				headers: { Location: new URL(destination, context.url).href },
			});
		}
	}

	const response = await next();

	if (
		context.url.pathname.startsWith('/keystatic') ||
		context.url.pathname.startsWith('/api/')
	) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}

	if (import.meta.env.DEV) {
		response.headers.set('x-astro-mw', '1');
	}

	return response;
});
