/**
 * Lightweight markdown helpers used by content pages that need full control
 * over how code blocks are rendered (posts, snippets, digital assets).
 *
 * The splitter only understands fenced code blocks; everything between fences
 * is treated as "prose" and rendered by `renderProse` (a safe subset of
 * markdown: headings, paragraphs, lists — including nested lists — tables,
 * blockquotes, hr, and inline formatting).
 *
 * Heading levels: the page <h1> belongs to the post/asset title, so article
 * bodies must never emit one. Call `normalizeBodyHeadings(body)` once per body
 * and hand the result to `splitBody` / `extractHeadings` / `renderProse`: it
 * rewrites every heading to its final level, so the render and the table of
 * contents can never disagree about which sections exist or how they nest.
 */

export interface ProseSegment {
  type: "prose";
  markdown: string;
}

export interface CodeSegment {
  type: "code";
  lang: string;
  code: string;
  /** The section heading (h2 / h3) this block belongs to, if any. */
  label?: string;
}

export type BodySegment = ProseSegment | CodeSegment;

/** A heading as authored in the raw body, before normalization. */
interface RawHeading {
  /** Index of the heading line inside the body. */
  line: number;
  level: number;
  text: string;
}

const HEADING_RE = /^(#{1,6})\s+(.+)$/;
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;

/**
 * Rewrite every heading of a raw body to its final level so the rest of the
 * pipeline never has to guess. Two authoring styles are supported:
 *
 *  - `##` sections / `###` sub-sections (the convention used by the posts and
 *    snippets in this repo) — kept as-is.
 *  - `#` sections with the stored document title as the body's first line
 *    (legacy posts) — the title line is dropped and everything below shifts
 *    down one level.
 *
 * Either way the shallowest remaining level becomes h2, so sections always
 * render as h2 and their sub-sections as h3, and a body can never emit an h1.
 * Headings placed before the first section-level heading (the preamble, e.g. an
 * opening question) are promoted to that same level: they are top-level
 * sections of their own, not orphans of the title.
 */
export function normalizeBodyHeadings(body: string): string {
  const lines = body.split(/\r?\n/);
  const headings: RawHeading[] = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = line.match(HEADING_RE);
    if (match) headings.push({ line: i, level: match[1].length, text: match[2].trim() });
  }

  if (headings.length === 0) return body;

  // The stored title: a `#` heading that opens the body (only blank lines and
  // HTML comments before it). It duplicates the page <h1>, so it is dropped.
  const title = headings[0];
  const prefix = lines.slice(0, title.line).join("\n").replace(HTML_COMMENT_RE, "");
  const isStoredTitle = title.level === 1 && prefix.trim() === "";
  const remaining = isStoredTitle ? headings.slice(1) : headings;

  const out = [...lines];
  if (isStoredTitle) out[title.line] = "";
  if (remaining.length === 0) return out.join("\n");

  // Shift so the shallowest remaining level lands on h2.
  const base = Math.min(...remaining.map((heading) => heading.level));
  const shift = Math.max(0, 2 - base);
  const firstSection = remaining.find((heading) => heading.level === base)!;

  for (const heading of remaining) {
    let level = heading.level + shift;
    // Preamble headings belong to no section, so promote them one step.
    if (heading.line < firstSection.line) level -= 1;
    level = Math.max(2, Math.min(6, level));
    out[heading.line] = `${"#".repeat(level)} ${heading.text}`;
  }

  return out.join("\n");
}

/**
 * Split a raw markdown body into alternating prose / code segments.
 * Fenced blocks (```lang ... ```) become `code` segments; the rest is `prose`.
 */
