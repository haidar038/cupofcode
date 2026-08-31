import type { APIRoute } from "astro";
import * as Sentry from "@sentry/astro";

const ALLOWED_SUBJECTS = ["diskusi", "kerjasama", "lainnya"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Cache-Control": "no-store", "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, subject, message, website } = body as Record<string, string>;

    // Anti-bot honeypot
    if (website && website.trim().length > 0) {
      return json({ success: true, message: "Pesan terkirim." }, 200);
    }

    const cleanName = name?.toString().trim();
    const cleanEmail = email?.toString().trim();
    const cleanSubject = subject?.toString().trim();
    const cleanMessage = message?.toString().trim();

    // Validasi fields
    if (!cleanName || cleanName.length > 100) return json({ success: false, message: "Nama tidak valid." }, 400);
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) return json({ success: false, message: "Email tidak valid." }, 400);
    if (!cleanSubject || !ALLOWED_SUBJECTS.includes(cleanSubject as any)) return json({ success: false, message: "Subjek tidak valid." }, 400);
    if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 5000) return json({ success: false, message: "Pesan tidak valid." }, 400);

    const ip = getClientIp(request);

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const emailFrom = import.meta.env.EMAIL_FROM ?? "Cup of Code <hello@cupofcode.cc>";
    const emailAdmin = import.meta.env.EMAIL_ADMIN ?? "admin@cupofcode.cc";

    // Rate limit contact: 5 reqs/hour
    if (!rateLimit(`contact:${ip}`, 5, 3_600_000)) {
      return json({ success: false, message: "Jumlah pengiriman terlalu banyak." }, 429);
    }

    if (!resendApiKey) {
      console.log(`[Contact] Mock process: ${cleanEmail} by IP: ${ip}`);
      return json({ success: true, message: `Halo ${cleanName}! Mock success.` }, 200);
    }

    const payload = {
      from: emailFrom,
      to: cleanEmail,
      reply_to: emailAdmin,
      subject: "Kami terima pesanmu 🙌",
      html: `<p>Halo ${cleanName},</p><p>Pesan kamu sudah kami teruskan, kami akan balas secepatnya.</p>`,
    };

    await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    return json({ success: true, message: "Pesan berhasil dikirim." }, 200);
  } catch (err) {
    console.error("[Contact] Exception:", err);
    Sentry.captureException(err);
    return json({ success: false, message: "Terjadi kesalahan koneksi." }, 500);
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
