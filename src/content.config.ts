import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const changelog = defineCollection({
	loader: glob({ base: './src/content/changelog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		ver: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

export const collections = { changelog };