import { defineMiddleware } from 'astro:middleware';

const securityHeaders = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
	'X-XSS-Protection': '0',
};

// Ambil origin (scheme://host) dari sebuah URL; null bila invalid.
function originOf(url: string | undefined): string | null {
	if (!url) return null;
	try {
		return new URL(url).origin;
	} catch {
		return null;
	}
}

// Bangun Content-Security-Policy adaptif.
// 'unsafe-inline' pada script-src & style-src DIPERLUKAN karena ada inline script
// (anti-FOUC theme, registrasi SW, GA inline) & style inline/komponen Astro.
// TODO (hardening): migrasi ke nonce/hash untuk menghilangkan 'unsafe-inline' script.
function buildCsp(): string {
	const scriptSrc = new Set(["'self'", "'unsafe-inline'"]);
	const connectSrc = new Set(["'self'", 'https://ingest.sentry.io', 'https://*.sentry.io']);
	const styleSrc = new Set(["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com']);
	const imgSrc = new Set([
		"'self'",
		'data:',
		'blob:',
		'https://images.unsplash.com',
		'https://res.cloudinary.com',
		'https://*.cloudinary.com',
	]);
	const fontSrc = new Set(["'self'", 'data:', 'https://fonts.gstatic.com']);

	// Analytics env-driven (hanya ditambahkan bila dikonfigurasi)
	const plausibleSrc = import.meta.env.PUBLIC_PLAUSIBLE_SRC as string | undefined;
	const plausibleOrigin = originOf(plausibleSrc);
	if (plausibleOrigin) {
		scriptSrc.add(plausibleOrigin);
		connectSrc.add(plausibleOrigin);
	}

	const umamiSrc = import.meta.env.PUBLIC_UMAMI_SRC as string | undefined;
	const umamiOrigin = originOf(umamiSrc);
	if (umamiOrigin) {
		scriptSrc.add(umamiOrigin);
		connectSrc.add(umamiOrigin);
	}

	if (import.meta.env.PUBLIC_GA_ID) {
		scriptSrc.add('https://www.googletagmanager.com');
		connectSrc.add('https://www.google-analytics.com');
		connectSrc.add('https://analytics.google.com');
		imgSrc.add('https://www.google-analytics.com');
	}

	return [
		"default-src 'self'",
		`script-src ${[...scriptSrc].join(' ')}`,
		`style-src ${[...styleSrc].join(' ')}`,
		`font-src ${[...fontSrc].join(' ')}`,
		`img-src ${[...imgSrc].join(' ')}`,
		`connect-src ${[...connectSrc].join(' ')}`,
		"manifest-src 'self'",
		"frame-ancestors 'none'",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		'upgrade-insecure-requests',
	].join('; ');
}

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();

	for (const [key, value] of Object.entries(securityHeaders)) {
		response.headers.set(key, value);
	}

	response.headers.set(
		'Strict-Transport-Security',
		'max-age=63072000; includeSubDomains; preload'
	);

	response.headers.set('Content-Security-Policy', buildCsp());

	if (
		context.url.pathname.startsWith('/keystatic') ||
		context.url.pathname.startsWith('/api/')
	) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}

	return response;
});
