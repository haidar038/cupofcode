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
            filter: (page) =>
                !page.includes('/keystatic') && !page.includes('/api/'),
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
