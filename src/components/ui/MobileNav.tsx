import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Artikel", href: "/posts" },
  { label: "Aset Digital", href: "/assets" },
  { label: "Snippets", href: "/snippets" },
  { label: "Tentang", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-coc-line"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
      >
        {open ? <X width="22" height="22" /> : <Menu width="22" height="22" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-[73px] z-40 bg-coc-bg">
          <nav className="flex flex-col gap-2 px-4 py-6" aria-label="Navigasi mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-5 py-4 text-lg font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-[#ffbb000a] text-coc-accent font-bold"
                    : "text-coc-muted hover:bg-coc-surface hover:text-coc-text"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
