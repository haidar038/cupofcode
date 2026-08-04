import { useState, useMemo, useRef, useEffect, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";

export interface SearchItem {
  title: string;
  description?: string;
  url: string;
  category?: string;
}

interface Props {
  items: SearchItem[];
  placeholder?: string;
}

export default function SearchBar({ items, placeholder = "Cari..." }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)),
    ).slice(0, 10);
  }, [query, items]);

  const close = () => {
    setFocused(false);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      window.location.href = results[selectedIndex].url;
    } else if (e.key === "Escape") {
      close();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 rounded-full border border-coc-line bg-coc-surface px-4 py-3 text-coc-soft transition focus-within:border-coc-accent focus-within:ring-4 focus-within:ring-[#ffbb0014]">
        <Search width="20" height="20" className="shrink-0" />
        <input
          ref={inputRef}
          className="min-w-0 flex-1 bg-transparent text-base leading-6 text-coc-text outline-none placeholder:text-coc-soft"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          aria-label={placeholder}
          aria-expanded={focused && results.length > 0}
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="shrink-0 rounded-full p-1 transition-colors hover:bg-coc-line hover:text-coc-text"
            aria-label="Hapus pencarian"
          >
            <X width="16" height="16" />
          </button>
        )}
      </div>

      {focused && query.trim() && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-coc-line bg-coc-surface shadow-lg"
          role="listbox"
        >
          {results.length > 0 ? (
            results.map((item, i) => (
              <a
                key={item.url}
                href={item.url}
                role="option"
                aria-selected={i === selectedIndex}
                className={`block border-b border-coc-line px-5 py-4 last:border-0 transition-colors ${
                  i === selectedIndex
                    ? "bg-[#ffbb000a] text-coc-text"
                    : "text-coc-muted hover:bg-[#ffbb0005] hover:text-coc-text"
                }`}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-coc-text">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-0.5 truncate text-xs text-coc-muted">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.category && (
                    <span className="shrink-0 rounded-full bg-coc-tag-yellow px-2 py-0.5 text-[10px] font-medium text-[#212121]">
                      {item.category}
                    </span>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className="px-5 py-8 text-center text-sm text-coc-muted">
              Tidak ada hasil untuk "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
