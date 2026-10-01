import { config, fields, collection } from "@keystatic/core";

interface ItemLabelProps {
    value: string;
}

const storageKind = import.meta.env.KEYSTATIC_STORAGE_KIND || "local";

const storage = storageKind === "github"
    ? {
        kind: "github" as const,
        repo: {
            owner: process.env.KEYSTATIC_GITHUB_OWNER || "haidar038",
            name: process.env.KEYSTATIC_GITHUB_REPO || "cupofcode",
        },
    }
    : { kind: "local" as const };

export default config({
    storage,
    collections: {
        posts: collection({
            label: "Posts",
            slugField: "title",
            path: "src/content/posts/*",
            format: { contentField: "content" },
            schema: {
                title: fields.slug({ name: { label: "Title" } }),
                description: fields.text({
                    label: "Description",
                    multiline: true,
                    description: "Ringkasan singkat untuk kartu artikel & meta tag.",
                }),
                category: fields.relationship({
                    label: "Category",
                    collection: "categories",
                    validation: { isRequired: true },
                }),
                publishDate: fields.date({ label: "Publish Date" }),
                featured: fields.checkbox({ label: "Featured Article", defaultValue: false }),
                featured_image: fields.text({ label: "Featured Image URL (optional)" }),
                og_image: fields.text({ label: "OG Image URL (optional, fallback: featured image)" }),
                content: fields.markdoc({ label: "Content" }),
            },
        }),
        categories: collection({
            label: "Categories",
            slugField: "name",
            path: "src/content/categories/*",
            format: { data: "json" },
            schema: {
                name: fields.slug({ name: { label: "Name" } }),
                label: fields.text({ label: "Label" }),
                tone: fields.select({
                    label: "Tone",
                    options: [
                        { label: "Yellow", value: "yellow" },
                        { label: "Green", value: "green" },
                        { label: "Pink", value: "pink" },
                    ],
                    defaultValue: "yellow",
                }),
            },
        }),
        snippets: collection({
            label: 'Snippet Library',
            slugField: 'title',
            path: 'src/content/snippets/*/',
            format: { contentField: 'content' },
            schema: {
                title: fields.text({ label: 'Judul Snippet' }),
                description: fields.text({ label: 'Deskripsi Singkat', validation: { isRequired: true } }),
                language: fields.select({
                    label: 'Bahasa Pemrograman',
                    options: [
                        { label: 'TypeScript', value: 'typescript' },
                        { label: 'JavaScript', value: 'javascript' },
                        { label: 'CSS', value: 'css' },
                        { label: 'HTML', value: 'html' },
                    ],
                    defaultValue: 'typescript',
                }),
                content: fields.markdoc({
                    label: 'Isi Kode & Dokumentasi',
                }),
                og_image: fields.text({ label: 'OG Image URL (Opsional, fallback: default)' }),
            },
        }),
        digitalAssets: collection({
            label: 'Digital Assets',
            slugField: 'title',
            path: 'src/content/digital-assets/*/',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Nama Aset' } }),
                description: fields.text({
                    label: 'Deskripsi Singkat',
                    multiline: true,
                    validation: { isRequired: true }
                }),
                type: fields.select({
                    label: 'Tipe Aset',
                    description: 'Pilih tipe aset untuk mengaktifkan UI yang sesuai di website.',
                    options: [
                        { label: 'UI Component', value: 'component' },
                        { label: 'AI Prompt', value: 'prompt' },
                        { label: 'Custom Gem', value: 'gem' }
                    ],
                    defaultValue: 'component'
                }),
                isFree: fields.checkbox({
                    label: 'Aset Gratis?',
                    defaultValue: true
                }),
                format: fields.text({
                    label: 'Format File (Opsional)',
                    description: 'Khusus UI Component, misal: React + Tailwind, atau Figma'
                }),
                fileSize: fields.text({
                    label: 'Ukuran File (Opsional)',
                    description: 'Misal: 2.5 MB'
                }),
                variables: fields.array(
                    fields.text({ label: 'Nama Variabel' }),
                    {
                        label: 'Variabel Prompt (Opsional)',
                        description: 'Khusus AI Prompt. Masukkan daftar kata kunci yang perlu diisi pengguna. Misal: "Gaya Bahasa"',
                        itemLabel: (props: ItemLabelProps) => props.value
                    }
                ),
                content: fields.markdoc({
                    label: 'Dokumentasi / Instruksi Utama',
                }),
                og_image: fields.text({ label: 'OG Image URL (Opsional, fallback: featured image)' }),
            }
        }),
    },
});
