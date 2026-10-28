import type { APIRoute } from "astro";
import * as Sentry from "@sentry/astro";
import { getClientIp, json, parseRateLimit, rateLimit } from "../../lib/http";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RESEND_CONTACTS_ENDPOINT = "https://api.resend.com/contacts";

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

    // Rate limit newsletter: default 1/minute per IP (env NEWSLETTER_RATE_LIMIT)
    const { limit, windowMs } = parseRateLimit(import.meta.env.NEWSLETTER_RATE_LIMIT, {
      limit: 1,
      windowMs: 60_000,
    });
    if (!(await rateLimit(`newsletter:${ip}`, limit, windowMs))) {
      return json({ success: false, message: "Terlalu banyak request." }, 429);
    }

    // Mock Mode jika env tidak setup
    if (!resendApiKey) {
      console.log(`[Newsletter] API Key belum aktif: ${email} pada IP ${ip}`);
      return json({ success: true, message: "Registrasi sukses (Mock)." }, 200);
    }

    // Simpan subscriber ke Resend Audience agar ada mailing list yang
    // persisten (sebelumnya email welcome dikirim tanpa menyimpan alamat).
    // Duplikat dianggap sukses; kegagalan lain non-blocking — welcome email
    // tetap terkirim dan error dicatat ke Sentry.
    const audienceId = import.meta.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      try {
        const contactResp = await fetch(RESEND_CONTACTS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({ email, audience_id: audienceId, unsubscribed: false }),
        });
        if (!contactResp.ok) {
          const contactErr = await contactResp.text();
          if (contactResp.status === 409 || /already (exists|subscribed)/i.test(contactErr)) {
            // Sudah terdaftar — bukan error.
          } else {
            Sentry.captureException(
              new Error(`Resend Contacts Error ${contactResp.status}: ${contactErr}`),
            );
          }
        }
      } catch (contactErr) {
        Sentry.captureException(contactErr);
      }
    } else {
      console.warn(
        "[Newsletter] RESEND_AUDIENCE_ID tidak diset — subscriber tidak disimpan ke Audience.",
      );
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
