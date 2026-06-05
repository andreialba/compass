import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      category: z.string(),
      tags: z.array(z.string()).optional().default([]),
      status: z.enum(['draft', 'published', 'deprecated', 'archived']).optional(),
      author: z.string().optional(),
      editUrl: z.string().optional(),
      heroImage: image().optional(),
      hideFromSearch: z.boolean().optional().default(false),
      redirectFrom: z.array(z.string()).optional().default([]),
      order: z.number().optional().default(100),
      updatedAt: z.coerce.date().optional(),
    }),
});

export const collections = { docs };