export function splitBody(body: string): BodySegment[] {
  const segments: BodySegment[] = [];
  const lines = body.split(/\r?\n/);
  let prose: string[] = [];
  let currentLabel = "";

  const flushProse = () => {
    if (prose.length > 0) {
      segments.push({ type: "prose", markdown: prose.join("\n") });
      prose = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```([a-zA-Z0-9_+-]*)\s*$/);
    if (fence) {
      flushProse();
      const lang = fence[1] || "";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      segments.push({
        type: "code",
        lang,
        code: codeLines.join("\n"),
        label: currentLabel || undefined,
      });
      currentLabel = "";
    } else {
      const heading = line.match(HEADING_RE);
      if (heading) {
        // Track the section heading for code-block labels (labels exist for
        // the h2 / h3 sections a code block can live under).
        const level = heading[1].length;
        if (level === 2 || level === 3) currentLabel = heading[2].trim();
      }
      prose.push(line);
      i++;
    }
  }
  flushProse();
  return segments;
}

/* ------------------------------------------------------------------ */
/* Headings                                                            */
/* ------------------------------------------------------------------ */

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

export interface TocNode {
  heading: Heading;
  children: TocNode[];
}

/**
 * Build a nested tree from a flat heading list: each heading becomes a child
 * of the closest preceding heading with a smaller depth. Headings with no
 * possible parent are promoted to top level, so documents that only use one
 * heading level still render as a flat list.
 */
export function buildHeadingTree(headings: Heading[]): TocNode[] {
  const roots: TocNode[] = [];
  // Stack of (depth -> node) pairs; depths are strictly increasing.
  const stack: { depth: number; node: TocNode }[] = [];

  for (const heading of headings) {
    const node: TocNode = { heading, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }
    if (stack.length > 0) {
      stack[stack.length - 1].node.children.push(node);
    } else {
      roots.push(node);
    }
    stack.push({ depth: heading.depth, node });
  }

  return roots;
}

/** GitHub-style slug used for heading anchors (keeps unicode letters). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Extract headings from a *normalized* body (for table of contents), using the
 * final heading levels produced by `normalizeBodyHeadings`. Skipping the
 * normalization step would desync the anchors from `renderProse`.
 */
export function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  // Skip lines inside fenced code blocks so `# comments` in bash/js snippets
  // are never mistaken for markdown headings.
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = line.match(HEADING_RE);
    if (!match) continue;
    const text = match[2].trim();
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headings.push({
      depth: Math.min(6, match[1].length),
      text,
      slug: count === 0 ? base : `${base}-${count + 1}`,
    });
  }
  return headings;
}

/* ------------------------------------------------------------------ */
/* Prose rendering                                                     */
/* ------------------------------------------------------------------ */

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Apply inline markdown (images, links, `code`, **bold**, *italic*) to escaped text. */
function inline(raw: string): string {
  let html = escapeHtml(raw.trim());

  // Images first (they share the [label](url) shape with links).
  html = html.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    '<img src="$2" alt="$1" loading="lazy" />',
  );

  // Inline code first: park the content in placeholders so bold/italic/link
  // regexes never touch it.
  const codeSpans: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_m, code) => {
    codeSpans.push(code);
    return `\u0000${codeSpans.length - 1}\u0000`;
  });

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  // Underscore emphasis — word-boundary guarded so identifiers like
  // `use_debounce_hook` or file names are never italicized.
  html = html.replace(/(?<!\w)_([^_\s][^_]*)_(?!\w)/g, "<em>$1</em>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  html = html.replace(/\u0000(\d+)\u0000/g, (_m, idx) => {
    const code = codeSpans[Number(idx)] ?? "";
    return `<code>${escapeHtml(code)}</code>`;
  });

  return html;
}

/* ------------------------------------------------------------------ */
/* Lists (including nested lists)                                      */
/* ------------------------------------------------------------------ */

interface ListItem {
  ordered: boolean;
  content: string;
  children: ListItem[];
}

