import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const posts = defineCollection({
	loader: glob({ pattern: "**/*.mdoc", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		category: z.string(),
		description: z.string().optional(),
		publishDate: z.coerce.date().optional(),
		featured_image: z.string().optional(),
		featured: z.boolean().optional(),
	}),
});

const categories = defineCollection({
	loader: glob({ pattern: "**/*.json", base: "./src/content/categories" }),
	schema: z.object({
		label: z.string(),
		tone: z.enum(["yellow", "green", "pink"]),
	}),
});

// Koleksi Snippet (sudah ada di Keystatic, ditambahkan ke Astro)
const snippets = defineCollection({
	loader: glob({ pattern: "**/*.mdoc", base: "./src/content/snippets" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		language: z.enum(["typescript", "javascript", "css", "html"]).default("typescript"),
		featured_image: z.string().optional(),
	}),
});

// Koleksi Baru: Digital Assets (Unified Hub)
const digitalAssets = defineCollection({
	loader: glob({ pattern: "**/*.mdoc", base: "./src/content/digital-assets" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Enum penentu tipe aset
		type: z.enum(["component", "prompt", "gem"]),
		isFree: z.boolean().default(true),

		// Opsional: Bergantung pada tipe aset
		format: z.string().optional(), // Untuk Component (misal: "Tailwind, React")
		fileSize: z.string().optional(), // Untuk Component / Gem (misal: "2.4 MB")
		variables: z.array(z.string()).optional(), // Untuk Prompt (misal: ["Tone", "Topik"])
		featured_image: z.string().optional(),
		// URL/file download asset (dipakai untuk gate premium + tracking event)
		downloadUrl: z
			.string()
			.optional(),
	}),
});

export const collections = { posts, categories, snippets, digitalAssets };