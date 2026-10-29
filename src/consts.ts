export const SITE_TITLE = 'cup of code';

// Title homepage deskriptif (audit SEO 2026-10-29 F-01: title hanya 'cup of
// code', 11 chars). SITE_TITLE tetap dipakai sebagai og:site_name / brand.
export const HOME_TITLE = 'Cup of Code | Belajar Coding, Web Development, UI/UX & AI';

export const SITE_DESCRIPTION =
	'Belajar coding, web development, UI/UX, dan AI lewat tutorial praktis, panduan teknologi, code snippets, serta aset digital gratis untuk developer.';

// Single source of truth — sinkron dengan `version` di package.json.
export const SITE_VERSION = '1.3.0';

export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://cupofcode.cc';
export const SITE_AUTHOR = 'cup of code';
export const SITE_LOCALE = 'id_ID';
export const TWITTER_HANDLE = '@cupofcode';

export const DEFAULT_OG_IMAGE =
	'https://res.cloudinary.com/dpthmmblu/image/upload/v1790869824/OpenGraph_ejkt1k.webp';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;