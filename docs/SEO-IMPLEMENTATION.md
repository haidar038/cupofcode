# SEO Implementation

## Entity model

Cup of Code is the publication and organization entity. Haidar is the editorial author entity used by article structured data.

- Organization: `https://cupofcode.cc/#organization`
- Website: `https://cupofcode.cc/#website`
- Author: `https://cupofcode.cc/#haidar`
- Author profile: `/about#author`

Do not add credentials, external profiles, dates, statistics, or claims unless they are fact-checked and visible in the content.

## Indexable URL policy

Indexable URLs:

- `/`
- `/posts`
- `/posts/tutorial`
- `/posts/tips-trik`
- `/posts/<slug>`
- `/assets`
- `/assets/<slug>`
- `/snippets`
- `/snippets/<slug>`
- `/about`, `/contact`, and valid legal pages

Non-primary variants use `noindex,follow`:

- `/posts?cat=<category>`
- listing pages with `?page=<number>`
- other query-based filter variants

The old query category URLs remain available for compatibility, but clean category routes are the canonical editorial landing pages.

## Structured data

The shared layout emits the organization graph containing `WebSite`, `Organization`, and `Person` entities. Detail pages add their relevant entity:

- Articles: `BlogPosting`
- Snippets: `TechArticle`
- Component assets: `SoftwareSourceCode`
- Other assets: `CreativeWork`
- Category pages: `CollectionPage` with `ItemList`
- Detail/category navigation: `BreadcrumbList`

Structured data must describe visible page content. Do not add FAQ, review, product, or event markup without corresponding visible content.

## Editorial publishing checklist

1. Use a descriptive title and a specific description that matches the page.
2. Assign the correct category and topic relationship.
3. Add a real featured image and descriptive alt text where applicable.
4. Verify author, publish date, and claims.
5. Test code examples and remove UI artifacts from rendered prose.
6. Add at least one useful internal link to related content when relevant.
7. Check the canonical URL and structured data in rendered source.
8. Do not publish repeated placeholder pages or mass-generated pages without user value.

## Validation

Run locally:

```powershell
npx astro check
npm run build
```

Then inspect representative routes:

- `/`
- `/posts/tutorial`
- `/posts/<slug>`
- `/assets/<slug>`
- `/snippets/<slug>`
- `/posts?cat=tutorial`
- `/sitemap-index.xml`
- `/robots.txt`
- `/rss.xml`

After deployment, validate representative URLs with Google Rich Results Test, Schema Markup Validator, and Google Search Console. Submit `/sitemap-index.xml` in Search Console.
