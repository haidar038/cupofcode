// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
    output: 'server',
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
            dsn: import.meta.env.PUBLIC_SENTRY_DSN || '',
            environment: import.meta.env.PUBLIC_SITE_URL?.includes('localhost') ? 'development' : 'production',
            sourceMapsUploadOptions: {
                enabled: import.meta.env.PUBLIC_SENTRY_DSN ? true : false,
            },
        }),
    ],
    adapter: node({
        mode: 'standalone',
    }),
    vite: {
        plugins: [tailwindcss()],
        define: {
            __SENTRY_DEBUG__: false,
        },
    },
});
