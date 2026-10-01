import { useEffect, useRef, useState } from "react";
import { ArrowUp, List, X } from "lucide-react";

export interface TocHeading {
  slug: string;
  text: string;
  depth: number;
}

// Mobile floating ToC (opsi 2): satu dock kanan bawah yang berbagi slot
// dengan tombol back-to-top. Di posisi teratas tombol ToC menempati slot
// utama; setelah user scroll, ToC naik dan tombol top fade-in di bawahnya.
export default function FloatingDock({ headings }: { headings: TocHeading[] }) {
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(headings[0]?.slug ?? "");
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf !== 0) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setShowTop(window.scrollY > 300);
        const marker = window.scrollY + window.innerHeight * 0.35;
        let current = headings[0]?.slug ?? "";
        for (const h of headings) {
          const el = document.getElementById(h.slug);
          if (el && el.getBoundingClientRect().top + window.scrollY <= marker) current = h.slug;
        }
        setActiveId((prev) => {
          if (prev !== current && panelRef.current) {
            const link = panelRef.current.querySelector<HTMLElement>(`[data-mtoc-link="${current}"]`);
            if (link) {
              const panelRect = panelRef.current.getBoundingClientRect();
              const linkRect = link.getBoundingClientRect();
              if (linkRect.top < panelRect.top) {
                panelRef.current.scrollTop -= panelRect.top - linkRect.top + 8;
              } else if (linkRect.bottom > panelRect.bottom) {
                panelRef.current.scrollTop += linkRect.bottom - panelRect.bottom + 8;
              }
            }
          }
          return current;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== 0) window.cancelAnimationFrame(raf);
    };
  }, [headings]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open ]);

  if (headings.length === 0) return null;

  const goTo = (slug: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Tutup daftar isi"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/20 lg:hidden"
        />
      )}

      <div
        id="mobile-toc-panel"
        role="dialog"
        aria-label="Daftar isi"
        aria-hidden={!open}
        className={`fixed z-50 transition-all duration-300 lg:hidden right-4 sm:right-6 left-4 sm:left-auto sm:w-80 ${
          showTop ? "bottom-32" : "bottom-20"
        } ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <div className="overflow-hidden rounded-2xl border border-coc-line bg-coc-surface shadow-xl">
          <p className="border-b border-coc-line px-4 py-3 text-sm font-bold uppercase tracking-wider text-coc-text">
            Daftar Isi
          </p>
          <nav
            ref={panelRef}
            aria-label="Daftar isi"
            className="max-h-[55dvh] overflow-y-auto overscroll-contain p-2"
          >
            <ul className="space-y-1">
              {headings.map((h) => (
                <li key={h.slug}>
                  <a
                    href={`#${h.slug}`}
                    data-mtoc-link={h.slug}
                    onClick={goTo(h.slug)}
                    aria-current={activeId === h.slug ? "true" : undefined}
                    className={`flex rounded-lg px-2 py-1 text-sm leading-6 transition-colors hover:bg-coc-line-light hover:text-coc-text ${
                      activeId === h.slug ? "font-bold text-coc-text" : ""
                    } ${h.depth > 2 ? "ml-5 text-coc-muted" : "font-medium text-coc-text"}`}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-toc-panel"
        aria-label={open ? "Tutup daftar isi" : "Buka daftar isi"}
        className={`fixed right-6 z-50 flex size-11 items-center justify-center rounded-full bg-coc-dark text-coc-bg shadow-lg transition-all duration-300 hover:scale-105 lg:hidden ${
          showTop ? "bottom-[4.75rem]" : "bottom-6"
        }`}
      >
        {open ? <X width="20" height="20" /> : <List width="20" height="20" />}
      </button>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Kembali ke atas"
        className={`fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-full bg-coc-dark text-coc-bg shadow-lg transition-all duration-300 hover:scale-105 lg:hidden ${
          showTop && !open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp width="20" height="20" />
      </button>
    </>
  );
}
