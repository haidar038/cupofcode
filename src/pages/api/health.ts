/**
 * Health check endpoint for uptime monitoring (e.g. UptimeRobot).
 * Lightweight — no external dependencies, no DB, no Sentry.
 * Excluded from sitemap via `filter()` normalization in astro.config.mjs.
 *
 * @route GET /api/health
 */

const BOOT_TIME = Date.now();
const VERSION = "1.1.2";

export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: "ok",
      version: VERSION,
      uptime: Math.floor((Date.now() - BOOT_TIME) / 1000),
      ts: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}
