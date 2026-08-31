import { defineMiddleware } from 'astro:middleware';

/**
 * Catatan: Di Vercel, security headers (HSTS, X-Frame-Options, CSP, dll.)
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
