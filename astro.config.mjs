// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    markdown: {
        shikiConfig: {
            theme: 'one-dark-pro',
            wrap: true,
        }
    },
    site: import.meta.env.PUBLIC_SITE_URL || 'https://cupofcode.cc',
    image: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
    },
    integrations: [
        sitemap({
            // Pakai startsWith untuk path prefix yang akurat (avoid false match)
            filter: (page) =>
                !page.startsWith('/keystatic') &&
                !page.startsWith('/api/') &&
                !page.startsWith('/_astro/') &&
                page !== '/404',
            // Serialize callback: tambahkan lastmod, priority, changefreq
            serialize(item) {
                const url = item.url;
                const rawPath = new URL(url).pathname;
                // Normalize trailing slash so '/about' and '/about/' match consistently
                const path = rawPath !== '/' && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;

                // Default values
                let priority = 0.7;
                let changefreq = 'monthly';
                let lastmod = item.lastmod;

                // Homepage: highest priority
                if (path === '/') {
                    priority = 1.0;
                    changefreq = 'weekly';
                }
                // Listing pages
                else if (path === '/posts' || path === '/assets' || path === '/snippets') {
                    priority = 0.8;
                    changefreq = 'weekly';
                }
                // Detail pages (posts/articles) — high value
                else if (path.startsWith('/posts/')) {
                    priority = 0.9;
                    changefreq = 'monthly';
                }
                // Detail pages (assets, snippets) — medium value
                else if (path.startsWith('/assets/') || path.startsWith('/snippets/')) {
                    priority = 0.7;
                    changefreq = 'monthly';
                }
                // Static info pages
                else if (path === '/about' || path === '/contact') {
                    priority = 0.5;
                    changefreq = 'yearly';
                }
                // Legal pages
                else if (path === '/privacy' || path === '/terms') {
                    priority = 0.3;
                    changefreq = 'yearly';
                }

                return /** @type {import('@astrojs/sitemap').SitemapItem} */ ({
                    ...item,
                    url,
                    lastmod,
                    changefreq,
                    priority,
                });
            },
        }),
        react(),
        markdoc(),
        keystatic(),
        sentry({
            project: "javascript-astro",
            org: "cup-of-code-r9",
            authToken: import.meta.env.SENTRY_AUTH_TOKEN || '',
            dsn: import.meta.env.PUBLIC_SENTRY_DSN || '',
            environment: import.meta.env.PUBLIC_SITE_URL?.includes('localhost') ? 'development' : 'production',
            sourceMapsUploadOptions: {
                enabled: import.meta.env.PUBLIC_SENTRY_DSN ? true : false,
            },
        }),
    ],
    adapter: vercel(),
    vite: {
        // Dev-only: allow HMR WebSocket reconnection after a dev-server restart.
        // Vite rotates `webSocketToken` on every server start, so a page that stays
        // open across a restart can never reconnect (400) and misses the reload
        // signal. The page then mixes modules from two optimization runs — two
        // React copies — which breaks every island with "Invalid hook call" /
        // "Cannot read properties of null (reading 'useState')" (see SearchBar).
        legacy: {
            skipWebSocketTokenCheck: true,
        },
        plugins: [tailwindcss()],
        // Required for Sentry sourcemap upload; .map files land in dist/client/_astro/
        build: {
            sourcemap: true,
        },
        define: {
            __SENTRY_DEBUG__: false,
        },
    },
});
