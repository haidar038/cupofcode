import type { APIRoute } from "astro";
import * as Sentry from "@sentry/astro";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = body?.email?.toString().trim();
    const ip = getClientIp(request);

    // Env validation
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const emailFrom = import.meta.env.EMAIL_FROM ?? "Cup of Code <newsletter@cupofcode.cc>";

    if (!email || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ success: false, message: "Email tidak valid." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Rate limit newsletter: 1/minute per IP
    if (!rateLimit(`newsletter:${ip}`, 1, 60_000)) {
      return new Response(JSON.stringify({ success: false, message: "Terlalu banyak request." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mock Mode jika env tidak setup
    if (!resendApiKey) {
      console.log(`[Newsletter] API Key belum aktif: ${email} pada IP ${ip}`);
      return new Response(JSON.stringify({ success: true, message: "Registrasi sukses (Mock)." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = {
      from: emailFrom,
      to: email,
      subject: "Selamat Datang di Cup of Code! 🎉",
      html: `
        <!doctype html>
        <html>
          <body>
            <p>Halo! Kau baru saja mengaktifkan langganan di cupofcode.cc</p>
            <p>Terima kasih!</p>
          </body>
        </html>`,
    };

    const resp = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      Sentry.captureException(new Error(`Resend Error ${resp.status}: ${errText}`));
      throw new Error(`Gagal kirim email penyedia: ${errText}`);
    }

    return new Response(JSON.stringify({ success: true, message: "Konfirmasi email berhasil dikirim!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Newsletter] Exception:", err);
    Sentry.captureException(err);
    return new Response(JSON.stringify({ success: false, message: "Terjadi kesalahan internal." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const store = (globalThis as any).__rateLimitStore ??= new Map();
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

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
