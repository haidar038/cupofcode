/**
 * Build-time Shiki syntax highlighting.
 *
 * `astro.config.mjs` configures Shiki (`markdown.shikiConfig`) with the
 * `one-dark-pro` theme for Markdown-rendered pages. Markdoc-rendered content
 * (posts / snippets / digital assets) does not go through that pipeline, so
 * these pages render code blocks through our own viewer — and this helper is
 * what gives those blocks the same Shiki token colors.
 *
 * Everything here runs at build time (SSR/prerender), so no Shiki runtime is
 * shipped to the browser.
 */

import { createHighlighter } from "shiki";

export const CODE_THEME = "one-dark-pro";
export const CODE_BG = "#282c34";

/** Languages used by the content plus a useful default spread. */
const LANGS = [
  "typescript",
  "javascript",
  "tsx",
  "jsx",
  "bash",
  "shell",
  "css",
  "html",
  "json",
  "yaml",
  "markdown",
  "md",
  "python",
  "sql",
];

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({ themes: [CODE_THEME], langs: LANGS });
  }
  return highlighter;
}

/**
 * Highlight `code` and return one HTML string per line (the token markup for
 * that line, without the wrapping `<span class="line">`). Returns `null` when
 * the language is unknown or highlighting fails, so callers can fall back to
 * plain escaped text.
 */
export async function highlightCodeLines(
  code: string,
  lang?: string,
): Promise<string[] | null> {
  const trimmed = code.replace(/\n$/, "");
  if (!trimmed) return null;

  const hi = await getHighlighter();
  const language = lang && lang !== "" ? lang : "text";

  let html: string;
  try {
    html = hi.codeToHtml(trimmed, { lang: language, theme: CODE_THEME });
  } catch {
    return null;
  }

  const match = html.match(/<code>([\s\S]*)<\/code>/);
  if (!match) return null;

  return match[1]
    .split(/(?=<span class="line")/)
    .map((part) =>
      part
        .replace(/^<span class="line">/, "")
        .replace(/<\/span>\s*$/, "")
        .replace(/<span class="line"><\/span>/, ""),
    );
}
