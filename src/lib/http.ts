/**
 * Shared helpers for the /api endpoints: JSON responses, client IP
 * extraction, and rate limiting.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */

const UPSTASH_URL = import.meta.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = import.meta.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
function getRedis(): Redis | null {
	if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
	redis ??= new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });
	return redis;
}

interface RateBucket {
	count: number;
	resetAt: number;
}

/**
 * In-memory fallback: per serverless instance, wiped on cold start. Fine for
 * local dev; not an effective limit in production (that's Upstash's job).
 */
function memoryRateLimit(key: string, limit: number, windowMs: number): boolean {
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

/**
 * Fixed-window rate limiter keyed per endpoint + IP ("newsletter:1.2.3.4").
 * With `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` set, buckets live
 * in Redis so the limit holds across serverless instances and cold starts.
 * Falls back to the in-memory Map when Upstash is not configured — and on
 * transient Upstash errors, so an outage never bricks the forms.
 */
export async function rateLimit(
	key: string,
	limit: number,
	windowMs: number,
): Promise<boolean> {
	const r = getRedis();
	if (!r) return memoryRateLimit(key, limit, windowMs);

	try {
		const limiter = new Ratelimit({
			redis: r,
			// Upstash duration tokens are seconds-resolution ("10 s").
			limiter: Ratelimit.slidingWindow(limit, `${Math.max(1, Math.ceil(windowMs / 1000))} s`),
			prefix: "coc:rl",
		});
		const { success } = await limiter.limit(key);
		return success;
	} catch (err) {
		console.error("[RateLimit] Upstash error, falling back to in-memory:", err);
		return memoryRateLimit(key, limit, windowMs);
	}
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
