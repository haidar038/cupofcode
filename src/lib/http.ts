/**
 * Shared helpers for the /api endpoints: JSON responses, client IP
 * extraction, and rate limiting.
 */

export function json(data: unknown, status: number): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Cache-Control": "no-store", "Content-Type": "application/json" },
	});
}

export function getClientIp(request: Request): string {
	return (
		request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
		request.headers.get("x-real-ip") ??
		"unknown"
	);
}

interface RateBucket {
	count: number;
	resetAt: number;
}

/**
 * Fixed-window rate limiter. Without Upstash env vars this runs on an
 * in-memory Map — per serverless instance, wiped on cold start (fine for
 * local dev; see docs for the production caveat).
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
	const store = ((globalThis as any).__rateLimitStore ??= new Map<string, RateBucket>()) as Map<
		string,
		RateBucket
	>;
	const now = Date.now();
	const bucket = store.get(key);

	if (!bucket || bucket.resetAt <= now) {
		store.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}
	if (bucket.count >= limit) return false;
	bucket.count += 1;
	return true;
}

const RATE_LIMIT_RE = /^(\d+)\s*\/\s*(min(?:ute)?|hour|jam)$/i;

/**
 * Parse a `NEWSLETTER_RATE_LIMIT` / `CONTACT_RATE_LIMIT` style env value
 * ("1/min", "5/hour", …) into a limit + window. Returns the fallback for
 * unset or unparseable values.
 */
export function parseRateLimit(
	raw: string | undefined,
	fallback: { limit: number; windowMs: number },
): { limit: number; windowMs: number } {
	const match = raw?.match(RATE_LIMIT_RE);
	if (!match) return fallback;
	const limit = Number.parseInt(match[1], 10);
	if (!Number.isFinite(limit) || limit <= 0) return fallback;
	const windowMs = /^h(our)?$/i.test(match[2]) || /^jam$/i.test(match[2]) ? 3_600_000 : 60_000;
	return { limit, windowMs };
}
