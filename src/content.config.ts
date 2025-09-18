import { glob, file } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
})

const photos = defineCollection({
  loader: glob({ base: './src/content/photos', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      altText: z.string(),
      file: image(),
      thumbnail: image(),
      title: z.string(),
      description: z.string(),
      format: z.string(),
      collectionIndex: z.number(),
      categoryIndex: z.number(),
      imageIndex: z.number(),
      aspectRatio: z.enum(['1:1', '3:2', '16:9']),
    }),
})

export const collections = { blog, photos }
