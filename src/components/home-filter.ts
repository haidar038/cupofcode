/**
 * Homepage sidebar filter — re-renders the posts list in place (no navigation).
 *
 * Clicking a filter debounces the fetch to `/api/catalog` and swaps the grid
 * content. Non-article filters (assets) render compact cards without
 * thumbnails.
 */

interface CatalogItem {
  title: string;
  description: string;
  url: string;
  badge?: string;
  tone?: string;
  image?: string | null;
  date?: string | null;
  meta?: string;
}

interface CatalogResponse {
  contentType: "posts" | "assets";
  total: number;
  items: CatalogItem[];
}

const COPY_ICON =
  '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';

const DOWNLOAD_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>';

const el = <T extends HTMLElement>(tag: string, className: string, text?: string): T => {
  const node = document.createElement(tag) as T;
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const link = (href: string, className: string, children: Node[]): HTMLAnchorElement => {
  const a = el<HTMLAnchorElement>("a", className);
  a.href = href;
  children.forEach((c) => a.appendChild(c));
  return a;
};

function postCard(item: CatalogItem): HTMLElement {
  const tone = item.tone && ["yellow", "green", "pink"].includes(item.tone) ? item.tone : "yellow";
  const article = el<HTMLElement>("article", "flex flex-col items-start gap-5 transition hover:-translate-y-0.5");

  const media = el<HTMLElement>("a", "flex aspect-391/249 w-full items-center justify-center overflow-hidden rounded-3xl bg-[#d9d9d9] text-[#aaa] transition duration-200 hover:scale-[1.02]");
  media.setAttribute("aria-label", `Baca artikel ${item.title}`);
  media.setAttribute("title", item.title);
  media.setAttribute("href", item.url);
  if (item.image) {
    const img = el<HTMLImageElement>("img", "h-full w-full object-cover");
    img.src = item.image;
    img.alt = item.title;
    img.loading = "lazy";
    media.appendChild(img);
  } else {
    media.innerHTML = COPY_ICON;
  }
  article.appendChild(media);

  const body = el<HTMLElement>("div", "flex flex-col items-start gap-3");
  body.appendChild(el<HTMLElement>("span", `rounded-full px-3 py-1 text-xs leading-4 text-[#212121] bg-coc-tag-${tone}`, item.badge ?? "Artikel"));
  const h3 = el<HTMLElement>("h3", "text-xl font-bold leading-7 text-coc-text sm:text-2xl sm:leading-8");
  h3.appendChild(link(item.url, "hover:text-coc-accent", [document.createTextNode(item.title)]));
  body.appendChild(h3);
  if (item.description) {
    body.appendChild(el<HTMLElement>("p", "line-clamp-2 text-base leading-6 text-coc-muted", item.description));
  }
  article.appendChild(body);
  return article;
}

function assetCard(item: CatalogItem): HTMLElement {
  const card = el<HTMLElement>(
    "article",
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-coc-line bg-coc-surface transition-all duration-300",
  );
  const body = el<HTMLElement>("div", "flex grow flex-col p-6");
  body.appendChild(
    el<HTMLElement>("span", "mb-4 inline-flex w-fit rounded-full border border-coc-line bg-coc-bg px-3 py-1 text-xs font-bold text-coc-text", item.badge ?? ""),
  );
  const h3 = el<HTMLElement>("h3", "mb-2 text-xl font-bold leading-snug text-coc-text transition-colors group-hover:text-coc-accent");
  h3.appendChild(link(item.url, "", [document.createTextNode(item.title)]));
  body.appendChild(h3);
  if (item.description) {
    body.appendChild(el<HTMLElement>("p", "mb-6 line-clamp-2 grow text-sm text-coc-muted", item.description));
  }
  const footer = el<HTMLElement>("div", "mt-auto flex items-center justify-between border-t border-coc-line pt-4");
  footer.appendChild(el<HTMLElement>("span", "text-sm font-bold text-green-600", item.meta ?? "Gratis"));
  const go = el<HTMLElement>("a", "flex size-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors group-hover:bg-coc-accent group-hover:text-white");
  go.setAttribute("href", item.url);
  go.setAttribute("aria-label", `Lihat ${item.title}`);
  go.innerHTML = DOWNLOAD_ICON;
  footer.appendChild(go);
  body.appendChild(footer);
  card.appendChild(body);
  return card;
}

function skeletonGrid(count = 6): HTMLElement {
  const grid = el<HTMLElement>("div", "grid gap-10 sm:grid-cols-2 lg:gap-x-14 lg:gap-y-12");
  for (let i = 0; i < count; i++) {
    const card = el<HTMLElement>("div", "flex flex-col items-start gap-5");
    card.appendChild(el<HTMLElement>("div", "skeleton aspect-391/249 w-full rounded-3xl"));
    const text = el<HTMLElement>("div", "w-full space-y-2");
    text.appendChild(el<HTMLElement>("div", "skeleton h-4 w-20 rounded-full"));
    text.appendChild(el<HTMLElement>("div", "skeleton h-6 w-3/4"));
    text.appendChild(el<HTMLElement>("div", "skeleton h-4 w-1/2"));
    card.appendChild(text);
    grid.appendChild(card);
  }
  return grid;
}

function errorState(): HTMLElement {
  const wrap = el<HTMLElement>("div", "flex flex-col items-center justify-center rounded-3xl border border-coc-line bg-coc-surface px-6 py-14 text-center");
  wrap.appendChild(el<HTMLElement>("p", "mb-3 text-lg font-bold text-coc-text", "Terjadi kesalahan"));
  wrap.appendChild(el<HTMLElement>("p", "mb-6 max-w-sm text-sm text-coc-muted", "Gagal memuat hasil filter. Periksa koneksi kamu lalu coba lagi."));
  const retry = el<HTMLButtonElement>("button", "rounded-full bg-coc-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black", "Coba Lagi");
  retry.type = "button";
  wrap.appendChild(retry);
  return wrap;
}

export function initHomeFilter() {
  const grid = document.querySelector<HTMLElement>("[data-home-grid]");
  if (!grid) return;
  const gridWithFlag = grid as HTMLElement & { __homeFilterInit?: boolean };
  if (gridWithFlag.__homeFilterInit) return;
  gridWithFlag.__homeFilterInit = true;

  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-filter]"));
  if (buttons.length === 0) return;

  const status = document.querySelector<HTMLElement>("[data-filter-status]");
  const statusName = status?.querySelector<HTMLElement>("[data-filter-name]");
  const statusCount = status?.querySelector<HTMLElement>("[data-filter-count]");
  const reset = status?.querySelector<HTMLButtonElement>("[data-filter-reset]");
  const assetsLink = status?.querySelector<HTMLElement>("[data-filter-assets-link]");
  const hero = document.querySelector<HTMLElement>("[data-home-featured]");

  let debounceTimer: number | undefined;
  let requestSeq = 0;
  let activeFilter = "all";

  const render = (data: CatalogResponse) => {
    grid.textContent = "";
    if (data.items.length === 0) {
      const empty = el<HTMLElement>("div", "flex flex-col items-center justify-center rounded-3xl border border-coc-line bg-coc-surface px-6 py-14 text-center");
      empty.appendChild(el<HTMLElement>("p", "text-lg font-semibold text-coc-text", "Belum ada konten untuk filter ini."));
      empty.appendChild(el<HTMLElement>("p", "mt-2 max-w-sm text-sm text-coc-muted", "Coba pilih kategori lain atau lihat semua artikel."));
      grid.appendChild(empty);
    } else {
      const list = el<HTMLElement>("div", "grid gap-10 sm:grid-cols-2 lg:gap-x-14 lg:gap-y-12");
      data.items.forEach((item) => {
        list.appendChild(data.contentType === "assets" ? assetCard(item) : postCard(item));
      });
      grid.appendChild(list);
    }
  };

  const showError = () => {
    grid.textContent = "";
    const err = errorState();
    grid.appendChild(err);
    err.querySelector("button")?.addEventListener("click", () => {
      void load(activeFilter);
    });
  };

  const updateStatus = (name: string, total: number, isActive: boolean, cat: string) => {
    if (!status) return;
    if (!isActive) {
      status.classList.add("hidden");
      return;
    }
    status.classList.remove("hidden");
    if (statusName) statusName.textContent = name;
    if (statusCount) statusCount.textContent = String(total);
    if (assetsLink) assetsLink.classList.toggle("hidden", cat !== "assets");
  };

  const filterName = (cat: string): string => {
    const btn = buttons.find((b) => b.dataset.filter === cat);
    return btn?.dataset.name ?? (cat === "all" ? "Semua Artikel" : cat);
  };

  const load = async (cat: string) => {
    const seq = ++requestSeq;
    grid.textContent = "";
    grid.appendChild(skeletonGrid());
    try {
      const res = await fetch(`/api/catalog?cat=${encodeURIComponent(cat)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as CatalogResponse;
      // Ignore stale responses — a newer filter selection may be in flight.
      if (seq !== requestSeq) return;
      render(data);
      updateStatus(filterName(cat), data.total, cat !== "all", cat);
    } catch {
      if (seq !== requestSeq) return;
      showError();
      updateStatus(filterName(cat), 0, cat !== "all", cat);
    }
  };

  const setActive = (cat: string) => {
    activeFilter = cat;
    buttons.forEach((btn) => {
      const isActive = btn.dataset.filter === cat;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "true" : "false");
    });
    // Move the featured article out of the way so the filtered results are
    // immediately visible (it comes back when the filter is reset).
    hero?.classList.toggle("hidden", cat !== "all");
  };

  const applyFilter = (cat: string) => {
    setActive(cat);
    // Instant feedback: swap in the skeleton right away, then debounce the
    // actual fetch so rapid clicks don't hammer the API.
    grid.textContent = "";
    grid.appendChild(skeletonGrid());
    if (debounceTimer !== undefined) window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      void load(cat);
    }, 180);
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter ?? "all";
      applyFilter(cat);
    });
  });

  reset?.addEventListener("click", () => {
    const allBtn = buttons.find((b) => b.dataset.filter === "all");
    if (allBtn) {
      applyFilter("all");
      allBtn.scrollIntoView({ block: "nearest" });
    }
  });
}
