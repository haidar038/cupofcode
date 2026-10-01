import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_LOCALE, SITE_TITLE, SITE_URL } from "../consts";

export const AUTHOR_NAME = "Haidar";
export const AUTHOR_ROLE = "Founder, Software Developer, dan UI/UX Designer";
export const AUTHOR_BIO =
    "Founder Cup of Code yang menulis tentang software development, UI/UX design, dan AI-assisted development.";
export const AUTHOR_URL = "/about#author";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const AUTHOR_ID = `${SITE_URL}/#haidar`;

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

// OG image resolution for content pages: a custom per-entry `og_image`
// wins, then the entry's featured image, then the global default.
export function resolveOgImage(entry: { og_image?: string; featured_image?: string }): string {
	return entry.og_image || entry.featured_image || DEFAULT_OG_IMAGE;
}

export function buildWebsiteGraph() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": WEBSITE_ID,
                url: absoluteUrl("/"),
                name: SITE_TITLE,
                description: SITE_DESCRIPTION,
                inLanguage: SITE_LOCALE.replace("_", "-"),
                publisher: { "@id": ORGANIZATION_ID },
            },
            {
                "@type": "Organization",
                "@id": ORGANIZATION_ID,
                name: "Cup of Code",
                url: absoluteUrl("/"),
                description:
                    "Publication dan resource gratis tentang software development, UI/UX design, dan AI-assisted development.",
                logo: {
                    "@type": "ImageObject",
                    url: absoluteUrl("/favicon.svg"),
                },
                founder: { "@id": AUTHOR_ID },
                sameAs: [
                    "https://github.com/cupofcode",
                    "https://twitter.com/cupofcode",
                ],
            },
            {
                "@type": "Person",
                "@id": AUTHOR_ID,
                name: AUTHOR_NAME,
                url: absoluteUrl(AUTHOR_URL),
                jobTitle: AUTHOR_ROLE,
                description: AUTHOR_BIO,
                worksFor: { "@id": ORGANIZATION_ID },
            },
        ],
    };
}

export function buildBreadcrumbSchema(
    items: Array<{ name: string; url: string }>,
) {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
