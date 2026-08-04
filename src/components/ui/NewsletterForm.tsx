import { useState, type FormEvent } from "react";
import { Mail, Check, Loader } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
        // F-3 Analytics: Track event registration successful
        if (typeof window !== "undefined" && typeof (window as any).plausible !== "undefined") {
          (window as any).plausible("newsletter_signup");
        }
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Terjadi kesalahan. Coba lagi nanti.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-10 w-full items-center gap-2 rounded-full border border-coc-accent/20 bg-coc-surface/10 p-2 transition focus-within:border-coc-accent focus-within:bg-coc-accent/5 sm:h-auto">
      <label className="sr-only" htmlFor="footer-email">Email</label>
      <input
        id="footer-email"
        className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-coc-text outline-none placeholder:text-coc-muted-soft"
        type="email"
        placeholder="Masukkan email kamu..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading" || status === "success"}
        required
      />
      <button
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-coc-accent font-bold text-coc-text transition hover:scale-105 hover:bg-[#e6a800] sm:size-9"
        type="submit"
        disabled={status === "loading" || status === "success"}
        aria-label="Berlangganan"
      >
        {status === "loading" ? (
          <Loader width="20" height="20" className="animate-spin" />
        ) : status === "success" ? (
          <Check width="20" height="20" />
        ) : (
          <Mail width="20" height="20" />
        )}
      </button>
    </form>
  );
}