function parseList(lines: string[]): ListItem[] {
  const roots: ListItem[] = [];
  const stack: { indent: number; list: ListItem[] }[] = [];

  for (const raw of lines) {
    const indent = (raw.match(/^\s*/)?.[0] ?? "").replace(/\t/g, "  ").length;
    const trimmed = raw.trim();
    const match = trimmed.match(/^(\d+\.|[-*+])\s+(.*)$/);
    if (!match) continue;

    const ordered = /^\d+\./.test(match[1]);
    const item: ListItem = { ordered, content: match[2], children: [] };

    while (stack.length > 0 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    if (stack.length > 0) {
      stack[stack.length - 1].list.push(item);
    } else {
      roots.push(item);
    }
    stack.push({ indent, list: item.children });
  }

  return roots;
}

function renderListItems(items: ListItem[]): string {
  if (items.length === 0) return "";
  const tag = items[0].ordered ? "ol" : "ul";
  return `<${tag}>${items
    .map((item) => {
      const children = renderListItems(item.children);
      return `<li>${inline(item.content)}${children}</li>`;
    })
    .join("")}</${tag}>`;
}

function renderList(lines: string[]): string {
  return renderListItems(parseList(lines));
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

function renderTable(lines: string[]): string {
  const rows = lines.map((line) =>
    line
      .replace(/^\s*\|/, "")
      .replace(/\|\s*$/, "")
      .split("|")
      .map((cell) => cell.trim()),
  );

  const isSeparator = (cells: string[]) =>
    cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell));

  const header = rows[0] ?? [];
  const bodyRows = rows
    .slice(1)
    .filter((cells) => cells.length > 0 && !isSeparator(cells));

  const renderCells = (cells: string[], tag: "th" | "td") =>
    cells.map((cell) => `<${tag}>${inline(cell)}</${tag}>`).join("");

  const head =
    header.length > 0 ? `<thead><tr>${renderCells(header, "th")}</tr></thead>` : "";
  const body =
    bodyRows.length > 0
      ? `<tbody>${bodyRows
          .map((cells) => `<tr>${renderCells(cells, "td")}</tr>`)
          .join("")}</tbody>`
      : "";

  return `<div class="prose-table-wrap"><table>${head}${body}</table></div>`;
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

function renderBlock(lines: string[]): string {
  const first = lines[0];

  if (/^---+$/.test(first) || /^\*\*\*+$/.test(first)) return "<hr />";

  const heading = first.match(HEADING_RE);
  if (heading) {
    // Levels are already final (normalizeBodyHeadings); the clamp keeps the
    // body from ever emitting an h1 even on unnormalized input.
    const level = Math.min(6, Math.max(2, heading[1].length));
    const text = heading[2].trim();
    const id = slugify(text);
    return `<h${level} id="${id}">${inline(text)}</h${level}>`;
  }

  if (first.startsWith(">")) {
    const content = lines.map((line) => line.replace(/^>\s?/, "")).join(" ");
    return `<blockquote>${inline(content)}</blockquote>`;
  }

  if (/^\s*\|/.test(first)) return renderTable(lines);

  if (/^([-*+]|\d+\.)\s+/.test(first)) return renderList(lines);

  return `<p>${inline(lines.join(" "))}</p>`;
}

/**
 * Render a prose segment into safe HTML. Heading levels are used as-is, so the
 * segment must come from a body passed through `normalizeBodyHeadings`.
 */
export function renderProse(markdown: string): string {
  // Drop HTML comments (e.g. leftover duplicated frontmatter blocks) so they
  // never leak into the rendered prose.
  const cleaned = markdown.replace(/<!--[\s\S]*?-->/g, "");
  const lines = cleaned.split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] = [];
  let currentType: string | null = null;

  const classify = (t: string): string =>
    HEADING_RE.test(t)
      ? "heading"
      : /^---+$/.test(t) || /^\*\*\*+$/.test(t)
        ? "hr"
        : /^>\s?/.test(t)
          ? "quote"
          : /^\s*\|/.test(t)
            ? "table"
            : /^([-*+]|\d+\.)\s+/.test(t)
              ? "list"
              : "para";

  const flush = () => {
    if (current.length > 0) {
      blocks.push(current);
      current = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      flush();
      currentType = null;
      continue;
    }
    const type = classify(trimmed);
    if (currentType === null || type !== currentType || type === "heading" || type === "hr") {
      flush();
      currentType = type;
    }
    current.push(line);
  }
  flush();

  return blocks.map((block) => renderBlock(block)).join("\n");
}
