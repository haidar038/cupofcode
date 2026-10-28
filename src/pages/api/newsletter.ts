import type { APIRoute } from "astro";
import * as Sentry from "@sentry/astro";
import { getClientIp, json, rateLimit } from "../../lib/http";

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
      return json({ success: false, message: "Email tidak valid." }, 400);
    }

    // Rate limit newsletter: 1/minute per IP
    if (!rateLimit(`newsletter:${ip}`, 1, 60_000)) {
      return json({ success: false, message: "Terlalu banyak request." }, 429);
    }

    // Mock Mode jika env tidak setup
    if (!resendApiKey) {
      console.log(`[Newsletter] API Key belum aktif: ${email} pada IP ${ip}`);
      return json({ success: true, message: "Registrasi sukses (Mock)." }, 200);
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

    return json({ success: true, message: "Konfirmasi email berhasil dikirim!" }, 200);
  } catch (err) {
    console.error("[Newsletter] Exception:", err);
    Sentry.captureException(err);
    return json({ success: false, message: "Terjadi kesalahan internal." }, 500);
  }
};
